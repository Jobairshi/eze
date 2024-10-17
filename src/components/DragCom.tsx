import React, { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import Button from "./DragAble/Button";
import { ItemTypes } from "../types/ItemTypes";
import ResizeBox from "./DragAble/ResizeBox";





interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
}

const DraggableComponent = ({ id, name, left, top }: DraggableProps) => {
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
  if (name === "Box") {
      return (
          <ResizeBox id={id} name={name} left={left} top={top} />
      );
  }
  if(name === 'Button')
  {
    return(
        <Button id={id} name={name} left={left} top={top} />
    )
  }
  if(name === 'Image')
  {
    return(
        <Button  id={id} name={name} left={left} top={top} />
    )
  }
  return (
    <div ref={drag} style={style}>
      {name}
    </div>
  );
};

export default DraggableComponent;
