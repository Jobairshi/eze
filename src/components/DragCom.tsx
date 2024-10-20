import React, { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import Button from "./DragAble/Button";
import { ItemTypes } from "../types/ItemTypes";
import ResizeBox from "./DragAble/ResizeBox";
import CustomComponent from "./DragAble/CustomComponet";





interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
  setIsacitve:React.Dispatch<React.SetStateAction<boolean>>;
}

const DraggableComponent = ({ id, name, left, top, setIsacitve }: DraggableProps) => {
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
          <ResizeBox setIsacitve={setIsacitve} id={id} name={name} left={left} top={top} />
      );
  }
  if(name === 'Button')
  {
    return(
        <Button setIsacitve={setIsacitve} id={id} name={name} left={left} top={top} />
    )
  }
  if(name === 'Image')
  {
    return(
        <Button setIsacitve={setIsacitve}  id={id} name={name} left={left} top={top} />
    )
  }
  if(name === 'CustomComponent')
  {
    return(
      <CustomComponent setIsacitve={setIsacitve} id={id} name={name} left={left} top={top} />
    )
  }
  return (
    <div ref={drag} style={style}>
      {name}
    </div>
  );
};

export default DraggableComponent;
