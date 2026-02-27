import { Listing } from "./types";

export interface VehicleInsight {
  text: string;
  type: "pro" | "con";
  category: "fiabilite" | "entretien" | "confort" | "performance" | "valeur" | "securite";
}

const CATEGORY_LABELS: Record<string, string> = {
  fiabilite: "Fiabilité",
  entretien: "Entretien",
  confort: "Confort",
  performance: "Performance",
  valeur: "Valeur",
  securite: "Sécurité",
};

export { CATEGORY_LABELS };

// Brand-specific known pros and cons
const BRAND_INSIGHTS: Record<string, VehicleInsight[]> = {
  "mercedes-benz": [
    { text: "Finitions intérieures haut de gamme, matériaux nobles", type: "pro", category: "confort" },
    { text: "Excellente insonorisation et confort de conduite", type: "pro", category: "confort" },
    { text: "Systèmes de sécurité avancés (Pre-Safe, assistance active)", type: "pro", category: "securite" },
    { text: "Bonne valeur de revente sur le marché marocain", type: "pro", category: "valeur" },
    { text: "Coût d'entretien élevé — pièces et main-d'œuvre spécialisée", type: "con", category: "entretien" },
    { text: "Électronique complexe — risque de pannes capteurs/écrans après 5 ans", type: "con", category: "fiabilite" },
    { text: "Suspension pneumatique coûteuse à remplacer (si équipée)", type: "con", category: "entretien" },
    { text: "Consommation de carburant relativement élevée", type: "con", category: "performance" },
  ],
  "bmw": [
    { text: "Plaisir de conduite reconnu — châssis dynamique et précis", type: "pro", category: "performance" },
    { text: "Moteurs puissants et réactifs, bon couple", type: "pro", category: "performance" },
    { text: "Technologie iDrive mature et intuitive", type: "pro", category: "confort" },
    { text: "Bonne valeur de revente au Maroc", type: "pro", category: "valeur" },
    { text: "Chaîne de distribution sujette à l'usure (N47/N57)", type: "con", category: "fiabilite" },
    { text: "Entretien coûteux — les révisions peuvent être onéreuses", type: "con", category: "entretien" },
    { text: "Fuites d'huile fréquentes sur les moteurs vieillissants", type: "con", category: "fiabilite" },
    { text: "Pièces de suspension arrière à surveiller (silent blocs, rotules)", type: "con", category: "entretien" },
  ],
  "audi": [
    { text: "Qualité de fabrication et assemblage exemplaires", type: "pro", category: "fiabilite" },
    { text: "Transmission Quattro — excellente motricité", type: "pro", category: "performance" },
    { text: "Intérieur moderne, technologie Virtual Cockpit appréciée", type: "pro", category: "confort" },
    { text: "Insonorisation parmi les meilleures du segment", type: "pro", category: "confort" },
    { text: "Consommation d'huile connue sur certains moteurs TFSI", type: "con", category: "fiabilite" },
    { text: "Boîte DSG — embrayage à surveiller après 100 000 km", type: "con", category: "entretien" },
    { text: "Coût des pièces élevé — technologie propriétaire", type: "con", category: "entretien" },
    { text: "Turbo fragile sur certains modèles 2.0 TDI anciens", type: "con", category: "fiabilite" },
  ],
  "range rover": [
    { text: "Capacités tout-terrain exceptionnelles", type: "pro", category: "performance" },
    { text: "Confort royal — suspension pneumatique, insonorisation top", type: "pro", category: "confort" },
    { text: "Prestige et image de marque très forte", type: "pro", category: "valeur" },
    { text: "Habitacle spacieux et luxueux", type: "pro", category: "confort" },
    { text: "Fiabilité électronique problématique — pannes récurrentes", type: "con", category: "fiabilite" },
    { text: "Coût d'entretien très élevé — le plus cher du segment", type: "con", category: "entretien" },
    { text: "Suspension pneumatique fragile et très coûteuse", type: "con", category: "entretien" },
    { text: "Forte consommation de carburant", type: "con", category: "performance" },
    { text: "Décote importante sur les anciens modèles", type: "con", category: "valeur" },
  ],
  "land rover": [
    { text: "Vraies capacités tout-terrain, robustesse mécanique", type: "pro", category: "performance" },
    { text: "Position de conduite surélevée, bonne visibilité", type: "pro", category: "confort" },
    { text: "Design distinctif et image baroudeur premium", type: "pro", category: "valeur" },
    { text: "Problèmes électriques et électroniques fréquents", type: "con", category: "fiabilite" },
    { text: "Entretien coûteux — pièces importées", type: "con", category: "entretien" },
    { text: "Consommation élevée, surtout en ville", type: "con", category: "performance" },
    { text: "Boîte automatique à surveiller sur les anciens modèles", type: "con", category: "fiabilite" },
  ],
  "porsche": [
    { text: "Fiabilité mécanique excellente — moteurs très robustes", type: "pro", category: "fiabilite" },
    { text: "Performance et tenue de route de référence", type: "pro", category: "performance" },
    { text: "Très bonne valeur de revente — faible décote", type: "pro", category: "valeur" },
    { text: "Qualité de fabrication et finitions durables", type: "pro", category: "fiabilite" },
    { text: "Options très chères — un véhicule nu est vite limité", type: "con", category: "valeur" },
    { text: "Entretien chez Porsche uniquement — tarifs élevés", type: "con", category: "entretien" },
    { text: "Problème IMS sur anciens Boxster/Cayman (avant 2009)", type: "con", category: "fiabilite" },
    { text: "Confort limité sur longs trajets (modèles sportifs)", type: "con", category: "confort" },
  ],
  "volvo": [
    { text: "Sécurité de référence — meilleure du marché", type: "pro", category: "securite" },
    { text: "Intérieur scandinave épuré, matériaux de qualité", type: "pro", category: "confort" },
    { text: "Fiabilité correcte, moteurs Drive-E robustes", type: "pro", category: "fiabilite" },
    { text: "Bon confort de suspension, idéal pour longs trajets", type: "pro", category: "confort" },
    { text: "Réseau de concessionnaires limité au Maroc", type: "con", category: "entretien" },
    { text: "Pièces spécifiques parfois longues à obtenir", type: "con", category: "entretien" },
    { text: "Revente moins facile que les marques allemandes", type: "con", category: "valeur" },
    { text: "Boîte automatique Powershift à surveiller (anciens modèles)", type: "con", category: "fiabilite" },
  ],
  "jaguar": [
    { text: "Design élégant et distinctif — lignes uniques", type: "pro", category: "confort" },
    { text: "Moteurs Ingenium performants et agréables", type: "pro", category: "performance" },
    { text: "Tarifs attractifs en occasion — bonne affaire potentielle", type: "pro", category: "valeur" },
    { text: "Comportement routier sportif et précis", type: "pro", category: "performance" },
    { text: "Fiabilité électronique perfectible", type: "con", category: "fiabilite" },
    { text: "Réseau de service très limité au Maroc", type: "con", category: "entretien" },
    { text: "Décote importante — perte de valeur rapide", type: "con", category: "valeur" },
    { text: "Coût des pièces élevé et disponibilité limitée", type: "con", category: "entretien" },
  ],
  "lexus": [
    { text: "Fiabilité légendaire — la meilleure du segment premium", type: "pro", category: "fiabilite" },
    { text: "Coût d'entretien raisonnable, mécanique robuste", type: "pro", category: "entretien" },
    { text: "Confort de conduite exceptionnel, très silencieux", type: "pro", category: "confort" },
    { text: "Hybride éprouvé — consommation maîtrisée", type: "pro", category: "performance" },
    { text: "Revente difficile au Maroc — marque peu connue", type: "con", category: "valeur" },
    { text: "Design intérieur parfois jugé conservateur", type: "con", category: "confort" },
    { text: "Interface multimédia moins intuitive que la concurrence", type: "con", category: "confort" },
    { text: "Réseau de concessionnaires quasi inexistant au Maroc", type: "con", category: "entretien" },
  ],
  "ferrari": [
    { text: "Performances exceptionnelles — moteurs légendaires", type: "pro", category: "performance" },
    { text: "Valeur de collection — certains modèles prennent de la valeur", type: "pro", category: "valeur" },
    { text: "Sensations de conduite inégalées", type: "pro", category: "performance" },
    { text: "Prestige absolu, image de marque iconique", type: "pro", category: "valeur" },
    { text: "Entretien extrêmement coûteux — spécialistes rares au Maroc", type: "con", category: "entretien" },
    { text: "Embrayage et boîte F1 — remplacement très onéreux", type: "con", category: "entretien" },
    { text: "Inadaptée au quotidien — confort limité, garde au sol basse", type: "con", category: "confort" },
    { text: "Pièces importées, délais très longs", type: "con", category: "entretien" },
  ],
  "bentley": [
    { text: "Luxe absolu — cuir, bois, finitions artisanales", type: "pro", category: "confort" },
    { text: "Moteurs W12/V8 puissants et couple impressionnant", type: "pro", category: "performance" },
    { text: "Confort de conduite exceptionnel, silence total", type: "pro", category: "confort" },
    { text: "Coût d'entretien exorbitant — révisions à 5 chiffres", type: "con", category: "entretien" },
    { text: "Consommation de carburant très élevée", type: "con", category: "performance" },
    { text: "Aucun réseau officiel au Maroc — tout est importé", type: "con", category: "entretien" },
    { text: "Décote brutale sur les modèles de plus de 5 ans", type: "con", category: "valeur" },
  ],
  "mini": [
    { text: "Conduite fun et agile — plaisir en ville", type: "pro", category: "performance" },
    { text: "Design iconique et personnalisable", type: "pro", category: "confort" },
    { text: "Réseau BMW pour l'entretien — bonne couverture", type: "pro", category: "entretien" },
    { text: "Bonne tenue de route pour sa catégorie", type: "pro", category: "performance" },
    { text: "Espace intérieur limité, coffre petit", type: "con", category: "confort" },
    { text: "Suspension ferme — confort moyen sur routes dégradées", type: "con", category: "confort" },
    { text: "Chaîne de distribution à surveiller (moteurs Prince)", type: "con", category: "fiabilite" },
    { text: "Coût des options et pièces disproportionné par rapport à la taille", type: "con", category: "entretien" },
  ],
  "ds": [
    { text: "Design original et intérieur raffiné", type: "pro", category: "confort" },
    { text: "Bon rapport équipement/prix", type: "pro", category: "valeur" },
    { text: "Confort de suspension soigné", type: "pro", category: "confort" },
    { text: "Fiabilité héritée de PSA — correcte dans l'ensemble", type: "pro", category: "fiabilite" },
    { text: "Image de marque encore faible — revente difficile", type: "con", category: "valeur" },
    { text: "Boîte automatique EAT8 parfois hésitante", type: "con", category: "fiabilite" },
    { text: "Finitions parfois inégales sur certains modèles", type: "con", category: "fiabilite" },
    { text: "Réseau limité au Maroc", type: "con", category: "entretien" },
  ],
  "alfa romeo": [
    { text: "Design italien passionné — parmi les plus belles lignes", type: "pro", category: "confort" },
    { text: "Moteurs vifs et sonorité agréable", type: "pro", category: "performance" },
    { text: "Châssis sportif, direction précise", type: "pro", category: "performance" },
    { text: "Prix d'occasion attractifs", type: "pro", category: "valeur" },
    { text: "Fiabilité aléatoire — électronique et finitions fragiles", type: "con", category: "fiabilite" },
    { text: "Réseau quasi inexistant au Maroc", type: "con", category: "entretien" },
    { text: "Décote importante à la revente", type: "con", category: "valeur" },
    { text: "Pièces spécifiques coûteuses et difficiles à trouver", type: "con", category: "entretien" },
  ],
  "tesla": [
    { text: "Accélération fulgurante — performances électriques instantanées", type: "pro", category: "performance" },
    { text: "Coût d'énergie très bas — recharge bien moins chère que le carburant", type: "pro", category: "entretien" },
    { text: "Mises à jour logicielles OTA — la voiture s'améliore avec le temps", type: "pro", category: "confort" },
    { text: "Autopilot — assistance à la conduite avancée", type: "pro", category: "securite" },
    { text: "Entretien minimal — pas de vidange, pas de courroie, freins régénératifs", type: "pro", category: "entretien" },
    { text: "Réseau Superchargeurs limité au Maroc — planification nécessaire", type: "con", category: "entretien" },
    { text: "Aucun réseau officiel Tesla au Maroc — SAV et pièces compliqués", type: "con", category: "entretien" },
    { text: "Qualité de finition inégale — écarts de panneaux, bruits d'habitacle", type: "con", category: "fiabilite" },
    { text: "Batterie — capacité diminue avec le temps, remplacement très coûteux", type: "con", category: "fiabilite" },
    { text: "Valeur de revente incertaine au Maroc — marché encore immature", type: "con", category: "valeur" },
  ],
};

