import React, { useState, CSSProperties, useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
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
      setDimensions({
        width: Math.max(100, newWidth), 
        height: Math.max(100, newHeight),
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
    borderRadius: "8px",
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

  return (
    <>
      <div ref={drag} style={boxStyle} id={id}>
        This is a resizable box
        {dimensions.height + "px"} 
        {dimensions.width + "px"}
        <div style={resizeHandleStyle} onMouseDown={handleResize} />
      </div>
    </>
  );
}
