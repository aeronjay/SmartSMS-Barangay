import { BorderLeft } from "@mui/icons-material";
import React, { useState } from "react";

export default function SettingsCard({ label, optionValues, setOnChange, selectedValue  }) {

  // Inline styles
  const selectStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
    fontSize: "16px",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "border-color 0.3s, box-shadow 0.3s",
  };

  return (
    <div style={{margin: "0px 0px 30px 0px"}}>
      <h3>{label}:</h3>
      <select
        value={selectedValue}
        onChange={setOnChange}
        style={selectStyle} 
      >
        {optionValues?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
