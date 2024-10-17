import { CSSProperties, isValidElement, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import DraggableComponent from "./DragCom";
import { ItemTypes } from "../types/ItemTypes";

const grd_sz = 32;

interface item {
  id: string;
  name: string;
  left: number;
  top: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / grd_sz) * grd_sz;
  const snappedY = Math.round(y / grd_sz) * grd_sz;
  return [snappedX, snappedY];
}

export default function Mainwindow() {
  const [items, setItems] = useState<item[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);
  const [id, setId] = useState<string>("");
  const [tracX, setTracX] = useState<number>(0);
  const [tracY, setTracY] = useState<number>(0);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.Component,
    drop: (item: item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) {
        return;
      }
      const { id, name } = item;
      console.log(item.left, item.top);
      console.log(delta.x, delta.y);
      setTracX(delta.x);
      setTracY(delta.y);
      let flag = false;
      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);
      if (isNaN(item.left) || isNaN(item.top)) {
        const temps = monitor.getClientOffset();
        
        if(!temps)
          return;
        left = temps.x;
        top = temps.y;
       console.log('first time left, right ', left, top);
        flag = true;
      }
      console.log(left, top);
      if(!flag)
      {
        console.log('i am in snap');
        [left, top] = snapToGrid(left, top);
      }

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
  const isActive = isOver && canDrop;

  const gridWidth = 1000;
  const gridHeight = 900;
  const numCols = Math.floor(gridWidth / grd_sz);
  const numRows = Math.floor(gridHeight / grd_sz);

  const gridCells = Array.from({ length: numCols * numRows }, (_, index) => ({
    row: Math.floor(index / numCols),
    col: index % numCols,
  }));

  useEffect(() => {
    if (id) {
      const element = document.getElementById(id);
      // console.log(element);
    }
  }, [id]);
   drop(dropRef)
  return (
    <div
      ref={dropRef}
      style={{
        
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, ${grd_sz}px)`,
        gridTemplateRows: `repeat(${numRows}, ${grd_sz}px)`,
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
        border: "2px solid black",
        position: "relative",
       
      }}
    >
      
      {isActive && gridCells.map(({ row, col }) => (
        <div
          key={`${row}-${col}`}
          style={{
            position:'absolute',
            top: row * grd_sz,
            left: col * grd_sz,
            width: grd_sz,
            height: grd_sz,
            border: "1px solid #ddd",
            boxSizing: "border-box",
            backgroundColor:isActive? '#f0f0f0':'transparent',
         
          }}
        />
      ))}

      {items.map((item) => {
        const row = Math.floor(item.top / grd_sz);
        const col = Math.floor(item.left / grd_sz);
        return (
          <div key={item.id} style={{ position: 'relative' }}>
            <DraggableComponent
              name={item.name}
              left={item.left}
              top={item.top}
              id={item.id}
            />
            <div style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: '2px',
              borderRadius: '3px',
              fontSize: '12px',
            }}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <h4 style={{display:'flex', flexDirection:'row'}}>{`top: ${item.top}, left: ${item.left}`}</h4>
                <h4 style={{display:'flex', flexDirection:'row'}}> {`Row: ${row}, Col: ${col}`}</h4>
                <h4 style={{display:'flex', flexDirection:'row'}}>{`TracX: ${tracX}, TracY: ${tracY}`}</h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}