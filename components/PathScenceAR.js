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
  ViroPolyline,
  ViroSpinner,
} from '@viro-community/react-viro';
import CompassHeading from 'react-native-compass-heading';

import getPoints from '../api/getPointsService';

const PathSceneAR = (props) => {
  const [userLocation, setUserLocation] = useState();
  const [points, setPoints] = useState([]);
  const [compassHeading, setCompassHeading] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log(position);
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

  const onInitialized = (state, reason) => {
    console.log('guncelleme', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      // Handle tracking
    } else if (state === ViroTrackingStateConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getLocation();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const degree_update_rate = 3;

    // accuracy on android will be hardcoded to 1
    // since the value is not available.
    // For iOS, it is in degrees
    CompassHeading.start(degree_update_rate, ({ heading, accuracy }) => {
      if (
        heading >= compassHeading + degree_update_rate ||
        heading <= compassHeading - degree_update_rate
      )
        setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      (async () => {
        const points = await getPoints(
          props.sceneNavigator.viroAppProps.nodes,
          userLocation,
          compassHeading,
        );
        setPoints(points);
        setIsLoading(false);
      })().catch((error) => {
        console.log(error.message);
        Alert.alert(error.message);
      });
    }
  }, [userLocation]);

  if (isLoading)
    return (
      <ViroARScene>
        <ViroSpinner type="light" position={[0, 0, -2]} />
      </ViroARScene>
    );

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {!isLoading && (
        <ViroPolyline position={[0, 0, 0]} points={points} thickness={0.2} />
      )}
    </ViroARScene>
  );
};

export default PathSceneAR;
