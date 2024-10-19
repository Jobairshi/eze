import React, { useState, useCallback, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../types/ItemTypes'; 

interface CustomComponentProps {
  id: string;
  name: string;
  left: number;
  top: number;
}

export default function CustomComponent({ id, name, left, top }: CustomComponentProps) {
  const [message, setMessage] = useState('<div> hellow world</div>');
  const [dimensions, setDimensions] = useState({ width: 300, height: 250 });
  const [isResizing, setIsResizing] = useState(false);

  const addRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.Component,
    item: { id, name, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isResizing,
  });

  const handleSubmit = () => {
    console.log('Message:', message);
    const newComponent = document.createElement('div');
    newComponent.innerHTML = message;
  
    const allChildNodes = addRef.current?.childNodes;
    console.log(allChildNodes); // storeed al the nodes

    while (addRef.current && addRef.current.childNodes.length > 1) {
      addRef.current.removeChild(addRef.current.childNodes[0]);
    }
    addRef.current?.appendChild(newComponent);
  };

  const handleResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);
      setDimensions({
        width: Math.max(200, newWidth),
        height: Math.max(150, newHeight), 
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [dimensions]);

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    opacity: isDragging ? 0 : 1, 
    position: 'absolute',
    left,
    top,
    cursor: isResizing ? 'nwse-resize' : 'grab',
  };

  const resizeHandleStyle: React.CSSProperties = {
    ...styles.resizeHandle,
    cursor: 'nwse-resize',
  };

  drag(addRef);

  return (
    <div ref={addRef} style={containerStyle}>
      <textarea
        style={styles.textArea}
        placeholder="Write your custom component here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
     
      <div style={resizeHandleStyle} onMouseDown={handleResize} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    border: '2px solid #0077b6',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  textArea: {
    width: '90%',
    height: '60%',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '8px',
    border: '2px solid #0077b6',
    marginBottom: '20px',
    resize: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#0077b6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  },
  resizeHandle: {
    position: 'absolute',
    width: '15px',
    height: '15px',
    backgroundColor: '#0077b6',
    bottom: '5px',
    right: '5px',
  },
};
