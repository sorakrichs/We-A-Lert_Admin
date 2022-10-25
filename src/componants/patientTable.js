
import { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table'

function Table(props) {

    const [data,setData] = useState([]);

    useMemo(
      () => {
        let data_row = [];
        props.data.map(
          (data) => {
            data_row.push({
              name: data.name,
              surname: data.surname,
              symptom: data.symptom
            })
            return null;
          });
        
        setData(data_row)

    },[props])
  
    const columns = useMemo(
      () => [
        {
          Header: 'ชื่อผู้ป่วย',
          accessor: 'name',
        },
        {
          Header: 'นามสกุลผู้ป่วย',
          accessor: 'surname', 
        },
        {
          Header: 'อาการ',
          accessor: 'symptom', 
        },
      ],
      []
    )
  
  // Create an editable cell renderer
    const EditableCell = ({
        value: initialValue,
        row: { index },
        column: { id },
    }) => {

        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue)
    
        const onChange = e => {
            setValue(e.target.value)
        }

        // We'll only update the external data when the input is blurred
        const onBlur = () => {
            props.updateData(index, id, value)
        }
    
        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])
        

        return (id === 'symptom') ? <textarea value={(value) ? value : ''} onChange={onChange} onBlur={onBlur} style={{width: '25vw',height: '10vh'}} />:
          <input value={(value) ? value : ''} onChange={onChange} onBlur={onBlur} style={{width: '10vw'}} />
    }

    const defaultColumn = {
        Cell: EditableCell,
      }

    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({ columns, data,defaultColumn },usePagination)

    
  
    return (
      <>{
        (data.length > 0) && <><table {...getTableProps()} style={{ border: 'solid 1px black',overflow: "auto",margin:'auto' }}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      background: 'silver',
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
                prepareRow(row)
                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                    return (
                        <td 
                            {...cell.getCellProps()}
                            style={{
                            padding: '10px',
                            width: '8vw',
                            border: 'solid 1px gray',
                            background: 'whitesmoke',
                            color: 'black'
                            }}
                        >
                            {cell.render('Cell')}
                        </td>
                    )
                    })}
                </tr>
                )
            })}
          </tbody>
          
        </table>
        <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
            </button>{' '}
            <span>
            Page{' '}
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
            </span>
            <span>
            | Go to page:{' '}
            <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
                }}
                style={{ width: '100px' }}
            />
            </span>{' '}
            <select
            value={pageSize}
            onChange={e => {
                setPageSize(Number(e.target.value))
            }}
            >
            {[5, 10, 15, 20, 25].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                Show {pageSize}
                </option>
            ))}
            </select>
        </div>
        </>
      }
      </>
    )
}


export default Table;