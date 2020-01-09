calculateMaxMinDeltaValues = data => {
  let maxLatitude = -90;
  let minLatitude = 90;
  let maxLongitude = -180;
  let minLongitude = 180;
  // let latsDiff
  // let longDiff

  data.forEach(element => {
    maxLatitude = Math.max(maxLatitude, element[0]);
    minLatitude = Math.min(minLatitude, element[0]);
    maxLongitude = Math.max(maxLongitude, element[1]);
    minLongitude = Math.min(minLongitude, element[1]);
  });
  let latsDiff = (maxLatitude + minLatitude) / 2;
  let longDiff = (maxLongitude + minLongitude) / 2;

  let deltaLat = maxLatitude - minLatitude / 2;
  let deltaLong = maxLongitude - minLongitude / 2;

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
