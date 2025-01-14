import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UnitOption {
  label: string;
  value: string;
}

interface UnitSelectorProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  options: UnitOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

interface ClubInput {
  name: string;
  distance: string;
  loft: string;
}

function UnitSelector({ icon, label, options, selectedValue, onSelect }: UnitSelectorProps) {
  return (
    <View style={styles.unitSelector}>
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={24} color="#B0B0B0" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selectedValue === option.value && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const [distanceUnit, setDistanceUnit] = useState('yards');
  const [temperatureUnit, setTemperatureUnit] = useState('fahrenheit');
  const [altitudeUnit, setAltitudeUnit] = useState('feet');
  const [clubInput, setClubInput] = useState<ClubInput>({
    name: '',
    distance: '',
    loft: ''
  });

  const handleAddClub = () => {
    // Validate inputs
    if (!clubInput.name.trim()) {
      // Show error: Name required
      return;
    }

    const distance = Number(clubInput.distance);
    if (isNaN(distance) || distance <= 0) {
      // Show error: Valid distance required
      return;
    }

    const loft = Number(clubInput.loft);
    if (isNaN(loft) || loft < 0 || loft > 90) {
      // Show error: Valid loft required (0-90 degrees)
      return;
    }

    // TODO: Add club to storage
    // Reset form
    setClubInput({
      name: '',
      distance: '',
      loft: ''
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Unit Preferences</Text>
        
        <UnitSelector
          icon="resize-outline"
          label="Distance Unit"
          options={[
            { label: 'Yards', value: 'yards' },
            { label: 'Meters', value: 'meters' },
          ]}
          selectedValue={distanceUnit}
          onSelect={setDistanceUnit}
        />

        <UnitSelector
          icon="thermometer-outline"
          label="Temperature Unit"
          options={[
            { label: 'Celsius', value: 'celsius' },
            { label: 'Fahrenheit', value: 'fahrenheit' },
          ]}
          selectedValue={temperatureUnit}
          onSelect={setTemperatureUnit}
        />

        <UnitSelector
          icon="trending-up-outline"
          label="Altitude Unit"
          options={[
            { label: 'Meters', value: 'meters' },
            { label: 'Feet', value: 'feet' },
          ]}
          selectedValue={altitudeUnit}
          onSelect={setAltitudeUnit}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Club Management</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Club Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Driver"
            placeholderTextColor="#B0B0B0"
            value={clubInput.name}
            onChangeText={(text) => setClubInput(prev => ({ ...prev, name: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Normal Distance (yards)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#B0B0B0"
            keyboardType="numeric"
            value={clubInput.distance}
            onChangeText={(text) => setClubInput(prev => ({ ...prev, distance: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Loft (degrees)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#B0B0B0"
            keyboardType="numeric"
            value={clubInput.loft}
            onChangeText={(text) => setClubInput(prev => ({ ...prev, loft: text }))}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddClub}>
          <Text style={styles.addButtonText}>Add Club</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2E',
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#252B3D',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  unitSelector: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    backgroundColor: '#1A1F2E',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1F2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});