export const postSchema = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'splitCategory',
      title: 'Related Workout Split',
      type: 'string',
      options: {
        list: [
          { title: 'Push-Pull-Legs (PPL)', value: 'PPL' },
          { title: 'Bro Split', value: 'Bro Split' },
          { title: 'Upper/Lower', value: 'Upper/Lower' },
          { title: 'Full Body', value: 'Full Body' },
          { title: 'All Splits / General Science', value: 'General' },
        ],
      },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'readTime',
      title: 'Estimated Read Time',
      type: 'string',
      initialValue: '5 min read',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.max(200),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
        },
      ],
    },
  ],
};
