# Changelog

All notable changes to this project will be documented in this file.


### Added
- Enhanced Stripe subscription system
  - Complete webhook system for subscription lifecycle management
  - Transaction model for payment history tracking
  - Automatic subscription status updates
  - Customer creation and management
  - Secure payment processing with error handling
  - Support for multiple subscription tiers
  - Proper error handling and logging
  - English JSDoc documentation

### Changed
- Improved error handling in payment processing
- Enhanced subscription status management
- Updated webhook handling for better reliability
- Standardized code documentation to English JSDoc format


### Added
- Stripe subscription system integration
  - Added checkout session endpoint for payment handling
  - Created StripeButton component for payment integration
  - Configured Stripe environment variables
  - Integrated payment buttons in pricing cards
- Authentication flow for payments
  - Added authentication check before payment
  - Implemented redirect to login page for unauthenticated users
  - Added callback URL to return to pricing page after login
- Pricing plans structure
  - Free tier with basic features and limitations
  - Premium tier with advanced features
  - Business tier for custom solutions
- Advanced AI model access differentiation
  - Mistral-7B for free tier
  - Mistral-8x7B for premium users

### Changed
- Updated pricing cards UI with clear feature differentiation
- Improved button alignment in pricing section
- Enhanced visual feedback for unavailable features

### Technical
- Added Stripe dependencies
- Configured Next.js for external image domains (Google, GitHub avatars)
- Set up webhook endpoints for Stripe events

### Sidebar and Search Enhancements
- Implemented advanced conversation search functionality:
  - Real-time search through conversation titles and content
  - Instant visual feedback with animated results
  - Clear search button with smooth transitions
  - "No conversations found" state with animations
- Enhanced sidebar UI for better user experience:
  - Modernized design with consistent spacing
  - Improved button interactions and hover states
  - Refined animations and transitions
  - Enhanced visual hierarchy
  - Better contrast and accessibility
  - Elegant purple theme integration
  - Optimized mobile responsiveness

### Message Navigation Improvements
- Enhanced message scrolling behavior:
  - Added automatic scroll to latest messages when switching conversations
  - Implemented smooth scrolling animation for better user experience
  - Fixed initial message position when opening conversations
  - Optimized scroll timing with conversation changes
  - Maintained scroll position during message loading states

### Chat Interface Enhancements
- Redesigned chat interface for better user experience:
  - Implemented dark theme with consistent brand colors
  - Added gradient effects for visual hierarchy
  - Enhanced message bubbles with modern design
  - Integrated smooth animations for message transitions
  - Improved loading states and user feedback
  - Enhanced error message presentations
  - Added responsive interactions and transitions
  - Aligned styling with landing page design
  - Optimized message display and readability
  - Improved overall visual consistency

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

### UI/UX Enhancements
- Completely redesigned authentication pages with sophisticated animations:
  - Orchestrated entrance animations using Framer Motion
  - Interactive background effects with animated gradient blobs
  - Smooth floating labels for form inputs
  - Animated gradient text effects for titles
  - Enhanced social login buttons with hover effects
  - Polished micro-interactions throughout the interface
- Improved overall user experience with:
  - Staggered animations for better visual hierarchy
  - Smooth transitions between states
  - Responsive animations across all devices
  - Carefully crafted loading states
  - Enhanced error message presentations

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