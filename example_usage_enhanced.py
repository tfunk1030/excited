import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from yardage_model_enhanced import YardageModelEnhanced, SkillLevel
import json
from typing import Dict, Any

def run_test_scenarios() -> Dict[str, Any]:
    """Run various test scenarios to demonstrate the enhanced yardage model features"""
    
    # Initialize model
    model = YardageModelEnhanced()
    
    # Test different ball types in various conditions
    results = {
        "ball_comparison": {},
        "temperature_effects": {},
        "spin_effects": {}
    }
    
    # 1. Ball Construction Test
    # Standard conditions: 70°F, sea level, no wind
    model.set_conditions(temperature=70, altitude=0, wind_speed=0, wind_direction=0)
    
    for ball_type in ["tour_premium", "distance", "mid_range", "two_piece"]:
        model.set_ball_model(ball_type)
        driver_result = model.calculate_adjusted_yardage(
            target_yardage=250,
            skill_level=SkillLevel.ADVANCED,
            club="driver"
        )
        results["ball_comparison"][ball_type] = {
            "carry_distance": driver_result.carry_distance,
            "lateral_movement": driver_result.lateral_movement
        }
    
    # 2. Temperature Impact Test
    # Test tour premium ball at different temperatures
    model.set_ball_model("tour_premium")
    for temp in [40, 70, 100]:
        model.set_conditions(temperature=temp, altitude=0, wind_speed=0, wind_direction=0)
        result = model.calculate_adjusted_yardage(
            target_yardage=250,
            skill_level=SkillLevel.ADVANCED,
            club="driver"
        )
        results["temperature_effects"][f"{temp}F"] = {
            "carry_distance": result.carry_distance,
            "lateral_movement": result.lateral_movement
        }
    
    # 3. Spin Effects Test
    # Test different clubs with tour premium ball
    model.set_conditions(temperature=70, altitude=1000, wind_speed=10, wind_direction=45)
    clubs = ["driver", "7-iron", "pitching-wedge"]
    for club in clubs:
        result = model.calculate_adjusted_yardage(
            target_yardage=200 if club == "driver" else 150 if club == "7-iron" else 100,
            skill_level=SkillLevel.ADVANCED,
            club=club
        )
        results["spin_effects"][club] = {
            "carry_distance": result.carry_distance,
            "lateral_movement": result.lateral_movement
        }
    
    return results

if __name__ == "__main__":
    # Run tests and print results
    results = run_test_scenarios()
    print("\nTest Results:")
    print(json.dumps(results, indent=2))
    
    # Example interpretation
    print("\nKey Findings:")
    print("1. Ball Construction Impact:")
    tour_dist = results["ball_comparison"]["tour_premium"]["carry_distance"]
    value_dist = results["ball_comparison"]["two_piece"]["carry_distance"]
    print(f"  - Tour Premium vs Two-Piece difference: {tour_dist - value_dist:.1f} yards")
    
    print("\n2. Temperature Impact (Tour Premium ball):")
    cold_dist = results["temperature_effects"]["40F"]["carry_distance"]
    hot_dist = results["temperature_effects"]["100F"]["carry_distance"]
    print(f"  - Cold (40F) vs Hot (100F) difference: {hot_dist - cold_dist:.1f} yards")
    
    print("\n3. Spin Effects (10mph wind at 45°):")
    for club in ["driver", "7-iron", "pitching-wedge"]:
        lat_move = results["spin_effects"][club]["lateral_movement"]
        print(f"  - {club}: {abs(lat_move):.1f} yards of curve")
