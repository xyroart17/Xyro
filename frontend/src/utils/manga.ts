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
