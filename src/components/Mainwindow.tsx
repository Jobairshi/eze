import { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import DraggableComponent from "./DragCom";
import { ItemTypes } from "../types/ItemTypes";
import { Gridgap, GridSize_height, GridSize_width } from "../exports/GridSize";

const gridHeight = GridSize_height;
const gridWidth = GridSize_width;
const grid_gap = Gridgap;

interface item {
  id: string;
  name: string;
  left: number;
  top: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX =
    Math.round(x / (gridWidth + grid_gap)) * (gridWidth + grid_gap);
  const snappedY =
    Math.round(y / (gridHeight + grid_gap)) * (gridHeight + grid_gap);
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

      if (isNaN(item.left) || isNaN(item.top)) {
        const temps = monitor.getInitialClientOffset();
        if (!temps) return;
        left = temps.x;
        top = temps.y;
      }

      [left, top] = snapToGrid(left, top);

      setItems((prevItems) => {
        const exist = prevItems.findIndex(
          (existingItem) => existingItem.id === id
        );
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

  const con_w = 1000;
  const con_h = 900;

  const numCols = Math.floor(con_w / (gridWidth + grid_gap));
  const numRows = Math.floor(con_h / (gridHeight + grid_gap));

  const gridCells = Array.from({ length: numCols * numRows }, (_, index) => ({
    row: Math.floor(index / numCols),
    col: index % numCols,
  }));

  const isActive = isOver && canDrop;
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className="parent"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, ${gridWidth}px)`,
        gridTemplateRows: `repeat(${numRows}, ${gridHeight}px)`,
        gap: `${grid_gap}px`,
        width: `${con_w}px`,
        height: `${con_h}px`,
        border: "2px solid black",
        position: "relative",
      }}
    >
      {gridCells.map(({ row, col }) => (
        <div
          key={`${row}-${col}`}
          style={{
            width: gridWidth,
            height: gridHeight,
            border: "1px solid #ddd",
            backgroundColor: isActive ? "black" : "transparent",
          }}
        />
      ))}

      {items.map((item) => {
        const row = Math.ceil(item.top / (gridHeight + grid_gap));
        const col = Math.ceil(item.left / (gridWidth + grid_gap));

        return (
          <div key={item.id} style={{ position: "absolute" }}>
            <DraggableComponent
              name={item.name}
              left={item.left}
              top={item.top}
              id={item.id}
            />
            <div
              style={{
                position: "absolute",
                top: item.top,
                left: item.left,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "2px",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h4>{`Row: ${row}, Col: ${col}`}</h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
