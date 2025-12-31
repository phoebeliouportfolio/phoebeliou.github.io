export interface Project {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: {
    src: string;
    alt: string;
  } | null;
}
