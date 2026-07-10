import type { Locale } from '../i18n';

/**
 * Localized homepage/about/contact copy. English and French are always
 * authored; Algerian Arabic (dz) and Turkish (tr) are optional and fall
 * back to English when absent (see `homepageText()` helper).
 */
export type HomepageText = { en: string; fr: string; dz?: string; tr?: string };

/** Resolve a HomepageText value for the active locale, falling back to English. */
export function homepageText(value: HomepageText, locale: Locale): string {
  return value[locale] ?? value.en;
}

export type HomepageMetric = {
  value: string;
  label: HomepageText;
  detail?: HomepageText;
};

export type HomepageProcessStep = {
  id: 'coordination' | 'engineering' | 'site' | 'monitoring' | 'handover';
  title: HomepageText;
  body: HomepageText;
};

export type HomepageProof = {
  title: HomepageText;
  body: HomepageText;
};

export const homepageContent = {
  hero: {
    eyebrow: {
      en: 'SARL Igloo Yapi Construction',
      fr: 'SARL Igloo Yapi Construction',
    },
    title: {
      en: 'Building for Algeria. Built to last.',
      fr: 'Construire pour l’Algérie. Bâtir pour durer.',
    },
    lead: {
      en: 'Residential and mixed-use programmes delivered with engineering control, site discipline and long-term construction quality across Algeria.',
      fr: 'Des programmes résidentiels et mixtes réalisés avec maîtrise technique, discipline de chantier et qualité durable en Algérie.',
    },
    primaryCta: {
      en: 'Explore projects',
      fr: 'Voir les projets',
    },
    secondaryCta: {
      en: 'Contact team',
      fr: 'Contacter l’équipe',
    },
    trustFacts: [
      { value: 'Est. 2018', label: { en: 'Algiers-based', fr: 'Basée à Alger' } },
      { value: '11', label: { en: 'projects', fr: 'projets' } },
      { value: '2,500+', label: { en: 'housing units', fr: 'logements' } },
      { value: '4', label: { en: 'wilayas covered', fr: 'wilayas couvertes' } },
      { value: 'Category 6', label: { en: 'certified contractor', fr: 'entreprise certifiée' } },
    ] satisfies HomepageMetric[],
  },
  manifesto: {
    eyebrow: {
      en: 'Construction with proof',
      fr: 'Construction avec preuves',
    },
    title: {
      en: 'We build the framework for durable everyday life.',
      fr: 'Nous bâtissons le cadre d’une vie quotidienne durable.',
    },
    body: {
      en: 'From housing blocks and villas to commercial premises, roads and networks, Igloo coordinates the trades that turn a programme into a place that works.',
      fr: 'Des immeubles résidentiels aux villas, des locaux commerciaux aux voiries et réseaux, Igloo coordonne les corps de métier qui transforment un programme en lieu fonctionnel.',
    },
    credential: {
      en: 'Professional Qualification and Classification Certificate, Category 6',
      fr: 'Certificat de qualification et de classification professionnelles, catégorie 6',
    },
    metrics: [
      {
        value: '2018',
        label: { en: 'founded in Algiers', fr: 'création à Alger' },
        detail: { en: 'Bir Khadem operational base', fr: 'base opérationnelle à Bir Khadem' },
      },
      {
        value: '11',
        label: { en: 'portfolio projects', fr: 'projets au portefeuille' },
        detail: { en: 'completed and current programmes', fr: 'programmes livrés et en cours' },
      },
      {
        value: '2,500+',
        label: { en: 'housing units connected to programmes', fr: 'logements liés aux programmes' },
        detail: { en: 'residential and mixed-use scope', fr: 'portée résidentielle et mixte' },
      },
      {
        value: '4',
        label: { en: 'wilayas represented', fr: 'wilayas représentées' },
        detail: { en: 'Tipaza, Algiers, Mostaganem, Boumerdes', fr: 'Tipaza, Alger, Mostaganem, Boumerdes' },
      },
    ] satisfies HomepageMetric[],
  },
  featuredProjects: {
    eyebrow: {
      en: 'Selected work',
      fr: 'Réalisations sélectionnées',
    },
    title: {
      en: 'Built evidence, not promises.',
      fr: 'Des références construites, pas des promesses.',
    },
    lead: {
      en: 'A portfolio of housing, villas, commercial premises, roads and networks, shown through real project scope and location proof.',
      fr: 'Un portefeuille de logements, villas, locaux commerciaux, voiries et réseaux, présenté par portée réelle et localisation.',
    },
  },
  process: {
    eyebrow: {
      en: 'Delivery discipline',
      fr: 'Discipline de livraison',
    },
    title: {
      en: 'From first coordination to handover.',
      fr: 'De la coordination initiale à la réception.',
    },
    lead: {
      en: 'A clear technical structure keeps each programme moving through planning, engineering control, site execution and final delivery.',
      fr: 'Une structure technique claire accompagne chaque programme de la planification au contrôle d’exécution, jusqu’à la livraison.',
    },
    steps: [
      {
        id: 'coordination',
        title: { en: 'Pre-construction coordination', fr: 'Coordination avant travaux' },
        body: {
          en: 'Scope, programme requirements, quantities and site constraints are aligned before work moves on site.',
          fr: 'La portée, les exigences du programme, les quantités et les contraintes du site sont alignées avant l’intervention.',
        },
      },
      {
        id: 'engineering',
        title: { en: 'Engineering & TCE control', fr: 'Ingénierie & contrôle TCE' },
        body: {
          en: 'Engineers, architects and technical managers coordinate secondary trades, structures, MEP, roads and networks.',
          fr: 'Ingénieurs, architectes et responsables techniques coordonnent les corps d’état, structures, MEP, voiries et réseaux.',
        },
      },
      {
        id: 'site',
        title: { en: 'Site execution', fr: 'Exécution de chantier' },
        body: {
          en: 'Construction managers and site teams organise daily progress, trade sequencing and material movement.',
          fr: 'Les conducteurs de travaux et équipes de chantier organisent l’avancement, les enchaînements et les approvisionnements.',
        },
      },
      {
        id: 'monitoring',
        title: { en: 'Quality, safety & schedule monitoring', fr: 'Qualité, sécurité & planning' },
        body: {
          en: 'Delivery is tracked against technical requirements, safety rules, finish quality and contractual milestones.',
          fr: 'La livraison est suivie selon les exigences techniques, les règles de sécurité, la qualité de finition et les jalons contractuels.',
        },
      },
      {
        id: 'handover',
        title: { en: 'Handover & aftercare', fr: 'Réception & suivi' },
        body: {
          en: 'Final works are closed with practical readiness, documentation and attention to the long-term use of each place.',
          fr: 'Les travaux finaux sont clôturés avec préparation pratique, documentation et attention à l’usage durable de chaque lieu.',
        },
      },
    ] satisfies HomepageProcessStep[],
  },
  about: {
    eyebrow: {
      en: 'Company profile',
      fr: 'Profil entreprise',
    },
    title: {
      en: 'Built with expertise. Delivered with control.',
      fr: 'Construit avec expertise. Livre avec maitrise.',
    },
    credential: {
      en: 'Professional Qualification & Classification Certificate - Category 6',
      fr: 'Certificat de qualification et classification - categorie 6',
    },
    paragraphs: [
      {
        en: 'Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi Construction works from Bir Khadem, Algiers, on residential and mixed-use programmes across Algeria.',
        fr: 'Fondée en 2018 et dirigée par l’ingénieur en génie civil Adem Talay, SARL Igloo Yapi Construction intervient depuis Bir Khadem, Alger, sur des programmes résidentiels et mixtes en Algérie.',
      },
      {
        en: 'The company holds a Professional Qualification and Classification Certificate, Category 6, and operates with a qualified building manager, engineers, architects, construction managers and site staff.',
        fr: 'L’entreprise détient un Certificat de qualification et de classification professionnelles, catégorie 6, et s’appuie sur un responsable bâtiment, des ingénieurs, architectes, conducteurs de travaux et équipes de chantier.',
      },
    ] satisfies HomepageText[],
    metrics: [
      {
        value: '2018',
        label: { en: 'Established', fr: 'Etablie' },
      },
      {
        value: '11',
        label: { en: 'Projects delivered and underway', fr: 'Projets livres et en cours' },
      },
      {
        value: '2,500+',
        label: { en: 'Homes delivered or underway', fr: 'Logements livres ou en cours' },
      },
    ] satisfies HomepageMetric[],
    proofs: [
      {
        title: { en: 'Category 6 Contractor', fr: 'Entrepreneur categorie 6' },
        body: {
          en: 'Professional Qualification and Classification Certificate, Category 6.',
          fr: 'Certificat de qualification et de classification professionnelles, catégorie 6.',
        },
      },
      {
        title: { en: 'Multidisciplinary Team', fr: 'Equipe pluridisciplinaire' },
        body: {
          en: 'Building manager, three engineers, two architects, construction managers, HR, accountant, buyer and site teams.',
          fr: 'Responsable bâtiment, trois ingénieurs, deux architectes, conducteurs de travaux, RH, comptable, acheteur et équipes chantier.',
        },
      },
      {
        title: { en: 'Residential & Mixed-use Expertise', fr: 'Expertise residentielle et mixte' },
        body: {
          en: 'Housing, villas, commercial premises, roads, networks, services and exterior works.',
          fr: 'Logements, villas, locaux commerciaux, voiries, réseaux, services et aménagements extérieurs.',
        },
      },
    ] satisfies HomepageProof[],
  },
  footprint: {
    eyebrow: {
      en: 'Project footprint',
      fr: 'Empreinte projet',
    },
    title: {
      en: 'Algeria & Beyond',
      fr: 'Algérie & au-delà',
    },
    lead: {
      en: 'Eleven project locations across four highlighted wilayas, with a dense Algiers delivery belt and active reach toward Mostaganem and Boumerdes.',
      fr: 'Onze implantations de projets dans quatre wilayas mises en évidence, avec une forte concentration autour d’Alger et une présence vers Mostaganem et Boumerdès.',
    },
    selectedLabel: {
      en: 'Selected project',
      fr: 'Projet sélectionné',
    },
    openProject: {
      en: 'Open project',
      fr: 'Voir le projet',
    },
    statusCompleted: {
      en: 'Completed',
      fr: 'Livré',
    },
    statusInProgress: {
      en: 'In progress',
      fr: 'En cours',
    },
    stats: [
      { value: '11', label: { en: 'project pins', fr: 'pins projet' } },
      { value: '4', label: { en: 'highlighted wilayas', fr: 'wilayas mises en évidence' } },
      { value: '1', label: { en: 'north-coast delivery belt', fr: 'axe de livraison nord' } },
    ] satisfies HomepageMetric[],
  },
  footer: {
    eyebrow: {
      en: 'Project discussion',
      fr: 'Discussion projet',
    },
    title: {
      en: 'Let’s discuss the next durable programme.',
      fr: 'Parlons du prochain programme durable.',
    },
    lead: {
      en: 'Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site delivery.',
      fr: 'Échangez avec une équipe basée à Alger, expérimentée dans les programmes résidentiels et mixtes, les voiries, les réseaux et la coordination de chantier.',
    },
    emailLabel: {
      en: 'Email Igloo',
      fr: 'E-mail Igloo',
    },
    phoneLabel: {
      en: 'Call Algeria office',
      fr: 'Appeler le bureau Algérie',
    },
    proofLine: {
      en: 'Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery',
      fr: 'Bir Khadem, Alger · Entreprise certifiée catégorie 6 · Réalisation résidentielle et mixte',
    },
  },
};

