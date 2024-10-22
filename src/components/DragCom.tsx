import React, { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import Button from "./DragAble/Button";
import { ItemTypes } from "../types/ItemTypes";
import ResizeBox from "./DragAble/ResizeBox";
import CustomComponent from "./DragAble/CustomComponet";
import { Gridgap, GridSize_height, GridSize_width } from "../exports/GridSize";



const gridHeight = GridSize_height;
const gridWidth = GridSize_width;
const grid_gap = Gridgap;

const initaIalWidth = gridWidth * 3 + grid_gap * 2 + 2;
const initialHeight = gridHeight * 3 + grid_gap * 2 + 2;

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
  row: number;
  column: number;
 
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
const DraggableComponent = ({ id, name, left, top,row,column}: DraggableProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.Component,
    item: { id, name, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const style: CSSProperties = {
    position: "absolute",
    left,
    top,
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
    height: "50px",
    width: "100px",
    textAlign: "center",
    padding: "3px",
    backgroundColor: "white",
  };

  const startRow = row;
  const startColumn = column;
  const boxWidth = initaIalWidth;
  const boxHeight = initialHeight;

  const { lastRow, lastColumn } = lastRowCol(
    startRow,
    startColumn,
    boxWidth,
    boxHeight
  );
  
  if (name === "Box") {
      return (
          <ResizeBox lastcolumn={lastColumn} lastrow={lastRow} row={row} column={column}  id={id} name={name} left={left} top={top} />
      );
  }
  if(name === 'Button')
  {
    return(
        <Button  id={id} name={name} left={left} top={top} />
    )
  }
  if(name === 'Image')
  {
    return(
        <Button   id={id} name={name} left={left} top={top} />
    )
  }
  if(name === 'CustomComponent')
  {
    return(
      <CustomComponent  id={id} name={name} left={left} top={top} />
    )
  }
  return (
    <div ref={drag} style={style}>
      {name}
    </div>
  );
};

export default DraggableComponent;
