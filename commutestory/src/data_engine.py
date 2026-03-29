"""
CommuteStory — Data engine for the infrastructure narrative notebook.
A fictional commute through real engineering concepts.
"""
from dataclasses import dataclass, field
from typing import List, Dict, Optional
import random
import math

@dataclass
class Station:
    id: int
    name: str
    chapter_title: str
    narrative: List[str]
    engineering_type: str  # tunnel, bridge, brt, elevated, underground, station, viaduct, depot
    icon: str
    distance_km: float  # from start
    depth_m: float  # negative = underground, positive = elevated
    year_built: int
    fun_fact: str
    engineering_data: Dict  # type-specific data for visualization

STATIONS: List[Station] = [
    Station(0, "Riverside Terminal", "Chapter 1: Where It All Begins",
        ["You tap your card and step onto the platform at Riverside Terminal.",
         "The station hums with 6,000 daily commuters. You're one of them.",
         "But have you ever looked UP? The roof is a 120-meter steel truss span,",
         "designed to withstand 150 km/h winds without a single internal column.",
         "Every 12 seconds, 400 tons of steel flexes imperceptibly with the wind.",
         "Your commute begins. And so does the story of the city beneath your feet."],
        "station", "🏛️", 0.0, 0.0, 2018,
        "The roof truss uses the same geometry as the Eiffel Tower — a triangulated lattice.",
        {"span_m": 120, "weight_tons": 400, "daily_passengers": 6000, "columns": 0, "wind_rating_kmh": 150}),

    Station(1, "Old Town Tunnel", "Chapter 2: Into the Earth",
        ["The train descends. Daylight fades. You enter Old Town Tunnel.",
         "Bored through solid granite 40 meters below the historic district,",
         "this tunnel was carved by a 200-ton tunnel boring machine (TBM)",
         "named 'Stella' — after the lead engineer's grandmother.",
         "Stella chewed through 12 meters of rock per day for 14 months.",
         "The walls you're passing were sprayed with 30cm of shotcrete,",
         "then lined with precast concrete segments, each weighing 4 tons."],
        "tunnel", "🕳️", 2.8, -40.0, 2021,
        "The TBM 'Stella' was disassembled underground and removed piece by piece through an access shaft.",
        {"length_m": 1800, "depth_m": 40, "tbm_weight_tons": 200, "daily_advance_m": 12,
         "construction_months": 14, "shotcrete_thickness_cm": 30, "segment_weight_tons": 4}),

    Station(2, "Harbor Bridge", "Chapter 3: Across the Water",
        ["Light floods back in. The train emerges onto Harbor Bridge.",
         "A cable-stayed bridge with a 340-meter main span, it carries",
         "four rail tracks and six road lanes across the harbor.",
         "Each of the 72 cables can support 500 tons — ten times what they carry.",
         "The bridge sways up to 30cm in strong wind. You can't feel it,",
         "because tuned mass dampers in the towers absorb the motion.",
         "Look down: 65 meters of water. Look up: 120 meters of tower."],
        "bridge", "🌉", 5.1, 65.0, 2023,
        "The bridge deck was built using the cantilever method — extending from both towers toward the middle.",
        {"main_span_m": 340, "tower_height_m": 120, "cables": 72, "cable_capacity_tons": 500,
         "clearance_m": 65, "sway_cm": 30, "lanes_road": 6, "tracks_rail": 4}),

    Station(3, "Innovation District", "Chapter 4: The Smart Station",
        ["Welcome to Innovation District — the first 'smart station' on the line.",
         "Opened in 2025, it generates 40% of its own electricity via solar canopy.",
         "The platform uses AI-powered crowd sensors to predict congestion",
         "and adjust train frequency in real-time — reducing wait times by 23%.",
         "Rainwater harvesting feeds the underground garden on Level B1.",
         "Even the escalators are smart: they slow to save energy when empty",
         "and speed up when sensors detect approaching passengers."],
        "station", "🏗️", 7.4, -8.0, 2025,
        "The station's AI reduced energy consumption by 31% in its first year of operation.",
        {"solar_capacity_kw": 280, "energy_self_sufficiency_pct": 40, "daily_passengers": 12000,
         "wait_time_reduction_pct": 23, "rainwater_liters_daily": 4500, "ai_energy_savings_pct": 31}),

    Station(4, "Greenway BRT", "Chapter 5: The Bus Revolution",
        ["The train connects to Greenway BRT — a bus rapid transit line.",
         "In 2026, cities are choosing BRT over light rail. Why?",
         "This 8-km dedicated lane cost $45M — vs $400M for equivalent rail.",
         "Buses run every 3 minutes at peak, carrying 15,000 riders daily.",
         "Level boarding, pre-paid stations, signal priority at 23 intersections.",
         "It's not a 'lesser' option — it's smarter infrastructure spending.",
         "The saved $355M funded 40 km of protected bike lanes and 3 parks."],
        "brt", "🚌", 10.2, 0.0, 2026,
        "BRT systems worldwide carry 33 million passengers daily — more than all US metro systems combined.",
        {"length_km": 8, "cost_million": 45, "equivalent_rail_cost_million": 400,
         "frequency_min": 3, "daily_riders": 15000, "signal_priority_intersections": 23,
         "savings_redirected_million": 355}),

    Station(5, "River Viaduct", "Chapter 6: Walking on Air",
        ["The train rises onto the River Viaduct — 800 meters of elevated track",
         "built on 24 prestressed concrete piers, each sunk 15 meters into bedrock.",
         "This section was built using the span-by-span method:",
         "a launching gantry lifted each 33-meter deck segment into place.",
         "The entire viaduct was built without closing a single road below.",
         "At its highest point, you're 22 meters above the river.",
         "The concrete expands 8mm per degree Celsius — expansion joints handle it silently."],
        "viaduct", "🏗️", 13.0, 22.0, 2022,
        "The launching gantry weighed 400 tons and moved itself forward pier by pier like a mechanical caterpillar.",
        {"length_m": 800, "piers": 24, "pier_depth_m": 15, "segment_length_m": 33,
         "max_height_m": 22, "expansion_mm_per_c": 8, "roads_closed": 0}),

    Station(6, "University Heights", "Chapter 7: The Living Station",
        ["University Heights station is alive. Literally.",
         "Its green walls contain 12,000 plants across 40 species,",
         "filtering 200 cubic meters of air per hour.",
         "The bio-filtration system removes 65% of particulate matter —",
         "making the platform air cleaner than the surrounding streets.",
         "The station's architect won the 2024 Pritzker Prize for this design.",
         "You breathe easier here. That's not a metaphor — it's engineering."],
        "station", "🌿", 16.5, -5.0, 2024,
        "The green wall plants are irrigated by gray water recycled from the station's bathrooms.",
        {"plants": 12000, "species": 40, "air_filtered_m3_per_hour": 200,
         "particulate_reduction_pct": 65, "architect_prize": "Pritzker 2024",
         "graywater_recycled_pct": 80}),

    Station(7, "Summit Central", "Chapter 8: Journey's End",
        ["Summit Central. Your stop. You step off.",
         "In 45 minutes, you traveled 19.8 km through:",
         "— 1 steel-truss terminal, 1 granite tunnel, 1 cable-stayed bridge,",
         "— 1 smart station, 1 BRT interchange, 1 concrete viaduct,",
         "— 1 living green station, and now this — Summit Central.",
         "This station sits atop a 3-story underground transit hub",
         "connecting rail, bus, bike share, and pedestrian paths.",
         "You did this yesterday. You'll do it tomorrow.",
         "But now you know: your commute is an engineering masterpiece."],
        "station", "🏙️", 19.8, 0.0, 2020,
        "Summit Central processes 85,000 passengers daily across 4 transit modes — more than some airports.",
        {"daily_passengers": 85000, "transit_modes": 4, "underground_levels": 3,
         "bike_share_docks": 120, "bus_bays": 16, "retail_sqm": 4500}),
]

