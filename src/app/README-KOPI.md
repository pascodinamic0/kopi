Kopi — Desk d'impression (PWA)
================================

Kopi est une application web progressive (PWA) hors ligne pour les imprimeries et cybercafé‑imprimeries de Kinshasa.

Principales fonctionnalités
- Tableau de bord du jour: travaux, revenus, impayés, stock bas
- Travaux d’impression: création, devis rapide, pipeline (reçu → en cours → prêt → livré), paiements (cash / M‑Pesa / Airtel / Orange)
- Crédit clients: liste des impayés et règlement
- Stock de consommables: papier, toner, bâche, alertes bas niveau
- Mode démo avec données “Kopi Gombe” et page /demo
- PWA: installable, service worker, fonctionnement hors ligne via IndexedDB (Dexie)
- Multidevise: affichage FC + équivalent USD
- Super‑admin “Passer en production”: lance une QA automatisée puis efface toute la démo et démarre l’onboarding

Lancer localement
1. Prérequis: Node 18+
2. Installer: `npm install`
3. Démarrer: `npm run dev` (ou `PORT=43123 npm run dev` pour l’agent)
4. Ouvrir: http://localhost:3000 (ou le port configuré)
5. Charger la démo: aller sur `/demo` puis revenir sur l’accueil.

Déploiement Vercel
- Importez ce repo dans Vercel, framework Next.js détecté automatiquement.
- Variables: aucune requise. L’app fonctionne entièrement côté client (Dexie).
- Build: `npm run build` — exécute le build Next.js.
- À vérifier dans Vercel:
  - “Output directory”: automatique
  - “Install Command”: `npm ci`
  - “Build Command”: `npm run build`
  - Activer “Edge Functions” par défaut.

QA automatisée et Go‑Live
Le bouton “Passer en production” (Paramètres → Passer en production) exécute un ensemble de vérifications:
- Paramètres présents et services configurés
- Capacité à créer et consulter des travaux
- Paiement enregistré
- Consommables existants
- PWA/Service Worker présent (heuristique)

Si une des vérifications échoue, le passage en production est refusé et rien n’est effacé.
Si tout passe:
1. Purge intégrale des données de démonstration (travaux, paiements, clients, consommables, utilisateurs, bannières, affordances).
2. Passage en mode “production” irréversible (MVP).
3. Redirection vers l’onboarding: nom de boutique, commune, taux USD, puis configuration des services, prix, numéros Mobile Money et stocks.

Synchronisation / hors ligne
- Les données sont stockées dans IndexedDB via Dexie pour un fonctionnement offline‑first.
- Vous pouvez brancher une synchronisation (Supabase ou autre) en étendant `src/lib/db.ts`.

Structure
- `src/lib/` types, db Dexie, utils et seed
- `src/app/` pages Next.js App Router
- `public/manifest.webmanifest` et `public/sw.js` pour la PWA

Crédits
- UI basée sur Tailwind et shadcn/ui. Police standard (Geist) pour un rendu propre et professionnel.

Checklist QA (détails)
- Paramètres et services présents
- Création d’un travail et progression complète du pipeline
- Paiements: cash, M‑Pesa, Airtel, Orange
- Alerte bas niveau consommables
- PWA/Service Worker détecté (heuristique)
- Données visibles au tableau de bord

Captures / Artifacts
- Dossier `artifacts/` destiné aux captures (iPhone 15 Pro Max / Galaxy S24): Accueil, Travaux, Détail + paiement, Nouvelle commande, Stock, Crédit, Go‑Live (QA), Onboarding, `/demo`.
- Si vous déployez sur une URL publique, ouvrez sur mobile et enregistrez les captures ici.

