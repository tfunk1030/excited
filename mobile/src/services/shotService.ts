import { useState, useCallback } from 'react';
import { WeatherData } from './weatherService';
import { PlayerProfile } from './profileService';

export interface ShotResult {
  club: string;
  adjustedDistance: number;
  direction: string;
  environmentalFactors: {
    temperature: number;
    wind: number;
    altitude: number;
  };
  alternatives: {
    club: string;
    adjustedDistance: number;
    reason: string;
  }[];
}

export const useShotCalculator = () => {
  const [result, setResult] = useState<ShotResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (
    targetDistance: number,
    profile: PlayerProfile,
    conditions: WeatherData
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock calculation result
      const mockResult: ShotResult = {
        club: '7-Iron',
        adjustedDistance: targetDistance - 2,
        direction: '5',
        environmentalFactors: {
          temperature: 2.1,
          wind: -1.3,
          altitude: 3.0,
        },
        alternatives: [
          {
            club: '6-Iron',
            adjustedDistance: targetDistance + 10,
            reason: 'More control in wind',
          },
          {
            club: '8-Iron',
            adjustedDistance: targetDistance - 15,
            reason: 'Better accuracy',
          },
        ],
      };

      setResult(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate shot');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectClub = useCallback((club: string) => {
    if (!result) return;

    // Find the selected club in alternatives
    const selectedClub = result.alternatives.find(alt => alt.club === club);
    if (!selectedClub) return;

    // Update the result with the selected club as primary
    setResult({
      ...result,
      club: selectedClub.club,
      adjustedDistance: selectedClub.adjustedDistance,
      alternatives: [
        {
          club: result.club,
          adjustedDistance: result.adjustedDistance,
          reason: 'Previous selection',
        },
        ...result.alternatives.filter(alt => alt.club !== club),
      ],
    });
  }, [result]);

  return {
    result,
    loading,
    error,
    calculate,
    selectClub,
  };
};
