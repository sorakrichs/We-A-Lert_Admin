
import './styles/Users.css'
import { useState,useEffect, useMemo } from 'react';
import getOrganizationList from '../controllers/organizationControllers/getOrganizationListController'
import { useTable,usePagination } from 'react-table'
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'

function Users() {

    const [organizations,setOrganizations] = useState([]);
    const navigate = useNavigate();
    const alert = useAlert();

    useEffect(()=>{

      let active = true;
        load()
      return () => {active = false}

      async function load() {

        try {
          let data = await getOrganizationList()
          if(active){
            setOrganizations(data);
          }
        } catch (err) {
          if(err?.response?.status === 401) {
            navigate('/login');
          } else {
            alert.error((err?.response?.data?.message) ? err.response.data.message : err.message);
          }
        }
      }


    },[alert,navigate])

    const data = useMemo(
      () => {

        let data_row = [];
        organizations.map(
          (data) => {
            data_row.push({
              id: data._id,
              name: data.name,
              branchname: (data.branchname) ? data.branchname : 'ไม่มี',
              description: (data.description) ?  data.description : 'ไม่มี',
              email: (data.email) ? data.email : 'ไม่มี',
            })
           
            return null;
          });

        return data_row

    },[organizations])
  
    const columns = useMemo(
      () => [
        {
          Header: 'ID',
          accessor: 'id', // accessor is the "key" in the data
        },
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Branchname',
          accessor: 'branchname',
        },
        {
          Header: 'Description',
          accessor: 'description',
        },
        {
          Header: 'Email',
          accessor: 'email',
        },
      ],
      []
    )
  
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
    } = useTable({ columns, data },usePagination)
  
    return (
      <main>{
        (organizations.length > 0) && <><table {...getTableProps()} style={{ border: 'solid 1px black',overflow: "auto",marginTop:10 }}>
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
            {page.map((row,index) => {
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
                          color: (cell.value === 'inactive') ? 'red' : (cell.value === 'active') ? 'green' : 'black'
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                  <td
                      
                        style={{
                          padding: '20px',
                          border: 'solid 1px gray',
                          background: 'papayawhip',
                        }}
                      >
                        <button 
                        type="button"
                        onClick={() => navigate(`/organization/${row.cells[0].value}`,{state:organizations[index+pageIndex*pageSize]})}> <FaEdit/> </button>
                  </td>
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
      </div></>
      }
      </main>
    )
}


  export default Users;