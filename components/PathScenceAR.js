import React, { useState, useEffect } from 'react';
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroBox,
} from '@viro-community/react-viro';

import transformGpsToAR from '../util/transformGpsToAR';

const PathSceneAR = (props) => {
  const [positions, setPositions] = useState([]);

  function onInitialized(state, reason) {
    console.log('guncelleme', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      props.sceneNavigator.viroAppProps.nodes.map((point) =>
        setPositions((prevPositions) => [
          ...prevPositions,
          transformGpsToAR(point.lat, point.lng, 63.410601, 10.413305),
        ]),
      );
    } else if (state === ViroTrackingStateConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

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

export default PathSceneAR;
