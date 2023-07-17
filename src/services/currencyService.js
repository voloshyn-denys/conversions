import mockData from "../mocks/currencyConversion.json";

const SEED = 29808;

export const fetchConversionData = async () => {
  try {
    const apiUrl = `currency-conversion?seed=${SEED}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data;
  } catch (err) {
    console.error("Error fetching conversion data:", err);

    return mockData;
  }
};
