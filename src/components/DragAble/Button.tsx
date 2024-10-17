import React, { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";

interface DraggableProps {
  id: string;
  name: string;
  left: number;
  top: number;
}

export default function Button({ id, name, left, top }: DraggableProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.Component,
    item: { id, name, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const buttonWrapperStyle: CSSProperties = {
    position: "absolute",
    left,
    top,
    opacity: isDragging ? 0 : 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "120px",
    borderRadius: "8px",
    cursor: "grab",
  };

  const buttonStyle: CSSProperties = {
    width: "100%",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#4a90e2",
    backgroundImage: "linear-gradient(45deg, #4a90e2, #0077b6)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  return (
    <div ref={drag} style={buttonWrapperStyle} id={id}>
      <button type="submit" style={buttonStyle}>
        Submit
      </button>
    </div>
  );
}
