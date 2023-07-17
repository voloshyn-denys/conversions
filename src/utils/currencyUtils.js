// Build the conversion graph based on the conversion data
export const buildConversionGraph = (conversionData) => {
	const graph = {};
  
	for (const conversion of conversionData) {
	  const { fromCurrencyCode, toCurrencyCode, exchangeRate } = conversion;
  
	  if (!graph[fromCurrencyCode]) {
		graph[fromCurrencyCode] = [];
	  }
  
	  graph[fromCurrencyCode].push({ toCurrencyCode, exchangeRate });
	}
  
	return graph;
  };
  
  // Recursively find the best conversion path and amount for each currency
  export const findBestConversionPath = (
	graph,
	startCurrency,
	currentPath,
	currentAmount,
	bestPaths,
	bestAmounts
  ) => {
	if (!graph[startCurrency]) return;
  
	for (const { toCurrencyCode, exchangeRate } of graph[startCurrency]) {
	  const newAmount = currentAmount * exchangeRate;
	  const newPath = `${currentPath} | ${toCurrencyCode}`;

	  if (
		// Check if the currency code is not present in bestAmounts or the new amount is greater than the existing amount
		!bestAmounts[toCurrencyCode] || newAmount > bestAmounts[toCurrencyCode]
	  ) {
		// Update the bestAmounts with the new amount
		bestAmounts[toCurrencyCode] = newAmount;
	  
		// Update the bestPaths with the new path
		bestPaths[toCurrencyCode] = newPath;
	  }
  
	  // Recursive call to explore further paths
	  findBestConversionPath(
		graph,
		toCurrencyCode,
		newPath,
		newAmount,
		bestPaths,
		bestAmounts
	  );
	}
  };
  
  // Calculate the optimal conversions for each currency
  export const calculateOptimalConversions = (graph) => {
	const bestPaths = {};
	const bestAmounts = {};
  
	// Start the recursive traversal from CAD with initial path "CAD" and amount 100
	findBestConversionPath(graph, "CAD", "CAD", 100, bestPaths, bestAmounts);
  
	return { bestPaths, bestAmounts };
  };
  
  // Generate the CSV content based on the conversions
  export const generateCsvFile = (conversions) => {
	const rows = [
	  [
		"Currency Code",
		"Currency Name",
		"Amount of currency",
		"Path for the best conversion rate"
	  ]
	];
  
	for (const currencyCode in conversions) {
	  const { currencyName, amount, path } = conversions[currencyCode];
	  rows.push([currencyCode, currencyName, amount, path]);
	}
  
	const csvContent = rows.map((row) => row.join(",")).join("\n");
  
	return csvContent;
  };
  
  // Convert the data, bestPaths, and bestAmounts into a format suitable for CSV generation
  export const getConversions = ({ data, bestPaths, bestAmounts }) => {
	const conversions = {};
  
	for (const currencyCode in bestPaths) {
	  const currencyName = data.find(
		(data) => data.toCurrencyCode === currencyCode
	  ).toCurrencyName;
	  const amount = bestAmounts[currencyCode];
	  const path = bestPaths[currencyCode];
  
	  conversions[currencyCode] = { currencyName, amount, path };
	}
  
	return conversions;
  };
  
  // Get the CSV content based on the provided data
  export const getCsvContent = (data) => {
	const graph = buildConversionGraph(data);
	const { bestPaths, bestAmounts } = calculateOptimalConversions(graph);
	const conversions = getConversions({ data, bestPaths, bestAmounts });
	const content = generateCsvFile(conversions);
  
	return content;
  };
  