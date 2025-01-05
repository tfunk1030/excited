from yardage_model_enhanced import YardageModelEnhanced, SkillLevel
import json
from typing import Dict, Any, List

def test_wind_conditions() -> Dict[str, List[Dict[str, Any]]]:
    """Test wind effects with standard temperature (70°F) and sea level altitude."""
    
    model = YardageModelEnhanced()
    model.set_ball_model("tour_premium")
    results = {}
    
    # Wind test conditions
    conditions = [
        {
            "name": "No Wind",
            "speed": 0,
            "direction": 0
        },
        {
            "name": "Light Helping",
            "speed": 5,
            "direction": 180
        },
        {
            "name": "Strong Helping",
            "speed": 15,
            "direction": 180
        },
        {
            "name": "Light Quartering",
            "speed": 5,
            "direction": 135
        },
        {
            "name": "Strong Quartering",
            "speed": 15,
            "direction": 135
        },
        {
            "name": "Light Crosswind",
            "speed": 5,
            "direction": 90
        },
        {
            "name": "Strong Crosswind",
            "speed": 15,
            "direction": 90
        },
        {
            "name": "Light Into Quarter",
            "speed": 5,
            "direction": 45
        },
        {
            "name": "Strong Into Quarter",
            "speed": 15,
            "direction": 45
        },
        {
            "name": "Direct Headwind",
            "speed": 15,
            "direction": 0
        }
    ]
    
    clubs = {
        "driver": 300,
        "7-iron": 180,
        "pitching-wedge": 140
    }
    
    for club_name, target_distance in clubs.items():
        club_results = []
        for condition in conditions:
            model.set_conditions(
                temperature=70,  # Standard temperature
                altitude=0,     # Sea level
                wind_speed=condition["speed"],
                wind_direction=condition["direction"]
            )
            
            result = model.calculate_adjusted_yardage(
                target_yardage=target_distance,
                skill_level=SkillLevel.PROFESSIONAL,
                club=club_name
            )
            
            club_results.append({
                "condition": condition["name"],
                "wind": f"{condition['speed']}mph at {condition['direction']}°",
                "carry_distance": result.carry_distance,
                "lateral_movement": result.lateral_movement
            })
        
        results[club_name] = club_results
    
    return results

if __name__ == "__main__":
    results = test_wind_conditions()
    
    print("\nWind Effects Analysis")
    print("Standard Conditions: 70°F, Sea Level, Tour Premium Ball\n")
    
    for club, conditions in results.items():
        print(f"\n{club.upper()}:")
        print("-" * 80)
        print(f"{'Condition':<20} {'Wind':<15} {'Carry(yds)':<12} {'Lateral(yds)'}")
        print("-" * 80)
        
        for condition in conditions:
            print(
                f"{condition['condition']:<20} "
                f"{condition['wind']:<15} "
                f"{condition['carry_distance']:<12.1f} "
                f"{condition['lateral_movement']:+.1f}"
            )
        print()
