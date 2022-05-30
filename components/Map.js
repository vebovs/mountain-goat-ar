import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Polyline, Circle } from 'react-native-maps';

import Node from '../util/Node';

function Map() {
  const [nodes, setNodes] = useState([]);

  const region = {
    latitude: 63.410601,
    longitude: 10.413305,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectedPointHandler = (event) => {
    if (nodes.length === 0) {
      const node = new Node(
        null,
        event.nativeEvent.coordinate.latitude,
        event.nativeEvent.coordinate.longitude,
      );
      setNodes((prevNodes) => [...prevNodes, node]);
    } else {
      const node = new Node(
        null,
        event.nativeEvent.coordinate.latitude,
        event.nativeEvent.coordinate.longitude,
      );
      nodes[nodes.length - 1].nextNode = node;
      setNodes((prevNodes) => [...prevNodes, node]);
    }

    if (nodes.length === 10) setNodes([]);
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={selectedPointHandler}
      >
        {nodes.map((n) => (
          <>
            <Circle
              key={n.lat + n.lng}
              center={{ latitude: n.lat, longitude: n.lng }}
              radius={10}
              fillColor="blue"
            />
            {n.nextNode && (
              <Polyline
                key={n.lng + ':' + n.lat}
                coordinates={[
                  { latitude: n.lat, longitude: n.lng },
                  { latitude: n.nextNode.lat, longitude: n.nextNode.lng },
                ]}
                strokeColor="red"
                strokeWidth={6}
              />
            )}
          </>
        ))}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default Map;
