// Define the root node ID
export const rootId = '1';

// Define the initial tree structure with one root node
export const initialTree = {
  id: rootId,
  name: 'Root',
  children: [],
  parents: [],
  siblings: [],
  spouses: []
};

// Define initial nodes with one root node
export const initialNodes = [
  {
    id: rootId,
    position: { x: 300, y: 300 },
    data: { label: 'Root', hasParents: false },
    type: 'custom',
  }
];

// Define initial edges (none in this case)
export const initialEdges = [];