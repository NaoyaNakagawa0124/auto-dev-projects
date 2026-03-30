# Book Cosmos — Implementation Plan

## Phase 1: Three.js Scene & Starfield
- Full Three.js scene with camera controls (OrbitControls)
- Background starfield (thousands of tiny stars)
- Nebula effects with colored fog
- Ambient lighting and bloom-like glow effects

## Phase 2: Book Data & N-Body Physics
- Book data model (title, author, pages, genre, rating, date)
- N-body gravitational simulation (books attract books of same genre)
- Book → celestial body mapping (size, color, orbit)
- Physics engine running in animation loop
- Genre-based gravitational clustering

## Phase 3: UI & Book Management
- Add book form (title, author, pages, genre, rating)
- Book list panel (scrollable sidebar)
- Click on star to see book info tooltip
- Pre-populated demo library
- Import/export library as JSON

## Phase 4: Effects & Polish
- Supernova explosion effect for 500+ page books
- Trail lines showing orbital paths
- Genre legend with color mapping
- Statistics panel (total books, pages, genre breakdown)
- Japanese UI throughout
- Responsive layout
