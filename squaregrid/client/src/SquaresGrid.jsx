import { useState, useEffect } from 'react';
import './App.css';

export default function SquaresGrid() {
  const [squareCount, setSquareCount] = useState(0);
  const [grid, setGrid] = useState([]); 
  const [isGridLoaded, setIsGridLoaded] = useState(false); // Track if the grid has been loaded(Fixed the issue of saving an empty grid)
  const [lastAddedColor, setLastAddedColor] = useState(null); // Track the last added square's color(to avoid duplicates)

  // Function to add a new square
  const handleAddSquare = () => {
    setSquareCount((prev) => {
      const newCount = prev + 1;
      updateGrid(newCount);
      return newCount;
    });
  };

  // Function to clear the grid and update the backend
  const handleClear = () => {
    setSquareCount(0);
    setGrid([]);
    saveGridToFile([]); // Update backend with an empty JSON
  };

  // Function to update the grid with a new square
  const updateGrid = (newCount) => {
    const gridSize = Math.ceil(Math.sqrt(newCount));
    const newGrid = grid.map((row) => [...row]); // Deep copy of the grid

    // List of colors
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'];

    // Ensure the grid has enough rows
    while (newGrid.length < gridSize) {
      newGrid.push(Array(gridSize).fill(null));
    }

    // Ensure the last row has enough columns 
    for (let i = 0; i < newGrid.length; i++) {
      while (newGrid[i].length < gridSize) {
        newGrid[i].push(null);
      }
    }

    // Add the next square
    outerLoop: for (let i = 0; i < newGrid.length; i++) {
      const isBottomRow = i === newGrid.length - 1; // Check if it's the bottom row
      const columnIndices = isBottomRow
        ? [...newGrid[i].keys()].reverse() // Reverse column order for the bottom row
        : [...newGrid[i].keys()]; // Normal column order for other rows

      for (const j of columnIndices) {
        if (newGrid[i][j] === null) {
          // Filter out the last added color
          const availableColors = colors.filter((color) => color !== lastAddedColor);

          // Ensure there are available colors
          if (availableColors.length === 0) {
            console.error('No available colors to choose from!');
            return;
          }

          // Select a new color from the available colors
          const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];

          // Add the new square with the selected color
          newGrid[i][j] = { number: newCount, color: newColor };

          // Update the last added color
          setLastAddedColor(newColor);

          break outerLoop; // Exit both loops after adding one square
        }
      }
    }

    // Update the grid state
    setGrid(newGrid);
  };

  const saveGridToFile = async (gridData = grid) => {
    try {
      console.log('Saving grid to backend:', gridData); // Log the grid data being sent

      const response = await fetch('http://localhost:5100/api/saveposition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gridData),
      });

      if (response.ok) {
        console.log('Grid saved successfully!');
      } else {
        console.error('Failed to save the grid.');
      }
    } catch (error) {
      console.error('An error occurred while saving the grid:', error);
    }
  };

  const loadGridFromFile = async () => {
    try {
      const response = await fetch('http://localhost:5100/api/saveposition');
      if (response.ok) {
        const savedGrid = await response.json();
        setGrid(savedGrid); // Restore grid from backend
        setSquareCount(savedGrid.flat().filter((cell) => cell !== null).length); // Update squareCount
        setIsGridLoaded(true); // Mark the grid as loaded
      } else {
        console.error('Failed to load the grid.');
      }
    } catch (error) {
      console.error('An error occurred while loading the grid:', error);
    }
  };

  // Save the grid whenever it changes, but only after it has been loaded
  useEffect(() => {
    if (isGridLoaded) {
      saveGridToFile(grid);
    }
  }, [grid, isGridLoaded]);

  // Load the grid from the backend on page load
  useEffect(() => {
    loadGridFromFile();
  }, []);

  const gridSize = Math.ceil(Math.sqrt(squareCount));

  return (
    <div className="max-w-screen-lg mx-auto p-4 flex flex-col items-center min-h-screen text-white">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleAddSquare}
          className="px-4 py-2 text-white rounded border border-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: '#242424' }}        >
          Add Square
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 text-white rounded border border-white hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          style={{ backgroundColor: '#242424' }}        >
          Clear
        </button>
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((val, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`w-16 h-16 flex items-center justify-center rounded shadow-md text-sm font-semibold ${
                val ? `${val.color} text-gray-700 hover:${val.color.replace('-500', '-600')}` : 'invisible'
              }`}
            >
              {val?.number}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
