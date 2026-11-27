import { BlogPost } from '@/data/mockBlogPosts';

/**
 * Unindexed / canonical redirect target slugs prioritized for internal crawl equity.
 */
const PRIORITY_DISCOVERY_SLUGS = new Set<string>([
  '12-week-zone-2-training-pacing-schedule',
  'behavioral-psychology-unbreakable-gym-habits',
  'debunking-bulky-myth-4-day-toned-program',
  'debunking-the-bulky-myth-why-lifting-heavy-creates-a-toned-physique-troubleshooting-plateaus-in-strength-and-body-composition',
  'female-hypertrophy-science-heavy-weights',
  'high-bar-front-squat-linear-vs-dup',
  'high-bar-front-squat-rpe-vbt-guide',
  'lat-hypertrophy-tension-vs-metabolic-stress',
  'low-bar-squat-deload-week-cns-recovery',
  'romanian-deadlift-hamstring-glute-guide',
  'sustainable-strength-habits-women-over-40',
  'test-track-vo2-max-without-lab-guide',
  'clavicular-pectoral-upper-chest-growth',
  'double-progression-protocol-hypertrophy',
  'push-pull-legs-vs-bro-split-comparison',
  'scapular-plane-lateral-raise-guide',
]);

function stableHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'your', 'that', 'this', 'from', 'guide', 'science'].includes(w))
  );
}

/**
 * Selects cluster-matched sibling articles for Related Reading, prioritizing
 * same-split spokes and under-crawled/unindexed articles rotated deterministically
 * per current slug so every article receives distributed internal link equity.
 */
export function selectRelatedClusterPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  count = 6
): BlogPost[] {
  const currentTokens = tokenize(`${currentPost.title} ${currentPost.slug}`);
  const currentSplit = (currentPost.splitCategory || '').toLowerCase();
  const currentAuthorSlug = (currentPost.author?.slug || '').toLowerCase();
  const seed = stableHash(currentPost.slug);

  const candidates = allPosts
    .filter((p) => p.slug !== currentPost.slug)
    .map((candidate) => {
      let score = 0;
      const sameSplit = (candidate.splitCategory || '').toLowerCase() === currentSplit;
      if (sameSplit) score += 50;

      if (PRIORITY_DISCOVERY_SLUGS.has(candidate.slug)) {
        score += sameSplit ? 38 : 22;
      }

      if ((candidate.author?.slug || '').toLowerCase() === currentAuthorSlug) {
        score += 4;
      }

      const candTokens = tokenize(`${candidate.title} ${candidate.slug}`);
      let overlap = 0;
      for (const tok of currentTokens) {
        if (candTokens.has(tok)) overlap += 1;
      }
      score += Math.min(overlap, 5) * 6;

      // Deterministic tie-breaker offset unique to currentPost.slug so links fan out across the cluster
      const rotationScore = (stableHash(`${currentPost.slug}:${candidate.slug}`) + seed) % 19;

      return { candidate, sameSplit, score: score + rotationScore };
    });

  candidates.sort((a, b) => b.score - a.score);

  const sameCluster = candidates.filter((c) => c.sameSplit).map((c) => c.candidate);
  const crossCluster = candidates.filter((c) => !c.sameSplit).map((c) => c.candidate);

  const picked: BlogPost[] = [];
  const pickedSlugs = new Set<string>();

  for (const post of sameCluster) {
    if (picked.length >= Math.min(4, count)) break;
    if (!pickedSlugs.has(post.slug)) {
      picked.push(post);
      pickedSlugs.add(post.slug);
    }
  }

  for (const post of crossCluster) {
    if (picked.length >= count) break;
    if (!pickedSlugs.has(post.slug)) {
      picked.push(post);
      pickedSlugs.add(post.slug);
    }
  }

  for (const { candidate } of candidates) {
    if (picked.length >= count) break;
    if (!pickedSlugs.has(candidate.slug)) {
      picked.push(candidate);
      pickedSlugs.add(candidate.slug);
    }
  }

  return picked;
}
