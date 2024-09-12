import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/CustomNode';
import { initialNodes, initialEdges } from '../components/nodes-edges';
import Form from '../components/Form';
import { getPerson, createPerson, updatePerson, createNode, getNodesByTree } from '../service/api';
import { useLocation } from 'react-router-dom';


export default function LayoutFlow() {
  const location = useLocation();
  const tree_id = location.state?.tree_id;

  console.log('Tree ID:', tree_id);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodesFromBackend = await getNodesByTree(tree_id);

        const updatedNodes = nodesFromBackend.map(node => {
          const person = node.person;
        
          return {
            id: node.id, 
            data: { label: person?.first_name || 'Unknown', personId: person?.id || null },
            position: node.position || { x: 0, y: 0 }, 
            type: 'custom',
          };
        });

        setNodes(prevNodes => {
          const mergedNodes = [...prevNodes];
  
          updatedNodes.forEach(newNode => {
            if (!mergedNodes.find(existingNode => existingNode.id === newNode.id)) {
              mergedNodes.push(newNode);
            }
          });
  
          return mergedNodes;
        });
      } catch (error) {
        console.error('Error loading nodes:', error);
      }
    };
  
    if (tree_id) fetchNodes();
  }, [tree_id]);

  const handleNodeClick = async (nodeData) => {
    if (nodeData && nodeData.personId) {
      try {
        const personData = await getPerson(nodeData.personId);
        setSelectedPerson(personData);
        setFormVisible(true);
      } catch (error) {
        console.error('Error fetching person data:', error);
      }
    } else {
      setSelectedPerson(nodeData);
      setFormVisible(true);
    }
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setSelectedPerson(null);
  };

  const handleSave = async (updatedData) => {
    if (selectedPerson && selectedPerson.id) {
      try {
        console.log('Updating person:', selectedPerson.id, updatedData); 
        await updatePerson(selectedPerson.id, updatedData);
        setNodes(prevNodes => {
  
          const updatedNodes = prevNodes.map(node =>
            node.id === selectedPerson.id
              ? { ...node, data: { ...node.data, label: updatedData.first_name } }
              : node
          );
  
        return updatedNodes;
        });
      } catch (error) {
      console.error('Error updating person:', error);
      }
    } else {
      try {
        console.log('Creating new person with data:', updatedData);
        
        const { person, node } = await createPerson(updatedData); 
        console.log('Person created:', person); 
  
        if (node && node.error === 'Node already exists for this person in this tree.') {
          console.log('Node already exists:', node);  
          return;
        }

        console.log('Data being passed to createNode:', {
          person_id: person.id, 
          tree_id: tree_id, 
        });

        const nodeResponse = await createNode({
        person_id: person.id,
        tree_id: tree_id,
        });
  
        console.log('New node created:', nodeResponse); 
  
        setNodes(prevNodes => {
          console.log('Previous nodes before adding new node:', prevNodes);
  
          const newNodes = [
            ...prevNodes,
            {
              id: nodeResponse.id,  
              data: { label: person.first_name, personId: person.id },  
              position: { x: 100, y: 100 },
              type: 'custom',
            },
          ];
          console.log('New nodes after adding new node:', newNodes); 
          return newNodes;
        });
      } catch (error) {
        console.error('Error creating person or node:', error);
      }
    }
  };

  useEffect(() => {
    console.log('Nodes:', nodes);
  }, [nodes]);

  const addNode = useCallback((parentId, direction, type) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    if (direction === 'top') {
      if (!parentNode.data.hasParents) {
        const newNodeId1 = `${nodes.length + 1}`;
        const newNodeId2 = `${nodes.length + 2}`;

        const spacing = 150;
        const parent1Position = { x: parentNode.position.x - spacing / 2, y: parentNode.position.y - 200 };
        const parent2Position = { x: parentNode.position.x + spacing / 2, y: parentNode.position.y - 200 };

        const newParent1 = { id: newNodeId1, position: parent1Position, data: { label: 'Parent', spouseOf: newNodeId2, parentOf: parentId }, type: 'custom' };
        const newParent2 = { id: newNodeId2, position: parent2Position, data: { label: 'Parent', spouseOf: newNodeId1, parentOf: parentId }, type: 'custom' };

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

        const newSiblingNode = { id: newNodeId, position: siblingPosition, data: { label: 'Sibling', siblingOf: parentId, hasParents: parentNode.data.hasParents }, type: 'custom' };

        if (!parentNode.data.hasParents) {
          const parent1Id = `${nodes.length + 2}`;
          const parent2Id = `${nodes.length + 3}`;

          const parent1Position = { x: (parentNode.position.x + siblingPosition.x) / 2 - 75, y: parentNode.position.y - 200 };
          const parent2Position = { x: (parentNode.position.x + siblingPosition.x) / 2 + 75, y: parentNode.position.y - 200 };

          const newParent1 = { id: parent1Id, position: parent1Position, data: { label: 'Parent', spouseOf: parent2Id }, type: 'custom' };
          const newParent2 = { id: parent2Id, position: parent2Position, data: { label: 'Parent', spouseOf: parent1Id }, type: 'custom' };

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
            label: 'Spouse',
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
        y: parentNode.position.y - 150,
      };
  
      const newChildNode = {
        id: newNodeId,
        position: childPosition,
        data: { label: 'Child', parentOf: parentId },
        type: 'custom',
      };
  
      console.log('Creating child node:', newChildNode); 
  
      setNodes(prevNodes => {
        const updatedNodes = [...prevNodes, newChildNode];
        console.log('Updated nodes:', updatedNodes); 
        return updatedNodes;
      });
    }
  }
  });

  const updateNode = (id, updatedData) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === id ? { ...node, data: { ...node.data, ...updatedData } } : node
      )
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes.map(node => ({
          ...node,
          data: { ...node.data, addNode, nodes, updateNode },
        }))}
        edges={edges}
        nodeTypes={{ custom: CustomNode }}
        onNodeClick={(_, node) => handleNodeClick(node.data)}
        fitView
      >
        <Controls />
      </ReactFlow>
      {isFormVisible && selectedPerson && (
        <Form
          visible={isFormVisible}
          onClose={handleCloseForm}
          personData={selectedPerson}
          onSubmit={handleSave}
          tree_id={tree_id}
        />
      )}
    </div>
  );
}
