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
import { legacyLocale, pickLocaleText, useLocale, type Locale, type LocalizedString } from '../i18n';
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

type AssistantChromeLabels = {
  launcher: string;
  openAssistant: string;
  resetConversation: string;
  preparedAnswers: string;
  chatTopics: string;
  sendMessage: string;
  email: string;
  call: string;
  emailProjectDesk: string;
  callProjectDesk: string;
  mobileNavigation: string;
  inputLabel: string;
};

const assistantChromeLabels: Record<Locale, AssistantChromeLabels> = {
  en: {
    launcher: 'Can I help?',
    openAssistant: 'Open Igloo assistant',
    resetConversation: 'Restart conversation',
    preparedAnswers: 'Prepared answers',
    chatTopics: 'Chat topics',
    sendMessage: 'Send message',
    email: 'Email',
    call: 'Call',
    emailProjectDesk: 'Email project desk',
    callProjectDesk: 'Call project desk',
    mobileNavigation: 'Mobile navigation',
    inputLabel: 'Write your project question',
  },
  fr: {
    launcher: "Besoin d'aide ?",
    openAssistant: "Ouvrir l'assistant Igloo",
    resetConversation: 'Recommencer la conversation',
    preparedAnswers: 'Réponses préparées',
    chatTopics: 'Sujets de discussion',
    sendMessage: 'Envoyer le message',
    email: 'E-mail',
    call: 'Appeler',
    emailProjectDesk: 'Écrire au bureau projets',
    callProjectDesk: 'Appeler le bureau projets',
    mobileNavigation: 'Navigation mobile',
    inputLabel: 'Écrivez votre question sur le projet',
  },
  'ar-DZ': {
    launcher: 'نقدر نعاونك؟',
    openAssistant: 'افتح مساعد Igloo',
    resetConversation: 'أعد بدء المحادثة',
    preparedAnswers: 'إجابات جاهزة',
    chatTopics: 'مواضيع المحادثة',
    sendMessage: 'أرسل الرسالة',
    email: 'البريد الإلكتروني',
    call: 'اتصل',
    emailProjectDesk: 'راسل مكتب المشاريع',
    callProjectDesk: 'اتصل بمكتب المشاريع',
    mobileNavigation: 'قائمة التنقل على الهاتف',
    inputLabel: 'اكتب سؤالك عن المشروع',
  },
  tr: {
    launcher: 'Nasıl yardımcı olabilirim?',
    openAssistant: 'Igloo asistanını aç',
    resetConversation: 'Sohbeti yeniden başlat',
    preparedAnswers: 'Hazır yanıtlar',
    chatTopics: 'Sohbet konuları',
    sendMessage: 'Mesaj gönder',
    email: 'E-posta',
    call: 'Ara',
    emailProjectDesk: 'Proje ekibine e-posta gönder',
    callProjectDesk: 'Proje ekibini ara',
    mobileNavigation: 'Mobil menü',
    inputLabel: 'Proje sorunuzu yazın',
  },
};

