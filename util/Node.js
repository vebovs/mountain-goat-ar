module.exports = class Node {
  constructor(nextNode, lat, lng) {
    this.nextNode = nextNode;
    this.lat = lat;
    this.lng = lng;
  }
};
