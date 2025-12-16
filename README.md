# VinoBuzz Mobile Simulator - AI Wine Assistant

A React Native (Expo) mobile simulator showcasing a wine e-commerce experience with an integrated AI chat assistant and detailed product pages.

## 🎯 Overview

This mobile simulator demonstrates:
- **Persistent Chatbox**: A minimizable/expandable chat interface that persists across the app
- **Product Detail Page**: A comprehensive wine product page with rich information hierarchy
- **Seamless Integration**: Smooth transitions between chat and product browsing

## 📱 Features

### Chatbox Component
- ✅ **Entry & Persistence**
  - Floating action button for chat access
  - Minimized vs. expanded states with smooth animations
  - Persists across navigation with badge notifications
  
- ✅ **Conversation Flow**
  - Mock conversation with user/assistant messages
  - Typing indicators for realistic AI interaction
  - Quick reply buttons for common actions
  - Error/retry states for network issues
  - Keyboard-aware layout
  - Product reference cards with "View details" action
  
- ✅ **System Integration**
  - Direct links from chat to product detail page
  - Context-aware chat responses based on product actions

### Product Detail Screen
- ✅ **Content Stack** (Prioritized for mobile)
  1. Swipeable image gallery with indicators
  2. Product name, winery, and region
  3. Rating and review count
  4. Price and stock availability
  5. Quick info cards (varietal, vintage, ABV)
  6. "Ask our wine expert" CTA button
  7. Expandable sections for:
     - Product description
     - Tasting notes with categorized chips
     - Food pairings
     - Expert reviews
     - Provenance information
  8. Horizontal scroll of recommendations
  9. Sticky "Add to Cart" button
  
- ✅ **Interaction Moments**
  - Swipeable image gallery
  - Expandable/collapsible accordion sections
  - Scroll-triggered sticky header
  - Loading states (typing indicators)
  - Sticky CTA that follows scroll
  
