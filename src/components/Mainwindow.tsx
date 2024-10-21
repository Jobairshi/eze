import { CSSProperties, isValidElement, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import DraggableComponent from "./DragCom";
import { ItemTypes } from "../types/ItemTypes";
import { GridSize } from "../exports/GridSize";

const grd_sz = GridSize;
const grid_gap = 3;

interface item {
  id: string;
  name: string;
  left: number;
  top: number;
}

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / (grd_sz + grid_gap)) * (grd_sz + grid_gap + 0.07);
  const snappedY = Math.round(y / (grd_sz + grid_gap )) * (grd_sz + grid_gap + 0.15 );
  return [snappedX, snappedY];
}

export default function Mainwindow() {
  
  const [items, setItems] = useState<item[]>( []
    // JSON.parse(localStorage.getItem("items") || "[]")
  );
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
        const temps = monitor.getInitialClientOffset();
        
        if(!temps)
          return;
        left = temps.x;
        top = temps.y;
       console.log('first time left, right ', left, top);
        flag = true;
      }
      console.log(left, top);
      
     //   console.log('i am in snap');
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
  const numCols = Math.floor(gridWidth / (grd_sz + grid_gap));
  const numRows = Math.floor(gridHeight / (grd_sz + grid_gap));

  const gridCells = Array.from({ length: numCols * numRows }, (_, index) => ({
    row: Math.floor(index / numCols),
    col: index % numCols,
  }));

  // useEffect(() => {
  //   if (id) {
  //     //localStorage.setItem("items", JSON.stringify(items));
  //     localStorage.setItem('fullwindow', JSON.stringify(dropRef.current));
  //     // console.log(dropRef.current);
  //   }
  // }, [id]);
   const isActive = isOver && canDrop;
   drop(dropRef)
  return (
    <div
      ref={dropRef}
      className="parent"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, ${grd_sz}px)`,
        gridTemplateRows: `repeat(${numRows}, ${grd_sz}px)`,
        gridGap: `${grid_gap}px`,
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
        border: "2px solid black",
        position: "relative",
      }}
    >
      
      { gridCells.map(({ row, col }) => (
        <div
          key={`${row}-${col}`}
          style={{
            position:'absolute',
            margin: 2,
            top: row * (grd_sz + grid_gap),
            left: col * (grd_sz + grid_gap),
            width: grd_sz,
            height: grd_sz,
            border: "1px solid #ddd",
            boxSizing: "border-box",
            backgroundColor:isActive? 'black':'transparent',
          }}
        />
      ))}

      {items.map((item) => {
        const row = Math.ceil(item.top / (grd_sz + grid_gap));
        const col = Math.ceil(item.left / (grd_sz + grid_gap));
        return (
          <div  key={item.id} style={{ position: 'relative' }}>
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
                <h4 style={{display:'flex', flexDirection:'row'}}> {`Row: ${row}, Col: ${col}`}</h4>
                {/* <h4 style={{display:'flex', flexDirection:'row'}}> {`Top: ${Math.floor(item.top)}, Left: ${Math.floor(item.left)}`}</h4> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}