# Design Guidelines: Fastest Finger Pot dApp

## Design Approach

**Selected Approach**: Modern Web3 Gaming Interface  
Drawing inspiration from platforms like Polymarket (clean betting interfaces), Linear (focused utility), and modern arcade game aesthetics. This is a utility-first application where clarity, speed, and immediate game state visibility are paramount.

**Core Principles**:
- Instant clarity: Users should understand game state within 2 seconds
- Speed-optimized: Zero friction between wallet connection and gameplay
- Gaming-focused: Competitive, energetic feel without distracting animations
- Web3 native: Embrace crypto conventions (wallet states, transaction feedback)

---

## Typography

**Font Stack**:
- Primary: Inter (via Google Fonts CDN) - Clean, modern, excellent for numbers and data
- Monospace: JetBrains Mono - For wallet addresses, timer, and numerical displays

**Hierarchy**:
- Display (Timer/Pot): 72px, Bold, Monospace
- H1 (Game Status): 48px, Bold
- H2 (Section Headers): 32px, Semibold
- H3 (Player Names): 20px, Medium
- Body (Instructions): 16px, Regular
- Small (Wallet Address): 14px, Monospace

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4, p-6, p-8
- Section spacing: gap-6, gap-8
- Button padding: px-6 py-3
- Card spacing: p-6

**Grid Structure**:
- Single-column mobile-first approach
- Desktop: 2-column layout (Game Controls | Leaderboard)
- Max container width: max-w-7xl
- Centered alignment with mx-auto

**Viewport Strategy**:
- Header: Fixed top navigation (wallet connection, network status)
- Game Area: Natural height, centered content
- No forced 100vh - content determines height
- Responsive breakpoints: sm, md, lg, xl

---

## Component Library

### Core Game Interface

**1. Game Status Card** (Primary Focus Area)
- Large, prominent timer display (countdown from 15s)
- Current pot size in ETH (large, eye-catching)
- Round status indicator (Waiting | Active | Ended)
- Grouped in single card with clear visual hierarchy

**2. Click Button** (The Star)
- Extra large (min 200px × 200px on desktop)
- Circular shape for ergonomic clicking
- Disabled state when round inactive
- Click counter directly below button
- Haptic-feeling design (appears pressable)

**3. Stake Entry Panel**
- Input field for ETH amount (large, clear)
- "Join Round" button (primary CTA)
- Current stake display if already entered
- Validation feedback inline

**4. Leaderboard Table**
- Rank | Player Address (truncated) | Clicks | Stake | Score (Clicks × Stake)
- Highlight current user's row
- Top 10 players shown
- Sticky header on scroll
- Monospace font for addresses and numbers

**5. Winner Display**
- Appears at round end
- Winner address with celebratory treatment
- Winning score and payout amount
- "Start New Round" button for admin/next game

### Navigation & Wallet

**Header Bar**:
- Logo/App name (left)
- Network indicator (Monad Testnet badge)
- Wallet connection button (right)
- Connected: Show truncated address with disconnect option
- Transaction pending state indicator

**Wallet States**:
- Not Connected: Prominent "Connect Wallet" button
- Connecting: Loading state
- Connected: Address display with copy functionality
- Wrong Network: Clear warning with network switch prompt

### Forms & Inputs

**Input Fields**:
- Large touch targets (min 48px height)
- Clear labels above inputs
- ETH denomination visible within input
- Error states with red border and message below
- Success states with green border

**Buttons**:
- Primary: High contrast, bold
- Secondary: Outline style
- Disabled: Reduced opacity, no hover
- Sizes: Small (px-4 py-2), Medium (px-6 py-3), Large (px-8 py-4)

### Data Display

**Stats Cards**:
- Total Pot: Large number with ETH symbol
- Players Entered: Count with icon
- Time Remaining: Countdown with progress indicator
- Grid layout: 3-column on desktop, stacked on mobile

**Transaction Feedback**:
- Toast notifications for tx status (pending, success, failed)
- Position: Top-right corner
- Auto-dismiss after 5s
- Include transaction hash link

---

## Animations

**Minimal, Purposeful Only**:
- Timer countdown: Smooth number transitions
- Click button: Subtle scale on click (0.95) with immediate bounce back
- Transaction pending: Subtle pulsing indicator
- No scroll animations, no decorative effects

---

## Accessibility

- All interactive elements minimum 44px touch target
- Clear focus states with visible outlines
- Wallet address truncation with full address on hover/click
- Transaction confirmations in plain language
- Error messages that explain what to do next

---

## Images

**No Hero Image**: This is a functional game interface, not a landing page. The game controls and leaderboard should be immediately visible without scrolling.

**Icon Usage**:
- Use Heroicons (via CDN) for UI elements
- Trophy icon for winner display
- Wallet icon for connection state
- Timer icon for countdown
- ETH logo for currency displays

---

## Page Structure

**Single-Page Application Layout**:

1. **Header** (fixed, full-width)
   - App branding, network badge, wallet connection

2. **Game Dashboard** (centered, max-w-7xl)
   - **Left Column** (Game Controls):
     - Game Status Card (timer, pot, status)
     - Stake Entry Panel (if not entered)
     - Click Button (massive, centered)
     - Click counter
   
   - **Right Column** (Leaderboard):
     - "Current Round" heading
     - Leaderboard table
     - Stats cards below

3. **Winner Modal** (overlay when round ends)
   - Winner announcement
   - Payout details
   - Next round button

4. **Footer** (minimal)
   - Contract address (with verify link)
   - GitHub link
   - "Built for [Hackathon Name]"

**Mobile Stacking**: Columns stack vertically (Game Controls → Leaderboard)

---

## Key UX Flows

**First-Time User**:
1. Land on page → See "Connect Wallet" prominently
2. Connect → Immediately see stake entry
3. Enter stake → Join round → Button activates
4. Clear instructions at each step

**Active Player**:
1. See timer counting down
2. Click button frantically
3. Watch score update in leaderboard
4. Round ends → Winner displayed
5. One-click to start/join next round

**Spectator**:
1. Can view without connecting
2. Leaderboard visible
3. Clear "Join to Play" messaging

---

## Technical Considerations

- Optimize for rapid wallet switching (common in hackathons)
- Clear error messages for common issues (insufficient funds, wrong network)
- Transaction confirmation states clearly communicated
- Real-time updates using ethers.js event listeners
- Responsive down to 320px width