import './App.css';
import React, { useEffect, useState } from "react";
import { getCsvContent } from "./utils/currencyUtils";
import { fetchConversionData } from "./services/currencyService";

const App = () => {
  const [csvContent, setCsvContent] = useState("");

  useEffect(() => {
    // Fetch the conversion data and generate the CSV content before the page is loaded
    prepareCsvContent();
  }, []);

  const prepareCsvContent = async () => {
    try {
      // Fetch the conversion data from the API
      const data = await fetchConversionData();

      // Generate the CSV content based on the conversion data
      const content = getCsvContent(data);

      // Set the generated CSV content in the component state
      setCsvContent(content);
    } catch (err) {
      console.error("Error preparing data:", err);
    }
  };

  // The name of the CSV file to be downloaded
  const csvFileName = "currency_conversions.csv";
  // Create the download link for the CSV file
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(
    csvContent
  )}`;

  return (
    <div className="App">
      <header className="App-header">
      {
        // Render the download link if the CSV content is available
        csvContent ? (
          <a className="App-link" href={csvHref} download={csvFileName}>
            Download Currencies
          </a>
        ) : (
          // Render a loading message while the CSV content is being prepared
          <p>Loading...</p>
        )
      }
      </header>
    </div>
  );
};

export default App;
