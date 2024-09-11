import React, { useState, useEffect } from 'react';
import { ReactFlow, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/CustomNode';
import { initialNodes, initialEdges } from '../components/nodes-edges';


export default function LayoutFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    console.log('Nodes:', nodes);
  }, [nodes]);

  const addNode = (parentId, direction, type) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    if (direction === 'top') {
      if (!parentNode.data.hasParents) {
        const newNodeId1 = `${nodes.length + 1}`;
        const newNodeId2 = `${nodes.length + 2}`;

        const spacing = 150;
        const parent1Position = { x: parentNode.position.x - spacing / 2, y: parentNode.position.y - 100 };
        const parent2Position = { x: parentNode.position.x + spacing / 2, y: parentNode.position.y - 100 };

        const newParent1 = { id: newNodeId1, position: parent1Position, data: { label: `Parent ${newNodeId1}`, spouseOf: newNodeId2, parentOf: parentId }, type: 'custom' };
        const newParent2 = { id: newNodeId2, position: parent2Position, data: { label: `Parent ${newNodeId2}`, spouseOf: newNodeId1, parentOf: parentId }, type: 'custom' };

        setNodes(prevNodes => [
          ...prevNodes,
          newParent1,
          newParent2,
        ]);
      }
    } else if (direction === 'right') {
      if (type === 'sibling') {
        const siblingNodes = nodes.filter(n => n.data.siblingOf === parentId);
        const maxSiblingX = Math.max(...siblingNodes.map(n => n.position.x), parentNode.position.x);
        const newNodeId = `${nodes.length + 1}`;
        const siblingPosition = { x: maxSiblingX + 150, y: parentNode.position.y };

        const newSiblingNode = { id: newNodeId, position: siblingPosition, data: { label: `Sibling ${newNodeId}`, siblingOf: parentId, hasParents: parentNode.data.hasParents }, type: 'custom' };

        if (!parentNode.data.hasParents) {
          const parent1Id = `${nodes.length + 2}`;
          const parent2Id = `${nodes.length + 3}`;

          const parent1Position = { x: (parentNode.position.x + siblingPosition.x) / 2 - 75, y: parentNode.position.y - 100 };
          const parent2Position = { x: (parentNode.position.x + siblingPosition.x) / 2 + 75, y: parentNode.position.y - 100 };

          const newParent1 = { id: parent1Id, position: parent1Position, data: { label: `Parent ${parent1Id}`, spouseOf: parent2Id }, type: 'custom' };
          const newParent2 = { id: parent2Id, position: parent2Position, data: { label: `Parent ${parent2Id}`, spouseOf: parent1Id }, type: 'custom' };

          const updatedParentNode = { ...parentNode, data: { ...parentNode.data, hasParents: true } };
          const updatedSiblingNode = { ...newSiblingNode, data: { ...newSiblingNode.data, hasParents: true } };

          setNodes(prevNodes => [
            ...prevNodes.filter(n => n.id !== parentId),
            updatedParentNode,
            updatedSiblingNode,
            newParent1,
            newParent2,
          ]);
        } else {
            setNodes(prevNodes => [...prevNodes, newSiblingNode]);
          }
      } else if (type === 'spouse') {
        const newNodeId = `${nodes.length + 1}`;
        const spousePosition = { x: parentNode.position.x - 150, y: parentNode.position.y };

        const newSpouseNode = {
          id: newNodeId,
          position: spousePosition,
          data: {
            label: `Spouse ${newNodeId}`,
            spouseOf: parentId,
            hasSpouse: true
          },
          type: 'custom',
        };

        const updatedParentNode = {
          ...parentNode,
          data: {
            ...parentNode.data,
            spouseOf: newNodeId,
            hasSpouse: true
          }
        };

        setNodes(prevNodes => [
          ...prevNodes.filter(n => n.id !== parentId),
          updatedParentNode,
          newSpouseNode,
        ]);
    } else if (direction === 'bottom') {
      const newNodeId = `${nodes.length + 1}`;
      const childPosition = {
        x: parentNode.position.x,
        y: parentNode.position.y - 150, // Adjust as needed
      };
  
      const newChildNode = {
        id: newNodeId,
        position: childPosition,
        data: { label: `Child ${newNodeId}`, parentOf: parentId },
        type: 'custom',
      };
  
      console.log('Creating child node:', newChildNode); // Debugging line
  
      setNodes(prevNodes => {
        const updatedNodes = [...prevNodes, newChildNode];
        console.log('Updated nodes:', updatedNodes); // Debugging line
        return updatedNodes;
      });
    }
  }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes.map(node => ({
          ...node,
          data: { ...node.data, addNode, nodes },
        }))}
        edges={edges}
        nodeTypes={{ custom: CustomNode }}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}
