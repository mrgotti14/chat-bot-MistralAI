# Chat Mistral AI

Une interface de chat moderne et élégante pour interagir avec l'API Mistral AI, construite avec Next.js et Tailwind CSS.

## 🌟 Fonctionnalités

- 💬 Interface de chat intuitive inspirée de ChatGPT
- 📝 Support complet du Markdown avec syntaxe highlighting
- 💾 Sauvegarde automatique des conversations (actuellement en localStorage)
- 🔄 Historique des conversations
- 📱 Interface responsive (mobile et desktop)
- 🎨 Thème sombre élégant
- ⌨️ Raccourcis clavier pour une meilleure productivité

## 🗺️ Roadmap

### Authentification & Stockage
- [ ] Système d'authentification simple (email/password)
- [ ] Base de données MongoDB pour le stockage
- [ ] Migration des conversations du localStorage vers la DB
- [ ] Gestion des sessions utilisateur

### Améliorations UX
- [ ] Gestion du contexte des conversations
- [ ] Possibilité de nommer les conversations
- [ ] Recherche dans l'historique des conversations
- [ ] Amélioration des performances

## État Actuel

Le projet est actuellement en version alpha avec :
- Stockage local (localStorage) pour les conversations
- Pas de système d'authentification
- Pas de persistance côté serveur
- Pas de gestion de contexte dans les conversations

Ces limitations seront adressées dans les prochaines versions selon la roadmap ci-dessus.

## 🛠️ Technologies Utilisées

- [Next.js 15](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [API Mistral AI](https://mistral.ai/)
- [React Markdown](https://github.com/remarkjs/react-markdown)

## 📋 Prérequis

- Node.js 18.17 ou plus récent
- Une clé API Mistral AI

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
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 💡 Utilisation

- Écrivez votre message dans la zone de texte en bas
- Appuyez sur Entrée pour envoyer (Maj+Entrée pour un saut de ligne)
- Les conversations sont automatiquement sauvegardées
- Accédez à l'historique via la barre latérale
- Support complet du Markdown dans les messages

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

## 📄 Licence

MIT
