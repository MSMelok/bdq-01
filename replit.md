# Bitcoin Depot - Location Qualification Intelligence Tool

## Overview
A professional web application that instantly qualifies retail locations for Bitcoin ATM (BTM) placement. Built for Bitcoin Depot's Sales Development Representatives (SDRs) and site scouts to automate the manual process of evaluating potential locations.

## Purpose
Automates location qualification by checking:
- **Population Density**: ZIP-code level analysis using US Census Bureau data
- **BTM Proximity**: 1-mile radius search for existing Bitcoin Depot and competitor ATMs
- **Business Type**: Automatic classification into Tier 1 ($300) or Tier 2 ($200) categories
- **Store Hours**: Validation of 5+ days/week and 9+ hours/day requirements

## Recent Changes (Oct 23, 2025)
- Initial implementation of complete qualification system
- Integrated Google Maps Geocoding API, Places API, and Census Bureau API
- Built comprehensive frontend with dark/light theme support
- Fixed critical Census Service to use TIGER geographic API for accurate land area data
- Implemented settings panel for configurable thresholds

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- TanStack Query for data fetching
- Wouter for routing
- Theme system with dark/light mode

### Backend
- Express.js server
- Axios for API requests
- In-memory storage for settings
- Google Maps Geocoding API
- Google Places API
- US Census Bureau ACS API
- TIGER Geographic API

## Project Architecture

### Data Models (`shared/schema.ts`)
- **QualificationResult**: Complete analysis result with all metrics
- **PopulationDensity**: ZIP code density data and threshold comparison
- **BtmProximity**: Bitcoin Depot and competitor ATM counts
- **BusinessType**: Tier classification and business details
- **StoreHours**: Operating schedule validation
- **Settings**: Configurable qualification thresholds

### Frontend Components
- **SearchInput**: Main address input with analyze button
- **QualificationSummary**: Overall pass/fail status card
- **PopulationDensityCard**: Density visualization with threshold bar
- **BtmProximityCard**: Bitcoin Depot and competitor breakdown
- **BusinessTypeCard**: Tier classification and business details
- **StoreHoursCard**: Weekly schedule with validation indicators
- **SettingsPanel**: Configurable population density and radius settings
- **ThemeToggle**: Dark/light mode switcher
- **LoadingSkeleton**: Beautiful loading state
- **EmptyState**: Initial state with feature preview

### Backend Services
- **GoogleMapsService**: Geocoding, place details, and nearby search
- **CensusService**: Population and land area data from Census APIs
- **QualificationService**: Core business logic for location analysis

### API Endpoints
- `GET /api/settings`: Retrieve current qualification thresholds
- `POST /api/settings`: Update qualification thresholds
- `POST /api/qualify`: Analyze a location address

## Business Logic

### Tier 1 ($300) Business Types
- Supermarkets
- Grocery Stores
- Convenience Stores

### Tier 2 ($200) Business Types
- Hispanic Markets, Smoke shops, Liquor stores
- Wireless stores, Check cashing, Currency exchange
- Pawn shops, Dollar/discount stores, Casinos
- Pharmacies, Hotels, Gun stores, Jewelry stores
- Fast food, cafes, delis (no sit-down restaurants)
- Laundromats, Auto/hardware stores, Sporting goods
- Bowling alleys, Thrift stores, Shipping stores
- And more (see qualification.service.ts)

### Qualification Criteria
1. **Population Density**: Must meet minimum threshold (default: 1,000/sq mi)
2. **No Bitcoin Depot ATMs**: Zero existing BD ATMs within search radius
3. **Qualified Business Type**: Must be Tier 1 or Tier 2
4. **Adequate Hours**: At least 5 days/week AND 9 hours/day average

## Environment Variables
- `GOOGLE_MAPS_API_KEY`: Google Maps Geocoding and Places API
- `CENSUS_API_KEY`: US Census Bureau API access

## Design System
- **Primary Color**: Bitcoin orange (#FF8800 / hsl(24 90% 50%))
- **Success**: Green for qualified locations
- **Error**: Red for disqualified locations
- **Typography**: Inter for UI, JetBrains Mono for data values
- **Spacing**: Consistent 4px grid system
- **Components**: Professional dashboard aesthetic

## User Workflow
1. Enter retail address in search input
2. Click "Analyze" button
3. View instant qualification results with:
   - Overall qualified/not qualified status
   - Population density analysis
   - Nearby BTM breakdown (BD + competitors)
   - Business tier classification
   - Store hours validation
4. Adjust settings if needed via gear icon
5. Analyze additional locations

## Future Enhancements
- Batch address processing
- Qualification history database
- Exportable reports (CSV/PDF)
- Map visualization with radius overlay
- Lead prioritization scoring
- Historical analysis and trends
