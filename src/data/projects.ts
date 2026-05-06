const GITHUB_MEDIA_BASE =
  'https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media';

function media(name: string) {
  return `${GITHUB_MEDIA_BASE}/${name}`;
}

export type ProjectStatus = 'completed' | 'current';

export type ProjectRecord = {
  id: number;
  slug: string;
  title: string;
  menuTitle: string;
  chapterLabel: string;
  location: string;
  status: ProjectStatus;
  summary: string;
  details: string;
  scope: string;
  coverLines: [string, string];
  images: string[];
  sourceSlides: number[];
};

export const companyProfile = {
  name: 'SARL Igloo Yapi Construction',
  address: '9 National Route 142, Section 01, GP 235, Ground Floor, Ouled Fayet, Algiers',
  phones: ['+213 542 819 461', '+90 542 479 5700'],
  email: 'medatalay@gmail.com',
  foundedYear: 2018,
  overview: [
    'Founded in 2018 in Ouled Fayet, Algiers, SARL Igloo Yapi Construction specializes in residential and mixed-use developments led by civil engineer Adem Talay.',
    'Our engineers, architects, site managers, and field teams work as one coordinated structure to deliver projects with precision, efficiency, and lasting quality.',
    'We create modern, durable, and functional spaces designed for people, businesses, and communities.',
  ],
};

