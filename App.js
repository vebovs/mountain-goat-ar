import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroBox,
} from '@viro-community/react-viro';

import Map from './components/Map';

const PathSceneAR = () => {
  const [positions, setPositions] = useState([]);

  const lineString = [
    [63.410603, 10.41338],
    [63.410695, 10.413364],
  ];

  const latLongToMerc = (latDeg, longDeg) => {
    // From: https://gist.github.com/scaraveos/5409402
    const longRad = (longDeg / 180.0) * Math.PI;
    const latRad = (latDeg / 180.0) * Math.PI;
    const smA = 6378137.0;
    const xmeters = smA * longRad;
    const ymeters = smA * Math.log((Math.sin(latRad) + 1) / Math.cos(latRad));

    return { x: xmeters, y: ymeters };
  };

  const transformGpsToAR = (latObj, longObj, latMobile, longMobile) => {
    const deviceObjPoint = latLongToMerc(latObj, longObj); // see previous post for code.
    const mobilePoint = latLongToMerc(latMobile, longMobile); // see previous post for code.

    const objDeltaY = deviceObjPoint.y - mobilePoint.y;
    const objDeltaX = deviceObjPoint.x - mobilePoint.x;

    //if (isAndroid) {
    let degree = 90; // not using real compass yet.
    let angleRadian = (degree * Math.PI) / 180;

    console.log('Using degree => ', degree);
    console.log('Angle radian => ', angleRadian);

    let newObjX =
      objDeltaX * Math.cos(angleRadian) - objDeltaY * Math.sin(angleRadian);
    let newObjY =
      objDeltaX * Math.sin(angleRadian) + objDeltaY * Math.cos(angleRadian);

    console.log('old delta => ', { x: objDeltaX, z: -objDeltaY });
    console.log('new delta => ', { x: newObjX, z: -newObjY });

    return { x: newObjX, z: -newObjY };
    //}

    //return { x: objDeltaX, z: -objDeltaY };
  };

  function onInitialized(state, reason) {
    console.log('guncelleme', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      lineString.map((point) =>
        setPositions((prevPositions) => [
          ...prevPositions,
          transformGpsToAR(point[0], point[1], 63.410601, 10.413305),
        ]),
      );
    } else if (state === ViroTrackingStateConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  /*
  useEffect(() => {
    
      Window: 63.410601, 10.413305
      Point A: 63.410603, 10.41338
      Point B: 63.410695, 10.413364
    
    setPosition(transformGpsToAR(63.410603, 10.41338, 63.410601, 10.413305));
  }, []);
  */

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {positions.map((pos) => (
        <ViroBox
          key={pos.x}
          height={1}
          length={1}
          width={1}
          scale={[0.2, 0.2, 0.2]}
          position={[pos.x, 0, pos.z]}
        />
      ))}
    </ViroARScene>
  );
};

export default () => {
  const [screenToggle, setScreenToggle] = useState(false);
  const [nodes, setNodes] = useState([]);

  return (
    <>
      {screenToggle && <Map nodes={nodes} setNodes={setNodes} />}
      {!screenToggle && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: PathSceneAR,
          }}
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

var styles = StyleSheet.create({
  f1: { flex: 1 },

  iconButton: {
    justifyContent: 'center',
  },
});
