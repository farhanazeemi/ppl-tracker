import { projectId, dataset, apiVersion } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemas';

export default {
  basePath: '/studio',
  projectId: projectId || 'demo-fitness-project',
  dataset: dataset || 'production',
  apiVersion,
  title: 'PPL Hypertrophy Tracker Blog Studio',
  schema: {
    types: schemaTypes,
  },
};
