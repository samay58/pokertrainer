# Poker Trainer Development Tasks

## Week 1: Foundation & Core Engine

### Day 1: Monorepo Setup
- [x] Initialize pnpm workspace with `pnpm-workspace.yaml`
- [x] Create package directories: shared-types, engine, frontend, curriculum, analytics
- [x] Configure TypeScript for each package with strict mode
- [x] Set up shared tsconfig.base.json for inheritance
- [x] Configure vitest for engine package
- [x] Set up GitHub repository with .gitignore

### Day 2: Shared Types Implementation
- [x] Create `card.ts` with Rank and Suit types
- [x] Create `enums.ts` with ActionType enum
- [x] Create `player.ts` with PlayerState interface
- [x] Create `pot.ts` with Pot interface
- [x] Create `game.ts` with GameState interface
- [x] Export all types from package index

### Day 3: Engine Core - RNG & Deck
- [x] Implement `rng.ts` with xoshiro256** algorithm
- [x] Create `shuffle.ts` with Fisher-Yates implementation
- [x] Implement `deck.ts` with standard 52-card generation
- [x] Write unit tests for RNG determinism
- [x] Write unit tests for shuffle distribution
- [x] Achieve 100% coverage for these modules

### Day 4: Engine Core - Game State
- [x] Implement `gameState.ts` with initial state factory
- [x] Create `blinds.ts` reducer with proper all-in handling
- [x] Create `deal.ts` reducer for hole card distribution
- [x] Implement helper functions: nextActiveSeat, activePlayers
- [ ] Write tests for blind posting edge cases
- [ ] Write tests for dealing with various player counts

### Day 5: Betting Logic
- [x] Implement `bettingRound.ts` with action validation
- [x] Create `legalActions.ts` to determine valid moves
- [x] Implement `applyAction.ts` reducer with all action types
- [x] Handle min-raise calculations
- [ ] Write tests for betting sequences
- [ ] Test all-in scenarios and side pot triggers

### Day 6: Side Pots & Evaluation
- [x] Implement `sidePot.ts` with multi-way pot calculations
- [x] Create `evaluate/rank.ts` with 7-card evaluator
- [x] Implement `evaluate/compare.ts` for hand comparison
- [ ] Write comprehensive side pot tests
- [ ] Test odd chip distribution
- [ ] Achieve 95% test coverage milestone

### Day 7: Engine API & Testing
- [x] Create `api/index.ts` with public exports
- [x] Implement `api/newHand.ts` factory
- [x] Finalize `api/applyAction.ts` with validation
- [x] Write integration tests for full hand scenarios
- [ ] Add mutation testing with deep-freeze
- [ ] Document API surface in README

## Week 2: Frontend & Basic Gameplay

### Day 8: Frontend Setup
- [x] Initialize Vite + React + TypeScript
- [x] Configure Tailwind CSS with design tokens
- [x] Set up Inter font with @font-face
- [x] Create base layout structure
- [x] Configure path aliases for imports
- [x] Set up development server

### Day 9: Component Architecture
- [x] Create `Card3D.tsx` with Framer Motion animations
- [x] Implement `ChipStack.tsx` with denomination logic
- [x] Create `Button.tsx` with variant system
- [ ] Build `Tooltip.tsx` for hints
- [ ] Set up component story structure
- [x] Configure CSS variables for theming

### Day 10: Table Layout
- [x] Implement `Table.tsx` with CSS Grid
- [x] Create `Seat.tsx` with positioning logic
- [x] Add player avatars and stack display
- [ ] Implement dealer button rotation
- [x] Add community card area
- [x] Style felt texture and shadows

### Day 11: Game State Integration
- [x] Implement `useGame` hook with state management
- [x] Wire engine API to React state
- [x] Create action dispatch system
- [x] Add WebSocket simulation for AI players
- [ ] Implement state persistence
- [ ] Add error boundary

### Day 12: Action UI
- [x] Build `ActionBar.tsx` with dynamic buttons
- [x] Implement bet slider with validation
- [ ] Add keyboard shortcuts
- [ ] Create action confirmation
- [ ] Add timer visualization
- [ ] Style active player indicators

### Day 13: Animations & Polish
- [ ] Add card dealing animations
- [ ] Implement chip movement to pot
- [ ] Create win celebration effects
- [ ] Add sound effect hooks
- [ ] Optimize animation performance
- [ ] Test on various screen sizes