export const projects: ProjectRecord[] = [
  {
    id: 1,
    slug: 'douaouda-300-500-housing',
    title: '300/500 Assisted Promotional Housing',
    menuTitle: 'Douaouda Housing',
    chapterLabel: 'Completed',
    location: 'Douaouda',
    status: 'completed',
    summary: 'Construction works for all secondary state bodies within the 300/500 assisted promotional housing programme in Douaouda.',
    details: 'The project combines structural and supporting building works for a large state-backed residential programme.',
    scope: 'Residential delivery with coordinated supporting works and site infrastructure.',
    coverLines: ['Douaouda', '300/500 Housing'],
    images: [media('image8.jpeg'), media('image9.jpeg'), media('image10.jpeg')],
    sourceSlides: [4],
  },
  {
    id: 2,
    slug: 'sidi-abdallah-200-1200-housing',
    title: '200/1200 Promotional Public Housing',
    menuTitle: 'Sidi Abdallah',
    chapterLabel: 'Completed',
    location: 'Sidi Abdallah - Mahalma',
    status: 'completed',
    summary: 'Construction works for all secondary state bodies within the 200/1200 promotional public housing development in Sidi Abdallah - Mahalma.',
    details: 'A major public housing contract delivered with secondary state body works and coordinated programme execution.',
    scope: 'Large-scale public housing with integrated construction support packages.',
    coverLines: ['Sidi Abdallah', 'Public Housing'],
    images: [media('image11.jpeg'), media('image12.jpeg'), media('image13.jpeg')],
    sourceSlides: [5],
  },
  {
    id: 3,
    slug: 'staoueli-11-41-villas',
    title: '11/41 Villas and Network Works',
    menuTitle: 'Staoueli Villas',
    chapterLabel: 'Completed',
    location: 'Staoueli',
    status: 'completed',
    summary: 'Construction work in all secondary state bodies, including various road and network works for the 11/41 villas project in Staoueli.',
    details: 'The programme combines villa construction packages with the roadworks and utility network systems needed for full site readiness.',
    scope: 'Residential villas plus roads, utility networks, and coordinated site infrastructure.',
    coverLines: ['Staoueli', '11/41 Villas'],
    images: [media('image14.jpeg'), media('image15.jpeg'), media('image16.jpeg')],
    sourceSlides: [6],
  },
  {
    id: 4,
    slug: 'douira-commercial-centers-2500-housing',
    title: 'Commercial Centres for 2,500 Housing Units',
    menuTitle: 'Douira Centres',
    chapterLabel: 'Completed',
    location: 'Douira, Algiers',
    status: 'completed',
    summary: 'Construction work in secondary state bodies for the commercial centres serving the 2,500 housing unit development in Douira, Algiers.',
    details: 'A retail and services package designed to support a major housing programme with integrated commercial destinations.',
    scope: 'Commercial centre construction coordinated with a major residential masterplan.',
    coverLines: ['Douira', 'Commercial Centres'],
    images: [media('image17.jpeg'), media('image19.jpeg'), media('image20.jpeg'), media('image21.jpeg')],
    sourceSlides: [7],
  },
  {
    id: 5,
    slug: 'said-hamdine-mixed-real-estate',
    title: 'Mixed Real Estate Complex with 202 Free Promotional Housing',
    menuTitle: 'Said Hamdine',
    chapterLabel: 'Completed',
    location: 'Said Hamdine, Bir Mourad Rais, Algiers',
    status: 'completed',
    summary: 'Construction work in all secondary state bodies for a mixed real estate complex of 5 blocks, 202 free promotional housing units, and 2 basement parking levels.',
    details: 'A dense mixed-use residential complex combining housing blocks, underground parking, and coordinated structural support works.',
    scope: 'Five-block mixed real estate delivery with housing and two underground parking levels.',
    coverLines: ['Said Hamdine', 'Mixed Complex'],
    images: [media('image22.jpeg'), media('image4.jpeg'), media('image5.jpeg'), media('image2.jpeg')],
    sourceSlides: [8, 9],
  },
  {
    id: 6,
    slug: 'rouiba-4-promotional-villas',
    title: '4 Promotional Villas and Network Works',
    menuTitle: 'Rouiba Villas',
    chapterLabel: 'Completed',
    location: 'Rouiba',
    status: 'completed',
    summary: 'Construction work in all secondary state bodies, including various roads and network works for 4 promotional villas in Rouiba.',
    details: 'A smaller-format residential package supported by site access, utility network coordination, and secondary works.',
    scope: 'Promotional villas delivered with road and network packages.',
    coverLines: ['Rouiba', '4 Villas'],
    images: [media('image27.jpeg'), media('image28.jpeg'), media('image29.jpeg'), media('image30.jpeg')],
    sourceSlides: [10],
  },
  {
    id: 7,
    slug: 'sidi-benour-50-housing',
    title: '50 Free Promotional Housing Units',
    menuTitle: 'Sidi Benour',
    chapterLabel: 'Completed',
    location: 'Sidi Benour, Algiers',
    status: 'completed',
    summary: 'Structural works for 50 free promotional housing units in Sidi Benour, Algiers.',
    details: 'A structural delivery package focused on the core build-out of a free promotional housing programme.',
    scope: 'Residential structural works with phased on-site execution.',
    coverLines: ['Sidi Benour', '50 Housing Units'],
    images: [media('image31.jpeg'), media('image32.jpeg'), media('image33.jpeg'), media('image34.jpeg')],
    sourceSlides: [11],
  },
  {
    id: 8,
    slug: 'dely-brahim-240-housing',
    title: '240 Free Promotional Housing with Commercial Areas',
    menuTitle: 'Dely Brahim',
    chapterLabel: 'Current',
    location: 'Dely Brahim, Algiers',
    status: 'current',
    summary: 'Construction work in all secondary state bodies with roads and networks for 240 free promotional housing units with commercial areas, services, and underground parking.',
    details: 'An ongoing mixed-use residential development that adds service spaces and basement parking to a high-density housing programme.',
    scope: 'Housing, commercial areas, services, roads, networks, and underground parking.',
    coverLines: ['Dely Brahim', '240 Housing'],
    images: [media('image6.jpeg'), media('image35.jpeg'), media('image36.jpeg')],
    sourceSlides: [13],
  },
  {
    id: 9,
    slug: 'bas-mazagran-200-38-housing',
    title: '200 Assisted Housing and 38 Free Promotional Housing Units',
    menuTitle: 'Bas Mazagran',
    chapterLabel: 'Current',
    location: 'Bas Mazagran, Mostaganem',
    status: 'current',
    summary: 'Realisation of 200 assisted promotional housing units and 38 free promotional housing units with commercial premises, roads, and networks in Bas Mazagran.',
    details: 'A combined residential programme balancing assisted and free promotional units with accompanying commercial uses.',
    scope: 'Housing, commercial premises, roads, and service networks for a mixed programme.',
    coverLines: ['Bas Mazagran', '200 + 38 Housing'],
    images: [media('image37.jpeg'), media('image38.jpeg'), media('image39.jpeg')],
    sourceSlides: [14],
  },
  {
    id: 10,
    slug: 'reghaia-bouraada-250-housing',
    title: '250 Housing Units with Commercial Rental and Concierge Services',
    menuTitle: 'Reghaia',
    chapterLabel: 'Current',
    location: 'Bouraada Site, Reghaia, Algiers Province',
    status: 'current',
    summary: 'Construction work for the remaining 250 housing units intended for commercial rental sale, with premises for commercial use and concierge services at the Bouraada site in Reghaia.',
    details: 'An ongoing housing delivery combining rental-sale residential stock with commercial premises and concierge services.',
    scope: 'Housing completion with commercial-use premises and concierge support spaces.',
    coverLines: ['Reghaia', '250 Housing'],
    images: [media('image43.jpeg'), media('image44.jpeg'), media('image45.jpeg'), media('image40.jpeg')],
    sourceSlides: [15, 16],
  },
  {
    id: 11,
    slug: 'boudouaou-70-10-housing',
    title: '70 Assisted Housing and 10 Free Promotional Housing Units',
    menuTitle: 'Boudouaou',
    chapterLabel: 'Current',
    location: 'Boudouaou, Boumerdes',
    status: 'current',
    summary: 'Realisation of 70 assisted promotional housing units and 10 free promotional housing units with 10 professional and commercial premises, including roads and networks, in Boudouaou.',
    details: 'A live mixed programme that combines residential delivery with commercial and professional premises in one coordinated site package.',
    scope: 'Housing, professional premises, commercial spaces, roads, and networks.',
    coverLines: ['Boudouaou', '70 + 10 Housing'],
    images: [media('image46.jpeg'), media('image47.jpeg'), media('image48.jpeg'), media('image49.jpeg')],
    sourceSlides: [17, 18],
  },
];

export const heroSlides = [
  {
    image: media('image2.jpeg'),
    caption: 'Said Hamdine',
  },
  {
    image: media('image4.jpeg'),
    caption: 'Said Hamdine',
  },
  {
    image: media('image21.jpeg'),
    caption: 'Douira Centres',
  },
  {
    image: media('image22.jpeg'),
    caption: 'Said Hamdine',
  },
  {
    image: media('image27.jpeg'),
    caption: 'Rouiba Villas',
  },
];

export const homeProjectCards = projects;

export const imageSliderImages = heroSlides.map((slide) => slide.image);
