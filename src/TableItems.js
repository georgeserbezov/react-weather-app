import React from 'react'

const TableItems = (props) => {
    return (
        <tr>
          <td>{props.item[0]}</td>
          <td>{props.item[1]}</td>
          <td>{props.item[2]}</td>
        </tr>
      )
}

export default TableItems
