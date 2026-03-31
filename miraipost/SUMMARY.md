# Miraipost - Summary

## What Was Built

**未来ポスト (Miraipost)** is a Chrome extension for writing letters to your future self. Write warm letters, seal them with a wax seal animation, and choose when they'll be delivered back to you as gentle browser notifications. Also includes a "worry mailbox" where you can write current anxieties, seal them, and revisit later — often finding they've resolved themselves.

## Key Features

- **4-tab UI**: Write (書く) / Delivered (届いた手紙) / Worry Post (不安ポスト) / Pending (配達待ち)
- **Letter composition**: Lined paper effect, handwritten-style font (Zen Maru Gothic)
- **Delivery scheduling**: Preset (1 week / 1 month / 3 months / 1 year) + custom date picker
- **Wax seal animation**: Stamp-in CSS animation on sealing, break-away animation on opening
- **Chrome notifications**: Letters delivered via browser notifications on scheduled dates
- **Worry mailbox**: Special section for anxiety letters with resolution tracking (resolved / still worrying / somewhat)
- **Stats footer**: Track letters sent, delivered, and worries resolved
- **Unread badge**: Red badge on mailbox tab for unopened letters
- **XSS protection**: HTML escaping on all user content display

## Tech Stack

- Chrome Extension Manifest V3
- Vanilla JS / HTML5 / CSS3
- Chrome Storage API (local persistence)
- Chrome Alarms API (30-min delivery checks)
- Chrome Notifications API
- Google Fonts (Zen Maru Gothic)

## Design Decisions

- **Warm paper aesthetic**: Cream/beige color palette, lined paper background, wax seal motifs
- **No frameworks**: Vanilla JS for minimal extension size and fast popup load
- **Local-only storage**: All letters stay on-device via chrome.storage.local (privacy-first)
- **Therapeutic UX**: Worry mailbox inspired by expressive writing therapy research

## Potential Next Steps

- Encryption for stored letters
- Dark mode (nighttime writing)
- Letter templates / prompts for writer's block
- Export/import letters as JSON backup
- Gratitude letter mode (write to others)
