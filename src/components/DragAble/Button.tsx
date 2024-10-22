import React, { useState, CSSProperties, useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";

import DropdownItem from "../SubComponents/DropDown"; // Assuming this is your form
import { Gridgap, GridSize_height, GridSize_width } from "../../exports/GridSize";

const gridHeight = GridSize_height;
const gridWidth = GridSize_width;
const grid_gap = Gridgap;
const containerWidth = 1000;
const containerHeight = 900;

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / (gridWidth + grid_gap)) * (gridWidth + grid_gap);
  const snappedY = Math.round(y / (gridHeight + grid_gap)) * (gridHeight + grid_gap);
  return [snappedX, snappedY];
}
export default function Button({ id, name, left, top }: DraggableProps) {
  const [dimensions, setDimensions] = useState({ width: 100, height: 50 });
  const [isResizing, setIsResizing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.Component,
    item: {
      id,
      name,
      left,
      top,
      width: dimensions.width,
      height: dimensions.height,
    },
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

        if (direction === "right") {
          newWidth = Math.min(
            containerWidth - left,
            startWidth + (moveEvent.clientX - startX)
          );
        } else if (direction === "bottom") {
          newHeight = Math.min(
            containerHeight - top,
            startHeight + (moveEvent.clientY - startY)
          );
        }

        const [snappedWidth, snappedHeight] = snapToGrid(newWidth, newHeight);
        setDimensions({
          width: Math.max(100, snappedWidth),
          height: Math.max(50, snappedHeight),
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

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Toggle form visibility
    setFormVisible((prev) => !prev);
  };

  const [borderRadius, setBorderRadius] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [textColor, setTextColor] = useState("");

  const boxStyle: CSSProperties = {
    position: "absolute",
    left,
    top,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    opacity: isDragging ? 0 : 1,
    backgroundColor: backgroundColor || "green", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: textColor || "white",
    borderRadius: `${borderRadius}px`,
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    cursor: isResizing ? "nwse-resize" : "pointer",
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
    cursor: "s-resize",
  };

  const formStyle: CSSProperties = {
    position: "absolute",
    left: left + dimensions.width + 10,
    top: top,
    backgroundColor: "#fff",
    border: "1px solid black",
    zIndex: 100,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    display: formVisible ? "block" : "none",
  };

  function chagneBorderRadius(radius: number) {
    setBorderRadius(radius);
  }

  function changeBackgroundColor(color: string) {
    setBackgroundColor(color);
  }
  function changeTextColor(color: string) {
    setTextColor(color);
  }

  const [resize, setResize] = useState(false);
  function enableResizing() {
    setResize(!resize);
  }

  return (
    <div onContextMenu={handleRightClick}>
      <button
        onDoubleClick={enableResizing}
        ref={drag}
        style={boxStyle}
        id={id}
      >
        Resizable Button
        {resize && (
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
      </button>
      {formVisible && (
        <div style={formStyle}>
          <DropdownItem
            chagneBorderRadius={chagneBorderRadius}
            changeBackgroundColor={changeBackgroundColor}
            changeTextColor={changeTextColor}
          />
        </div>
      )}
    </div>
  );
}
