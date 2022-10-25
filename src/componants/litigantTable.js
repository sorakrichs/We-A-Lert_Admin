
import { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table'

function Table(props) {

    const [data,setData] = useState([])
    useMemo(
      () => {
        let data_row = [];
        props.data.map(
          (data) => {
            data_row.push({
              license: data.license,
              make: data.make,
              model: data.model,
              category: data.category.join(',')
            })
            return null;
          });
        
        setData(data_row)

    },[props])
  
    const columns = useMemo(
      () => [
        {
          Header: 'ป้ายทะเบียน',
          accessor: 'license',
        },
        {
          Header: 'ยี่ห้อ',
          accessor: 'make', 
        },
        {
          Header: 'รุ่น',
          accessor: 'model', 
        },
        {
            Header: 'ประเภท',
            accessor: 'category', 
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
    
        return <input value={(value) ? value : ''} onChange={onChange} onBlur={onBlur} style={{width:'10vw'}} />
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
            {[10, 20, 30, 40, 50].map(pageSize => (
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