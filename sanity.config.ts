'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { projectId, dataset } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  basePath: '/studio',
  projectId: projectId || '25cvzde8',
  dataset: dataset || 'production',
  title: 'PPL Hypertrophy Tracker Blog Studio',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
