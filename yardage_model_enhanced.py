import math
from enum import Enum
from dataclasses import dataclass
from typing import Optional, Dict

@dataclass
class ShotResult:
    carry_distance: float  # Adjusted carry distance in yards
    lateral_movement: float  # Lateral movement in yards (+ is right, - is left)

class SkillLevel(Enum):
    BEGINNER = "beginner"      # High HCP (17+)
    INTERMEDIATE = "intermediate"  # Mid HCP (9-16)
    ADVANCED = "advanced"      # Low HCP (0-8)
    PROFESSIONAL = "professional"  # Tour Pro

@dataclass
class BallModel:
    name: str
    compression: int
    speed_factor: float
    spin_factor: float
    temp_sensitivity: float

@dataclass
class ClubData:
    name: str
    ball_speed: float     # Ball speed in mph
    launch_angle: float   # Launch angle in degrees
    spin_rate: float      # Spin rate in rpm
    max_height: float     # Max height in yards
    land_angle: float     # Landing angle in degrees
    spin_decay: float     # Spin decay rate in % per second

class YardageModelEnhanced:
    # PGA Tour average club data from pga-averages.md - only using ball flight characteristics
    CLUB_DATABASE = {
        "driver": ClubData("Driver", 171, 10.4, 2545, 35, 39, 0.08),
        "3-wood": ClubData("3-Wood", 162, 9.3, 3663, 32, 44, 0.09),
        "5-iron": ClubData("5-Iron", 135, 11.9, 5280, 33, 50, 0.11),
        "7-iron": ClubData("7-Iron", 123, 16.1, 7124, 34, 51, 0.12),
        "pitching-wedge": ClubData("Pitching Wedge", 104, 23.7, 9316, 32, 52, 0.15)
    }
    
    # Altitude effects from altitude-effects.md
    ALTITUDE_EFFECTS = {
        0: 1.000,
        1000: 1.021,
        2000: 1.043,
        3000: 1.065,
        4000: 1.088,
        5000: 1.112,
        6000: 1.137,
        7000: 1.163,
        8000: 1.190
    }

    # Ball Models with their characteristics
    BALL_MODELS = {
        "tour_premium": BallModel(
            name="Tour Premium",
            compression=95,
            speed_factor=1.00,  # Baseline ball speed
            spin_factor=1.05,   # +5% spin rate
            temp_sensitivity=0.8 # 20% less temp sensitive
        ),
        "distance": BallModel(
            name="Distance",
            compression=85,
            speed_factor=1.01,  # +1% ball speed vs tour
            spin_factor=0.95,   # -5% spin rate
            temp_sensitivity=1.0 # Standard temp sensitivity
        ),
        "mid_range": BallModel(
            name="Mid Range",
            compression=90,
            speed_factor=0.98,  # -2% vs tour
            spin_factor=1.00,   # Standard spin rate
            temp_sensitivity=1.0 # Standard temp sensitivity
        ),
        "two_piece": BallModel(
            name="Two Piece",
            compression=80,
            speed_factor=0.96,  # -4% vs tour
            spin_factor=0.90,   # -10% spin rate
            temp_sensitivity=1.2 # 20% more temp sensitive
        )
    }

    # Add new temperature effects table from research
    AIR_DENSITY_TABLE = {
        40: 1.06,
        50: 1.04,
        60: 1.02,
        70: 1.00,  # baseline
        80: 0.98,
        90: 0.96,
        100: 0.94
    }

    # Add spin decay rates from research
    SPIN_DECAY_RATES = {
        "driver": 0.08,    # 8% per second
        "3-wood": 0.09,    # 9% per second
        "5-iron": 0.11,    # 11% per second
        "7-iron": 0.12,    # 12% per second
        "pitching-wedge": 0.15  # 15% per second
    }

    def __init__(self):
        self.temperature: Optional[float] = None
        self.altitude: Optional[float] = None
        self.wind_speed: Optional[float] = None
        self.wind_direction: Optional[float] = None
        self.ball_model: str = "mid_range"  # Default to mid-range ball

    def set_conditions(self, temperature: float, altitude: float,
                      wind_speed: float, wind_direction: float):
        """Set environmental conditions for the model."""
        self.temperature = temperature
        self.altitude = altitude
        self.wind_speed = wind_speed
        self.wind_direction = wind_direction

    def set_ball_model(self, model: str):
        """Set the ball model being used."""
        if model not in self.BALL_MODELS:
            raise ValueError(f"Unknown ball model: {model}")
        self.ball_model = model

    def _calculate_wind_gradient(self, height_ft: float) -> float:
        """Calculate wind multiplier based on shot height."""
        if height_ft <= 10:
            return 0.75
        elif height_ft <= 50:
            return 0.85
        elif height_ft <= 100:
            return 1.0
        elif height_ft <= 150:
            return 1.15
        else:
            return 1.25

    def _calculate_altitude_effect(self, altitude: float) -> float:
        """Get exact altitude effect from research data."""
        alts = sorted(self.ALTITUDE_EFFECTS.keys())
        for i in range(len(alts) - 1):
            if alts[i] <= altitude <= alts[i + 1]:
                alt1, alt2 = alts[i], alts[i + 1]
                effect1, effect2 = self.ALTITUDE_EFFECTS[alt1], self.ALTITUDE_EFFECTS[alt2]
                ratio = (altitude - alt1) / (alt2 - alt1)
                return effect1 + (effect2 - effect1) * ratio
        return 1.0

    def _calculate_air_density(self, temperature: float) -> float:
        """Calculate air density factor based on temperature."""
        temps = sorted(self.AIR_DENSITY_TABLE.keys())
        for i in range(len(temps) - 1):
            if temps[i] <= temperature <= temps[i + 1]:
                temp1, temp2 = temps[i], temps[i + 1]
                density1 = self.AIR_DENSITY_TABLE[temp1]
                density2 = self.AIR_DENSITY_TABLE[temp2]
                ratio = (temperature - temp1) / (temp2 - temp1)
                return density1 + (density2 - density1) * ratio
        return 1.0  # Default to baseline if out of range

    def _calculate_spin_decay(self, club: str, initial_spin: float, flight_time: float) -> float:
        """Calculate average spin rate accounting for non-linear decay."""
        decay_rate = self.SPIN_DECAY_RATES[club]
        # Using research model: average spin = initial_spin * (1 - decay_rate * time/2)
        return initial_spin * (1 - decay_rate * flight_time/2)

    def calculate_adjusted_yardage(self, target_yardage: float,
                                 skill_level: SkillLevel,
                                 club: str) -> ShotResult:
        """Calculate the adjusted yardage with enhanced temperature and spin effects."""
        if club.lower() not in self.CLUB_DATABASE:
            raise ValueError(f"Unknown ball model: {club}")

        club_data = self.CLUB_DATABASE[club.lower()]
        ball = self.BALL_MODELS[self.ball_model]
        
        # Start with target yardage
        adjusted_yardage = target_yardage
        
        # Apply ball speed effect
        adjusted_yardage *= ball.speed_factor
        
        # Calculate flight time with ball speed factor
        gravity = 32.2  # ft/s²
        initial_velocity_fps = club_data.ball_speed * 1.467 * ball.speed_factor  # mph to ft/s
        launch_rad = math.radians(club_data.launch_angle)
        flight_time = (2 * initial_velocity_fps * math.sin(launch_rad)) / gravity
        
        # Enhanced temperature effects
        if self.temperature:
            # Air density effect
            air_density_factor = self._calculate_air_density(self.temperature)
            # Ball temperature effect (from research)
            ball_temp_effect = 1 + ((self.temperature - 70) * 0.003 * ball.temp_sensitivity)
            # Combined temperature effect
            temp_effect = (2 * ball_temp_effect + air_density_factor) / 3  # Weighted average
            adjusted_yardage *= temp_effect
        
        # Altitude effects with enhanced spin
        if self.altitude:
            altitude_effect = self._calculate_altitude_effect(self.altitude)
            # Calculate spin with decay
            initial_spin = club_data.spin_rate * ball.spin_factor
            average_spin = self._calculate_spin_decay(club.lower(), initial_spin, flight_time)
            # Apply altitude effect directly (spin is already accounted for in the altitude table)
            adjusted_yardage *= altitude_effect
        
        # Wind effects
        lateral_movement = 0.0
        if self.wind_speed and self.wind_direction is not None:
            # Convert wind direction to radians (0° is headwind, 180° is tailwind)
            wind_rad = math.radians(self.wind_direction)
            distance_factor = adjusted_yardage / 300  # Normalize to driver distance
            
            # Ball speed affects time in air for given distance
            speed_factor = math.sqrt(171 / (club_data.ball_speed * ball.speed_factor))
            height_factor = club_data.max_height / 35
            
            wind_multiplier = self._calculate_wind_gradient(club_data.max_height * 3)
            effective_wind = self.wind_speed * wind_multiplier
            
            # Calculate head/tail wind effect
            wind_factor = math.cos(wind_rad)  # +1 for headwind (0°), -1 for tailwind (180°)
            
            # Headwinds have 1.5x effect, tailwinds 1x (based on research)
            if wind_factor > 0:  # Headwind
                wind_factor *= 1.5  # Increase headwind by 50%
                
            head_tail_effect = effective_wind * wind_factor * distance_factor * speed_factor * 1.2
            
            # Height affects wind impact
            height_effect = math.sqrt(club_data.max_height / 35)  # Normalized to driver height
            head_tail_effect *= height_effect
            
            # Apply head/tail wind effect
            adjusted_yardage -= head_tail_effect  # Subtract because headwind (negative wind_factor) should reduce distance
            
            # Calculate crosswind effect (90° is right to left, 270° is left to right)
            cross_factor = math.sin(wind_rad)
            cross_wind_effect = effective_wind * cross_factor * 0.35
            lateral_base = (cross_wind_effect * distance_factor * speed_factor) * 3.0
            
            # Apply club characteristics as modifiers
            spin_factor = math.sqrt((club_data.spin_rate * ball.spin_factor) / 2545)
            loft_factor = math.sqrt(club_data.launch_angle / 10.4)
            
            lateral_movement = lateral_base * (1 + (spin_factor + loft_factor - 2) * 0.2)

        return ShotResult(
            carry_distance=round(adjusted_yardage, 1),
            lateral_movement=round(lateral_movement, 1)
        )
