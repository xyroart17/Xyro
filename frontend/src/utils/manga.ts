import { client } from "./sanity.js";

export interface Manga {
  title: string;
  subtitle?: string;
  coverImage: any;
  genre?: string;
  status?: string;
  pages: string[];
  pageCount: number;
  wip?: string[];
  tag?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

/**
 * Fetch all manga document slugs from Sanity.
 */
export async function getAllMangaSlugs(): Promise<string[]> {
  const result = await client.fetch(`*[_type == "manga"]{ "slug": slug.current }`);
  if (!result) return [];
  return result.map((item: any) => item.slug).filter(Boolean);
}

/**
 * Fetch a single manga document by its URL slug.
 */
export async function getMangaBySlug(slug: string): Promise<Manga | null> {
  return await client.fetch(
    `*[_type == "manga" && slug.current == $slug][0] {
      title,
      subtitle,
      coverImage,
      genre,
      status,
      "pages": pages[].asset->url,
      "pageCount": count(pages)
    }`,
    { slug }
  );
}
