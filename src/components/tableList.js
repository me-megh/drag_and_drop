import React , { useState }from 'react';
import { useDrag, useDrop } from "react-dnd";

const TableList = () => {
  const [tables, setTables] = useState([
    {
      id: 1,
    name: 'table_name1',
    columns: [
      {
        column_id: 'col_1',
      name: 'column_name',
      column_data_type: 'data_type'
    },
  {
    column_id: 'col_2',
    name: 'column_name',
    column_data_type: 'data_type'
  }
    ]
    },
{
  id: 2,
  name: 'table_name2',
  columns: [
    {
      column_id: 'col_3',
    name: 'column_name',
    column_data_type: 'data_type'
    },
{
  column_id: 'col_4',
  name: 'column_name',
  column_data_type: 'data_type'
}
    ]
    }
    ])

  const moveTable = (dragIndex, hoverIndex) => {
    const updatedTables = [...tables];
    const [movedTable] = updatedTables.splice(dragIndex, 1);
    updatedTables.splice(hoverIndex, 0, movedTable);
    setTables(updatedTables);
  };

  return (
    <div style={{ width: '20%', background: '#f4f4f4', padding: '10px' }}>
      <h3>Tables</h3>
      {tables.map((table, index) => (
        <DraggableTable key={table.id} table={table} index={index} moveTable={moveTable} />
      ))}
    </div>
  );
};

const DraggableTable = ({ table, index, moveTable }) => {
  const ref = React.useRef(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'table',
    item: { ...table, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "table",
    hover: (item) => {
      if (item.index !== index) {
        moveTable(item.index, index);
        item.index = index;
      }
    },
  }));

  drag(drop(ref)); 

  return (
    <div
      ref={ref}
      style={{
        padding: '10px',
        margin: '5px 0',
        background: isDragging ? '#ddd' : '#fff',
        border: '1px solid #ccc',
        cursor: 'move',
      }}
    >
      {table.name}
    </div>
  );
};

export default TableList;
