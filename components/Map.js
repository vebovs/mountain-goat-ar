import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

function Map() {
  const region = {
    latitude: 63.410601,
    longitude: 10.413305,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapView style={styles.map} initialRegion={region}>
      <Polyline
        coordinates={[
          { latitude: 63.411355, longitude: 10.412751 },
          { latitude: 63.409668, longitude: 10.413062 },
        ]}
        strokeColor="red"
        strokeWidth={6}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default Map;
