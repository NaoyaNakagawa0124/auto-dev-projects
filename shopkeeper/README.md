# ShopKeeper

A cozy virtual bakery web app for grandparents that secretly teaches real business skills. Run your shop, serve customers, set prices, manage inventory — and discover you've been learning invoicing, profit margins, cash flow, and customer relations all along.

## The Secret

It looks like a cute bakery game. But every mechanic maps to a real B2B skill:
- Setting prices = **Pricing Strategy**
- Buying ingredients = **Inventory Management** + **Cash Flow**
- Serving customers = **Customer Relations**
- Tracking sales = **Invoicing**
- Watching items expire = **Waste Reduction**
- Checking the report = **Profit Margins**

Skills are "discovered" with a celebratory toast as you play.

## Features

- 8 products (cookies, cakes, bread, muffins, pies, coffee, tea, juice)
- 8 unique customers with favorite items and tipping habits
- Inventory with expiry (shelf life per product)
- Dynamic pricing with margin feedback
- Auto-generated invoices per sale
- Reputation system (Unknown → Beloved)
- Business report with revenue, costs, profit, and margin
- 7 discoverable business skills

## Run

```bash
open index.html
# or
python3 -m http.server 8080
```

## Test

```bash
node tests/test.js
```
