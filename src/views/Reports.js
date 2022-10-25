import './styles/Users.css'
import { useState,useEffect, useMemo } from 'react';
import getReportList from '../controllers/reportControllers/getReportListController'
import { useTable,usePagination } from 'react-table'
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'

function Reports() {

    const [reports,setReports] = useState([]);
    const [rawReports,setRawReports] = useState([]);
    const [selectType,setSelectType] = useState('all');
    const [selectStatus,setSelectStatus] = useState('all');
    const navigate = useNavigate();
    const alert = useAlert();

    useEffect(()=>{

      let active = true;
        load()
      return () => {active = false}

      async function load() {

        try {
          let data = await getReportList();
          if(active){
            setReports(data);
            setRawReports(data);
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
        reports.map(
          (data) => {
            data_row.push({
              id: data._id,
              description: (data.description) ? data.description : 'ไม่มี',
              address: ((data.aoi) ? data.aoi : '') + ' ' + data.subdistrict + ' ' + data.district + ' ' + data.province,
              type: data.type,
              report_status: data.status
            })
            return null;
          });
        
        return data_row

    },[reports])
  
    const columns = useMemo(
      () => [
        {
          Header: 'Report ID',
          accessor: 'id', // accessor is the "key" in the data
        },
        {
          Header: 'Description',
          accessor: 'description', 
        },
        {
          Header: 'Address',
          accessor: 'address', 
        },
        {
          Header: 'Type',
          accessor: 'type', 
        },
        {
          Header: 'Status',
          accessor: 'report_status',
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
        <section style={{flex:1,marginTop:'1vh',flexDirection:'row',width:'100%'}}>
          <h3>ประเภท</h3>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'Lightblue',height:'5vh',cursor:'pointer',borderColor: (selectType === 'all') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports); setSelectType('all');}}>
            ทั้งหมด
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'dimgray',height:'5vh',cursor:'pointer',borderColor: (selectType === 'car') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (status === selectStatus || selectStatus === 'all') && type === 'car'));  setSelectType('car')}}>
            อุบัติเหตุทางจราจร
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'red',height:'5vh',cursor:'pointer',borderColor: (selectType === 'fire') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (status === selectStatus || selectStatus === 'all') && type === 'fire'));  setSelectType('fire')}}>
            ไฟไหม้
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'aquamarine',height:'5vh',cursor:'pointer',borderColor: (selectType === 'flood') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (status === selectStatus || selectStatus === 'all') && type === 'flood'));  setSelectType('flood')}}>
            น้ำท่วม
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'brown',height:'5vh',cursor:'pointer',borderColor: (selectType === 'earthquake') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (status === selectStatus || selectStatus === 'all') && type === 'earthquake')); setSelectType('earthquake')}}>
            แผ่นดินไหว
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'green',height:'5vh',cursor:'pointer',borderColor: (selectType === 'epidemic') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (status === selectStatus || selectStatus === 'all') && type === 'epidemic')); setSelectType('epidemic')}}>
            โรคระบาด
          </button> 
        </section >

        <section style={{flex:1,marginTop:'1vh',flexDirection:'row',width:'100%'}}>
          <h3>สถานะ</h3>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'Lightblue',height:'5vh',cursor:'pointer',borderColor: (selectStatus === 'all') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (type === selectType || selectType === 'all'))); setSelectStatus('all')}}>
            ทั้งหมด
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'dimgray',height:'5vh',cursor:'pointer',borderColor: (selectStatus === 'non-validated') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (type === selectType || selectType === 'all') && status === 'non-validated')); setSelectStatus('non-validated')}}>
            ไม่ยืนยัน
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'goldenrod',height:'5vh',cursor:'pointer',borderColor: (selectStatus === 'inprocess') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (type === selectType || selectType === 'all') && status === 'inprocess')); setSelectStatus('inprocess')}}>
            กำลังดำเนินการ
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'lime',height:'5vh',cursor:'pointer',borderColor: (selectStatus === 'finish') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (type === selectType || selectType === 'all') && status === 'finish')); setSelectStatus('finish')}}>
            เสร็จสิ้น
          </button>
          <button style={{paddingLeft:'1vh',paddingRight:'1vh',backgroundColor:'red',height:'5vh',cursor:'pointer',borderColor: (selectStatus === 'cancel') ? 'gray' : 'black'}} 
            onClick={() => {setReports(rawReports.filter(({status,type}) => (type === selectType || selectType === 'all') && status === 'cancel')); setSelectStatus('cancel')}}>
            ยกเลิก
          </button>
        </section >
        
        
        {(reports.length > 0) && <><table {...getTableProps()} style={{ border: 'solid 1px black',overflow: "auto",marginTop:10 }}>
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
                          width: (cell.column.Header === 'Description') ? '25vw' : (cell.column.Header === 'Address') ? '15vw' : '8vw',
                          border: 'solid 1px gray',
                          background: 'whitesmoke',
                          color: (cell.column.Header === 'Status') ? ((cell.value === 'finish') ? 'green' : 'darkgoldenrod') : 'black'
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
                      onClick={() => navigate(`/reports/${row.cells[0].value}`,{state:reports[index+pageIndex*pageSize]})}> <FaEdit/> </button>
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


  export default Reports;