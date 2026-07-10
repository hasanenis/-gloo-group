import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  Building2,
  FolderOpen,
  Home,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { companyProfile } from '../data/projects';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { useLocale, type Locale } from '../i18n';
import { cn } from '../lib/utils';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type PanelMode = 'assistant' | null;
type AssistantTopicId =
  | 'newProject'
  | 'residential'
  | 'commercial'
  | 'infrastructure'
  | 'process'
  | 'portfolio'
  | 'company'
  | 'contact';

type AssistantAction =
  | { label: string; href: string }
  | { label: string; path: string };

type AssistantTopic = {
  id: AssistantTopicId;
  label: string;
  description: string;
  answerIds: string[];
  keywords: string[];
};

type PreAnswer = {
  id: string;
  topicId: AssistantTopicId;
  label: string;
  answer: string;
  nextStep: string;
  actions: AssistantAction[];
  keywords: string[];
};

type ChatMessage = {
  id: string;
  role: 'bot' | 'user';
  title?: string;
  body: string;
  note?: string;
  actions?: AssistantAction[];
  answerIds?: string[];
  topicIds?: AssistantTopicId[];
  tone?: 'normal' | 'system';
};

type AssistantContent = {
  labels: {
    title: string;
    eyebrow: string;
    launcher: string;
    placeholder: string;
    chooseTopic: string;
    chooseAnswer: string;
    preparedAnswer: string;
    notSureTitle: string;
    fallback: string;
  };
  topics: AssistantTopic[];
  answers: PreAnswer[];
};

const assistantProfile = {
  name: 'Lina',
  role: {
    en: 'Algeria project desk',
    fr: 'Bureau projets Algerie',
  },
  image: '/assistant/igloo-assistant-lina.png',
};

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const normalizeSearchText = (value: string) =>
  value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const SEARCH_STOPWORDS = new Set([
  'about',
  'also',
  'avec',
  'comment',
  'could',
  'dans',
  'does',
  'have',
  'nous',
  'pour',
  'quoi',
  'should',
  'that',
  'this',
  'vous',
  'what',
  'when',
  'where',
  'which',
  'with',
  'would',
  'your',
]);

