import { DataCell } from 'fixed-data-table-2';
import React from 'react';

class DefaultCell extends React.Component {
  componentDidMount() {
    console.log("Cell mounted");
  }

  componentWillUnmount() {
    console.log("Cell unmounted");
  }

  render() {
    const { props } = this;
    return (
      <DataCell {...props}>
        Cell {props.rowIndex} {props.columnIndex}
      </DataCell>
    );
  }
}

export default DefaultCell;
