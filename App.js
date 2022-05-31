import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ViroARSceneNavigator } from '@viro-community/react-viro';

import Map from './components/Map';
import PathSceneAR from './components/PathScenceAR';

export default () => {
  const [screenToggle, setScreenToggle] = useState(false);
  const [nodes, setNodes] = useState([]);

  return (
    <>
      {!screenToggle && <Map nodes={nodes} setNodes={setNodes} />}
      {screenToggle && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: PathSceneAR,
          }}
          viroAppProps={{ nodes: nodes }}
          style={styles.f1}
        />
      )}
      <Icon.Button
        name={screenToggle ? 'switch-right' : 'switch-left'}
        size={40}
        style={styles.iconButton}
        onPress={() => setScreenToggle(!screenToggle)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
  iconButton: {
    justifyContent: 'center',
  },
});
