import React, { useState } from "react";
import { CSSProperties } from "react";

interface CustomFormProps {
  chagneBorderRadius: (radius: number) => void;
  changeBackgroundColor: (color: string) => void;
  changeTextColor: (color: string) => void;
}


const styles: { [key: string]: CSSProperties } = {
  container: {
    border: "1px solid #ddd",
    padding: "16px",
    borderRadius: "8px",
    width: "200px", 
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
  },
  formInput: {
    flex: 1, 
    width:'60px',
    padding: "10px",
    margin: "0", 
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  submitButton: {
    height: "40px",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#FFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#218838",
  },
  formLabel: {
    marginBottom: "0", 
    fontSize: "12px",
    color: "#555",
    whiteSpace: "nowrap", 
  },
  formRow: {
    display: "flex",
    alignItems: "center", 
    gap: "10px",
    marginBottom: "10px", 
  },
};

export default function CustomForm (props: CustomFormProps) {
  const [colorHex, setColorHex] = useState("");
  const [radius, setRadius] = useState("");
  const [textColor, setTextColor] = useState("");
  const [hovered, setHovered] = useState(false); // To handle hover effect

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Color Hex:", colorHex);
    console.log("Radius:", radius);
    console.log("Text Color:", textColor);
    
    props.changeBackgroundColor(colorHex);
    props.chagneBorderRadius(parseInt(radius));
    props.changeTextColor(textColor);

  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <label style={styles.formLabel} htmlFor="colorHex">
            Color Hex/Name:
          </label>
          <input
            id="colorHex"
            type="text"
            placeholder="#000000"
            style={styles.formInput}
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
          />
        </div>

        <div style={styles.formRow}>
          <label style={styles.formLabel} htmlFor="radius">
           Border Radius:
          </label>
          <input
            id="radius"
            type="number"
            placeholder="5px"
            style={styles.formInput}
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
        </div>

        <div style={styles.formRow}>
          <label style={styles.formLabel} htmlFor="textColor">
            Text Color Hex/Name:
          </label>
          <input
            id="textColor"
            type="text"
            placeholder="#FFFFFF"
            style={styles.formInput}
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.submitButton,
            ...(hovered ? styles.submitButtonHover : {}),
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