const assistantProfile: { name: string; role: LocalizedString; image: string } = {
  name: 'Lina',
  role: {
    en: 'Algeria project advisor',
    fr: 'Bureau des projets en Algérie',
    'ar-DZ': 'مستشارة مشاريع الجزائر',
    tr: 'Cezayir proje danışmanı',
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
): { en: AssistantContent; fr: AssistantContent; dz?: AssistantContent; tr?: AssistantContent } => ({
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
      eyebrow: 'Assistant de projet',
      launcher: "Besoin d'aide ?",
      placeholder: 'Posez une question sur un projet, un devis ou une localisation…',
      chooseTopic: 'Choisissez un sujet ou écrivez directement votre question.',
      chooseAnswer: 'Choisissez l’une des réponses ci-dessous.',
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
          'Préparez les premières informations utiles pour une demande de construction résidentielle, commerciale ou mixte.',
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
          'Pour les VRD, les accès, les réseaux techniques, les travaux extérieurs et l’infrastructure autour du projet.',
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
          'Comprendre qui est Igloo, ce que l’entreprise construit et quels projets clients peuvent être discutés.',
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
          'Les plans architecturaux, la localisation, le statut du permis, le programme visé, les photos du site, le périmètre souhaité et les contraintes connues sont utiles.',
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
          'Oui. Envoyez la localisation exacte, les conditions d’accès, le type de projet, l’état actuel du terrain ou du site et l’horaire de contact préféré.',
        nextStep:
          'L’équipe pourra proposer un appel, une revue des documents ou une discussion sur site selon le dossier.',
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
          'Pour des villas, indiquez le nombre de villas, la parcelle, les routes d’accès, les réseaux, les limites du terrain et le périmètre souhaité.',
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
          'Pour des appartements ou un programme résidentiel mixte, envoyez le nombre d’unités, les blocs, les niveaux de parking, les surfaces commerciales, les services et le phasage.',
        nextStep:
          'Précisez si vous cherchez une construction complète, des travaux secondaires, une infrastructure ou un lot spécifique.',
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
          'Pour les espaces commerciaux, Igloo peut étudier les centres, les locaux de service, les finitions, les réseaux techniques, la circulation et l’intégration avec les logements.',
        nextStep:
          'Envoyez la localisation, la surface, l’usage prévu, l’état actuel, la date d’ouverture souhaitée et le périmètre des travaux.',
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
          'La première revue doit séparer la structure, les finitions et l’infrastructure.',
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
          'Pour les finitions ou les travaux secondaires, envoyez l’état du site, les plans, vos attentes en matière de matériaux, les réseaux techniques, les quantités et le délai.',
        nextStep:
          'Si la structure existe déjà, des photos et des notes sur l’état actuel sont très utiles.',
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
          'L’équipe peut vérifier si ces travaux font partie d’un lot bâtiment ou d’un périmètre séparé.',
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
          'Mentionnez les routes d’accès, les plateformes, les travaux extérieurs, les réseaux, le parking, les espaces publics et les contraintes administratives.',
        nextStep:
          'Un périmètre bâtiment et infrastructure doit être expliqué clairement dès le premier brief.',
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
          'Le délai dépend de la clarté du brief. La localisation, les plans, le périmètre et les dates cibles accélèrent la première revue.',
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
          'Pour un dossier sérieux, partagez les plans et le niveau de qualité attendu dès le début.',
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
          'L’index des projets inclut des logements, des villas, des programmes mixtes, des centres commerciaux, des routes, des réseaux et des projets en cours en Algérie.',
        nextStep:
          'Ouvrez l’index pour comparer le type, le statut, la localisation et le périmètre.',
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
          'Si un projet ressemble au vôtre, citez-le dans votre message comme référence.',
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
          'Choisissez Igloo si vous cherchez une équipe de construction basée en Algérie, capable de relier bâtiment, routes, réseaux, coordination de chantier et communication client dans une discussion de projet concrète.',
        nextStep:
          'Partagez le type de projet, la localisation, la surface, l’étape actuelle et la date cible. Lina peut orienter la demande vers le bon conseiller projet.',
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
          'Pour un projet précis, envoyez la localisation, le type, la taille, les plans et le planning cible.',
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

const buildTurkishAssistantContent = (emailHref: string, phoneHref: string): AssistantContent => ({
  labels: {
    title: 'Igloo Asistan',
    eyebrow: 'Proje danışmanınız',
    launcher: 'Nasıl yardımcı olabilirim?',
    placeholder: 'Proje, teklif veya proje konumu hakkında sorun…',
    chooseTopic: 'Bir konu seçin ya da proje sorunuzu doğrudan yazın.',
    chooseAnswer: 'Aşağıdaki hazır yanıtlardan birini seçin.',
    preparedAnswer: 'Hazır yanıt',
    notSureTitle: 'Proje danışmanı',
    fallback: 'Sorunuzu tam olarak anlayamadım. Proje türünü, konumunu ve ihtiyacınızı kısaca yazabilir veya aşağıdaki başlıklardan birini seçebilirsiniz.',
  },
  topics: [
    {
      id: 'newProject',
      label: 'Yeni proje / teklif talebi',
      description: 'İlk değerlendirme için gereken proje bilgilerini hazırlayın.',
      answerIds: ['tr-quote-info'],
      keywords: ['teklif', 'fiyat', 'yeni proje', 'maliyet', 'başlamak'],
    },
    {
      id: 'residential',
      label: 'Konut, villa ve apartman',
      description: 'Konut blokları, villalar, otoparklar ve ortak alanlar.',
      answerIds: ['tr-housing-scope'],
      keywords: ['konut', 'villa', 'apartman', 'daire', 'otopark'],
    },
    {
      id: 'commercial',
      label: 'Ticari / karma kullanım',
      description: 'Ticaret merkezleri, dükkânlar, ofisler ve karma projeler.',
      answerIds: ['tr-commercial-scope'],
      keywords: ['ticari', 'karma kullanım', 'dükkan', 'dükkân', 'ofis', 'mağaza'],
    },
    {
      id: 'infrastructure',
      label: 'Yollar ve altyapı',
      description: 'Saha yolları, şebekeler, erişim ve çevre düzenlemesi.',
      answerIds: ['tr-infrastructure'],
      keywords: ['yol', 'altyapı', 'şebeke', 'vrd', 'çevre düzenleme'],
    },
    {
      id: 'process',
      label: 'Proje süreci',
      description: 'İlk temastan saha uygulamasına kadar izlenen adımlar.',
      answerIds: ['tr-process'],
      keywords: ['süreç', 'takvim', 'süre', 'aşama', 'nasıl çalışıyor'],
    },
    {
      id: 'portfolio',
      label: 'Proje örnekleri',
      description: 'Tamamlanan ve devam eden işleri inceleyin.',
      answerIds: ['tr-portfolio'],
      keywords: ['proje', 'referans', 'portföy', 'örnek'],
    },
    {
      id: 'company',
      label: 'Igloo hakkında',
      description: 'Şirketin ekibi, uzmanlığı ve mesleki sınıflandırması.',
      answerIds: ['tr-company'],
      keywords: ['şirket', 'igloo', 'ekip', 'hakkında', 'kategori'],
    },
    {
      id: 'contact',
      label: 'Proje danışmanına ulaşın',
      description: 'Proje ekibine e-posta veya telefonla ulaşın.',
      answerIds: ['tr-contact'],
      keywords: ['iletişim', 'telefon', 'e-posta', 'adres', 'ulaşmak'],
    },
  ],
  answers: [
    {
      id: 'tr-quote-info',
      topicId: 'newProject',
      label: 'Teklif için hangi bilgiler gerekli?',
      answer: 'Projenin konumu, türü, yaklaşık büyüklüğü, mevcut aşaması ve elinizdeki çizim veya fotoğraflar ilk değerlendirme için yeterlidir.',
      nextStep: 'Bu bilgileri proje ekibine iletebilirsiniz.',
      actions: [{ label: 'Proje talebi oluştur', path: '/contact' }],
      keywords: ['teklif', 'bilgi', 'belge', 'çizim', 'fiyat'],
    },
    {
      id: 'tr-housing-scope',
      topicId: 'residential',
      label: 'Konut projelerinde hangi işleri yapıyorsunuz?',
      answer: 'Konut blokları ve villalarda taşıyıcı sistem, ince işler, teknik tesisatlar, otopark, saha yolları ve çevre düzenlemesini proje kapsamına göre koordine ediyoruz.',
      nextStep: 'Benzer konut projelerini inceleyebilirsiniz.',
      actions: [{ label: 'Konut projelerini gör', path: '/projects' }],
      keywords: ['konut', 'villa', 'apartman', 'daire'],
    },
    {
      id: 'tr-commercial-scope',
      topicId: 'commercial',
      label: 'Ticari ve karma projelerin kapsamı nedir?',
      answer: 'Ticari birimler, hizmet alanları, otoparklar ve konut bloklarının aynı proje içinde teknik olarak koordine edildiği yapım işlerini üstleniyoruz.',
      nextStep: 'Karma kullanım projelerimizi inceleyebilirsiniz.',
      actions: [{ label: 'Projeleri incele', path: '/projects' }],
      keywords: ['ticari', 'karma', 'ofis', 'mağaza'],
    },
    {
      id: 'tr-infrastructure',
      topicId: 'infrastructure',
      label: 'Yol ve altyapı işleri neleri kapsar?',
      answer: 'İş kapsamına göre saha erişimi, yollar, yağmur suyu ve atık su hatları, elektrik ve diğer hizmet şebekeleri ile çevre düzenlemesi birlikte planlanır.',
      nextStep: 'Sahanızın ihtiyaçlarını proje ekibiyle paylaşabilirsiniz.',
      actions: [{ label: 'Ekiple görüş', path: '/contact' }],
      keywords: ['yol', 'altyapı', 'şebeke', 'vrd'],
    },
    {
      id: 'tr-process',
      topicId: 'process',
      label: 'Süreç nasıl ilerliyor?',
      answer: 'İlk değerlendirmede kapsam ve belgeler incelenir. Ardından metraj, teknik koordinasyon, satın alma ve saha planı netleştirilir; uygulama düzenli saha kontrolleriyle yürütülür.',
      nextStep: 'İlk değerlendirme için proje bilgilerinizi gönderebilirsiniz.',
      actions: [{ label: 'Proje talebi oluştur', path: '/contact' }],
      keywords: ['süreç', 'aşama', 'takvim', 'süre'],
    },
    {
      id: 'tr-portfolio',
      topicId: 'portfolio',
      label: 'Hangi projeleri inceleyebilirim?',
      answer: 'Portföyde Cezayir’in farklı vilayetlerinde tamamlanan ve devam eden konut, villa, ticari yapı ve altyapı projeleri bulunuyor.',
      nextStep: 'Tüm proje kayıtlarına göz atabilirsiniz.',
      actions: [{ label: 'Tüm projeler', path: '/projects' }],
      keywords: ['proje', 'portföy', 'referans', 'örnek'],
    },
    {
      id: 'tr-company',
      topicId: 'company',
      label: 'Igloo Construction kimdir?',
      answer: '2018’de Cezayir’de kurulan Igloo Construction; mühendis, mimar, şantiye yönetimi ve saha ekipleriyle konut ve karma kullanım projeleri yürütür. Şirket Kategori 6 mesleki sınıflandırmasına sahiptir.',
      nextStep: 'Şirket profili ve ekibi hakkında daha fazla bilgi alabilirsiniz.',
      actions: [{ label: 'Kurumsal profil', path: '/about' }],
      keywords: ['şirket', 'igloo', 'ekip', 'kategori'],
    },
    {
      id: 'tr-contact',
      topicId: 'contact',
      label: 'Proje ekibine nasıl ulaşabilirim?',
      answer: `Bir Khadem ofisine ${companyProfile.email} adresinden veya ${companyProfile.phones[0]} numaralı telefondan ulaşabilirsiniz.`,
      nextStep: 'Size uygun iletişim kanalını seçin.',
      actions: [
        { label: 'E-posta gönder', href: emailHref },
        { label: 'Ofisi ara', href: phoneHref },
      ],
      keywords: ['iletişim', 'telefon', 'e-posta', 'adres'],
    },
  ],
});

const buildArabicAssistantContent = (emailHref: string, phoneHref: string): AssistantContent => ({
  labels: {
    title: 'مساعد Igloo',
    eyebrow: 'مساعد مشاريع العملاء',
    launcher: 'نقدر نعاونك؟',
    placeholder: 'اسأل عن مشروع أو عرض سعر أو موقع…',
    chooseTopic: 'اختَر موضوعًا يخص مشروعك أو اكتب سؤالك مباشرة.',
    chooseAnswer: 'اختر إحدى الإجابات الجاهزة أدناه.',
    preparedAnswer: 'إجابة جاهزة',
    notSureTitle: 'مكتب المشاريع',
    fallback:
      'ما قدرتش نطابق سؤالك بالضبط. إذا عندك طلب مشروع، أرسل اسمك ورقم هاتفك ونوع المشروع وموقعه وموضوعه. ويمكنك أيضًا اختيار أحد المواضيع أدناه.',
  },
  topics: [
    {
      id: 'newProject',
      label: 'بدء مشروع / طلب عرض سعر',
      description: 'جهّز المعلومات الأولى التي تحتاجها Igloo لدراسة مشروع سكني أو تجاري أو متعدد الاستعمالات.',
      answerIds: ['quote-info', 'quote-documents', 'site-visit'],
      keywords: ['عرض سعر', 'عرض أسعار', 'تسعيرة', 'سعر', 'تقدير', 'مشروع جديد', 'بدء مشروع', 'التكلفة', 'devis'],
    },
    {
      id: 'residential',
      label: 'سكن، فيلات وشقق',
      description: 'اسأل عن العمارات السكنية، الفيلات، المجمعات، المواقف، المحلات في الطابق الأرضي وأشغال الموقع.',
      answerIds: ['housing-scope', 'villa-network', 'apartment-mixed'],
      keywords: ['سكن', 'فيلا', 'شقة', 'سكني', 'إقامة', 'logement', 'villa', 'appartement'],
    },
    {
      id: 'commercial',
      label: 'تجاري / متعدد الاستعمالات',
      description: 'للمراكز التجارية، المحلات والخدمات، المشاريع المختلطة، التشطيبات والمساحات المفتوحة للعموم.',
      answerIds: ['commercial-scope', 'mixed-use', 'finishing-works'],
      keywords: ['تجاري', 'مختلط', 'محل', 'مكتب', 'مركز', 'commerce', 'commercial', 'mixte'],
    },
    {
      id: 'infrastructure',
      label: 'الطرق والشبكات',
      description: 'لأشغال الطرق، شبكات الخدمات، الوصول إلى الموقع، الأشغال الخارجية والبنية التحتية.',
      answerIds: ['roads-networks', 'site-infrastructure'],
      keywords: ['طرق', 'شبكات', 'بنية تحتية', 'مياه', 'صرف', 'شبكة', 'routes', 'réseaux', 'vrd'],
    },
    {
      id: 'process',
      label: 'كيف تسير مراحل المشروع؟',
      description: 'تعرّف على التواصل الأول، مراجعة المشروع، الوثائق، المدة، التنسيق وما يسبق العرض الرسمي.',
      answerIds: ['first-call', 'timeline', 'quality-safety'],
      keywords: ['مراحل', 'عملية', 'مدة', 'كيف', 'أجل', 'تنسيق', 'process', 'délai'],
    },
    {
      id: 'portfolio',
      label: 'أمثلة من المشاريع',
      description: 'تصفّح أمثلة عن مشاريع Igloo المنجزة والجارية في الجزائر العاصمة ومناطق جزائرية أخرى.',
      answerIds: ['projects-summary', 'current-projects'],
      keywords: ['مشاريع', 'أمثلة', 'محفظة', 'مراجع', 'مشروع', 'projets', 'portfolio'],
    },
    {
      id: 'company',
      label: 'الشركة وقدراتها',
      description: 'تعرّف على Igloo وما تبنيه وأنواع المشاريع التي يمكن للفريق مناقشتها مع العملاء.',
      answerIds: ['why-choose-igloo', 'company-profile', 'capabilities'],
      keywords: ['الشركة', 'قدرات', 'Igloo', 'فريق', 'من نحن', 'entreprise', 'capacités'],
    },
    {
      id: 'contact',
      label: 'التواصل مع مستشار مشروع',
      description: 'اعرف أسرع طريقة لإرسال ملخص مشروع إلى Igloo عبر البريد أو الهاتف أو نموذج التواصل.',
      answerIds: ['contact-office', 'contact-brief'],
      keywords: ['تواصل', 'هاتف', 'بريد', 'اتصال', 'عنوان', 'contact', 'téléphone', 'email'],
    },
  ],
  answers: [
    {
      id: 'quote-info',
      topicId: 'newProject',
      label: 'ما المعلومات المطلوبة لإعداد عرض سعر؟',
      answer: 'أرسل موقع المشروع، نوع المبنى، المساحة التقريبية، المرحلة الحالية، المخططات إن وُجدت، موعد البدء المستهدف ونطاق الأشغال المطلوب من Igloo.',
      nextStep: 'يكفي ملخص قصير للمراجعة الأولى. وإذا توفرت لديك مخططات أو صور أو معلومات عن الأرض أو وضعية الرخص، أرفقها أيضًا.',
      actions: [
        { label: 'أرسل ملخص المشروع', href: emailHref },
        { label: 'اتصل بمكتب المشاريع', href: phoneHref },
      ],
      keywords: ['عرض سعر', 'سعر', 'تكلفة', 'ميزانية', 'معلومات', 'devis', 'prix'],
    },
    {
      id: 'quote-documents',
      topicId: 'newProject',
      label: 'ما الوثائق المفيدة؟',
      answer: 'من المفيد إرسال المخططات المعمارية، معلومات الأرض أو الموقع، وضعية الرخص، البرنامج المستهدف، صور الموقع، نطاق الأشغال والقيود المعروفة.',
      nextStep: 'لا تملك مخططات بعد؟ أرسل الموقع، نوع المشروع، حجمه التقريبي ووصفًا قصيرًا لما تريد بناءه.',
      actions: [
        { label: 'أرسل الوثائق', href: emailHref },
        { label: 'شاهد المشاريع', path: '/projects' },
      ],
      keywords: ['وثائق', 'مخططات', 'رخصة', 'صور', 'ملف', 'plans', 'documents'],
    },
    {
      id: 'site-visit',
      topicId: 'newProject',
      label: 'هل يمكن طلب معاينة للموقع؟',
      answer: 'نعم. لطلب معاينة، شارك الموقع بدقة، ظروف الوصول، نوع المشروع، وضعية الموقع الحالية والوقت المناسب للتواصل معك.',
      nextStep: 'بعد ذلك يحدد الفريق ما إذا كانت الخطوة الأولى الأنسب هي مكالمة أو مراجعة وثائق أو نقاشًا في الموقع.',
      actions: [
        { label: 'اطلب معاينة', href: emailHref },
        { label: 'تواصل معنا', path: '/#contact' },
      ],
      keywords: ['معاينة', 'زيارة الموقع', 'تفقد', 'الموقع', 'site visit', 'visite'],
    },
    {
      id: 'housing-scope',
      topicId: 'residential',
      label: 'ما نطاق مشاريع السكن؟',
      answer: 'يمكن لـ Igloo مناقشة مشاريع العمارات السكنية، الشقق، الفيلات، المجمعات المختلطة، المواقف، المحلات في الطابق الأرضي، الطرق والشبكات.',
      nextStep: 'شارك عدد الوحدات، موقع الأرض، المساحة المبنية، مرحلة التصميم وما إذا كانت الطرق والشبكات ضمن النطاق.',
      actions: [
        { label: 'أرسل ملخصًا سكنيًا', href: emailHref },
        { label: 'شاهد المشاريع', path: '/projects' },
      ],
      keywords: ['سكن', 'عمارات', 'شقق', 'وحدات', 'فيلات', 'logement', 'résidentiel'],
    },
    {
      id: 'villa-network',
      topicId: 'residential',
      label: 'أشغال الفيلات والشبكات',
      answer: 'في مشاريع الفيلات، أرسل عدد الفيلات، موقع القطعة، طرق الوصول، احتياجات الشبكات، أشغال الحدود ونطاق التسليم المطلوب.',
      nextStep: 'تجعل الصور ومخطط الموقع ومعلومات الشبكات المراجعة الأولى أدق وأسرع.',
      actions: [
        { label: 'أرسل معلومات الفيلات', href: emailHref },
        { label: 'اتصل بنا', href: phoneHref },
      ],
      keywords: ['فيلا', 'فيلات', 'شبكات', 'طرق', 'قطعة', 'villa', 'réseaux'],
    },
    {
      id: 'apartment-mixed',
      topicId: 'residential',
      label: 'شقق أو مشروع سكني مختلط',
      answer: 'للمشاريع السكنية أو المختلطة، أرسل عدد الوحدات والعمارات، مستويات المواقف، المساحات التجارية، الخدمات ومتطلبات التنفيذ على مراحل.',
      nextStep: 'اذكر ما إذا كنت تحتاج إلى البناء الكامل أو الأشغال الثانوية أو البنية التحتية أو حزمة محددة.',
      actions: [
        { label: 'أرسل بيانات المشروع', href: emailHref },
        { label: 'شاهد أمثلة المشاريع', path: '/projects' },
      ],
      keywords: ['شقة', 'سكني مختلط', 'موقف', 'تجاري', 'عمارة', 'appartement', 'mixte'],
    },
    {
      id: 'commercial-scope',
      topicId: 'commercial',
      label: 'ما نطاق المشروع التجاري؟',
      answer: 'يمكن لـ Igloo دراسة المراكز التجارية، المحلات والخدمات، التشطيبات، الشبكات التقنية، حركة الدخول والخروج وربط المساحات التجارية بالمشاريع السكنية.',
      nextStep: 'أرسل الموقع، المساحة، الاستعمال المقصود، حالة الهيكل، موعد الافتتاح المطلوب ونطاق الأشغال.',
      actions: [
        { label: 'أرسل ملخصًا تجاريًا', href: emailHref },
        { label: 'تواصل معنا', path: '/#contact' },
      ],
      keywords: ['تجاري', 'محل', 'مركز', 'خدمات', 'مساحة', 'commercial', 'commerce'],
    },
    {
      id: 'mixed-use',
      topicId: 'commercial',
      label: 'مشروع متعدد الاستعمالات',
      answer: 'في المشاريع متعددة الاستعمالات، اذكر الوحدات السكنية، المساحات التجارية، المواقف، المداخل، مناطق الخدمات وقيود التنفيذ على مراحل.',
      nextStep: 'ينبغي أن توضح المراجعة الأولى ما يخص الهيكل، وما يخص التشطيبات، وما يخص البنية التحتية.',
      actions: [
        { label: 'أرسل ملخص المشروع المختلط', href: emailHref },
        { label: 'شاهد أمثلة', path: '/projects' },
      ],
      keywords: ['متعدد الاستعمالات', 'مختلط', 'سكني تجاري', 'مواقف', 'خدمات', 'mixed use', 'mixte'],
    },
    {
      id: 'finishing-works',
      topicId: 'commercial',
      label: 'التشطيبات والأشغال الثانوية',
      answer: 'للتشطيبات أو الأشغال الثانوية، أرسل وضعية الموقع، المخططات، توقعاتك للمواد، الشبكات التقنية، الكميات والآجال.',
      nextStep: 'إذا كان الهيكل قائمًا، فستكون الصور وملاحظات الحالة الحالية مفيدة جدًا.',
      actions: [
        { label: 'أرسل نطاق الأشغال', href: emailHref },
        { label: 'اتصل بمكتب المشاريع', href: phoneHref },
      ],
      keywords: ['تشطيبات', 'أشغال ثانوية', 'واجهة', 'داخلية', 'مواد', 'finitions', 'second œuvre'],
    },
    {
      id: 'roads-networks',
      topicId: 'infrastructure',
      label: 'الطرق وشبكات الخدمات',
      answer: 'بالنسبة للطرق والشبكات، أرسل مخطط الموقع، متطلبات الوصول، تصريف المياه، احتياجات الخدمات، أطوال الطرق، نقاط الربط وقيود التنسيق.',
      nextStep: 'يمكن للفريق تحديد ما إذا كانت هذه الأشغال جزءًا من حزمة أعمال إنشائية أكبر أو نطاقًا مستقلًا.',
      actions: [
        { label: 'أرسل ملخص البنية التحتية', href: emailHref },
        { label: 'شاهد المشاريع', path: '/projects' },
      ],
      keywords: ['طرق', 'شبكات', 'تصريف', 'خدمات', 'ربط', 'routes', 'réseaux', 'vrd'],
    },
    {
      id: 'site-infrastructure',
      topicId: 'infrastructure',
      label: 'البنية التحتية حول المشروع',
      answer: 'اذكر طرق الوصول، المنصات، الأشغال الخارجية، شبكات الخدمات، المواقف، المساحات العامة وأي قيود مرتبطة بالجهات الإدارية.',
      nextStep: 'ينبغي شرح نطاق البناء والبنية التحتية معًا بوضوح في الملخص الأول.',
      actions: [
        { label: 'أرسل معلومات الموقع', href: emailHref },
        { label: 'تواصل معنا', path: '/#contact' },
      ],
      keywords: ['بنية تحتية', 'أشغال خارجية', 'مواقف', 'وصول', 'منصة', 'infrastructure', 'voirie'],
    },
    {
      id: 'first-call',
      topicId: 'process',
      label: 'ما الخطوة الأولى؟',
      answer: 'تتمثل الخطوة الأولى عادةً في مراجعة قصيرة لملخص المشروع: الموقع، النوع، المساحة، المخططات، النطاق، الجدول الزمني وبيانات التواصل مع العميل.',
      nextStep: 'بعد ذلك تقترح Igloo مواصلة النقاش عبر مكالمة أو مراجعة وثائق أو اجتماع للمشروع.',
      actions: [
        { label: 'أرسل الملخص', href: emailHref },
        { label: 'اتصل بنا', href: phoneHref },
      ],
      keywords: ['الخطوة الأولى', 'مراحل', 'اجتماع', 'مكالمة', 'première étape', 'process'],
    },
    {
      id: 'timeline',
      topicId: 'process',
      label: 'متى يمكن أن ترد Igloo؟',
      answer: 'تتوقف سرعة الرد على وضوح المعلومات. يساعد توفر الموقع والمخططات والنطاق والتواريخ المستهدفة على تسريع المراجعة الأولى.',
      nextStep: 'في الطلبات المستعجلة، أرسل الملخص عبر البريد واتصل بالمكتب مع ذكر المرجع نفسه للمشروع.',
      actions: [
        { label: 'أرسل بريدًا الآن', href: emailHref },
        { label: 'اتصل بالمكتب', href: phoneHref },
      ],
      keywords: ['متى', 'المدة', 'عاجل', 'سريع', 'أجل', 'délai', 'urgent'],
    },
    {
      id: 'quality-safety',
      topicId: 'process',
      label: 'الجودة والتنسيق',
      answer: 'تعتمد Igloo على التسليم المنسق للمشروع، والمراجعة التقنية، وإدارة الموقع، والتواصل الواضح بين العميل وفريق التصميم والتنفيذ.',
      nextStep: 'في الطلبات الجادة، شارك المخططات ومستوى الجودة المطلوب مبكرًا حتى يكون نطاق الأشغال واضحًا للجميع.',
      actions: [
        { label: 'قسم الشركة', path: '/#about' },
        { label: 'تواصل مع الفريق', path: '/#contact' },
      ],
      keywords: ['جودة', 'تنسيق', 'إدارة الموقع', 'سلامة', 'تواصل', 'qualité', 'coordination'],
    },
    {
      id: 'projects-summary',
      topicId: 'portfolio',
      label: 'أرني أمثلة من المشاريع',
      answer: 'يضم فهرس المشاريع مساكن وفيلات ومشاريع متعددة الاستعمالات ومراكز تجارية وطرقًا وشبكات وأمثلة عن مشاريع قيد الإنجاز في مناطق جزائرية مختلفة.',
      nextStep: 'افتح فهرس المشاريع لمقارنة النوع والحالة والموقع ونطاق الأشغال.',
      actions: [
        { label: 'افتح المشاريع', path: '/projects' },
        { label: 'اطلب عرض سعر', href: emailHref },
      ],
      keywords: ['مشاريع', 'أمثلة', 'محفظة', 'مراجع', 'projets', 'portfolio'],
    },
    {
      id: 'current-projects',
      topicId: 'portfolio',
      label: 'الأعمال الحالية والمنجزة',
      answer: 'تعرض Igloo مشاريع منجزة وأخرى قيد الإنجاز، تشمل السكن، السكن الترقوي، المحلات التجارية وأشغال البنية التحتية المنسقة.',
      nextStep: 'إذا كان أحد المشاريع قريبًا من مشروعك، اذكره في رسالتك ليعرف الفريق المرجع الذي تنطلق منه.',
      actions: [
        { label: 'شاهد فهرس المشاريع', path: '/projects' },
        { label: 'أرسل مرجع المشروع', href: emailHref },
      ],
      keywords: ['حالية', 'منجزة', 'قيد الإنجاز', 'مشابه', 'مرجع', 'projets en cours'],
    },
    {
      id: 'why-choose-igloo',
      topicId: 'company',
      label: 'لماذا تختار Igloo؟',
      answer: 'اختر Igloo إذا كنت تبحث عن فريق بناء مقره الجزائر، ويمكنه جمع المباني والطرق والشبكات وتنسيق الموقع والتواصل مع العميل في متابعة عملية واحدة للمشروع.',
      nextStep: 'شارك نوع المشروع وموقعه وحجمه ومرحلته الحالية وتاريخه المستهدف. وستوجّه Lina طلبك إلى مستشار المشروع المناسب.',
      actions: [
        { label: 'شاهد المشاريع', path: '/projects' },
        { label: 'راسل مكتب المشاريع', href: emailHref },
      ],
      keywords: ['لماذا Igloo', 'لماذا تختار', 'اختيار', 'فريق بناء', 'why choose', 'pourquoi choisir'],
    },
    {
      id: 'company-profile',
      topicId: 'company',
      label: 'من هي Igloo؟',
      answer: `يقع مقر SARL Igloo Yapi Construction في بئر خادم بالجزائر العاصمة، وتعمل الشركة في السكن، والمشاريع المختلطة، والطرق، والشبكات وتنفيذ المشاريع وإدارة الورشات بتنسيق متكامل.`,
      nextStep: 'يمكنك مراجعة قسم الشركة أو إرسال طلب للحديث عن مشروعك.',
      actions: [
        { label: 'قسم الشركة', path: '/#about' },
        { label: 'أرسل طلبًا', href: emailHref },
      ],
      keywords: ['من هي Igloo', 'الشركة', 'ملف الشركة', 'من نحن', 'qui est igloo'],
    },
    {
      id: 'capabilities',
      topicId: 'company',
      label: 'ماذا يمكن أن تبني Igloo؟',
      answer: 'يمكن لـ Igloo مناقشة المساكن والفيلات والعقار المختلط والمحلات التجارية والأشغال الثانوية والطرق والشبكات والبنية التحتية للموقع.',
      nextStep: 'لمشروع محدد، أرسل الموقع والنوع والحجم والمخططات والجدول الزمني المستهدف.',
      actions: [
        { label: 'شاهد المشاريع', path: '/projects' },
        { label: 'تواصل معنا', path: '/#contact' },
      ],
      keywords: ['قدرات', 'ماذا تبني', 'خدمات', 'نطاق', 'capacités', 'services'],
    },
    {
      id: 'contact-office',
      topicId: 'contact',
      label: 'بيانات مكتب المشاريع',
      answer: `العنوان: ${companyProfile.address}. الهاتف: ${companyProfile.phones[0]}. البريد الإلكتروني: ${companyProfile.email}.`,
      nextStep: 'في طلب المشروع، أضف نوع المشروع وموقعه وحجمه التقريبي وطريقة التواصل المفضلة لديك.',
      actions: [
        { label: 'اتصل بالمكتب', href: phoneHref },
        { label: 'راسل المكتب', href: emailHref },
      ],
      keywords: ['تواصل', 'هاتف', 'بريد', 'عنوان', 'مكتب', 'contact', 'téléphone'],
    },
    {
      id: 'contact-brief',
      topicId: 'contact',
      label: 'ماذا أكتب في رسالتي؟',
      answer: 'اذكر الاسم، ورقم الهاتف، والبريد الإلكتروني، ونوع المشروع، والموقع، والمساحة، والمرحلة الحالية، والموعد المطلوب، وأي مخططات أو صور متوفرة.',
      nextStep: 'يساعد ذلك Lina على توجيه طلبك إلى الشخص المناسب من دون أن نطلب منك المعلومات الأساسية مرة أخرى.',
      actions: [
        { label: 'أرسل بريدًا', href: emailHref },
        { label: 'اتصل بنا', href: phoneHref },
      ],
      keywords: ['رسالتي', 'ماذا أكتب', 'معلومات الطلب', 'ملخص المشروع', 'message', 'brief'],
    },
  ],
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
  const assistantContent = useMemo(() => {
    if (locale === 'tr') return buildTurkishAssistantContent(emailHref, phoneHref);
    if (locale === 'ar-DZ') return buildArabicAssistantContent(emailHref, phoneHref);
    const content = buildAssistantContent(emailHref, phoneHref);
    return content[legacyLocale(locale)] ?? content.en;
  }, [emailHref, locale, phoneHref]);
  const { labels, topics, answers } = assistantContent;
  const chromeLabels = assistantChromeLabels[locale];
  const launcherLabel = chromeLabels.launcher;
  const openAssistantLabel = chromeLabels.openAssistant;
  const selectedTopic = selectedTopicId
    ? topics.find((topic) => topic.id === selectedTopicId) ?? null
    : null;

  const introBody = pickLocaleText(locale, {
    en: `Hi, I'm ${assistantProfile.name}, your Igloo project assistant in Algeria. ${labels.chooseTopic}`,
    fr: `Bonjour, je suis ${assistantProfile.name}, votre assistant projet Igloo en Algérie. ${labels.chooseTopic}`,
    'ar-DZ': `مرحبًا، أنا ${assistantProfile.name}، مساعدتك في مشاريع Igloo بالجزائر. ${labels.chooseTopic}`,
    tr: `Merhaba, ben ${assistantProfile.name}. Cezayir’deki Igloo projeleri için size yardımcı oluyorum. ${labels.chooseTopic}`,
  });

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
          { label: chromeLabels.emailProjectDesk, href: emailHref },
          { label: chromeLabels.callProjectDesk, href: phoneHref },
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
      <div className="assistant-panel__quick-list assistant-panel__quick-list--answers" aria-label={chromeLabels.preparedAnswers}>
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
      <div className="assistant-panel__quick-list assistant-panel__quick-list--topics" aria-label={chromeLabels.chatTopics}>
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
              aria-label={openAssistantLabel}
              aria-expanded={panelMode === 'assistant'}
              onClick={openAssistant}
            >
              <span className="assistant-floating__avatar" aria-hidden="true">
                <img src={assistantProfile.image} alt="" width={72} height={72} loading="lazy" decoding="async" />
              </span>
              <span className="assistant-floating__label">{launcherLabel}</span>
              <MessageCircle className="assistant-floating__icon h-4 w-4" strokeWidth={2.3} />
            </button>
          </TooltipTrigger>
          <TooltipContent>{openAssistantLabel}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <nav className="mobile-bottom-nav" aria-label={chromeLabels.mobileNavigation}>
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
          aria-label={openAssistantLabel}
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
        <DialogContent tone="dock" className="assistant-panel" aria-label={labels.title}>
          <div className="assistant-panel__top">
            <div className="assistant-panel__avatar" aria-hidden="true">
              <img src={assistantProfile.image} alt="" width={72} height={72} loading="lazy" decoding="async" />
            </div>
            <div className="assistant-panel__identity">
              <p>{labels.title}</p>
              <span>{assistantProfile.name} - {pickLocaleText(locale, assistantProfile.role)}</span>
            </div>
            <button
              type="button"
              className="assistant-panel__reset"
              aria-label={chromeLabels.resetConversation}
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
              <span>{chromeLabels.email}</span>
            </a>
            <a href={phoneHref}>
              <Phone className="h-4 w-4" strokeWidth={2} />
              <span>{chromeLabels.call}</span>
            </a>
            <button type="button" onClick={() => navigateAndClose('/#contact')}>
              <Send className="h-4 w-4" strokeWidth={2} />
              <span>{t('contact')}</span>
            </button>
          </div>

          <form className="assistant-panel__input" onSubmit={handleSendMessage}>
            <Input
              type="text"
              aria-label={chromeLabels.inputLabel}
              placeholder={labels.placeholder}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-auto border-0 bg-transparent px-0 py-0 text-[13px] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button type="submit" aria-label={chromeLabels.sendMessage}>
              <Send className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </form>
        </DialogContent>
      </Dialog>

    </>
  );
}
