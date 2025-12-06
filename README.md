# Whoz - Plateforme de Staffing et Gestion de Talents

## 🚀 Description

Clone moderne de Whoz, une plateforme SaaS de staffing et gestion de ressources humaines avec :
- ✨ Authentification complète (login/register)
- 💾 Base de données Netlify Blobs
- 🎨 Design moderne et élégant avec Tailwind CSS
- 📊 Dashboard avec statistiques
- 🔒 Routes protégées
- 🌐 Déploiement sur Netlify

## 🛠️ Technologies

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom animations
- **Backend**: Netlify Serverless Functions
- **Database**: Netlify Blobs
- **Authentification**: bcryptjs
- **Routing**: React Router v6
- **Icons**: Lucide React

## 📦 Installation locale

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build
```

## 🌐 Déploiement sur Netlify

### Méthode 1: Via l'interface Netlify (Recommandé)

1. **Créer un nouveau site sur Netlify**
   - Aller sur https://app.netlify.com
   - Cliquer sur "Add new site" > "Import an existing project"
   - Ou créer un site vide : "Add new site" > "Deploy manually"

2. **Pour déploiement manuel** :
   ```bash
   npm run build
   ```
   - Glisser-déposer le dossier `dist` sur Netlify
   - OU utiliser la CLI Netlify (voir méthode 2)

3. **Pour déploiement depuis Git** :
   - Connecter votre dépôt GitHub/GitLab
   - Build command: `npm run build`
   - Publish directory: `dist`

### Méthode 2: Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser le site
netlify init

# Déployer
netlify deploy --prod
```

## 🔐 Fonctionnalités d'authentification

### Inscription
- Nom complet
- Email
- Entreprise
- Mot de passe (min 6 caractères)

### Connexion
- Email + Mot de passe
- Option "Se souvenir de moi"
- Lien "Mot de passe oublié"

### Sécurité
- Mots de passe hashés avec bcryptjs
- Stockage sécurisé dans Netlify Blobs
- Routes protégées côté client

## 📊 Dashboard

Le dashboard inclut :
- Message de bienvenue personnalisé
- 8 actions rapides (équipe, casting, staffing, etc.)
- 5 cartes de statistiques
- Navigation complète avec recherche
- Déconnexion

## 🎨 Design

- Palette de couleurs : Purple (#8B5CF6) et Blue (#3B82F6)
- Typographie : Plus Jakarta Sans (display) + Inter (body)
- Animations fluides avec CSS
- Responsive design
- Dégradés et ombres élégantes

## 📁 Structure du projet

```
whoz-app/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── context/
│   │   └── AuthContext.jsx  # Contexte d'authentification
│   ├── pages/
│   │   ├── Login.jsx        # Page de connexion
│   │   ├── Register.jsx     # Page d'inscription
│   │   └── Dashboard.jsx    # Dashboard principal
│   ├── App.jsx              # Routage principal
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── netlify/
│   └── functions/
│       └── auth.mts         # API d'authentification
├── netlify.toml             # Configuration Netlify
├── vite.config.js           # Configuration Vite
├── tailwind.config.js       # Configuration Tailwind
└── package.json
```

## 🔄 API Endpoints

### POST `/api/auth`

**Inscription** :
```json
{
  "action": "register",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "company": "Company Inc"
}
```

**Connexion** :
```json
{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}
```

## 🗄️ Base de données

La base de données utilise **Netlify Blobs** :
- Store : `users`
- Clé : `user:{email}`
- Format : JSON

Exemple de structure utilisateur :
```json
{
  "id": "1234567890",
  "email": "user@example.com",
  "fullName": "John Doe",
  "company": "Company Inc",
  "password": "$2a$10$...",
  "createdAt": "2025-12-05T18:30:00.000Z"
}
```

## 🎯 Prochaines étapes

Pour étendre l'application :
1. Ajouter la gestion des talents (CRUD)
2. Créer le système de projets
3. Implémenter le matching talent/projet
4. Ajouter les statistiques en temps réel
5. Créer le calendrier de disponibilité
6. Intégrer l'IA pour le matching automatique

## 📝 Notes

- L'application est prête pour la production
- Les mots de passe sont sécurisés avec bcrypt
- Netlify Blobs est utilisé pour la persistance des données
- Tout est configuré pour un déploiement one-click sur Netlify

## 🚦 Commandes npm

```bash
npm run dev       # Démarrer le serveur de développement
npm run build     # Construire pour la production
npm run preview   # Prévisualiser le build de production
```

## 💡 Support

Pour toute question ou problème :
1. Vérifier que toutes les dépendances sont installées
2. S'assurer que Node.js version 18+ est utilisé
3. Vérifier les logs Netlify en cas de problème de déploiement

---

Créé avec ❤️ par Claude - Plateforme de staffing moderne et élégante
