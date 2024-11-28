import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const Table = ({ table, moveTable, removeTable  }) => {
  const [dimensions, setDimensions] = useState({
    width: 300,
    height: 250, 
  });
  const [resizing, setResizing] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setResizing(true);

    const startWidth = dimensions.width;
    const startHeight = dimensions.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(100, startWidth + e.clientX - startX); 
      const newHeight = Math.max(100, startHeight + e.clientY - startY); 
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };


  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'table',
    item: { id: table.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'table',
    hover: (draggedItem, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const newX = Math.max(0, table.position.x + delta.x);
      const newY = Math.max(0, table.position.y + delta.y);

      moveTable(draggedItem.id, { x: newX, y: newY });
    },
  }));

  const DraggableColumn = ({ column, tableId }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: 'column',
      item: { tableId, columnId: column.column_id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    return (
      <span
        ref={dragRef}
        style={{
          background: isDragging ? '#ddd' : 'transparent',
          cursor: 'move',
          display: 'inline-block',
        }}
      >
        {column.name}
      </span>
    );
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: 'absolute',
        top: table.position.y,
        left: table.position.x,
        background: isDragging ? '#ddd' : '#fff',
        border: '1px solid #ccc',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        zIndex: 100,
        padding: '10px',
        cursor: 'move',
        overflow: 'hidden',
      }}
    >
      <h4 style={{ textAlign: 'center' }}>{table.name}</h4>
      <div style={{ border: '1px solid #eee', padding: '5px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
                Column
              </th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
                Data Type
              </th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((col) => (
              <tr key={col.column_id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <DraggableColumn column={col} tableId={table.id} />
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{col.column_data_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => removeTable(table.id)}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: 'red',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Remove Table
      </button>
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: '10px',
          height: '10px',
          background: 'blue',
          position: 'absolute',
          bottom: '0',
          right: '0',
          cursor: 'nwse-resize',
        }}
      />
    </div>
  );
};

export default Table;
