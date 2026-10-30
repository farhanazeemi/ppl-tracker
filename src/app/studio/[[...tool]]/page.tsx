import { NextStudio } from 'next-sanity/studio';
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio';
import type { Metadata, Viewport } from 'next';
import config from '../../../../sanity.config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'PPL Tracker Studio | Content Management',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  ...studioViewport,
  interactiveWidget: 'resizes-content',
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}

