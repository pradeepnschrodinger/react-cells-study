import logo from './logo.svg';
import './App.css';
import { Cell, Table } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';

import { CellFactory as CellFactoryHoC } from './cells/cell-hocs';
import { CellFactory as CellFactoryHooks } from './cells/cell-hooks';
import { useState } from 'react';

const CellFactories = [
  ["HoC", CellFactoryHoC],
  ["Hooks", CellFactoryHooks],
];

function App() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const [cellFactoryIndex, setCellFactoryIndex] = useState(0);
  console.log(CellFactories, cellFactoryIndex)
  const [currentCellFactoryName, CurrentCellFactory] = CellFactories[cellFactoryIndex];
  const CellFactorySwitchButton = () => {
    return <button onClick={() => setCellFactoryIndex((cellFactoryIndex + 1) % CellFactories.length)}>
      {currentCellFactoryName}
    </button>
  }

  return (
    <Table
      rowsCount={1000}
      rowHeight={50}
      headerHeight={50}
      width={vw}
      height={vh}
      stopScrollDefaultHandling={true}
      scrollableColumnsCount={1000}
      getScrollableColumn={(i) => {
        return {
          columnKey: i,
          width: 100,
          cell: CurrentCellFactory,
          header: CellFactorySwitchButton,
        };
      }}
      columnsCount={100}
    />
  );
}

export default App;