export const homepageProjectProofs: Record<string, HomepageText> = {
  'douaouda-300-500-housing': {
    en: 'Assisted promotional housing in Douaouda with professional premises, exterior works and TCE delivery.',
    fr: 'Logements promotionnels aidés à Douaouda avec locaux professionnels, aménagements extérieurs et réalisation TCE.',
  },
  'sidi-abdallah-200-1200-housing': {
    en: 'Public promotional housing in Sidi Abdallah with R+9 buildings and commercial/professional premises.',
    fr: 'Logements promotionnels publics à Sidi Abdellah avec bâtiments R+9 et locaux commerciaux/professionnels.',
  },
  'staoueli-11-41-villas': {
    en: 'Standing villa delivery at Les Pastorales with secondary trades, roads and utility networks.',
    fr: 'Villas de standing aux Pastorales avec corps d’état secondaires, voiries et réseaux divers.',
  },
  rahmania: {
    en: 'Two commercial centres serving a 2,500-home residential programme in Douira, Algiers.',
    fr: 'Deux centres commerciaux au sein d’un programme de 2 500 logements à Douera, Alger.',
  },
  'said-hamdine-mixed-real-estate': {
    en: 'Five residential blocks, 202 free promotional units, commercial levels and two basement parking floors.',
    fr: 'Cinq blocs résidentiels, 202 logements promotionnels libres, niveaux commerciaux et deux sous-sols de parking.',
  },
  'rouiba-4-promotional-villas': {
    en: 'Four promotional villas in Rouiba delivered with TCE, VRD and exterior site works.',
    fr: 'Quatre villas promotionnelles à Rouiba réalisées avec TCE, VRD et aménagements extérieurs.',
  },
  'sidi-benour-50-housing': {
    en: 'High-rise R+13 residential delivery within the Sidi Benour promotional housing programme.',
    fr: 'Réalisation résidentielle R+13 au sein du programme de logements promotionnels de Sidi Benour.',
  },
  'dely-brahim-240-housing': {
    en: 'A 240-unit vertical residential programme with commercial areas, services and underground parking.',
    fr: 'Un programme résidentiel vertical de 240 logements avec commerces, services et parking en sous-sol.',
  },
  'bas-mazagran-200-38-housing': {
    en: 'A seven-block Mostaganem programme combining assisted and free promotional housing with commercial premises.',
    fr: 'Un programme de sept blocs à Mostaganem associant logements aidés, logements libres et locaux commerciaux.',
  },
  'reghaia-bouraada-250-housing': {
    en: 'A 250-unit Reghaia programme with commercial premises, concierge spaces and multi-block execution.',
    fr: 'Un programme de 250 logements à Reghaia avec locaux commerciaux, conciergeries et exécution multi-blocs.',
  },
  'boudouaou-70-10-housing': {
    en: 'A Boumerdes programme of 70 assisted and 10 free promotional units with commercial/professional premises.',
    fr: 'Un programme à Boumerdès de 70 logements aidés et 10 libres avec locaux commerciaux/professionnels.',
  },
};

export function localize(value: HomepageText, locale: Locale): string {
  return value[locale] ?? value.en;
}
