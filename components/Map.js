import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

import Node from '../util/Node';
import LinkedList from '../util/LinkedList';

function Map() {
  const region = {
    latitude: 63.410601,
    longitude: 10.413305,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectedPointHandler = (event) => {
    console.log(event.nativeEvent.coordinate);
  };

  useEffect(() => {
    const node1 = new Node(63.411355, 10.412751);
    const node2 = new Node(63.409668, 10.413062);
    const node3 = new Node(63.410601, 10.413305);
    const node4 = new Node(1, 1);

    const linkedList = new LinkedList(node1);

    linkedList.appendNode(node2);
    linkedList.appendNode(node3);
    linkedList.appendNode(node4);
    linkedList.printList();

    linkedList.removeLast();
    linkedList.printList();
  }, []);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectedPointHandler}
    >
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
