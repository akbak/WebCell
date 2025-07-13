import React, { useState } from 'react';
import Controls from './ui/Controls';
import SimulationCanvas from './simulation/SimulationCanvas';
import CellInspector from './ui/CellInspector';

function App() {
  const [environment, setEnvironment] = useState({
    temperature: 50, // Initial temperature
    light: 50,       // Initial light
    ph: 7,           // Initial pH
  });

  const [stats, setStats] = useState({
    cellCount: 0,
  });

  const [inspectedCell, setInspectedCell] = useState(null);

  return (
    <div className="app-container">
      <div className="controls-panel">
        <Controls environment={environment} setEnvironment={setEnvironment} stats={stats} />
      </div>
      <div className="simulation-panel">
        <SimulationCanvas environment={environment} setStats={setStats} setInspectedCell={setInspectedCell} />
      </div>
      <div className="inspector-panel">
        <CellInspector cell={inspectedCell} />
      </div>
    </div>
  );
}

export default App;
