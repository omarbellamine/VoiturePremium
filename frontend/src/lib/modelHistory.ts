export interface BrandHistory {
  founded: string;
  country: string;
  motto: string;
  summary: string;
  highlights: string[];
}

const BRAND_HISTORIES: Record<string, BrandHistory> = {
  "mercedes-benz": {
    founded: "1926",
    country: "Allemagne",
    motto: "Das Beste oder Nichts (Le meilleur ou rien)",
    summary: "Mercedes-Benz est l'une des marques automobiles les plus anciennes et prestigieuses au monde. Fondée par Karl Benz et Gottlieb Daimler, elle est reconnue pour son ingénierie de pointe, son confort exceptionnel et sa sécurité. Au Maroc, Mercedes reste la marque premium la plus populaire, symbole de réussite et de fiabilité.",
    highlights: [
      "Inventeur de l'automobile moderne (Benz Patent-Motorwagen, 1886)",
      "Classe S — référence mondiale du luxe automobile depuis 1972",
      "Classe C et E — les plus vendues au Maroc dans le segment premium",
      "AMG — division sport haute performance créée en 1967",
      "Pionnier en sécurité : ABS, airbag, ESP inventés par Mercedes",
    ],
  },
  "bmw": {
    founded: "1916",
    country: "Allemagne",
    motto: "Freude am Fahren (Le plaisir de conduire)",
    summary: "BMW (Bayerische Motoren Werke) est née comme fabricant de moteurs d'avion avant de devenir un symbole mondial du plaisir de conduite. Reconnue pour ses moteurs performants et son châssis dynamique, BMW offre un équilibre unique entre sportivité et luxe. Très prisée au Maroc, notamment les Séries 3 et 5.",
    highlights: [
      "Moteurs 6 cylindres en ligne — parmi les plus fluides de l'industrie",
      "Série 3 — best-seller mondial du segment premium depuis 1975",
      "Série 5 — la routière de référence, confort et dynamisme",
      "M Performance — gamme sportive légendaire (M3, M5)",
      "Propulsion arrière historique, gage de plaisir de conduite",
    ],
  },
  "audi": {
    founded: "1909",
    country: "Allemagne",
    motto: "Vorsprung durch Technik (L'avance par la technologie)",
    summary: "Audi est le constructeur premium du groupe Volkswagen, reconnu pour sa transmission intégrale Quattro, sa qualité d'assemblage et son design avant-gardiste. La marque aux quatre anneaux (représentant la fusion de 4 constructeurs) est synonyme de technologie et de discrétion élégante au Maroc.",
    highlights: [
      "Quattro — transmission intégrale permanente, née en rallye (1980)",
      "Virtual Cockpit — tableau de bord entièrement numérique (pionnier)",
      "A4 et A6 — modèles phares, très fiables et polyvalents",
      "Qualité d'assemblage parmi les meilleures de l'industrie",
      "RS — gamme haute performance (RS3, RS6, R8)",
    ],
  },
  "range rover": {
    founded: "1970",
    country: "Royaume-Uni",
    motto: "Above and Beyond",
    summary: "Range Rover est le SUV de luxe ultime, né en 1970 comme le premier véhicule à combiner capacités tout-terrain et raffinement intérieur. Symbole de prestige absolu, il est particulièrement apprécié au Maroc pour son allure imposante et son confort royal, adapté aussi bien aux routes qu'aux pistes.",
    highlights: [
      "Premier SUV de luxe au monde (1970)",
      "Capacités tout-terrain exceptionnelles — terrain response system",
      "Intérieur comparable aux meilleures berlines (cuir, bois, aluminium)",
      "Range Rover Sport — version plus dynamique et sportive",
      "Velar et Evoque — gamme élargie vers le design contemporain",
    ],
  },
  "land rover": {
    founded: "1948",
    country: "Royaume-Uni",
    motto: "Above and Beyond",
    summary: "Land Rover est le pionnier du 4x4 britannique, né pour répondre aux besoins agricoles et militaires avant de devenir une icône d'aventure. Le Defender est légendaire pour sa robustesse, tandis que le Discovery offre polyvalence familiale et capacités tout-terrain sérieuses.",
    highlights: [
      "Defender — icône indestructible du tout-terrain depuis 1948",
      "Discovery — le SUV familial à vraies capacités off-road",
      "Terrain Response — système de gestion terrain automatique",
      "Nouveau Defender (2020) — modernité tout en gardant l'ADN baroudeur",
      "Utilisé par les forces armées et expéditions dans le monde entier",
    ],
  },
  "porsche": {
    founded: "1931",
    country: "Allemagne",
    motto: "Intelligent Performance",
    summary: "Porsche est le constructeur sportif le plus rentable et prestigieux au monde. La 911, modèle iconique au moteur arrière, est produite sans interruption depuis 1963. Porsche allie performance pure, fiabilité exemplaire et finitions de luxe. Le Cayenne et le Macan ont ouvert la marque aux SUV avec un succès mondial.",
    highlights: [
      "911 — la voiture de sport la plus iconique, produite depuis 1963",
      "Moteur Boxer à plat — signature sonore et technique unique",
      "Cayenne — le SUV qui a sauvé Porsche financièrement (2002)",
      "Fiabilité mécanique parmi les meilleures du segment sport",
      "Taycan — entrée réussie dans l'électrique haute performance",
    ],
  },
  "volvo": {
    founded: "1927",
    country: "Suède",
    motto: "For Life",
    summary: "Volvo est synonyme de sécurité automobile depuis sa fondation. Le constructeur suédois (aujourd'hui propriété de Geely) a inventé la ceinture de sécurité à 3 points et continue d'innover en protection des occupants. Son design scandinave épuré et ses intérieurs en matériaux naturels séduisent les amateurs de sobriété premium.",
    highlights: [
      "Inventeur de la ceinture de sécurité à 3 points (1959, brevet offert au monde)",
      "Objectif Vision Zero — aucune mort dans un Volvo neuf d'ici 2030",
      "XC90 — SUV familial premium, référence en sécurité",
      "Design scandinave minimaliste, intérieurs en bois et laine naturels",
      "Gamme Recharge — hybride rechargeable et 100% électrique",
    ],
  },
  "jaguar": {
    founded: "1922",
    country: "Royaume-Uni",
    motto: "Grace, Space, Pace",
    summary: "Jaguar incarne l'élégance sportive britannique depuis un siècle. Célèbre pour la Type E (qualifiée de 'plus belle voiture jamais faite' par Enzo Ferrari), Jaguar produit des berlines et SUV au design distinctif. Rachetée par Tata Motors, la marque se repositionne vers le 100% électrique.",
    highlights: [
      "Type E (1961) — considérée comme l'une des plus belles voitures de l'histoire",
      "F-Type — sportive moderne au caractère affirmé",
      "F-Pace — premier SUV Jaguar, succès commercial majeur",
      "Moteurs Ingenium — développés en interne, performants et efficaces",
      "Transition vers le tout-électrique prévue dès 2025",
    ],
  },
  "lexus": {
    founded: "1989",
    country: "Japon",
    motto: "Experience Amazing",
    summary: "Lexus est la division premium de Toyota, créée pour rivaliser avec les marques allemandes sur le marché américain. Elle a révolutionné le segment avec une fiabilité inégalée et un silence de fonctionnement exceptionnel. La technologie hybride Lexus est une référence en termes d'économie et de douceur de conduite.",
    highlights: [
      "LS 400 (1989) — a redéfini les standards de qualité premium",
      "Fiabilité légendaire — régulièrement #1 des classements de fiabilité",
      "Hybride depuis 2005 — pionnière du luxe hybride (RX, ES, NX)",
      "Takumi — artisans qui assemblent à la main les modèles haut de gamme",
      "Coût d'entretien inférieur aux marques allemandes équivalentes",
    ],
  },
  "ferrari": {
    founded: "1947",
    country: "Italie",
    motto: "Nous ne sommes pas des constructeurs automobiles, nous créons des rêves",
    summary: "Ferrari est la marque automobile la plus célèbre au monde, symbole absolu de performance, de passion et d'exclusivité. Fondée par Enzo Ferrari, ancien pilote de course, chaque modèle est une œuvre d'art mécanique. Le cheval cabré (Cavallino Rampante) est l'emblème le plus reconnu de l'industrie automobile.",
    highlights: [
      "Plus de 5 000 victoires en compétition — palmarès inégalé",
      "V12 naturellement aspiré — la référence absolue en motorisation",
      "Production limitée — environ 14 000 voitures par an (exclusivité)",
      "LaFerrari, F40, Enzo — hypercars légendaires à chaque génération",
      "Valeur de collection — certains modèles s'apprécient considérablement",
    ],
  },
  "bentley": {
    founded: "1919",
    country: "Royaume-Uni",
    motto: "Be Extraordinary",
    summary: "Bentley est le summum du luxe automobile britannique, alliant artisanat traditionnel et performance. Chaque véhicule est largement assemblé à la main dans l'usine de Crewe. Le Continental GT et le Bentayga (premier SUV ultra-luxe) définissent le segment du grand tourisme et du luxe sans compromis.",
    highlights: [
      "Usine de Crewe — plus de 100 ans d'artisanat automobile",
      "170 heures de travail manuel pour un intérieur en cuir",
      "Continental GT — le grand tourisme parfait, W12 et V8",
      "Bentayga — le SUV le plus luxueux et puissant au monde",
      "Moteur W12 6.0L — puissance et couple extraordinaires",
    ],
  },
  "mini": {
    founded: "1959",
    country: "Royaume-Uni",
    motto: "Big Love",
    summary: "MINI est née en 1959 comme la voiture du peuple britannique avant de devenir une icône de style et de fun. Rachetée par BMW en 2000, la marque moderne conserve l'esprit ludique et le go-kart feeling de l'originale dans un package premium personnalisable à l'infini.",
    highlights: [
      "MINI originale (1959) — a révolutionné l'automobile compacte",
      "Go-kart feeling — agilité et plaisir de conduite uniques",
      "Personnalisation quasi infinie — couleurs, toit, rétros, intérieur",
      "Cooper S et JCW — versions sportives enthousiasmantes",
      "Plateforme BMW — fiabilité et technologie modernes",
    ],
  },
  "ds": {
    founded: "2014",
    country: "France",
    motto: "Spirit of Avant-Garde",
    summary: "DS Automobiles est la marque premium du groupe Stellantis (ex-PSA), inspirée de la légendaire Citroën DS de 1955. Positionnée comme alternative française au premium allemand, DS se distingue par son design audacieux, ses matériaux raffinés et un rapport qualité-prix attractif dans le segment luxe.",
    highlights: [
      "Héritage de la Citroën DS (1955) — 'Déesse' du design automobile",
      "DS 7 Crossback — SUV premium phare, bien équipé",
      "Horlogerie BRM — montre intégrée au tableau de bord (DS 7)",
      "Sellerie en cuir Nappa et Alcantara, finitions soignées",
      "E-Tense — gamme hybride rechargeable et électrique",
    ],
  },
  "alfa romeo": {
    founded: "1910",
    country: "Italie",
    motto: "La meccanica delle emozioni (La mécanique des émotions)",
    summary: "Alfa Romeo est le constructeur italien le plus passionné, avec plus d'un siècle d'histoire en course automobile. Connue pour ses lignes sensuelles, ses moteurs chantants et son châssis sportif, Alfa Romeo offre une expérience de conduite émotionnelle unique. Le Quadrifoglio est le symbole de la performance italienne.",
    highlights: [
      "Plus de 1 000 victoires en course (F1, Touring, Rallye)",
      "Giulia Quadrifoglio — berline sport de référence (510 ch)",
      "Stelvio — premier SUV Alfa Romeo, gènes sportifs conservés",
      "Moteurs biturbo développés avec Ferrari",
      "Design italien passionné — parmi les plus belles lignes du marché",
    ],
  },
};

export function getBrandHistory(brand: string): BrandHistory | null {
  return BRAND_HISTORIES[brand.toLowerCase()] || null;
}
