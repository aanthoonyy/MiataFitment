# Proposed Folder Structure (After Priority Actions)

```
src/
├── components/                    # All React components
│   ├── FitmentSettingsTabs/
│   │   ├── AccountSettings.tsx
│   │   ├── CarSelectionSettings.tsx
│   │   ├── FitmentSettingsStyles.ts
│   │   ├── SuspensionSettings.tsx
│   │   ├── TireSettings.tsx
│   │   └── WheelSettings.tsx
│   ├── FitmentSimulator.tsx
│   ├── GallerySection.tsx
│   ├── Header.tsx                # Visualizer header (kept as-is)
│   ├── LandingHeader.tsx         # Renamed from header.tsx
│   ├── LoginPage.tsx
│   ├── MainImage.tsx
│   ├── MainImageAndSimulator.tsx
│   ├── Marketplace.tsx
│   ├── Footer.tsx                 # Moved from assets/footer.tsx
│   └── BuyMeCoffee.tsx            # Moved from assets/buymecoffee.tsx
│
├── pages/                         # Page-level components (NEW)
│   ├── LandingPage.tsx            # Moved from landingPage.tsx
│   ├── GalleryPage.tsx            # Moved from galleryPage.tsx
│   ├── MarketPage.tsx             # Moved from marketPage.tsx
│   └── VisualizerPage.tsx         # Moved from mainComponent.tsx
│
├── hooks/                         # Custom React hooks (NEW)
│   └── useThreeScene.ts           # Extracted from mainComponent.tsx
│
├── assets/                        # Three.js utilities and static assets
│   ├── cameraMaker.ts
│   ├── carMaker.ts
│   ├── lighting.ts
│   ├── renderer.ts
│   ├── tire.ts
│   ├── wheels.ts
│   ├── common/
│   │   ├── MilliMeterToInch.ts
│   │   ├── rollingDiameter.ts
│   │   └── wheelPositionCalculator.ts
│   │   # settingsStore.ts removed (duplicate type)
│   └── styles/                    # Renamed from CSS/
│       ├── alignmentSettings.css
│       ├── navBar.css
│       └── styles.css
│
├── types/                         # TypeScript type definitions
│   └── settings.ts                # Single source of truth for Settings type
│
├── utils/                         # Utility functions
│   └── unitConversions.ts
│
├── constants/                     # Constants and configuration
│   └── wheelPositions.ts
│
├── provider/                      # Context providers
│   └── AuthProvider.tsx
│
├── main.tsx                       # App routing (updated imports)
└── index.tsx                      # Entry point
```

## Key Changes Summary:

### High Priority:
1. ✅ **Duplicate Headers Resolved:**
   - `src/components/Header.tsx` → Kept (Visualizer header)
   - `src/header.tsx` → `src/components/LandingHeader.tsx`

2. ✅ **Duplicate Settings Type Removed:**
   - `src/types/settings.ts` → Kept (single source of truth)
   - `src/assets/common/settingsStore.ts` → Removed Settings interface

3. ✅ **Page Components Organized:**
   - `src/landingPage.tsx` → `src/pages/LandingPage.tsx`
   - `src/galleryPage.tsx` → `src/pages/GalleryPage.tsx`
   - `src/marketPage.tsx` → `src/pages/MarketPage.tsx`
   - `src/mainComponent.tsx` → `src/pages/VisualizerPage.tsx`

### Medium Priority:
4. ✅ **React Components Moved:**
   - `src/assets/footer.tsx` → `src/components/Footer.tsx`
   - `src/assets/buymecoffee.tsx` → `src/components/BuyMeCoffee.tsx`
   - `src/fitmentSettings.tsx` → `src/components/FitmentSettings.tsx`

5. ✅ **Naming Conventions Standardized:**
   - All components use PascalCase: `Header.tsx`, `LandingPage.tsx`, etc.

6. ✅ **Custom Hook Extracted:**
   - `useThreeScene` from `mainComponent.tsx` → `src/hooks/useThreeScene.ts`

## Files to Update Imports:

- `src/main.tsx` - Update page imports
- `src/pages/LandingPage.tsx` - Update Header import
- `src/pages/GalleryPage.tsx` - Update Header import
- `src/pages/MarketPage.tsx` - Update Header import
- `src/pages/VisualizerPage.tsx` - Update hook import, Header import
- `src/components/FitmentSettings.tsx` - Update Header import
- Any files importing from `assets/footer.tsx` or `assets/buymecoffee.tsx`
