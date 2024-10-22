import React, { useState, CSSProperties, useCallback, useEffect } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import {
  Gridgap,
  GridSize_height,
  GridSize_width,
} from "../../exports/GridSize";
import DropdownItem from "../SubComponents/DropDown"; 

const gridHeight = GridSize_height;
const gridWidth = GridSize_width;
const grid_gap = Gridgap;
const containerWidth = 1000;
const containerHeight = 900;
const initaIalWidth = gridWidth * 3 + grid_gap * 2 + 2;
const initialHeight = gridHeight * 2 + grid_gap * 1 + 2;

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
  row: number;
  column: number;
  lastrow: number;
  lastcolumn: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX =
    Math.round(x / (gridWidth + grid_gap)) * (gridWidth + grid_gap) -
    grid_gap +
    2;
  const snappedY =
    Math.round(y / (gridHeight + grid_gap)) * (gridHeight + grid_gap) -
    grid_gap +
    2;
  return [snappedX, snappedY];
}

function lastRowCol(
  startRow: number,
  startColumn: number,
  boxWidth: number,
  boxHeight: number
) {
  const boxWidthUnits = Math.round(boxWidth / (gridWidth + grid_gap));
  const boxHeightUnits = Math.round(boxHeight / (gridHeight + grid_gap));

  const lastColumn = startColumn + boxWidthUnits - 1;
  const lastRow = startRow + boxHeightUnits - 1;

  return { lastRow, lastColumn };
}

export default function ResizeBox({
  id,
  name,
  left,
  top,
  row,
  column,
  lastcolumn,
  lastrow,
}: DraggableProps) {
  const [dimensions, setDimensions] = useState({
    width: initaIalWidth,
    height: initialHeight,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [prevLastRow, setPrevLastRow] = useState(lastrow);
  const [prevLastColumn, setPrevLastColumn] = useState(lastcolumn);

  const [currLastRow, setCurrLastRow] = useState(lastrow);
  const [currLastColumn, setCurrLastColumn] = useState(lastcolumn);

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
      let flag = false; 
  
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
  
        const boxWidth = newWidth;
        const boxHeight = newHeight;
  
        const { lastRow, lastColumn } = lastRowCol(
          row,
          column,
          boxWidth,
          boxHeight
        );
        if ((lastRow !== prevLastRow || lastColumn !== prevLastColumn)) {
          //  snap to grid
          const [snappedWidth, snappedHeight] = snapToGrid(newWidth, newHeight);
  
          setDimensions({
            width: Math.max(initaIalWidth, snappedWidth),
            height: Math.max(initialHeight, snappedHeight),
          });
  
          setCurrLastColumn(lastColumn);
          setCurrLastRow(lastRow);
          setPrevLastRow(lastRow);
          setPrevLastColumn(lastColumn);
          flag = true;
        } else {
          
          setDimensions({
            width: Math.max(initaIalWidth, newWidth),
            height: Math.max(initialHeight, newHeight),
          });
        }
      };
  
      const onMouseUp = () => {
        if(!flag){
         setDimensions({
            width: Math.max(initaIalWidth, dimensions.width),
            height: Math.max(initialHeight, dimensions.height),
         })
        }
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        setIsResizing(false);
      };
  
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [dimensions, left, top, prevLastRow, prevLastColumn, row, column]
  );
  

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
    cursor: "s-resize",
  };

  const formStyle: CSSProperties = {
    position: "absolute",
    left: left + dimensions.width + 20,
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

  useEffect(()=>{
    const { lastRow, lastColumn } = lastRowCol(
      row,
      column,
      dimensions.width,
      dimensions.height
    );
    setCurrLastRow(
      lastRow
    );
    setCurrLastColumn(lastColumn)
  },[row,column])


  

 

  return (
    <div onContextMenu={handleRightClick}>
      <button onDoubleClick={enableResizing} ref={drag} style={boxStyle} id={id}>
        Resizable Button
        <div style={{fontSize:'10px'}}>
          <p>
           start row column : {row}, {column}
          </p>
          <>
          previous row column : {prevLastRow}, {prevLastColumn}
          </>
          <p>
           last row column : {currLastRow}, {currLastColumn}
          </p>
        </div>
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
