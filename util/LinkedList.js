module.exports = class LinkedList {
  constructor(headNode) {
    this.headNode = headNode;
  }

  appendNode(newNode) {
    let currNode = this.headNode;
    while (currNode.nextNode !== null) {
      currNode = currNode.nextNode;
    }
    currNode.nextNode = newNode;
  }

  removeLast() {
    let currNode = this.headNode;
    let prevNode = null;
    while (currNode.nextNode !== null) {
      prevNode = currNode;
      currNode = currNode.nextNode;
    }
    prevNode.nextNode = null;
    currNode = null;
  }

  printList() {
    let currNode = this.headNode;
    console.log('LinkedList Printout:');
    let i = 0;
    while (currNode !== null) {
      console.log(
        `Node: ${i}, Latitude: ${currNode.lat} Longitude: ${currNode.lng}`,
      );
      currNode = currNode.nextNode;
      i++;
    }
  }
};
