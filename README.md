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
- 🔐 Authentication system with multiple providers:
  - Email/Password authentication
  - Google OAuth integration
  - GitHub OAuth integration
  - Automatic password setup for OAuth users
  - Seamless account linking between providers

## 🗺️ Roadmap

### Authentication & Storage
- [x] MongoDB database for storage
- [x] Simple authentication system (email/password)
- [x] User session management
- [x] OAuth integration
  - [x] Google authentication
  - [x] GitHub authentication
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
- [x] Landing page redesign
  - [x] Add feature showcase
  - [x] Improve mobile responsiveness
  - [x] Add pricing plans section
  - [x] Add FAQ section
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
- ✅ Authentication system with multiple providers
- ❌ No context management in conversations

## 🔄 Recent Updates

### Landing Page Redesign
- Complete landing page redesign with GottiAI branding
- Sophisticated animations using Framer Motion:
  - Magnetic buttons with hover effects
  - Gradient text animations
  - Floating background elements
  - Smooth section transitions
  - Interactive feature cards
- Responsive navigation with smooth scrolling
- Modern pricing section with interactive cards
- Expandable FAQ section with animations
- Footer with comprehensive navigation

### Authentication & User Management
- Added NextAuth.js integration with multiple providers:
  - Credentials provider for email/password
  - Google OAuth provider with automatic account linking
  - GitHub OAuth provider with automatic account linking
  - Smart password management for OAuth users
- Implemented user registration and login system
- Added session management and protected routes
- Created login and registration pages with form validation
- Secured API routes with session checks
- Added automatic password setup for OAuth users
- Implemented seamless account linking between providers

### Database & Storage
- Set up MongoDB with Docker for local development
- Added MongoDB Compass/Express support for database management
- Implemented user-specific conversation storage
- Added proper type definitions for User and Conversation models

### Development Setup
- Added Docker Compose configuration for easy database setup
- Configured Turbopack for improved development experience
- Updated environment variables structure
- Added comprehensive TypeScript types for NextAuth

### UI/UX Improvements
- Enhanced chat interface with immediate message display
- Added loading states for better user feedback
- Implemented proper session handling in components
- Added logout functionality in the sidebar
- Fixed message input behavior and auto-clearing

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
- Google OAuth credentials
- GitHub OAuth credentials

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/mrgotti14/chat-bot-MistralAI.git
cd chat-bot-MistralAI
```

2. Start MongoDB database with Docker:
```bash
# Start MongoDB and Mongo Express containers in background
docker-compose up -d

# Check if containers are running
docker-compose ps

# View container logs
docker-compose logs -f

# Stop containers
docker-compose down

# Remove containers and volumes (⚠️ Warning: this will delete all data)
docker-compose down -v
```

> Note: MongoDB will be available at `localhost:27017` and Mongo Express at `http://localhost:8081`

3. Install dependencies:
```bash
npm install
```

4. Create a `.env.local` file in the root directory:
```env
# API Keys
MISTRAL_API_KEY=your_mistral_api_key

# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/chat-mistral?authSource=admin

# Authentication
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

> Note: The default MongoDB URI uses the credentials defined in the `docker-compose.yml` file. If you modified the credentials there, make sure to update the URI accordingly.

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💡 Usage

- Type your message in the text area at the bottom
- Press Enter to send (Shift+Enter for new line)
- Conversations are automatically saved to MongoDB
- Access history through the sidebar
- Delete conversations by hovering over their title in the sidebar
- Full Markdown support in messages
- Connect with Google or email/password
- First-time Google users will be prompted to set a password

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT