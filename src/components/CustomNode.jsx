import React, {useState, useCallback} from 'react';
import { Handle } from '@xyflow/react';
import './CustomNode.css';

const CustomNode = ({ id, data }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hoveringOptions, setHoveringOptions] = useState(false);

  // Check if a spouse already exists for the current node
  const hasSpouse = data.nodes ? data.nodes.some(node => node.data.spouseOf === id) : false;

  // Check if the current node is a spouse
  const isSpouse = data.hasSpouse;

  // Get the position of the current node
  const currentPosition = data.position || { x: 0, y: 0 };

  // Check if there is a spouse with the same spouseOf
  const spouse = data.nodes ? data.nodes.find(node => node.data.spouseOf === id) : null;
   
  // Determine if the current node is a left spouse
  const isLeftSpouse = spouse && spouse.position.x < currentPosition.x;
  
  // Determine if the current node is a right spouse
  const isRightSpouse = spouse && spouse.position.x > currentPosition.x;
  
  const handleRightClick = () => {
    if (hasSpouse) {
      // Automatically add a sibling if a spouse exists
      data.addNode(id, 'right', 'sibling');
    } else {
      // Show options (Add Sibling / Add Spouse) if no spouse exists
      setShowOptions(true);
    }
  };

  const handleOptionClick = (type) => {
    // Call addNode function with 'right' direction for sibling/spouse creation
    data.addNode(id, 'right', type); // Trigger the node addition
    setShowOptions(false); // Hide options after adding a node
  };

  const handleMouseLeaveNode = () => {
    if (!hoveringOptions) {
      setShowOptions(false);
    }
  };
  
  
  return (
    <div className="custom-node" onMouseLeave={handleMouseLeaveNode}>
      {data.label && data.label}

      
      {/* For child nodes, add top handle */}
      {!data.hasParents && !isLeftSpouse && (
        <button className="top-button" onClick={() => data.addNode(id, 'top')}>
          +
        </button>
      )}

      {/* Right button for adding sibling or spouse */}
      {!isLeftSpouse && !showOptions && (
        <button className="right-button" onClick={handleRightClick}>
          +
        </button>
      )}


      {/* Show options only if no spouse exists */}
      {showOptions && (
        <div
          className="options-menu"
          onMouseEnter={() => setHoveringOptions(true)}
          onMouseLeave={() => setHoveringOptions(false)}
          style={{
            position: 'absolute',
            top: '0',
            left: '120px',
          }}
        >
          {/* Always show "Add Sibling" button */}
          <button className="option-button" onClick={() => handleOptionClick('sibling')}>
            Add Sibling
          </button>

          {/* Show "Add Spouse" button only if no spouse exists */}
          {!hasSpouse &&(
            <button className="option-button" onClick={() => handleOptionClick('spouse')}>
              Add Spouse
            </button>
          )}
        </div>
      )}
    </div>
  );
};



export default CustomNode;