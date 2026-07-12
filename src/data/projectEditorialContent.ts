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
  metricCaptionLines: Record<'en' | 'fr', string[]> & Partial<Record<'ar-DZ' | 'tr', string[]>>;
  infoTopline: LocalizedText;
  infoEyebrow: LocalizedText;
  infoHeading: LocalizedText;
  infoParagraph: LocalizedText;
  scopeItems: ProjectEditorialScopeItem[];
};

const text = (en: string, fr: string, arDz?: string, tr?: string): LocalizedText => ({
  en,
  fr,
  'ar-DZ': arDz,
  tr,
});
const text4 = (en: string, fr: string, dz: string, tr: string): LocalizedText => ({
  en,
  fr,
  'ar-DZ': dz,
  tr,
});
const fact = (labelEn: string, labelFr: string, valueEn: string, valueFr: string): ProjectFact => ({
  label: text(labelEn, labelFr),
  value: text(valueEn, valueFr),
});
const fact4 = (
  labelEn: string,
  labelFr: string,
  labelDz: string,
  labelTr: string,
  valueEn: string,
  valueFr: string,
  valueDz: string,
  valueTr: string,
): ProjectFact => ({
  label: text4(labelEn, labelFr, labelDz, labelTr),
  value: text4(valueEn, valueFr, valueDz, valueTr),
});
const item = (icon: ProjectEditorialIcon, en: string, fr: string): ProjectEditorialScopeItem => ({
  icon,
  text: text(en, fr),
});
const item4 = (icon: ProjectEditorialIcon, en: string, fr: string, dz: string, tr: string): ProjectEditorialScopeItem => ({
  icon,
  text: text4(en, fr, dz, tr),
});

