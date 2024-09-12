import React, { useState, useEffect } from 'react';
import { createTree, getTrees } from '../service/api';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [treeName, setTreeName] = useState('');
  const [trees, setTrees] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await getTrees();
        setTrees(response);
      } catch (error) {
        console.error('Error fetching trees:', error);
      }
    };
    fetchTrees();
  }, []);

  const handleCreateTree = async () => {
    if (treeName) {
      try {
        const newTree = await createTree({ 
          name: treeName,
          user: 1
        });
        setTrees([...trees, newTree]);
        setTreeName('');
        navigate(`/tree/${newTree.id}`, { state: { tree_id: newTree.id } });
      } catch (error) {
        console.error('Error creating tree:', error);
      }
    }
  };

  return (
    <div>
    <div className="home-container">
      <div className="logo">
        <img src="/images/FamilyMe_templogo.png" alt="Logo" />
      </div>
      <div className="tree-management">
        <div className="create-tree">
          <h3>Create a New Tree</h3>
          <input
            type="text"
            placeholder="Tree Name"
            value={treeName}
            onChange={(e) => setTreeName(e.target.value)}
          />
          <button className="create-tree-button" onClick={handleCreateTree}>Create Tree</button>
        </div>

        {Array.isArray(trees) && trees.length > 0 && (
          <div className="tree-list">
            <h3>Your Trees</h3>
            <ul>
              {trees.map((tree) => (
                <li key={tree.id}>
                  <button className="list-buttons"onClick={() => navigate(`/tree/${tree.id}`, { state: { tree_id: tree.id } })}>
                    {tree.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default HomePage;