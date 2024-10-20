import React, { useState, useCallback, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../types/ItemTypes'; 
import { GridSize } from '../../exports/GridSize';

const grd_sz = GridSize;
const grid_gap = 3;
const containerWidth = 1000;
const containerHeight = 900;
function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / (grd_sz + grid_gap)) *( grd_sz + grid_gap);
  const snappedY = Math.round(y / (grd_sz + grid_gap) ) * (grd_sz + grid_gap);
  return [snappedX, snappedY];
}

interface CustomComponentProps {
  id: string;
  name: string;
  left: number;
  top: number;
  
}

export default function CustomComponent({ id, name, left, top }: CustomComponentProps) {
  const [htmlcss, sethtmlcss] = useState('<div> hello world</div>');
  const [dimensions, setDimensions] = useState({ width: 200, height: 150 });
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
    console.log('htmlcss:', htmlcss);
    const newComponent = document.createElement('div');
    newComponent.innerHTML = htmlcss;
  
    const allChildNodes = addRef.current?.childNodes;
    console.log(allChildNodes); 

    while (addRef.current && addRef.current.childNodes.length > 2) {
      addRef.current.removeChild(addRef.current.childNodes[0]);
    }
    addRef.current?.appendChild(newComponent);
  };

  const handleResize = useCallback((e: React.MouseEvent, direction: 'right' | 'bottom') => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === 'right') {
        newWidth = Math.min(containerWidth - left, startWidth + (moveEvent.clientX - startX));
      } else if (direction === 'bottom') {
        newHeight = Math.min(containerHeight - top, startHeight + (moveEvent.clientY - startY));
      }

      const [snappedWidth, snappedHeight] = snapToGrid(newWidth, newHeight);
      setDimensions({
        width: Math.max(200, snappedWidth),
        height: Math.max(150, snappedHeight), 
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

  drag(addRef);

  return (
    <div ref={addRef} style={containerStyle}>
      <textarea
        style={styles.textArea}
        placeholder="Write your custom component here..."
        value={htmlcss}
        onChange={(e) => sethtmlcss(e.target.value)}
      />
      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
     
      <div
        style={styles.resizeRightHandle}
        onMouseDown={(e) => handleResize(e, 'right')}
      />
     
      <div
        style={styles.resizeBottomHandle}
        onMouseDown={(e) => handleResize(e, 'bottom')}
      />
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
  resizeRightHandle: {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'red',
    height: '30px',
    width: '10px',
    cursor: 'e-resize',
  },
  resizeBottomHandle: {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'red',
    height: '10px',
    width: '30px',
    cursor: 's-resize',
  },
};
