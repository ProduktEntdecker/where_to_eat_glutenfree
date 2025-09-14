# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-first Progressive Web App (PWA) for finding gluten-free restaurants and safe dining options. Built with TypeScript, Vite, and Tailwind CSS, featuring a component-based architecture without a framework.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (runs automatically with build)
tsc --noEmit
```

## Architecture

### Component System
The app uses a custom vanilla TypeScript component system where each component:
- Has a `render()` method returning an HTMLElement
- Manages its own state and event listeners
- Located in `src/components/`

### Core Application Flow
1. **Entry Point**: `index.html` → `src/main.ts` → `src/app.ts`
2. **App Initialization**: `GlutenFreeFinderApp` class orchestrates the entire application
3. **Data Flow**: User interaction → Search → API call → State update → Re-render

### Key Architectural Decisions
- **No Framework**: Vanilla TypeScript with manual DOM manipulation for lightweight bundle
- **Component Pattern**: Each UI element is a class with lifecycle methods
- **Mock API**: Currently using mock data in `src/api/places.ts` (ready for real API integration)
- **Geolocation**: Optional location services with graceful fallback

## File Structure

```
src/
├── api/places.ts         # Restaurant search API (currently mock data)
├── services/geolocation.ts # Browser geolocation wrapper
├── types.ts              # TypeScript interfaces (Restaurant, Location)
├── app.ts                # Main application orchestrator
├── main.ts               # Entry point and app initialization
└── components/           # UI components
    ├── SearchBar.ts      # Search input with debouncing
    ├── RestaurantCard.ts # Individual restaurant display
    ├── LoadingSpinner.ts # Loading state indicator
    └── EmptyState.ts     # No results display
```

## Component Creation Pattern

When creating new components, follow this pattern:

```typescript
export class ComponentName {
  private property: Type;
  
  constructor(params) {
    // Initialize state
  }
  
  render(): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = `<!-- HTML template -->`;
    // Attach event listeners
    return element;
  }
  
  // Additional methods for state management
}
```

## API Integration Points

The app is designed for easy integration with real APIs:
- **Google Places API**: Ready for integration in `src/api/places.ts`
- **Geolocation**: Already implemented, just needs user permission
- **Restaurant Data**: Mock structure matches expected Google Places response

## Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Custom styles**: Defined in `src/style.css` (imported in main.ts)
- **Responsive Design**: Mobile-first with max-width container for desktop

## TypeScript Configuration

- **Strict Mode**: Enabled with all strict checks
- **Module System**: ESNext modules with bundler resolution
- **Target**: ES2020 for modern browser support
- **No Emit**: TypeScript used only for type checking, Vite handles transpilation

## Testing Considerations

Currently no test framework configured. The modular component structure supports easy unit testing of individual components and services.

## Deployment Notes

- **Build Output**: `dist/` directory after running `npm run build`
- **PWA Ready**: Includes manifest.json and meta tags for installable web app
- **Static Hosting**: Can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages)