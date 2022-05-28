import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

function Map() {
  const region = {
    latitude: 63.410601,
    longitude: 10.413305,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return <MapView style={styles.map} initialRegion={region}></MapView>;
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default Map;