### Day 14: Heads-Up Testing
- [ ] Complete heads-up gameplay flow
- [ ] Test all action sequences
- [ ] Verify pot calculations
- [ ] Check animation timing
- [ ] Fix any UI/UX issues
- [ ] Prepare week 2 demo

## Week 3: Advanced Features

### Day 15: Multi-Player Support
- [ ] Extend to 6-max table
- [ ] Update seat positioning
- [ ] Adjust UI scaling
- [ ] Test with 3-6 players
- [ ] Handle player disconnection
- [ ] Add join/leave animations

### Day 16: Side Pot UI
- [ ] Create `PotBreakdown.tsx` component
- [ ] Implement floating pot display
- [ ] Add pot formation animations
- [ ] Show eligible players per pot
- [ ] Test complex side pot scenarios
- [ ] Add pot total calculations

### Day 17: Hint Engine
- [ ] Create `HintPanel.tsx` overlay
- [ ] Implement hint triggering logic
- [ ] Add contextual hint selection
- [ ] Create hint animation system
- [ ] Wire to curriculum goals
- [ ] Add hint dismissal

### Day 18: Curriculum System
- [ ] Parse `lessons.json` structure
- [ ] Implement goal condition evaluator
- [ ] Create lesson progress tracker
- [ ] Build lesson selection UI
- [ ] Add progress persistence
- [ ] Implement L1-L5 lessons

### Day 19: Metrics Collection
- [ ] Implement hand history recording
- [ ] Calculate VPIP, AF, WTSD
- [ ] Create metrics aggregation
- [ ] Add session statistics
- [ ] Build metrics API
- [ ] Test metric accuracy

### Day 20: Integration Testing
- [ ] Test full lesson flows
- [ ] Verify hint triggering
- [ ] Check metrics accuracy
- [ ] Test UI responsiveness
- [ ] Fix integration bugs
- [ ] Update documentation

### Day 21: Performance Optimization
- [ ] Profile render performance
- [ ] Optimize re-renders
- [ ] Implement React.memo
- [ ] Add virtualization if needed
- [ ] Minimize bundle size
- [ ] Test on low-end devices

## Week 4: Analytics & Deployment

### Day 22: Analytics Dashboard
- [ ] Create `MetricDashboard.tsx`
- [ ] Implement chart components
- [ ] Add session comparison
- [ ] Create leak detection UI
- [ ] Style dashboard layout
- [ ] Add export functionality

### Day 23: Adaptive Scheduler
- [ ] Implement scheduler algorithm
- [ ] Create lesson recommendation engine
- [ ] Add progress-based adaptation
- [ ] Test recommendation accuracy
- [ ] Wire to UI notifications
- [ ] Add manual override

### Day 24: Data Persistence
- [ ] Set up Dexie schema
- [ ] Implement hand history storage
- [ ] Add metrics persistence
- [ ] Create data migration system
- [ ] Add backup/restore
- [ ] Test data integrity

### Day 25: Production Build
- [ ] Configure production builds
- [ ] Optimize asset loading
- [ ] Set up CDN for assets
- [ ] Configure service worker
- [ ] Add offline support
- [ ] Create build scripts

### Day 26: CI/CD Pipeline
- [ ] Set up GitHub Actions workflow
- [ ] Configure pnpm caching
- [ ] Add test automation
- [ ] Set up Netlify deployment
- [ ] Configure environment secrets
- [ ] Add deployment notifications

### Day 27: Documentation
- [ ] Write comprehensive README
- [ ] Document API endpoints
- [ ] Create deployment guide
- [ ] Add troubleshooting section
- [ ] Document lesson creation
- [ ] Create contributor guide

### Day 28: Launch Preparation
- [ ] Final testing pass
- [ ] Performance verification
- [ ] Security audit
- [ ] Create launch checklist
- [ ] Prepare marketing materials
- [ ] Deploy to production

## Ongoing Tasks

### Code Quality
- [ ] Maintain 95% test coverage
- [ ] Regular dependency updates
- [ ] Performance monitoring
- [ ] Error tracking setup
- [ ] Code review process
- [ ] Documentation updates

### Feature Backlog
- [ ] Tournament mode
- [ ] Multiplayer networking
- [ ] Advanced statistics
- [ ] Custom lesson creator
- [ ] Mobile app version
- [ ] AI opponent improvements

### Technical Debt
- [ ] Refactor large components
- [ ] Optimize bundle splitting
- [ ] Improve type safety
- [ ] Add E2E tests
- [ ] Enhance accessibility
- [ ] SEO optimization