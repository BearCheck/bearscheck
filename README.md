# BearsCheck — Comparateur d'assurance auto

> Comparez. Choisissez. Roulez.

BearsCheck est un comparateur d'assurance auto professionnel pour le marché français, développé avec Next.js 14+, TypeScript et Tailwind CSS.

---

## Installation rapide

### Prérequis
- Node.js 18 ou supérieur
- Une base de données PostgreSQL (locale ou cloud)

### Étapes

**1. Installer les dépendances**
```bash
npm install
```

**2. Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```
Ouvrez `.env.local` et remplissez les valeurs (voir section Configuration).

**3. Initialiser la base de données**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**4. Lancer le serveur de développement**
```bash
npm run dev
```
Ouvrez http://localhost:3000 dans votre navigateur.

---

## Configuration

### Variables d'environnement requises

| Variable | Description | Où l'obtenir |
|----------|-------------|--------------|
| `DATABASE_URL` | URL PostgreSQL | Supabase, Railway, ou local |
| `NEXTAUTH_SECRET` | Clé secrète auth | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de l'app | `http://localhost:3000` en dev |
| `RESEND_API_KEY` | Envoi d'emails | resend.com |

### Variables optionnelles

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID/SECRET` | Connexion Google OAuth |
| `UPSTASH_REDIS_REST_URL/TOKEN` | Rate limiting (Upstash) |

---

## Structure du projet

```
bearscheck/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx            # Landing page
│   ├── comparer/           # Tunnel de comparaison (9 étapes)
│   ├── connexion/          # Authentification utilisateur
│   ├── pro/inscription/    # Inscription garage
│   ├── mentions-legales/   # Page légale
│   ├── politique-confidentialite/
│   ├── cgu/
│   └── cgv/
├── components/
│   ├── ui/                 # Design system (Button, Card, Input...)
│   ├── tunnel/             # Étapes du tunnel (Step0–Step8 + ResultsPage)
│   └── layout/             # Navbar, Footer
├── lib/
│   ├── vehicleData.ts      # Données véhicules (marques, modèles...)
│   └── pricingEngine.ts    # Moteur de calcul tarifaire
├── store/
│   └── tunnelStore.ts      # État global du tunnel (Zustand)
├── types/
│   └── tunnel.ts           # Types TypeScript
└── prisma/
    └── schema.prisma       # Schéma base de données
```

---

## Phases de développement

| Phase | Statut | Description |
|-------|--------|-------------|
| Phase 1 | Terminé | Setup, design system, landing page |
| Phase 2 | Terminé | Tunnel de questions (9 étapes) |
| Phase 3 | Terminé | Moteur de calcul + page résultats |
| Phase 4 | A venir | Authentification (User + Company + Admin) |
| Phase 5 | A venir | Dashboard Admin complet |
| Phase 6 | A venir | Dashboard Entreprise + QR code |
| Phase 7 | A venir | Système d'affiliation + Tracking |
| Phase 8 | A venir | RGPD + Tests (Jest + Playwright) |
| Phase 9 | A venir | SEO + Performance |
| Phase 10 | A venir | Déploiement Vercel + Production |

---

## Design System

### Couleurs
- Or (accent) : #C9A84C
- Or clair : #F5E6C8
- Bordure or : #E5D8BC
- Texte principal : #1A1A1A
- Texte secondaire : #6B7280

### Typographie
- Titres : Playfair Display (serif)
- Corps : Inter (sans-serif)
- Prix : JetBrains Mono

---

## Avertissement légal

BearsCheck est un comparateur d'information, pas un assureur ni un courtier.
Les tarifs affichés sont des estimations indicatives calculées à partir de données de marché.
Ils ne constituent pas des devis contractuels.

---

## Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npx playwright test
```

---

## Déploiement (Vercel)

1. Connectez votre dépôt GitHub à Vercel
2. Ajoutez les variables d'environnement dans le dashboard Vercel
3. Configurez PostgreSQL (Supabase recommandé)
4. Déployez avec `git push`
# bearscheck
