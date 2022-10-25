
import './styles/Users.css'
import './styles/Logs.css'
import { useState,useEffect, useMemo } from 'react';
import getLog from '../controllers/logControllers/getLogController';
import { useTable,usePagination } from 'react-table'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'

function Users() {

    const [logDate,setLogDate] = useState({});
    const [logList,setLogList] = useState([]);
    const [selectDate,setSelectDate] = useState(null)
    const [log,setLog] = useState([]);
    const navigate = useNavigate();
    const alert = useAlert();

    useEffect(()=>{

      let active = true;
        load()
      return () => {active = false}

      async function load() {

        try {
          let data = await getLog();
          if(active){
            setLogList(data);
            setLog(Object.entries(Object.entries(data)[Object.entries(data).length-1][1]))
            setSelectDate(Object.entries(data)[Object.entries(data).length-1][0])
            const datesList = {}
            await Promise.all(

              Object.keys(data).sort().map((date)=>{

                if(!datesList[new Date(date).getFullYear()])
                  datesList[new Date(date).getFullYear()] = {}

                if(!datesList[new Date(date).getFullYear()][new Date(date).getMonth()])
                  datesList[new Date(date).getFullYear()][new Date(date).getMonth()]  = []
                else 
                  datesList[new Date(date).getFullYear()][new Date(date).getMonth()].push(date)

                return null;

            }))
            setLogDate(datesList)

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
        log?.map(
          (data) => {

            data_row.push({
              time:  data[0],
              userid: data[1][0],
              role: data[1][1],
              action: data[1][2],
              ip: data[1][3],
              
            })
           
            return null;
          });

        return data_row

    },[log])
  
    const columns = useMemo(
      () => [
        {
          Header: 'Time',
          accessor: 'time', // accessor is the "key" in the data
        },
        {
          Header: 'User ID',
          accessor: 'userid', // accessor is the "key" in the data
        },
        {
          Header: 'Role',
          accessor: 'role',
        },
        {
          Header: 'Action',
          accessor: 'action',
        },
        {
          Header: 'IP Address',
          accessor: 'ip',
        }
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

    const numberToMonth = (num) => {
      let month = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]
      return month[num]
    }

    const dateToString = (stringDate) => {
      let date = new Date(stringDate);
        const day = ["วันอาทิตย์","วันจันทร์","วันอังคาร","วันพุธ","วันพฤหัสบดี","วันศุกร์","วันเสาร์"] 

        const month = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]
        const year = date.getFullYear() + 543;

        return `${day[date.getDay()]}ที่ ${date.getUTCDate()} ${month[date.getMonth()]} พ.ศ. ${year}`
      }

    const [visibleYear,setVisibleYear] = useState(-1)
    const [visibleMonth,setVisibleMonth] = useState(-1)

    const listItems = Object.entries(logDate).map((year,yearindex) => {

      return (
        <>
            <div key = {yearindex} className ='logyear' onClick={() => {setVisibleYear((visibleYear === yearindex) ? -1 : yearindex)}}>{Number(year[0])+543}</div>
            {  visibleYear === yearindex &&
              Object.entries(year[1]).map((month,monthindex) => {
                return (  
                  <>
                    <div key = {monthindex} className ='logmonth' onClick={() => {setVisibleMonth((visibleMonth === monthindex) ? -1 : monthindex)}}>{
                      numberToMonth(month[0])
                    }</div>
                    { visibleMonth === monthindex &&
                      month[1].map((day,index) => <li key = {index} className = { (day === selectDate) ? 'logday isClicked' : 'logday'} onClick={() => {
                        setLog(Object.entries(logList[day]));
                        setSelectDate(day);
                        }
                      }>
                        {day}
                      </li>)
                    }
                  </>
                ) 
              }   
            )}
        </>
      )
    });


  
    return (
      <main>
        <div className='sideNav'>
            {listItems}
        </div>
        <header className="logheader">
            <h1> {dateToString(selectDate)} </h1>
        </header>
        {(log.length > 0) && <><table {...getTableProps()} style={{ border: 'solid 1px black',overflow: "auto",marginTop:'3vh' }}>
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