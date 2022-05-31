import React, { useState, useEffect } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroBox,
} from '@viro-community/react-viro';

import transformGpsToAR from '../util/transformGpsToAR';

const PathSceneAR = (props) => {
  const [userLocation, setUserLocation] = useState();
  const [positions, setPositions] = useState([]);

  const hasLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position);
        //console.log(position);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        setUserLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: false,
        showLocationDialog: true,
      },
    );
  };

  function onInitialized(state, reason) {
    console.log('guncelleme', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      props.sceneNavigator.viroAppProps.nodes.map((point) =>
        setPositions((prevPositions) => [
          ...prevPositions,
          transformGpsToAR(
            point.lat,
            point.lng,
            userLocation.coords.latitude,
            userLocation.coords.longitude,
          ),
        ]),
      );
    } else if (state === ViroTrackingStateConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  if (!userLocation) return null;

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
