# Implementation Plan - 未来ポスト (Miraipost)

## Phase 1: Extension Skeleton & Popup UI
- manifest.json (Manifest V3)
- Popup with tabbed navigation (書く / 届いた手紙 / 不安ポスト)
- Warm paper-texture CSS with handwritten font
- Basic Chrome storage read/write

## Phase 2: Letter Writing & Sealing
- Letter composition form (recipient = future self)
- Delivery date picker (preset + custom)
- Seal animation (wax seal stamp effect)
- Save letter to Chrome storage with delivery timestamp

## Phase 3: Delivery System & Notifications
- Chrome alarms for scheduled delivery checks
- Background service worker to check for deliverable letters
- Chrome notification with letter preview
- Mark letters as delivered

## Phase 4: Letterbox & Reading Experience
- Delivered letters list with sealed/opened states
- Wax seal break animation on first open
- Handwritten-style letter display
- Worry mailbox: special section for anxiety letters
- Stats (letters sent, delivered, worries resolved)

## Phase 5: Polish & Quality
- Japanese text throughout
- Responsive popup sizing
- Smooth transitions and micro-animations
- Empty states with encouraging messages
- Final testing
