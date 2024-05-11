// KeyTermsComponent.js
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import data from "./data.xlsx";
import "./KeyTermsComponent.css";

function KeyTermsComponent() {
  const [definitions, setDefinitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [definition, setDefinition] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(data);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileData = event.target.result;
          const workbook = XLSX.read(fileData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setDefinitions(jsonData);
        };
        reader.readAsBinaryString(blob);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const keyTerm = searchTerm.toLowerCase().trim();
    const foundDefinition = definitions.find(
      (row) => row["Key terms"].toLowerCase().trim() === keyTerm
    );
    if (foundDefinition) {
      setDefinition(foundDefinition["Definition"]);
    } else {
      const partialMatch = definitions.find((row) =>
        row["Key terms"].toLowerCase().includes(keyTerm)
      );
      if (partialMatch) {
        setDefinition(
          `No exact match found for "${searchTerm}". Did you mean "${partialMatch["Key terms"]}"?`
        );
      } else {
        setDefinition(`No definition found for "${searchTerm}"`);
      }
    }
  };

  return (
    <div className="keyterms-container">
      <h1 className="title">Excel Dictionary</h1>
      <input
        type="text"
        placeholder="Enter a key term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <button onClick={handleSearch} className="search-button">Search</button>
      <p className="definition">{definition}</p>
    </div>
  );
}

export default KeyTermsComponent;
