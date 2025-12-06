# 🚀 QUICK START - 30 SECONDES

## Déployer sur Netlify MAINTENANT :

### Option 1 : Un seul fichier à ouvrir
```
1. Double-clique sur DEPLOY-GUIDE.html
2. Suis les instructions visuelles
3. C'est parti ! 🎉
```

### Option 2 : Une seule commande
```bash
cd whoz-app
npm install && ./deploy.sh
```

### Option 3 : Drag & Drop (le plus simple)
```bash
cd whoz-app
npm install && npm run build
# Puis glisse le dossier "dist" sur netlify.com
```

---

## 🧪 Tester en local AVANT de déployer :

```bash
cd whoz-app
npm install
npm run dev
```

Ouvre http://localhost:5173 dans ton navigateur.

**Compte test :**
- Crée un nouveau compte avec n'importe quel email
- Les données sont sauvegardées dans Netlify Blobs

---

## 📦 Contenu du projet :

```
whoz-app/
├── 📄 DEPLOY-GUIDE.html    ← OUVRE CE FICHIER EN PREMIER !
├── 🔧 deploy.sh            ← Script auto (Mac/Linux)
├── 🔧 deploy.ps1           ← Script auto (Windows)
├── 📖 DEPLOY.md            ← Guide détaillé
├── 📖 README.md            ← Documentation complète
├── src/                    ← Code source React
├── netlify/functions/      ← API Serverless
└── dist/                   ← (créé après npm run build)
```

---

## ✅ Checklist de déploiement :

- [ ] J'ai Node.js 18+ installé (`node --version`)
- [ ] J'ai un compte Netlify (gratuit sur netlify.com)
- [ ] J'ai ouvert DEPLOY-GUIDE.html pour voir les étapes
- [ ] J'ai choisi ma méthode de déploiement (1, 2 ou 3)
- [ ] GO ! 🚀

---

## 🆘 Problèmes ?

### "npm: command not found"
→ Installe Node.js depuis nodejs.org

### "netlify: command not found"
→ Utilise `npx netlify` au lieu de `netlify`
→ Ou installe globalement : `npm install -g netlify-cli`

### "Build failed"
→ Vérifie Node.js version : `node --version` (besoin de 18+)

### Les fonctions ne marchent pas
→ Attends 30-60 secondes après le premier déploiement
→ Netlify configure les serverless functions

---

## 🎉 C'est tout !

**3 fichiers importants :**
1. **DEPLOY-GUIDE.html** ← Guide visuel interactif
2. **deploy.sh** ← Script automatique
3. **DEPLOY.md** ← Documentation complète

**Choisis ce qui te convient le mieux et lance-toi !**

Site de test : https://whoz-demo.netlify.app
Ton site sera sur : https://[ton-nom].netlify.app

---

Made with ❤️ | Prêt pour la production ✨
