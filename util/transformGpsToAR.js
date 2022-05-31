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

export default transformGpsToAR;

/*
    useEffect(() => {
      
        Window: 63.410601, 10.413305
        Point A: 63.410603, 10.41338
        Point B: 63.410695, 10.413364
      
      setPosition(transformGpsToAR(63.410603, 10.41338, 63.410601, 10.413305));
    }, []);
    */
