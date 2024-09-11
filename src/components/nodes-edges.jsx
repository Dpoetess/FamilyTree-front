// Define the root node ID
export const rootId = '1';

// Define the initial tree structure with one root node
export const initialTree = {
  id: '1',
  name: 'Me',
  children: [],
  parents: [],
  siblings: [],
  spouses: []
};

// Define initial nodes with one root node
export const initialNodes = [
  {
    id: '1',
    position: { x: 300, y: 300 },
    data: { label: 'Me', hasParents: false, photo: null },
    type: 'custom',
  }
];

// Define initial edges (none in this case)
export const initialEdges = [];