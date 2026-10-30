// Données de départ (reprises de l'ancien site). Utilisées si la base n'est pas encore branchée.
import type { Product } from '@/lib/types';

const raw = [
 {
  "slug": "lavande",
  "name": "Lavande",
  "short": "Relaxation profonde et sommeil réparateur.",
  "description": "L'huile essentielle de Lavande est reconnue pour ses propriétés calmantes et relaxantes. Elle favorise un sommeil réparateur et apaise les tensions nerveuses et musculaires. Emblème de la phytothérapie, elle est incontournable dans toute aromathérapie de qualité.",
  "benefits": [
   "Favorise le sommeil",
   "Réduit le stress",
   "Apaise les tensions musculaires",
   "Parfum doux et floral",
   "Cicatrisante légère"
  ],
  "usage_tips": "En diffusion le soir dans la chambre ou en massage dilué sur les tempes et poignets. Quelques gouttes sur l'oreiller pour un sommeil apaisé.",
  "category": "huile-essentielle",
  "usage": "relaxation",
  "image_url": "/images/Lavande.jpg",
  "featured": true,
  "sort": 0
 },
 {
  "slug": "brule-graisse",
  "name": "Brûle Graisse",
  "short": "Mélange d'huiles pour massage, en accompagnement d'une routine minceur.",
  "description": "Un mélange d'huiles essentielles sélectionnées par Pur'Essence, à utiliser en massage sur les zones ciblées. Le massage régulier aide à tonifier la peau et accompagne une alimentation équilibrée et une activité physique. Formule exclusive Pur'Essence.",
  "benefits": [
   "Mélange prêt à l'emploi pour massage",
   "Accompagne une routine minceur",
   "Sensation de peau tonifiée",
   "À associer à une alimentation équilibrée et à une activité physique"
  ],
  "usage_tips": "Appliquer en massage circulaire sur les zones ciblées (ventre, cuisses, hanches). Utiliser quotidiennement matin et soir pour de meilleurs résultats.",
  "category": "melange",
  "usage": "beaute",
  "image_url": "/images/brulegraisse.png",
  "featured": true,
  "sort": 1
 },
 {
  "slug": "menthe-poivree",
  "name": "Menthe Poivrée",
  "short": "Revitalisante et apaisante pour les maux de tête.",
  "description": "La Menthe Poivrée est un stimulant naturel puissant, idéal contre les maux de tête, les nausées et la fatigue mentale. Son effet frais et vivifiant agit rapidement sur l'esprit et le corps, redonnant énergie et clarté.",
  "benefits": [
   "Soulage les maux de tête",
   "Stimule la concentration",
   "Effet rafraîchissant immédiat",
   "Aide à la digestion",
   "Anti-nausées"
  ],
  "usage_tips": "Appliquer 1 goutte diluée sur les tempes pour les maux de tête. En diffusion pour stimuler la concentration. Déconseillée aux enfants de moins de 6 ans.",
  "category": "huile-essentielle",
  "usage": "energie",
  "image_url": "/images/menthepoivree.png",
  "featured": true,
  "sort": 2
 },
 {
  "slug": "ail",
  "name": "Ail",
  "short": "Traditionnellement utilisée pour ses propriétés assainissantes.",
  "description": "L'huile essentielle d'Ail est l'une des plus puissantes de la nature en termes de propriétés antibactériennes et antivirales. Utilisée depuis l'Antiquité comme remède naturel, elle soutient efficacement le système immunitaire et combat les agents infectieux.",
  "benefits": [
   "Antibactérien puissant",
   "Antiviral naturel",
   "Renforce l'immunité",
   "Antifongique"
  ],
  "usage_tips": "En diffusion atmosphérique très diluée ou en application cutanée fortement diluée dans une huile végétale. Consulter un spécialiste avant utilisation interne.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/AIL.png",
  "featured": false,
  "sort": 3
 },
 {
  "slug": "basilic-tropical",
  "name": "Basilic Tropical",
  "short": "Antispasmodique puissant et aide digestive.",
  "description": "Le Basilic Tropical est reconnu comme l'un des meilleurs antispasmodiques naturels. Il soulage efficacement les crampes digestives, les spasmes musculaires et les douleurs abdominales. Son action apaisante sur le système nerveux en fait aussi un excellent anti-stress.",
  "benefits": [
   "Antispasmodique majeur",
   "Soulage les crampes digestives",
   "Réduit les spasmes musculaires",
   "Apaisant nerveux",
   "Anti-stress"
  ],
  "usage_tips": "En massage doux sur le ventre, dilué dans une huile végétale. Peut également être utilisé en diffusion pour ses vertus apaisantes.",
  "category": "huile-essentielle",
  "usage": "digestion",
  "image_url": "/image produit 3D/BASILIC TROPICAL.png",
  "featured": false,
  "sort": 4
 },
 {
  "slug": "cannelle",
  "name": "Cannelle",
  "short": "Réchauffante et stimulante, combat la fatigue.",
  "description": "La Cannelle est une huile chaude, épicée et enveloppante aux propriétés tonifiantes et anti-infectieuses exceptionnelles. Elle stimule la circulation sanguine, réchauffe le corps et apporte une énergie vivifiante en période de fatigue ou de convalescence.",
  "benefits": [
   "Tonifiante et énergisante",
   "Anti-infectieuse puissante",
   "Réchauffante naturelle",
   "Stimule la circulation",
   "Aphrodisiaque douce"
  ],
  "usage_tips": "En diffusion pour réchauffer l'atmosphère. Toujours fortement diluer pour l'usage cutané. Usage interne réservé aux spécialistes.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/CANNELLE.png",
  "featured": false,
  "sort": 5
 },
 {
  "slug": "carotte",
  "name": "Carotte",
  "short": "Régénérante cutanée pour un teint éclatant.",
  "description": "L'huile essentielle de Carotte est un soin beauté d'exception, riche en bêta-carotène et en vitamine A. Elle régénère les cellules cutanées en profondeur, illumine le teint terne et est reconnue pour ses propriétés anti-âge remarquables.",
  "benefits": [
   "Régénère les cellules de la peau",
   "Illumine et unifie le teint",
   "Action anti-âge naturelle",
   "Nourrit les peaux sèches",
   "Revitalise le cuir chevelu"
  ],
  "usage_tips": "Ajouter 2 à 3 gouttes à votre crème de nuit ou à une huile végétale. Idéale pour les peaux matures, ternes ou marquées.",
  "category": "huile-essentielle",
  "usage": "beaute",
  "image_url": "/image produit 3D/CAROTTE.png",
  "featured": false,
  "sort": 6
 },
 {
  "slug": "cedre",
  "name": "Cèdre",
  "short": "Boisé et apaisant, favorise la méditation.",
  "description": "Le Cèdre offre un parfum boisé, chaud et profondément apaisant qui invite à la méditation et à la reconnexion intérieure. Il possède également des propriétés décongestionnantes respiratoires et stimulantes pour la circulation lymphatique.",
  "benefits": [
   "Favorise la méditation et le calme",
   "Parfum boisé et enveloppant",
   "Décongestionnant respiratoire",
   "Stimule la lymphe",
   "Anti-stress profond"
  ],
  "usage_tips": "En diffusion pendant la méditation, le yoga ou la prière. En massage dilué sur le thorax pour les congestions.",
  "category": "huile-essentielle",
  "usage": "relaxation",
  "image_url": "/image produit 3D/CEDRE.png",
  "featured": false,
  "sort": 7
 },
 {
  "slug": "citronnelle",
  "name": "Citronnelle",
  "short": "Anti-moustique naturel et purifiant atmosphérique.",
  "description": "La Citronnelle est le répulsif d'insectes naturel par excellence, indispensable sous les tropiques. Son parfum frais et citronné purifie l'air, éloigne les moustiques et autres insectes, tout en apportant une note revigorante dans l'atmosphère.",
  "benefits": [
   "Répulsif insectes naturel",
   "Purifie et assainit l'air",
   "Effet rafraîchissant",
   "Antiseptique atmosphérique",
   "Soulage les courbatures"
  ],
  "usage_tips": "En diffusion le soir pour éloigner les moustiques. Application cutanée fortement diluée. Peut aussi être intégré à un spray corporel naturel.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/CITRONNELLE.png",
  "featured": false,
  "sort": 8
 },
 {
  "slug": "clou-de-girofle",
  "name": "Clou de Girofle",
  "short": "Antalgique naturel, soulage les douleurs dentaires.",
  "description": "Le Clou de Girofle est l'une des huiles les plus puissantes en termes d'action antalgique et antiseptique. Reconnue depuis des siècles pour soulager les douleurs dentaires, elle est aussi un remarquable anti-infectieux à large spectre.",
  "benefits": [
   "Antalgique puissant",
   "Antiseptique majeur",
   "Soulage les douleurs dentaires",
   "Anti-infectieux large spectre",
   "Stimulant général"
  ],
  "usage_tips": "Appliquer 1 goutte sur un coton pour les douleurs dentaires. Toujours diluer pour l'usage cutané. Déconseillé pur sur les muqueuses.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/CLOU GIROFLE.png",
  "featured": false,
  "sort": 9
 },
 {
  "slug": "curcuma",
  "name": "Curcuma",
  "short": "Anti-inflammatoire puissant et antioxydant.",
  "description": "Le Curcuma est l'une des épices les plus étudiées pour ses vertus thérapeutiques. En huile essentielle, ses propriétés anti-inflammatoires et antioxydantes sont décuplées. Il soutient la digestion.",
  "benefits": [
   "Anti-inflammatoire puissant",
   "Antioxydant majeur",
   "Soutient et stimule la digestion",
   "Protège les cellules"
  ],
  "usage_tips": "En massage dilué sur les articulations douloureuses ou les zones inflammées. En diffusion pour ses propriétés purifiantes. Consulter un spécialiste pour usage interne.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/CURCUMA.png",
  "featured": false,
  "sort": 10
 },
 {
  "slug": "cypres",
  "name": "Cyprès",
  "short": "Favorise la circulation et décongestionne.",
  "description": "Le Cyprès est l'huile de référence pour les troubles circulatoires et veineux. Il soulage les jambes lourdes, réduit les varices et les hémorroïdes, et tonifie les parois veineuses. Son action drainante en fait aussi un excellent allié minceur.",
  "benefits": [
   "Améliore la circulation sanguine",
   "Tonique veineux et lymphatique",
   "Réduit les jambes lourdes",
   "Décongestionnant",
   "Drainant naturel"
  ],
  "usage_tips": "En massage des jambes du bas vers le haut, dilué dans une huile végétale. En diffusion pour ses vertus respiratoires.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/CYPRES.png",
  "featured": false,
  "sort": 11
 },
 {
  "slug": "eucalyptus",
  "name": "Eucalyptus",
  "short": "Fraîcheur naturelle pour une respiration libre.",
  "description": "L'Eucalyptus est un puissant décongestionnant respiratoire qui libère les voies aériennes et purifie l'air ambiant. Son action antivirale et antibactérienne en fait un indispensable en cas de rhume, bronchite ou grippe.",
  "benefits": [
   "Libère les voies respiratoires",
   "Purifie et assainit l'air",
   "Effet rafraîchissant intense",
   "Antibactérien et antiviral",
   "Fébrifuge naturel"
  ],
  "usage_tips": "En inhalation dans un bol d'eau chaude ou en diffusion. Appliquer dilué sur la poitrine et le dos.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/EUCALYPTUS.png",
  "featured": true,
  "sort": 12
 },
 {
  "slug": "gaultherie",
  "name": "Gaulthérie",
  "short": "Anti-douleur musculaire et articulaire naturel.",
  "description": "La Gaulthérie couchée est le remède naturel par excellence pour les douleurs musculaires, articulaires et rhumatismales. Riche en salicylate de méthyle, elle agit rapidement en profondeur sur les douleurs, à l'instar de l'aspirine naturelle.",
  "benefits": [
   "Anti-douleur musculaire et articulaire",
   "Anti-inflammatoire rapide",
   "Soulage les contractures",
   "Effet chauffant et pénétrant",
   "Idéale après le sport"
  ],
  "usage_tips": "En massage dilué (max 30%) sur les zones douloureuses. Ne pas appliquer sur une peau lésée. Déconseillée aux personnes sensibles à l'aspirine.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/GAULTHERIE.png",
  "featured": false,
  "sort": 13
 },
 {
  "slug": "genevrier",
  "name": "Genévrier",
  "short": "Détoxifiant et diurétique naturel.",
  "description": "Le Genévrier est un puissant détoxifiant qui aide l'organisme à éliminer les toxines accumulées. Ses propriétés diurétiques et dépuratives en font un allié de choix pour les cures de détox, les rhumatismes et la rétention d'eau.",
  "benefits": [
   "Détoxifiant majeur",
   "Diurétique naturel",
   "Anti-rhumatismal",
   "Tonique nerveux"
  ],
  "usage_tips": "En massage dilué sur les zones de rétention d'eau et les reins. En diffusion pour purifier l'atmosphère. Déconseillé en cas de problèmes rénaux.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/GENEVRIER.png",
  "featured": false,
  "sort": 14
 },
 {
  "slug": "helichryse",
  "name": "Hélichryse",
  "short": "Anti-hématome et cicatrisante exceptionnelle.",
  "description": "L'Hélichryse italienne est considérée comme la reine des huiles anti-hématomes et cicatrisantes. Précieuse et rare, elle efface les bleus, réduit les cicatrices et lutte contre le vieillissement cutané avec une efficacité reconnue par les spécialistes.",
  "benefits": [
   "Anti-hématome remarquable",
   "Cicatrisante et régénérante",
   "Action anti-âge puissante",
   "Réduit les cicatrices",
   "Régénère les tissus"
  ],
  "usage_tips": "Appliquer pure ou légèrement diluée sur les bleus, hématomes ou cicatrices. À intégrer dans votre soin anti-âge quotidien.",
  "category": "huile-essentielle",
  "usage": "beaute",
  "image_url": "/image produit 3D/HELICHRYSE.png",
  "featured": false,
  "sort": 15
 },
 {
  "slug": "laurier",
  "name": "Laurier",
  "short": "Équilibrant, renforce la confiance en soi.",
  "description": "Le Laurier noble est réputé depuis l'Antiquité pour ses vertus psychiques et physiques. Il renforce la confiance en soi, stimule le courage et aide à surmonter les blocages émotionnels. Il possède aussi de puissantes propriétés antibactériennes et antivirales.",
  "benefits": [
   "Renforce la confiance en soi",
   "Stimule le courage",
   "Antibactérien et antiviral",
   "Équilibrant nerveux",
   "Favorise la créativité"
  ],
  "usage_tips": "En diffusion avant un événement important ou une prise de parole. Application diluée sur le plexus solaire ou les poignets.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/LAURIER.png",
  "featured": false,
  "sort": 16
 },
 {
  "slug": "mandarine-rouge",
  "name": "Mandarine Rouge",
  "short": "Calmante et réconfortante, idéale le soir.",
  "description": "La Mandarine Rouge offre un parfum doux, fruité et réconfortant, parfait pour apaiser l'anxiété et préparer au sommeil. Sa douceur en fait l'une des rares huiles utilisables pour les enfants (toujours diluée). Elle aide aussi à la digestion après les repas.",
  "benefits": [
   "Calmante et apaisante",
   "Favorise l'endormissement",
   "Réconfortante et rassurante",
   "Aide à la digestion",
   "Adaptée aux enfants (diluée)"
  ],
  "usage_tips": "En diffusion le soir pour la détente ou avant le coucher. Parfaite dans les chambres d'enfants agités. En massage abdominal après le repas.",
  "category": "huile-essentielle",
  "usage": "relaxation",
  "image_url": "/image produit 3D/MANDARINE ROUGE.png",
  "featured": false,
  "sort": 17
 },
 {
  "slug": "oliban",
  "name": "Oliban (Encens)",
  "short": "Spirituel et méditatif, favorise la sérénité.",
  "description": "L'Oliban, aussi appelé Encens, est utilisé depuis des millénaires dans les rituels spirituels et religieux du monde entier. Il favorise la méditation profonde, purifie l'espace énergétique et apaise l'esprit. En dermatologie, il est reconnu pour ses propriétés cicatrisantes et anti-inflammatoires.",
  "benefits": [
   "Favorise la méditation profonde",
   "Purifie l'espace et l'énergie",
   "Apaise l'anxiété",
   "Cicatrisant cutané",
   "Anti-inflammatoire"
  ],
  "usage_tips": "En diffusion pendant la méditation, la prière ou le yoga. Application cutanée diluée sur les cicatrices ou les peaux matures.",
  "category": "huile-essentielle",
  "usage": "relaxation",
  "image_url": "/image produit 3D/OLIBAN.png",
  "featured": false,
  "sort": 18
 },
 {
  "slug": "orange-douce",
  "name": "Orange Douce",
  "short": "Joyeuse et apaisante, pour une atmosphère chaleureuse.",
  "description": "L'Orange Douce est l'huile de la joie et de la convivialité. Son parfum ensoleillé et chaleureux crée instantanément une ambiance festive et réconfortante. Elle apaise l'anxiété, aide à la digestion et est très bien tolérée par tous, y compris les enfants.",
  "benefits": [
   "Apaisante et anti-anxiété",
   "Crée une atmosphère chaleureuse",
   "Aide à la digestion",
   "Joyeuse et tonique",
   "Purifiante atmosphérique"
  ],
  "usage_tips": "En diffusion pour créer une ambiance chaleureuse et festive. Ajouter quelques gouttes à votre eau de nettoyage pour parfumer l'espace. Parfaite pour les réunions de famille.",
  "category": "huile-essentielle",
  "usage": "relaxation",
  "image_url": "/image produit 3D/ORANGE DOUCE.png",
  "featured": false,
  "sort": 19
 },
 {
  "slug": "origan",
  "name": "Origan",
  "short": "Anti-infectieux majeur, à manier avec précaution.",
  "description": "L'Origan compact est l'une des huiles essentielles les plus puissantes en termes d'action anti-infectieuse. Il est traditionnellement utilisé contre les bactéries, virus, champignons et parasites. Son usage doit être encadré en raison de sa haute concentration en phénols.",
  "benefits": [
   "Anti-infectieux très puissant",
   "Puissante action antiseptique",
   "Renforce l'immunité",
   "Antiparasitaire",
   "Antifongique"
  ],
  "usage_tips": "Usage exclusivement cutané très dilué (max 2-3%) ou par voie orale uniquement sous contrôle d'un spécialiste. Ne pas inhaler pur.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/ORIGAN.png",
  "featured": true,
  "sort": 20
 },
 {
  "slug": "palmarosa",
  "name": "Palmarosa",
  "short": "Hydratante et purifiante, parfaite pour la peau.",
  "description": "Le Palmarosa est un véritable trésor pour les soins cutanés. Il hydrate intensément, régule la production de sébum et possède de puissantes propriétés antibactériennes qui combattent l'acné. Son parfum fleuri et doux rappelle la rose, ce qui en fait aussi un excellent parfum naturel.",
  "benefits": [
   "Hydratante et repulpante",
   "Régule le sébum",
   "Antibactérienne – combat l'acné",
   "Cicatrisante douce",
   "Parfum floral naturel"
  ],
  "usage_tips": "Ajouter quelques gouttes à votre crème hydratante quotidienne ou à une huile végétale. Idéale pour les peaux mixtes à grasses.",
  "category": "huile-essentielle",
  "usage": "beaute",
  "image_url": "/image produit 3D/PALMAROSA.png",
  "featured": true,
  "sort": 21
 },
 {
  "slug": "petit-grain",
  "name": "Petit Grain",
  "short": "Apaisant nerveux, régule le stress et l'anxiété.",
  "description": "L'huile essentielle de Petit Grain Bigarade est extraite des feuilles et petites brindilles de l'oranger amer. Reconnue pour ses vertus apaisantes sur le système nerveux, elle régule le stress, et favorise l'endormissement.",
  "benefits": [
   "Apaisant nerveux majeur",
   "Régule le stress et l'anxiété",
   "Combat l'insomnie",
   "Rééquilibrant émotionnel"
  ],
  "usage_tips": "En diffusion dans les moments de tension ou avant le coucher. En massage dilué sur le plexus solaire ou en inhalation sur les poignets.",
  "category": "huile-essentielle",
  "usage": "relaxation",
  "image_url": "/image produit 3D/PETIT GRAIN.png",
  "featured": false,
  "sort": 22
 },
 {
  "slug": "ravintsara",
  "name": "Ravintsara",
  "short": "Antiviral puissant, boost l'immunité.",
  "description": "Le Ravintsara est l'huile antivirale par excellence, très appréciée en période hivernale ou lors d'épidémies. Native de Madagascar, elle stimule les défenses immunitaires, combat les virus respiratoires et contribue à une récupération rapide. Bien tolérée et polyvalente.",
  "benefits": [
   "Antiviral de référence",
   "Stimule les défenses immunitaires",
   "Tonifiant général",
   "Expectorant respiratoire",
   "Facilite la récupération"
  ],
  "usage_tips": "En diffusion pour purifier l'air ou appliquer diluée sur les poignets, le thorax et le dos en prévention ou au premier signe d'infection.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/RAVINTSARA.png",
  "featured": false,
  "sort": 23
 },
 {
  "slug": "romarin",
  "name": "Romarin",
  "short": "Stimulant intellectuel et énergisant naturel.",
  "description": "Le Romarin est l'huile des étudiants et des intellectuels. Il stimule la mémoire, améliore la concentration et combat la fatigue mentale. En massage capillaire, il renforce les cheveux, stimule leur croissance et combat les pellicules.",
  "benefits": [
   "Stimule la mémoire",
   "Améliore la concentration",
   "Tonique capillaire – pousse des cheveux",
   "Antifatigue mental",
   "Stimulant circulatoire"
  ],
  "usage_tips": "En diffusion pendant le travail ou les révisions pour booster les performances. En massage du cuir chevelu dilué dans une huile végétale.",
  "category": "huile-essentielle",
  "usage": "energie",
  "image_url": "/image produit 3D/ROMARIN.png",
  "featured": false,
  "sort": 24
 },
 {
  "slug": "sarriette",
  "name": "Sarriette",
  "short": "Anti-infectieux puissant, tonique général.",
  "description": "La Sarriette des montagnes est une huile essentielle d'une exceptionnelle puissance anti-infectieuse. Riche en carvacrol, elle combat une large palette d'agents pathogènes (bactéries, virus, champignons, parasites). Tonique physique et intellectuel, elle est aussi connue pour ses propriétés aphrodisiaques.",
  "benefits": [
   "Anti-infectieux à très large spectre",
   "Immunostimulant puissant",
   "Antiparasitaire",
   "Tonique physique et sexuel",
   "Antifongique"
  ],
  "usage_tips": "Usage exclusivement dilué (très corrosive à l'état pur). En massage dilué sur le plexus solaire ou la voûte plantaire. Consulter un spécialiste.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/SARRIETTE.png",
  "featured": false,
  "sort": 25
 },
 {
  "slug": "sauge",
  "name": "Sauge",
  "short": "Tonifiante et purifiante, usage encadré.",
  "description": "La Sauge officinale est l'huile régulatrice hormonale par excellence, précieuse compagne des femmes à chaque étape de leur vie. Elle réduit les bouffées de chaleur, régule les cycles irréguliers et lutte contre la transpiration excessive. Son action purifiante en fait aussi un excellent assainissant.",
  "benefits": [
   "Traditionnellement utilisée lors de la ménopause",
   "Peut aider à limiter la transpiration",
   "Tonifiante et purifiante",
   "Assainissante en diffusion"
  ],
  "usage_tips": "En diffusion ou massage dilué. Déconseillée aux femmes enceintes, allaitantes et aux personnes épileptiques.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/SAUGE.png",
  "featured": false,
  "sort": 26
 },
 {
  "slug": "terebenthine",
  "name": "Térébenthine",
  "short": "Antiseptique respiratoire et anti-rhumatismal.",
  "description": "L'huile essentielle de Térébenthine est extraite de la résine des pins. Puissant antiseptique des voies respiratoires, elle est utilisée traditionnellement pour les bronchites, les rhumatismes et les douleurs musculaires. Son action revulsive procure une chaleur bienfaisante sur les zones douloureuses.",
  "benefits": [
   "Antiseptique respiratoire",
   "Anti-rhumatismal reconnu",
   "Soulage les douleurs musculaires",
   "Effet revulsif chauffant",
   "Diurétique naturel"
  ],
  "usage_tips": "En massage dilué sur les zones rhumatismales ou musculaires douloureuses. En inhalation très diluée pour les affections respiratoires.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/TEREBENTHINE.png",
  "featured": false,
  "sort": 27
 },
 {
  "slug": "thym",
  "name": "Thym",
  "short": "Anti-infectieux majeur et stimulant immunitaire.",
  "description": "Le Thym à thymol est l'un des anti-infectieux les plus puissants du règne végétal. Il combat efficacement les infections respiratoires (bronchites, sinusites, rhumes), stimule l'immunité et redonne de l'énergie en période de convalescence.",
  "benefits": [
   "Anti-infectieux majeur",
   "Stimule l'immunité",
   "Expectorant et mucolytique",
   "Tonique général",
   "Antifongique"
  ],
  "usage_tips": "En inhalation pour les infections respiratoires. En massage dilué sur le thorax et le dos. Toujours fortement diluer pour l'usage cutané.",
  "category": "huile-essentielle",
  "usage": "sante",
  "image_url": "/image produit 3D/THYM.png",
  "featured": false,
  "sort": 28
 },
 {
  "slug": "ylang-ylang",
  "name": "Ylang Ylang",
  "short": "Envoûtante et voluptueuse, soin capillaire d'exception.",
  "description": "L'Ylang Ylang est une huile précieuse aux multiples facettes : relaxante profonde, aphrodisiaque réputée, soin capillaire d'exception. Son parfum floral envoûtant et oriental est l'un des plus recherchés en parfumerie.",
  "benefits": [
   "Soin capillaire exceptionnel",
   "Relaxante profonde",
   "Aphrodisiaque naturelle",
   "Harmonisante émotionnelle"
  ],
  "usage_tips": "En soin capillaire : ajouter quelques gouttes à votre huile ou shampoing. En diffusion pour une ambiance romantique et apaisante.",
  "category": "huile-essentielle",
  "usage": "beaute",
  "image_url": "/image produit 3D/YLANG YLANG.png",
  "featured": false,
  "sort": 29
 }
];

export const seedProducts: Product[] = raw.map((p, i) => ({
  id: `seed-${i}`,
  ...p,
  benefits: [...p.benefits],
  price_fcfa: null,
  volume: null,
  precautions: null,
  in_stock: true,
  published: true,
}));
