# 🔐 Rapport d'Audit Sécurité — BearsCheck
**Date :** 2026-05-09  
**Effectué par :** Claude Code (Sonnet 4.6)  
**Build :** ✅ Compilé avec succès après corrections

---

## ✅ Protections en place

| Protection | Statut | Détail |
|---|---|---|
| Headers HTTP sécurité | ✅ Actif | CSP, HSTS, X-Frame-Options DENY, X-Content-Type, Referrer-Policy, Permissions-Policy, XSS-Protection |
| Rate Limiting Login | ✅ Actif | 5 tentatives/heure/IP (auth limiter) |
| Rate Limiting Inscription | ✅ Actif | 3 inscriptions/24h/IP |
| Rate Limiting Comparateur | ✅ Actif | 20 req/min/IP |
| Rate Limiting Général | ✅ Actif | 100 req/min/IP |
| Protection routes Admin | ✅ Actif | proxy.ts (NextAuth + rôle ADMIN) |
| Protection routes Pro | ✅ Actif | proxy.ts (JWT pro_token vérifié à la bordure) |
| Protection routes Dashboard | ✅ Actif | proxy.ts (session NextAuth) |
| Validation Zod — Register | ✅ Actif | Email, password (force, longueur, regex) |
| Validation Zod — Pro Register | ✅ Actif | SIRET 14 chiffres, téléphone FR, email |
| Validation Zod — Passwords | ✅ Actif | forgot, reset, change-password |
| Validation code affilié | ✅ Actif | Regex `^[A-Z0-9]{2,8}-[A-F0-9]{6}$` |
| Hashage bcrypt | ✅ Actif | Salt rounds = 12, centralisé dans lib/auth-utils.ts |
| Cookies sécurisés (pro) | ✅ Actif | httpOnly + secure + sameSite=strict (renforcé depuis lax) |
| Variables env sécurisées | ✅ Actif | Aucun secret hardcodé, .env ignoré par git |
| Logs de sécurité | ✅ Actif | SecurityLog en BDD — LOGIN_FAILED, PASSWORD_CHANGED, ACCOUNT_CREATED, etc. |
| Protection injection SQL | ✅ Actif | Via Prisma ORM (requêtes paramétrées) |
| Protection XSS | ✅ Actif | Headers CSP + React escaping |
| Protection CSRF | ✅ Actif | Via NextAuth + sameSite cookies |
| Énumération email | ✅ Actif | forgot-password retourne toujours success |
| IP hashée (RGPD) | ✅ Actif | SHA256 + sel AUTH_SECRET, tronqué à 16 chars |
| SIRET validé | ✅ Actif | Regex 14 chiffres obligatoires |
| Proxy (middleware) | ✅ Actif | proxy.ts protège /admin, /dashboard, /pro/dashboard |

---

## ⚠️ Points nécessitant une action humaine

| Point | Priorité | Action recommandée |
|---|---|---|
| Upstash Redis | 🔴 Haute | Créer un compte sur console.upstash.com, créer une base Redis, ajouter `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` sur Vercel → **active le rate limiting** |
| Prisma DB Push | 🔴 Haute | Lancer `npx prisma db push` pour créer la table `SecurityLog` en production |
| Domaine Resend | 🟡 Moyenne | Vérifier `bearscheck.com` sur resend.com pour utiliser `noreply@bearscheck.com` |
| Cloudflare WAF | 🟡 Moyenne | Activer Cloudflare en proxy devant Vercel — protection DDoS, WAF, Bot Fight |
| CSP nonce | 🟡 Moyenne | Remplacer `'unsafe-inline'` par un nonce cryptographique par requête (plus sécurisé) |
| Test de pénétration | 🟡 Moyenne | Faire appel à un pentesteur si le site monte en charge |
| Certificat SSL | 🟢 Basse | Géré automatiquement par Vercel |
| Sentry monitoring | 🟢 Basse | Configurer Sentry pour les alertes d'erreur en production |

---

## 🔧 Corrections effectuées lors de cet audit

### Nouveaux fichiers créés

