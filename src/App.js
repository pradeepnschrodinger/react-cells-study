import logo from './logo.svg';
import './App.css';
import { Cell, Table } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import { FpsView } from 'react-fps';

import { CellFactory as CellFactoryHoC } from './cells/cell-hocs';
import { CellFactory as CellFactoryHooks } from './cells/cell-hooks';
import { CellFactory as CellFactoryHooksRecycled } from './cells/cell-hooks-recycled';
import { useEffect, useState } from 'react';

const CellFactories = [
  ["Hooks Recycled", CellFactoryHooksRecycled],
  ["HoC", CellFactoryHoC],
  ["Hooks Basic", CellFactoryHooks],
];

const ROW_COUNT = 1000;
const COLUMN_COUNT = 1000;
const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;

function App() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const [cellFactoryIndex, setCellFactoryIndex] = useState(0);
  const [currentCellFactoryName, CurrentCellFactory] = CellFactories[cellFactoryIndex];
  
  const cellFactorySwitchStyle = {
    position: 'absolute',
    right: '300px',
    zIndex: 10,
    border: '2px solid gray',
    borderRadius: '2px',
    width: 100,
    height: 50,
  }
  const cellFactorySwitch = (
    <button style={cellFactorySwitchStyle} onClick={() => setCellFactoryIndex((cellFactoryIndex + 1) % CellFactories.length)}>
      {currentCellFactoryName}
    </button>
  );

  const [ scrollLeft, setScrollLeft ] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setScrollLeft(scrollLeft + CELL_WIDTH / 4);
      // setScrollLeft(scrollLeft + 16);
    }, 16)
    return () => { clearInterval(intervalId) };
  }, [scrollLeft]);

  return (
    <div>
      <FpsView key={cellFactoryIndex} width={240} height={20} right={60} bottom={60}/>
      {cellFactorySwitch}
      <Table
        rowsCount={ROW_COUNT}
        rowHeight={CELL_HEIGHT}
        headerHeight={50}
        width={vw}
        height={vh}
        stopScrollDefaultHandling={true}
        scrollableColumnsCount={COLUMN_COUNT}
        scrollLeft={scrollLeft}
        onHorizontalScroll={(scrollLeft) => {
          setScrollLeft(scrollLeft)
          return false;
        }}
        getScrollableColumn={(i) => {
          return {
            columnKey: i,
            width: CELL_WIDTH,
            cell: CurrentCellFactory,
            header: CurrentCellFactory,
          };
        }}
        columnsCount={100}
      />
    </div>
  );
}

export default App;
