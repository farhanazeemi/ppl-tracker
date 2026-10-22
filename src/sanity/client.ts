import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion, useCdn } from './env';

export const isSanityConfigured = Boolean(projectId && projectId.trim() !== '');

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
    })
  : null;
