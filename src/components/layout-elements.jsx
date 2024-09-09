import { Position } from '@xyflow/react';
import { layoutFromMap } from 'entitree-flex';

const nodeWidth = 150;
const nodeHeight = 36;

const Orientation = {Vertical: 'vertical'};

const entitreeSettings = {
  clone: true, // returns a copy of the input, if your application does not allow editing the original object
  enableFlex: true, // has slightly better perfomance if turned off (node.width, node.height will not be read)
  firstDegreeSpacing: 100, // spacing in px between nodes belonging to the same source, eg children with same parent
  nextAfterAccessor: 'spouses', // the side node prop used to go sideways, AFTER the current node
  nextAfterSpacing: 100, // the spacing of the "side" nodes AFTER the current node
  nextBeforeAccessor: 'siblings', // the side node prop used to go sideways, BEFORE the current node
  nextBeforeSpacing: 100, // the spacing of the "side" nodes BEFORE the current node
  nodeHeight, // default node height in px
  nodeWidth, // default node width in px
  orientation: Orientation.Vertical, // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
  rootX: 0, // set root position if other than 0
  rootY: 0, // set root position if other than 0
  secondDegreeSpacing: 100, // spacing in px between nodes not belonging to same parent eg "cousin" nodes
  sourcesAccessor: 'parents', // the prop used as the array of ancestors ids
  sourceTargetSpacing: 100, // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
  targetsAccessor: 'children', // the prop used as the array of children ids
};

const { Top, Left, Right, Middle } = Position;

export const layoutElements = (tree, rootId) => {
  try {
    const layout = layoutFromMap(tree, entitreeSettings);

    const nodes = layout.nodes.map(node => ({
      id: node.id,
      position: { x: node.x, y: node.y },
      data: { label: node.id, hasParents: false },
      type: 'custom',
    }));

    const edges = layout.edges.map(edge => ({
      id: `e${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
    }));

    return { nodes, edges };
  } catch (error) {
    console.error('Error in layoutElements:', error);
    throw error; // Rethrow to handle further up if necessary
  }
};