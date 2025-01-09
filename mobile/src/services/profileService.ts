import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Club = 
  | 'DRIVER'
  | 'THREE_WOOD'
  | 'FIVE_WOOD'
  | 'FOUR_IRON'
  | 'FIVE_IRON'
  | 'SIX_IRON'
  | 'SEVEN_IRON'
  | 'EIGHT_IRON'
  | 'NINE_IRON'
  | 'PITCHING_WEDGE'
  | 'GAP_WEDGE'
  | 'SAND_WEDGE'
  | 'LOB_WEDGE';

export type ClubDistances = {
  [key in Club]?: number;
};

export interface PlayerProfile {
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
  clubDistances: ClubDistances;
  ballType: string;
  clubOrder: Club[];
}

const mockProfile: PlayerProfile = {
  skillLevel: 'INTERMEDIATE',
  clubDistances: {
    DRIVER: 250,
    THREE_WOOD: 230,
    FIVE_IRON: 180,
    SEVEN_IRON: 160,
    PITCHING_WEDGE: 120,
  },
  ballType: 'TOUR_PREMIUM',
  clubOrder: ['DRIVER', 'THREE_WOOD', 'FIVE_IRON', 'SEVEN_IRON', 'PITCHING_WEDGE'],
};

const PROFILE_STORAGE_KEY = '@golf_profile';

export const usePlayerProfile = () => {
  const [profile, setProfile] = useState<PlayerProfile>(mockProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile from storage
  const loadProfile = useCallback(async () => {
    try {
      const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save profile to storage
  const saveProfile = useCallback(async (updatedProfile: PlayerProfile) => {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (err) {
      setError('Failed to save profile');
      console.error('Error saving profile:', err);
    }
  }, []);

  // Reorder clubs
  const reorderClubs = useCallback(async (fromIndex: number, toIndex: number) => {
    const newOrder = [...profile.clubOrder];
    const [movedClub] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedClub);

    const updatedProfile = {
      ...profile,
      clubOrder: newOrder,
    };

    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Update club distance
  const updateClubDistance = useCallback(async (club: Club, distance: number) => {
    const updatedProfile = {
      ...profile,
      clubDistances: {
        ...profile.clubDistances,
        [club]: distance,
      },
    };

    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Initialize profile
  useState(() => {
    loadProfile();
  });

  return {
    profile,
    loading,
    error,
    reorderClubs,
    updateClubDistance,
  };
};
