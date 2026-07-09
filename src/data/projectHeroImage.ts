import { getProjectContent, type ProjectImage } from './projectContent';
import { getManualProjectHeroImage } from './manualProjectImages';
import type { ProjectRecord } from './projects';

function bySrc(images: ProjectImage[], part: string) {
  return images.find((image) => image.src.includes(part));
}

function uniqueImages(images: Array<ProjectImage | undefined>) {
  const seen = new Set<string>();
  return images.filter((image): image is ProjectImage => {
    if (!image || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

export function getProjectHeroImage(project: ProjectRecord): ProjectImage {
  const manualHero = getManualProjectHeroImage(project.slug);
  if (manualHero) return manualHero;

  const content = getProjectContent(project);
  const images = uniqueImages([
    ...content.images.hero,
    content.images.intro,
    ...content.images.featured,
    ...content.images.mosaic,
    ...content.images.featureGallery,
    ...content.images.constructionGallery,
  ]);

  if (project.slug === 'rahmania') {
    const cinematicHero = bySrc(images, '16-whatsapp-image-2025-11-12-at-15-23-03');
    if (cinematicHero) return cinematicHero;
  }

  return (
    images[0] ?? {
      src: project.images[0],
      alt: { en: project.title, fr: project.menuTitle },
    }
  );
}