const buildAssistantContent = (
  emailHref: string,
  phoneHref: string,
): Record<Locale, AssistantContent> => ({
  en: {
    labels: {
      title: 'Igloo Assistant',
      eyebrow: 'Client project assistant',
      launcher: 'Can I help?',
      placeholder: 'Ask about a project, quote, location...',
      chooseTopic: 'Choose a client topic or type your project question.',
      chooseAnswer: 'Pick a prepared answer below.',
      preparedAnswer: 'Prepared answer',
      notSureTitle: 'Project desk',
      fallback:
        'I could not match that exactly. For client requests, send your name, phone, project type, location, and the subject. I can also help you choose a topic below.',
    },
    topics: [
      {
        id: 'newProject',
        label: 'Start a project / quote',
        description:
          'Prepare the first information Igloo needs for a residential, commercial, or mixed-use construction request.',
        answerIds: ['quote-info', 'quote-documents', 'site-visit'],
        keywords: ['quote', 'estimate', 'new project', 'start project', 'price', 'cost', 'teklif', 'fiyat'],
      },
      {
        id: 'residential',
        label: 'Housing, villas, apartments',
        description:
          'Ask about housing blocks, villas, residential complexes, parking, commercial ground floors, and site delivery.',
        answerIds: ['housing-scope', 'villa-network', 'apartment-mixed'],
        keywords: ['housing', 'villa', 'apartment', 'residential', 'logement', 'konut', 'daire'],
      },
      {
        id: 'commercial',
        label: 'Commercial / mixed-use',
        description:
          'For commercial centres, mixed real estate, service spaces, finishes, and public-facing premises.',
        answerIds: ['commercial-scope', 'mixed-use', 'finishing-works'],
        keywords: ['commercial', 'mixed use', 'retail', 'shop', 'office', 'centre', 'magasin'],
      },
      {
        id: 'infrastructure',
        label: 'Roads & networks',
        description:
          'For roadworks, utility networks, site access, external works, and infrastructure around a development.',
        answerIds: ['roads-networks', 'site-infrastructure'],
        keywords: ['roads', 'network', 'infrastructure', 'utility', 'vrd', 'yol', 'altyapi'],
      },
      {
        id: 'process',
        label: 'How the process works',
        description:
          'Understand first contact, project review, documents, timing, coordination, and what happens before a formal offer.',
        answerIds: ['first-call', 'timeline', 'quality-safety'],
        keywords: ['process', 'timeline', 'how works', 'deadline', 'review', 'surec', 'delai'],
      },
      {
        id: 'portfolio',
        label: 'Project examples',
        description:
          'Browse examples from completed and current Igloo projects across Algiers and other Algerian locations.',
        answerIds: ['projects-summary', 'current-projects'],
        keywords: ['projects', 'portfolio', 'examples', 'references', 'projeler', 'references'],
      },
      {
        id: 'company',
        label: 'Company & capabilities',
        description:
          'Learn who Igloo is, what the company builds, and which project types the team can discuss with clients.',
        answerIds: ['why-choose-igloo', 'company-profile', 'capabilities'],
        keywords: [
          'company',
          'about',
          'capabilities',
          'igloo',
          'profile',
          'why choose',
          'choose you',
          'why igloo',
          'neden igloo',
          'neden sizi secelim',
          'hakkinda',
        ],
      },
      {
        id: 'contact',
        label: 'Contact a project advisor',
        description:
          'Get the fastest route to share a project brief with Igloo by email, phone, or the contact section.',
        answerIds: ['contact-office', 'contact-brief'],
        keywords: ['contact', 'phone', 'email', 'call', 'address', 'iletisim'],
      },
    ],
    answers: [
      {
        id: 'quote-info',
        topicId: 'newProject',
        label: 'What do I send for a quote?',
        answer:
          'Send the project location, building type, approximate surface, current stage, drawings if available, target start date, and the scope you expect from Igloo.',
        nextStep:
          'A short project brief is enough for the first review. If you have plans, photos, land details, or permit status, attach them too.',
        actions: [
          { label: 'Email project brief', href: emailHref },
          { label: 'Call project desk', href: phoneHref },
        ],
        keywords: ['quote', 'estimate', 'price', 'cost', 'budget', 'devis', 'teklif', 'fiyat'],
      },
      {
        id: 'quote-documents',
        topicId: 'newProject',
        label: 'Which documents help?',
        answer:
          'Useful documents include architectural plans, land or location details, permit status, target programme, site photos, desired scope, and known constraints.',
        nextStep:
          'No plans yet? Send the location, project type, approximate size, and a short description of what you want to build.',
        actions: [
          { label: 'Send documents', href: emailHref },
          { label: 'See projects', path: '/projects' },
        ],
        keywords: ['documents', 'plans', 'drawing', 'permit', 'photo', 'file', 'dosya', 'plan'],
      },
      {
        id: 'site-visit',
        topicId: 'newProject',
        label: 'Can we request a site review?',
        answer:
          'Yes. For a site review request, share the exact location, access conditions, project type, current site status, and your preferred contact time.',
        nextStep:
          'The team can then decide whether the first step should be a call, document review, or site discussion.',
        actions: [
          { label: 'Request review', href: emailHref },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['site visit', 'site review', 'location review', 'inspection', 'saha', 'chantier'],
      },
      {
        id: 'housing-scope',
        topicId: 'residential',
        label: 'Residential project scope',
        answer:
          'Igloo can discuss residential projects such as housing blocks, apartments, villas, mixed residential sites, parking, commercial ground floors, roads, and networks.',
        nextStep:
          'Share the number of units, site location, built area, current design stage, and whether roads/networks are included.',
        actions: [
          { label: 'Email residential brief', href: emailHref },
          { label: 'View projects', path: '/projects' },
        ],
        keywords: ['residential', 'housing', 'apartments', 'units', 'logement', 'konut'],
      },
      {
        id: 'villa-network',
        topicId: 'residential',
        label: 'Villa and network works',
        answer:
          'For villa projects, include the number of villas, plot location, access roads, utility network needs, boundary works, and desired delivery scope.',
        nextStep:
          'Photos, site plan, and utility information make the first review much stronger.',
        actions: [
          { label: 'Send villa brief', href: emailHref },
          { label: 'Call', href: phoneHref },
        ],
        keywords: ['villa', 'villas', 'network', 'roads', 'utility', 'plot', 'parcelle'],
      },
      {
        id: 'apartment-mixed',
        topicId: 'residential',
        label: 'Apartment or mixed residential',
        answer:
          'For apartments or mixed residential, send unit count, block count, parking levels, commercial areas, services, and any phasing requirements.',
        nextStep:
          'Mention if you need full construction, secondary works, infrastructure, or a specific package.',
        actions: [
          { label: 'Email project data', href: emailHref },
          { label: 'Project examples', path: '/projects' },
        ],
        keywords: ['apartment', 'mixed residential', 'parking', 'commercial area', 'block', 'daire'],
      },
      {
        id: 'commercial-scope',
        topicId: 'commercial',
        label: 'Commercial project scope',
        answer:
          'For commercial spaces, Igloo can discuss centres, retail/service premises, finishing works, technical networks, circulation, and integration with housing sites.',
        nextStep:
          'Send the location, surface, intended use, shell condition, desired opening date, and required scope.',
        actions: [
          { label: 'Send commercial brief', href: emailHref },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['commercial', 'retail', 'shop', 'centre', 'service', 'premises', 'magasin'],
      },
      {
        id: 'mixed-use',
        topicId: 'commercial',
        label: 'Mixed-use development',
        answer:
          'For mixed-use developments, include residential units, commercial surfaces, parking, access, service areas, and phasing constraints.',
        nextStep:
          'The first review should clarify what is structural, what is finishing, and what is infrastructure.',
        actions: [
          { label: 'Email mixed-use brief', href: emailHref },
          { label: 'See examples', path: '/projects' },
        ],
        keywords: ['mixed use', 'mixed-use', 'residential commercial', 'parking', 'services'],
      },
      {
        id: 'finishing-works',
        topicId: 'commercial',
        label: 'Finishing and secondary works',
        answer:
          'For finishing or secondary works, send existing site status, drawings, material expectations, technical networks, quantities, and deadline.',
        nextStep:
          'If the structure is already built, photos and current condition notes are very useful.',
        actions: [
          { label: 'Send scope', href: emailHref },
          { label: 'Call project desk', href: phoneHref },
        ],
        keywords: ['finishing', 'secondary works', 'fit out', 'facade', 'interior', 'second oeuvre'],
      },
      {
        id: 'roads-networks',
        topicId: 'infrastructure',
        label: 'Roads and utility networks',
        answer:
          'For roads and networks, send site plan, access requirements, drainage, utility needs, road lengths, connection points, and coordination constraints.',
        nextStep:
          'The team can review whether these works are part of a wider building package or a separate scope.',
        actions: [
          { label: 'Email infrastructure brief', href: emailHref },
          { label: 'View projects', path: '/projects' },
        ],
        keywords: ['roads', 'networks', 'drainage', 'utility', 'vrd', 'yol', 'altyapi'],
      },
      {
        id: 'site-infrastructure',
        topicId: 'infrastructure',
        label: 'Site infrastructure around a project',
        answer:
          'For site infrastructure, mention access roads, platforms, external works, service networks, parking, public areas, and any authority constraints.',
        nextStep:
          'A combined building plus infrastructure scope should be explained clearly in the first brief.',
        actions: [
          { label: 'Send site brief', href: emailHref },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['site infrastructure', 'external works', 'parking', 'access', 'platform', 'voirie'],
      },
      {
        id: 'first-call',
        topicId: 'process',
        label: 'What happens first?',
        answer:
          'The first step is usually a short review of your project brief: location, type, surface, drawings, scope, timing, and client contact details.',
        nextStep:
          'After that, Igloo can suggest whether to continue with a call, document review, or project meeting.',
        actions: [
          { label: 'Email brief', href: emailHref },
          { label: 'Call', href: phoneHref },
        ],
        keywords: ['first step', 'process', 'how works', 'meeting', 'call', 'surec'],
      },
      {
        id: 'timeline',
        topicId: 'process',
        label: 'How fast can Igloo respond?',
        answer:
          'Response time depends on the clarity of the brief. Complete location, drawings, scope, and target dates make the first review faster.',
        nextStep:
          'For urgent client requests, send the brief by email and call the office with the same project reference.',
        actions: [
          { label: 'Email now', href: emailHref },
          { label: 'Call office', href: phoneHref },
        ],
        keywords: ['timeline', 'urgent', 'fast', 'deadline', 'when', 'ne zaman', 'acil'],
      },
      {
        id: 'quality-safety',
        topicId: 'process',
        label: 'Quality and coordination',
        answer:
          'Igloo works through coordinated project delivery, technical review, site management, and clear communication between client, design, and construction teams.',
        nextStep:
          'For a serious project request, share drawings and expected quality level early so the scope is aligned.',
        actions: [
          { label: 'Company section', path: '/#about' },
          { label: 'Contact team', path: '/#contact' },
        ],
        keywords: ['quality', 'coordination', 'site management', 'safety', 'communication'],
      },
      {
        id: 'projects-summary',
        topicId: 'portfolio',
        label: 'Show me project examples',
        answer:
          'The project index includes housing, villas, mixed-use, commercial centres, roads, networks, and current delivery examples across Algerian locations.',
        nextStep:
          'Open the project index to compare type, status, location, and delivery scope.',
        actions: [
          { label: 'Open projects', path: '/projects' },
          { label: 'Ask for quote', href: emailHref },
        ],
        keywords: ['projects', 'examples', 'portfolio', 'references', 'projeler'],
      },
      {
        id: 'current-projects',
        topicId: 'portfolio',
        label: 'Current and completed work',
        answer:
          'Igloo presents both completed and current projects, including residential, promotional housing, commercial premises, and coordinated infrastructure works.',
        nextStep:
          'If one project is similar to yours, mention it in your message so the team understands your reference point.',
        actions: [
          { label: 'See project index', path: '/projects' },
          { label: 'Email reference', href: emailHref },
        ],
        keywords: ['current projects', 'completed', 'similar project', 'reference'],
      },
      {
        id: 'why-choose-igloo',
        topicId: 'company',
        label: 'Why choose Igloo?',
        answer:
          'Choose Igloo when you want an Algeria-based construction team that can connect buildings, roads, networks, site coordination, and client communication in one practical project conversation.',
        nextStep:
          'Share your project type, location, size, current stage, and target date. Lina can route it to the right project advisor instead of sending you through unrelated questions.',
        actions: [
          { label: 'See projects', path: '/projects' },
          { label: 'Email project desk', href: emailHref },
        ],
        keywords: [
          'why choose',
          'why should we choose you',
          'choose you',
          'why igloo',
          'why work with you',
          'reason to choose',
          'neden sizi secelim',
          'neden igloo',
        ],
      },
      {
        id: 'company-profile',
        topicId: 'company',
        label: 'Who is Igloo?',
        answer:
          'SARL Igloo Yapi Construction is based in Bir Khadem, Algiers and works on residential, mixed-use, road, network, and coordinated site delivery.',
        nextStep:
          'Clients can review the company section or send a request for a project discussion.',
        actions: [
          { label: 'Company section', path: '/#about' },
          { label: 'Email project desk', href: emailHref },
        ],
        keywords: ['who is igloo', 'company profile', 'about', 'hakkinda', 'qui est'],
      },
      {
        id: 'capabilities',
        topicId: 'company',
        label: 'What can Igloo build?',
        answer:
          'Igloo can discuss housing, villas, mixed real estate, commercial premises, secondary works, roads, networks, and site infrastructure.',
        nextStep:
          'For a specific project, send the location, type, size, drawings, and target schedule.',
        actions: [
          { label: 'See projects', path: '/projects' },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['capabilities', 'what build', 'services', 'scope', 'ne yapar', 'competences'],
      },
      {
        id: 'contact-office',
        topicId: 'contact',
        label: 'Office contact',
        answer: `Office: ${companyProfile.address}. Phone: ${companyProfile.phones[0]}. Email: ${companyProfile.email}.`,
        nextStep:
          'For a project request, include project type, location, approximate size, and preferred contact method.',
        actions: [
          { label: 'Call office', href: phoneHref },
          { label: 'Email office', href: emailHref },
        ],
        keywords: ['contact', 'phone', 'email', 'address', 'office', 'iletisim', 'adresse'],
      },
      {
        id: 'contact-brief',
        topicId: 'contact',
        label: 'What should my message include?',
        answer:
          'Include your name, phone, email, project type, location, approximate surface, current stage, deadline, and any drawings or photos.',
        nextStep:
          'This helps Lina route your client request without asking for the same basics again.',
        actions: [
          { label: 'Email now', href: emailHref },
          { label: 'Call', href: phoneHref },
        ],
        keywords: ['message include', 'what send', 'contact brief', 'mesaj', 'ne gondereyim'],
      },
    ],
  },
  fr: {
    labels: {
      title: 'Assistant Igloo',
      eyebrow: 'Assistant projet client',
      launcher: "Besoin d'aide ?",
      placeholder: 'Question sur projet, devis, localisation...',
      chooseTopic: 'Choisissez un sujet client ou écrivez votre question projet.',
      chooseAnswer: 'Choisissez une réponse préparée ci-dessous.',
      preparedAnswer: 'Réponse préparée',
      notSureTitle: 'Bureau projets',
      fallback:
        'Je ne trouve pas de correspondance exacte. Pour une demande client, envoyez nom, téléphone, type de projet, localisation et objet. Je peux aussi vous aider à choisir un sujet.',
    },
    topics: [
      {
        id: 'newProject',
        label: 'Démarrer un projet / devis',
        description:
          'Preparez les premières informations utiles pour une demande de construction résidentielle, commerciale ou mixte.',
        answerIds: ['quote-info', 'quote-documents', 'site-visit'],
        keywords: ['devis', 'estimation', 'nouveau projet', 'prix', 'coût', 'teklif'],
      },
      {
        id: 'residential',
        label: 'Logements, villas, appartements',
        description:
          'Questions sur blocs logement, villas, résidences, parking, commerces en RDC et livraison de site.',
        answerIds: ['housing-scope', 'villa-network', 'apartment-mixed'],
        keywords: ['logement', 'villa', 'appartement', 'résidentiel', 'konut', 'daire'],
      },
      {
        id: 'commercial',
        label: 'Commercial / mixte',
        description:
          'Pour centres commerciaux, immobilier mixte, locaux de service, finitions et espaces recevant du public.',
        answerIds: ['commercial-scope', 'mixed-use', 'finishing-works'],
        keywords: ['commercial', 'mixte', 'magasin', 'bureau', 'centre', 'retail'],
      },
      {
        id: 'infrastructure',
        label: 'Routes & réseaux',
        description:
          'Pour VRD, accès, réseaux techniques, travaux exterieurs et infrastructure autour du projet.',
        answerIds: ['roads-networks', 'site-infrastructure'],
        keywords: ['routes', 'réseaux', 'vrd', 'infrastructure', 'yol', 'altyapi'],
      },
      {
        id: 'process',
        label: 'Déroulement du projet',
        description:
          'Comprendre premier contact, documents, délais, coordination et étapes avant une offre formelle.',
        answerIds: ['first-call', 'timeline', 'quality-safety'],
        keywords: ['process', 'délai', 'comment', 'coordination', 'surec'],
      },
      {
        id: 'portfolio',
        label: 'Exemples de projets',
        description:
          'Voir des exemples Igloo terminés et en cours à Alger et dans plusieurs localisations en Algérie.',
        answerIds: ['projects-summary', 'current-projects'],
        keywords: ['projets', 'portfolio', 'références', 'exemples', 'projeler'],
      },
      {
        id: 'company',
        label: 'Entreprise & capacités',
        description:
          'Comprendre qui est Igloo, ce que l entreprise construit et quels projets clients peuvent etre discutes.',
        answerIds: ['why-choose-igloo', 'company-profile', 'capabilities'],
        keywords: [
          'entreprise',
          'igloo',
          'capacités',
          'profil',
          'pourquoi choisir',
          'choisir igloo',
          'pourquoi igloo',
          'why choose',
          'neden igloo',
          'hakkinda',
        ],
      },
      {
        id: 'contact',
        label: 'Contacter un conseiller projet',
        description:
          'Partager rapidement un brief projet avec Igloo par email, téléphone ou section contact.',
        answerIds: ['contact-office', 'contact-brief'],
        keywords: ['contact', 'téléphone', 'email', 'adresse', 'iletisim'],
      },
    ],
    answers: [
      {
        id: 'quote-info',
        topicId: 'newProject',
        label: 'Que faut-il envoyer pour un devis ?',
        answer:
          'Envoyez la localisation, le type de bâtiment, la surface approximative, le stade actuel, les plans si disponibles, la date visée et le scope attendu.',
        nextStep:
          'Un brief court suffit pour une première revue. Ajoutez plans, photos, données terrain ou statut permis si disponibles.',
        actions: [
          { label: 'Envoyer brief projet', href: emailHref },
          { label: 'Appeler', href: phoneHref },
        ],
        keywords: ['devis', 'estimation', 'prix', 'coût', 'budget', 'teklif'],
      },
      {
        id: 'quote-documents',
        topicId: 'newProject',
        label: 'Quels documents aident ?',
        answer:
          'Plans architecturaux, localisation, statut permis, programme cible, photos site, scope souhaite et contraintes connues sont utiles.',
        nextStep:
          'Sans plans, envoyez localisation, type de projet, surface approximative et courte description.',
        actions: [
          { label: 'Envoyer documents', href: emailHref },
          { label: 'Voir projets', path: '/projects' },
        ],
        keywords: ['documents', 'plans', 'permis', 'photos', 'dosya'],
      },
      {
        id: 'site-visit',
        topicId: 'newProject',
        label: 'Demander une revue de site',
        answer:
          'Oui. Envoyez localisation exacte, conditions d accès, type de projet, etat actuel du terrain/site et horaire de contact préféré.',
        nextStep:
          'L équipe pourra proposer appel, revue documents ou discussion de site selon le dossier.',
        actions: [
          { label: 'Demander revue', href: emailHref },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['visite site', 'revue site', 'inspection', 'chantier', 'saha'],
      },
      {
        id: 'housing-scope',
        topicId: 'residential',
        label: 'Scope projet résidentiel',
        answer:
          'Igloo peut discuter logements, appartements, villas, sites résidentiels mixtes, parkings, commerces en RDC, routes et réseaux.',
        nextStep:
          'Partagez nombre de logements, localisation, surface, stade design et inclusion ou non des VRD.',
        actions: [
          { label: 'Envoyer brief logement', href: emailHref },
          { label: 'Voir projets', path: '/projects' },
        ],
        keywords: ['résidentiel', 'logement', 'appartements', 'unités', 'konut'],
      },
      {
        id: 'villa-network',
        topicId: 'residential',
        label: 'Villas et réseaux',
        answer:
          'Pour des villas, indiquez nombre de villas, parcelle, routes d accès, réseaux, limites de terrain et scope souhaite.',
        nextStep:
          'Photos, plan de site et informations réseaux rendent la première revue plus solide.',
        actions: [
          { label: 'Envoyer brief villas', href: emailHref },
          { label: 'Appeler', href: phoneHref },
        ],
        keywords: ['villa', 'villas', 'réseaux', 'routes', 'parcelle'],
      },
      {
        id: 'apartment-mixed',
        topicId: 'residential',
        label: 'Appartements ou résidentiel mixte',
        answer:
          'Pour appartements ou résidentiel mixte, envoyez nombre d unités, blocs, niveaux parking, surfaces commerciales, services et phasage.',
        nextStep:
          'Précisez si vous cherchez construction complète, travaux secondaires, infrastructure ou lot specifique.',
        actions: [
          { label: 'Envoyer données projet', href: emailHref },
          { label: 'Exemples projets', path: '/projects' },
        ],
        keywords: ['appartement', 'mixte', 'parking', 'commerce', 'bloc', 'daire'],
      },
      {
        id: 'commercial-scope',
        topicId: 'commercial',
        label: 'Scope projet commercial',
        answer:
          'Pour espaces commerciaux, Igloo peut discuter centres, locaux de service, finitions, réseaux techniques, circulation et integration avec logements.',
        nextStep:
          'Envoyez localisation, surface, usage prévu, etat actuel, date d ouverture visée et scope.',
        actions: [
          { label: 'Envoyer brief commercial', href: emailHref },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['commercial', 'magasin', 'centre', 'service', 'local'],
      },
      {
        id: 'mixed-use',
        topicId: 'commercial',
        label: 'Développement mixte',
        answer:
          'Pour un développement mixte, indiquez logements, surfaces commerciales, parking, accès, services et contraintes de phasage.',
        nextStep:
          'La première revue doit separer structure, finitions et infrastructure.',
        actions: [
          { label: 'Envoyer brief mixte', href: emailHref },
          { label: 'Voir exemples', path: '/projects' },
        ],
        keywords: ['mixte', 'résidentiel commercial', 'parking', 'services'],
      },
      {
        id: 'finishing-works',
        topicId: 'commercial',
        label: 'Finitions et travaux secondaires',
        answer:
          'Pour finitions ou travaux secondaires, envoyez etat du site, plans, attentes matériaux, réseaux techniques, quantites et délai.',
        nextStep:
          'Si la structure existe déjà, photos et notes sur l etat actuel sont très utiles.',
        actions: [
          { label: 'Envoyer scope', href: emailHref },
          { label: 'Appeler', href: phoneHref },
        ],
        keywords: ['finitions', 'travaux secondaires', 'façade', 'interieur', 'second œuvre'],
      },
      {
        id: 'roads-networks',
        topicId: 'infrastructure',
        label: 'Routes et réseaux',
        answer:
          'Pour routes et réseaux, envoyez plan de site, accès, drainage, besoins techniques, longueurs, points de connexion et contraintes.',
        nextStep:
          'L équipe peut verifier si ces travaux font partie d un package bâtiment ou d un scope separe.',
        actions: [
          { label: 'Envoyer brief VRD', href: emailHref },
          { label: 'Voir projets', path: '/projects' },
        ],
        keywords: ['routes', 'réseaux', 'drainage', 'vrd', 'yol', 'altyapi'],
      },
      {
        id: 'site-infrastructure',
        topicId: 'infrastructure',
        label: 'Infrastructure autour du projet',
        answer:
          'Mentionnez routes d accès, plateformes, travaux exterieurs, réseaux, parking, espaces publics et contraintes administratives.',
        nextStep:
          'Un scope bâtiment + infrastructure doit etre explique clairement des le premier brief.',
        actions: [
          { label: 'Envoyer brief site', href: emailHref },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['infrastructure site', 'travaux exterieurs', 'parking', 'accès', 'voirie'],
      },
      {
        id: 'first-call',
        topicId: 'process',
        label: 'Quelle est la première étape ?',
        answer:
          'La première étape est une revue courte: localisation, type, surface, plans, scope, timing et contacts client.',
        nextStep:
          'Ensuite Igloo peut proposer appel, revue documents ou rendez-vous projet.',
        actions: [
          { label: 'Envoyer brief', href: emailHref },
          { label: 'Appeler', href: phoneHref },
        ],
        keywords: ['première étape', 'process', 'comment', 'rendez-vous', 'surec'],
      },
      {
        id: 'timeline',
        topicId: 'process',
        label: 'Délai de réponse',
        answer:
          'Le délai depend de la clarte du brief. Localisation, plans, scope et dates cibles accelerent la première revue.',
        nextStep:
          'Pour une demande urgente, envoyez le brief par email puis appelez avec la même référence projet.',
        actions: [
          { label: 'Envoyer email', href: emailHref },
          { label: 'Appeler', href: phoneHref },
        ],
        keywords: ['délai', 'urgent', 'rapide', 'quand', 'acil'],
      },
      {
        id: 'quality-safety',
        topicId: 'process',
        label: 'Qualité et coordination',
        answer:
          'Igloo travaille par revue technique, gestion chantier et communication claire entre client, conception et construction.',
        nextStep:
          'Pour un dossier sérieux, partagez plans et niveau de qualité attendu des le debut.',
        actions: [
          { label: 'Section entreprise', path: '/#about' },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['qualité', 'coordination', 'gestion chantier', 'communication'],
      },
      {
        id: 'projects-summary',
        topicId: 'portfolio',
        label: 'Voir des exemples',
        answer:
          'L index projets inclut logements, villas, mixte, centres commerciaux, routes, réseaux et projets en cours en Algérie.',
        nextStep:
          'Ouvrez l index pour comparer type, statut, localisation et scope.',
        actions: [
          { label: 'Ouvrir projets', path: '/projects' },
          { label: 'Demander devis', href: emailHref },
        ],
        keywords: ['projets', 'exemples', 'portfolio', 'références', 'projeler'],
      },
      {
        id: 'current-projects',
        topicId: 'portfolio',
        label: 'Projets terminés et en cours',
        answer:
          'Igloo présente des projets terminés et en cours: résidentiel, logements promotionnels, locaux commerciaux et infrastructure coordonnée.',
        nextStep:
          'Si un projet ressemble au votre, citez-le dans votre message comme référence.',
        actions: [
          { label: 'Voir projets', path: '/projects' },
          { label: 'Envoyer référence', href: emailHref },
        ],
        keywords: ['projets en cours', 'terminés', 'référence similaire'],
      },
      {
        id: 'why-choose-igloo',
        topicId: 'company',
        label: 'Pourquoi choisir Igloo ?',
        answer:
          'Choisissez Igloo si vous cherchez une équipe de construction basée en Algérie, capable de relier bâtiment, routes, réseaux, coordination de chantier et communication client dans une discussion projet concrete.',
        nextStep:
          'Partagez le type de projet, la localisation, la surface, l étape actuelle et la date cible. Lina peut orienter la demande vers le bon conseiller projet.',
        actions: [
          { label: 'Voir projets', path: '/projects' },
          { label: 'Email bureau projets', href: emailHref },
        ],
        keywords: [
          'pourquoi choisir',
          'pourquoi vous choisir',
          'choisir igloo',
          'pourquoi igloo',
          'why choose',
          'why should we choose you',
          'choose you',
          'neden sizi secelim',
          'neden igloo',
        ],
      },
      {
        id: 'company-profile',
        topicId: 'company',
        label: 'Qui est Igloo ?',
        answer:
          'SARL Igloo Yapi Construction est basée à Bir Khadem, Alger, et intervient sur résidentiel, mixte, routes, réseaux et chantiers coordonnés.',
        nextStep:
          'Les clients peuvent consulter la section entreprise ou demander une discussion projet.',
        actions: [
          { label: 'Section entreprise', path: '/#about' },
          { label: 'Envoyer demande', href: emailHref },
        ],
        keywords: ['qui est igloo', 'profil entreprise', 'hakkinda'],
      },
      {
        id: 'capabilities',
        topicId: 'company',
        label: 'Que peut construire Igloo ?',
        answer:
          'Igloo peut discuter logements, villas, immobilier mixte, locaux commerciaux, travaux secondaires, routes, réseaux et infrastructure site.',
        nextStep:
          'Pour un projet precis, envoyez localisation, type, taille, plans et planning cible.',
        actions: [
          { label: 'Voir projets', path: '/projects' },
          { label: 'Contact', path: '/#contact' },
        ],
        keywords: ['capacités', 'services', 'scope', 'compétences', 'ne yapar'],
      },
      {
        id: 'contact-office',
        topicId: 'contact',
        label: 'Contact bureau',
        answer: `Bureau: ${companyProfile.address}. Téléphone: ${companyProfile.phones[0]}. Email: ${companyProfile.email}.`,
        nextStep:
          'Pour une demande projet, ajoutez type, localisation, surface approximative et méthode de contact préférée.',
        actions: [
          { label: 'Appeler', href: phoneHref },
          { label: 'Envoyer email', href: emailHref },
        ],
        keywords: ['contact', 'téléphone', 'email', 'adresse', 'iletisim'],
      },
      {
        id: 'contact-brief',
        topicId: 'contact',
        label: 'Que mettre dans mon message ?',
        answer:
          'Indiquez nom, téléphone, email, type de projet, localisation, surface, stade actuel, délai, plans ou photos.',
        nextStep:
          'Cela aide Lina à orienter votre demande client sans redemander les bases.',
        actions: [
          { label: 'Envoyer email', href: emailHref },
          { label: 'Appeler', href: phoneHref },
        ],
        keywords: ['message', 'quoi envoyer', 'brief contact', 'ne gondereyim'],
      },
    ],
  },
});

const makeBotMessage = (
  body: string,
  options: Omit<ChatMessage, 'id' | 'role' | 'body'> = {},
): ChatMessage => ({
  id: createMessageId(),
  role: 'bot',
  body,
  ...options,
});

const makeUserMessage = (body: string): ChatMessage => ({
  id: createMessageId(),
  role: 'user',
  body,
});

function findBestAnswer(message: string, answers: PreAnswer[]) {
  const normalized = normalizeSearchText(message);
  const words = new Set(normalized.split(' ').filter((word) => word.length > 2));
  let bestAnswer: PreAnswer | null = null;
  let bestScore = 0;

  for (const answer of answers) {
    const labelWords = normalizeSearchText(answer.label)
      .split(' ')
      .filter((word) => word.length > 3 && !SEARCH_STOPWORDS.has(word));
    const keywordScore = answer.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeSearchText(keyword);
      if (!normalizedKeyword) return total;
      if (normalized.includes(normalizedKeyword)) {
        return total + (normalizedKeyword.includes(' ') ? 4 : 2);
      }
      return total;
    }, 0);
    const labelScore = labelWords.reduce(
      (total, word) => total + (words.has(word) ? 1 : 0),
      0,
    );
    const score = keywordScore + labelScore;

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answer;
    }
  }

  return bestScore > 0 ? bestAnswer : null;
}

function findBestTopic(message: string, topics: AssistantTopic[]) {
  const normalized = normalizeSearchText(message);
  return topics.find((topic) =>
    topic.keywords.some((keyword) => normalized.includes(normalizeSearchText(keyword))),
  ) ?? null;
}

export default function AssistantDock() {
  const { locale, t } = useLocale();
  const location = useLocation();
  const goTo = useSiteNavigate();
  const conversationRef = useRef<HTMLDivElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<AssistantTopicId | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [scrollRequestId, setScrollRequestId] = useState(0);

  const officePhone = companyProfile.phones[0];
  const phoneHref = `tel:${officePhone.replace(/\s/g, '')}`;
  const emailHref = `mailto:${companyProfile.email}`;
  const assistantContent = useMemo(
    () => buildAssistantContent(emailHref, phoneHref)[locale],
    [emailHref, locale, phoneHref],
  );
  const { labels, topics, answers } = assistantContent;
  const selectedTopic = selectedTopicId
    ? topics.find((topic) => topic.id === selectedTopicId) ?? null
    : null;

  const introBody =
    locale === 'fr'
      ? `Bonjour, je suis ${assistantProfile.name}, votre assistant projet Igloo en Algerie. ${labels.chooseTopic}`
      : `Hi, I'm ${assistantProfile.name}, your Igloo project assistant in Algeria. ${labels.chooseTopic}`;

  const navigateAndClose = (path: string) => {
    setPanelMode(null);
    goTo(path);
  };

  const openAssistant = () => {
    setPanelMode((mode) => (mode === 'assistant' ? null : 'assistant'));
  };

  const pushMessages = (nextMessages: ChatMessage[]) => {
    setMessages((current) => [...current, ...nextMessages]);
    setScrollRequestId((requestId) => requestId + 1);
  };

  const restartChat = () => {
    setSelectedTopicId(null);
    setMessages([]);
    setDraft('');
    setScrollRequestId((requestId) => requestId + 1);
  };

  const answerToMessage = (answer: PreAnswer): ChatMessage =>
    makeBotMessage(answer.answer, {
      title: answer.label || labels.preparedAnswer,
      note: answer.nextStep,
      actions: answer.actions,
    });

  const handleTopicSelect = (topic: AssistantTopic) => {
    setSelectedTopicId(topic.id);
    pushMessages([
      makeUserMessage(topic.label),
      makeBotMessage(topic.description, {
        title: topic.label,
        note: labels.chooseAnswer,
        answerIds: topic.answerIds,
      }),
    ]);
  };

  const handleAnswerSelect = (answer: PreAnswer) => {
    setSelectedTopicId(answer.topicId);
    pushMessages([
      makeUserMessage(answer.label),
      answerToMessage(answer),
    ]);
  };

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;

    const matchedAnswer = findBestAnswer(message, answers);
    const matchedTopic = matchedAnswer ? null : findBestTopic(message, topics);
    setDraft('');

    if (matchedAnswer) {
      setSelectedTopicId(matchedAnswer.topicId);
      pushMessages([
        makeUserMessage(message),
        answerToMessage(matchedAnswer),
      ]);
      return;
    }

    if (matchedTopic) {
      setSelectedTopicId(matchedTopic.id);
      pushMessages([
        makeUserMessage(message),
        makeBotMessage(matchedTopic.description, {
          title: matchedTopic.label,
          note: labels.chooseAnswer,
          answerIds: matchedTopic.answerIds,
        }),
      ]);
      return;
    }

    pushMessages([
      makeUserMessage(message),
      makeBotMessage(labels.fallback, {
        title: labels.notSureTitle,
        topicIds: topics.map((topic) => topic.id),
        actions: [
          { label: locale === 'fr' ? 'Envoyer email' : 'Email project desk', href: emailHref },
          { label: locale === 'fr' ? 'Appeler' : 'Call project desk', href: phoneHref },
        ],
        tone: 'system',
      }),
    ]);
  };

  useEffect(() => {
    restartChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation || panelMode !== 'assistant') return;

    if (messages.length === 0) {
      conversation.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    let frame = 0;
    let secondFrame = 0;
    let settleTimer = 0;
    let finalTimer = 0;

    const scrollToAnswer = (behavior: ScrollBehavior) => {
      conversation.scrollTo({
        top: conversation.scrollHeight,
        behavior,
      });
      conversationEndRef.current?.scrollIntoView({
        block: 'end',
        behavior,
      });
      if (behavior === 'auto') {
        conversation.scrollTop = conversation.scrollHeight;
      }
    };

    frame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollToAnswer('smooth');
        settleTimer = window.setTimeout(() => scrollToAnswer('auto'), 260);
        finalTimer = window.setTimeout(() => scrollToAnswer('auto'), 620);
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
      window.clearTimeout(finalTimer);
    };
  }, [messages.length, panelMode, scrollRequestId]);

  const renderActions = (actions?: AssistantAction[]) => {
    if (!actions?.length) return null;

    return (
      <div className="assistant-panel__flow-actions">
        {actions.map((action) => (
          'href' in action ? (
            <a key={action.label} href={action.href}>
              {action.label}
            </a>
          ) : (
            <button key={action.label} type="button" onClick={() => navigateAndClose(action.path)}>
              {action.label}
            </button>
          )
        ))}
      </div>
    );
  };

  const renderAnswerButtons = (answerIds?: string[]) => {
    if (!answerIds?.length) return null;
    const relatedAnswers = answerIds
      .map((answerId) => answers.find((answer) => answer.id === answerId))
      .filter((answer): answer is PreAnswer => Boolean(answer));

    return (
      <div className="assistant-panel__quick-list assistant-panel__quick-list--answers" aria-label="Prepared answers">
        {relatedAnswers.map((answer) => (
          <button key={answer.id} type="button" onClick={() => handleAnswerSelect(answer)}>
            {answer.label}
          </button>
        ))}
      </div>
    );
  };

  const renderTopicButtons = (topicIds?: AssistantTopicId[]) => {
    const topicList = (topicIds?.length
      ? topicIds.map((topicId) => topics.find((topic) => topic.id === topicId))
      : topics).filter((topic): topic is AssistantTopic => Boolean(topic));

    return (
      <div className="assistant-panel__quick-list assistant-panel__quick-list--topics" aria-label="Chat topics">
        {topicList.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={cn(selectedTopic?.id === topic.id && 'is-selected')}
            onClick={() => handleTopicSelect(topic)}
          >
            <strong>{topic.label}</strong>
            <span>{topic.description}</span>
          </button>
        ))}
      </div>
    );
  };

  const isProjectsActive = location.pathname === '/projects' || location.pathname.startsWith('/projects/');
  const isHomeActive = location.pathname === '/' && !location.hash;
  const isCompanyActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';

  return (
    <>
      <TooltipProvider delayDuration={120}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="assistant-floating assistant-floating--desktop"
              aria-label="Open Igloo assistant"
              aria-expanded={panelMode === 'assistant'}
              onClick={openAssistant}
            >
              <span className="assistant-floating__avatar" aria-hidden="true">
                <img src={assistantProfile.image} alt="" />
              </span>
              <span className="assistant-floating__label">{labels.launcher}</span>
              <MessageCircle className="assistant-floating__icon h-4 w-4" strokeWidth={2.3} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Open assistant</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <button
          type="button"
          className={cn(isHomeActive && 'is-active')}
          aria-current={isHomeActive ? 'page' : undefined}
          onClick={() => navigateAndClose('/')}
        >
          <Home className="h-[18px] w-[18px]" strokeWidth={2.1} />
          <span>{t('home')}</span>
        </button>
        <button
          type="button"
          className={cn(isCompanyActive && 'is-active')}
          aria-current={isCompanyActive ? 'page' : undefined}
          onClick={() => navigateAndClose('/about')}
        >
          <Building2 className="h-[18px] w-[18px]" strokeWidth={2.1} />
          <span>{t('company')}</span>
        </button>
        <button
          type="button"
          className={cn('mobile-bottom-nav__assistant', panelMode === 'assistant' && 'is-active')}
          aria-label="Open Igloo assistant"
          aria-expanded={panelMode === 'assistant'}
          onClick={openAssistant}
        >
          <span className="mobile-bottom-nav__assistant-orb">
            <MessageCircle className="h-6 w-6" strokeWidth={2.25} />
          </span>
        </button>
        <button
          type="button"
          className={cn(isProjectsActive && 'is-active')}
          aria-current={isProjectsActive ? 'page' : undefined}
          onClick={() => navigateAndClose('/projects')}
        >
          <FolderOpen className="h-[18px] w-[18px]" strokeWidth={2.1} />
          <span>{t('projects')}</span>
        </button>
        <button
          type="button"
          className={cn(isContactActive && 'is-active')}
          aria-current={isContactActive ? 'page' : undefined}
          onClick={() => navigateAndClose('/contact')}
        >
          <Mail className="h-[18px] w-[18px]" strokeWidth={2.1} />
          <span>{t('contact')}</span>
        </button>
      </nav>

      <Dialog open={panelMode === 'assistant'} onOpenChange={(open) => setPanelMode(open ? 'assistant' : null)}>
        <DialogContent tone="dock" className="assistant-panel" aria-label="Igloo assistant">
          <div className="assistant-panel__top">
            <div className="assistant-panel__avatar" aria-hidden="true">
              <img src={assistantProfile.image} alt="" />
            </div>
            <div className="assistant-panel__identity">
              <p>{labels.title}</p>
              <span>{assistantProfile.name} - {assistantProfile.role[locale]}</span>
            </div>
            <button
              type="button"
              className="assistant-panel__reset"
              aria-label={locale === 'fr' ? 'Recommencer la conversation' : 'Restart conversation'}
              onClick={restartChat}
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.1} />
            </button>
          </div>

          <div ref={conversationRef} className="assistant-panel__conversation">
            <div className="assistant-panel__bubble assistant-panel__bubble--bot">
              <strong>{labels.eyebrow}</strong>
              <span>{introBody}</span>
            </div>

            {messages.length === 0 && renderTopicButtons()}

            {messages.map((message) => (
              <div key={message.id} className="assistant-panel__message-group">
                <div
                  className={cn(
                    'assistant-panel__bubble',
                    message.role === 'user' ? 'assistant-panel__bubble--user' : 'assistant-panel__bubble--bot',
                    message.tone === 'system' && 'assistant-panel__bubble--system',
                  )}
                >
                  {message.title && <strong>{message.title}</strong>}
                  <span>{message.body}</span>
                  {message.note && <small>{message.note}</small>}
                </div>
                {renderAnswerButtons(message.answerIds)}
                {message.topicIds && renderTopicButtons(message.topicIds)}
                {renderActions(message.actions)}
              </div>
            ))}

            <div ref={conversationEndRef} className="assistant-panel__scroll-end" aria-hidden="true" />
          </div>

          <div className="assistant-panel__actions">
            <a href={emailHref}>
              <Mail className="h-4 w-4" strokeWidth={2} />
              <span>Email</span>
            </a>
            <a href={phoneHref}>
              <Phone className="h-4 w-4" strokeWidth={2} />
              <span>{locale === 'fr' ? 'Appeler' : 'Call'}</span>
            </a>
            <button type="button" onClick={() => navigateAndClose('/#contact')}>
              <Send className="h-4 w-4" strokeWidth={2} />
              <span>{t('contact')}</span>
            </button>
          </div>

          <form className="assistant-panel__input" onSubmit={handleSendMessage}>
            <Input
              type="text"
              placeholder={labels.placeholder}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-auto border-0 bg-transparent px-0 py-0 text-[13px] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button type="submit" aria-label="Send message">
              <Send className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </form>
        </DialogContent>
      </Dialog>

    </>
  );
}
