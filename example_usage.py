from yardage_model import YardageModel, SkillLevel

def test_conditions(model, conditions_desc):
    print(f"\nTesting conditions: {conditions_desc}")
    print("\nClub            Target    Adjusted   Lateral")
    print("            Yardage    Yardage  Movement")
    print("-" * 45)
    
    # Test scenarios with different target yardages for each club
    test_shots = [
        ("driver", 300),       # Driver for 250
        ("3-wood", 260),       # 3-wood for 220
        ("5-iron", 200),       # 5-iron for 180
        ("7-iron", 180),       # 7-iron for 155
        ("pitching-wedge", 140) # PW for 120
    ]
    
    for club, target in test_shots:
        result = model.calculate_adjusted_yardage(
            target_yardage=target,
            skill_level=SkillLevel.PROFESSIONAL,  # Kept for API compatibility
            club=club
        )
        lateral_direction = "right" if result.lateral_movement >= 0 else "left"
        if abs(result.lateral_movement) > 0.1:
            lateral_str = f"{abs(result.lateral_movement):.1f} {lateral_direction}"
        else:
            lateral_str = "0.0"
        print(f"{club:<15} {target:>4.0f}      {result.carry_distance:>5.1f}    {lateral_str:>8}")

def main():
    # Initialize the model
    model = YardageModel()
    
    # Test Scenario 1: Denver conditions (5280 ft)
    model.set_conditions(
        temperature=70.0,    # Normal temp
        altitude=5280.0,     # Mile high
        wind_speed=0.0,      # No wind
        wind_direction=0.0
    )
    
    test_conditions(
        model,
        conditions_desc="Denver altitude (5280 ft), no wind"
    )
    
    # Test Scenario 2: 15mph quartering headwind
    model.set_conditions(
        temperature=70.0,    # Normal temp
        altitude=0.0,        # Sea level
        wind_speed=10.0,     # Strong wind
        wind_direction=135.0 # Quartering headwind
    )
    
    test_conditions(
        model,
        conditions_desc="Sea level, 10mph quartering headwind (135°)"
    )
    
    # Test Scenario 3: Light right-to-left wind
    model.set_conditions(
        temperature=70.0,    # Normal temp
        altitude=0.0,        # Sea level
        wind_speed=10.0,      # Light wind
        wind_direction=90.0  # Wind from right
    )
    
    test_conditions(
        model,
        conditions_desc="Sea level, 10mph wind from right (90°)"
    )

if __name__ == "__main__":
    main()