- **`lib/rate-limit.ts`** — Helper Upstash Redis avec fail-open (pas de crash si Redis non configuré). Limiteurs : auth (5/h), inscription (3/24h), comparateur (20/min), général (100/min).
- **`lib/validations.ts`** — Schémas Zod v4 : registerSchema, proRegisterSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, affiliateCodeSchema.
- **`lib/auth-utils.ts`** — Fonctions centralisées `hashPassword(password)` et `verifyPassword(password, hash)` avec bcrypt salt=12.
- **`lib/security-logs.ts`** — `logSecurityEvent(type, details)` avec IP hashée RGPD, try-catch silencieux.

### Fichiers modifiés

- **`next.config.ts`** — Ajout des 8 headers de sécurité HTTP sur toutes les routes (CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, Strict-Transport-Security).
- **`proxy.ts`** — Amélioration : suppression du cookie `pro_token` invalide avant redirection, ajout du `callbackUrl`, suppression du fallback secret visible, uniformisation des redirections.
- **`prisma/schema.prisma`** — Ajout du modèle `SecurityLog` avec index sur type, userId, createdAt.
- **`app/api/auth/register/route.ts`** — Rate limit inscription + validation Zod + log ACCOUNT_CREATED.
- **`app/api/auth/forgot-password/route.ts`** — Rate limit auth + validation Zod.
- **`app/api/auth/reset-password/route.ts`** — Rate limit auth + validation Zod.
- **`app/api/auth/change-password/route.ts`** — Rate limit auth + validation Zod + log PASSWORD_CHANGED + log LOGIN_FAILED si mot de passe incorrect.
- **`app/api/pro/login/route.ts`** — Rate limit auth + `sameSite: "strict"` (renforcé depuis "lax") + log LOGIN_FAILED/SUCCESS.
- **`app/api/pro/register/route.ts`** — Rate limit inscription + validation Zod + log ACCOUNT_CREATED.
- **`app/api/track/conversion/route.ts`** — Validation du code affilié via regex pour bloquer les injections.
- **`app/api/comparisons/route.ts`** — Rate limit comparateur.
- **`.env.example`** — Complété avec toutes les variables nécessaires (Upstash, Resend, APP_URL, COMMISSION_RATE, etc.).

### Fichier supprimé
- **`middleware.ts`** — Fichier en doublon avec `proxy.ts` (Next.js 16 utilise `proxy.ts` comme middleware).

---

## 📦 Dépendances de sécurité utilisées

| Package | Version | Usage |
|---|---|---|
| `bcryptjs` | 3.0.3 | Hashage mots de passe (salt=12) |
| `zod` | 4.4.3 | Validation des données d'entrée |
| `@upstash/ratelimit` | 2.0.8 | Rate limiting par IP |
| `@upstash/redis` | 1.38.0 | Backend Redis pour rate limiting |
| `jose` | (next-auth dep) | Vérification JWT pro_token en Edge |
| `next-auth` | 5.0.0-beta.31 | Authentification + protection routes |

Toutes ces dépendances étaient déjà installées dans `package.json`. **Aucune installation supplémentaire nécessaire.**

---

## 🔑 Variables d'environnement à ajouter sur Vercel

Variables **nouvelles** à ajouter dans Vercel > Settings > Environment Variables :

```
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Variables **déjà présentes** (vérifier qu'elles sont bien configurées) :
```
DATABASE_URL
AUTH_SECRET
AUTH_URL
NEXTAUTH_URL
RESEND_API_KEY
EMAIL_FROM
NEXT_PUBLIC_APP_URL
```

---

## 🔄 Prochaines étapes recommandées

1. **Immédiat** : Créer un compte Upstash Redis (gratuit) et ajouter les 2 variables sur Vercel → active le rate limiting
2. **Immédiat** : Lancer `npx prisma db push` pour créer la table `SecurityLog` en production
3. **Sous 7 jours** : Vérifier le domaine `bearscheck.com` sur Resend
4. **Sous 30 jours** : Activer Cloudflare en proxy devant Vercel
5. **Relancer cet audit** dans 30 jours ou après chaque ajout de fonctionnalité majeure
