# Poker Trainer Project Plan

## Overview
A comprehensive Texas Hold'em poker training application built as a monorepo with TypeScript, featuring a deterministic game engine, 3D frontend visualization, adaptive curriculum system, and analytics dashboard.

## Architecture

### Monorepo Structure
```
/poker-trainer
├── pnpm-workspace.yaml
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   ├── engine/           # Core game logic
│   ├── frontend/         # React/Vite UI
│   ├── curriculum/       # Training lessons
│   └── analytics/        # Metrics & persistence
```

### Technology Stack
- **Monorepo**: pnpm workspaces
- **Language**: TypeScript (strict mode)
- **Engine**: Pure functional reducers with immutable state
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Testing**: Vitest with 95% coverage requirement
- **Persistence**: Dexie (IndexedDB)
- **Deployment**: Netlify with GitHub Actions CI/CD

## Core Components

### 1. Shared Types Package
- Card representation (rank, suit)
- Player state management
- Game state structure
- Action types enum
- Pot management types

### 2. Game Engine
#### Key Algorithms:
- **RNG**: xoshiro256** with deterministic bigint seed
- **Shuffle**: Fisher-Yates algorithm
- **Hand Evaluation**: 7-card evaluator (bitmask/hash table)
- **State Management**: Redux-style reducers

#### Core Reducers:
- `blinds.ts`: Post small/big blinds
- `deal.ts`: Deal hole cards
- `bettingRound.ts`: Handle betting action flow
- `sidePot.ts`: Calculate and distribute side pots
- `showdown.ts`: Evaluate hands and award pots
- `cleanup.ts`: Reset for next hand

#### API Surface:
- `newHand()`: Initialize game state
- `legalActions()`: Get valid actions for current player
- `applyAction()`: Apply player action to state

### 3. Frontend Application
#### Design System:
- **Theme**: Dark-only
- **Font**: Inter 400/600
- **Colors**: 
  - Background: #0E0E11
  - Table: #19191F
  - Borders: #2A2A32
  - Chips: #F5F5F7
- **Spacing**: 4px grid system
- **Border Radius**: 12px
- **Shadows**: 0 2px 6px rgba(0,0,0,.5)

#### Components:
- **Layout**: Table (CSS Grid), Seat positioning
- **3D Elements**: Card3D with spring animations
- **UI**: ActionBar, PotBreakdown, HintPanel
- **Metrics**: Dashboard for analytics

#### State Management:
- React hooks (useGame)
- Structured cloning for immutability
- Real-time action dispatch

### 4. Curriculum System
#### Lesson Structure:
```json
{
  "id": "L1",
  "title": "Fold Trash Pre-Flop",
  "targetStage": "pre-flop",
  "goal": {
    "condition": "foldBeforeFlop",
    "handList": ["72o", "83o", "94o"]
  },
  "hints": ["UTG range = 14%", "Trash > rank9 off? fold"]
}
```

#### Adaptive Scheduler:
- Monitors player metrics (VPIP, showdown win rate)
- Suggests lessons based on detected leaks
- Progressive difficulty scaling

### 5. Analytics System
- **Persistence**: Dexie for hand history
- **Metrics**: VPIP, AF, WTSD, showdown win %
- **Scheduling**: Adaptive lesson recommendations

## Implementation Phases

### Week 1: Foundation
- Set up monorepo structure
- Implement core engine (RNG, shuffle, state management)
- Complete unit test suite (95% coverage)
- Establish CI/CD pipeline

### Week 2: Gameplay
- Build frontend table component
- Wire user actions to engine
- Implement heads-up play functionality
- Add basic animations

### Week 3: Advanced Features
- Integrate side pot logic
- Build hint engine
- Implement lessons L1-L5
- Add pot breakdown UI

### Week 4: Polish & Deploy
- Adaptive scheduler implementation
- Analytics dashboard
- Performance optimization
- Production deployment

## Quality Standards

### Code Quality:
- TypeScript strict mode
- Immutable state management
- Pure functional reducers
- No comments unless necessary

### Testing:
- 95% coverage requirement
- Mutation testing with deep-freeze
- Edge case coverage (odd chips, all-ins)
- Integration tests for user flows

### Performance:
- Sub-16ms frame time for animations
- Instant action response
- Efficient hand evaluation
- Minimal bundle size

## Deployment Strategy

### Build Process:
```bash
pnpm -r run build && pnpm --filter frontend exec vite build
```

### CI/CD:
- GitHub Actions workflow
- Build artifact caching
- Automated Netlify deployment
- Environment secret management

## Success Metrics
- 95% test coverage maintained
- Sub-200ms action response time
- 60fps animation performance
- Zero runtime errors in production
- Adaptive curriculum engagement rate > 80%