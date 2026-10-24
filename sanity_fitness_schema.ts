// Sanity Studio v3 Schema (`schemaTypes/fitnessPost.ts`)
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
