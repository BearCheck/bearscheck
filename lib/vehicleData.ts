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
  "Alfa Romeo": ["147", "156", "159", "4C", "Brera", "Giulia", "Giulietta", "GTV", "MiTo", "Spider", "Stelvio", "Tonale"],
  "Aston Martin": ["DB11", "DB12", "DBS Superleggera", "DBX", "Rapide", "Vantage"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne"],
  "Bugatti": ["Chiron", "Divo", "Veyron"],
  "BYD": ["Atto 2", "Atto 3", "Dolphin", "Han", "Seal", "Sealion 6", "Tang"],
  "Cadillac": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6"],
  "Chevrolet": ["Camaro", "Corvette", "Equinox", "Silverado", "Suburban", "Tahoe", "Trailblazer"],
  "Chrysler": ["300", "Pacifica", "Voyager"],
  "Ferrari": ["296 GTB", "488 GTB", "812 Superfast", "California T", "F8 Tributo", "Portofino", "Purosangue", "Roma", "SF90 Stradale"],
  "Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "Infiniti": ["Q30", "Q50", "Q60", "QX30", "QX50", "QX55", "QX60", "QX80"],
  "Jaguar": ["E-Pace", "F-Pace", "F-Type", "I-Pace", "XE", "XF", "XJ"],
  "Jeep": ["Avenger", "Cherokee", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wrangler"],
  "Lamborghini": ["Huracán", "Revuelto", "Urus"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  "Lexus": ["CT", "ES", "IS", "LC", "LBX", "LS", "LX", "NX", "RX", "UX"],
  "Lynk & Co": ["01", "02", "03", "05"],
  "Maserati": ["Ghibli", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte"],
  "Mazda": ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "CX-80", "MX-5", "MX-30"],
  "McLaren": ["540C", "570S", "600LT", "720S", "Artura", "GT"],
  "MG": ["3", "4", "5", "HS", "Marvel R", "ZS", "ZS EV"],
  "Mini": ["Cabrio", "Clubman", "Cooper", "Cooper S", "Countryman", "JCW", "Paceman"],
  "Mitsubishi": ["ASX", "Eclipse Cross", "L200", "Outlander", "Space Star"],
  "Polestar": ["1", "2", "3", "4"],
  "Porsche": ["718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Rolls-Royce": ["Cullinan", "Dawn", "Ghost", "Phantom", "Spectre", "Wraith"],
  "Smart": ["#1", "#3", "EQ forfour", "EQ fortwo", "fortwo"],
  "Subaru": ["BRZ", "Forester", "Impreza", "Legacy", "Levorg", "Outback", "WRX", "XV"],
  "Suzuki": ["Baleno", "Celerio", "Ignis", "Jimny", "S-Cross", "Swace", "Swift", "Vitara"],
  "Volvo": ["C30", "C40", "S60", "S90", "V40", "V60", "V90", "XC40", "XC60", "XC90"],
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