def get_total_distance():
    return STATIONS[-1].distance_km

def get_elevation_profile():
    return [{"station": s.name, "distance_km": s.distance_km, "elevation_m": s.depth_m, "type": s.engineering_type} for s in STATIONS]

def get_construction_timeline():
    return sorted([{"station": s.name, "year": s.year_built, "type": s.engineering_type, "icon": s.icon} for s in STATIONS], key=lambda x: x["year"])

def get_engineering_summary():
    types = {}
    for s in STATIONS:
        types[s.engineering_type] = types.get(s.engineering_type, 0) + 1
    return types

def get_cost_comparison():
    """Compare BRT vs Rail costs from the narrative."""
    brt = STATIONS[4]
    return {
        "brt_cost_million": brt.engineering_data["cost_million"],
        "rail_equivalent_million": brt.engineering_data["equivalent_rail_cost_million"],
        "savings_million": brt.engineering_data["savings_redirected_million"],
        "brt_length_km": brt.engineering_data["length_km"],
    }

def get_passenger_data():
    return [{"station": s.name, "passengers": s.engineering_data.get("daily_passengers", 0), "icon": s.icon}
            for s in STATIONS if "daily_passengers" in s.engineering_data]

def get_sustainability_data():
    data = []
    for s in STATIONS:
        ed = s.engineering_data
        if "solar_capacity_kw" in ed:
            data.append({"station": s.name, "metric": "Solar (kW)", "value": ed["solar_capacity_kw"]})
        if "air_filtered_m3_per_hour" in ed:
            data.append({"station": s.name, "metric": "Air Filtered (m³/h)", "value": ed["air_filtered_m3_per_hour"]})
        if "rainwater_liters_daily" in ed:
            data.append({"station": s.name, "metric": "Rainwater (L/day)", "value": ed["rainwater_liters_daily"]})
        if "graywater_recycled_pct" in ed:
            data.append({"station": s.name, "metric": "Water Recycled (%)", "value": ed["graywater_recycled_pct"]})
        if "energy_self_sufficiency_pct" in ed:
            data.append({"station": s.name, "metric": "Energy Self-Sufficiency (%)", "value": ed["energy_self_sufficiency_pct"]})
    return data

def get_bridge_data():
    bridge = STATIONS[2]
    return bridge.engineering_data

def get_tunnel_data():
    tunnel = STATIONS[1]
    return tunnel.engineering_data

def calculate_commute_time(avg_speed_kmh=30):
    total_km = get_total_distance()
    return round(total_km / avg_speed_kmh * 60, 1)  # minutes

def get_chapter(station_id):
    if 0 <= station_id < len(STATIONS):
        return STATIONS[station_id]
    return None

def get_all_fun_facts():
    return [{"station": s.name, "fact": s.fun_fact, "icon": s.icon} for s in STATIONS]
