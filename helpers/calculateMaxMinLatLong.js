calculateMaxMinDeltaValues = data => {
  // console.warn("this is being called", data);
  let maxLatitude = -90;
  let minLatitude = 90;
  let maxLongitude = -180;
  let minLongitude = 180;

  data.forEach(element => {
    maxLatitude = Math.max(maxLatitude, element[0]);
    minLatitude = Math.min(minLatitude, element[0]);
    maxLongitude = Math.max(maxLongitude, element[1]);
    minLongitude = Math.min(minLongitude, element[1]);
  });
  let latsDiff = (maxLatitude + minLatitude) / 2;
  let longDiff = (maxLongitude + minLongitude) / 2;
  let deltaLat = maxLatitude - minLatitude / 1.5;
  let deltaLong = maxLongitude - minLongitude / 1.5;

  // console.warn(
  //   "maxlat, minlat, maxlong, minlong",
  //   maxLatitude,
  //   maxLongitude,
  //   minLatitude,
  //   minLongitude
  // );

  // console.warn(
  //   "all inside calc function",
  //   latsDiff,
  //   longDiff,
  //   deltaLat,
  //   deltaLong
  // );

  return {
    maxLatitude,
    minLatitude,
    maxLongitude,
    minLongitude,
    latsDiff,
    longDiff,
    deltaLat,
    deltaLong
  };
};

export default calculateMaxMinDeltaValues;
