import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Minimum 8 caractères")
  .max(128, "Mot de passe trop long")
  .regex(/[A-Z]/, "Doit contenir une majuscule")
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

export const affiliateCodeSchema = z
  .string()
  .regex(/^[A-Z0-9]{2,8}-[A-F0-9]{6}$/, "Code affilié invalide");