// Dynamic insights based on vehicle attributes
function getDynamicInsights(listing: Listing): VehicleInsight[] {
  const insights: VehicleInsight[] = [];
  const currentYear = new Date().getFullYear();
  const age = listing.year ? currentYear - listing.year : null;

  // Mileage-based insights
  if (listing.mileage != null) {
    if (listing.mileage < 30000) {
      insights.push({ text: "Très faible kilométrage — usure mécanique minimale", type: "pro", category: "fiabilite" });
    } else if (listing.mileage < 80000) {
      insights.push({ text: "Kilométrage raisonnable — encore beaucoup de vie dans le moteur", type: "pro", category: "fiabilite" });
    } else if (listing.mileage >= 150000 && listing.mileage < 250000) {
      insights.push({ text: "Kilométrage élevé — prévoir courroie/chaîne, embrayage, amortisseurs", type: "con", category: "entretien" });
    } else if (listing.mileage >= 250000) {
      insights.push({ text: "Kilométrage très élevé — risque de réparations lourdes à court terme", type: "con", category: "fiabilite" });
    }

    // High mileage diesel-specific
    if (listing.mileage >= 200000 && listing.fuelType?.toLowerCase() === "diesel") {
      insights.push({ text: "Diesel à haut kilométrage — vérifier turbo, injecteurs et FAP", type: "con", category: "entretien" });
    }
  }

  // Age-based insights
  if (age != null) {
    if (age <= 2) {
      insights.push({ text: "Véhicule récent — probablement encore sous garantie constructeur", type: "pro", category: "entretien" });
    } else if (age <= 4) {
      insights.push({ text: "Moins de 5 ans — technologie actuelle, pièces facilement disponibles", type: "pro", category: "entretien" });
    } else if (age >= 10 && age < 15) {
      insights.push({ text: "Plus de 10 ans — prévoir budget pour joints, durites et pièces d'usure", type: "con", category: "entretien" });
    } else if (age >= 15) {
      insights.push({ text: "Véhicule de plus de 15 ans — risque de corrosion et pièces obsolètes", type: "con", category: "fiabilite" });
    }
  }

  // Fuel type insights
  if (listing.fuelType) {
    const fuel = listing.fuelType.toLowerCase();
    if (fuel === "diesel") {
      insights.push({ text: "Diesel — économique sur longs trajets, couple élevé", type: "pro", category: "performance" });
      if (age != null && age >= 8) {
        insights.push({ text: "Diesel vieillissant — surveiller le système d'injection et le FAP", type: "con", category: "fiabilite" });
      }
    } else if (fuel === "essence") {
      insights.push({ text: "Essence — moteur plus souple, moins de vibrations, entretien plus simple", type: "pro", category: "confort" });
    }
  }

  // Transmission insights
  if (listing.transmission) {
    const trans = listing.transmission.toLowerCase();
    if (trans.includes("auto")) {
      if (listing.mileage != null && listing.mileage >= 120000) {
        insights.push({ text: "Boîte automatique à fort kilométrage — vérifier vidange et comportement", type: "con", category: "entretien" });
      }
    }
  }

  // Missing info warnings
  if (!listing.mileage) {
    insights.push({ text: "Kilométrage non renseigné — demander justificatif au vendeur", type: "con", category: "fiabilite" });
  }
  if (!listing.phone) {
    insights.push({ text: "Pas de numéro de téléphone — contact limité, prudence", type: "con", category: "fiabilite" });
  }

  return insights;
}

export function getVehicleInsights(listing: Listing): { pros: VehicleInsight[]; cons: VehicleInsight[] } {
  const brandKey = listing.brand.toLowerCase();
  const brandInsights = BRAND_INSIGHTS[brandKey] || [];
  const dynamicInsights = getDynamicInsights(listing);

  const all = [...brandInsights, ...dynamicInsights];

  const pros = all.filter((i) => i.type === "pro");
  const cons = all.filter((i) => i.type === "con");

  return { pros, cons };
}
