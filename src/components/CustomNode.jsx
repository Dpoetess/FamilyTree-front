import React, { useState } from 'react';
import { rootId } from './nodes-edges';
import './CustomNode.css';


const CustomNode = ({ id, data, updateNode }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hoveringOptions, setHoveringOptions] = useState(false);

  const handleClick = (event) => {

    if (
      event.target.classList.contains('plus-button') || 
      event.target.closest('.options-menu') 
    ) {
      return;
    }
    
  };

  const handleRightClick = (event) => {
    event.stopPropagation(); 
    if (hasSpouse) {
      data.addNode(id, 'right', 'sibling');
    } else {
      setShowOptions(true);
    }
  };


  const handleOptionClick = (type) => {
    data.addNode(id, 'right', type); 
    setShowOptions(false); 
  };

  const handleMouseLeaveNode = () => {
    if (!hoveringOptions) {
      setShowOptions(false);
    }
  };
  
  const handleAddChild = (event) => {
    event.stopPropagation(); 
    console.log('Adding child node');
    data.addNode(id, 'bottom');
  };

  const handleDeleteNode = (event) => {
    event.stopPropagation();
    console.log('delete node WIP')
  }

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

  const imageUrl = data.photo || '/images/person_icon.svg';

  const currentPosition = data.position || { x: 0, y: 0 };

  const hasSpouse = data.nodes ? data.nodes.some(node => node.data.spouseOf === id) : false;
  const spouses = data.nodes?.filter(node => node.data.spouseOf === id) || [];
  const leftSpouse = spouses.find(node => node.position.x < currentPosition.x);
  const rightSpouse = spouses.find(node => node.position.x > currentPosition.x);

  const effectiveRightSpouse = leftSpouse
    ? data.nodes.find(node => node.id === rootId && node.position.x > leftSpouse.position.x)
    : rightSpouse;

  const isLeftSpouse = leftSpouse && leftSpouse.position && leftSpouse.position.x < currentPosition.x && leftSpouse.id !== rootId;
  const isRightSpouse = rightSpouse && rightSpouse.position && rightSpouse.position.x > currentPosition.x && rightSpouse.id !== rootId;

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
            event.stopPropagation(); 
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
            event.stopPropagation(); 
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
              event.stopPropagation();
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
                event.stopPropagation(); 
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
      
      {/* Button to delete a node */}
      <button
        className="delete-node-button menos-button" 
        onClick={handleDeleteNode}
      >
          -
      </button>
      

    </div>
  );
};

export default CustomNode;