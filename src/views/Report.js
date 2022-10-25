import { useState,useEffect,useRef } from "react";
import {useLocation} from "react-router-dom";
import getReportDetail from '../controllers/reportControllers/getReportDetailController'
import getAddress from '../controllers/microControllers/getAddress'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Dropdown from 'react-dropdown';
import { longdo, map, LongdoMap } from "../componants/Longdomap";
import  LitigantTable from "../componants/litigantTable"
import  PatientTable from "../componants/patientTable"
import { confirmAlert } from 'react-confirm-alert';
import './styles/Report.css'
import 'react-confirm-alert/src/react-confirm-alert.css';
import default_user from '../assets/default_user.png'
import SelectVolunteerModal from '../componants/SelectVolunteerModal'
import changeVolunteerReport from "../controllers/reportControllers/changeVolunteerReportController";
import changeReportAddress from "../controllers/reportControllers/changeReportAddressContoller";
import LoadingScreen from "../componants/LoadingScreen";
import editReport from "../controllers/reportControllers/editReportController";
import editReportImage from "../controllers/reportControllers/editReportImageController";

function Report() {
    const location = useLocation();
    const [images,setImages] = useState([]);
    const [type,setType] = useState((location.state.type) ? location.state?.type : null);
    const [status,setStatus] = useState(location.state.status);
    const [addressLocation,setAddressLocation] = useState({lon: location.state.location.coordinates[0], lat: location.state.location.coordinates[1]});
    const [address,setAddress] = useState({
        aoi: (location.state?.aoi) ? location.state.aoi : null,
        district: location.state.district,
        postcode: location.state.postcode,
        province: location.state.province,
        subdistrict: location.state.subdistrict,
    });

    const [user,setUser] = useState();
    const [volunteer,setVolunteer] = useState();

    const [modalIsOpen, setIsOpen] = useState(false);

    const [detail,_setDetail] = useState();
    const [geom,_setGeom] = useState();
    const navigate = useNavigate();
    const alert = useAlert();

    const detailRef = useRef(detail);
    const setDetail = data => {
        detailRef.current = data;
        _setDetail(data);
    };

    const geomRef = useRef(geom);
    const setGeom = data => {
        geomRef.current = data;
        _setGeom(data);
    };
    const [loading,setLoading] = useState(true)

    const replaceGeom = (location,range) => {
        if(geomRef.current)
            map.Overlays.remove(geomRef.current);
        let circle = new longdo.Circle(location, range/111000, {
            title: 'Geom 3',
            detail: '-',
            lineWidth: 2,
            lineColor: 'rgba(255, 0, 0, 0.8)',
            fillColor: 'rgba(255, 0, 0, 0.4)'
        });
        map.Overlays.add(circle);
        setGeom(circle);
    }

    const waitForMap = () => new Promise((resolve, reject) => {
        if(typeof map == "undefined") {
            console.log('waiting')
            window.setTimeout(() => {resolve(waitForMap())}, 100); /* this checks the flag every 100 milliseconds*/

        } else {

            map?.Event.bind('overlayDrop', async function(overlay) {
                setAddressLocation(overlay.location());
                if(type === 'fire') {
                    replaceGeom(overlay.location(),detailRef?.current.range);
                }
                let address = await getAddress(overlay.location())
                setAddress({
                    aoi: (address?.aoi) ? address.aoi : null,
                    district: address.district,
                    postcode: address.postcode,
                    province: address.province,
                    subdistrict: address.subdistrict
                });
        
            });

            map?.Event.bind('click', async function(overlay) {
                map.Overlays.clear();
                let mouseLocation = map.location(longdo.LocationMode.Pointer);
                setAddressLocation(mouseLocation);
                map.Overlays.add(new longdo.Marker(mouseLocation,{draggable:true}));
                let address = await getAddress(mouseLocation)
                setAddress({
                    aoi: (address?.aoi) ? address.aoi : null,
                    district: address.district,
                    postcode: address.postcode,
                    province: address.province,
                    subdistrict: address.subdistrict
                });
                if(type === 'fire') {
                    replaceGeom(mouseLocation,detailRef?.current.range);
                }
        
            });

            resolve(true);

        }
    });

    useEffect(()=>{

        let active = true;
        load()
        return () => {active = false}

        async function load() {

            try {
                setLoading(true)
                await waitForMap();
                let data = await getReportDetail(location.state._id);
                if(active && data){
                    setImages(data.detail[0]);
                    setDetail(data.detail[1]);
                    setUser(data.detail[2][0]);
                    setVolunteer(data.detail[2][1]);
                    setType(data.report.type)
                    setStatus(data.report.status)
                    setAddressLocation({lon: data.report?.location.coordinates[0], lat: data.report?.location.coordinates[1]})
                    setAddress({
                        aoi: (data.report?.aoi) ? data.report?.aoi : null,
                        district: data.report?.district,
                        postcode: data.report?.postcode,
                        province: data.report?.province,
                        subdistrict: data.report?.subdistrict
                    })

                    let marker = new longdo.Marker({ lon: data.report?.location.coordinates[0], lat: data.report?.location.coordinates[1] },{draggable:true});
                    map.Overlays.add(marker);
                    if(location.state.type === 'fire') {
                        replaceGeom({
                            lon: data.report?.location.coordinates[0], lat: data.report?.location.coordinates[1]
                        },data.detail[1].range)
                    }
                    
                }
            } catch (err) {
                if(err?.response?.status === 401) {
                    navigate('/login');
                } else {
                    alert.error((err?.response?.data?.message) ? err.response.data.message : err.message);
                }
            } finally {
                setLoading(false)
            }
        }

    },[location.state,alert,navigate])

    useEffect(()=>{

        switch(type) {
            case 'car':
                setDetail({litigant:[],type:'broken'})
                map?.Overlays.remove(geom);
                break;
            case 'fire':
                setDetail({type:'A',range:0})
                break;
            case 'flood':
                setDetail({depth:0})
                map?.Overlays.remove(geom);
                break;
            case 'earthquake':
                setDetail({tsunami:false,magnitude:0})
                map?.Overlays.remove(geom);
                break;
            case 'epidemic':
                setDetail({patient:[]})
                map?.Overlays.remove(geom);
                break;
            default:
        }

    },[type])
    
    
    const fileInput = useRef(null);

    return (
    <main style={{position:'relative',backgroundColor:'gainsboro',paddingBottom:'5vh'}}>
        <SelectVolunteerModal
            open={modalIsOpen}
            onClose={() => setIsOpen(false)}
            setVolunteer={(data) => {
                setVolunteer(data);
                setIsOpen(false);
            }}
            
        />
        <header className="reportheader">
            <h1> ข้อมูลอุบัติภัย </h1>
        </header>
        <section >
            <h2>Report ID</h2> 
            <input
                placeholder='type here'
                className="inputContainer"
                disabled={true}
                defaultValue={location.state._id}
            />
        </section>
        <section className="userData">
            <h2>ผู้แจ้ง</h2>
            <section className="row center" style={{marginBottom:'5vh'}}>
                <img className = {'user_report_image'} alt={'user_image'} src={(user?.image) ? user?.image : default_user}/> <br/>
                <div>
                    <div className='row center'>
                      
                      <h4>ชื่อบัญชี</h4>
                      <input
                        placeholder='type here'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={user?.username}
                     />
                    </div>
                </div>
            </section>
        </section>
        <section className="userData">
            <h2>ผู้รับเรื่อง</h2>
           <section className="row center">
                <img className = {'user_report_image'} alt={'volunteer_image'} src={(volunteer?.image) ? volunteer?.image : default_user}/> <br/>
                {volunteer ? <div>
                    <div className='row center'>
                      
                      <h4>ชื่อบัญชี</h4>
                      <input
                        placeholder='ไม่อยู่ในระบบ'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.username}
                     />
                    </div>
                    <div className='row center'>
                      <h4>หน่วยงาน</h4>
                      <input
                        placeholder='ไม่อยู่ในระบบ'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.organization_name}
                        style={{width:'8vw'}}
                      />
                      <h4>สาขา</h4>
                      <input
                        placeholder='ไม่ระบุ'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.organization_branchname}
                        style={{width:'5vw'}}
                      />
                    </div>
                    <div className='row center'>
                      <h4>ตำแหน่งในทีม</h4>
                      <input
                        placeholder='ไม่ระบุ'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.teamrole}
                     />
                    </div>
                  </div>: <h4>ไม่มี</h4>}
            </section>
            <button className="addButton" onClick={() => {

                setIsOpen(true);

            }}> เปลี่ยนผู้รับเรื่อง </button>
            <div>
                <button className="submitButton" onClick={() => {
                    confirmAlert({
                        title: 'ยืนยันการแก้ไข',
                        message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                        buttons: [
                          {
                            label: 'ตกลง',
                            onClick: async () => {
                              try {
                                await changeVolunteerReport(location.state._id,volunteer?._id)
                                alert.success('แก้ไขเสร็จสิ้น')
                              } catch (err) {
                                alert.error((err?.response?.data?.message) ? err.response.data.message : err.message)
                              }
                            }
                          },
                          {
                            label: 'ไม่',
                          }
                        ]
                      })
                    
                }}>ยืนยันการแก้ไข</button>
            </div>
        </section>
        <section  className="disasterAddress">
            <h2> ตำแหน่งอุบัติภัย </h2>
            <div style={{width:'30vw',height:'50vh'}} className='mapdata'>
                <LongdoMap id="longdo-map" mapKey={'0ba75287512b12f50f558308fb6c720c'}/>
            </div>
            <section className="addressData">
                {address?.aoi && 
                <section>
                    <h3>AOI</h3> 
                    <input
                        placeholder='type here'
                        className="inputContainer"
                        disabled={true}
                        value={address.aoi}
                    />
                </section>}
                <section className="row">
                    <section>
                        <h3>แขวง/ตำบล</h3> 
                        <input
                            placeholder='type here'
                            className="inputContainer"
                            disabled={true}
                            value={address.subdistrict}
                        />
                    </section>
                    <section>
                        <h3>อำเภอ/เขต</h3> 
                        <input
                            placeholder='type here'
                            className="inputContainer"
                            disabled={true}
                            value={address.district}
                        />
                    </section>
                </section>
                <section className="row">
                    <section>
                        <h3>จังหวัด</h3> 
                        <input
                            placeholder='type here'
                            className="inputContainer"
                            disabled={true}
                            value={address.province}
                        />
                    </section>
                    <section>
                        <h3>รหัสไปรษณีย์</h3> 
                        <input
                            placeholder='type here'
                            className="inputContainer"
                            disabled={true}
                            value={address.postcode}
                        />
                    </section>
                </section>
            </section>
            <button className="submitButton" onClick={async () => {


                    confirmAlert({
                        title: 'ยืนยันการแก้ไข',
                        message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                        buttons: [
                        {
                            label: 'ตกลง',
                            onClick: async () => {
                            try {
                                let addressData = address;
                                addressData.location = {
                                    type: 'Point',
                                    coordinates: [addressLocation.lon,addressLocation.lat],
                                }
                                await changeReportAddress(location.state._id,addressData)
                                alert.success('แก้ไขเสร็จสิ้น')
                            } catch (err) {
                                alert.error((err?.response?.data?.message) ? err.response.data.message : err.message)
                            }
                            }
                        },
                        {
                            label: 'ไม่',
                        }
                        ]
                    })

            }}>ยืนยันการแก้ไข</button>
        </section>
        { type && <section className="reportData">
            
            <h2> รายละเอียด </h2>
            <section style={{display:'flex', alignContent:'center',justifyContent: 'center'}}>
                <section>
                    <h3>Type</h3> 
                    <Dropdown 
                        controlClassName="dropdown"
                        menuClassName="dropdownMenu"
                        options={[{ value: 'car', label: 'อุบัติเหตุทางจราจร'},{ value: 'fire', label: 'ไฟไหม้' }
                        ,{ value: 'flood', label: 'น้ำท่วม' },{value: 'earthquake', label:'แผ่นดินไหว'},{value: 'epidemic', label:'โรคระบาด'}]} 
                        onChange={({value})=> {setType(value)}}
                        value={type} 
                        placeholder="Select an option" 
                    />
                </section>
                <section>
                    <h3>Status</h3> 
                    <Dropdown 
                        controlClassName="dropdown"
                        menuClassName="dropdownMenu"
                        options={[{ value: 'finish', label: 'เสร็จสิ้น',className: 'finish'},{ value: 'inprocess', label: 'กำลังดำเนินการ',className: 'inprocess' }
                        ,{ value: 'cancel', label: 'ถูกยกเลิก',className: 'cancel' },{value: 'non-validated', label:'ยังไม่ได้รับการยืนยัน'}]} 
                        onChange={({value})=> {setStatus(value)}}
                        value={status} 
                        placeholder="Select an option" 
                    />
                </section>
            </section>
            { (type === 'car') && 
            <section>
                
                
                <h3>ประเภทอุบัติเหตุ</h3> 
                <div  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Dropdown 
                        controlClassName="dropdown"
                        menuClassName="dropdownMenu"
                        options={[{ value: 'broken', label: 'รถเสีย' },{ value: 'crash', label: 'รถชน' }]} 
                        value={detail?.type} 
                        onChange={({value})=> {
                            setDetail({...detail,type: value})
                        }}
                        placeholder="Select an option" 
                    />
                </div>
            </section>
            }
        
            { (type === 'car') && 
            <section>
                
                <h3>ผู้ประสบภัย</h3> 

                <LitigantTable 
                    data={(detailRef.current?.litigant) ? detailRef.current?.litigant : []}
                    updateData = {(index,id,data) => {

                        let datalist = detailRef.current.litigant
                        switch(id) {
                            case 'license':
                                datalist[index] = {...datalist[index],license: data};
                            break;
                            case 'make':
                                datalist[index] = {...datalist[index],make: data};
                            break;
                            case 'model':
                                datalist[index] = {...datalist[index],model: data};
                            break;
                            case 'category':
                                datalist[index] = {...datalist[index],category: data.split(",").map(item=>item.trim())};
                            break;
                            default:
                        }
                        setDetail({...detailRef.current,litigant: datalist})
                    }}
                
                />
                
                <button className="addButton" onClick={() => {
                    let a = detail.litigant;
                    a.push({license:null,make:null,model:null,category:[]})
                    setDetail({...detail,litigant:a})
                }}> เพื่ม 

                </button>

            </section>
            }
            { (type === 'fire') && 
            <section>
                
                <h3>ประเภทของไฟไหม้</h3> 
                <div  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Dropdown 
                        controlClassName="dropdown"
                        menuClassName="dropdownMenu"
                        options={[{ value: 'A', label: 'ไฟไหม้ประเภทของแข็ง' },{ value: 'B', label: 'ไฟไหม้ประเภทของเหลวที่มีไอระเหยสามารถติดไฟได้' }
                        ,{ value: 'C', label: 'ไฟไหม้ประเภทที่เกิดขึ้นกับเครื่องมือและอุปกรณ์ไฟฟ้า' },{ value: 'D', label: 'ไฟที่เกิดขึ้นจากโลหะติดไฟ' }]} 
                        value={detail?.type} 
                        onChange={({value})=> {
                            setDetail(prev => ({...prev,type: value}))
                        }}
                        placeholder="Select an option" 
                    />
                </div>
            </section>
            }
            { (type === 'fire') && 
            <section>
                
                
                <h3>ระยะ</h3> 
                <input
                    placeholder='type here'
                    className="inputContainer"
                    onInput={text => {

                            if(!isNaN(Number(text.target.value))) {

                                replaceGeom(addressLocation,text.target.value);
                                setDetail(prev =>  ({...prev,range: text.target.value}));
                            }
                        }
                    }
                    defaultValue={detail?.range}
                />

            </section>
            }
            { (type === 'flood') && 
            <section>
                
                
                <h3>ความลึก</h3> 
                <input
                    placeholder='type here'
                    className="inputContainer"
                    defaultValue={detail?.depth}
                    onInput={text => {


                        if(!isNaN(Number(text.target.value))) {

                            setDetail(prev => ({...prev,depth: text.target.value}));

                        }
                    }
                }
                />
            </section>
            }
            { (type === 'earthquake') && 
            <section>
                
                <h3>แมกนิจูต</h3> 
                <input
                    placeholder='type here'
                    className="inputContainer"
                    defaultValue={detail?.magnitude}
                    onInput={text => {

                        if(!isNaN(Number(text.target.value))) {

                            setDetail(prev => ({...prev,magnitude: text.target.value}));

                        }
                    }
                }/>
            </section>
            }
            { (type === 'earthquake') && 
            <section>
                
                <h3>เตือนภัยสึนามิ</h3> 
                <div  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Dropdown 
                        controlClassName="dropdown"
                        menuClassName="dropdownMenu"
                        options={[{ value: 'true', label: 'มีการเตือนภัย' },{ value: 'false', label: 'ไม่มีการเตือนภัย' }]} 
                        value={Boolean(detail.tsunami).toString()} 
                        onChange={({value})=> {
                            setDetail(prev =>({...prev,tsunami:JSON.parse(value)}))
                        }}
                        placeholder="Select an option" 
                    />
                </div>
            </section>
            }
            { (type === 'epidemic') && 
            <section>
                
                <h3>รายชื่อผู้ป่วย</h3> 
                <PatientTable

                    data={(detailRef.current?.patient) ? detailRef.current?.patient : []}
                    updateData = {(index,id,data) => {

                        let datalist = detailRef.current.patient
                        switch(id) {
                            case 'name':
                                datalist[index] = {...datalist[index],name: data};
                            break;
                            case 'surname':
                                datalist[index] = {...datalist[index],surname: data};
                            break;
                            case 'symptom':
                                datalist[index] = {...datalist[index],symptom: data};
                            break;
                            default:
                        }
                        setDetail({...detailRef.current,patient: datalist})
                    }}/>

                <button className="addButton" onClick={() => {
                    let a = detail.patient;
                    a.push({name:null ,surname:null, symptom:null})
                    setDetail({patient:a})
                }}> เพื่ม </button>
                
            </section>
            }
            <button className="submitButton" onClick={async () => {
                confirmAlert({
                  title: 'ยืนยันการแก้ไข',
                  message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                  buttons: [
                    {
                      label: 'ตกลง',
                      onClick: async () => {
                        try {
                            switch(type) {
                                case('car'):
                                    if(detail.litigant <= 0 )
                                        throw new Error('กรุณาใส่ผู้ประสบภัย')
                                    if(detail.litigant.filter(({license,make,model,category}) => !license || !make || !model || category.length <= 0).length > 0)
                                        throw new Error('กรุณากรอกข้อมูลผู้ประสบภัยให้ครบ')
                                break;
                                case('fire'):
                                    if(detail.range <=0)
                                        throw new Error('ใส่ข้อมูลข้อมูลระยะให้ถูกต้อง')
                                break;
                                case('flood'):
                                    if(detail.depth <=0)
                                        throw new Error('ใส่ข้อมูลข้อมูลระยะให้ถูกต้อง')
                                break;
                                case('earthquake'):
                                    if(detail.magnitude <=0)
                                        throw new Error('ใส่ข้อมูลข้อมูลระยะให้ถูกต้อง')
                                break;
                                case('epidemic'):
                                    if(detail.patient <= 0 )
                                        throw new Error('กรุณาใส่ผู้ป่วย')
                                    if(detail.patient.filter(({name,surname,symptom}) => !name || !surname || !symptom ).length > 0)
                                        throw new Error('กรุณากรอกข้อมูลผู้ป่วยให้ครบ')
                                break;
                                default:
                            }

                            let reportdata = {
                                type: type,
                                status: status,
                                detail: detail
                            }
                            await editReport(location.state._id,reportdata)
                            alert.success('แก้ไขเสร็จสิ้น')
                        } catch (err) {

                          alert.error((err?.response?.data?.message) ? err.response.data.message : err.message)

                        }
                      }
                    },
                    {
                      label: 'ไม่',
                    }
                  ]
                })
            }}>ยืนยันการแก้ไข</button>
        </section>}
        <section className="reportImageData">
            <h2> รูปภาพ </h2>
            <section className="row center">
                {  images.map((image,index) =>
                    <img key={index} className="report_image" style={{margin:10}} 
                            src={(image.id)  ? image.file : URL.createObjectURL(image)} alt="report"
                    
                        onClick={ () =>

                            confirmAlert({
                                title: 'ยืนยันการลบรูปภาพ',
                                message: 'Are you sure to do this.',
                                buttons: [
                                  {
                                    label: 'Yes',
                                    onClick: () => {
                                        let arr = images.filter((x,i) => i !== index);
                                        setImages(arr)
                                    }
                                  },
                                  {
                                    label: 'No',
                                  }
                                ]
                              })

                        }  
                    />
                )}
            </section>
            <section>
                <input type={'file'} style={{display:'none'}}  ref={fileInput} onChange={(event) => {console.log(event.target.files[0]); setImages([...images,event.target.files[0]]); event.target.value = null;}}/>
                <button onClick={() => fileInput.current.click()}>
                    Upload a file
                </button>
            </section>
            
            <button className="submitButton" onClick={async () => {


                confirmAlert({
                    title: 'ยืนยันการแก้ไข',
                    message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                    buttons: [
                    {
                        label: 'ตกลง',
                        onClick: async () => {
                        try {
 
                            await editReportImage(location.state._id,images)
                            alert.success('แก้ไขเสร็จสิ้น')

                        } catch (err) {
                            alert.error((err?.response?.data?.message) ? err.response.data.message : err.message)
                        }
                        }
                    },
                    {
                        label: 'ไม่',
                    }
                    ]
                })

            }}>ยืนยันการแก้ไข</button>
        </section>
        {loading && <LoadingScreen/>}
    </main>
    );
}

  export default Report;