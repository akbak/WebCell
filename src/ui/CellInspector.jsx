import React from 'react';

const CellInspector = ({ cell }) => {
  if (!cell) {
    return (
      <div className="cell-inspector">
        <h3>Cell Inspector</h3>
        <p>No cell selected to inspect.</p>
      </div>
    );
  }

  return (
    <div className="cell-inspector">
      <h3>Cell Inspector</h3>
      <p><strong>ID:</strong> {cell.id}</p>
      <p><strong>Energy:</strong> {cell.energy.toFixed(2)}</p>
      <p><strong>Genotype:</strong> {cell.genotype.toFixed(4)}</p>
      {/* More detailed stats can be added here */}
    </div>
  );
};

export default CellInspector;
