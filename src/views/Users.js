
import './styles/Users.css'
import { useState,useEffect, useMemo } from 'react';
import getUserList from '../controllers/userControllers/getUserListController'
import { useTable,usePagination } from 'react-table'
import { FaEdit,FaUser,FaUserNurse } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'

function Users() {

    const [users,setUsers] = useState([]);
    const [rawusers,setRawUsers] = useState([]);
    const [userrole,setRole] = useState('all');
    const [userStatus,setUserStatus] = useState('all')
     const navigate = useNavigate();
    const alert = useAlert();

    useEffect(()=>{

      let active = true;
        load()
      return () => {active = false}

      async function load() {

        try {
          let data = await getUserList();
          if(active){
            setUsers(data);
            setRawUsers(data);
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
        users.map(
          (data) => {
            data_row.push({
              id: data._id,
              username: data.username,
              name: data.name,
              surname: data.surname,
              role: data.role,
              login_status: (data.status === 'ban')? 'banned' : (data.login_status) ? 'active' : 'inactive'
            })
           
            return null;
          });

        return data_row

    },[users])
  
    const columns = useMemo(
      () => [
        {
          Header: 'ID',
          accessor: 'id', // accessor is the "key" in the data
        },
        {
          Header: 'Username',
          accessor: 'username', // accessor is the "key" in the data
        },
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Surname',
          accessor: 'surname',
        },
        {
          Header: 'Role',
          accessor: 'role',
        },
        {
          Header: 'Status',
          accessor: 'login_status',
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
      <main>
        <div className='userNav'>
          <div className = 'selectUser' onClick={() => {setUsers(rawusers); setRole('all');}}>
            <div style={{justifySelf:'center',alignSelf:'center'}}>
              <HiUserGroup style={{marginRight:10}}/>
              ทั้งหมด
            </div>
          </div>
          <div className = 'selectUser' onClick={() => {setUsers(rawusers.filter(({role}) => role === 'member')); setRole('member')}}>
            <FaUser style={{marginRight:10}}/>
            สมาชิก
          </div>
          <div className = 'selectUser' onClick={() => {setUsers(rawusers.filter(({role}) => role === 'volunteer')); setRole('volunteer')}}>
            <FaUserNurse style={{marginRight:10}}/>
            อาสาสมัคร
          </div>
        </div>
        <div style={{marginTop:'3vh'}}>
          <button style={{width:'5vw',backgroundColor:'Lightblue',height:'5vh',cursor:'pointer',borderColor: (userStatus === 'all') ? 'gray' : 'black'}} 
            onClick={() => {setUsers(rawusers.filter(({role}) => (role === userrole || userrole === 'all'))); setUserStatus('all')}}>
            ทั้งหมด
          </button>
          <button style={{width:'5vw',backgroundColor:'Lime',height:'5vh',cursor:'pointer',borderColor: (userStatus === 'active') ? 'gray' : 'black'}}
            onClick={() => {

              setUsers(rawusers.filter(({role,login_status,status}) => (role === userrole || userrole === 'all') && login_status && !(status === 'ban')))
              setUserStatus('active');
            
            }}>
            Active
          </button>
          <button style={{width:'5vw',backgroundColor:'Red',height:'5vh',cursor:'pointer',borderColor: (userStatus === 'inactive') ? 'gray' : 'black'}} 
          onClick={() => {
            setUsers(rawusers.filter(({role,login_status,status}) => (role === userrole || userrole === 'all') && !login_status  && !(status === 'ban')))
            setUserStatus('inactive');
          }}>
            Inactive
          </button>
          <button style={{width:'5vw',backgroundColor:'darkred',height:'5vh',cursor:'pointer',borderColor: (userStatus === 'ban') ? 'gray' : 'black'}} 
          onClick={() => {
            setUsers(rawusers.filter(({role,status}) => (role === userrole || userrole === 'all') && status === 'ban'))
            setUserStatus('ban');
          }}>
            Banned
          </button>
        </div>
        {(users.length > 0) && <><table {...getTableProps()} style={{ border: 'solid 1px black',overflow: "auto",marginTop:'2vh',marginLeft:10 }}>
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
                        onClick={() => navigate(`/users/${row.cells[0].value}`,{state:users[index+pageIndex*pageSize]})}> <FaEdit/> </button>
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