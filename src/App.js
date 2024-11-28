import React, { useState} from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TableList from './components/tableList';
import GridArea from './components/gridArea';

const App = () => {
  const [gridTables, setGridTables] = useState([]);

  const removeTable = (id) => {
    setGridTables((prevGridTables) =>
      prevGridTables.filter((t) => t.id !== id)
    );
  };
  const handleDrop = (table, position) => {
    setGridTables((prevGridTables) => {
      const existingTable = prevGridTables.find((t) => t.id === table.id);
      if (existingTable) {
        alert('Table already exists in the grid!');

        return prevGridTables.map((t) =>
          t.id === table.id ? { ...t, highlight: true } : t
        );
      }
      return [
        ...prevGridTables,
        { ...table, position, highlight: false },
      ];
    });
    setTimeout(() => {
      setGridTables((prevGridTables) =>
        prevGridTables.map((t) => ({ ...t, highlight: false }))
      );
    }, 1000);
  };
  
  const moveTable = (id, newPosition) => {
    setGridTables((prevGridTables) =>
      prevGridTables.map((table) =>
        table.id === id ? { ...table, position: newPosition } : table
      )
    );
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <TableList />
        <GridArea
          tables={gridTables}
          onDrop={handleDrop}
          removeTable={removeTable}
          moveTable={moveTable}
        />
      </div>
    </DndProvider>
  );
};

export default App;
