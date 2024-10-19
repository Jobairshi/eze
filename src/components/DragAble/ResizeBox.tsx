import React, { useState, CSSProperties, useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import { GridSize } from "../../exports/GridSize";

const grd_sz = GridSize;
const grid_gap = 3;

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / (grd_sz + grid_gap)) * (grd_sz + grid_gap - 0.20);
  const snappedY = Math.round(y / (grd_sz + grid_gap)) * (grd_sz + grid_gap - 0.25); ;
  return [snappedX, snappedY];
}

export default function ResizeBox({ id, name, left, top }: DraggableProps) {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const [isResizing, setIsResizing] = useState(false);

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
        height: Math.max(100, snappedHeight),
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

  const boxStyle: CSSProperties = {
    position: "absolute",
    left,
    top,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    opacity: isDragging ? 0 : 1,
    backgroundColor: "blue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    
    color: "white",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    cursor: isResizing ? "nwse-resize" : "grab",
  };

  const resizeHandleStyle: CSSProperties = {
    position: "absolute",
    width: "10px",
    height: "10px",
    backgroundColor: "white",
    bottom: "0",
    right: "0",
    cursor: "nwse-resize",
  };

  const [isResizerEnabled, setIsResizerEnabled] = useState(false);

  const hiddenStyle: CSSProperties = {
    display: "none",
  };


  const enableResizer = () => {
    setIsResizerEnabled(!isResizerEnabled);
    console.log('resizer enabled');
  };
  console.log(isResizerEnabled);
  return (
    <div ref={drag} style={boxStyle} id={id} onDoubleClick={enableResizer}>
      This is a resizable box, double click to resize
      {dimensions.height + "px"} 
      {dimensions.width + "px"}
      <div style={(isResizerEnabled) ? resizeHandleStyle : hiddenStyle} onMouseDown={handleResize} />
     
    </div>
  );
}