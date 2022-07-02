const latLongToMerc = (latDeg, longDeg) => {
  // From: https://gist.github.com/scaraveos/5409402
  const longRad = (longDeg / 180.0) * Math.PI;
  const latRad = (latDeg / 180.0) * Math.PI;
  const smA = 6378137.0;
  const xmeters = smA * longRad;
  const ymeters = smA * Math.log((Math.sin(latRad) + 1) / Math.cos(latRad));

  return { x: xmeters, y: ymeters };
};

const degrees_to_radians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const transformGpsToAR = (latObj, longObj, latMobile, longMobile, degree) => {
  const deviceObjPoint = latLongToMerc(latObj, longObj);
  const mobilePoint = latLongToMerc(latMobile, longMobile);

  const objDeltaY = deviceObjPoint.y - mobilePoint.y;
  const objDeltaX = deviceObjPoint.x - mobilePoint.x;

  const theta = Math.atan2(objDeltaY, objDeltaX) - Math.PI / 2;
  const r = Math.sqrt(Math.pow(objDeltaX, 2) + Math.pow(objDeltaY, 2));
  const degreeToRadian = degrees_to_radians(degree);

  const newObjX = r * Math.sin(theta + degreeToRadian);
  const newObjY = r * Math.cos(theta + degreeToRadian);

  return { x: -newObjX, z: -newObjY };
};

export default transformGpsToAR;
