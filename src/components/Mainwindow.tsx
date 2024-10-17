import { CSSProperties, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import DraggableComponent from "./DragCom";
import { ItemTypes } from "../types/ItemTypes";

interface item {
  id: string;
  name: string;
  left: number;
  top: number;
}
export default function Mainwindow() {
  const [items, setDrop] = useState<item[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);
  const [id, setId] = useState<string>("");
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.Component,
    drop: (item: item, monitor) => {
      const delta = monitor.getSourceClientOffset();
      if (!delta) {
        return;
      }
      const { id, name } = item;
      const left = delta.x;
      const top = delta.y;
      setDrop((previtem) => {
        const exist = previtem.findIndex((item) => item.id === id);
        if (exist !== -1) {
          const updatedItem = [...previtem];
          updatedItem[exist] = { ...updatedItem[exist], left, top };
          return updatedItem;
        }
        setId(id);
        return [...previtem, { id, name, left, top }];
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const style: CSSProperties = {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    border: "1px groove black",
    borderRadius: "10px",
  };
  const gridstyle: CSSProperties = {
    height: "100%",
    width: "100%",
    display: "grid",
    backgroundColor: "#dedede",
    backgroundImage: `linear-gradient(#ffffff 2px, transparent 2px), 
            linear-gradient(90deg, #ffffff 2px, transparent 2px)`,
    backgroundSize: "calc(100% / 50) calc(100% / 50)",
  };
  const isActive = isOver && canDrop;
  // console.log(id);
  useEffect(() => {
    if (id) {
      const element = document.getElementById(id);
      console.log(element);
    //   dropRef.current?.appendChild(element as Node);
    }
  }, [id]);

  return (
    <div
      ref={(node) => drop((dropRef.current = node))}
      style={isActive ? gridstyle : style}
    >
      {items.map((item) => {
        return (
            <DraggableComponent
              key={item.id}
              name={item.name}
              left={item.left}
              top={item.top}
              id={item.id}
            />
        );
      })}
    </div>
  );
}