- ✅ **Decision Support**
  - Badge overlays (95+ Points, Critic's Choice)
  - Expert review highlights
  - Food pairing suggestions
  - Provenance verification with visual indicators

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (optional)

### Installation

1. **Navigate to project directory**
   ```bash
   cd ai-wine-assistant
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - For iOS simulator: Press `i`
   - For Android emulator: Press `a`
   - For web browser: Press `w`
   - For physical device: Scan QR code with Expo Go app

## 📂 Project Structure

```
ai-wine-assistant/
├── src/
│   ├── components/
│   │   └── ChatBox.tsx          # Persistent chat component
│   ├── screens/
│   │   └── ProductDetailScreen.tsx  # Product detail page
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── data/
│       └── mockData.ts          # Mock products, messages, etc.
├── App.tsx                       # Main app with navigation
├── package.json
└── README.md
```

## 🛠 Technical Implementation

### Component Architecture

1. **App.tsx**
   - Root component with navigation setup
   - State management for chat and messages
   - Integration layer between chatbox and product detail

2. **ChatBox.tsx**
   - Reusable chat component
   - Animated minimize/expand transitions
   - Keyboard-aware input handling
   - Quick replies and typing indicators

3. **ProductDetailScreen.tsx**
   - Scroll-aware sticky elements
   - Swipeable image gallery
   - Accordion sections for content organization
   - Horizontal scrolling recommendations

### State Management
- React hooks (useState, useRef) for local state
- Props drilling for simple parent-child communication
- No external state management library (appropriate for this scope)

### Navigation
- React Navigation Stack Navigator
- Screen integration with overlay components (ChatBox)

### Styling
- StyleSheet API for performance
- Responsive design with Dimensions API
- Platform-specific adjustments
- Consistent design tokens (colors, spacing)

## 🎨 Design Decisions

### Mobile-First Approach
- **Viewport**: Optimized for 390-414px width (iPhone standard)
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Typography**: Readable font sizes (14-18px for body text)
- **Spacing**: Generous padding for thumb-friendly interactions

### Information Hierarchy
1. Visual appeal (images) comes first
2. Essential purchasing info (price, stock)
3. Quality indicators (ratings, badges)
4. Detailed information (expandable sections)
5. Cross-sell opportunities (recommendations)

### Interaction Patterns
- **Swipe**: Image gallery navigation
- **Tap**: Expand/collapse sections, chat toggle
- **Scroll**: Primary navigation method
- **Quick Actions**: Floating buttons for chat and back navigation

### Color Palette
- **Primary**: #B72E61 (Wine red) - CTAs, branding
- **Success**: #4caf50 - Stock availability
- **Error**: #d32f2f - Out of stock, errors
- **Neutral**: Grays for text hierarchy

## 📊 Mock Data Assumptions

### Products
- All product data is mocked with realistic wine information
- Images use placeholders (via.placeholder.com)
- Prices, ratings, and reviews are fictional
- Stock counts are simulated

### Chat Messages
- Pre-loaded conversation history
- AI responses are simulated with setTimeout
- Product references link to mock product data
- User identity is anonymous

### API Simulation
- No actual backend calls
- 1.5-second delay for "AI thinking"
- Error states shown for demonstration purposes

## ⚡ Performance Considerations

- **Animations**: Using native driver where possible
- **Images**: Would implement lazy loading in production
- **Lists**: Would use FlatList for long scrolling lists
- **Memory**: Components unmount properly to prevent leaks

## 🔮 Future Enhancements

If this were a production app, consider:

1. **Backend Integration**
   - Real API calls to wine database
   - Actual AI/LLM integration for chat
   - User authentication and profiles

2. **Advanced Features**
   - Search and filter functionality
   - Shopping cart with checkout flow
   - Wine recommendations based on preferences
   - AR bottle preview
   - Social sharing

3. **Performance Optimization**
   - Image caching and optimization
   - Redux or Context API for complex state
   - Analytics tracking
   - Offline support

4. **Accessibility**
   - Screen reader support
   - High contrast mode
   - Adjustable font sizes
   - Voice commands

## 🧪 Testing Strategy

For production, implement:
- Unit tests (Jest) for business logic
- Component tests (React Native Testing Library)
- E2E tests (Detox) for critical user flows
- Visual regression tests
- Accessibility audits

## 📝 Implementation Notes

### Key Technical Choices

1. **Expo vs React Native CLI**: Chose Expo for rapid prototyping and easier deployment
2. **TypeScript**: Type safety for better developer experience
3. **React Navigation**: Industry standard for React Native routing
4. **Inline Styles**: StyleSheet API for performance and type safety
5. **No UI Library**: Custom components to match exact requirements

### Trade-offs Made

- **Simplicity over Scalability**: Simple prop drilling instead of Redux
- **Mocked Data**: Focus on UI/UX over backend complexity
- **Limited Animations**: Focused on essential interactions
- **Single Screen Flow**: Demonstrated integration without full app structure

### Production Considerations

- Environment variables for API endpoints
- Secure storage for user tokens
- Analytics integration (Firebase, Mixpanel)
- Error boundary components
- Crash reporting (Sentry)
- App Store compliance (privacy policy, GDPR)

## 🔍 How This Addresses Requirements

### Chatbox Requirements
✅ **Entry & Persistence**: Floating button, minimized state, badge notification  
✅ **Conversation Flow**: Messages, typing indicators, quick replies, error states  
✅ **System Integration**: Product reference cards link to detail page  

### Product Detail Requirements
✅ **Content Stack**: All required elements in prioritized order  
✅ **Interaction Moments**: Swipe gallery, accordion sections, sticky CTA  
✅ **Decision Support**: Badges, expert reviews, pairings, provenance  

### Evaluation Criteria
✅ **Realistic Mobile Experience**: Authentic mobile patterns and interactions  
✅ **Information Hierarchy**: Prioritized for small screens  
✅ **Quality Reasoning**: Documented assumptions and trade-offs  
✅ **Engineering Clarity**: Clear component structure and implementation notes  
✅ **Clear Materials**: Comprehensive README and inline code comments  

## 📄 License

This project is created for assessment purposes.

## 👤 Author

Created for VinoBuzz Tech Lead Assessment – December 2025

---

**Note**: This is a simulator/prototype built for assessment purposes. It uses mock data and simulated interactions to demonstrate mobile UX patterns for a wine e-commerce platform with AI assistance.
