# CineWrapped - Implementation Plan

## Phase 1: Core Data Model & Import
- Define movie data schema (title, date, rating, genres, director, runtime)
- Build Letterboxd CSV parser
- Build IMDb CSV parser
- Build unified data processing pipeline
- Unit tests for parsers

## Phase 2: Streamlit App Shell & Manual Entry
- Set up Streamlit app with dark theme config
- Build sidebar navigation
- Implement CSV file upload widget
- Build manual movie entry form
- Session state management for movie data

## Phase 3: Stats Engine
- Calculate core statistics (total movies, hours watched, avg rating, etc.)
- Genre distribution analysis
- Director/actor frequency analysis
- Watching pattern analysis (by day of week, month, time)
- Rating distribution analysis
- Movie personality type generator

## Phase 4: Beautiful Visualizations
- Genre radar chart (Plotly)
- Watch heatmap calendar
- Rating distribution histogram
- Top directors/actors bar charts
- Monthly watching trend line chart
- All charts styled with dark theme, vibrant colors

## Phase 5: Shareable Summary Cards
- Summary card layout with key stats
- Personality type card
- Top genres card
- Export cards as PNG images
- Download button for sharing

## Phase 6: Polish & Final Testing
- Responsive layout tweaks
- Error handling for edge cases
- Demo data for first-time users
- Final integration test
