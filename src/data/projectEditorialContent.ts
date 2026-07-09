import type { LocalizedText, ProjectFact } from './projectContent';
import type { ProjectRecord } from './projects';

export type ProjectEditorialIcon =
  | 'building'
  | 'commerce'
  | 'delivery'
  | 'home'
  | 'network'
  | 'parking'
  | 'route'
  | 'villa';

export type ProjectEditorialScopeItem = {
  icon: ProjectEditorialIcon;
  text: LocalizedText;
};

export type ProjectEditorialContent = {
  heroTitleLines?: string[];
  heroDescription: LocalizedText;
  intro: LocalizedText;
  columns: [LocalizedText, LocalizedText];
  statement: LocalizedText;
  facts: ProjectFact[];
  metric: string;
  metricLabel: LocalizedText;
  metricCaptionLines: Record<'en' | 'fr', string[]>;
  infoTopline: LocalizedText;
  infoEyebrow: LocalizedText;
  infoHeading: LocalizedText;
  infoParagraph: LocalizedText;
  ctaLabel: LocalizedText;
  scopeItems: ProjectEditorialScopeItem[];
};

const text = (en: string, fr: string): LocalizedText => ({ en, fr });
const fact = (labelEn: string, labelFr: string, valueEn: string, valueFr: string): ProjectFact => ({
  label: text(labelEn, labelFr),
  value: text(valueEn, valueFr),
});
const item = (icon: ProjectEditorialIcon, en: string, fr: string): ProjectEditorialScopeItem => ({
  icon,
  text: text(en, fr),
});

