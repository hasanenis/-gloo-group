export const CONTENT_LOCALES = ['en', 'fr', 'tr', 'ar-DZ'] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];
export type ContentStatus = 'draft' | 'review' | 'approved';

export type PageSeo = {
  title: string;
  description: string;
  socialTitle: string;
  socialDescription: string;
};

export type PageDocument<TContent = unknown> = {
  schemaVersion: 1;
  pageId: string;
  locale: ContentLocale;
  sourceLocale: 'en';
  revision: string;
  sourceRevision: string;
  status: ContentStatus;
  updatedAt?: string;
  seo: PageSeo;
  content: TContent;
};

export type PageField = {
  key: string;
  kind: 'heading' | 'body' | 'cta' | 'label' | 'alt' | 'seo-title' | 'seo-description';
  required: boolean;
  maxLength?: number;
  notes?: string;
};

export type PageManifest = {
  schemaVersion: 1;
  pageId: string;
  path: string;
  sourceLocale: 'en';
  fields: PageField[];
  facts?: Record<string, unknown>;
};

export type SharedDocument = {
  schemaVersion: 1;
  locale: ContentLocale;
  sourceLocale: 'en';
  revision: string;
  sourceRevision: string;
  status: ContentStatus;
  content: Record<string, string>;
};
