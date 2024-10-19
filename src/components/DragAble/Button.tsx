import React, { useState, CSSProperties, useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import { GridSize } from "../../exports/GridSize";

const grd_sz = GridSize;
const grid_gap = 3;

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / (grd_sz + grid_gap)) * (grd_sz + grid_gap - 0.20);
  const snappedY = Math.round(y / (grd_sz + grid_gap)) * (grd_sz + grid_gap - 0.25);
  return [snappedX, snappedY];
}

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
}

export default function ResizableButton({ id, name, left, top }: DraggableProps) {
  const [dimensions, setDimensions] = useState({ width: 120, height: 50 });
  const [isResizing, setIsResizing] = useState(false);
  const [isResizerEnabled, setIsResizerEnabled] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.Component,
    item: { id, name, left, top, width: dimensions.width, height: dimensions.height },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isResizing,
  });

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
      const [snappedWidth, snappedHeight] = snapToGrid(newWidth, newHeight);
      setDimensions({
        width: Math.max(100, snappedWidth), 
        height: Math.max(50, snappedHeight),  // Set min-height for button to 50px
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [dimensions]);

  const enableResizer = () => {
    setIsResizerEnabled(!isResizerEnabled);
    console.log('resizer enabled');
  };

  const buttonWrapperStyle: CSSProperties = {
    position: "absolute",
    left,
    top,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    opacity: isDragging ? 0 : 1,
    cursor: isResizing ? "nwse-resize" : "grab",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const buttonStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#4a90e2",
    backgroundImage: "linear-gradient(45deg, #4a90e2, #0077b6)",
    color: "#fff",
    border: "none",
   
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  const resizeHandleStyle: CSSProperties = {
    position: "absolute",
    width: "10px",
    height: "10px",
    backgroundColor: "white",
    border: "1px solid black", 
    bottom: "0",
    right: "0",
    cursor: "nwse-resize",
  };

  const hiddenStyle: CSSProperties = {
    display: "none",
  };

  return (
    <div ref={drag} style={buttonWrapperStyle} id={id} >
      <button onDoubleClick={enableResizer}  style={buttonStyle}>
        Submit
      </button>
      <div style={isResizerEnabled ? resizeHandleStyle : hiddenStyle} onMouseDown={handleResize} />
    </div>
  );
}