export const projectEditorialContent: Record<string, ProjectEditorialContent> = {
  'douaouda-300-500-housing': {
    heroDescription: text(
      'A completed LPA residential programme in Douaouda, shaped around R+8 apartment blocks, professional premises, access works and full TCE delivery.',
      'Un programme LPA acheve a Douaouda, structure autour de blocs R+8, de locaux professionnels, des acces et d une realisation complete en TCE.',
    ),
    intro: text(
      'Douaouda brings 300 to 500 assisted promotional homes into a coastal setting, pairing family housing with professional premises and organised exterior works.',
      'Douaouda regroupe 300 a 500 logements promotionnels aides dans un site ouvert sur le littoral, avec locaux professionnels et amenagements exterieurs organises.',
    ),
    columns: [
      text(
        'Igloo delivered the operation in full TCE scope, from reinforced-concrete works through secondary trades, MEP coordination, exterior access and finishing.',
        'Igloo a realise l operation en TCE, depuis la structure en beton arme jusqu aux corps secondaires, a la coordination MEP, aux acces et aux finitions.',
      ),
      text(
        'The R+8 blocks combine F3 and F4 layouts with ground-level professional uses, creating a residential fabric that is practical, airy and connected to daily services.',
        'Les blocs R+8 associent logements F3 et F4 a des usages professionnels, pour former un tissu residentiel pratique, aere et relie aux services du quotidien.',
      ),
    ],
    statement: text(
      'A coastal residential programme delivered with the discipline of a full-site operation: structure, services, circulation and finishes brought together as one.',
      'Un programme residentiel littoral livre avec la rigueur d une operation globale: structure, services, circulation et finitions reunis dans un meme ensemble.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Assisted promotional housing (LPA)', 'Logements promotionnels aides (LPA)'),
      fact('Location', 'Localisation', 'Douaouda, Tipaza, Algeria', 'Douaouda, Tipaza, Algerie'),
      fact('Programme', 'Programme', '300/500 homes with professional premises', '300/500 logements avec locaux professionnels'),
      fact('Completion', 'Achevement', '2019', '2019'),
      fact('Works', 'Travaux', 'Full TCE delivery', 'Tous corps d etat (TCE)'),
      fact('Client', 'Client', 'AADL', 'AADL'),
    ],
    metric: '300/500',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['R+8 BLOCKS', 'F3 AND F4 HOMES', 'PROFESSIONAL PREMISES'],
      fr: ['BLOCS R+8', 'LOGEMENTS F3 ET F4', 'LOCAUX PROFESSIONNELS'],
    },
    infoTopline: text('OUR IMPACT', 'NOTRE IMPACT'),
    infoEyebrow: text('COASTAL HOUSING', 'HABITAT LITTORAL'),
    infoHeading: text(
      'A large housing programme made practical through access, services and professional uses.',
      'Un grand programme de logements rendu fonctionnel par les acces, les services et les locaux professionnels.',
    ),
    infoParagraph: text(
      'The operation turns a large LPA brief into a complete residential setting: apartment blocks, professional premises, roads, exterior areas and technical networks are coordinated so the site works as a coherent neighbourhood.',
      'L operation transforme un programme LPA d envergure en cadre residentiel complet: blocs d habitation, locaux professionnels, voiries, espaces exterieurs et reseaux techniques sont coordonnes pour former un quartier coherent.',
    ),
    ctaLabel: text('SEE THE SITE', 'VOIR LE SITE'),
    scopeItems: [
      item('home', '300/500 assisted promotional housing units', '300/500 logements promotionnels aides'),
      item('building', 'R+8 residential blocks with F3 and F4 layouts', 'Blocs R+8 avec logements F3 et F4'),
      item('commerce', 'Professional premises integrated into the programme', 'Locaux professionnels integres au programme'),
      item('network', 'TCE, MEP, roads and exterior coordination', 'TCE, MEP, voiries et amenagements exterieurs'),
    ],
  },

  'sidi-abdallah-200-1200-housing': {
    heroDescription: text(
      'A 200-home delivery within the wider 1,200-home Sidi Abdallah programme, combining public promotional housing with commercial and professional premises.',
      'Une realisation de 200 logements dans le programme global de 1200 logements de Sidi Abdallah, avec locaux commerciaux et professionnels.',
    ),
    intro: text(
      'Sidi Abdallah places public promotional housing inside a growing urban pole, with R+9 buildings, F3 and F4 apartments and everyday service spaces.',
      'Sidi Abdallah inscrit des logements promotionnels publics dans un pole urbain en developpement, avec batiments R+9, appartements F3/F4 et espaces de services.',
    ),
    columns: [
      text(
        'The project focuses on secondary works for a dense housing sequence, aligning facades, interiors, technical trades and commercial premises inside a larger master programme.',
        'Le projet concentre les corps d etat secondaires sur une sequence dense de logements, en alignant facades, interieurs, lots techniques et locaux commerciaux dans un programme plus large.',
      ),
      text(
        'By pairing family housing with professional and retail spaces, the development supports a daily-life economy rather than a purely residential block structure.',
        'En associant logements familiaux, locaux professionnels et commerces, l ensemble soutient une economie de proximite plutot qu une simple composition de blocs residentiels.',
      ),
    ],
    statement: text(
      'A public housing delivery where secondary trades, service premises and R+9 density work together to support a new urban district.',
      'Une realisation de logements publics ou les corps secondaires, les locaux de service et la densite R+9 accompagnent la construction d un nouveau quartier.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Public promotional housing (LPP)', 'Logements promotionnels publics (LPP)'),
      fact('Location', 'Localisation', 'Sidi Abdallah, Algiers, Algeria', 'Sidi Abdallah, Alger, Algerie'),
      fact('Programme', 'Programme', '200 homes within a 1,200-home programme', '200 logements dans un programme de 1200 logements'),
      fact('Completion', 'Achevement', '2022', '2022'),
      fact('Building type', 'Typologie', 'R+9 residential buildings', 'Batiments residentiels R+9'),
      fact('Works', 'Travaux', 'Secondary trades without VRD', 'Corps d etat secondaires sans VRD'),
    ],
    metric: '200',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['WITHIN 1,200 HOMES', 'R+9 BUILDINGS', 'COMMERCIAL PREMISES'],
      fr: ['DANS 1200 LOGEMENTS', 'BATIMENTS R+9', 'LOCAUX COMMERCIAUX'],
    },
    infoTopline: text('URBAN DELIVERY', 'REALISATION URBAINE'),
    infoEyebrow: text('PUBLIC HOUSING', 'LOGEMENT PUBLIC'),
    infoHeading: text(
      'A compact residential programme strengthened by service spaces and a clear construction scope.',
      'Un programme residentiel compact renforce par des espaces de service et une portee de travaux claire.',
    ),
    infoParagraph: text(
      'Inside the Sidi Abdallah development, Igloo coordinated the secondary works that turn structure into usable housing: finishes, waterproofing, joinery, MEP trades and commercial premises are brought into one operational rhythm.',
      'Au sein du developpement de Sidi Abdallah, Igloo a coordonne les corps secondaires qui transforment la structure en logements utilisables: finitions, etancheite, menuiseries, lots MEP et locaux commerciaux suivent un meme rythme operationnel.',
    ),
    ctaLabel: text('SEE THE BUILDINGS', 'VOIR LES BATIMENTS'),
    scopeItems: [
      item('home', '200 LPP homes delivered in a 1,200-home programme', '200 logements LPP livres dans un programme de 1200 logements'),
      item('building', 'R+9 buildings with F3 and F4 homes', 'Batiments R+9 avec logements F3 et F4'),
      item('commerce', 'Commercial and professional premises', 'Locaux commerciaux et professionnels'),
      item('delivery', 'Completed in 2022 to technical standards', 'Acheve en 2022 selon les exigences techniques'),
    ],
  },

  'staoueli-11-41-villas': {
    heroDescription: text(
      'Eleven villas delivered within the Les Pastorales programme in Staoueli, combining individual R+2 living with VRD, exterior works and refined finishes.',
      'Onze villas realisees dans le programme Les Pastorales a Staoueli, associant habitat individuel R+2, VRD, amenagements exterieurs et finitions soignees.',
    ),
    intro: text(
      'Staoueli shifts the portfolio into a more intimate register: individual villas, private residential comfort and exterior works designed around access and durability.',
      'Staoueli inscrit le portfolio dans une echelle plus intime: villas individuelles, confort residentiel prive et amenagements exterieurs penses pour l acces et la durabilite.',
    ),
    columns: [
      text(
        'The 11 villas sit inside a 41-villa programme and rely on a precise sequence of TCES, VRD, facade work and exterior networks to create a finished residential setting.',
        'Les 11 villas s inscrivent dans un programme de 41 villas et reposent sur une sequence precise de TCES, VRD, facades et reseaux exterieurs pour former un cadre residentiel acheve.',
      ),
      text(
        'Their R+2 scale gives the project a domestic rhythm: balconies, guardrails, coatings and access works are treated as part of the same standing residential identity.',
        'Leur echelle R+2 donne au projet un rythme domestique: balcons, garde-corps, enduits et acces sont traites comme une meme identite residentielle de standing.',
      ),
    ],
    statement: text(
      'A villa programme delivered through the details that make individual housing feel complete: access, networks, facades and carefully finished exterior spaces.',
      'Un programme de villas livre par les details qui rendent l habitat individuel complet: acces, reseaux, facades et espaces exterieurs soigneusement finis.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Free promotional villas', 'Villas promotionnelles libres'),
      fact('Location', 'Localisation', 'Les Pastorales, Staoueli, Algiers', 'Les Pastorales, Staoueli, Alger'),
      fact('Programme', 'Programme', '11 villas within a 41-villa programme', '11 villas dans un programme de 41 villas'),
      fact('Completion', 'Achevement', '2022', '2022'),
      fact('Typology', 'Typologie', 'R+2 individual villas', 'Villas individuelles R+2'),
      fact('Works', 'Travaux', 'Secondary trades and VRD', 'Corps secondaires et VRD'),
    ],
    metric: '11/41',
    metricLabel: text('VILLAS', 'VILLAS'),
    metricCaptionLines: {
      en: ['R+2 INDIVIDUAL HOMES', 'VRD INCLUDED', 'STANDING RESIDENTIAL SETTING'],
      fr: ['HABITAT INDIVIDUEL R+2', 'VRD INCLUS', 'CADRE RESIDENTIEL DE STANDING'],
    },
    infoTopline: text('RESIDENTIAL VALUE', 'VALEUR RESIDENTIELLE'),
    infoEyebrow: text('VILLA DELIVERY', 'REALISATION DE VILLAS'),
    infoHeading: text(
      'Individual homes shaped by exterior works, durable facades and controlled site coordination.',
      'Des maisons individuelles portees par les amenagements exterieurs, les facades durables et la coordination du site.',
    ),
    infoParagraph: text(
      'The project demonstrates Igloo capacity on residential standing work: reinforced-concrete structures, networks, exterior arrangements and facade finishes come together to give the villas privacy, access and long-term quality.',
      'Le projet montre la capacite d Igloo sur l habitat de standing: structures en beton arme, reseaux, amenagements exterieurs et finitions de facade donnent aux villas intimite, accessibilite et qualite durable.',
    ),
    ctaLabel: text('SEE THE VILLAS', 'VOIR LES VILLAS'),
    scopeItems: [
      item('villa', '11 R+2 villas delivered inside Les Pastorales', '11 villas R+2 livrees aux Pastorales'),
      item('network', 'VRD, water, electricity and exterior networks', 'VRD, eau, electricite et reseaux exterieurs'),
      item('building', 'Modern facades with balconies and guardrails', 'Facades modernes avec balcons et garde-corps'),
      item('delivery', 'Completed in 2022 with controlled finishing quality', 'Acheve en 2022 avec une qualite de finition maitrisee'),
    ],
  },

  rahmania: {
    heroTitleLines: ['Douira'],
    heroDescription: text(
      "Secondary works for two commercial centres, completed in 2025 within Douira's 2,500-home residential programme.",
      'Corps d etat secondaires de deux centres commerciaux, acheves en 2025 au sein du programme de 2500 logements a Douira.',
    ),
    intro: text(
      "Two commercial centres in Douira's 2,500-home programme, fitted out to host the district's shops and everyday services.",
      'Deux centres commerciaux au sein du programme de 2500 logements de Douira, amenages pour accueillir commerces et services de proximite.',
    ),
    columns: [
      text(
        'Igloo carried out the complete secondary works package for both centres, turning two reinforced-concrete structures into modern, functional spaces ready for traders and everyday users.',
        'Igloo a realise l ensemble des corps d etat secondaires des deux centres, transformant deux structures en beton arme en espaces modernes et fonctionnels, prets pour les commercants et les usagers.',
      ),
      text(
        'The facades pair large glazed surfaces with decorative screen elements. Inside, circulation is organised around a central staircase, while a pyramidal glass skylight brings natural light into the retail levels.',
        'Les facades associent de larges surfaces vitrees a des elements decoratifs. A l interieur, la circulation s articule autour d un escalier central, tandis qu une verriere pyramidale diffuse la lumiere naturelle dans les niveaux commerciaux.',
      ),
    ],
    statement: text(
      'Delivered in 2025, on schedule, every secondary trade coordinated to the standard a modern commercial building demands.',
      'Livre en 2025, dans les delais, chaque corps d etat coordonne au niveau qu exige un equipement commercial moderne.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Commercial centres', 'Centres commerciaux'),
      fact('Location', 'Localisation', 'Douira, Algiers, Algeria', 'Douira, Alger, Algerie'),
      fact('Works', 'Travaux', 'Secondary works packages (CES)', 'Corps d etat secondaires (CES)'),
      fact('Completion', 'Achevement', '2025, on schedule', '2025, dans les delais'),
      fact('Development', 'Programme', '2,500-home residential programme', 'Programme residentiel de 2500 logements'),
      fact('Contract', 'Contrat', 'Execution', 'Realisation'),
    ],
    metric: '2,500',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['IN A THRIVING', 'MASTERPLANNED', 'NEIGHBOURHOOD'],
      fr: ['DANS UN QUARTIER', 'RESIDENTIEL STRUCTURE', 'ET DYNAMIQUE'],
    },
    infoTopline: text('OUR IMPACT', 'NOTRE IMPACT'),
    infoEyebrow: text('PROXIMITY SERVICES', 'SERVICES DE PROXIMITE'),
    infoHeading: text(
      "A hub of shops and services for the residents' daily needs.",
      'Un pole de commerces et de services repondant aux besoins quotidiens des habitants.',
    ),
    infoParagraph: text(
      'The two centres form an attractive hub of activity inside the residential programme. Their layout favours accessibility, functional spaces and user comfort, adding to the urban quality and economic life of the Douira district.',
      'Les deux centres forment un pole d activites attractif au sein du programme residentiel. Leur conception favorise l accessibilite, la fonctionnalite des espaces et le confort des usagers, en renforcant la qualite urbaine et la vie economique de Douira.',
    ),
    ctaLabel: text('SEE THE CENTRES', 'VOIR LES CENTRES'),
    scopeItems: [
      item('commerce', 'Complete secondary works package (CES)', 'Corps d etat secondaires complets (CES)'),
      item('building', 'Reinforced concrete structure and glazed facades', 'Structure en beton arme et facades vitrees'),
      item('route', 'Central staircase and pyramidal glass skylight', 'Escalier central et verriere pyramidale en verre'),
      item('delivery', 'Delivered in 2025, on schedule and to standard', 'Livre en 2025, dans les delais et aux normes'),
    ],
  },

  'said-hamdine-mixed-real-estate': {
    heroTitleLines: ['Mixed', 'Complex'],
    heroDescription: text(
      'A five-block mixed complex in Said Hamdine, combining 202 homes, three commercial levels and two underground parking levels.',
      'Un ensemble mixte de cinq blocs a Said Hamdine, combinant 202 logements, trois niveaux commerciaux et deux niveaux de parking en sous-sol.',
    ),
    intro: text(
      'Said Hamdine combines housing, commerce and parking into one compact urban operation, designed for residents, users and daily activity.',
      'Said Hamdine rassemble logements, commerce et stationnement dans une operation urbaine compacte, pensee pour les residents, les usagers et l activite quotidienne.',
    ),
    columns: [
      text(
        'The project brings together five residential blocks, 202 free promotional homes, three retail levels and two basement parking levels on a dense Algerian site.',
        'Le projet reunit cinq blocs residentiels, 202 logements promotionnels libres, trois niveaux de commerce et deux niveaux de parking en sous-sol sur un site dense d Alger.',
      ),
      text(
        'Igloo coordinated the full TCE delivery with particular attention to facade expression, balconies, glazed surfaces, parking access and the sequencing of mixed-use volumes.',
        'Igloo a coordonne la realisation complete en TCE avec une attention portee aux facades, aux balcons, aux surfaces vitrees, aux acces parking et a l enchainement des volumes mixtes.',
      ),
    ],
    statement: text(
      'A mixed urban complex held together by structure, access, housing and the discipline of delivery.',
      'Un ensemble urbain mixte tenu par la structure, les acces, le logement et la discipline de livraison.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Mixed real-estate complex', 'Ensemble immobilier mixte'),
      fact('Location', 'Localisation', 'Said Hamdine, Bir Mourad Rais, Algiers', 'Said Hamdine, Bir Mourad Rais, Alger'),
      fact('Housing units', 'Logements', '202 free promotional homes', '202 logements promotionnels libres'),
      fact('Blocks', 'Blocs', '5 residential blocks', '5 blocs residentiels'),
      fact('Parking', 'Parking', '2 underground parking levels', '2 niveaux de parking en sous-sol'),
      fact('Completion', 'Achevement', '2023', '2023'),
    ],
    metric: '202',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['5 RESIDENTIAL BLOCKS', '3 COMMERCIAL LEVELS', '2 BASEMENT PARKING LEVELS'],
      fr: ['5 BLOCS RESIDENTIELS', '3 NIVEAUX COMMERCIAUX', '2 NIVEAUX DE PARKING'],
    },
    infoTopline: text('MIXED PROGRAMME', 'PROGRAMME MIXTE'),
    infoEyebrow: text('HOUSING + COMMERCE', 'LOGEMENT + COMMERCE'),
    infoHeading: text(
      'A dense city block where homes, shops and parking operate as one system.',
      'Un ilot urbain dense ou logements, commerces et parkings fonctionnent comme un seul systeme.',
    ),
    infoParagraph: text(
      'The project demonstrates how mixed-use delivery depends on coordination: residential circulation, commercial frontage, parking levels, structure and exterior works all need to land together for the complex to feel legible and usable.',
      'Le projet montre combien la realisation mixte depend de la coordination: circulations residentielles, facades commerciales, niveaux de parking, structure et amenagements exterieurs doivent converger pour rendre l ensemble lisible et utilisable.',
    ),
    ctaLabel: text('SEE THE COMPLEX', 'VOIR LE COMPLEXE'),
    scopeItems: [
      item('building', 'Five-block mixed real-estate delivery', 'Realisation immobiliere mixte de cinq blocs'),
      item('home', '202 free promotional housing units', '202 logements promotionnels libres'),
      item('commerce', 'Three levels dedicated to commercial activity', 'Trois niveaux dedies aux activites commerciales'),
      item('parking', 'Two underground parking levels', 'Deux niveaux de parking en sous-sol'),
    ],
  },

  'rouiba-4-promotional-villas': {
    heroDescription: text(
      'Four free promotional villas in Rouiba, delivered with full TCE, VRD, exterior access and contemporary residential finishes.',
      'Quatre villas promotionnelles libres a Rouiba, realisees en TCE avec VRD, acces exterieurs et finitions residentielles contemporaines.',
    ),
    intro: text(
      'Rouiba focuses on a compact villa programme where privacy, access and exterior works are as important as the buildings themselves.',
      'Rouiba se concentre sur un programme compact de villas ou l intimite, les acces et les amenagements exterieurs comptent autant que les batiments.',
    ),
    columns: [
      text(
        'Igloo delivered the villas as a complete site package: reinforced-concrete structures, internal and external finishes, MEP networks, roads and pedestrian access.',
        'Igloo a livre les villas comme un ensemble complet: structures en beton arme, finitions interieures et exterieures, reseaux MEP, voiries et acces pietons.',
      ),
      text(
        'The project uses clean contemporary volumes and exterior arrangements to create a small-scale residential setting with durability, independence and comfort.',
        'Le projet s appuie sur des volumes contemporains epures et des amenagements exterieurs pour creer un cadre residentiel a petite echelle, durable, independant et confortable.',
      ),
    ],
    statement: text(
      'A small villa programme where the quality is carried by execution: access, networks, facades and finishing details aligned from site to handover.',
      'Un petit programme de villas dont la qualite tient a l execution: acces, reseaux, facades et finitions alignes du chantier a la livraison.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Free promotional villas', 'Villas promotionnelles libres'),
      fact('Location', 'Localisation', 'Rouiba, Algiers, Algeria', 'Rouiba, Alger, Algerie'),
      fact('Units', 'Unites', '4 individual villas', '4 villas individuelles'),
      fact('Completion', 'Achevement', '2023', '2023'),
      fact('Works', 'Travaux', 'TCE with VRD', 'TCE avec VRD'),
      fact('Use', 'Usage', 'Individual residential housing', 'Habitat residentiel individuel'),
    ],
    metric: '4',
    metricLabel: text('VILLAS', 'VILLAS'),
    metricCaptionLines: {
      en: ['INDIVIDUAL HOMES', 'TCE + VRD', 'CONTEMPORARY FACADES'],
      fr: ['HABITAT INDIVIDUEL', 'TCE + VRD', 'FACADES CONTEMPORAINES'],
    },
    infoTopline: text('SITE DELIVERY', 'REALISATION DU SITE'),
    infoEyebrow: text('PRIVATE RESIDENTIAL', 'RESIDENTIEL PRIVE'),
    infoHeading: text(
      'Four villas delivered as a complete residential environment, not just four buildings.',
      'Quatre villas livrees comme un environnement residentiel complet, pas seulement quatre batiments.',
    ),
    infoParagraph: text(
      'The Rouiba operation ties construction quality to the surrounding works: roads, utility networks, access points, exterior arrangements and facade finishes all support the everyday comfort of the villas.',
      'L operation de Rouiba relie la qualite de construction aux ouvrages qui l entourent: voiries, reseaux, points d acces, amenagements exterieurs et finitions de facade accompagnent le confort quotidien des villas.',
    ),
    ctaLabel: text('SEE THE VILLAS', 'VOIR LES VILLAS'),
    scopeItems: [
      item('villa', '4 free promotional villas', '4 villas promotionnelles libres'),
      item('network', 'VRD, vehicle access and pedestrian access', 'VRD, acces vehicules et acces pietons'),
      item('building', 'Reinforced-concrete structures with contemporary facades', 'Structures en beton arme avec facades contemporaines'),
      item('delivery', 'Completed in 2023 with full TCE coordination', 'Acheve en 2023 avec coordination complete TCE'),
    ],
  },

  'sidi-benour-50-housing': {
    heroDescription: text(
      'A 50-home R+13 residential delivery in Sidi Benour, part of a wider 362-home free promotional housing programme.',
      'Une realisation residentielle R+13 de 50 logements a Sidi Benour, inscrite dans un programme global de 362 logements promotionnels libres.',
    ),
    intro: text(
      'Sidi Benour is a vertical housing operation designed to answer demand for quality homes while improving access, networks and exterior organisation.',
      'Sidi Benour est une operation de logement vertical concue pour repondre a la demande en logements de qualite tout en ameliorant les acces, les reseaux et l organisation exterieure.',
    ),
    columns: [
      text(
        'The project combines TCE and VRD delivery for a R+13 residential building, coordinating structure, facades, technical systems and exterior circulation.',
        'Le projet associe TCE et VRD pour un immeuble residentiel R+13, en coordonnant structure, facades, systemes techniques et circulations exterieures.',
      ),
      text(
        'Vertical lines, projecting balconies and controlled facade treatments give the building its identity, while utility networks and access works make the residence operational.',
        'Lignes verticales, balcons en saillie et traitement maitrise des facades donnent son identite au batiment, tandis que reseaux et acces rendent la residence operationnelle.',
      ),
    ],
    statement: text(
      'A high-rise residential delivery where structure, facade rhythm, VRD and technical systems meet the demands of dense urban housing.',
      'Une realisation residentielle en hauteur ou structure, rythme de facade, VRD et systemes techniques repondent aux exigences de l habitat urbain dense.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Free promotional housing (LPL)', 'Logements promotionnels libres (LPL)'),
      fact('Location', 'Localisation', 'Sidi Benour, Mehelma, Algiers', 'Sidi Benour, Mehelma, Alger'),
      fact('Programme', 'Programme', '50 homes within a 362-home programme', '50 logements dans un programme de 362 logements'),
      fact('Completion', 'Achevement', '2025', '2025'),
      fact('Typology', 'Typologie', 'R+13 residential building', 'Immeuble residentiel R+13'),
      fact('Works', 'Travaux', 'TCE with VRD', 'TCE avec VRD'),
    ],
    metric: '50/362',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['R+13 BUILDING', 'TCE + VRD', 'HIGH-RISE RESIDENTIAL'],
      fr: ['BATIMENT R+13', 'TCE + VRD', 'HABITAT EN HAUTEUR'],
    },
    infoTopline: text('VERTICAL HOUSING', 'HABITAT VERTICAL'),
    infoEyebrow: text('R+13 RESIDENCE', 'RESIDENCE R+13'),
    infoHeading: text(
      'A vertical residential block completed through structure, networks and facade discipline.',
      'Un bloc residentiel vertical acheve par la structure, les reseaux et la discipline des facades.',
    ),
    infoParagraph: text(
      'The Sidi Benour project highlights Igloo ability to deliver a high-rise housing sequence: reinforced concrete, exterior networks, MEP systems, facade work and circulation are coordinated to create a functional residence.',
      'Le projet de Sidi Benour met en avant la capacite d Igloo a livrer une sequence de logements en hauteur: beton arme, reseaux exterieurs, systemes MEP, facades et circulations sont coordonnes pour former une residence fonctionnelle.',
    ),
    ctaLabel: text('SEE THE RESIDENCE', 'VOIR LA RESIDENCE'),
    scopeItems: [
      item('home', '50 homes delivered within a 362-home programme', '50 logements realises dans un programme de 362 logements'),
      item('building', 'R+13 residential building', 'Immeuble residentiel R+13'),
      item('network', 'TCE, VRD, MEP and exterior access', 'TCE, VRD, MEP et acces exterieurs'),
      item('delivery', 'Completed in 2025 with coordinated execution', 'Acheve en 2025 avec une execution coordonnee'),
    ],
  },

  'dely-brahim-240-housing': {
    heroDescription: text(
      'A 33-storey residential tower in Dely Brahim, combining 240 free promotional homes, commercial surfaces, services and underground parking.',
      'Une tour residentielle de 33 etages a Dely Brahim, combinant 240 logements promotionnels libres, surfaces commerciales, services et parkings en sous-sol.',
    ),
    intro: text(
      'Dely Brahim pushes the portfolio upward: a 33-storey tower with four entresol levels, eight homes per floor and a mixed programme at its base.',
      'Dely Brahim fait monter le portfolio en hauteur: une tour de 33 etages avec quatre niveaux d entresol, huit logements par etage et un programme mixte en pied d immeuble.',
    ),
    columns: [
      text(
        'The operation combines housing density with everyday services, placing F3, F4 and F5 homes above commercial surfaces, service spaces and basement parking.',
        'L operation associe densite residentielle et services du quotidien, avec logements F3, F4 et F5 au-dessus de surfaces commerciales, services et parkings en sous-sol.',
      ),
      text(
        'Its technical challenge is vertical coordination: structure, elevators, fire safety, ventilation, plumbing, electricity, facade openings and exterior works all need a single execution rhythm.',
        'Son enjeu technique tient a la coordination verticale: structure, ascenseurs, securite incendie, ventilation, plomberie, electricite, ouvertures de facade et VRD doivent suivre un seul rythme d execution.',
      ),
    ],
    statement: text(
      'A high-rise mixed residential tower where density, services and parking are coordinated into one vertical living system.',
      'Une tour residentielle mixte ou densite, services et stationnement sont coordonnes dans un systeme de vie vertical.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Free promotional housing with services', 'Logements promotionnels libres avec services'),
      fact('Location', 'Localisation', 'Bois des Cars, Dely Brahim, Algiers', 'Bois des Cars, Dely Brahim, Alger'),
      fact('Housing units', 'Logements', '240 homes', '240 logements'),
      fact('Typology', 'Typologie', '33-storey tower, 4 entresol levels and ground floor', 'Tour de 33 etages, 4 entre-sols et RDC'),
      fact('Parking', 'Parking', 'Underground parking levels', 'Parkings en sous-sol'),
      fact('Status', 'Statut', 'In progress', 'En cours de realisation'),
    ],
    metric: '240',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['33-STOREY TOWER', '8 HOMES PER FLOOR', 'SERVICES + PARKING'],
      fr: ['TOUR DE 33 ETAGES', '8 LOGEMENTS PAR ETAGE', 'SERVICES + PARKING'],
    },
    infoTopline: text('HIGH-RISE SCOPE', 'PORTEE EN HAUTEUR'),
    infoEyebrow: text('TOWER DELIVERY', 'REALISATION DE TOUR'),
    infoHeading: text(
      'A vertical neighbourhood built around homes, services and underground parking.',
      'Un quartier vertical construit autour des logements, des services et du stationnement en sous-sol.',
    ),
    infoParagraph: text(
      'Dely Brahim demands the precision of a large vertical project: secondary trades, technical systems, facade openings, commercial areas and parking access are coordinated so the tower can support daily life at scale.',
      'Dely Brahim exige la precision d un grand projet vertical: corps secondaires, systemes techniques, ouvertures de facade, surfaces commerciales et acces parking sont coordonnes pour accompagner la vie quotidienne a grande echelle.',
    ),
    ctaLabel: text('SEE THE TOWER', 'VOIR LA TOUR'),
    scopeItems: [
      item('building', '33-storey residential tower', 'Tour residentielle de 33 etages'),
      item('home', '240 homes with F3, F4 and F5 layouts', '240 logements avec typologies F3, F4 et F5'),
      item('parking', 'Four entresol levels and underground parking', 'Quatre entre-sols et parkings en sous-sol'),
      item('network', 'CES, VRD, MEP, lifts and safety systems', 'CES, VRD, MEP, ascenseurs et securite'),
    ],
  },

  'bas-mazagran-200-38-housing': {
    heroDescription: text(
      'Seven residential blocks in Bas Mazagran, combining assisted and free promotional housing with ground-floor commercial spaces and VRD.',
      'Sept blocs residentiels a Bas Mazagran, combinant logements promotionnels aides et libres avec commerces en rez-de-chaussee et VRD.',
    ),
    intro: text(
      'Bas Mazagran is planned as a family-oriented residential ensemble, with R+5 and R+9 blocks, F3/F4 homes and commercial spaces that activate the ground level.',
      'Bas Mazagran est pense comme un ensemble residentiel familial, avec blocs R+5 et R+9, logements F3/F4 et commerces qui activent le rez-de-chaussee.',
    ),
    columns: [
      text(
        'The project brings together 200 assisted homes and 38 free promotional homes across seven blocks, with four apartments per floor and commercial premises at street level.',
        'Le projet reunit 200 logements aides et 38 logements promotionnels libres sur sept blocs, avec quatre appartements par etage et des commerces au niveau de la rue.',
      ),
      text(
        'Its quality depends on the finishing of the second works now in progress: seismic-compliant structure, thermal facade treatment, technical networks, exterior roads, parking and pedestrian routes.',
        'Sa qualite depend de la finalisation du second oeuvre en cours: structure conforme aux normes parasismiques, traitement thermique des facades, reseaux techniques, voiries, parkings et cheminements pietons.',
      ),
    ],
    statement: text(
      'A seven-block residential programme where housing mix, ground-floor commerce and exterior infrastructure are built into one urban address.',
      'Un programme residentiel de sept blocs ou mixite de logements, commerces en rez-de-chaussee et infrastructures exterieures forment une adresse urbaine complete.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Promotional housing with commerce', 'Logements promotionnels avec commerces'),
      fact('Location', 'Localisation', 'Bas Mazagran, Mostaganem, Algeria', 'Bas Mazagran, Mostaganem, Algerie'),
      fact('Programme', 'Programme', '200 assisted homes + 38 free promotional homes', '200 logements aides + 38 logements promotionnels libres'),
      fact('Blocks', 'Blocs', '7 blocks, R+5 and R+9', '7 blocs, R+5 et R+9'),
      fact('Completion target', 'Date prevue', 'October 2026', 'Octobre 2026'),
      fact('Status', 'Statut', 'Advanced construction', 'Chantier avance'),
    ],
    metric: '238',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['7 BLOCKS', 'R+5 AND R+9', 'GROUND-FLOOR COMMERCE'],
      fr: ['7 BLOCS', 'R+5 ET R+9', 'COMMERCES EN RDC'],
    },
    infoTopline: text('MIXED HOUSING', 'HABITAT MIXTE'),
    infoEyebrow: text('BAS MAZAGRAN', 'BAS MAZAGRAN'),
    infoHeading: text(
      'A family housing programme made stronger by commerce, access and exterior infrastructure.',
      'Un programme de logements familiaux renforce par le commerce, les acces et les infrastructures exterieures.',
    ),
    infoParagraph: text(
      'The Mostaganem project balances assisted and free promotional units with shops, networks and exterior spaces. Igloo scope ties the seven blocks to roads, utilities, parking and pedestrian movement so the ensemble can function as a complete residential district.',
      'Le projet de Mostaganem equilibre logements aides et logements libres avec commerces, reseaux et espaces exterieurs. La portee d Igloo relie les sept blocs aux voiries, utilites, parkings et cheminements pour former un quartier residentiel complet.',
    ),
    ctaLabel: text('SEE THE BLOCKS', 'VOIR LES BLOCS'),
    scopeItems: [
      item('home', '238 homes across assisted and free promotional programmes', '238 logements entre programmes aides et libres'),
      item('building', 'Seven R+5 and R+9 residential blocks', 'Sept blocs residentiels R+5 et R+9'),
      item('commerce', 'Ground-floor commercial spaces', 'Espaces commerciaux en rez-de-chaussee'),
      item('network', 'VRD, utilities, parking and pedestrian routes', 'VRD, reseaux, parkings et cheminements pietons'),
    ],
  },

  'reghaia-bouraada-250-housing': {
    heroDescription: text(
      'A 250-home rent-to-own residential ensemble in Bouraada, Reghaia, completed with commercial premises, concierge spaces and secondary works.',
      'Un ensemble residentiel location-vente de 250 logements a Bouraada, Reghaia, acheve avec locaux commerciaux, conciergeries et corps secondaires.',
    ),
    intro: text(
      'Reghaia organises seven R+9 blocks around practical family housing, local services and concierge spaces that make the residence easier to live in.',
      'Reghaia organise sept blocs R+9 autour de logements familiaux pratiques, de services de proximite et de conciergeries qui facilitent la vie de la residence.',
    ),
    columns: [
      text(
        'The programme delivers 250 rent-to-own homes, with four units per floor and a clear F3/F4 mix supported by commercial premises and concierge spaces.',
        'Le programme livre 250 logements location-vente, avec quatre logements par etage et une repartition claire F3/F4 appuyee par des locaux commerciaux et des conciergeries.',
      ),
      text(
        'Igloo completed the remaining secondary works, facade execution, technical installations and exterior arrangements, bringing the seven-block site to a usable residential standard.',
        'Igloo a acheve le reste des corps secondaires, les facades, les installations techniques et les amenagements exterieurs, portant le site de sept blocs a un niveau residentiel operationnel.',
      ),
    ],
    statement: text(
      'A seven-block rent-to-own programme completed through the quiet work that makes housing livable: facades, finishes, networks and daily service spaces.',
      'Un programme location-vente de sept blocs acheve par le travail discret qui rend le logement habitable: facades, finitions, reseaux et espaces de service quotidien.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'Rent-to-own housing with premises', 'Logements location-vente avec locaux'),
      fact('Location', 'Localisation', 'Bouraada, Reghaia, Algiers', 'Bouraada, Reghaia, Alger'),
      fact('Housing units', 'Logements', '250 homes', '250 logements'),
      fact('Blocks', 'Blocs', '7 R+9 blocks', '7 blocs R+9'),
      fact('Completion', 'Achevement', '2025', '2025'),
      fact('Client', 'Client', 'AADL', 'AADL'),
    ],
    metric: '250',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['7 R+9 BLOCKS', 'F3 AND F4 HOMES', 'COMMERCIAL + CONCIERGE'],
      fr: ['7 BLOCS R+9', 'LOGEMENTS F3 ET F4', 'COMMERCES + CONCIERGERIES'],
    },
    infoTopline: text('RESIDENTIAL COMPLETION', 'ACHEVEMENT RESIDENTIEL'),
    infoEyebrow: text('RENT-TO-OWN HOUSING', 'LOCATION-VENTE'),
    infoHeading: text(
      'Seven residential blocks completed with the services and finishes residents use every day.',
      'Sept blocs residentiels acheves avec les services et finitions utilises chaque jour par les habitants.',
    ),
    infoParagraph: text(
      'Reghaia is defined by practical residential completion: facade works, interior finishes, MEP systems, commercial premises, concierge spaces, access routes and exterior areas are coordinated into one finished environment.',
      'Reghaia se definit par un achevement residentiel concret: facades, finitions interieures, systemes MEP, locaux commerciaux, conciergeries, acces et espaces exterieurs sont coordonnes dans un environnement fini.',
    ),
    ctaLabel: text('SEE THE RESIDENCE', 'VOIR LA RESIDENCE'),
    scopeItems: [
      item('home', '250 rent-to-own housing units', '250 logements en formule location-vente'),
      item('building', 'Seven R+9 residential blocks', 'Sept blocs residentiels R+9'),
      item('commerce', 'Commercial premises and concierge spaces', 'Locaux commerciaux et conciergeries'),
      item('delivery', 'Completed in 2025 with secondary works and facades', 'Acheve en 2025 avec corps secondaires et facades'),
    ],
  },

  'boudouaou-70-10-housing': {
    heroDescription: text(
      'An 80-home mixed residential programme in Boudouaou, combining assisted and free promotional housing with professional and commercial premises.',
      'Un programme residentiel mixte de 80 logements a Boudouaou, associant logements promotionnels aides et libres avec locaux professionnels et commerciaux.',
    ),
    intro: text(
      'Boudouaou combines 70 LPA homes, 10 LPL homes and 10 professional/commercial premises across three blocks with different heights.',
      'Boudouaou associe 70 logements LPA, 10 logements LPL et 10 locaux professionnels/commerciaux dans trois blocs de hauteurs differentes.',
    ),
    columns: [
      text(
        'The development is organised across blocks A and B in R+8 and block C in R+5, with four homes per floor and a balanced F3/F4 mix.',
        'Le developpement s organise autour des blocs A et B en R+8 et du bloc C en R+5, avec quatre logements par etage et une repartition equilibree F3/F4.',
      ),
      text(
        'Igloo delivered secondary trades, viabilisation and tertiary networks, aligning finishes, waterproofing, joinery, MEP, roads and exterior arrangements with the mixed-use programme.',
        'Igloo a realise les corps secondaires, la viabilisation et les reseaux tertiaires, en alignant finitions, etancheite, menuiseries, MEP, voiries et amenagements exterieurs avec le programme mixte.',
      ),
    ],
    statement: text(
      'A compact mixed residential programme where three blocks, local premises and site networks are delivered as one usable neighbourhood setting.',
      'Un programme residentiel mixte compact ou trois blocs, locaux de proximite et reseaux de site sont livres comme un cadre de quartier utilisable.',
    ),
    facts: [
      fact('Project type', 'Nature du projet', 'LPA and LPL housing with premises', 'Logements LPA et LPL avec locaux'),
      fact('Location', 'Localisation', 'Boudouaou, Boumerdes, Algeria', 'Boudouaou, Boumerdes, Algerie'),
      fact('Housing units', 'Logements', '80 homes (70 LPA + 10 LPL)', '80 logements (70 LPA + 10 LPL)'),
      fact('Blocks', 'Blocs', '3 blocks: R+8, R+8 and R+5', '3 blocs: R+8, R+8 et R+5'),
      fact('Completion', 'Achevement', '2025', '2025'),
      fact('Client', 'Client', 'AADL', 'AADL'),
    ],
    metric: '80',
    metricLabel: text('HOMES', 'LOGEMENTS'),
    metricCaptionLines: {
      en: ['70 LPA + 10 LPL', '3 RESIDENTIAL BLOCKS', '10 PROFESSIONAL PREMISES'],
      fr: ['70 LPA + 10 LPL', '3 BLOCS RESIDENTIELS', '10 LOCAUX PROFESSIONNELS'],
    },
    infoTopline: text('MIXED RESIDENTIAL', 'RESIDENTIEL MIXTE'),
    infoEyebrow: text('BOUDOUAOU', 'BOUDOUAOU'),
    infoHeading: text(
      'A three-block residential ensemble strengthened by local premises and complete site servicing.',
      'Un ensemble residentiel de trois blocs renforce par les locaux de proximite et la viabilisation complete du site.',
    ),
    infoParagraph: text(
      'Boudouaou stands out through its balance: assisted and free promotional housing, professional premises, varied block heights and tertiary networks are coordinated so the development supports both homes and local activity.',
      'Boudouaou se distingue par son equilibre: logements aides et libres, locaux professionnels, hauteurs de blocs variees et reseaux tertiaires sont coordonnes pour soutenir a la fois l habitat et l activite locale.',
    ),
    ctaLabel: text('SEE THE BLOCKS', 'VOIR LES BLOCS'),
    scopeItems: [
      item('home', '80 homes, including 70 LPA and 10 LPL units', '80 logements, dont 70 LPA et 10 LPL'),
      item('building', 'Three blocks with R+8 and R+5 typologies', 'Trois blocs avec typologies R+8 et R+5'),
      item('commerce', '10 commercial and professional premises', '10 locaux commerciaux et professionnels'),
      item('network', 'Secondary trades, viabilisation and tertiary networks', 'Corps secondaires, viabilisation et reseaux tertiaires'),
    ],
  },
};

export function getProjectEditorialContent(project: ProjectRecord) {
  return projectEditorialContent[project.slug];
}
