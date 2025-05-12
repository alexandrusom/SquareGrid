import { useState } from 'react'
import SquaresGrid from './SquaresGrid'
import './App.css'
import logo from './assets/ww-symbol-purple.png';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* Welcome Section */}
      <div className="text-center bg-transparent text-white py-4 mb-4 rounded-lg">
        <div className="flex items-center justify-center space-x-4">
          {/* Logo */}
          <img src={logo} alt="Logo" className="w-12 h-12" />
          {/* Title */}
          <h1 className="text-2xl font-bold">Welcome to the Squares Grid App!</h1>
        </div>
        <p className="text-lg">Don't worry about reloading the site and losing progress, we save the squares for you!</p>
      </div>
      <SquaresGrid />
    </div>
  );
}

export default App
