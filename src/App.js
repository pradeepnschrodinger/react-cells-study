import logo from './logo.svg';
import './App.css';
import { Cell, Table } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';

import { CellFactory as CellFactoryHoC } from './cells/cell-hocs';
import { CellFactory as CellFactoryHooks } from './cells/cell-hooks';
import { useState } from 'react';

const CellFactories = [
  ["Hooks", CellFactoryHooks],
  ["HoC", CellFactoryHoC],
];

const ROW_COUNT = 1000;
const COLUMN_COUNT = 1000;

function App() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const [cellFactoryIndex, setCellFactoryIndex] = useState(0);
  const [currentCellFactoryName, CurrentCellFactory] = CellFactories[cellFactoryIndex];
  
  const CellFactorySwitchButton = () => {
    return <button onClick={() => setCellFactoryIndex((cellFactoryIndex + 1) % CellFactories.length)}>
      {currentCellFactoryName}
    </button>
  }

  return (
    <Table
      rowsCount={ROW_COUNT}
      rowHeight={50}
      headerHeight={50}
      width={vw}
      height={vh}
      stopScrollDefaultHandling={true}
      scrollableColumnsCount={COLUMN_COUNT}
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
