module.exports = class Node {
  constructor(lat, lng) {
    this.nextNode = null;
    this.lat = lat;
    this.lng = lng;
  }
};
