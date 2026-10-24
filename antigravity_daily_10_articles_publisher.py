#!/usr/bin/env python3
"""
Google Antigravity Daily 10-Article Automated Publisher (with Native Sanity.io CMS Integration)
===============================================================================================
Reads `fitness_articles_1000_plus_dataset.json`, tracks published article IDs
in persistent storage (`ANTIGRAVITY_EXECUTABLE_DATA_DIR`), selects 10 unpublished
articles each day (1 per category across all 10 categories or sequentially),
generates full SEO-optimized Markdown articles via Gemini API or Antigravity `agentapi`,
converts Markdown into Sanity Portable Text (`blockContent` with inline bold/italic/code/links),
and pushes both Category and Post documents in an atomic batch to the Sanity HTTP Mutations API.

Compatible with:
1. Sanity Content Lake HTTP Mutations API (`https://<projectId>.api.sanity.io/v2024-01-01/data/mutate/<dataset>`)
2. Google Antigravity Sidecars (`~/.gemini/config/sidecars/daily-fitness-publisher/sidecar.json`)
3. Google Antigravity `/schedule` command (`CronExpression: "0 9 * * *"`, `IsDaemon: true`)
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


DEFAULT_DATASET_PATH = "fitness_articles_1000_plus_dataset.json"
DEFAULT_OUTPUT_DIR = "content/articles"
DAILY_BATCH_SIZE = 10


def load_local_env(env_path: Optional[Path] = None) -> None:
    """
    Auto-loads .env.local or .env if present into os.environ.
    """
    targets = [env_path] if env_path else [Path(".env.local"), Path(".env")]
    for target in targets:
        if target and target.exists():
            with open(target, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k, v = k.strip(), v.strip().strip('"').strip("'")
                        if k and k not in os.environ:
                            os.environ[k] = v


def short_key() -> str:
    return uuid.uuid4().hex[:12]


def get_state_file_path(custom_state_path: Optional[str] = None) -> Path:
    """
    Uses Google Antigravity's `ANTIGRAVITY_EXECUTABLE_DATA_DIR` environment variable
    (`~/.gemini/antigravity/sidecar_data/<sidecarId>/data/`) when running as a sidecar,
    falling back to `./published_state.json` in the workspace directory.
    """
    if custom_state_path:
        return Path(custom_state_path)
    sidecar_data_dir = os.environ.get("ANTIGRAVITY_EXECUTABLE_DATA_DIR")
    if sidecar_data_dir:
        data_path = Path(sidecar_data_dir)
        data_path.mkdir(parents=True, exist_ok=True)
        return data_path / "published_state.json"
    return Path("published_state.json")


def load_state(state_path: Path) -> Dict[str, Any]:
    if state_path.exists():
        with open(state_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "published_ids": [],
        "last_run_at": None,
        "total_published": 0,
        "history": []
    }


def save_state(state_path: Path, state: Dict[str, Any]) -> None:
    state_path.parent.mkdir(parents=True, exist_ok=True)
    with open(state_path, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def select_next_batch(
    articles: List[Dict[str, Any]],
    published_ids: List[str],
    batch_size: int = DAILY_BATCH_SIZE,
    strategy: str = "balanced"
) -> List[Dict[str, Any]]:
    """
    Selects the next `batch_size` (default 10) unpublished articles.
    - 'balanced': Picks 1 article from each of the 10 fitness categories so daily site
      updates cover every category evenly across 105 days.
    - 'sequential': Picks the next 10 articles in ID order (FIT-0001, FIT-0002, ...).
    """
    published_set = set(published_ids)
    unpublished = [a for a in articles if a["id"] not in published_set]

    if not unpublished:
        return []

    if strategy == "sequential":
        return unpublished[:batch_size]

    by_category: Dict[str, List[Dict[str, Any]]] = {}
    for art in unpublished:
        cat_slug = art.get("category_slug", art.get("category", "general"))
        by_category.setdefault(cat_slug, []).append(art)

    selected: List[Dict[str, Any]] = []
    cat_keys = list(by_category.keys())
    round_idx = 0
    while len(selected) < batch_size and len(selected) < len(unpublished):
        added_in_round = False
        for key in cat_keys:
            if round_idx < len(by_category[key]):
                selected.append(by_category[key][round_idx])
                added_in_round = True
                if len(selected) >= batch_size:
                    break
        if not added_in_round:
            break
        round_idx += 1

    return selected


def build_agent_prompt(article: Dict[str, Any], metadata: Dict[str, Any]) -> str:
    """
    Constructs the comprehensive writing prompt from the enriched article JSON record.
    """
    wc = article.get("target_word_count", {"min": 1600, "max": 2400, "recommended": 2000})
    seo = article.get("seo_metadata", {})
    outline_lines = "\n".join(f"  - {h}" for h in article.get("markdown_outline", []))
    secondary_kws = ", ".join(seo.get("secondary_keywords", []))

    return (
        f"Write the complete, publication-ready Markdown fitness article '{article['title']}' "
        f"(ID: {article['id']}, Category: {article['category']} > {article['subcategory']}).\n\n"
        f"### Target Specifications\n"
        f"- **URL Slug**: `{article.get('slug', '')}`\n"
        f"- **Target Audience**: {article.get('target_audience', 'General Fitness Readers')}\n"
        f"- **Content Format**: {article.get('content_format', 'Evidence-Based Guide')}\n"
        f"- **Target Word Count**: {wc.get('recommended', 2000)} words (range: {wc.get('min', 1600)}-{wc.get('max', 2400)} words)\n"
        f"- **Primary SEO Keyword**: `{seo.get('primary_keyword', '')}`\n"
        f"- **Secondary Keywords**: {secondary_kws}\n"
        f"- **Meta Description**: {seo.get('meta_description', '')}\n\n"
        f"### Editorial Brief\n"
        f"{article.get('description', '')}\n\n"
        f"### Required Markdown Outline\n"
        f"{outline_lines}\n\n"
        f"### Execution Directives\n"
        f"{article.get('agent_writing_instructions', '')}\n"
        f"- Primary Source to Cite Inline: [{article.get('inspiration_source', 'Source')}]({article.get('source_url', '')})\n"
        f"- Output strictly valid Markdown body content (without outer code fences)."
    )


def generate_article_via_gemini_api(
    prompt: str,
    system_prompt: str,
    model: str = "gemini-3.5-flash-lite",
    api_key: Optional[str] = None
) -> str:
    """
    Calls the Gemini REST API using GEMINI_API_KEY to synthesize the full Markdown article.
    Includes automatic retry with backoff for transient 429/503 errors.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set. Add it to .env.local or pass --gemini-api-key.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    payload = {
        "system_instruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 8192
        }
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if not candidates:
                raise RuntimeError(f"Empty response from Gemini API: {data}")
            parts = candidates[0].get("content", {}).get("parts", [])
            return "".join(p.get("text", "") for p in parts).strip()
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8", errors="ignore")
            if e.code in (429, 503) and attempt < max_retries - 1:
                wait_time = (attempt + 1) * 3
                print(f"    [Retry {attempt+1}/{max_retries}] Gemini API {e.code} ({e.reason}). Backing off {wait_time}s...")
                time.sleep(wait_time)
                continue
            raise RuntimeError(f"Gemini API error (HTTP {e.code}): {err_msg}") from e
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 2
                print(f"    [Retry {attempt+1}/{max_retries}] Network error: {e}. Backing off {wait_time}s...")
                time.sleep(wait_time)
                continue
            raise


