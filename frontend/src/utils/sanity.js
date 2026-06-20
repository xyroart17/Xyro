import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'pfnvy1zn', // Your explicit project ID from your setup
  dataset: 'production',
  useCdn: true,          // Delivers data instantly via edge caching
  apiVersion: '2026-05-18', // Current deployment timestamp
});

const builder = imageUrlBuilder(client);

// Helper function to turn Sanity asset references into ultra-fast CDN URLs
export function urlFor(source) {
  return builder.image(source);
}