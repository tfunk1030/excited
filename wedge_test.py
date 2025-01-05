from yardage_model_enhanced import YardageModelEnhanced, SkillLevel
import json
from typing import Dict, Any, List, Tuple

def test_wedge_conditions() -> Dict[str, List[Dict[str, Any]]]:
    """Test pitching wedge performance in various realistic golf conditions."""
    
    model = YardageModelEnhanced()
    model.set_ball_model("tour_premium")  # Using tour ball for consistency
    results = {}
    
    # Common weather scenarios on golf courses
    conditions = [
        {
            "name": "Dewy Morning",
            "temp": 55,
            "altitude": 0,
            "wind_speed": 0,
            "wind_dir": 0  # Calm
        },
        {
            "name": "Afternoon Breeze",
            "temp": 78,
            "altitude": 0,
            "wind_speed": 8,
            "wind_dir": 45  # Quartering helping
        },
        {
            "name": "Mountain Green",
            "temp": 68,
            "altitude": 4500,
            "wind_speed": 12,
            "wind_dir": 180  # Into wind
        },
        {
            "name": "Links Course",
            "temp": 62,
            "altitude": 0,
            "wind_speed": 22,
            "wind_dir": 90  # Full crosswind
        },
        {
            "name": "Desert Approach",
            "temp": 95,
            "altitude": 2500,
            "wind_speed": 15,
            "wind_dir": 135  # Quartering into
        },
        {
            "name": "Calm Evening",
            "temp": 70,
            "altitude": 0,
            "wind_speed": 5,
            "wind_dir": 270  # Left to right
        },
        {
            "name": "High Altitude",
            "temp": 58,
            "altitude": 7000,
            "wind_speed": 8,
            "wind_dir": 225  # Quartering into
        },
        {
            "name": "Coastal Morning",
            "temp": 65,
            "altitude": 0,
            "wind_speed": 18,
            "wind_dir": 315  # Quartering helping
        },
        {
            "name": "Hot Approach",
            "temp": 92,
            "altitude": 1000,
            "wind_speed": 10,
            "wind_dir": 160  # Into and left
        },
        {
            "name": "Light Drizzle",
            "temp": 61,
            "altitude": 0,
            "wind_speed": 12,
            "wind_dir": 200  # Into and right
        }
    ]
    
    for skill in [SkillLevel.PROFESSIONAL, SkillLevel.ADVANCED, SkillLevel.INTERMEDIATE]:
        skill_results = []
        for condition in conditions:
            model.set_conditions(
                temperature=condition["temp"],
                altitude=condition["altitude"],
                wind_speed=condition["wind_speed"],
                wind_direction=condition["wind_dir"]
            )
            
            result = model.calculate_adjusted_yardage(
                target_yardage=140,  # Base pitching wedge distance
                skill_level=skill,
                club="pitching-wedge"
            )
            
            skill_results.append({
                "condition": condition["name"],
                "temperature": condition["temp"],
                "altitude": condition["altitude"],
                "wind": f"{condition['wind_speed']}mph at {condition['wind_dir']}°",
                "carry_distance": result.carry_distance,
                "lateral_movement": result.lateral_movement
            })
        
        results[skill.value] = skill_results
    
    return results

if __name__ == "__main__":
    results = test_wedge_conditions()
    
    print("\nPitching Wedge Performance Analysis\n")
    print("Ball Type: Tour Premium\n")
    
    for skill_level, conditions in results.items():
        print(f"\n{skill_level.upper()} SKILL LEVEL:")
        print("-" * 100)
        print(f"{'Condition':<20} {'Temp':<8} {'Alt(ft)':<8} {'Wind':<15} {'Carry(yds)':<12} {'Lateral(yds)'}")
        print("-" * 100)
        
        for condition in conditions:
            print(
                f"{condition['condition']:<20} "
                f"{condition['temperature']}°F{' ':<4} "
                f"{condition['altitude']:<8} "
                f"{condition['wind']:<15} "
                f"{condition['carry_distance']:<12.1f} "
                f"{condition['lateral_movement']:+.1f}"
            )
        print()
