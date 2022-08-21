import { REACT_APP_GOOGLE_API_KEY } from '@env';
import transformGpsToAR from '../util/transformGpsToAR';

const getElevation = async (nodes, userLocation, compassHeading) => {
  const promises = nodes.map(async (node) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${node.lat}%2C${node.lng}&key=${REACT_APP_GOOGLE_API_KEY}`,
    );
    const content = await response.json();
    const [data] = content.results;
    return {
      latitude: node.lat,
      longitude: node.lng,
      elevation: data.elevation,
    };
  });
  const positions = await Promise.all(promises);

  console.log('userlocation.coords');
  console.log(userLocation.coords);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/elevation/json?locations=${userLocation.coords.latitude}%2C${userLocation.coords.longitude}&key=${REACT_APP_GOOGLE_API_KEY}`,
  );
  const content = await response.json();
  const [data] = content.results;
  const userElevation = data.elevation;

  const points = positions.map((position) => {
    return transformGpsToAR(
      position.latitude,
      position.longitude,
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      position.elevation,
      userElevation,
      compassHeading,
    );
  });

  return points;
};

export default getElevation;
