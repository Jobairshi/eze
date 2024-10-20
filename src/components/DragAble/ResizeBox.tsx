import React, { useState, CSSProperties, useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import { GridSize } from "../../exports/GridSize";

const grd_sz = GridSize;
const grid_gap = 3;
const containerWidth = 1000;
const containerHeight = 900;

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / (grd_sz + grid_gap)) * (grd_sz + grid_gap);
  const snappedY = Math.round(y / (grd_sz + grid_gap)) * (grd_sz + grid_gap);
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

  const handleResize = useCallback(
    (e: React.MouseEvent, direction: string) => {
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
    },
    [dimensions, left, top]
  );

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

  const resizeBarStyle: CSSProperties = {
    position: "absolute",
    backgroundColor: "#fff",
    cursor: "e-resize",
    zIndex: 10,
  };

  const resizeRightStyle: CSSProperties = {
    ...resizeBarStyle,
    right: "0",
    top: "50%",
    transform: "translateY(-50%)", 
    backgroundColor: "red",
    height: "30px", 
    width: "10px", 
  };

  const resizeBottomStyle: CSSProperties = {
    ...resizeBarStyle,
    bottom: "0", 
    left: "50%",
    transform: "translateX(-50%)", 
    backgroundColor: "red",
    height: "10px",
    width: "30px", 
    cursor: 's-resize',
  };

  const [isShow, setIsShow] = useState(false);

  function handleResizing() {
    setIsShow(!isShow);
  }

  return (
    <div onDoubleClick={handleResizing} ref={drag} style={boxStyle} id={id}>
      Resizable Box
      {!isShow && (
        <>
          <div
            style={resizeRightStyle}
            onMouseDown={(e) => handleResize(e, "right")}
          />
          <div
            style={resizeBottomStyle}
            onMouseDown={(e) => handleResize(e, "bottom")}
          />
        </>
      )}
    </div>
  );
}