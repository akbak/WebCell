import React from 'react';

const Controls = ({ environment, setEnvironment, stats }) => {
  const handleEnvChange = (e) => {
    const { name, value } = e.target;
    setEnvironment(prev => ({ ...prev, [name]: Number(value) }));
  };

  return (
    <div className="controls">
      <div className="stats-display">
        <h3>Simulation Stats</h3>
        <p>Cell Count: {stats.cellCount}</p>
      </div>

      <h3>Environment Controls</h3>
      <div>
        <label>Temperature: {environment.temperature}°C</label>
        <input 
          type="range" 
          name="temperature"
          min="0" 
          max="100" 
          value={environment.temperature}
          onChange={handleEnvChange}
        />
      </div>
      <div>
        <label>Light Level: {environment.light}</label>
        <input 
          type="range" 
          name="light"
          min="0" 
          max="100" 
          value={environment.light}
          onChange={handleEnvChange}
        />
      </div>
      <div>
        <label>pH: {environment.ph}</label>
        <input 
          type="range" 
          name="ph"
          min="0" 
          max="14" 
          step="0.1" 
          value={environment.ph}
          onChange={handleEnvChange}
        />
      </div>
    </div>
  );
};

export default Controls;
