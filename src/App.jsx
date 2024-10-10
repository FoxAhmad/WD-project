import React from 'react';
import Home from './components/HomePage'; // Assuming you store your components in a 'components' folder
import './App.css'; // Make sure to import your CSS for Tailwind
import './index.css'; // Make sure to import your CSS for Tailwind
const App = () => {
  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;

