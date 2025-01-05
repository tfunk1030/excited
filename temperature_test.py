from yardage_model_enhanced import YardageModelEnhanced, SkillLevel
import json
from typing import Dict, Any, List

def test_temperature_conditions() -> Dict[str, List[Dict[str, Any]]]:
    """Test temperature effects with no wind and sea level altitude."""
    
    model = YardageModelEnhanced()
    model.set_ball_model("tour_premium")
    results = {}
    
    # Temperature test conditions
    conditions = [
        {
            "name": "Very Cold",
            "temp": 40
        },
        {
            "name": "Cold",
            "temp": 50
        },
        {
            "name": "Cool Morning",
            "temp": 60
        },
        {
            "name": "Standard",
            "temp": 70
        },
        {
            "name": "Warm",
            "temp": 80
        },
        {
            "name": "Hot",
            "temp": 90
        },
        {
            "name": "Very Hot",
            "temp": 100
        },
        {
            "name": "Desert Hot",
            "temp": 105
        },
        {
            "name": "Early Morning",
            "temp": 45
        },
        {
            "name": "Late Evening",
            "temp": 65
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
                temperature=condition["temp"],
                altitude=0,     # Sea level
                wind_speed=0,   # No wind
                wind_direction=0
            )
            
            result = model.calculate_adjusted_yardage(
                target_yardage=target_distance,
                skill_level=SkillLevel.PROFESSIONAL,
                club=club_name
            )
            
            club_results.append({
                "condition": condition["name"],
                "temperature": condition["temp"],
                "carry_distance": result.carry_distance,
                "lateral_movement": result.lateral_movement
            })
        
        results[club_name] = club_results
    
    return results

if __name__ == "__main__":
    results = test_temperature_conditions()
    
    print("\nTemperature Effects Analysis")
    print("Standard Conditions: No Wind, Sea Level, Tour Premium Ball\n")
    
    for club, conditions in results.items():
        print(f"\n{club.upper()}:")
        print("-" * 75)
        print(f"{'Condition':<20} {'Temperature':<12} {'Carry(yds)':<12} {'Change(yds)'}")
        print("-" * 75)
        
        # Find standard temperature result for comparison
        standard_carry = next(c["carry_distance"] for c in conditions if c["condition"] == "Standard")
        
        for condition in conditions:
            change = condition["carry_distance"] - standard_carry
            print(
                f"{condition['condition']:<20} "
                f"{condition['temperature']}°F{' ':<8} "
                f"{condition['carry_distance']:<12.1f} "
                f"{change:+.1f}"
            )
        print()
