import type { ServiceSlug } from './siteSeo';

export type ServiceDefinition = {
  slug: ServiceSlug;
  proofProjects: string[];
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    slug: 'general-contracting',
    proofProjects: ['said-hamdine-mixed-real-estate', 'rahmania'],
  },
  {
    slug: 'residential-construction',
    proofProjects: ['douaouda-300-500-housing', 'sidi-abdallah-200-1200-housing', 'staoueli-11-41-villas'],
  },
  {
    slug: 'commercial-construction',
    proofProjects: ['rahmania', 'said-hamdine-mixed-real-estate'],
  },
  {
    slug: 'infrastructure-works',
    proofProjects: ['staoueli-11-41-villas', 'boudouaou-70-10-housing', 'douaouda-300-500-housing'],
  },
];

export const serviceDefinitionBySlug = new Map(serviceDefinitions.map((service) => [service.slug, service]));
