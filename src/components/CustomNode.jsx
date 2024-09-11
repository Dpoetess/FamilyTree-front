import React, {useState, useCallback} from 'react';
import { Handle } from '@xyflow/react';
import { rootId } from './nodes-edges';
import './CustomNode.css';

const CustomNode = ({ id, data }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hoveringOptions, setHoveringOptions] = useState(false);

  // Check if the current node is the root node
  const isRootNode = id === rootId;

  // Get the position of the current node
  const currentPosition = data.position || { x: 0, y: 0 };
  console.log('Current position:', currentPosition);

  // Check if a spouse already exists for the current node
  const hasSpouse = data.nodes ? data.nodes.some(node => node.data.spouseOf === id) : false;

  // Check if the current node is a spouse
  const isSpouse = data.hasSpouse;



  // Find spouses
  const spouses = data.nodes?.filter(node => node.data.spouseOf === id) || [];
  
  // Debugging output
  console.log('All Spouses:', spouses);
  
  /* // Assuming that spouses are correctly sorted
  const [leftSpouse, rightSpouse] = spouses;

  console.log('Left Spouse:', leftSpouse);
  console.log('Right Spouse:', rightSpouse); */

  // Determine the left and right spouse
  const leftSpouse = spouses.find(node => node.position.x < currentPosition.x);
  const rightSpouse = spouses.find(node => node.position.x > currentPosition.x);

  // Debugging output
  console.log('Left Spouse:', leftSpouse);
  console.log('Right Spouse:', rightSpouse);

  // Handle the case when the left spouse is present
  const effectiveRightSpouse = leftSpouse
    ? data.nodes.find(node => node.id === rootId && node.position.x > leftSpouse.position.x)
    : rightSpouse;

  // Debugging output
  console.log('Left Spouse:', leftSpouse);
  console.log('Effective Right Spouse:', effectiveRightSpouse);

  // Determine if the current node is a left or right spouse
  const isLeftSpouse = leftSpouse && leftSpouse.position && leftSpouse.position.x < currentPosition.x && leftSpouse.id !== rootId;
  const isRightSpouse = rightSpouse && rightSpouse.position && rightSpouse.position.x > currentPosition.x && rightSpouse.id !== rootId;

  console.log('Is Left Spouse:', isLeftSpouse);
  console.log('Is Right Spouse:', isRightSpouse);
  
/*   // Calculate the midpoint for child node creation
  const midpoint = leftSpouse && rightSpouse
    ? {
        x: (leftSpouse.position.x + rightSpouse.position.x) / 2,
        y: Math.min(leftSpouse.position.y, rightSpouse.position.y) - 50, // Adjust vertical offset as needed
      }
    : null;
  
  console.log('Midpoint:', midpoint); // Debugging line */
  
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
  
  const handleAddChild = () => {
    console.log('Adding child node');
    console.log('Current data:', data);
    data.addNode(id, 'bottom'); // Ensure this is called correctly
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

      {/* Button to add a child node */}
      {data.hasSpouse && (
        <button
          className="add-child-button" 
          onClick={handleAddChild}
        >
          +
        </button>
      )}
    </div>
  );
};



export default CustomNode;