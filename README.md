# Chat Mistral AI

A modern and elegant chat interface to interact with Mistral AI API, built with Next.js, MongoDB, and Tailwind CSS.

## 🌟 Features

- 💬 Intuitive chat interface inspired by ChatGPT
- 📝 Full Markdown support with syntax highlighting
- 💾 Conversation persistence in MongoDB
- 🔄 Complete conversation management (create, read, delete)
- 📱 Responsive interface (mobile and desktop)
- 🎨 Elegant dark theme
- ⌨️ Keyboard shortcuts for better productivity

## 🗺️ Roadmap

### Authentication & Storage
- [x] MongoDB database for storage
- [x] Simple authentication system (email/password)
- [x] User session management
- [ ] OAuth integration
  - [ ] Google authentication
  - [ ] GitHub authentication
- [ ] User profile management
- [ ] API key management

### Payment & Subscription
- [ ] Stripe integration
  - [ ] Basic subscription plans
  - [ ] Usage-based billing
  - [ ] Payment history
  - [ ] Invoice management
- [ ] Free tier limitations
- [ ] Premium features
  - [ ] Higher rate limits
  - [ ] Advanced AI models access
  - [ ] Priority support
- [ ] Team/Enterprise plans

### UX Improvements
- [x] Conversation management (create, delete)
- [x] Automatic display of new conversations
- [ ] Landing page redesign
  - [ ] Add feature showcase
  - [ ] Improve mobile responsiveness
  - [ ] Add pricing plans section
  - [ ] Add testimonials section
- [ ] Conversation context management
- [ ] Ability to rename conversations
- [ ] Search through conversation history
- [ ] Performance improvements

## Current Status

The project is in beta with:
- ✅ MongoDB storage for conversations
- ✅ REST API for conversation management
- ✅ User interface synchronized with database
- ✅ Authentication system implemented
- ❌ No context management in conversations

## 🔄 Recent Updates

### Authentication & User Management
- Added NextAuth.js integration with credentials provider
- Implemented user registration and login system
- Added session management and protected routes
- Created login and registration pages with form validation
- Secured API routes with session checks

### Database & Storage
- Set up MongoDB with Docker for local development
- Added MongoDB Compass/Express support for database management
- Implemented user-specific conversation storage
- Added proper type definitions for User and Conversation models

### UI/UX Improvements
- Enhanced chat interface with immediate message display
- Added loading states for better user feedback
- Implemented proper session handling in components
- Added logout functionality in the sidebar
- Fixed message input behavior and auto-clearing

### Development Setup
- Added Docker Compose configuration for easy database setup
- Configured Turbopack for improved development experience
- Updated environment variables structure
- Added comprehensive TypeScript types for NextAuth

## 🛠️ Technologies Used

- [Next.js 15](https://nextjs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Mistral AI API](https://mistral.ai/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Docker](https://www.docker.com/) - Containerization and development environment

## 📋 Prerequisites

- Node.js 18.17 or later
- Docker and Docker Compose
- A Mistral AI API key
- MongoDB database (local or MongoDB Atlas)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/mrgotti14/chat-bot-MistralAI.git
cd chat-bot-MistralAI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# API Keys
MISTRAL_API_KEY=your_mistral_api_key

# Database
MONGODB_URI=your_mongodb_uri

# Authentication
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=http://localhost:3000
```

> Note: For development with Docker, use this MongoDB URI:
> ```
> mongodb://admin:password123@localhost:27017/chat-mistral?authSource=admin
> ```
>
> MongoDB Express interface is available at http://localhost:8081

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💡 Usage

- Type your message in the text area at the bottom
- Press Enter to send (Shift+Enter for new line)
- Conversations are automatically saved to MongoDB
- Access history through the sidebar
- Delete conversations by hovering over their title in the sidebar
- Full Markdown support in messages

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT
