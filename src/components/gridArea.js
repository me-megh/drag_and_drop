import React, { useRef} from 'react';
import { useDrop } from 'react-dnd';
import Table from './table';

const GridArea = ({ tables, onDrop,moveTable,removeTable }) => {
  const gridRef = useRef(null);
  const [, drop] = useDrop(() => ({
    accept: 'table',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (item && clientOffset && gridRef.current) {
        const gridBounds = gridRef.current.getBoundingClientRect();
        const position = {
          x: clientOffset.x - gridBounds.left,
          y: clientOffset.y - gridBounds.top,
        };
        onDrop(item, position);
      }
    },
  }));

  return (
    
    <div
      ref={(node) => {
        gridRef.current = node;
        drop(node);
      }}
      style={{
        flex: 1,
        position: 'relative',
        background: '#e8e8e8',
        overflow: 'auto',
      }}
    >

      {tables.map((table) => (
        <Table
          key={table.id}
          table={table}
          removeTable={removeTable}
          moveTable={moveTable}
        />
      ))}
    </div>
  );
};

export default GridArea;
