import React, { useState, useEffect } from 'react';
import { ReactFlow, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/CustomNode';
import { initialNodes, initialEdges } from '../components/nodes-edges';


export default function LayoutFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const addNode = (parentId, direction, type) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;
  
    if (direction === 'top' && !parentNode.data.hasParents) {
      const newNodeId1 = `${nodes.length + 1}`;
      const newNodeId2 = `${nodes.length + 2}`;
  
      const spacing = 150;
      const parent1Position = { x: parentNode.position.x - spacing / 2, y: parentNode.position.y - 100 };
      const parent2Position = { x: parentNode.position.x + spacing / 2, y: parentNode.position.y - 100 };
  
      const newNode1 = { id: newNodeId1, position: parent1Position, data: { label: newNodeId1, hasParents: false }, type: 'custom' };
      const newNode2 = { id: newNodeId2, position: parent2Position, data: { label: newNodeId2, hasParents: false }, type: 'custom' };
  
      const updatedParentNode = { ...parentNode, data: { ...parentNode.data, hasParents: true } };
  
      setNodes(prevNodes => [
        ...prevNodes.filter(n => n.id !== parentId),
        updatedParentNode,
        newNode1,
        newNode2,
      ]);
  
      setEdges(prevEdges => [
        ...prevEdges,
        { id: `e${newNodeId1}-${parentId}`, source: newNodeId1, target: parentId },
        { id: `e${newNodeId2}-${parentId}`, source: newNodeId2, target: parentId },
      ]);
    } else if (direction === 'right') {
      if (type === 'sibling') {
        const siblingNodes = nodes.filter(n => n.data.siblingOf === parentId);
        const maxSiblingX = Math.max(...siblingNodes.map(n => n.position.x), parentNode.position.x);
        const newNodeId = `${nodes.length + 1}`;
        const siblingPosition = { x: maxSiblingX + 150, y: parentNode.position.y };
  
        const newSiblingNode = { id: newNodeId, position: siblingPosition, data: { label: `Sibling ${newNodeId}`, siblingOf: parentId }, type: 'custom' };
  
        // Automatically create parents if the root node has no parents
        if (!parentNode.data.hasParents) {
          const parent1Id = `${nodes.length + 2}`;
          const parent2Id = `${nodes.length + 3}`;
  
          const parent1Position = { x: (parentNode.position.x + siblingPosition.x) / 2 - 75, y: parentNode.position.y - 100 };
          const parent2Position = { x: (parentNode.position.x + siblingPosition.x) / 2 + 75, y: parentNode.position.y - 100 };
  
          const newParent1 = { id: parent1Id, position: parent1Position, data: { label: `Parent ${parent1Id}`, hasParents: false }, type: 'custom' };
          const newParent2 = { id: parent2Id, position: parent2Position, data: { label: `Parent ${parent2Id}`, hasParents: false }, type: 'custom' };
  
          const updatedRootNode = { ...parentNode, data: { ...parentNode.data, hasParents: true } };
          const updatedSiblingNode = { ...newSiblingNode, data: { ...newSiblingNode.data, hasParents: true } };
  
          setNodes(prevNodes => [
            ...prevNodes.filter(n => n.id !== parentId),
            updatedRootNode,
            updatedSiblingNode,
            newParent1,
            newParent2,
          ]);
  
          setEdges(prevEdges => [
            ...prevEdges,
            { id: `e${parent1Id}-${parentId}`, source: parent1Id, target: parentId },
            { id: `e${parent2Id}-${parentId}`, source: parent2Id, target: parentId },
            { id: `e${parent1Id}-${newNodeId}`, source: parent1Id, target: newNodeId },
            { id: `e${parent2Id}-${newNodeId}`, source: parent2Id, target: newNodeId },
          ]);
        } else {
          // No need to create parents, just add the sibling
          setNodes(prevNodes => [...prevNodes, newSiblingNode]);
          setEdges(prevEdges => [...prevEdges, { id: `e${parentId}-${newNodeId}`, source: parentId, target: newNodeId }]);
        }
      } else if (type === 'spouse') {
        const newNodeId = `${nodes.length + 1}`;
        const spousePosition = { x: parentNode.position.x - 150, y: parentNode.position.y };
  
        const newSpouseNode = {
          id: newNodeId,
          position: spousePosition,
          data: {
            label: `Spouse ${newNodeId}`,
            spouseOf: parentId,  // Link this node as a spouse to the parent node
            hasSpouse: true      // Add a flag to indicate this node already has a spouse
          },
          type: 'custom',
        };
  
        const updatedParentNode = {
          ...parentNode,
          data: {
            ...parentNode.data,
            spouseOf: newNodeId,  // Link the original node to its new spouse
            hasSpouse: true       // Add a flag to indicate this node already has a spouse
          }
        };
  
        setNodes(prevNodes => [
          ...prevNodes.filter(n => n.id !== parentId),
          updatedParentNode,
          newSpouseNode,
        ]);
  
        // Create a stepped edge between the right handle of the spouse and the left handle of the root node
        setEdges(prevEdges => [
          ...prevEdges,
          {
            id: `e${parentId}-${newNodeId}`,
            source: newNodeId,  // Spouse node
            target: parentId,   // Root node
            sourceHandle: 'spouse-right', // Right handle of the spouse
            targetHandle: 'spouse-left',  // Left handle of the root node
            type: 'step',                 // Step edge type
            style: { stroke: '#000', strokeWidth: 2 },  // Styling for the edge
          },
        ]);
      }
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes.map((node) => ({
          ...node,
          data: { ...node.data, addNode, nodes }, // Pass addNode function as part of the node data
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