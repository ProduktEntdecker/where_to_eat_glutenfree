# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An iOS-ready app (PWA + Capacitor) for finding gluten-free restaurants nearby. Built with TypeScript, Vite, Tailwind CSS, and Capacitor for native iOS deployment. Features iOS-native design language, tab-based navigation, Google Places API integration with OpenStreetMap fallback, favorites, filters, and offline support.

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

# Type checking
tsc --noEmit

# iOS / Capacitor
npm run cap:add:ios    # Add iOS platform (requires Xcode)
npm run cap:sync       # Build web + sync to native
npm run cap:open:ios   # Open in Xcode
```

## Architecture

### Component System
Vanilla TypeScript component classes. Each component:
- Has a `render()` or `createElement()` method returning an HTMLElement
- Manages its own state and event listeners
- Located in `src/components/`

### Navigation
- Tab-based navigation: Nearby, Search, Favorites, Settings
- `src/services/router.ts` manages tab state and detail view navigation
- `TabBar` component renders the iOS-style bottom tab bar

### Data Flow
1. User interaction -> Router navigation / Search input
2. Search -> Google Places SDK (if API key) -> OpenStreetMap Overpass API (fallback) -> Mock data (fallback)
3. Results cached in memory (5 min TTL)
4. Filters applied client-side
5. Favorites persisted in localStorage

### Key Architectural Decisions
- **No Framework**: Vanilla TypeScript for lightweight bundle (~36KB gzipped)
- **Capacitor**: Native iOS wrapper for App Store deployment
- **iOS Design System**: CSS custom properties matching iOS design tokens
- **Dual API Strategy**: Google Places (best data) with free OSM fallback
- **Service Worker**: Cache-first for static assets, network-first for API calls

## File Structure

```text
src/
├── api/
│   ├── places.ts           # Main search API (Google Places + OSM + mock fallback)
│   └── openstreetmap.ts    # OpenStreetMap Overpass API integration
├── components/
│   ├── TabBar.ts           # iOS-style bottom tab bar
│   ├── SearchBar.ts        # Search input with debouncing
│   ├── FilterBar.ts        # Filter pills (open now, rating, distance, price)
│   ├── RestaurantCard.ts   # Restaurant card with photo, rating, favorites
│   ├── RestaurantDetail.ts # Full detail view with contact, directions, map
│   ├── SettingsView.ts     # Settings (radius, API key, data management)
│   ├── LoadingSpinner.ts   # Loading state
│   └── EmptyState.ts       # Empty/error state
├── services/
│   ├── geolocation.ts      # Browser geolocation wrapper
│   ├── favorites.ts        # localStorage favorites management
│   └── router.ts           # Tab navigation + detail view routing
├── types.ts                # TypeScript interfaces
├── google-maps.d.ts        # Google Maps type declarations
├── app.ts                  # Main app orchestrator
├── main.ts                 # Entry point + service worker registration
└── style.css               # iOS design system CSS

public/
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (cache strategy)
├── icon.svg                # App icon
└── icons/                  # Icon sizes

capacitor.config.ts         # Capacitor iOS configuration
```

## Styling

- **iOS Design System**: Custom CSS properties (`--ios-green`, `--ios-blue`, etc.)
- **Tailwind CSS**: Utility classes for layout
- **Safe Areas**: `env(safe-area-inset-*)` for iPhone notch/home indicator
- **Backdrop blur**: iOS-style translucent navigation and tab bars
- **Animations**: Slide transitions, fade-in, press effects

## API Configuration

Set Google Places API key in one of:
1. Settings tab in the app (stored in localStorage)
2. `.env` file: `VITE_GOOGLE_PLACES_API_KEY=your_key`

Without an API key, the app uses OpenStreetMap (free, no photos/ratings).

## iOS Deployment

1. `npm run cap:add:ios` (requires macOS with Xcode)
2. `npm run cap:sync`
3. `npm run cap:open:ios`
4. Build and deploy from Xcode

## TypeScript Configuration

- **Strict Mode**: All strict checks enabled
- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **No Emit**: TypeScript for type checking only, Vite transpiles
