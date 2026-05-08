import { z } from "zod";

// Limite bcrypt à 72 chars (sa limite technique)
export const passwordSchema = z
  .string()
  .min(8, "Minimum 8 caractères")
  .max(72, "Maximum 72 caractères")
  .regex(/[A-Z]/, "Doit contenir une majuscule")
  .regex(/[a-z]/, "Doit contenir une minuscule")
  .regex(/[0-9]/, "Doit contenir un chiffre");

export const emailSchema = z
  .string()
  .email("Email invalide")
  .max(255, "Email trop long")
  .transform((v) => v.toLowerCase().trim());

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, "Prénom trop court").max(80, "Prénom trop long").optional(),
});

export const proRegisterSchema = z.object({
  raisonSociale: z.string().min(2, "Raison sociale trop courte").max(100),
  siret: z.string().regex(/^\d{14}$/, "SIRET invalide — 14 chiffres requis"),
  email: emailSchema,
  telephone: z
    .string()
    .regex(/^(\+33|0)[1-9]\d{8}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  adresse: z.string().min(5).max(200).optional().or(z.literal("")),
  nomResponsable: z.string().max(80).optional().or(z.literal("")),
  prenomResponsable: z.string().max(80).optional().or(z.literal("")),
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: passwordSchema,
});

// Format code affilié : 2-8 lettres/chiffres + tiret + 6 hex
export const affiliateCodeSchema = z
  .string()
  .regex(/^[A-Z0-9]{2,8}-[A-F0-9]{6}$/, "Code affilié invalide");

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Nom trop court")
    .max(80, "Nom trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides dans le nom"),
});

export const proProfileSchema = z.object({
  raisonSociale: z.string().min(2).max(100).optional(),
  telephone: z
    .string()
    .regex(/^(\+33|0)[1-9]\d{8}$/, "Téléphone invalide")
    .optional()
    .or(z.literal("")),
  adresse: z.string().min(5).max(200).optional().or(z.literal("")),
  nomResponsable: z.string().max(80).optional().or(z.literal("")),
  // IBAN FR : FR + 2 chiffres + 23 alphanum = 27 chars
  ribIban: z
    .string()
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/, "IBAN invalide")
    .optional()
    .or(z.literal(""))
    .or(z.literal(undefined)),
});
