# 🚀 GUIDE DE DÉPLOIEMENT NETLIFY - 3 MÉTHODES

## ⚡ MÉTHODE 1 : SCRIPT AUTOMATIQUE (Le plus simple !)

### Sur Mac/Linux :
```bash
cd whoz-app
npm install
./deploy.sh
```

### Sur Windows (PowerShell) :
```powershell
cd whoz-app
npm install
.\deploy.ps1
```

**C'est tout !** Le script fait tout pour toi :
- Te connecte à Netlify
- Crée le site automatiquement  
- Build et déploie l'application

---

## 🎯 MÉTHODE 2 : COMMANDES MANUELLES (Tu contrôles tout)

```bash
# 1. Installer les dépendances
cd whoz-app
npm install

# 2. Se connecter à Netlify (une seule fois)
npx netlify login

# 3. Créer le site
npx netlify init

# 4. Build l'application
npm run build

# 5. Déployer en production
npx netlify deploy --prod --dir=dist
```

---

## 🖱️ MÉTHODE 3 : DRAG & DROP (Sans ligne de commande)

### Étape 1 : Préparer les fichiers
```bash
cd whoz-app
npm install
npm run build
```

### Étape 2 : Déployer
1. Va sur https://app.netlify.com
2. Clique sur "Add new site" → "Deploy manually"
3. Glisse-dépose le dossier `dist` qui vient d'être créé
4. C'est fait ! 🎉

---

## 🔑 Première fois sur Netlify ?

### Créer un compte (gratuit) :
1. Va sur https://app.netlify.com/signup
2. Connecte-toi avec GitHub, GitLab ou email
3. C'est tout ! Le compte gratuit inclut :
   - 100 GB de bande passante/mois
   - Déploiements illimités
   - HTTPS automatique
   - Domaine gratuit .netlify.app

---

## ✅ Après le déploiement

Ton application sera accessible sur une URL comme :
```
https://ton-site-unique.netlify.app
```

Tu peux :
- Voir ton site : `npx netlify open:site`
- Changer le nom : Dans Netlify Dashboard → Site settings → Change site name
- Ajouter un domaine custom : Dans Netlify Dashboard → Domain settings

---

## 🆘 En cas de problème

### "netlify: command not found"
```bash
npm install -g netlify-cli
```

### "Build failed"
Vérifie que tu as Node.js 18+ :
```bash
node --version
```

### "Function error"
C'est normal au premier déploiement ! Attends 30 secondes que Netlify configure tout.

---

## 📱 Tester en local d'abord

```bash
cd whoz-app
npm install
npm run dev
```

Puis ouvre http://localhost:5173

---

## 🎉 RECOMMANDATION

**Utilise la MÉTHODE 1 (script automatique)** - c'est le plus simple !
Le script fait tout en une seule commande et te guide étape par étape.

Juste lance :
- Mac/Linux : `./deploy.sh`
- Windows : `.\deploy.ps1`

Et c'est parti ! 🚀
