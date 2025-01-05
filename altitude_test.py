from yardage_model_enhanced import YardageModelEnhanced, SkillLevel
import json
from typing import Dict, Any, List

def test_altitude_conditions() -> Dict[str, List[Dict[str, Any]]]:
    """Test altitude effects with standard temperature (70°F) and no wind."""
    
    model = YardageModelEnhanced()
    model.set_ball_model("tour_premium")
    results = {}
    
    # Altitude test conditions
    conditions = [
        {
            "name": "Sea Level",
            "altitude": 0
        },
        {
            "name": "Coastal Hills",
            "altitude": 1000
        },
        {
            "name": "Rolling Hills",
            "altitude": 2000
        },
        {
            "name": "Mile High",
            "altitude": 5280
        },
        {
            "name": "Mountain Course",
            "altitude": 6000
        },
        {
            "name": "High Mountain",
            "altitude": 7000
        },
        {
            "name": "Alpine Course",
            "altitude": 8000
        },
        {
            "name": "Low Foothills",
            "altitude": 500
        },
        {
            "name": "Desert Mesa",
            "altitude": 3000
        },
        {
            "name": "High Desert",
            "altitude": 4000
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
                altitude=condition["altitude"],
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
                "altitude": condition["altitude"],
                "carry_distance": result.carry_distance,
                "lateral_movement": result.lateral_movement
            })
        
        results[club_name] = club_results
    
    return results

if __name__ == "__main__":
    results = test_altitude_conditions()
    
    print("\nAltitude Effects Analysis")
    print("Standard Conditions: 70°F, No Wind, Tour Premium Ball\n")
    
    for club, conditions in results.items():
        print(f"\n{club.upper()}:")
        print("-" * 75)
        print(f"{'Condition':<20} {'Altitude':<12} {'Carry(yds)':<12} {'Change(yds)'}")
        print("-" * 75)
        
        # Find sea level result for comparison
        sea_level_carry = next(c["carry_distance"] for c in conditions if c["condition"] == "Sea Level")
        
        for condition in conditions:
            change = condition["carry_distance"] - sea_level_carry
            print(
                f"{condition['condition']:<20} "
                f"{condition['altitude']}ft{' ':<7} "
                f"{condition['carry_distance']:<12.1f} "
                f"{change:+.1f}"
            )
        print()
