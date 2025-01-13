import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { routingInstrumentation } from '../App';

export function Navigation() {
  return (
    <NavigationContainer
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(navigation);
      }}
      onStateChange={(state) => {
        // Optional: Track navigation state changes
        routingInstrumentation.onRouteWillChange({
          name: state?.routes[state.routes.length - 1]?.name,
          properties: {
            route: state?.routes[state.routes.length - 1]?.name,
          },
        });
      }}>
      {/* Your navigation stack */}
    </NavigationContainer>
  );
} 