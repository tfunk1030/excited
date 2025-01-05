# Weather API Integration for Golf Shot Calculator

## Overview
Automated weather and environmental data collection to minimize user inputs and improve accuracy.

## Core Components

### 1. Weather Service (Tomorrow.io)
```python
class WeatherService:
    def __init__(self):
        self.api_key = "YOUR_API_KEY"
        self.base_url = "https://api.tomorrow.io/v4/weather/realtime"
        self.update_interval = 300  # 5 minutes

    async def get_weather(self, lat: float, lon: float):
        params = {
            "location": f"{lat},{lon}",
            "fields": [
                "temperature",
                "windSpeed",
                "windDirection",
                "humidity",
                "precipitationIntensity",
                "pressureSurfaceLevel"
            ]
        }
        return await self._make_api_call(params)
```

### 2. Elevation Service
```python
class ElevationService:
    def __init__(self):
        self.providers = {
            "primary": "open-elevation",    # Free
            "backup": "google-maps"         # Paid backup
        }

    async def get_elevation(self, lat: float, lon: float):
        try:
            return await self._query_elevation(lat, lon)
        except:
            return await self._query_backup_elevation(lat, lon)
```

### 3. Environmental Manager
```python
class EnvironmentalManager:
    def __init__(self):
        self.weather_service = WeatherService()
        self.elevation_service = ElevationService()
        self.cache_duration = 300  # 5 minutes
        self.cache = {}

    async def get_conditions(self, lat: float, lon: float):
        if self._is_cache_valid():
            return self.cache["conditions"]

        weather = await self.weather_service.get_weather(lat, lon)
        elevation = await self.elevation_service.get_elevation(lat, lon)

        conditions = {
            "temperature": weather.temperature,
            "wind_speed": weather.windSpeed,
            "wind_direction": weather.windDirection,
            "altitude": elevation,
            "humidity": weather.humidity,
            "precipitation": weather.precipitationIntensity,
            "pressure": weather.pressureSurfaceLevel
        }

        self._update_cache(conditions)
        return conditions
```

## API Usage & Costs

### Tomorrow.io
- Free Tier: 500 calls/day
- Basic Plan ($99/month):
  - 10,000 calls/day
  - Real-time updates
  - More data fields

### Elevation APIs
1. Open-Elevation (Primary)
   - Free
   - No API key required
   - Rate limit: 1000/day

2. Google Maps Elevation (Backup)
   - $5 per 1000 requests
   - More reliable
   - Higher rate limits

## Data Caching Strategy
```python
class WeatherCache:
    def __init__(self):
        self.data = {}
        self.last_update = None
        self.cache_duration = 300  # 5 minutes

    def is_valid(self):
        if not self.last_update:
            return False
        return (time.time() - self.last_update) < self.cache_duration

    def update(self, conditions):
        self.data = conditions
        self.last_update = time.time()
```

## Offline Mode
```python
class OfflineManager:
    def __init__(self):
        self.last_known_conditions = None
        self.offline_mode = False

    def handle_connection_loss(self):
        self.offline_mode = True
        return self.last_known_conditions

    def restore_online_mode(self):
        self.offline_mode = False
```

## Integration with YardageModel
```python
class YardageModel:
    def __init__(self):
        self.env_manager = EnvironmentalManager()
        self.offline_manager = OfflineManager()

    async def update_conditions(self, lat: float, lon: float):
        try:
            conditions = await self.env_manager.get_conditions(lat, lon)
            self.offline_manager.last_known_conditions = conditions
            return conditions
        except ConnectionError:
            return self.offline_manager.handle_connection_loss()
```

## Implementation Steps

1. Initial Setup
   - Obtain API keys
   - Set up error handling
   - Configure caching

2. Location Services
   - Implement GPS integration
   - Handle permission requests
   - Set up location caching

3. Data Management
   - Implement caching system
   - Set up offline mode
   - Configure update intervals

4. Error Handling
   - API failures
   - Connection issues
   - Location service failures

## Performance Considerations
- Cache weather data for 5 minutes
- Cache elevation data for 24 hours
- Implement request throttling
- Use compression for API responses
- Minimize battery impact

## Battery Usage Optimization
- Reduce GPS polling frequency
- Use network location when possible
- Implement adaptive update intervals
- Cache aggressively

## Security Considerations
- Secure API key storage
- Encrypt cached data
- Handle user location privacy
- Implement SSL pinning
