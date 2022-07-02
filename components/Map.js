import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Polyline, Circle } from 'react-native-maps';

import Node from '../util/Node';

function Map({ nodes, setNodes }) {
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
  };

  const undoNode = () => {
    if (nodes.length > 0) {
      const removedLast = nodes.slice(0, nodes.length - 1);
      if (removedLast.length > 0)
        removedLast[removedLast.length - 1].nextNode = null;
      setNodes(removedLast);
    }
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={selectedPointHandler}
      >
        {nodes.map((n) => (
          <Fragment key={n.lat + n.lng}>
            <Circle
              key={n.lat + ':' + n.lng}
              center={{ latitude: n.lat, longitude: n.lng }}
              radius={6}
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
          </Fragment>
        ))}
      </MapView>
      <Icon.Button
        name="undo"
        size={40}
        style={styles.iconButton}
        onPress={undoNode}
        disabled={nodes.length > 0 ? false : true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  iconButton: {
    justifyContent: 'center',
  },
});

export default Map;