def trigger_antigravity_agentapi(prompt: str, output_file: Path) -> None:
    """
    Uses Google Antigravity's built-in `agentapi new-conversation` CLI (available automatically
    inside Antigravity sidecars) to instruct an Antigravity agent to write and save the article.
    """
    full_instruction = (
        f"{prompt}\n\n"
        f"Save the completed Markdown article (including YAML frontmatter) directly to `{output_file.resolve()}`."
    )
    subprocess.run(
        ["agentapi", "new-conversation", full_instruction],
        check=True
    )


def parse_inline_spans(text: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Converts inline Markdown (`[label](url)`, `**bold**`, `*italic*`, `` `code` ``)
    into Sanity Portable Text `children` spans and `markDefs`.
    """
    token_pattern = re.compile(
        r"(\[([^\]]+)\]\((https?://[^\)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)"
    )
    children: List[Dict[str, Any]] = []
    mark_defs: List[Dict[str, Any]] = []
    last_idx = 0

    for match in token_pattern.finditer(text):
        start, end = match.span()
        if start > last_idx:
            plain = text[last_idx:start]
            if plain:
                children.append({
                    "_type": "span",
                    "_key": short_key(),
                    "text": plain,
                    "marks": []
                })

        full_token = match.group(1)
        if match.group(2) and match.group(3):
            # Markdown Link: [label](url)
            link_key = short_key()
            mark_defs.append({
                "_key": link_key,
                "_type": "link",
                "href": match.group(3)
            })
            children.append({
                "_type": "span",
                "_key": short_key(),
                "text": match.group(2),
                "marks": [link_key]
            })
        elif match.group(4):
            # Bold: **text**
            children.append({
                "_type": "span",
                "_key": short_key(),
                "text": match.group(4),
                "marks": ["strong"]
            })
        elif match.group(5):
            # Italic: *text*
            children.append({
                "_type": "span",
                "_key": short_key(),
                "text": match.group(5),
                "marks": ["em"]
            })
        elif match.group(6):
            # Inline code: `code`
            children.append({
                "_type": "span",
                "_key": short_key(),
                "text": match.group(6),
                "marks": ["code"]
            })
        else:
            children.append({
                "_type": "span",
                "_key": short_key(),
                "text": full_token,
                "marks": []
            })
        last_idx = end

    if last_idx < len(text):
        trailing = text[last_idx:]
        if trailing:
            children.append({
                "_type": "span",
                "_key": short_key(),
                "text": trailing,
                "marks": []
            })

    if not children:
        children.append({
            "_type": "span",
            "_key": short_key(),
            "text": text,
            "marks": []
        })

    return children, mark_defs


def markdown_to_portable_text(markdown_text: str) -> List[Dict[str, Any]]:
    """
    Converts a Markdown article body into an array of Sanity Portable Text (`block`) objects
    conforming to the official Sanity Block Content specification.
    """
    blocks: List[Dict[str, Any]] = []
    lines = markdown_text.splitlines()

    for raw_line in lines:
        line = raw_line.strip()
        if not line or line == "---":
            continue

        # Skip Markdown table separator rows like | :--- | :--- |
        if re.match(r"^\|?[\s:|-]+\|[\s:|-]+\|?$", line):
            continue

        style = "normal"
        list_item: Optional[str] = None
        content = line

        if line.startswith("#### "):
            style = "h4"
            content = line[5:].strip()
        elif line.startswith("### "):
            style = "h3"
            content = line[4:].strip()
        elif line.startswith("## "):
            style = "h2"
            content = line[3:].strip()
        elif line.startswith("# "):
            style = "h1"
            content = line[2:].strip()
        elif line.startswith("> "):
            style = "blockquote"
            content = line[2:].strip()
        elif re.match(r"^[-*+]\s+", line):
            list_item = "bullet"
            content = re.sub(r"^[-*+]\s+", "", line).strip()
        elif re.match(r"^\d+\.\s+", line):
            list_item = "number"
            content = re.sub(r"^\d+\.\s+", "", line).strip()
        elif line.startswith("|") and line.endswith("|"):
            # Format Markdown table row cleanly as a readable row block
            cells = [c.strip() for c in line.strip("|").split("|")]
            content = " | ".join(cells)

        children, mark_defs = parse_inline_spans(content)
        block: Dict[str, Any] = {
            "_type": "block",
            "_key": short_key(),
            "style": style,
            "markDefs": mark_defs,
            "children": children
        }
        if list_item:
            block["listItem"] = list_item
            block["level"] = 1

        blocks.append(block)

    return blocks


def build_sanity_mutations_for_batch(
    batch: List[Dict[str, Any]],
    body_by_id: Dict[str, str],
    doc_type: str = "post"
) -> List[Dict[str, Any]]:
    """
    Builds Sanity HTTP Mutation operations (`createIfNotExists` for Categories and
    `createOrReplace` for Posts) so each daily batch of 10 articles commits atomically.
    """
    mutations: List[Dict[str, Any]] = []
    seen_categories = set()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    for article in batch:
        cat_slug = article.get("category_slug", "general-fitness")
        cat_doc_id = f"category-{cat_slug}"

        if cat_doc_id not in seen_categories:
            seen_categories.add(cat_doc_id)
            mutations.append({
                "createIfNotExists": {
                    "_id": cat_doc_id,
                    "_type": "category",
                    "title": article["category"],
                    "slug": {
                        "_type": "slug",
                        "current": cat_slug
                    },
                    "description": f"Evidence-based {article['category']} guides, workouts, and programming."
                }
            })

        raw_md = body_by_id.get(article["id"], "")
        portable_text_blocks = markdown_to_portable_text(raw_md)
        seo = article.get("seo_metadata", {})
        wc = article.get("target_word_count", {})
        doc_id = f"{doc_type}-{article['id'].lower()}"

        post_doc = {
            "_id": doc_id,
            "_type": doc_type,
            "articleId": article["id"],
            "title": article["title"],
            "slug": {
                "_type": "slug",
                "current": article.get("slug", article["id"].lower())
            },
            "publishedAt": now_iso,
            "excerpt": article["description"],
            "subcategory": article.get("subcategory", ""),
            "targetAudience": article.get("target_audience", ""),
            "contentFormat": article.get("content_format", ""),
            "readingTimeMinutes": wc.get("reading_time_minutes", 8),
            "readTime": f"{wc.get('reading_time_minutes', 8)} min read",
            "category": {
                "_type": "reference",
                "_ref": cat_doc_id
            },
            "categories": [
                {
                    "_type": "reference",
                    "_key": short_key(),
                    "_ref": cat_doc_id
                }
            ],
            "splitCategory": article.get("split_category", "General"),
            "seo": {
                "_type": "seo",
                "primaryKeyword": seo.get("primary_keyword", ""),
                "secondaryKeywords": seo.get("secondary_keywords", []),
                "searchIntent": seo.get("search_intent", ""),
                "metaDescription": seo.get("meta_description", "")
            },
            "inspirationSource": {
                "name": article.get("inspiration_source", ""),
                "url": article.get("source_url", "")
            },
            "body": portable_text_blocks,
            "markdownBody": raw_md
        }

        mutations.append({"createOrReplace": post_doc})

    return mutations


def push_mutations_to_sanity(
    mutations: List[Dict[str, Any]],
    project_id: str,
    dataset: str,
    api_token: str,
    api_version: str = "v2024-01-01"
) -> Dict[str, Any]:
    """
    Sends the batch of mutations to Sanity's HTTP Mutations endpoint:
    POST https://<projectId>.api.sanity.io/<apiVersion>/data/mutate/<dataset>
    """
    if not project_id or not api_token:
        raise RuntimeError(
            "Sanity credentials missing! Set SANITY_PROJECT_ID and SANITY_API_TOKEN "
            "(or pass --sanity-project-id and --sanity-token)."
        )

    clean_version = api_version if api_version.startswith("v") else f"v{api_version}"
    url = f"https://{project_id}.api.sanity.io/{clean_version}/data/mutate/{dataset}?returnIds=true"
    payload = {"mutations": mutations}

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_token}"
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        return json.loads(resp.read().decode("utf-8"))


def build_markdown_with_frontmatter(article: Dict[str, Any], body_markdown: str) -> str:
    """
    Wraps the generated article body with YAML frontmatter for local backup or Git pipelines.
    """
    seo = article.get("seo_metadata", {})
    wc = article.get("target_word_count", {})
    today_iso = datetime.date.today().isoformat()
    secondary_json = json.dumps(seo.get("secondary_keywords", []))

    frontmatter = (
        "---\n"
        f"id: \"{article['id']}\"\n"
        f"title: {json.dumps(article['title'])}\n"
        f"slug: \"{article.get('slug', '')}\"\n"
        f"date: \"{today_iso}\"\n"
        f"category: {json.dumps(article['category'])}\n"
        f"category_slug: \"{article.get('category_slug', '')}\"\n"
        f"subcategory: {json.dumps(article['subcategory'])}\n"
        f"target_audience: {json.dumps(article.get('target_audience', ''))}\n"
        f"content_format: {json.dumps(article.get('content_format', ''))}\n"
        f"reading_time_minutes: {wc.get('reading_time_minutes', 8)}\n"
        f"primary_keyword: {json.dumps(seo.get('primary_keyword', ''))}\n"
        f"secondary_keywords: {secondary_json}\n"
        f"meta_description: {json.dumps(seo.get('meta_description', ''))}\n"
        f"inspiration_source: {json.dumps(article.get('inspiration_source', ''))}\n"
        f"source_url: \"{article.get('source_url', '')}\"\n"
        "---\n\n"
    )
    return frontmatter + body_markdown + "\n"


def build_scaffold_body(article: Dict[str, Any]) -> str:
    """
    Generates a structured Markdown scaffold from the article's outline when running in
    `--mode scaffold` or `--dry-run` without an external LLM API call.
    """
    lines = [
        f"## Introduction: {article['subcategory']}",
        "",
        f"{article['description']}",
        "",
    ]
    for heading in article.get("markdown_outline", []):
        if heading.startswith("H3: "):
            lines.append(f"### {heading[4:]}")
        elif heading.startswith("H2: "):
            lines.append(f"## {heading[4:]}")
        else:
            lines.append(f"## {heading}")
        lines.append("")
        lines.append(f"{article.get('agent_writing_instructions', '')}")
        lines.append("")
    lines.append(
        f"Reference Source: [{article.get('inspiration_source', 'Source')}]({article.get('source_url', '')})"
    )
    return "\n".join(lines)


def push_via_git(files_created: List[Path], batch_ids: List[str]) -> None:
    if not files_created:
        return
    subprocess.run(["git", "add"] + [str(p) for p in files_created], check=True)
    commit_msg = f"feat(content): auto-publish daily 10 fitness articles ({batch_ids[0]} to {batch_ids[-1]})"
    subprocess.run(["git", "commit", "-m", commit_msg], check=True)
    subprocess.run(["git", "push"], check=True)


def write_antigravity_and_sanity_configs(workspace_dir: Path, cron_expr: str = "0 9 * * *") -> Dict[str, Path]:
    """
    Exports:
    1. `sidecar.json` configured for Sanity.io daily publishing in Google Antigravity
    2. `antigravity_config_snippet.json` for `~/.gemini/config/config.json`
    3. `sanity_fitness_schema.ts` (Sanity Studio v3 schema definition for `post` and `category`)
    """
    script_abs = (workspace_dir / "antigravity_daily_10_articles_publisher.py").resolve()
    dataset_abs = (workspace_dir / DEFAULT_DATASET_PATH).resolve()

    sidecar_manifest = {
        "display_name": "Daily 10 Fitness Articles -> Sanity.io Publisher",
        "description": "Automatically generates 10 SEO fitness articles daily at 09:00 and mutates them into Sanity Content Lake.",
        "builtin": "schedule",
        "args": [
            cron_expr,
            "python3",
            str(script_abs),
            "--dataset",
            str(dataset_abs),
            "--batch-size",
            "10",
            "--strategy",
            "balanced",
            "--mode",
            "gemini-api",
            "--sanity-push"
        ],
        "restart_policy": "on-failure",
        "env": {
            "GEMINI_API_KEY": "${GEMINI_API_KEY}",
            "SANITY_PROJECT_ID": "${SANITY_PROJECT_ID}",
            "SANITY_DATASET": "production",
            "SANITY_API_TOKEN": "${SANITY_API_TOKEN}"
        }
    }

    global_config_snippet = {
        "sidecars": {
            "daily-fitness-publisher": {
                "enabled": True
            }
        }
    }

    sanity_schema_ts = """// Sanity Studio v3 Schema (`schemaTypes/fitnessPost.ts`)
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Fitness Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
})

