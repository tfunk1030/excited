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
class ClubData:
    name: str
    ball_speed: float     # Ball speed in mph
    launch_angle: float   # Launch angle in degrees
    spin_rate: float      # Spin rate in rpm
    max_height: float     # Max height in yards
    land_angle: float     # Landing angle in degrees
    spin_decay: float     # Spin decay rate in % per second

class YardageModel:
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

    def __init__(self):
        self.temperature: Optional[float] = None
        self.altitude: Optional[float] = None
        self.wind_speed: Optional[float] = None
        self.wind_direction: Optional[float] = None

    def set_conditions(self, temperature: float, altitude: float,
                      wind_speed: float, wind_direction: float):
        """Set environmental conditions for the model."""
        self.temperature = temperature
        self.altitude = altitude
        self.wind_speed = wind_speed
        self.wind_direction = wind_direction

    def _calculate_wind_gradient(self, height_ft: float) -> float:
        """Calculate wind multiplier based on shot height per wind-effects.md"""
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
        """Get exact altitude effect from research data"""
        # Find the two closest altitude points and interpolate
        alts = sorted(self.ALTITUDE_EFFECTS.keys())
        for i in range(len(alts) - 1):
            if alts[i] <= altitude <= alts[i + 1]:
                alt1, alt2 = alts[i], alts[i + 1]
                effect1, effect2 = self.ALTITUDE_EFFECTS[alt1], self.ALTITUDE_EFFECTS[alt2]
                # Linear interpolation
                ratio = (altitude - alt1) / (alt2 - alt1)
                return effect1 + (effect2 - effect1) * ratio
        return 1.0  # Default if altitude is out of range

    def calculate_adjusted_yardage(self, target_yardage: float,
                                 skill_level: SkillLevel,
                                 club: str) -> ShotResult:
        """
        Calculate the adjusted yardage and lateral movement based on research data.
        """
        if club.lower() not in self.CLUB_DATABASE:
            raise ValueError(f"Unknown club: {club}")

        club_data = self.CLUB_DATABASE[club.lower()]
        
        # Start with target yardage
        adjusted_yardage = target_yardage
        
        # Calculate flight time more accurately
        # t = 2v0*sin(θ)/g where v0 is initial velocity, θ is launch angle
        gravity = 32.2  # ft/s²
        initial_velocity_fps = club_data.ball_speed * 1.467  # mph to ft/s
        flight_time = (2 * initial_velocity_fps * math.sin(math.radians(club_data.launch_angle))) / gravity
        
        # Time at max height is half of total flight time
        time_to_apex = flight_time / 2
        
        # Altitude effects
        if self.altitude:
            altitude_effect = self._calculate_altitude_effect(self.altitude)
            # Reduced spin maintenance at altitude
            spin_reduction = 1 - (self.altitude / 10000)  # 10% reduction per 10000ft
            adjusted_yardage *= altitude_effect
        
        # Wind effects
        lateral_movement = 0.0
        if self.wind_speed and self.wind_direction:
            wind_rad = math.radians(self.wind_direction)
            
            # Calculate flight time based on target distance and ball speed
            # Time is primarily determined by how far the ball needs to go
            distance_factor = adjusted_yardage / 300  # Normalize to 300 yard shot
            
            # Ball speed affects time in air for given distance
            # Faster ball speed = less time in air = less wind effect
            speed_factor = math.sqrt(171 / club_data.ball_speed)  # Normalize to driver speed, square root to reduce effect
            
            # Height affects wind strength due to gradient
            height_factor = club_data.max_height / 35  # Normalize to driver height
            
            # Calculate effective wind based on height
            wind_multiplier = self._calculate_wind_gradient(club_data.max_height * 3)
            effective_wind = self.wind_speed * wind_multiplier
            
            # Headwind/tailwind component
            wind_factor = math.cos(wind_rad)
            # Base effect is primarily distance-based
            # Increase base effect to ~1.5 yards per mph
            head_tail_effect = effective_wind * abs(wind_factor) * distance_factor * speed_factor * 2.1
            
            # Apply turbulence reduction (more for higher shots)
            turbulence_reduction = 0.05 + (0.10 * height_factor)
            head_tail_effect *= (1 - turbulence_reduction)
            
            # Apply headwind/tailwind effect
            if abs(wind_rad) > math.pi/2:
                adjusted_yardage -= head_tail_effect
            else:
                adjusted_yardage += head_tail_effect
            
            # Crosswind component
            cross_factor = math.sin(wind_rad)
            cross_wind_effect = effective_wind * cross_factor * 0.35
            
            # Calculate lateral movement primarily based on distance
            # Club characteristics (spin, launch) are secondary effects
            lateral_base = (cross_wind_effect * distance_factor * speed_factor) * 3.0
            
            # Apply club characteristics as modifiers
            spin_factor = math.sqrt(club_data.spin_rate / 2545)  # Reduced effect of spin
            loft_factor = math.sqrt(club_data.launch_angle / 10.4)  # Reduced effect of loft
            
            lateral_movement = lateral_base * (1 + (spin_factor + loft_factor - 2) * 0.2)  # Club effects only modify by ±20%
        
        return ShotResult(
            carry_distance=round(adjusted_yardage, 1),
            lateral_movement=round(lateral_movement, 1)
        )

    def get_optimal_club(self, target_yardage: float,
                        skill_level: SkillLevel) -> str:
        """
        Recommend the optimal club for the target yardage.
        Note: skill_level parameter kept for API compatibility but not used.
        
        Args:
            target_yardage: The desired carry distance in yards
            skill_level: Player's skill level (not used in calculation)
            
        Returns:
            str: Recommended club name
        """
        min_diff = float('inf')
        optimal_club = None
        
        for club_name in self.CLUB_DATABASE:
            result = self.calculate_adjusted_yardage(
                target_yardage=target_yardage,
                skill_level=skill_level,  # Kept for API compatibility
                club=club_name
            )
            diff = abs(target_yardage - result.carry_distance)
            
            if diff < min_diff:
                min_diff = diff
                optimal_club = club_name
                
        return optimal_club
