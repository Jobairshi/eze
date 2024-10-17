import { CSSProperties, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import DraggableComponent from "./DragCom";
import { ItemTypes } from "../types/ItemTypes";

// Define the grid size, where each grid cell will be 32x32 pixels
const GRID_SIZE = 32;

// Interface for draggable items
interface item {
  id: string;
  name: string;
  left: number;
  top: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
  return [snappedX, snappedY];
}

export default function Mainwindow() {
  const [items, setItems] = useState<item[]>([]); 
  const dropRef = useRef<HTMLDivElement>(null);
  const [id, setId] = useState<string>("");

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.Component,
    drop: (item: item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) {
        return;
      }
      const { id, name } = item;
      let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);
        

      [left, top] = snapToGrid(left, top);

      setItems((prevItems) => {
        const exist = prevItems.findIndex((existingItem) => existingItem.id === id);
        if (exist !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[exist] = { ...updatedItems[exist], left, top };
          return updatedItems;
        }
        setId(id);
        return [...prevItems, { id, name, left, top }];
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const gridWidth = 1000; 
  const gridHeight = 900; 
  const numCols = Math.floor(gridWidth / GRID_SIZE); 
  const numRows = Math.floor(gridHeight / GRID_SIZE); 

  const gridCells = Array.from({ length: numCols * numRows }, (_, index) => ({
    row: Math.floor(index / numCols),
    col: index % numCols,
  }));

  useEffect(() => {
    if (id) {
      const element = document.getElementById(id);
      console.log(element);
    }
  }, [id]);

  return (
    <div
      ref={(node) => drop((dropRef.current = node))}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, ${GRID_SIZE}px)`,
        gridTemplateRows: `repeat(${numRows}, ${GRID_SIZE}px)`,
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
        border: "2px solid black",
        position: "relative",
      }}
    >
      {gridCells.map(({ row, col }) => (
        <div
          key={`${row}-${col}`}
          style={{
            width: GRID_SIZE,
            height: GRID_SIZE,
            border: "1px solid #ddd",
            boxSizing: "border-box",
            backgroundColor: isOver ? "#f0f0f0" : "transparent",
          }}
        />
      ))}

      {items.map((item) => (
        <DraggableComponent
          key={item.id}
          id={item.id}
          name={item.name}
          left={item.left}
          top={item.top}
        />
      ))}
    </div>
  );
}