export const postType = defineType({
  name: 'post',
  title: 'Fitness Article',
  type: 'document',
  fields: [
    defineField({ name: 'articleId', title: 'Dataset ID (FIT-XXXX)', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({ name: 'excerpt', title: 'Editorial Excerpt', type: 'text' }),
    defineField({ name: 'subcategory', title: 'Subcategory', type: 'string' }),
    defineField({ name: 'targetAudience', title: 'Target Audience', type: 'string' }),
    defineField({ name: 'contentFormat', title: 'Content Format', type: 'string' }),
    defineField({ name: 'readingTimeMinutes', title: 'Reading Time (Minutes)', type: 'number' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        defineField({ name: 'primaryKeyword', title: 'Primary Keyword', type: 'string' }),
        defineField({ name: 'secondaryKeywords', title: 'Secondary Keywords', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'searchIntent', title: 'Search Intent', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text' }),
      ],
    }),
    defineField({
      name: 'inspirationSource',
      title: 'Primary Reference Source',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Source Name', type: 'string' }),
        defineField({ name: 'url', title: 'Source URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Portable Text Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'markdownBody',
      title: 'Raw Markdown Body',
      type: 'text',
    }),
  ],
})
"""

    out_sidecar = workspace_dir / "sidecar.json"
    out_config = workspace_dir / "antigravity_config_snippet.json"
    out_schema = workspace_dir / "sanity_fitness_schema.ts"

    out_sidecar.write_text(json.dumps(sidecar_manifest, indent=2), encoding="utf-8")
    out_config.write_text(json.dumps(global_config_snippet, indent=2), encoding="utf-8")
    out_schema.write_text(sanity_schema_ts, encoding="utf-8")

    return {
        "sidecar_json": out_sidecar,
        "config_json": out_config,
        "sanity_schema": out_schema
    }


def main() -> None:
    load_local_env()
    parser = argparse.ArgumentParser(
        description="Automated Daily 10-Article Publisher for Google Antigravity & Sanity.io CMS"
    )
    parser.add_argument(
        "--dataset",
        default=DEFAULT_DATASET_PATH,
        help="Path to fitness_articles_1000_plus_dataset.json"
    )
    parser.add_argument(
        "--output-dir",
        default=DEFAULT_OUTPUT_DIR,
        help="Directory where local Markdown backups are saved"
    )
    parser.add_argument(
        "--state-file",
        default=None,
        help="Optional custom path to published_state.json (defaults to ANTIGRAVITY_EXECUTABLE_DATA_DIR)"
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DAILY_BATCH_SIZE,
        help="Number of articles to publish per daily run (default: 10)"
    )
    parser.add_argument(
        "--strategy",
        choices=["balanced", "sequential"],
        default="balanced",
        help="'balanced' picks 1 article from each of the 10 categories; 'sequential' picks in ID order"
    )
    parser.add_argument(
        "--mode",
        choices=["gemini-api", "agentapi", "scaffold"],
        default="scaffold",
        help="Generation backend: 'gemini-api' (direct LLM API), 'agentapi' (Antigravity CLI), or 'scaffold' (outline preview)"
    )
    parser.add_argument(
        "--gemini-model",
        default=os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite"),
        help="Gemini model for generation (default: gemini-3.5-flash-lite; options: gemini-3.8-flash, gemini-flash-latest)"
    )
    parser.add_argument(
        "--gemini-api-key",
        default=os.environ.get("GEMINI_API_KEY"),
        help="Gemini API Key (default: GEMINI_API_KEY from .env.local or environment)"
    )
    # Sanity.io CMS arguments
    parser.add_argument(
        "--sanity-push",
        action="store_true",
        help="Push the 10 generated articles (and category docs) to Sanity Content Lake HTTP Mutations API"
    )
    parser.add_argument(
        "--sanity-project-id",
        default=os.environ.get("SANITY_PROJECT_ID") or os.environ.get("NEXT_PUBLIC_SANITY_PROJECT_ID"),
        help="Sanity Project ID (or set SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_PROJECT_ID env var)"
    )
    parser.add_argument(
        "--sanity-dataset",
        default=os.environ.get("SANITY_DATASET") or os.environ.get("NEXT_PUBLIC_SANITY_DATASET", "production"),
        help="Sanity dataset name (default: 'production' or SANITY_DATASET/NEXT_PUBLIC_SANITY_DATASET env var)"
    )
    parser.add_argument(
        "--sanity-token",
        default=os.environ.get("SANITY_API_TOKEN"),
        help="Sanity API Robot Token with Editor permissions (or set SANITY_API_TOKEN env var)"
    )
    parser.add_argument(
        "--sanity-api-version",
        default=os.environ.get("SANITY_API_VERSION") or os.environ.get("NEXT_PUBLIC_SANITY_API_VERSION", "v2024-01-01"),
        help="Sanity HTTP API version (default: v2024-01-01)"
    )
    parser.add_argument(
        "--sanity-doc-type",
        default=os.environ.get("SANITY_DOC_TYPE", "post"),
        help="Sanity document _type for articles (default: 'post')"
    )
    parser.add_argument(
        "--git-push",
        action="store_true",
        help="Optional: also git add, commit, and push the local Markdown files"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview the next 10 articles and Sanity Portable Text mutation payload without modifying state"
    )
    parser.add_argument(
        "--export-sidecar-config",
        action="store_true",
        help="Export Google Antigravity sidecar.json, config.json, and Sanity Studio v3 schema (sanity_fitness_schema.ts)"
    )

    args = parser.parse_args()

    if args.export_sidecar_config:
        paths = write_antigravity_and_sanity_configs(Path.cwd())
        print(f"Exported Antigravity sidecar manifest to: {paths['sidecar_json']}")
        print(f"Exported Antigravity config snippet to:  {paths['config_json']}")
        print(f"Exported Sanity Studio v3 schema to:     {paths['sanity_schema']}")
        return

    dataset_path = Path(args.dataset)
    if not dataset_path.exists():
        print(f"Error: Dataset file not found at {dataset_path}", file=sys.stderr)
        sys.exit(1)

    with open(dataset_path, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    articles = dataset.get("articles", [])
    metadata = dataset.get("dataset_metadata", {})
    system_prompt = metadata.get("agent_prompt_pipeline_template", {}).get(
        "system_prompt",
        "You are an expert evidence-based fitness writer and exercise science editor."
    )

    state_path = get_state_file_path(args.state_file)
    state = load_state(state_path)

    batch = select_next_batch(
        articles=articles,
        published_ids=state["published_ids"],
        batch_size=args.batch_size,
        strategy=args.strategy
    )

    if not batch:
        print("All 1,050 articles in the dataset have already been published!")
        return

    print(
        f"Selected {len(batch)} articles for today's Sanity.io batch "
        f"(strategy={args.strategy}, previously_published={len(state['published_ids'])}/{len(articles)}):"
    )
    for idx, art in enumerate(batch, start=1):
        print(f"  {idx:2d}. [{art['id']}] ({art['category']}) {art['title']}")

    if args.dry_run:
        sample_body = build_scaffold_body(batch[0])
        sample_mutations = build_sanity_mutations_for_batch(
            batch=[batch[0]],
            body_by_id={batch[0]["id"]: sample_body},
            doc_type=args.sanity_doc_type
        )
        print("\nSample Sanity HTTP Mutation Preview (First Article + Category):")
        print(json.dumps({"mutations": sample_mutations}, indent=2)[:1800] + "\n  ...\n}")
        print("\nDry run complete. No files written, Sanity mutations sent, or state updated.")
        return

    output_base = Path(args.output_dir)
    created_files: List[Path] = []
    newly_published_ids: List[str] = []
    body_by_id: Dict[str, str] = {}

    for art in batch:
        cat_dir = output_base / art.get("category_slug", "general")
        cat_dir.mkdir(parents=True, exist_ok=True)
        file_path = cat_dir / f"{art.get('slug', art['id'].lower())}.md"
        prompt = build_agent_prompt(art, metadata)

        if args.mode == "gemini-api":
            body_md = generate_article_via_gemini_api(
                prompt=prompt,
                system_prompt=system_prompt,
                model=args.gemini_model,
                api_key=args.gemini_api_key
            )
            full_md = build_markdown_with_frontmatter(art, body_md)
            file_path.write_text(full_md, encoding="utf-8")
        elif args.mode == "agentapi":
            trigger_antigravity_agentapi(prompt=prompt, output_file=file_path)
            body_md = file_path.read_text(encoding="utf-8") if file_path.exists() else ""
        else:
            body_md = build_scaffold_body(art)
            full_md = build_markdown_with_frontmatter(art, body_md)
            file_path.write_text(full_md, encoding="utf-8")

        body_by_id[art["id"]] = body_md
        created_files.append(file_path)
        newly_published_ids.append(art["id"])
        print(f"  -> Prepared: {file_path}")

    if args.sanity_push:
        mutations = build_sanity_mutations_for_batch(
            batch=batch,
            body_by_id=body_by_id,
            doc_type=args.sanity_doc_type
        )
        res = push_mutations_to_sanity(
            mutations=mutations,
            project_id=args.sanity_project_id,
            dataset=args.sanity_dataset,
            api_token=args.sanity_token,
            api_version=args.sanity_api_version
        )
        tx_id = res.get("transactionId", "unknown")
        print(
            f"  -> Pushed {len(mutations)} mutations (10 {args.sanity_doc_type} docs + categories) "
            f"to Sanity dataset '{args.sanity_dataset}' (transactionId: {tx_id})"
        )

    if args.git_push:
        push_via_git(created_files, newly_published_ids)

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    state["published_ids"].extend(newly_published_ids)
    state["total_published"] = len(state["published_ids"])
    state["last_run_at"] = now_iso
    state["history"].append({
        "run_at": now_iso,
        "count": len(newly_published_ids),
        "article_ids": newly_published_ids,
        "sanity_pushed": bool(args.sanity_push)
    })
    save_state(state_path, state)
    print(
        f"\nBatch complete! Updated state at {state_path} "
        f"({state['total_published']}/{len(articles)} total published)."
    )


if __name__ == "__main__":
    main()