export const projectEditorialContent: Record<string, ProjectEditorialContent> = {
  'douaouda-300-500-housing': {
    heroDescription: text4(
      'The completed 300-home phase of a 500-home LPA programme in Douaouda, shaped around R+8 apartment blocks, professional premises, access works and full TCE delivery.',
      'À Douaouda, un programme résidentiel LPA livré clé en main, comprenant des immeubles R+8, des locaux professionnels, des accès et des aménagements extérieurs.',
      'برنامج LPA مكتمل في الدواودة، يضم كتلًا سكنية من طراز R+8 ومحلات مهنية وأشغال تهيئة المداخل وتنفيذًا كاملًا لجميع الأشغال.',
      "Douaouda'daki 500 konutluk LPA programının tamamlanan 300 konutluk etabı; R+8 bloklar, iş yerleri, ulaşım bağlantıları ve tüm yapım kalemleriyle teslim edildi.",
    ),
    intro: text4(
      'Douaouda brings the completed 300-home phase of a 500-home assisted promotional housing programme into a coastal setting, pairing family housing with professional premises and organised exterior works.',
      'À Douaouda, la tranche de 300 logements réalisée s’inscrit dans un programme LPA de 500 logements, avec des habitations familiales, des locaux professionnels et des aménagements extérieurs soignés.',
      'يجمع مشروع الدواودة بين 300 و500 سكن ترويجي مدعّم في موقع ساحلي، مع محلات مهنية وتهيئة خارجية منظمة.',
      'Douaouda sahilindeki 500 konutluk LPA programının 300 konutluk etabı; aile konutlarını, iş yerlerini ve planlı çevre düzenlemesini bir araya getiriyor.',
    ),
    columns: [
      text(
        'Igloo delivered the operation in full TCE scope, from reinforced-concrete works through secondary trades, MEP coordination, exterior access and finishing.',
        "Igloo a réalisé l'opération en TCE (Tous Corps d'État), depuis la structure en béton armé jusqu'aux corps d'état secondaires, en passant par la coordination MEP, les accès extérieurs et les finitions.", 'نفذت شركة "إيغلو" (Igloo) المشروع ضمن نطاق أعمال متكامل يشمل كافة التخصصات الإنشائية والمعمارية والهندسية (TCE)، بدءاً من أعمال الخرسانة المسلحة ومروراً بالأعمال التكميلية، وتنسيق الأنظمة الميكانيكية والكهربائية والسباكة (MEP)، وتجهيزات الوصول الخارجي، وصولاً إلى أعمال التشطيبات النهائية.', 'Igloo; betonarme işlerinden ince imalatlara, mekanik-elektrik-tesisat (MEP) koordinasyonundan çevre düzenlemesine ve son kat işlerine kadar tüm kalemleri (TCE) yöneterek projeyi tamamladı.',
      ),
      text(
        'The R+8 blocks combine F3 and F4 layouts with ground-level professional uses, creating a residential fabric that is practical, airy and connected to daily services.',
        'Les immeubles R+8 proposent des logements de type F3 et F4, associés à des locaux professionnels en rez-de-chaussée. Cela crée un environnement résidentiel pratique, aéré et connecté aux services du quotidien.', 'تجمع المباني المكونة من ثمانية طوابق فوق الطابق الأرضي (R+8) بين شقق من فئتي F3 وF4 واستخدامات مهنية في الطابق الأرضي، مما يخلق نسيجاً سكنياً عملياً وجيد التهوية ومرتبطاً بالخدمات اليومية.', 'R+8 katlı bloklar, F3 ve F4 tipi daireler ile zemin katlardaki mesleki kullanım alanlarını birleştiriyor. Bu sayede pratik, ferah ve günlük hizmetlere erişimi kolay bir konut yapısı oluşuyor.',
      ),
    ],
    statement: text4(
      'A coastal residential programme delivered with the discipline of a full-site operation: structure, services, circulation and finishes brought together as one.',
      "Un programme résidentiel côtier d'envergure, où la structure, les services, la circulation et les finitions sont intégrés pour former un ensemble harmonieux et fonctionnel.",
      'برنامج سكني ساحلي نُفذ بانضباط عملية متكاملة تجمع الهيكل والخدمات والحركة والتشطيبات في مشروع واحد.',
      'Planlı ve kontrollü bir şantiye yönetimiyle tamamlanan sahil projesi: Taşıyıcı sistem, altyapı, sirkülasyon ve ince işler bir bütün olarak inşa edildi.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje tipi', 'Assisted promotional housing (LPA)', 'Logements promotionnels aidés (LPA)', "السكن الترويجي المدعوم (LPA)", 'Destekli konut (LPA)'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Douaouda, Tipaza, Algeria', 'Douaouda, Tipaza, Algérie', "دواودة، تيبازة، الجزائر", 'Douaouda, Tipaza, Cezayir'),
      fact4('Programme', 'Programme', "برنامج", 'Program', '300 homes delivered within a 500-home programme', '300 logements réalisés dans un programme de 500 logements', "إنجاز 300 وحدة سكنية ضمن برنامج يضم 500 وحدة", '500 konutluk programın tamamlanan 300 konutluk etabı'),
      fact4('Completion', 'Achèvement', "الإنجاز", 'Tamamlanma Yılı', '2019', '2019', "2019", '2019'),
      fact4('Works', 'Travaux', "أعمال", 'İş Kapsamı', 'Full TCE delivery', "Tous corps d'état (TCE)", "تسليم كامل لـ TCE", 'Anahtar Teslim Tüm İnşaat İşleri (TCE)'),
      fact4('Client', 'Client', "عميل", 'İşveren', 'AADL', 'AADL', "AADL", 'AADL'),
    ],
    metric: '300/500',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['R+8 BLOCKS', 'F3 AND F4 HOMES', 'PROFESSIONAL PREMISES'],
      fr: ['BLOCS R+8', 'LOGEMENTS F3 ET F4', 'LOCAUX PROFESSIONNELS'],
    },
    infoTopline: text('OUR IMPACT', 'NOTRE IMPACT', 'أثرنا', 'ETKİMİZ'),
    infoEyebrow: text('COASTAL HOUSING', 'HABITAT LITTORAL', 'السكن الساحلي', 'SAHİLDE KONUT PROJESİ'),
    infoHeading: text(
      'A large housing programme made practical through access, services and professional uses.',
      'Un vaste programme de logements intégrant accès, services et locaux professionnels.', 'برنامج سكني ضخم أصبح عملياً بفضل سهولة الوصول والخدمات والاستخدامات المهنية.', 'Ulaşım, hizmet ve iş yerleriyle desteklenen büyük bir konut projesi.',
    ),
    infoParagraph: text(
      'The operation turns a large LPA brief into a complete residential setting: apartment blocks, professional premises, roads, exterior areas and technical networks are coordinated so the site works as a coherent neighbourhood.',
      "L'opération concrétise un vaste programme LPA en un cadre résidentiel complet : blocs d'habitation, locaux professionnels, voiries, espaces extérieurs et réseaux techniques sont coordonnés pour former un quartier cohérent.", 'يحوّل هذا المشروع مخططاً واسع النطاق للإسكان الميسّر (LPA) إلى بيئة سكنية متكاملة؛ حيث يتم تنسيق المباني السكنية، والمساحات المخصصة للأعمال، والطرق، والمساحات الخارجية، وشبكات البنية التحتية التقنية، ليعمل الموقع كحيٍّ متناغم ومترابط.', 'Bu proje, büyük ölçekli bir destekli konut (LPA) projesini eksiksiz bir yerleşim alanına dönüştürüyor. Apartman blokları, iş yerleri, yollar, çevre düzenlemeleri ve teknik altyapı, alanın uyumlu bir mahalle olarak işlemesi için birbiriyle uyumlu şekilde tasarlandı.',
    ),
    scopeItems: [
      item4('home', '300 homes delivered within a 500-home assisted housing programme', '300 logements réalisés dans un programme LPA de 500 logements', "إنجاز 300 وحدة ضمن برنامج سكني مدعوم يضم 500 وحدة", '500 konutluk destekli konut (LPA) programının tamamlanan 300 konutluk etabı'),
      item4('building', 'R+8 residential blocks with F3 and F4 layouts', 'Blocs résidentiels R+8 (F3 et F4)', "مبانٍ سكنية مكونة من طابق أرضي و8 طوابق علوية، بتصاميم F3 وF4", 'R+8 katlı, F3 ve F4 tipi dairelerden oluşan konut blokları'),
      item4('commerce', 'Professional premises integrated into the programme', 'Locaux professionnels intégrés au programme', "مرافق مهنية مدمجة في البرنامج", 'Konutlarla bütünleşik iş yerleri'),
      item4('network', 'TCE, MEP, roads and exterior coordination', 'Coordination TCE, MEP, voiries et aménagements extérieurs', "الهندسة المدنية والإنشائية (TCE)، والأنظمة الميكانيكية والكهربائية والصحية (MEP)، والطرق، والتنسيق الخارجي", 'Tüm işler (TCE), mekanik-elektrik-tesisat (MEP), yollar ve çevre düzenlemesi koordinasyonu'),
    ],
  },

  'sidi-abdallah-200-1200-housing': {
    heroDescription: text(
      'A 200-home delivery within the wider 1,200-home Sidi Abdallah programme, combining public promotional housing with commercial and professional premises.',
      "À Sidi Abdallah, une tranche de 200 logements LPP réalisée au sein d'un programme de 1 200 logements, intégrant des locaux commerciaux et professionnels.", 'تسليم 200 وحدة سكنية ضمن برنامج "سيدي عبد الله" الأوسع نطاقاً الذي يضم 1200 وحدة، ويجمع بين السكن الترقوي العمومي والمساحات التجارية والمهنية.', "Sidi Abdallah'taki 1.200 konutluk programın 200 konutluk bu etabında LPP bloklarıyla birlikte ticari ve mesleki birimler de yer alıyor.",
    ),
    intro: text(
      'Sidi Abdallah places public promotional housing inside a growing urban pole, with R+9 buildings, F3 and F4 apartments and everyday service spaces.',
      "Sidi Abdallah intègre des logements promotionnels publics au sein d'un pôle urbain en développement, avec des bâtiments R+9, des appartements F3 et F4, et des espaces de services.", 'يضم مشروع "سيدي عبد الله" وحدات سكنية عمومية ترقوية ضمن قطب حضري نامٍ، ويشتمل على مبانٍ بارتفاع (أرضي + 9 طوابق)، وشقق من فئتي F3 وF4، ومساحات مخصصة للخدمات اليومية.', 'Sidi Abdallah projesi, R+9 katlı binaları, F3 ve F4 tipi daireleri ve gündelik hizmet birimleriyle, gelişmekte olan bir kent merkezinde yeni kamu konutları (LPP) inşa ediyor.',
    ),
    columns: [
      text(
        'The project focuses on secondary works for a dense housing sequence, aligning facades, interiors, technical trades and commercial premises inside a larger master programme.',
        "Le projet concentre les corps d'état secondaires sur une séquence dense de logements, en harmonisant façades, intérieurs, lots techniques et locaux commerciaux au sein d'un programme directeur plus vaste.", 'يركز المشروع على الأعمال الثانوية لمجمع سكني عالي الكثافة، حيث يعمل على تنسيق الواجهات والتصميمات الداخلية والأنظمة الفنية والمساحات التجارية ضمن إطار مخطط رئيسي أوسع.', 'Bu projede, yoğun bir konut dokusu oluşturan blokların ince işlerine odaklanıldı. Daha büyük bir ana projenin parçası olarak cepheler, iç mekanlar, teknik imalatlar ve ticari birimler birbiriyle uyumlu şekilde tamamlandı.',
      ),
      text(
        'By pairing family housing with professional and retail spaces, the development supports a daily-life economy rather than a purely residential block structure.',
        "En associant logements familiaux, locaux professionnels et commerces, l'ensemble soutient une économie de proximité plutôt qu'une simple composition de blocs résidentiels.", 'من خلال الجمع بين الوحدات السكنية المخصصة للعائلات والمساحات المخصصة للأعمال وتجارة التجزئة، يدعم هذا المشروع اقتصاداً قائماً على الحياة اليومية، بدلاً من الاقتصار على نمط المجمعات السكنية البحتة.', 'Proje, konutları iş yerleri ve dükkanlarla bir arada tasarlayarak salt bir yerleşim alanı olmak yerine, gündelik hayatın ve ticaretin canlı olduğu bir çevre yaratıyor.',
      ),
    ],
    statement: text(
      'A public housing delivery where secondary trades, service premises and R+9 density work together to support a new urban district.',
      "Une réalisation de logements publics où les corps d'état secondaires, les locaux de service et la densité R+9 concourent à l'émergence d'un nouveau quartier urbain.", 'مشروع للإسكان العام تتضافر فيه الأنشطة التجارية الثانوية ومرافق الخدمات والكثافة البنائية (المكونة من طابق أرضي وتسعة طوابق علوية) لدعم حي حضري جديد.', 'Bu kamu konutu projesi; ince işçiliği, hizmet birimlerini ve R+9 katlı yoğun yerleşimiyle yeni bir kent merkezinin gelişimine zemin hazırlıyor.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje türü', 'Public promotional housing (LPP)', 'Logements promotionnels publics (LPP)', "السكن الترقوي العمومي (LPP)", 'Kamu Konutu (LPP)'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Sidi Abdallah, Algiers, Algeria', 'Sidi Abdallah, Alger, Algérie', "سيدي عبد الله، الجزائر العاصمة، الجزائر", 'Sidi Abdallah, Cezayir, Cezayir'),
      fact4('Programme', 'Programme', "برنامج", 'Kapsam', '200 homes within a 1,200-home programme', '200 logements dans un programme de 1200 logements', "200 منزل ضمن برنامج يضم 1200 منزل", '1.200 konutluk projenin 200 konutluk bölümü'),
      fact4('Completion', 'Achèvement', "الإنجاز", 'Tamamlanma', '2022', '2022', "2022", '2022'),
      fact4('Building type', 'Typologie', "نوع المبنى", 'Bina tipi', 'R+9 residential buildings', 'Bâtiments résidentiels R+9', "مبانٍ سكنية مكونة من طابق أرضي و9 طوابق علوية", 'Zemin+9 katlı konut binaları'),
      fact4('Works', 'Travaux', "أعمال", 'İş Kapsamı', 'Secondary trades without VRD', "Corps d'état secondaires sans VRD", "عمليات التداول في السوق الثانوية بدون ميزة إعادة الشراء عند الطلب (VRD)", 'Altyapı (VRD) hariç ince işler'),
    ],
    metric: '200',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['WITHIN 1,200 HOMES', 'R+9 BUILDINGS', 'COMMERCIAL PREMISES'],
      fr: ['DANS 1200 LOGEMENTS', 'BATIMENTS R+9', 'LOCAUX COMMERCIAUX'],
    },
    infoTopline: text('URBAN DELIVERY', 'RÉALISATION URBAINE', 'التوصيل داخل المدينة', 'KENTSEL PROJELER'),
    infoEyebrow: text('PUBLIC HOUSING', 'LOGEMENT PUBLIC', 'الإسكان العام', 'KAMU KONUTU'),
    infoHeading: text(
      'A compact residential programme strengthened by service spaces and a clear construction scope.',
      "Un programme résidentiel compact, enrichi d'espaces de service et d'un cadre d'intervention précis.", 'برنامج سكني مدمج تعززه مساحات خدمية ونطاق إنشائي واضح.', 'Hizmet alanları ve tanımlı iş kapsamıyla verimli bir konut projesi.',
    ),
    infoParagraph: text(
      'Inside the Sidi Abdallah development, Igloo coordinated the secondary works that turn structure into usable housing: finishes, waterproofing, joinery, MEP trades and commercial premises are brought into one operational rhythm.',
      "Au sein du développement de Sidi Abdallah, Igloo a coordonné les corps d'état secondaires qui transforment la structure en logements habitables : finitions, étanchéité, menuiseries, lots MEP et locaux commerciaux sont orchestrés pour une exécution harmonieuse.", 'في إطار مشروع "سيدي عبد الله" التطويري، تولت شركة "إيغلو" (Igloo) تنسيق الأعمال الثانوية التي تحوّل الهيكل الإنشائي إلى وحدات سكنية صالحة للاستخدام؛ حيث تم دمج أعمال التشطيبات، والعزل المائي، والنجارة، والأنظمة الميكانيكية والكهربائية والسباكة (MEP)، والمساحات التجارية ضمن إيقاع تشغيلي موحد.', 'Igloo, Sidi Abdallah projesinde, kaba inşaatı tamamlanmış yapıları yaşanılır konutlara dönüştüren tüm ince işlerin koordinasyonunu sağladı. Kaplamalar, su yalıtımı, doğramalar, mekanik-elektrik-tesisat (MET) işleri ve ticari alanların imalatı uyumlu bir şekilde yürütüldü.',
    ),
    scopeItems: [
      item4('home', '200 LPP homes delivered in a 1,200-home programme', "200 logements LPP livrés au sein d'un programme de 1 200 logements", "تسليم 200 وحدة سكنية ضمن برنامج يشمل 1200 وحدة", '1.200 konutluk projenin 200 Kamu Konutu (LPP) etabının tamamlanması'),
      item4('building', 'R+9 buildings with F3 and F4 homes', 'Bâtiments R+9 comprenant des logements F3 et F4', "مبانٍ مكونة من طابق أرضي و9 طوابق علوية، تضم وحدات سكنية من فئتي F3 وF4.", 'R+9 katlı binalarda F3 ve F4 tipi daireler'),
      item4('commerce', 'Commercial and professional premises', 'Locaux commerciaux et professionnels', "المقار التجارية والمهنية", 'Ticari ve profesyonel kullanımlı birimler'),
      item4('delivery', 'Completed in 2022 to technical standards', 'Achevé en 2022 conformément aux normes techniques', "أُنجز في عام 2022 وفقاً للمعايير الفنية", "2022'de teknik şartnamelere uygun tamamlanması"),
    ],
  },

  'staoueli-11-41-villas': {
    heroDescription: text(
      'Eleven villas delivered within the Les Pastorales programme in Staoueli, combining individual R+2 living with VRD, exterior works and refined finishes.',
      'À Staoueli, onze villas livrées au sein du programme Les Pastorales, alliant des habitations individuelles R+2 à des VRD, des aménagements extérieurs et des finitions soignées.', 'تسليم إحدى عشرة فيلا ضمن مشروع "Les Pastorales" في سطاوالي، تجمع بين نمط السكن المستقل (طابق أرضي + طابقين علويين) وبين البنية التحتية المتكاملة (VRD) والأعمال الخارجية والتشطيبات الراقية.', "Staoueli'deki Les Pastorales projesi için R+2 katlı on bir villa tamamlandı. Proje, konutların yanı sıra altyapı (VRD), dış mekan düzenlemeleri ve nitelikli ince işleri de kapsadı.",
    ),
    intro: text(
      'Staoueli shifts the portfolio into a more intimate register: individual villas, private residential comfort and exterior works designed around access and durability.',
      "Staoueli inscrit le portefeuille dans une échelle plus intime : villas individuelles, confort résidentiel privé et aménagements extérieurs pensés pour l'accès et la durabilité.", 'تنقل "Staoueli" محفظة أعمالها إلى طابع أكثر حميمية، يشمل الفيلات المستقلة، وتوفير الراحة في المساكن الخاصة، والأعمال الخارجية المصممة مع التركيز على سهولة الوصول والمتانة.', 'Staoueli projesi, portföyümüze daha butik bir ölçek katıyor: müstakil villalar, özel yaşam konforu ve tasarımında erişilebilirlik ile dayanıklılığın önceliklendirildiği dış mekanlar.',
    ),
    columns: [
      text(
        'The 11 villas sit inside a 41-villa programme and rely on a precise sequence of TCES, VRD, facade work and exterior networks to create a finished residential setting.',
        "Les 11 villas s'inscrivent dans un programme de 41 villas et s'appuient sur une séquence précise de TCES, VRD, travaux de façade et réseaux extérieurs pour créer un cadre résidentiel achevé.", 'تندرج هذه الفيلات الإحدى عشرة ضمن مشروع يضم 41 فيلا، وتعتمد في إنجازها على تسلسل دقيق يشمل الأعمال الفنية والتقنية (TCES)، وأعمال الطرق والشبكات (VRD)، وتشطيب الواجهات، والشبكات الخارجية، وذلك لتهيئة بيئة سكنية متكاملة.', '41 villalık projenin bir parçası olan bu 11 villanın yapımında, bütünlüklü bir konut çevresi oluşturmak için işlerin sıralaması kritik önem taşıyordu. Tüm ince işler (TCES), altyapı (VRD), cephe uygulamaları ve dış hat şebekeleri, bu hassas planlamaya göre tamamlandı.',
      ),
      text(
        'Their R+2 scale gives the project a domestic rhythm: balconies, guardrails, coatings and access works are treated as part of the same standing residential identity.',
        "L'échelle R+2 confère au projet un rythme résidentiel : balcons, garde-corps, enduits et accès sont conçus pour s'intégrer à une identité résidentielle de standing.", 'يضفي مقياس المباني (المكونة من طابق أرضي وطابقين علويين) على المشروع طابعاً سكنياً؛ إذ تُعامل الشرفات، والدرابزينات، والكسوات، وعناصر المداخل بوصفها جزءاً من الهوية السكنية القائمة ذاتها.', 'R+2 katlı yapı ölçeği, projeye özgün bir konut atmosferi katar. Balkonlar, korkuluklar, dış cephe kaplamaları ve girişler, tek bir konut kimliğinin parçası olarak ele alınmıştır.',
      ),
    ],
    statement: text(
      'A villa programme delivered through the details that make individual housing feel complete: access, networks, facades and carefully finished exterior spaces.',
      "Un programme de villas où chaque détail contribue à l'achèvement de l'habitat individuel : accès, réseaux, façades et espaces extérieurs sont soigneusement finis.", 'مشروع فيلات يتحقق من خلال التفاصيل التي تضفي شعوراً بالاكتمال على السكن الفردي: المداخل، وشبكات الخدمات، والواجهات، والمساحات الخارجية المُنجزة بعناية.', 'Bireysel konut deneyimini tamamlayan tüm detaylar göz önünde bulundurularak hayata geçirilen bir villa projesi: ulaşım, altyapı, cepheler ve titizlikle tamamlanmış dış mekanlar.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje Türü', 'Free promotional villas', 'Villas promotionnelles libres', "فيلات ترويجية مجانية", 'Serbest satışlı villalar (LPL)'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Les Pastorales, Staoueli, Algiers', 'Les Pastorales, Staoueli, Alger', "لي باستورال، سطاوالي، الجزائر العاصمة", 'Les Pastorales, Staoueli, Cezayir'),
      fact4('Programme', 'Programme', "برنامج", 'Proje Kapsamı', '11 villas within a 41-villa programme', '11 villas dans un programme de 41 villas', "11 فيلا ضمن برنامج يضم 41 فيلا", '41 villalık projenin 11 villası'),
      fact4('Completion', 'Achèvement', "الإنجاز", 'Tamamlanma', '2022', '2022', "2022", '2022'),
      fact4('Typology', 'Typologie', "علم التصنيف", 'Yapı Tipi', 'R+2 individual villas', 'Villas individuelles R+2', "فيلات مستقلة (أرضي + طابقين)", 'R+2 katlı müstakil villalar'),
      fact4('Works', 'Travaux', "أعمال", 'İş Kalemleri', 'Secondary trades and VRD', 'Second œuvre et VRD', "عمليات التداول في السوق الثانوية وVRD", 'İnce İşler ve Altyapı (VRD)'),
    ],
    metric: '11/41',
    metricLabel: text('VILLAS', 'VILLAS', 'فيلات', 'VİLLALAR'),
    metricCaptionLines: {
      en: ['R+2 INDIVIDUAL HOMES', 'VRD INCLUDED', 'STANDING RESIDENTIAL SETTING'],
      fr: ['HABITAT INDIVIDUEL R+2', 'VRD INCLUS', 'CADRE RÉSIDENTIEL DE STANDING'],
    },
    infoTopline: text('RESIDENTIAL VALUE', 'HABITAT RÉSIDENTIEL', 'القيمة السكنية', 'NİTELİKLİ KONUT'),
    infoEyebrow: text('VILLA DELIVERY', 'RÉALISATION DE VILLAS', 'توصيل إلى الفيلا', 'VİLLA YAPIMI'),
    infoHeading: text(
      'Individual homes shaped by exterior works, durable facades and controlled site coordination.',
      'Des maisons individuelles façonnées par des aménagements extérieurs, des façades durables et une coordination de chantier maîtrisée.', 'منازل مستقلة تتشكل ملامحها من خلال الأعمال الخارجية، والواجهات المتينة، وتنسيق الموقع المدروس.', 'Özenli dış mekanlar, dayanıklı cepheler ve planlı şantiye koordinasyonuyla inşa edilmiş müstakil konutlar.',
    ),
    infoParagraph: text(
      'The project demonstrates Igloo capacity on residential standing work: reinforced-concrete structures, networks, exterior arrangements and facade finishes come together to give the villas privacy, access and long-term quality.',
      "Ce projet illustre la capacité d'Igloo en matière de construction résidentielle de standing : structures en béton armé, réseaux, aménagements extérieurs et finitions de façade s'associent pour offrir aux villas intimité, accessibilité et une qualité pérenne.", 'يُبرز المشروع قدرات شركة "Igloo" في مجال الأعمال الإنشائية السكنية؛ حيث تتكامل الهياكل الخرسانية المسلحة، وشبكات الخدمات، والتنسيقات الخارجية، وتشطيبات الواجهات لتمنح الفيلات الخصوصية، وسهولة الوصول، والجودة المستدامة.', "Bu proje, Igloo'nun nitelikli konut yapımındaki uzmanlığını gösterir. Betonarme taşıyıcı sistem, altyapı, dış mekan düzenlemeleri ve cephe bitiş işleri, villaların mahremiyetini, ulaşım kolaylığını ve uzun ömürlü kalitesini güvence altına alacak şekilde uygulandı.",
    ),
    scopeItems: [
      item4('villa', '11 R+2 villas delivered inside Les Pastorales', '11 villas R+2 livrées au sein du projet Les Pastorales.', "تسليم 11 فيلا (أرضي + طابقين) داخل مجمع \"لي باستورال\" (Les Pastorales)", 'Les Pastorales projesinde 11 adet R+2 katlı villanın inşası'),
      item4('network', 'VRD, water, electricity and exterior networks', 'VRD, eau, électricité et réseaux extérieurs.', "أعمال الطرق والشبكات (VRD)، والمياه، والكهرباء، والشبكات الخارجية", 'Yol, su, elektrik ve diğer dış altyapı işleri (VRD)'),
      item4('building', 'Modern facades with balconies and guardrails', 'Façades modernes avec balcons et garde-corps.', "واجهات عصرية مزودة بشرفات وحواجز حماية", 'Balkon ve korkulukları dahil modern cephe uygulamaları'),
      item4('delivery', 'Completed in 2022 with controlled finishing quality', 'Achevé en 2022 avec une qualité de finition maîtrisée.', "اكتمل في عام 2022 بجودة تشطيبات مضبوطة", "İnce işlerin kalite kontrolü yapılarak 2022'de tamamlanması"),
    ],
  },

  rahmania: {
    heroTitleLines: ['Douira'],
    heroDescription: text4(
      "Secondary works for two commercial centres, completed in 2025 within Douira's 2,500-home residential programme.",
      'Travaux de second œuvre pour deux centres commerciaux intégrés au programme résidentiel de 2 500 logements à Douira.',
      'أشغال ثانوية لزوج مراكز تجارية، تكمّلو في 2025 ضمن برنامج 2500 سكن في دويرة.',
      "Douira'daki 2.500 konutluk yerleşim kapsamında yer alan iki ticaret merkezinin ince işleri tamamlandı.",
    ),
    intro: text4(
      "Two commercial centres in Douira's 2,500-home programme, fitted out to host the district's shops and everyday services.",
      'Deux centres commerciaux intégrés au programme de 2 500 logements de Douira, conçus pour accueillir les commerces et services de proximité du quartier.',
      'زوج مراكز تجارية ضمن برنامج 2500 سكن تاع دويرة، مهيّئين باش يحتاضنو محلات الحومة والخدمات اليومية.',
      "Douira'daki 2.500 konutluk yerleşimin iki ticaret merkezi, bölge halkının alışveriş ve günlük ihtiyaçlarını karşılamak üzere tasarlandı.",
    ),
    columns: [
      text4(
        'Igloo carried out the complete secondary works package for both centres, turning two reinforced-concrete structures into modern, functional spaces ready for traders and everyday users.',
        "Igloo a réalisé l'ensemble des corps d'état secondaires pour ces deux centres, transformant ainsi deux structures en béton armé en espaces modernes et fonctionnels, prêts à accueillir commerçants et usagers.",
        'Igloo دار كامل الأشغال الثانوية للزوج المراكز، وبدّل زوج هياكل من الخرسانة المسلحة لمساحات عصرية وعملية، جاهزين للتجار والمستعملين اليوميين.',
        'Igloo, her iki merkezin tüm ince işlerini üstlenerek, betonarme karkas halindeki iki yapıyı, işletmeler ve kullanıcılar için modern ve işlevsel mekanlara dönüştürdü.',
      ),
      text4(
        'The facades pair large glazed surfaces with decorative screen elements. Inside, circulation is organised around a central staircase, while a pyramidal glass skylight brings natural light into the retail levels.',
        "Les façades marient de larges surfaces vitrées à des éléments décoratifs. À l'intérieur, la circulation s'organise autour d'un escalier central, tandis qu'une verrière pyramidale inonde de lumière naturelle les niveaux commerciaux.",
        'الواجهات تجمع بين مساحات زجاجية كبيرة وعناصر تزيينية. من الداخل، الحركة منظمة حول درج مركزي، بينما قبة زجاجية هرمية تدخل الضوء الطبيعي لمستويات البيع.',
        'Cephelerde geniş cam yüzeyler, dekoratif panellerle birleştirildi. İç mekanlarda dolaşım, merkezi bir merdiven etrafında düzenlenirken, piramit formundaki cam tavan penceresi perakende katmanlarına doğal ışık sağlıyor.',
      ),
    ],
    statement: text4(
      'Delivered in 2025, on schedule, every secondary trade coordinated to the standard a modern commercial building demands.',
      "Livré en 2025, dans les délais impartis, ce projet a vu chaque corps d'état secondaire coordonné avec la rigueur qu'exige un bâtiment commercial moderne.",
      'تسلّم المشروع في 2025 وفي وقته، وكل حرفة ثانوية كانت منسقة بالمستوى اللي يحتاجه مبنى تجاري عصري.',
      'Modern bir ticari yapının gerektirdiği standartlarda yürütülen tüm ince işler sayesinde proje, 2025 yılında ve zamanında tamamlandı.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', 'نوع المشروع', 'Proje türü', 'Commercial centres', 'Centres commerciaux', 'مراكز تجارية', 'Ticaret merkezleri'),
      fact4('Location', 'Localisation', 'الموقع', 'Konum', 'Douira, Algiers, Algeria', 'Douira, Alger, Algérie', 'دويرة، الجزائر العاصمة، الجزائر', 'Douira, Cezayir'),
      fact4('Works', 'Travaux', 'الأشغال', 'İş Kapsamı', 'Secondary works packages (CES)', "Corps d'état secondaires (CES)", 'الأشغال الثانوية (CES)', 'Tüm ince işler (CES)'),
      fact4('Completion', 'Achèvement', 'الإنجاز', 'Teslim', '2025, on schedule', '2025, dans les délais', '2025، في الوقت', '2025, zamanında'),
      fact4('Development', 'Programme', 'البرنامج', 'Geliştirme', '2,500-home residential programme', 'Programme résidentiel de 2 500 logements', 'برنامج سكني بـ 2500 سكن', '2.500 Konut Projesi'),
      fact4('Contract', 'Contrat', 'العقد', 'Sözleşme', 'Execution', 'Réalisation', 'إنجاز', 'Uygulama'),
    ],
    metric: '2,500',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['IN A THRIVING', 'MASTERPLANNED', 'NEIGHBOURHOOD'],
      fr: ['DANS UN QUARTIER', 'RÉSIDENTIEL STRUCTURÉ', 'ET DYNAMIQUE'],
    },
    infoTopline: text4('OUR IMPACT', 'NOTRE IMPACT', 'أثرنا', 'BÖLGEYE KATKIMIZ'),
    infoEyebrow: text4('PROXIMITY SERVICES', 'SERVICES DE PROXIMITÉ', 'خدمات الجوار', 'YAKIN ÇEVRE HİZMETLERİ'),
    infoHeading: text4(
      "A hub of shops and services for the residents' daily needs.",
      'Un pôle de commerces et de services répondant aux besoins quotidiens des habitants.',
      'قطب تاع محلات وخدمات يجاوب على الاحتياجات اليومية تاع السكان.',
      'Sakinlerin Günlük İhtiyaçları İçin Ticaret ve Hizmet Merkezi',
    ),
    infoParagraph: text4(
      'The two centres form an attractive hub of activity inside the residential programme. Their layout favours accessibility, functional spaces and user comfort, adding to the urban quality and economic life of the Douira district.',
      "Les deux centres constituent un pôle d'activités attractif au sein du programme résidentiel. Leur conception favorise l'accessibilité, la fonctionnalité des espaces et le confort des usagers, contribuant ainsi à la qualité urbaine et à la vitalité économique du quartier de Douira.",
      'الزوج مراكز يشكلو قطب نشاط جذاب داخل البرنامج السكني. التوزيع تاعهم يسهل الوصول، ويوفر فضاءات عملية وراحة للمستعملين، وتسليمهم زاد في الجودة الحضرية والحياة الاقتصادية تاع دويرة.',
      'Bu iki merkez, konut projesi içinde çekici bir yaşam ve ticaret alanı oluşturuyor. Tasarımında erişilebilirlik, işlevsel mekanlar ve kullanıcı konforu ön planda tutulmuştur. Bu özellikleriyle Douira bölgesinin kentsel kalitesine ve ekonomik yaşamına değer katmaktadır.',
    ),
    scopeItems: [
      item4('commerce', 'Complete secondary works package (CES)', "Lot complet des corps d'état secondaires (CES)", 'حزمة الأشغال الثانوية الكاملة (CES)', 'Tüm ince işlerin yapımı (CES)'),
      item4('building', 'Reinforced concrete structure and glazed facades', 'Structure en béton armé et façades vitrées', 'هيكل من الخرسانة المسلحة وواجهات زجاجية', 'Betonarme karkas ve cam cepheler'),
      item4('route', 'Central staircase and pyramidal glass skylight', 'Escalier central et verrière pyramidale en verre', 'درج مركزي وقبة زجاجية هرمية', 'Merkezi merdiven ve piramit formunda cam çatı ışıklığı'),
      item4('delivery', 'Delivered in 2025, on schedule and to standard', 'Livré en 2025, dans les délais et aux normes.', 'تسلّم في 2025، في الوقت وبالمعايير', "2025'te, planlandığı gibi ve standartlara uygun tamamlandı."),
    ],
  },

  'said-hamdine-mixed-real-estate': {
    heroTitleLines: ['Mixed', 'Complex'],
    heroDescription: text(
      'A five-block mixed complex in Said Hamdine, combining 202 homes on a steeply sloping site with one basement parking level and three commercial entre-sols with mezzanine.',
      'À Saïd Hamdine, un ensemble immobilier mixte de cinq blocs réunit 202 logements sur un terrain à forte pente, avec un sous-sol de parking et trois entre-sols commerciaux avec mezzanine.', 'مجمع متعدد الاستخدامات يضم خمسة مبانٍ في "سعيد حمدين"، ويشتمل على 202 وحدة سكنية فوق أرضية شديدة الانحدار، وطابق سفلي لمواقف السيارات، وثلاثة طوابق تجارية نصفية مع ميزانين.', "Said Hamdine'deki beş bloklu karma proje; 202 konutu, eğimli arazi üzerinde bir bodrum otoparkı ve asma katlı üç ticari entre-sol ile bir araya getiriyor.",
    ),
    intro: text(
      'Said Hamdine combines housing, commerce and parking into one compact urban operation, carefully fitted to a steeply sloping site.',
      "Saïd Hamdine rassemble logements, commerces et stationnements au sein d'une opération urbaine compacte, adaptée à un terrain à forte pente.", 'يجمع مشروع "سعيد حمدين" بين السكن والتجارة ومواقف السيارات في مجمع حضري متكامل، صُمم ليتلاءم مع أرضية شديدة الانحدار.', 'Said Hamdine; konut, ticaret ve otopark işlevlerini, eğimli araziye uyum sağlayan kompakt bir kent projesinde birleştiriyor.',
    ),
    columns: [
      text(
        'The project brings together five residential blocks, 202 free promotional homes, three commercial entre-sols with mezzanine and one basement parking level on a steeply sloping Algerian site.',
        "Le projet réunit cinq blocs résidentiels, 202 logements promotionnels libres, trois entre-sols commerciaux avec mezzanine et un sous-sol de parking sur un site algérois à forte pente.", 'يجمع المشروع بين خمس كتل سكنية، و202 وحدة سكنية ترويجية حرة، وثلاثة طوابق تجارية نصفية مع ميزانين، وطابق سفلي لمواقف السيارات، وذلك فوق موقع جزائري شديد الانحدار.', "Bu proje, Cezayir'in yoğun dokulu ve eğimli bir bölgesinde; beş konut bloğu, 202 serbest satışlı konut (LPL), asma katlı üç ticari entre-sol ve bir bodrum otoparkından oluşuyor.",
      ),
      text(
        'Igloo coordinated the full TCE delivery with particular attention to facade expression, balconies, glazed surfaces, parking access and the sequencing of mixed-use volumes.',
        "Igloo a coordonné la réalisation complète en TCE, avec une attention particulière portée à l'adaptation au terrain à forte pente, aux accès au parking en sous-sol et à l'enchaînement des trois entre-sols commerciaux avec mezzanine.", 'تولت شركة "إيغلو" (Igloo) تنسيق عملية التنفيذ الكاملة، مع إيلاء اهتمام خاص للتكيف مع الأرضية شديدة الانحدار، ومداخل موقف السيارات تحت الأرض، وتسلسل الطوابق التجارية النصفية الثلاثة المزودة بميزانين.', 'Igloo, tüm yapı kalemlerini (TCE) koordine ederken eğimli araziye uyum, bodrum otoparkına erişim ve asma katlı üç ticari entre-solun birbirine bağlanmasına özel önem verdi.',
      ),
    ],
    statement: text(
      'A mixed urban complex held together by structure, access, housing and the discipline of delivery.',
      'Un ensemble urbain mixte structuré par la structure, les accès, le logement et la rigueur de la livraison.', 'مجمع حضري متعدد الاستخدامات تتماسك عناصره بفضل البنية الهيكلية، وشبكة الوصول، والإسكان، وانضباط التنفيذ.', 'Taşıyıcı sistem, erişim, konut ve planlı yapım disiplininin bütünleştirdiği karma bir kent bloğu.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje türü', 'Mixed real-estate complex', 'Ensemble immobilier mixte', "مجمع عقاري متعدد الاستخدامات", 'Karma kullanımlı proje'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Said Hamdine, Bir Mourad Rais, Algiers', 'Saïd Hamdine, Bir Mourad Raïs, Alger', "سعيد حمدين، بئر مراد رايس، الجزائر العاصمة", 'Said Hamdine, Bir Mourad Rais, Cezayir'),
      fact4('Housing units', 'Logements', "وحدات سكنية", 'Konut sayısı', '202 free promotional homes', '202 logements promotionnels libres', "202 منزل ترويجي مجاني", '202 serbest satışlı konut (LPL)'),
      fact4('Blocks', 'Blocs', "كتل", 'Blok sayısı', '5 residential blocks', '5 blocs résidentiels', "5 مبانٍ سكنية", '5 konut bloğu'),
      fact4('Parking', 'Parking', "موقف سيارات", 'Otopark', '1 basement parking level', '1 sous-sol de parking', "طابق سفلي واحد لمواقف السيارات", '1 bodrum otopark katı'),
      fact4('Site challenge', 'Défi du site', "تحدي الموقع", 'Saha zorluğu', 'Steeply sloping site; 3 commercial entre-sols with mezzanine', 'Terrain à forte pente ; 3 entre-sols commerciaux avec mezzanine', "أرضية شديدة الانحدار؛ 3 طوابق تجارية نصفية مع ميزانين", 'Eğimli arazi; asma katlı 3 ticari entre-sol'),
      fact4('Completion', 'Achèvement', "الإنجاز", 'Tamamlanma tarihi', '2023', '2023', "2023", '2023'),
    ],
    metric: '202',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['5 RESIDENTIAL BLOCKS', '3 COMMERCIAL ENTRE-SOLS', '1 BASEMENT PARKING LEVEL'],
      fr: ['5 BLOCS RÉSIDENTIELS', '3 ENTRE-SOLS COMMERCIAUX', '1 SOUS-SOL DE PARKING'],
    },
    infoTopline: text('MIXED PROGRAMME', 'PROGRAMME MIXTE', 'برنامج متنوع', 'KARMA PROJE'),
    infoEyebrow: text('HOUSING + COMMERCE', 'LOGEMENT + COMMERCE', 'السكن + التجارة', 'KONUT + TİCARET'),
    infoHeading: text(
      'A dense city block where homes, shops and parking operate as one system.',
      'Un îlot urbain dense où logements, commerces et parkings fonctionnent comme un seul système.', 'مربع سكني حضري كثيف، تعمل فيه المنازل والمتاجر ومواقف السيارات كمنظومة واحدة.', 'Konut, dükkan ve otoparkın tek sistemde buluştuğu yoğun bir kent adası.',
    ),
    infoParagraph: text(
      'The project demonstrates how mixed-use delivery depends on coordination: residential circulation, commercial frontage, parking levels, structure and exterior works all need to land together for the complex to feel legible and usable.',
      "Le projet montre combien la réalisation mixte dépend de la coordination : terrain en pente, circulations résidentielles, façades commerciales, entre-sols, sous-sol de parking, structure et aménagements extérieurs doivent converger pour rendre l'ensemble lisible et utilisable.", 'يُبرز المشروع كيف يعتمد تنفيذ المشاريع متعددة الاستخدامات على التنسيق؛ إذ لا بد من تكامل الأرضية المنحدرة، ومسارات الحركة السكنية، وواجهات المحلات التجارية، والطوابق النصفية، وطابق مواقف السيارات، والهيكل الإنشائي، والأعمال الخارجية، لضمان أن يبدو المجمع مفهوماً وسهل الاستخدام.', 'Bu proje, karma kullanımlı bir yapının eğimli arazide uygulanmasının ne kadar hassas bir koordinasyon gerektirdiğini gösteriyor. Konut sirkülasyonu, ticari cepheler, entre-sol katlar, bodrum otoparkı, taşıyıcı sistem ve dış işler tek bir bütün olarak ele alındı.',
    ),
    scopeItems: [
      item4('building', 'Five-block mixed real-estate delivery', 'Réalisation immobilière mixte de cinq blocs', "تسليم مشروع عقاري متعدد الاستخدامات يضم خمسة مبانٍ", 'Beş bloktan oluşan karma kullanımlı projenin yapımı.'),
      item4('home', '202 free promotional housing units', '202 logements promotionnels libres', "202 وحدة سكنية ترويجية مجانية", '202 serbest satışlı konut'),
      item4('commerce', 'Three levels dedicated to commercial activity', 'Trois niveaux dédiés aux activités commerciales', "ثلاثة طوابق مخصصة للأنشطة التجارية", 'Üç kat ticari alan'),
      item4('parking', 'One basement parking level', 'Un sous-sol de parking', "طابق سفلي واحد لمواقف السيارات", 'Bir bodrum otopark katı'),
    ],
  },

  'rouiba-4-promotional-villas': {
    heroDescription: text4(
      'Four free promotional villas in Rouiba, delivered with full TCE, VRD, exterior access and contemporary residential finishes.',
      'À Rouiba, quatre villas promotionnelles livrées clé en main, avec VRD, accès extérieurs et finitions résidentielles contemporaines.',
      'أربع فيلات ترويجية حرة في الرويبة، أُنجزت بأشغال TCE وVRD ومداخل خارجية وتشطيبات سكنية معاصرة.',
      "Rouiba'da yer alan 4 serbest satışlı villa; tüm mühendislik işleri (TCE), altyapı ve çevre düzenlemesi (VRD), dış erişimler ve modern ince işleriyle eksiksiz tamamlandı.",
    ),
    intro: text4(
      'Rouiba focuses on a compact villa programme where privacy, access and exterior works are as important as the buildings themselves.',
      "Rouiba se concentre sur un programme compact de villas où l'intimité, les accès et les aménagements extérieurs sont tout aussi essentiels que les bâtiments eux-mêmes.",
      'يركز مشروع الرويبة على برنامج فيلات صغير النطاق، حيث توازن الخصوصية وسهولة الوصول والأشغال الخارجية بين أهمية المباني نفسها وأهمية الموقع المحيط بها.',
      'Rouiba projesi, binaların kendisi kadar mahremiyete, erişim kolaylığına ve çevre düzenlemesine de önem veren kompakt bir villa konseptiyle tasarlandı.',
    ),
    columns: [
      text4(
        'Igloo delivered the villas as a complete site package: reinforced-concrete structures, internal and external finishes, MEP networks, roads and pedestrian access.',
        "Igloo a livré les villas dans le cadre d'une prestation complète : structures en béton armé, finitions intérieures et extérieures, réseaux MEP, voiries et accès piétons.",
        'سلّمت Igloo المشروع كحزمة موقع متكاملة: هياكل خرسانية مسلحة، تشطيبات داخلية وخارجية، شبكات MEP، طرقات وممرات مشاة.',
        'Igloo, bu villaların yapımını eksiksiz bir paket olarak üstlendi: betonarme yapılar, iç ve dış ince işler, mekanik-elektrik-tesisat (MEP) ağları, araç ve yaya yolları.',
      ),
      text4(
        'The project uses clean contemporary volumes and exterior arrangements to create a small-scale residential setting with durability, independence and comfort.',
        "Le projet s'appuie sur des volumes contemporains épurés et des aménagements extérieurs pour créer un cadre résidentiel à petite échelle, durable, indépendant et confortable.",
        'تعتمد العملية على أحجام معمارية نظيفة وترتيبات خارجية واضحة لتشكيل إطار سكني صغير الحجم يتسم بالمتانة والاستقلالية والراحة.',
        'Projede kullanılan sade ve modern hacimler ile dış mekan düzenlemeleri; dayanıklı, bağımsız ve konforlu bir yaşam sunan küçük ölçekli bir yerleşim alanı oluşturuyor.',
      ),
    ],
    statement: text4(
      'A small villa programme where the quality is carried by execution: access, networks, facades and finishing details aligned from site to handover.',
      "Un petit programme de villas dont la qualité tient à l'exécution : accès, réseaux, façades et finitions alignées du chantier à la livraison.",
      'برنامج فيلات صغير، تُقاس جودته بطريقة التنفيذ: الوصول، الشبكات، الواجهات وتفاصيل التشطيب تلتقي من الموقع حتى التسليم.',
      'Kalitesini uygulamanın belirlediği küçük ölçekli bir villa projesi: Erişim, altyapı, cepheler ve ince iş detayları sahadan teslime kadar uyum içinde tamamlandı.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', 'نوع المشروع', 'Proje türü', 'Free promotional villas', 'Villas promotionnelles libres', 'فيلات ترويجية حرة', 'Serbest satışlı villalar'),
      fact4('Location', 'Localisation', 'الموقع', 'Konum', 'Rouiba, Algiers, Algeria', 'Rouiba, Alger, Algérie', 'الرويبة، الجزائر، الجزائر', 'Rouiba, Cezayir, Cezayir'),
      fact4('Units', 'Unités', 'الوحدات', 'Konut sayısı', '4 individual villas', '4 villas individuelles', '4 فيلات مستقلة', '4 müstakil villa'),
      fact4('Completion', 'Achèvement', 'الإنجاز', 'Teslim Tarihi', '2023', '2023', '2023', '2023'),
      fact4('Works', 'Travaux', 'الأشغال', 'İş Kapsamı', 'TCE with VRD', 'TCE avec VRD', 'TCE وVRD', 'TCE ve VRD'),
      fact4('Use', 'Usage', 'الاستخدام', 'Kullanım Amacı', 'Individual residential housing', 'Habitat résidentiel individuel', 'سكن فردي', 'Müstakil konut'),
    ],
    metric: '4',
    metricLabel: text4('VILLAS', 'VILLAS', 'فيلات', 'VİLLALAR'),
    metricCaptionLines: {
      en: ['INDIVIDUAL HOMES', 'TCE + VRD', 'CONTEMPORARY FACADES'],
      fr: ['HABITAT INDIVIDUEL', 'TCE + VRD', 'FACADES CONTEMPORAINES'],
      'ar-DZ': ['بيوت مستقلة', 'TCE + VRD', 'واجهات معاصرة'],
      tr: ['MÜSTAKİL KONUTLAR', 'TCE + VRD', 'ÇAĞDAŞ CEPHELER'],
    },
    infoTopline: text4('SITE DELIVERY', 'RÉALISATION DU SITE', 'تسليم الموقع', 'ANAHTAR TESLİM UYGULAMA'),
    infoEyebrow: text4('PRIVATE RESIDENTIAL', 'RÉSIDENTIEL PRIVÉ', 'سكن خاص', 'Özel Konut'),
    infoHeading: text4(
      'Four villas delivered as a complete residential environment, not just four buildings.',
      'Quatre villas livrées comme un environnement résidentiel complet, et non de simples bâtiments.',
      'أربع فيلات سُلّمت كبيئة سكنية متكاملة، لا كمجرد أربعة مبانٍ منفصلة.',
      'Dört binadan fazlası: Çevresiyle bir bütün olarak tamamlanmış dört villa.',
    ),
    infoParagraph: text4(
      'The Rouiba operation ties construction quality to the surrounding works: roads, utility networks, access points, exterior arrangements and facade finishes all support the everyday comfort of the villas.',
      "L'opération de Rouiba lie la qualité de la construction aux aménagements environnants : les voiries, les réseaux, les points d'accès, les aménagements extérieurs et les finitions de façade contribuent tous au confort quotidien des villas.",
      'ترتبط عملية الرويبة بجودة الإنشاء وما يحيط بها: الطرقات، شبكات الخدمات، نقاط الولوج، الترتيبات الخارجية وتشطيبات الواجهات كلها تخدم راحة السكن اليومي.',
      'Rouiba projesinde inşaat kalitesi ve çevre düzenlemesi bir bütün olarak planlandı. Yollar, altyapı şebekeleri, erişim noktaları, dış mekanlar ve cephe detayları, villaların günlük yaşam konforunu artıracak şekilde uygulandı.',
    ),
    scopeItems: [
      item4('villa', '4 free promotional villas', '4 villas promotionnelles libres', '4 فيلات ترويجية حرة', '4 adet serbest satışlı villa (LPL)'),
      item4('network', 'VRD, vehicle access and pedestrian access', 'VRD, accès véhicules et accès piétons', 'VRD، دخول المركبات والمشاة', 'Altyapı ve çevre düzenlemesi (VRD), araç ve yaya ulaşımı'),
      item4('building', 'Reinforced-concrete structures with contemporary facades', 'Structures en béton armé avec façades contemporaines', 'هياكل خرسانية مسلحة مع واجهات معاصرة', 'Betonarme yapılar, modern cephe tasarımı'),
      item4('delivery', 'Completed in 2023 with full TCE coordination', 'Achevé en 2023 avec coordination complète TCE', 'أُنجز في 2023 مع تنسيق TCE كامل', "2023'te tüm yapı disiplinlerinin (TCE) koordinasyonuyla tamamlandı."),
    ],
  },

  'sidi-benour-50-housing': {
    heroDescription: text(
      'A 50-home R+13 residential delivery in Sidi Benour, part of a wider 362-home free promotional housing programme.',
      'À Sidi Benour, un programme de 50 logements en R+13, intégré à un ensemble plus vaste de 362 logements promotionnels libres.', 'تسليم مشروع سكني يضم 50 وحدة سكنية (مبنى مكون من طابق أرضي و13 طابقاً علوياً) في سيدي بنور، وذلك ضمن برنامج أوسع للسكن الترويجي الحر يشمل 362 وحدة سكنية.', "Sidi Benour'da yer alan R+13 katlı 50 dairelik konut bloku, 362 konutluk serbest satışlı (LPL) projenin bir parçasıdır.",
    ),
    intro: text(
      'Sidi Benour is a vertical housing operation designed to answer demand for quality homes while improving access, networks and exterior organisation.',
      "Sidi Benour est une opération de logement vertical conçue pour répondre à la demande en logements de qualité, tout en améliorant les accès, les réseaux et l'organisation extérieure.", 'يُعد مشروع "سيدي بنور" مبادرةً سكنيةً عموديةً صُممت لتلبية الطلب على مساكن عالية الجودة، مع العمل في الوقت ذاته على تحسين سبل الوصول وشبكات الخدمات والتنظيم الخارجي.', 'Sidi Benour, nitelikli konut talebini karşılamak ve aynı zamanda bölgedeki ulaşım bağlantılarını, altyapıyı ve çevre düzenini iyileştirmek için tasarlanmış bir çok katlı konut projesidir.',
    ),
    columns: [
      text(
        'The project combines TCE and VRD delivery for a R+13 residential building, coordinating structure, facades, technical systems and exterior circulation.',
        'Le projet associe les travaux TCE et VRD pour un immeuble résidentiel R+13, en coordonnant la structure, les façades, les systèmes techniques et les circulations extérieures.', 'يجمع المشروع بين تنفيذ أعمال البناء الشاملة (TCE) وأعمال الطرق والشبكات الخارجية (VRD) لمبنى سكني مكوّن من طابق أرضي و13 طابقاً علوياً، مع تنسيق الهيكل الإنشائي والواجهات والأنظمة الفنية ومسارات الحركة الخارجية.', 'Bu projede, R+13 katlı konut binasının tüm yapı disiplinleri (TCE) ile altyapı ve çevre düzenlemesi (VRD) işleri birlikte yönetildi. Taşıyıcı sistem, cepheler, teknik donanımlar ve dış mekanlardaki ulaşım ağı uyum içinde koordine edildi.',
      ),
      text(
        'Vertical lines, projecting balconies and controlled facade treatments give the building its identity, while utility networks and access works make the residence operational.',
        'Les lignes verticales, les balcons en saillie et le traitement maîtrisé des façades confèrent son identité au bâtiment, tandis que les réseaux et les accès rendent la résidence opérationnelle.', 'تمنح الخطوط الرأسية والشرفات البارزة والمعالجات المدروسة للواجهات المبنى هويته، في حين تضمن شبكات المرافق ومسارات الوصول جاهزية المبنى السكني للتشغيل.', 'Binanın mimari kimliğini dikey hatlar, konsol balkonlar ve kontrollü cephe hareketleri belirler. Altyapı ağları ve erişim düzenlemeleri ise projeyi yaşama hazır hale getirir.',
      ),
    ],
    statement: text(
      'A high-rise residential delivery where structure, facade rhythm, VRD and technical systems meet the demands of dense urban housing.',
      "Une réalisation résidentielle en hauteur où la structure, le rythme de façade, les VRD et les systèmes techniques répondent aux exigences de l'habitat urbain dense.", 'مشروع سكني شاهق الارتفاع تتناغم فيه العناصر الإنشائية، وإيقاع الواجهات، وشبكات المرافق والبنية التحتية (VRD)، والأنظمة التقنية، لتلبية متطلبات السكن الحضري عالي الكثافة.', 'Taşıyıcı sistem, cephe ritmi, altyapı (VRD) ve teknik donanımların yoğun şehir hayatının ihtiyaçlarını karşıladığı, yüksek katlı bir konut uygulaması.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje Türü', 'Free promotional housing (LPL)', 'Logements promotionnels libres (LPL)', "سكن ترويجي مجاني (LPL)", 'Serbest satışlı konut (LPL)'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Sidi Benour, Mehelma, Algiers', 'Sidi Benour, Mehelma, Alger', "سيدي بنور، المحالمة، الجزائر العاصمة", 'Sidi Benour, Mehelma, Cezayir'),
      fact4('Programme', 'Programme', "برنامج", 'İş Kapsamı', '50 homes within a 362-home programme', '50 logements dans un programme de 362 logements', "50 منزلاً ضمن برنامج يضم 362 منزلاً", '362 konutluk projenin 50 konutluk bölümü'),
      fact4('Completion', 'Achèvement', "الإنجاز", 'Teslim Tarihi', '2025', '2025', "2025", '2025'),
      fact4('Typology', 'Typologie', "علم التصنيف", 'Yapı Tipi', 'R+13 residential building', 'Immeuble résidentiel R+13', "مبنى سكني مكون من طابق أرضي و13 طابقاً علوياً", 'R+13 katlı konut binası'),
      fact4('Works', 'Travaux', "أعمال", 'İşlerin Kapsamı', 'TCE with VRD', 'TCE avec VRD', "TCE مع VRD", 'Tüm disiplinler (TCE) ve altyapı/çevre düzenlemesi (VRD)'),
    ],
    metric: '50/362',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['R+13 BUILDING', 'TCE + VRD', 'HIGH-RISE RESIDENTIAL'],
      fr: ['BATIMENT R+13', 'TCE + VRD', 'HABITAT EN HAUTEUR'],
    },
    infoTopline: text('VERTICAL HOUSING', 'HABITAT VERTICAL', 'الإسكان العمودي', 'ÇOK KATLI KONUT'),
    infoEyebrow: text('R+13 RESIDENCE', 'RÉSIDENCE R+13', 'مبنى سكني (أرضي + 13 طابقاً)', 'Zemin + 13 Katlı Konut'),
    infoHeading: text(
      'A vertical residential block completed through structure, networks and facade discipline.',
      'Immeuble résidentiel vertical : structure, réseaux et façades', 'كتلة سكنية رأسية تكتمل عبر عناصرها الإنشائية وشبكاتها ونظام واجهاتها المنضبط.', 'Yapı, altyapı ve cephe işlerinin uyumuyla tamamlanan dikey konut bloğu.',
    ),
    infoParagraph: text(
      'The Sidi Benour project highlights Igloo ability to deliver a high-rise housing sequence: reinforced concrete, exterior networks, MEP systems, facade work and circulation are coordinated to create a functional residence.',
      "Le projet Sidi Benour illustre la capacité d'Igloo à réaliser des logements en hauteur. Béton armé, réseaux extérieurs, systèmes MEP, travaux de façade et circulations sont coordonnés pour livrer une résidence fonctionnelle.", 'يُبرز مشروع "سيدي بنور" قدرة شركة "إيغلو" (Igloo) على إنجاز مجمع سكني شاهق الارتفاع؛ حيث يتم تنسيق عناصر المشروع — بدءاً من الخرسانة المسلحة والشبكات الخارجية وأنظمة الهندسة الميكانيكية والكهربائية والصحية (MEP)، ووصولاً إلى أعمال الواجهات ومسارات الحركة — لإنشاء مجمع سكني يتميز بالكفاءة والعملية.', "Sidi Benour projesi, Igloo'nun yüksek katlı konut yapımındaki uzmanlığını gösteriyor. İşlevsel bir konut binası ortaya çıkarmak için betonarme karkas, dış altyapı, MEP sistemleri, cephe işleri ve dolaşım alanları titizlikle koordine edildi.",
    ),
    scopeItems: [
      item4('home', '50 homes delivered within a 362-home programme', '50 logements réalisés sur un programme de 362 logements', "تسليم 50 وحدة سكنية ضمن برنامج يشمل 362 وحدة", '362 konutluk projenin bir etabı olan 50 konut tamamlandı.'),
      item4('building', 'R+13 residential building', 'Immeuble résidentiel R+13', "مبنى سكني مكون من طابق أرضي و13 طابقاً علوياً", 'Zemin + 13 katlı konut binası'),
      item4('network', 'TCE, VRD, MEP and exterior access', 'TCE, VRD, MEP et accès extérieurs', "اتفاقية حق البناء المؤقت (TCE)، وأعمال الطرق والمرافق (VRD)، والأنظمة الميكانيكية والكهربائية والسباكة (MEP)، ومسارات الوصول الخارجية.", 'Tüm inşaat kalemleri (TCE), altyapı (VRD), mekanik-elektrik-tesisat (MEP) ve dış bağlantılar'),
      item4('delivery', 'Completed in 2025 with coordinated execution', 'Achèvement coordonné en 2025', "أُنجز في عام 2025 بتنفيذٍ منسَّق", "Koordineli bir yapım süreciyle 2025'te tamamlandı."),
    ],
  },

  'dely-brahim-240-housing': {
    heroDescription: text(
      'A 33-storey residential tower in Dely Brahim, combining 240 free promotional homes with three commercial levels with terrace, three basement levels and three parking entre-sols.',
      'À Dely Brahim, une tour résidentielle de 33 étages réunit 240 logements LPL, trois niveaux commerciaux avec terrasse, trois sous-sols et trois entre-sols de parking.', 'برج سكني مكون من 33 طابقاً في دالي إبراهيم، يضم 240 وحدة سكنية ترويجية حرة، وثلاثة طوابق تجارية مع شرفة، وثلاثة طوابق سفلية وثلاثة طوابق نصفية لمواقف السيارات.', "Dely Brahim'de 33 katlı bu konut kulesi; 240 LPL konutu, teraslı üç ticari katı, üç bodrumu ve üç otopark entre-solunu bir araya getiriyor.",
    ),
    intro: text(
      'Dely Brahim pushes the portfolio upward: a 33-storey tower with homes from the 3rd to the 33rd floor, eight homes per floor, three commercial levels with terrace, three basement levels and three parking entre-sols.',
      "Le projet Dely Brahim s'élève sur 33 étages : les logements s'étendent du 3e au 33e étage, avec huit logements par étage. Le socle comprend trois niveaux commerciaux avec terrasse, trois sous-sols et trois entre-sols de parking.", 'يرتقي مشروع "دالي إبراهيم" بمحفظة المشاريع نحو الأعلى: برج مكوّن من 33 طابقاً، تمتد السكنات فيه من الطابق الثالث إلى الطابق 33 بواقع ثماني وحدات في كل طابق، مع ثلاثة طوابق تجارية بشرفة، وثلاثة طوابق سفلية وثلاثة طوابق نصفية لمواقف السيارات.', 'Dely Brahim projesi, 33 katlı bir kuledir. Konutlar 3. kattan 33. kata kadar uzanır ve her katta sekiz daire bulunur. Yapının tabanında teraslı üç ticari kat, üç bodrum ve üç otopark entre-solu yer alır.',
    ),
    columns: [
      text(
        'The operation combines housing density with everyday services, placing F3, F4 and F5 homes from the 3rd to the 33rd floor above three commercial levels with terrace, three basement levels and three parking entre-sols.',
        "L'opération associe densité résidentielle et services du quotidien : les logements F3, F4 et F5 s'étendent du 3e au 33e étage, au-dessus de trois niveaux commerciaux avec terrasse, de trois sous-sols et de trois entre-sols de parking.", 'يجمع المشروع بين الكثافة السكنية والخدمات اليومية؛ حيث تمتد وحدات F3 وF4 وF5 من الطابق الثالث إلى الطابق 33 فوق ثلاثة طوابق تجارية بشرفة، وثلاثة طوابق سفلية وثلاثة طوابق نصفية لمواقف السيارات.', 'Proje, konut yoğunluğunu gündelik hizmetlerle dengeliyor. F3, F4 ve F5 tipi daireler 3. kattan 33. kata kadar uzanırken, altta teraslı üç ticari kat, üç bodrum ve üç otopark entre-solu bulunuyor.',
      ),
      text(
        'Its technical challenge is vertical coordination: structure, elevators, fire safety, ventilation, plumbing, electricity, facade openings and exterior works all need a single execution rhythm.',
        "Son enjeu technique réside dans la coordination verticale : structure, ascenseurs, sécurité incendie, ventilation, plomberie, électricité, ouvertures de façade et VRD doivent suivre un rythme d'exécution unique.", 'تكمن التحدي الفني في التنسيق الرأسي؛ إذ تتطلب كل من العناصر الإنشائية، والمصاعد، وأنظمة السلامة من الحرائق، والتهوية، والسباكة، والكهرباء، وفتحات الواجهات، والأعمال الخارجية إيقاعاً تنفيذياً موحداً.', 'Projenin en önemli teknik meydan okuması, dikey koordinasyondur. Yapı, asansörler, yangın güvenliği, havalandırma, tesisat, elektrik, cephe elemanları ve dış işler gibi tüm kalemlerin tek bir yapım planı dahilinde uyumlu bir şekilde ilerlemesi gerekir.',
      ),
    ],
    statement: text(
      'A high-rise mixed residential tower where density, services and parking are coordinated into one vertical living system.',
      "Une tour résidentielle mixte de grande hauteur où densité, services et stationnement sont coordonnés au sein d'un système de vie vertical unique.", 'برج سكني شاهق متعدد الاستخدامات، تتكامل فيه الكثافة والخدمات ومواقف السيارات ضمن نظام معيشي رأسي موحّد.', 'Konut yoğunluğu, hizmetler ve otoparkın tek bir dikey yapıda bütünleştiği, yüksek katlı, karma kullanımlı bir kule.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje Tipi', 'Free promotional housing with services', 'Logements promotionnels libres avec services', "سكن ترويجي مجاني مع الخدمات", 'Serbest Satışlı Konut (LPL) ve Hizmet Alanları'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Bois des Cars, Dely Brahim, Algiers', 'Bois des Cars, Dely Brahim, Alger', "بوا دي كار، دالي إبراهيم، الجزائر العاصمة", 'Bois des Cars, Dely Brahim, Cezayir'),
      fact4('Housing units', 'Logements', "وحدات سكنية", 'Konut Sayısı', '240 homes', '240 logements', "240 منزلاً", '240 konut'),
      fact4('Typology', 'Typologie', "علم التصنيف", 'Tipoloji', 'Homes from the 3rd to the 33rd floor; 8 homes per floor', 'Logements du 3e au 33e étage ; 8 logements par étage', "السكنات من الطابق الثالث إلى الطابق 33؛ 8 وحدات في كل طابق", 'Konutlar 3. kattan 33. kata kadar; katta 8 daire'),
      fact4('Commercial base', 'Socle commercial', "القاعدة التجارية", 'Ticari taban', '3 commercial levels with terrace', '3 niveaux commerciaux avec terrasse', "3 طوابق تجارية مع شرفة", 'Teraslı 3 ticari kat'),
      fact4('Parking', 'Parking', "موقف سيارات", 'Otopark', '3 basement levels + 3 parking entre-sols', '3 sous-sols + 3 entre-sols de parking', "3 طوابق سفلية + 3 طوابق نصفية لمواقف السيارات", '3 bodrum + 3 otopark entre-solu'),
      fact4('Status', 'Statut', "الحالة", 'Durum', 'In progress', 'En cours de réalisation', "قيد التنفيذ", 'Devam ediyor'),
    ],
    metric: '240',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUTLAR'),
    metricCaptionLines: {
      en: ['33-STOREY TOWER', '8 HOMES PER FLOOR', 'SERVICES + PARKING'],
      fr: ['TOUR DE 33 ÉTAGES', '8 LOGEMENTS PAR ÉTAGE', '3 SOUS-SOLS + 3 ENTRE-SOLS'],
    },
    infoTopline: text('HIGH-RISE SCOPE', 'PROJET VERTICAL', 'نطاق المباني الشاهقة', 'YÜKSEK YAPI KAPSAMI'),
    infoEyebrow: text('TOWER DELIVERY', 'CONSTRUCTION DE TOUR', 'تسليم البرج', 'Kule Yapımı'),
    infoHeading: text(
      'A vertical neighbourhood built around homes, services and underground parking.',
      'Un quartier vertical conçu autour de logements, de services et de stationnements souterrains.', 'حيٌّ عموديٌّ مُصمَّمٌ حول الوحدات السكنية والخدمات ومواقف السيارات تحت الأرض.', 'Konut, hizmet alanları ve yeraltı otoparkını birleştiren dikey bir mahalle.',
    ),
    infoParagraph: text(
      'Dely Brahim demands the precision of a large vertical project: three commercial levels with terrace, three basement levels, three parking entre-sols and 240 homes from the 3rd to the 33rd floor must be coordinated as one system.',
      "Dely Brahim exige la précision d'un grand projet vertical : trois niveaux commerciaux avec terrasse, trois sous-sols, trois entre-sols de parking et 240 logements du 3e au 33e étage doivent être coordonnés comme un seul système.", 'يتطلب مشروع "دالي إبراهيم" دقةً تضاهي المشاريع العمودية الضخمة؛ إذ يجب تنسيق ثلاثة طوابق تجارية بشرفة، وثلاثة طوابق سفلية، وثلاثة طوابق نصفية لمواقف السيارات، و240 وحدة سكنية من الطابق الثالث إلى الطابق 33 ضمن منظومة واحدة.', 'Dely Brahim gibi büyük dikey projeler, yüksek hassasiyet gerektirir. Teraslı üç ticari kat, üç bodrum, üç otopark entre-solu ve 3. kattan 33. kata uzanan 240 konut tek bir sistem olarak koordine edilmelidir.',
    ),
    scopeItems: [
      item4('building', '33-storey residential tower', 'Tour résidentielle de 33 étages', "برج سكني مكون من 33 طابقاً", '33 katlı konut kulesi'),
      item4('home', '240 homes with F3, F4 and F5 layouts', '240 logements de typologies F3, F4 et F5', "240 وحدة سكنية بتصاميم F3 وF4 وF5", 'F3, F4 ve F5 tipinde 240 konut'),
      item4('parking', 'Three basement levels and three parking entre-sols', 'Trois sous-sols et trois entre-sols de parking', "ثلاثة طوابق سفلية وثلاثة طوابق نصفية لمواقف السيارات", 'Üç bodrum ve üç otopark entre-solu'),
      item4('network', 'CES, VRD, MEP, lifts and safety systems', 'CES, VRD, MEP, ascenseurs et systèmes de sécurité', "أنظمة التحكم المركزية (CES)، وأنظمة تقليل الجهد (VRD)، والأنظمة الميكانيكية والكهربائية والسباكة (MEP)، والمصاعد، وأنظمة السلامة.", 'CES, VRD, MEP, asansörler ve güvenlik sistemleri'),
    ],
  },

  'bas-mazagran-200-38-housing': {
    heroDescription: text(
      'Seven residential blocks in the seaside Bas Mazagran programme, combining 200 assisted and 38 free promotional homes with ground-floor commercial spaces and VRD during the delivery phase.',
      'Dans le programme balnéaire de Bas Mazagran, sept blocs résidentiels regroupent 200 logements LPA et 38 logements LPL, avec des commerces en rez-de-chaussée et les VRD ; le projet est en phase de livraison.', 'سبع عمارات سكنية ضمن البرنامج الساحلي لباس مزغران، تجمع بين 200 وحدة سكنية مدعومة و38 وحدة سكنية حرة، مع مساحات تجارية في الطابق الأرضي وأعمال الطرق والشبكات، والمشروع في مرحلة التسليم.', "Bas Mazagran'daki sahil projesinde yedi blok; 200 LPA ve 38 LPL konutunu, zemin kattaki ticari alanları ve VRD işlerini bir araya getiriyor. Proje teslim aşamasında.",
    ),
    intro: text(
      'Bas Mazagran is a seaside, family-oriented residential ensemble now in the delivery phase, with R+5 and R+9 blocks, F3/F4 homes and commercial spaces that activate the ground level.',
      'Bas Mazagran est un ensemble résidentiel balnéaire destiné aux familles, actuellement en phase de livraison, composé de blocs R+5 et R+9, de logements F3/F4 et de commerces en rez-de-chaussée.', 'صُمم مشروع "باس مازاغران" ليكون مجمعاً سكنياً ساحلياً ملائماً للعائلات، وهو حالياً في مرحلة التسليم، ويضم مباني R+5 وR+9، وشقق F3 وF4، ومساحات تجارية في الطابق الأرضي.', 'Bas Mazagran, teslim aşamasındaki sahil projesidir. Aile yaşamına uygun yerleşimde R+5 ve R+9 bloklar, F3/F4 daireler ve zemin kat ticari alanları bulunuyor.',
    ),
    columns: [
      text(
        'The project brings together 200 assisted homes and 38 free promotional homes across seven blocks, with four apartments per floor and commercial premises at street level.',
        'Le projet réunit 200 logements aidés et 38 logements promotionnels libres répartis sur sept blocs, avec quatre appartements par étage et des commerces en rez-de-chaussée.', 'يضم المشروع 200 وحدة سكنية مدعومة و38 وحدة سكنية مطروحة في السوق الحر موزعة على سبعة مبانٍ، بواقع أربع شقق في كل طابق، مع توفير مساحات تجارية في مستوى الشارع.', 'Proje, yedi blokta 200 destekli konut ve 38 serbest satışlı konut içeriyor. Zemin katlarında ticari alanlar bulunan blokların her katında dört daire yer alıyor.',
      ),
      text(
        'Its delivery phase brings together the remaining secondary works, thermal facade treatment, technical networks, exterior roads, parking and pedestrian routes.',
        'La phase de livraison réunit les travaux de second œuvre restants, le traitement thermique des façades, les réseaux techniques, les voiries, les parkings et les cheminements piétons.', 'تجمع مرحلة التسليم الأعمال الثانوية المتبقية، والمعالجة الحرارية للواجهات، والشبكات الفنية، والطرق الخارجية، ومواقف السيارات، ومسارات المشاة.', 'Teslim aşamasında kalan ince işler, cephe ısı yalıtımı, teknik altyapı, çevre yolları, otopark ve yaya yolları birlikte tamamlanıyor.',
      ),
    ],
    statement: text(
      'A seven-block residential programme where housing mix, ground-floor commerce and exterior infrastructure are built into one urban address.',
      'Un programme résidentiel de sept blocs où mixité de logements, commerces en rez-de-chaussée et infrastructures extérieures forment une adresse urbaine complète.', 'مشروع سكني مكوّن من سبعة مبانٍ، يدمج بين تنوّع الوحدات السكنية والمساحات التجارية في الطوابق الأرضية والبنية التحتية الخارجية، ليشكّل معاً وجهةً حضريةً متكاملة.', 'Farklı konut tiplerini, zemin kat ticari alanlarını ve çevre düzenlemesini tek bir adreste buluşturan yedi bloklu bir proje.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje türü', 'Promotional housing with commerce', 'Logements promotionnels avec commerces', "مشروع سكني وتجاري ترويجي", 'Ticari Alanlı Serbest Satışlı Konut'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Bas Mazagran, Mostaganem, Algeria', 'Bas Mazagran, Mostaganem, Algérie', "باس مزغران، مستغانم، الجزائر", 'Bas Mazagran, Mostaganem, Cezayir'),
      fact4('Programme', 'Programme', "برنامج", 'Proje Kapsamı', '200 assisted homes + 38 free promotional homes', '200 logements aidés + 38 logements promotionnels libres', "200 وحدة سكنية مدعومة + 38 وحدة سكنية ترويجية مجانية", '200 destekli konut + 38 serbest satışlı konut'),
      fact4('Blocks', 'Blocs', "كتل", 'Bloklar', '7 blocks, R+5 and R+9', '7 blocs, R+5 et R+9', "7 مبانٍ، بارتفاع (أرضي + 5 طوابق) و(أرضي + 9 طوابق)", '7 blok, R+5 ve R+9'),
      fact4('Status', 'Statut', "الحالة", 'Durum', 'Delivery phase', 'En phase de livraison', "في مرحلة التسليم", 'Teslim aşamasında'),
    ],
    metric: '238',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['7 BLOCKS', 'R+5 AND R+9', 'DELIVERY PHASE'],
      fr: ['7 BLOCS', 'R+5 ET R+9', 'PHASE DE LIVRAISON'],
    },
    infoTopline: text('DELIVERY PHASE', 'PHASE DE LIVRAISON', 'مرحلة التسليم', 'TESLİM AŞAMASI'),
    infoEyebrow: text('BAS MAZAGRAN', 'BAS MAZAGRAN', 'باس مازاغران', 'BAS MAZAGRAN'),
    infoHeading: text(
      'A seaside family housing programme moving through delivery, strengthened by commerce, access and exterior infrastructure.',
      'Un programme de logements familiaux balnéaire en phase de livraison, renforcé par les commerces, les accès et les infrastructures extérieures.', 'برنامج سكني عائلي ساحلي في مرحلة التسليم، يتعزز بفضل الأنشطة التجارية وسهولة الوصول والبنية التحتية الخارجية.', 'Ticari alanlar, ulaşım ve dış altyapısıyla teslim aşamasına gelen bir sahil konut projesi.',
    ),
    infoParagraph: text(
      'The seaside Mostaganem project balances assisted and free promotional units with shops, networks and exterior spaces. During delivery, Igloo connects the seven blocks to roads, utilities, parking and pedestrian movement so the ensemble can function as a complete residential district.',
      "Le projet balnéaire de Mostaganem équilibre logements aidés et logements en promotion libre, complétés par des commerces, des réseaux et des espaces extérieurs. En phase de livraison, le rôle d'Igloo est de relier les sept blocs aux voiries, aux réseaux techniques, aux parkings et aux cheminements piétons afin de former un quartier résidentiel complet.", 'يوازن المشروع الساحلي في مستغانم بين الوحدات السكنية المدعومة والحرة، إلى جانب المتاجر وشبكات المرافق والمساحات الخارجية. وفي مرحلة التسليم، تربط شركة Igloo المباني السبعة بالطرق والمرافق ومواقف السيارات ومسارات المشاة ليعمل المجمع كحي سكني متكامل.', "Mostaganem'deki sahil projesi, destekli (LPA) ve serbest satışlı (LPL) konutları dükkanlar, altyapı ağları ve çevre düzenlemeleriyle birleştiriyor. Teslim aşamasında Igloo, yedi bloğu yollara, altyapıya, otoparklara ve yaya yollarına bağlayarak projeyi eksiksiz bir yerleşim alanına dönüştürüyor.",
    ),
    scopeItems: [
      item4('home', '238 homes across assisted and free promotional programmes', '238 logements répartis entre programmes aidés et en promotion libre', "238 منزلاً ضمن برامج ترويجية مدعومة ومجانية", 'Destekli (LPA) ve serbest satışlı (LPL) olmak üzere 238 konut'),
      item4('building', 'Seven R+5 and R+9 residential blocks', 'Sept blocs résidentiels R+5 et R+9', "سبعة مبانٍ سكنية بارتفاع (أرضي + 5 طوابق) و(أرضي + 9 طوابق)", 'Yedi adet R+5 ve R+9 konut bloğu'),
      item4('commerce', 'Ground-floor commercial spaces', 'Espaces commerciaux en rez-de-chaussée', "مساحات تجارية في الطابق الأرضي", 'Zemin kat ticari alanları'),
      item4('network', 'VRD, utilities, parking and pedestrian routes', 'VRD, réseaux, parkings et cheminements piétons', "الطرق والمرافق ومواقف السيارات ومسارات المشاة", 'Yol ve altyapı işleri (VRD), otopark ve yaya yolları'),
    ],
  },

  'reghaia-bouraada-250-housing': {
    heroDescription: text(
      'A 250-home rent-to-own residential ensemble in Bouraada, Reghaia, completed with commercial premises, concierge spaces and secondary works.',
      'À Bouraada, Reghaïa, un ensemble résidentiel de 250 logements en location-vente est complété par des locaux commerciaux, des espaces de conciergerie et des travaux de second œuvre.', 'مجمع سكني يضم 250 وحدة سكنية بنظام الإيجار المنتهي بالتمليك في منطقة "بورادة" ببلدية "الرغاية"، ويشمل محلات تجارية ومساحات مخصصة للحراس وأعمالاً ثانوية.', "Reghaia Bouraada'daki 250 konutluk bu yerleşim; ticari birimler, kapıcı alanları ve tamamlayıcı yapım işleriyle birlikte teslim edildi.",
    ),
    intro: text(
      'Reghaia organises seven R+9 blocks around practical family housing, local services and concierge spaces that make the residence easier to live in.',
      "Reghaia regroupe sept blocs R+9, conçus autour de logements familiaux pratiques, de services de proximité et d'espaces de conciergerie qui simplifient la vie au sein de la résidence.", 'يضم مشروع "رغاية" سبعة مبانٍ سكنية (بارتفاع أرضي + 9 طوابق) تتمحور حول وحدات سكنية عائلية عملية، وخدمات محلية، ومساحات مخصصة لخدمات الاستقبال والإرشاد، مما يضفي مزيداً من الراحة والسهولة على الحياة اليومية في المجمع السكني.', 'Reghaia projesi, aile yaşamına uygun konutları, yerel hizmet birimlerini ve site sakinlerinin günlük yaşamını kolaylaştıran kapıcı alanlarını barındıran yedi adet R+9 bloktan oluşur.',
    ),
    columns: [
      text(
        'The programme delivers 250 rent-to-own homes, with four units per floor and a clear F3/F4 mix supported by commercial premises and concierge spaces.',
        'Le programme comprend 250 logements en location-vente, avec quatre unités par étage et une répartition claire entre F3 et F4, complétés par des locaux commerciaux et des conciergeries.', 'يوفر البرنامج 250 وحدة سكنية بنظام "الإيجار المنتهي بالتملك"، بواقع أربع وحدات في كل طابق ومزيج واضح من فئات F3 وF4، مدعومة بمساحات تجارية ومرافق لخدمات الاستقبال (الكونسيرج).', 'Bu proje, kiralama yoluyla satışa sunulan 250 konut sağlar. Her katta dört dairenin bulunduğu yapıda, F3 ve F4 daire tiplerinin yanı sıra ticari birimler ve kapıcı alanları da bulunur.',
      ),
      text(
        'Igloo completed the remaining secondary works, facade execution, technical installations and exterior arrangements, bringing the seven-block site to a usable residential standard.',
        "Igloo a mené à bien les travaux secondaires restants, l'habillage des façades, les installations techniques et les aménagements extérieurs, rendant ainsi le site de sept blocs pleinement habitable.", 'أنجزت شركة "إيغلو" (Igloo) الأعمال الثانوية المتبقية، وتنفيذ الواجهات، والتركيبات الفنية، والتجهيزات الخارجية، مما أهّل الموقع -المكون من سبعة مبانٍ- ليصبح صالحاً للاستخدام السكني.', 'Igloo, kalan ince işleri, cephe uygulamalarını, teknik tesisatları ve çevre düzenlemelerini tamamlayarak yedi bloklu siteyi yaşanabilir bir konut standardına ulaştırdı.',
      ),
    ],
    statement: text(
      'A seven-block rent-to-own programme completed through the quiet work that makes housing livable: facades, finishes, networks and daily service spaces.',
      'Un programme de sept blocs en location-vente, finalisé par un travail essentiel qui rend le logement habitable : façades, finitions, réseaux et services du quotidien.', 'برنامج للإسكان بنظام "الإيجار المنتهي بالتملك" يضم سبعة مبانٍ، أُنجز من خلال ذلك العمل الهادئ الذي يجعل السكن صالحاً للحياة: الواجهات، والتشطيبات، وشبكات المرافق، ومساحات الخدمات اليومية.', 'Bir konutu yaşanılır kılan detaylar vardır: cepheler, ince işler, altyapı ağları ve gündelik hizmet alanları. Yedi bloktan oluşan bu kiralama yoluyla satış projesi, bu detaylara gösterilen özenle tamamlandı.',
    ),
    facts: [
      fact4('Project type', 'Type de projet', "نوع المشروع", 'Proje Tipi', 'Rent-to-own housing with premises', 'Logements en location-vente avec locaux commerciaux', "سكن بنظام الإيجار المنتهي بالتمليك مع المرافق", 'Ticari Birimli Kiralama Yoluyla Satış Konutları'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Bouraada, Reghaia, Algiers', 'Bouraada, Reghaïa, Alger', "بورادة، رغاية، الجزائر العاصمة", 'Bouraada, Reghaia, Cezayir'),
      fact4('Housing units', 'Logements', "وحدات سكنية", 'Konut Sayısı', '250 homes', '250 logements', "250 منزلاً", '250 Konut'),
      fact4('Blocks', 'Blocs', "كتل", 'Blok Sayısı', '7 R+9 blocks', '7 blocs R+9', "7 مبانٍ بارتفاع (أرضي + 9 طوابق)", '7 Adet R+9 Blok'),
      fact4('Completion', 'Achèvement', "الإنجاز", 'Tamamlanma', '2025', '2025', "2025", '2025'),
      fact4('Client', 'Client', "عميل", 'İşveren', 'AADL', 'AADL', "AADL", 'AADL'),
    ],
    metric: '250',
    metricLabel: text('HOMES', 'LOGEMENTS', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['7 R+9 BLOCKS', 'F3 AND F4 HOMES', 'COMMERCIAL + CONCIERGE'],
      fr: ['7 BLOCS R+9', 'LOGEMENTS F3 ET F4', 'COMMERCES + CONCIERGERIES'],
    },
    infoTopline: text('RESIDENTIAL COMPLETION', 'Achèvement résidentiel', 'إنجاز المشروع السكني', 'Konut Yapımı'),
    infoEyebrow: text('RENT-TO-OWN HOUSING', 'Location-vente', 'سكن بنظام الإيجار المنتهي بالتملك', 'Satın Alma Opsiyonlu Konut'),
    infoHeading: text(
      'Seven residential blocks completed with the services and finishes residents use every day.',
      'Sept blocs résidentiels achevés, intégrant les services et finitions essentiels au quotidien des résidents.', 'سبعة مبانٍ سكنية مُنجزة، ومُزوَّدة بالخدمات والتشطيبات التي يستخدمها السكان يومياً.', 'Sakinlerin günlük yaşamına uygun hizmet ve donatılarla tamamlanan yedi konut bloğu.',
    ),
    infoParagraph: text(
      'Reghaia is defined by practical residential completion: facade works, interior finishes, MEP systems, commercial premises, concierge spaces, access routes and exterior areas are coordinated into one finished environment.',
      "Reghaia se définit par un achèvement résidentiel complet et fonctionnel : travaux de façade, finitions intérieures, systèmes MEP, locaux commerciaux, espaces de conciergerie, voies d'accès et aménagements extérieurs sont harmonieusement coordonnés pour former un environnement de vie abouti.", 'يتميز مشروع "رغاية" بإنجاز سكني عملي؛ حيث تتكامل أعمال الواجهات، والتشطيبات الداخلية، وأنظمة الهندسة الميكانيكية والكهربائية والصحية (MEP)، والمساحات التجارية، ومناطق الاستقبال والخدمات، ومسارات الدخول، والمساحات الخارجية، لتشكل جميعها بيئة متكاملة وجاهزة للاستخدام.', 'Reghaia projesi, cephe işleri, iç mekanlar, mekanik-elektrik-sıhhi tesisat (MEP) sistemleri, ticari alanlar, danışma birimleri, ulaşım yolları ve dış mekanların eksiksiz ve işlevsel bir bütünlük içinde tamamlanmasıyla öne çıkar.',
    ),
    scopeItems: [
      item4('home', '250 rent-to-own housing units', '250 logements en location-vente', "250 وحدة سكنية بنظام الإيجار المنتهي بالتمليك", '250 satın alma opsiyonlu konut'),
      item4('building', 'Seven R+9 residential blocks', 'Sept blocs résidentiels R+9', "سبعة مبانٍ سكنية (أرضي + 9 طوابق)", 'Yedi adet R+9 katlı konut bloğu'),
      item4('commerce', 'Commercial premises and concierge spaces', 'Locaux commerciaux et conciergeries', "المساحات التجارية ومساحات خدمات الاستقبال", 'Ticari alanlar ve danışma birimleri'),
      item4('delivery', 'Completed in 2025 with secondary works and facades', 'Achevé en 2025 (second œuvre et façades).', "اكتمل في عام 2025، بما في ذلك الأعمال الثانوية والواجهات.", "İnce işler ve cephe kaplamaları 2025'te tamamlandı."),
    ],
  },

  'boudouaou-70-10-housing': {
    heroDescription: text(
      'An 80-home mixed residential programme in Boudouaou, combining assisted and free promotional housing with professional and commercial premises.',
      'À Boudouaou, un programme résidentiel mixte de 80 logements associe 70 logements LPA, 10 logements LPL et des locaux professionnels et commerciaux.', 'مشروع سكني متنوع يضم 80 وحدة سكنية في بودواو، يجمع بين السكن المدعوم والسكن الترقوي الحر، إلى جانب مساحات مهنية وتجارية.', "Boudouaou'daki 80 konutluk karma projede 70 LPA ve 10 LPL konutun yanı sıra ticari ve mesleki birimler de yer alıyor.",
    ),
    intro: text(
      'Boudouaou combines 70 LPA homes, 10 LPL homes and 10 professional/commercial premises across three blocks with different heights.',
      'À Boudouaou, le programme associe 70 logements LPA, 10 logements LPL et 10 locaux professionnels et commerciaux, répartis sur trois blocs de hauteurs différentes.', 'يضم مشروع بودواو 70 وحدة سكنية من نوع LPA و10 وحدات من نوع LPL و10 محلات مهنية/تجارية موزعة على ثلاثة مبانٍ متفاوتة الارتفاع.', 'Boudouaou projesi, farklı kat yüksekliklerine sahip üç blokta 70 destekli (LPA) konut, 10 serbest satışlı (LPL) konut ve 10 ticari/mesleki birimden oluşur.',
    ),
    columns: [
      text(
        'The development is organised across blocks A and B in R+8 and block C in R+5, with four homes per floor and a balanced F3/F4 mix.',
        "Le développement s'organise autour des blocs A et B (R+8) et du bloc C (R+5), avec quatre logements par étage et une répartition équilibrée F3/F4.", 'يتوزع المشروع على المبنيين A وB (بارتفاع 8 طوابق فوق الأرضي) والمبنى C (بارتفاع 5 طوابق فوق الأرضي)، بواقع أربع وحدات سكنية في كل طابق ومزيج متوازن من الشقق من فئتي F3 وF4.', 'Proje, R+8 katlı A ve B blokları ile R+5 katlı C bloğundan oluşur. Her katta, dengeli bir F3/F4 dağılımıyla dört daire yer alır.',
      ),
      text(
        'Igloo delivered secondary trades, viabilisation and tertiary networks, aligning finishes, waterproofing, joinery, MEP, roads and exterior arrangements with the mixed-use programme.',
        "Igloo a réalisé le second œuvre, la viabilisation et les réseaux tertiaires, intégrant les finitions, l'étanchéité, les menuiseries, le MEP, les voiries et les aménagements extérieurs, en parfaite adéquation avec les exigences du programme mixte.", 'تولت شركة "Igloo" تنفيذ الأعمال الثانوية، وأعمال تهيئة الموقع وتوفير المرافق، وشبكات التوزيع الفرعية، مع مواءمة أعمال التشطيبات، والعزل المائي، والنجارة، والأنظمة الميكانيكية والكهربائية والصحية (MEP)، والطرق، والتنسيق الخارجي للموقع بما يتناسب مع برنامج المشروع متعدد الاستخدامات.', 'Igloo, projenin karma kullanım yapısına uygun olarak tüm ince işleri, altyapıyı ve saha içi ağları inşa etti. Kaplamalar, su yalıtımı, doğramalar, MEP sistemleri, yollar ve peyzaj, bir bütün olarak ele alınıp uygulandı.',
      ),
    ],
    statement: text(
      'A compact mixed residential programme where three blocks, local premises and site networks are delivered as one usable neighbourhood setting.',
      'Un programme résidentiel mixte et compact où trois blocs, des locaux professionnels et commerciaux, et les réseaux du site sont livrés pour former un ensemble de quartier fonctionnel.', 'مشروع سكني مدمج ومتنوع الاستخدامات، يجمع بين ثلاثة مبانٍ سكنية ومرافق محلية وشبكات خدمية ضمن الموقع، ليُشكل معاً بيئة حيّ متكاملة وقابلة للاستخدام.', 'Kompakt bir karma proje: Üç blok, ticari birimler ve saha içi ağlar, kullanıma hazır tek bir mahalle olarak tamamlandı.',
    ),
    facts: [
      fact4('Project type', 'Nature du projet', "نوع المشروع", 'Proje Tipi', 'LPA and LPL housing with premises', 'Logements LPA et LPL avec locaux commerciaux et professionnels', "مبيت LPA وLPL مع المرافق", 'Destekli (LPA) ve serbest satışlı (LPL) konutlar ile ticari birimler'),
      fact4('Location', 'Localisation', "الموقع", 'Konum', 'Boudouaou, Boumerdes, Algeria', 'Boudouaou, Boumerdès, Algérie', "بودواو، بومرداس، الجزائر", 'Boudouaou, Boumerdès, Cezayir'),
      fact4('Housing units', 'Logements', "وحدات سكنية", 'Konut Sayısı', '80 homes (70 LPA + 10 LPL)', '80 logements (70 LPA + 10 LPL)', "80 وحدة سكنية (70 LPA + 10 LPL)", '80 konut (70 LPA + 10 LPL)'),
      fact4('Blocks', 'Blocs', "كتل", 'Bloklar', '3 blocks: R+8, R+8 and R+5', '3 blocs : R+8, R+8 et R+5', "3 مبانٍ: أرضي + 8 طوابق، أرضي + 8 طوابق، وأرضي + 5 طوابق.", '3 blok: R+8, R+8 ve R+5'),
      fact4('Completion', 'Achèvement', "الإنجاز", 'Tamamlanma', '2025', '2025', "2025", '2025'),
      fact4('Client', 'Client', "عميل", 'İşveren', 'AADL', 'AADL', "AADL", 'AADL'),
    ],
    metric: '80',
    metricLabel: text('HOMES', 'Logements', 'منازل', 'KONUT'),
    metricCaptionLines: {
      en: ['70 LPA + 10 LPL', '3 RESIDENTIAL BLOCKS', '10 PROFESSIONAL PREMISES'],
      fr: ['70 LPA + 10 LPL', '3 BLOCS RÉSIDENTIELS', '10 LOCAUX PROFESSIONNELS'],
    },
    infoTopline: text('MIXED RESIDENTIAL', 'Résidentiel mixte', 'سكني مختلط', 'Karma Kullanım'),
    infoEyebrow: text('BOUDOUAOU', 'Boudouaou', 'بودواو', 'BOUDOUAOU'),
    infoHeading: text(
      'A three-block residential ensemble strengthened by local premises and complete site servicing.',
      'Un ensemble résidentiel de trois blocs, renforcé par des locaux de proximité et une viabilisation complète du site.', 'مجمع سكني مكوّن من ثلاثة مبانٍ، تدعمه مرافق محلية وخدمات موقع متكاملة.', 'Ticari alanlar ve bütün altyapısıyla üç bloklu konut projesi.',
    ),
    infoParagraph: text(
      'Boudouaou stands out through its balance: assisted and free promotional housing, professional premises, varied block heights and tertiary networks are coordinated so the development supports both homes and local activity.',
      "Boudouaou se distingue par son équilibre : logements aidés et libres, locaux professionnels, hauteurs de blocs variées et réseaux tertiaires sont coordonnés pour soutenir à la fois l'habitat et l'activité locale.", 'تتميز منطقة "بودواو" بتوازنها؛ إذ تتناغم فيها مشاريع السكن الترقوي (المدعوم والحر) والمساحات المهنية والمباني متفاوتة الارتفاع وشبكات الخدمات، مما يجعل هذا المخطط العمراني داعماً لكل من السكن والنشاط المحلي.', 'Bu projede, konut ve yerel ticari hayatı birlikte destekleyen dengeli bir planlama yapıldı. Farklı yüksekliklerdeki bloklarda destekli (LPA) ve serbest satışlı (LPL) konutlar, iş yerleri ve tüm altyapı hizmetleri bir arada yer alıyor.',
    ),
    scopeItems: [
      item4('home', '80 homes, including 70 LPA and 10 LPL units', '80 logements, dont 70 LPA et 10 LPL.', "80 مسكناً، تشمل 70 وحدة من فئة LPA و10 وحدات من فئة LPL", "70'i destekli (LPA), 10'u serbest satışlı (LPL) olmak üzere toplam 80 konut"),
      item4('building', 'Three blocks with R+8 and R+5 typologies', 'Trois blocs de typologie R+8 et R+5', "ثلاثة مبانٍ بنماذج (أرضي + 8 طوابق) و(أرضي + 5 طوابق)", 'R+8 ve R+5 katlı üç blok'),
      item4('commerce', '10 commercial and professional premises', '10 locaux commerciaux et professionnels', "10 وحدات تجارية ومهنية", '10 adet ticari alan'),
      item4('network', 'Secondary trades, viabilisation and tertiary networks', 'Corps secondaires, viabilisation et réseaux tertiaires', "الأعمال الإنشائية التكميلية، وأعمال التهيئة والتجهيز، والشبكات الفرعية (الثالثية)", 'İnce işler, saha altyapısı ve bağlantı ağları'),
    ],
  },
};

export function getProjectEditorialContent(project: ProjectRecord) {
  return projectEditorialContent[project.slug];
}
