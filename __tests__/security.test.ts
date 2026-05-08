import { describe, it, expect } from "@jest/globals";
import {
  passwordSchema,
  emailSchema,
  registerSchema,
  proRegisterSchema,
  affiliateCodeSchema,
  profileSchema,
} from "@/lib/validations";

// ============================================================
// Tests de sécurité BearsCheck
// Les tests d'intégration (routes HTTP) nécessitent un serveur
// en cours d'exécution et sont marqués @integration
// ============================================================

describe("🔐 Validation des mots de passe", () => {
  it("Accepte un mot de passe valide", () => {
    const result = passwordSchema.safeParse("TestPassword1");
    expect(result.success).toBe(true);
  });

  it("Rejette un mot de passe trop court (< 8 chars)", () => {
    const result = passwordSchema.safeParse("Ab1");
    expect(result.success).toBe(false);
  });

  it("Rejette un mot de passe sans majuscule", () => {
    const result = passwordSchema.safeParse("testpassword1");
    expect(result.success).toBe(false);
  });

  it("Rejette un mot de passe sans minuscule", () => {
    const result = passwordSchema.safeParse("TESTPASSWORD1");
    expect(result.success).toBe(false);
  });

  it("Rejette un mot de passe sans chiffre", () => {
    const result = passwordSchema.safeParse("TestPassword");
    expect(result.success).toBe(false);
  });

  it("Rejette un mot de passe trop long (> 72 chars — limite bcrypt)", () => {
    const result = passwordSchema.safeParse("A1" + "a".repeat(72));
    expect(result.success).toBe(false);
  });

  it("Rejette une chaîne vide", () => {
    const result = passwordSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});

describe("🔐 Validation des emails", () => {
  it("Accepte un email valide", () => {
    const result = emailSchema.safeParse("user@example.com");
    expect(result.success).toBe(true);
  });

  it("Normalise l'email en minuscules", () => {
    const result = emailSchema.safeParse("User@EXAMPLE.COM");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("user@example.com");
  });

  it("Rejette un email sans @", () => {
    expect(emailSchema.safeParse("notanemail").success).toBe(false);
  });

  it("Rejette un email vide", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
  });

  it("Rejette une injection SQL dans l'email", () => {
    expect(emailSchema.safeParse("test@test.com'; DROP TABLE users;--").success).toBe(false);
  });
});

describe("🔐 Validation de l'inscription particulier", () => {
  it("Accepte des données valides", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "ValidPass1",
      name: "Jean",
    });
    expect(result.success).toBe(true);
  });

  it("Rejette sans email", () => {
    expect(registerSchema.safeParse({ password: "ValidPass1" }).success).toBe(false);
  });

  it("Rejette sans mot de passe", () => {
    expect(registerSchema.safeParse({ email: "test@example.com" }).success).toBe(false);
  });
});

describe("🔐 Validation de l'inscription pro", () => {
  const validPro = {
    raisonSociale: "Garage Dupont",
    siret: "94481069600012",
    email: "contact@garage.fr",
    password: "ValidPass1",
  };

  it("Accepte des données valides", () => {
    expect(proRegisterSchema.safeParse(validPro).success).toBe(true);
  });

  it("Rejette un SIRET trop court", () => {
    expect(proRegisterSchema.safeParse({ ...validPro, siret: "123" }).success).toBe(false);
  });

  it("Rejette un SIRET avec lettres", () => {
    expect(proRegisterSchema.safeParse({ ...validPro, siret: "9448106960001X" }).success).toBe(false);
  });

  it("Rejette un SIRET à 13 chiffres (1 manquant)", () => {
    expect(proRegisterSchema.safeParse({ ...validPro, siret: "9448106960001" }).success).toBe(false);
  });

  it("Rejette un téléphone invalide", () => {
    expect(
      proRegisterSchema.safeParse({ ...validPro, telephone: "0000000000" }).success
    ).toBe(false);
  });

  it("Accepte un téléphone valide 06...", () => {
    expect(
      proRegisterSchema.safeParse({ ...validPro, telephone: "0612345678" }).success
    ).toBe(true);
  });
});

describe("🔐 Validation du code affilié", () => {
  it("Accepte un code valide", () => {
    expect(affiliateCodeSchema.safeParse("GARA-1A2B3C").success).toBe(true);
  });

  it("Rejette une path traversal", () => {
    expect(affiliateCodeSchema.safeParse("../../etc/passwd").success).toBe(false);
  });

  it("Rejette une injection de script", () => {
    expect(affiliateCodeSchema.safeParse("<script>alert(1)</script>").success).toBe(false);
  });

  it("Rejette une chaîne vide", () => {
    expect(affiliateCodeSchema.safeParse("").success).toBe(false);
  });

  it("Rejette un code sans tiret", () => {
    expect(affiliateCodeSchema.safeParse("GARA1A2B3C").success).toBe(false);
  });
});

describe("🔐 Validation du profil utilisateur", () => {
  it("Accepte un nom valide", () => {
    expect(profileSchema.safeParse({ name: "Jean-Pierre" }).success).toBe(true);
  });

  it("Rejette un nom trop court", () => {
    expect(profileSchema.safeParse({ name: "J" }).success).toBe(false);
  });

  it("Rejette des caractères dangereux dans le nom", () => {
    expect(profileSchema.safeParse({ name: "<script>alert(1)</script>" }).success).toBe(false);
  });

  it("Rejette un nom vide", () => {
    expect(profileSchema.safeParse({ name: "" }).success).toBe(false);
  });
});
