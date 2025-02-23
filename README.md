# Chat Mistral AI

Une interface de chat moderne et élégante pour interagir avec l'API Mistral AI, construite avec Next.js, MongoDB et Tailwind CSS.

## 🌟 Fonctionnalités

- 💬 Interface de chat intuitive inspirée de ChatGPT
- 📝 Support complet du Markdown avec syntaxe highlighting
- 💾 Persistance des conversations dans MongoDB
- 🔄 Gestion complète des conversations (création, lecture, suppression)
- 📱 Interface responsive (mobile et desktop)
- 🎨 Thème sombre élégant
- ⌨️ Raccourcis clavier pour une meilleure productivité

## 🗺️ Roadmap

### Authentification & Stockage
- [x] Base de données MongoDB pour le stockage
- [ ] Système d'authentification simple (email/password)
- [ ] Gestion des sessions utilisateur

### Améliorations UX
- [x] Gestion des conversations (création, suppression)
- [x] Affichage automatique des nouvelles conversations
- [ ] Gestion du contexte des conversations
- [ ] Possibilité de renommer les conversations
- [ ] Recherche dans l'historique des conversations
- [ ] Amélioration des performances

## État Actuel

Le projet est en version bêta avec :
- ✅ Stockage MongoDB pour les conversations
- ✅ API REST pour la gestion des conversations
- ✅ Interface utilisateur synchronisée avec la base de données
- ❌ Pas de système d'authentification
- ❌ Pas de gestion de contexte dans les conversations

## 🛠️ Technologies Utilisées

- [Next.js 15](https://nextjs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [API Mistral AI](https://mistral.ai/)
- [React Markdown](https://github.com/remarkjs/react-markdown)

## 📋 Prérequis

- Node.js 18.17 ou plus récent
- Une clé API Mistral AI
- Une base de données MongoDB (locale ou MongoDB Atlas)

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/mrgotti14/chat-bot-MistralAI.git
cd chat-bot-MistralAI
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env.local` à la racine du projet :
```env
MISTRAL_API_KEY=votre_clé_api_mistral
MONGODB_URI=votre_url_mongodb
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 💡 Utilisation

- Écrivez votre message dans la zone de texte en bas
- Appuyez sur Entrée pour envoyer (Maj+Entrée pour un saut de ligne)
- Les conversations sont automatiquement sauvegardées dans MongoDB
- Accédez à l'historique via la barre latérale
- Supprimez les conversations en survolant leur titre dans la sidebar
- Support complet du Markdown dans les messages

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

## 📄 Licence

MIT
