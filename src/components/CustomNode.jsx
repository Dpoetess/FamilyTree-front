import React, { useState } from 'react';
import { Handle } from '@xyflow/react';
import { rootId } from './nodes-edges';
import './CustomNode.css';


const CustomNode = ({ id, data, handleNodeClick, updateNode }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hoveringOptions, setHoveringOptions] = useState(false);

  const handleClick = (event) => {
    // If the event target is a button (contains 'plus-button' class) or part of the options menu, prevent form from appearing
    if (
      event.target.classList.contains('plus-button') ||  // Exclude all "+" buttons
      event.target.closest('.options-menu')  // Exclude the "add-sibling" and "add-spouse" options
    ) {
      return; // Do nothing when clicking on the "+" buttons or options
    }
    
    // Only trigger the form if the click is not on a button or an option
    if (typeof handleNodeClick === 'function') {
      handleNodeClick(data); // Call the handler to set the selected person
    } else {
      console.error('handleNodeClick is not a function');
    }
  };

  const handleSave = (updatedData) => {
    updateNode(id, updatedData); // Function to update node data
  };

  const handleRightClick = (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    if (hasSpouse) {
      data.addNode(id, 'right', 'sibling');
    } else {
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
  
  const handleAddChild = (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    console.log('Adding child node');
    data.addNode(id, 'bottom');
  };

  const cardStyle = {
    width: '70px',
    height: '110px',
    padding: '10px',
    border: '1px solid black',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  };

  const imageStyle = {
    width: '80%',
    height: '80%',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '2rem',
  };

  const nameStyle = {
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '5px',
  };

  const imageUrl = data.photo || '/images/person_icon.svg';  // Placeholder if no photo

  const currentPosition = data.position || { x: 0, y: 0 };
  console.log('Current position:', currentPosition);

  const hasSpouse = data.nodes ? data.nodes.some(node => node.data.spouseOf === id) : false;
  //const isSpouse = data.hasSpouse;
  const spouses = data.nodes?.filter(node => node.data.spouseOf === id) || [];
  console.log('All Spouses:', spouses);

  const leftSpouse = spouses.find(node => node.position.x < currentPosition.x);
  const rightSpouse = spouses.find(node => node.position.x > currentPosition.x);
  console.log('Left Spouse:', leftSpouse);
  console.log('Right Spouse:', rightSpouse);

  const effectiveRightSpouse = leftSpouse
    ? data.nodes.find(node => node.id === rootId && node.position.x > leftSpouse.position.x)
    : rightSpouse;
  console.log('Left Spouse:', leftSpouse);
  console.log('Effective Right Spouse:', effectiveRightSpouse);

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
  
  

  
  return (
    <div className="custom-node" onMouseLeave={handleMouseLeaveNode} style={cardStyle} onClick={handleClick}>
      <img
        src={imageUrl}
        alt="Profile"
        style={imageStyle}
      />
      
      <div style={nameStyle}>{data.label}</div>

      {/* For child nodes, add top handle */}
      {!data.hasParents && !isLeftSpouse && (
        <button 
          className="top-button plus-button" 
          onClick={(event) => {
            event.stopPropagation(); // Prevents the click from bubbling up to the card
            data.addNode(id, 'top');
          }}
        >
          +
        </button>
      )}

      {/* Right button for adding sibling or spouse */}
      {!isLeftSpouse && !showOptions && (
        <button 
          className="right-button plus-button" 
          onClick={(event) => {
            event.stopPropagation(); // Prevents the click from bubbling up to the card
            handleRightClick(event);
          }}
        >
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
          <button 
            className="option-button plus-button" 
            onClick={(event) => {
              event.stopPropagation();  // Prevents the click from bubbling up
              handleOptionClick('sibling');
            }}
          >
            Add Sibling
          </button>

          {/* Show "Add Spouse" button only if no spouse exists */}
          {!hasSpouse &&(
            <button 
              className="option-button plus-button" 
              onClick={(event) => {
                event.stopPropagation();  // Prevents the click from bubbling up
                handleOptionClick('spouse');
              }}
            >
              Add Spouse
            </button>
          )}
        </div>
      )}

      {/* Button to add a child node */}
      {data.hasSpouse && (
        <button
          className="add-child-button plus-button" 
          onClick={handleAddChild}
        >
          +
        </button>
      )}
    </div>
  );
};

export default CustomNode;