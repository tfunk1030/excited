declare module '@react-native-community/geolocation' {
  export interface Coordinates {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  }

  export interface Position {
    coords: Coordinates;
    timestamp: number;
  }

  export interface PositionError {
    code: number;
    message: string;
    PERMISSION_DENIED: number;
    POSITION_UNAVAILABLE: number;
    TIMEOUT: number;
  }

  interface GeoConfiguration {
    skipPermissionRequests?: boolean;
    authorizationLevel?: 'always' | 'whenInUse' | 'auto';
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    distanceFilter?: number;
  }

  interface GeoOptions {
    timeout?: number;
    maximumAge?: number;
    enableHighAccuracy?: boolean;
    distanceFilter?: number;
    useSignificantChanges?: boolean;
  }

  const Geolocation: {
    requestAuthorization(): void;
    getCurrentPosition(
      success: (position: Position) => void,
      error?: (error: PositionError) => void,
      options?: GeoOptions
    ): void;
    watchPosition(
      success: (position: Position) => void,
      error?: (error: PositionError) => void,
      options?: GeoOptions
    ): number;
    clearWatch(watchID: number): void;
    stopObserving(): void;
    setRNConfiguration(config: GeoConfiguration): void;
  };

  export default Geolocation;
}
