import { render, screen, fireEvent } from "@testing-library/react";
import ResultsPage from "@/components/tunnel/ResultsPage";
import { useTunnelStore } from "@/store/tunnelStore";
import type { InsuranceResult } from "@/types/tunnel";

jest.mock("@/store/tunnelStore");

const MOCK_RESULTS: InsuranceResult[] = [
  {
    id: "result-0",
    assureur: "Direct Assurance",
    formule: "Responsabilité Civile (Tiers)",
    garanties: ["Responsabilité civile"],
    prixMensuel: 18.5,
    prixAnnuel: 222,
    franchise: 500,
    satisfaction: 4.1,
    badge: "cheapest",
    isEstimate: true,
  },
  {
    id: "result-1",
    assureur: "MAIF",
    formule: "Tous Risques",
    garanties: ["Responsabilité civile", "Tous risques", "Bris de glace"],
    prixMensuel: 52.0,
    prixAnnuel: 624,
    franchise: 300,
    satisfaction: 4.7,
    badge: "best_value",
    isEstimate: true,
  },
];

const mockReset = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useTunnelStore as unknown as jest.Mock).mockReturnValue({
    results: MOCK_RESULTS,
    formData: { prenom: "Jean", marque: "Renault", modele: "Clio" },
    resetTunnel: mockReset,
  });
});

describe("ResultsPage", () => {
  it("affiche le bon nombre d'offres", () => {
    render(<ResultsPage />);
    expect(screen.getByText(/2 offres trouvées/i)).toBeInTheDocument();
  });

  it("affiche les noms des assureurs", () => {
    render(<ResultsPage />);
    expect(screen.getByText("Direct Assurance")).toBeInTheDocument();
    expect(screen.getByText("MAIF")).toBeInTheDocument();
  });

  it("affiche les prix mensuels formatés", () => {
    render(<ResultsPage />);
    expect(screen.getByText("18.50 €")).toBeInTheDocument();
    expect(screen.getByText("52.00 €")).toBeInTheDocument();
  });

  it("affiche le badge 'Le moins cher'", () => {
    render(<ResultsPage />);
    expect(screen.getByText(/le moins cher/i)).toBeInTheDocument();
  });

  it("affiche le badge 'Meilleur rapport'", () => {
    render(<ResultsPage />);
    expect(screen.getByText(/meilleur rapport/i)).toBeInTheDocument();
  });

  it("affiche un bouton Souscrire par offre", () => {
    render(<ResultsPage />);
    const buttons = screen.getAllByRole("button", { name: /souscrire/i });
    expect(buttons).toHaveLength(2);
  });

  it("affiche le prénom dans le sous-titre", () => {
    render(<ResultsPage />);
    expect(screen.getByText(/bonjour jean/i)).toBeInTheDocument();
  });

  it("affiche la marque et le modèle du véhicule", () => {
    render(<ResultsPage />);
    expect(screen.getByText(/renault clio/i)).toBeInTheDocument();
  });

  it("ouvre le détail d'une offre au clic sur 'Voir le détail'", () => {
    render(<ResultsPage />);
    const expandButtons = screen.getAllByText(/voir le détail/i);
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText("Responsabilité civile")).toBeInTheDocument();
  });

  it("appelle resetTunnel au clic sur 'Recommencer'", () => {
    render(<ResultsPage />);
    fireEvent.click(screen.getByText(/recommencer/i));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("affiche un état vide si pas de résultats dans le filtre", () => {
    render(<ResultsPage />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "10" } });
    expect(screen.getByText(/aucune offre dans cette fourchette/i)).toBeInTheDocument();
  });
});
