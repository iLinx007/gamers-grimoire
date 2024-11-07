import { useState } from 'react';
import './App.css';
import Navbar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [showRegister, setShowRegister] = useState(false);

  // Toggle between login and register
  const toggleForm = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-bold text-center">Welcome to My Website</h1>
        <p className="mt-4 text-center">GAMER'S GRIMOIRE.</p>

        {/* Conditional rendering of Login/Register components */}
        {showRegister ? <Register /> : <Login />}

        {/* Toggle button to switch between forms */}
        <div className="text-center mt-4">
          <button 
            onClick={toggleForm} 
            className="bg-blue-500 text-white py-2 px-4 rounded">
            {showRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
