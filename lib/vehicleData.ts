export const MARQUES_VOITURE = [
  "Alfa Romeo", "Aston Martin", "Audi", "BMW", "Bentley", "Bugatti",
  "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "DS Automobiles",
  "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Infiniti", "Jaguar",
  "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Maserati",
  "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi",
  "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rolls-Royce",
  "SEAT", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota",
  "Volkswagen", "Volvo", "BYD", "Lynk & Co", "Polestar", "Genesis",
].sort();

export const MODELES_PAR_MARQUE: Record<string, string[]> = {
  "Peugeot": ["106", "107", "108", "205", "206", "207", "208", "3008", "301", "306", "307", "308", "4008", "407", "408", "5008", "508", "Expert", "Partner", "Rifter"],
  "Renault": ["Captur", "Clio", "Espace", "Express", "Fluence", "Kadjar", "Kangoo", "Koleos", "Laguna", "Master", "Megane", "Modus", "Sandero", "Scenic", "Symbol", "Trafic", "Twingo", "Zoe"],
  "Citroën": ["Berlingo", "C1", "C2", "C3", "C3 Aircross", "C4", "C4 Cactus", "C4 Picasso", "C5", "C5 Aircross", "C5 X", "C6", "DS3", "DS4", "DS5", "Jumpy", "Nemo", "Picasso"],
  "Volkswagen": ["Arteon", "Caddy", "Golf", "ID.3", "ID.4", "ID.5", "Passat", "Polo", "Sharan", "T-Cross", "T-Roc", "Taigo", "Tiguan", "Touareg", "Touran", "Up!"],
  "BMW": ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 6", "Série 7", "Série 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "iX", "i3", "i4", "i5", "i7"],
  "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "Classe G", "Classe S", "CLA", "CLE", "EQA", "EQB", "EQC", "EQE", "EQS", "GLA", "GLB", "GLC", "GLE", "GLS", "Vito"],
  "Audi": ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "E-Tron", "Q2", "Q3", "Q4 E-Tron", "Q5", "Q7", "Q8", "R8", "RS3", "RS6", "TT"],
  "Toyota": ["Aygo", "C-HR", "Camry", "Corolla", "Hilux", "Land Cruiser", "Prius", "ProAce", "RAV4", "Supra", "Verso", "Yaris", "bZ4X"],
  "Ford": ["B-Max", "C-Max", "EcoSport", "Edge", "Explorer", "Fiesta", "Focus", "Galaxy", "Kuga", "Mondeo", "Mustang", "Puma", "Ranger", "S-Max", "Transit"],
  "Dacia": ["Dokker", "Duster", "Jogger", "Lodgy", "Logan", "Sandero", "Sandero Stepway", "Spring"],
  "Honda": ["Accord", "Civic", "CR-V", "HR-V", "Jazz", "NSX", "Type R"],
  "Hyundai": ["Bayon", "i10", "i20", "i30", "i40", "IONIQ", "IONIQ 5", "IONIQ 6", "Kona", "Santa Fe", "Tucson"],
  "Kia": ["Ceed", "EV6", "Niro", "Picanto", "ProCeed", "Sorento", "Soul", "Sportage", "Stinger", "Stonic", "XCeed"],
  "Nissan": ["Ariya", "Juke", "Leaf", "Micra", "Navara", "Qashqai", "X-Trail"],
  "Fiat": ["500", "500L", "500X", "Bravo", "Doblo", "Ducato", "Grande Punto", "Panda", "Punto", "Tipo"],
  "Opel": ["Adam", "Astra", "Corsa", "Crossland", "Grandland", "Insignia", "Meriva", "Mokka", "Zafira"],
  "Skoda": ["Citigo", "Fabia", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Scala", "Superb", "Yeti"],
  "SEAT": ["Arona", "Ateca", "Ibiza", "Leon", "Mii", "Tarraco", "Alhambra"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  "DS Automobiles": ["DS 3", "DS 4", "DS 5", "DS 7", "DS 9"],
};

export function getModelesForMarque(marque: string): string[] {
  return MODELES_PAR_MARQUE[marque] ?? [];
}

export const CARBURANTS = [
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "hybride", label: "Hybride" },
  { value: "electrique", label: "Électrique" },
  { value: "gpl", label: "GPL" },
];

export const PUISSANCES_FISCALES = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} CV${i + 1 === 20 ? "+" : ""}`,
}));

export const KILOMETRAGES = [
  { value: "lt5000", label: "Moins de 5 000 km" },
  { value: "5000-10000", label: "5 000 – 10 000 km" },
  { value: "10000-15000", label: "10 000 – 15 000 km" },
  { value: "15000-20000", label: "15 000 – 20 000 km" },
  { value: "gt20000", label: "Plus de 20 000 km" },
];

export const ASSUREURS_FR = [
  "Axa", "Allianz", "Groupama", "MAIF", "Macif", "GMF", "MMA", "Generali",
  "Matmut", "Maaf", "Direct Assurance", "Amaguiz", "Luko", "Lovys",
  "Netvox", "L'olivier Assurance", "Solly Azar", "Covéa",
  "Thélem Assurances", "April", "Assurland", "Autre",
].sort();

export const DEPARTEMENTS_COEFFICIENTS: Record<string, number> = {
  "75": 1.35, "92": 1.30, "93": 1.40, "94": 1.30,
  "69": 1.20, "13": 1.25, "31": 1.10, "33": 1.10,
  "59": 1.15, "67": 1.05, "06": 1.20, "44": 1.05,
  "default": 1.00,
};

export function getDepartementFromCodePostal(cp: string): string {
  const code = cp.substring(0, 2);
  if (cp.startsWith("97")) return cp.substring(0, 3);
  return code;
}
