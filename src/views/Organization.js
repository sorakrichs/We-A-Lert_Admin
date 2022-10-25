
import './styles/Organization.css'
import { useState,useEffect } from 'react';
import getOrganizationData from '../controllers/organizationControllers/getOrganizationDataController'
import changeOrganizationAddress from '../controllers/organizationControllers/changeOrganizationAddressController'
import editOrganizationData from '../controllers/organizationControllers/editOrganizationDataController'
import { useLocation,useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import default_user from '../assets/default_user.png'
import { longdo, map, LongdoMap } from "../componants/Longdomap";
import getAddress from '../controllers/microControllers/getAddress'
import { confirmAlert } from 'react-confirm-alert';
import SelectUserModal from '../componants/SelectUserModal';
import Dropdown from 'react-dropdown';
import addVolunteer from '../controllers/organizationControllers/addVolunteerController';
import removeVolunteer from '../controllers/organizationControllers/removeVolunteerController';
import changeVolunteerRole from '../controllers/userControllers/changeVolunteerRoleController'
import LoadingScreen from "../componants/LoadingScreen";

function Users() {

    const location = useLocation();
    const  [volunteers,setVolunteers] = useState([]);
    const navigate = useNavigate();
    const alert = useAlert();
    const order = ['leader','deputy','staff']
    const [addressLocation,setAddressLocation] = useState({lon: location.state.address.location.coordinates[0], lat: location.state.address.location.coordinates[1]});
    const [modalIsOpen, setIsOpen] = useState(false);
    const [address,setAddress] = useState({
        aoi: (location.state?.aoi) ? location.state.aoi : null,
        district: location.state.address.district,
        postcode: location.state.address.postcode,
        province: location.state.address.province,
        subdistrict: location.state.address.subdistrict,
    });
    const [organizationData,setOrganizationData] = useState({
      name: location.state.name,
      branchname: location.state.branchname,
      description: location.state.description,
      email: location.state.email
    })
    const [loading,setLoading] = useState(true)

    const object = new Map();
    order.forEach((x,i) => object.set(x,i));
    
    const waitForMap = () => new Promise((resolve, reject) => {


      if(typeof map == "undefined") {
          console.log('waiting')
          window.setTimeout(resolve(waitForMap), 100); /* this checks the flag every 100 milliseconds*/

      } else {
          map?.Event.bind('overlayDrop', async function(overlay) {
              setAddressLocation(overlay.location());
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
      
          });

          resolve(true);

      }
  });


    useEffect(()=>{

      let active = true;
        setLoading(true)
        load()
        setLoading(false)
      return () => {active = false}

      async function load() {

        try {

          let data = await getOrganizationData(location.state._id)
          if(active){
            await waitForMap();
            let marker = new longdo.Marker({lon: location.state.address.location.coordinates[0], lat: location.state.address.location.coordinates[1]},{draggable:true});
            map.Overlays.add(marker);
            setVolunteers(data.sort((x,y) => object.get(x?.teamrole) - object.get(y?.teamrole)))
          }

        } catch (err) {

          if(err?.response?.status === 401) {

            navigate('/login');

          } else {

            alert.error((err?.response?.data?.message) ? err.response.data.message : err.message);

          }
        }
      }


    },[alert,navigate,location.state])


  
    return (
      <main>
        <SelectUserModal
          open={modalIsOpen}
          onClose={() => setIsOpen(false)}
          volunteers={volunteers}
          setVolunteer={async (data) => {
            data.count = {
              report_count: 0,
              validate_count: 0
            }
            data.teamrole = (volunteers.filter(({_id,teamrole}) => teamrole === 'leader').length <= 0) ? 'leader' : 'staff'
            await addVolunteer(location.state._id,data);
            setVolunteers([...volunteers,data])
            setIsOpen(false)
          }}
          
        />
        <header className="reportheader">
            <h1> องค์กร </h1>
        </header>
        <section id='organization'>
          <section>
            <h2>Organization ID</h2> 
            <input
                placeholder='type here'
                className="inputContainer"
                disabled={true}
                defaultValue={location.state._id}
                style={{textAlign:'center'}}
            />
          </section>
          <section  className="disasterAddress" style={{marginBottom:'5vh'}}>
              <h2> ที่อยู่องค์กร </h2>
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
                            await changeOrganizationAddress(location.state._id,addressData)
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
          <section className='userVolunteerData'>
            <section>
                <h2>ชื่อองค์กร</h2> 
                <input
                    placeholder='กรุณาใส่ข้อมูล'
                    className="inputContainer"
                    defaultValue={organizationData.name}
                    onInput={(event) => {
                      setOrganizationData({...organizationData, name: event.target.value})
                      
                    }}
                    style={{textAlign:'center'}}
                />
                {!organizationData.name && <p className='error'> กรุณาใส่ชื่อบัญชี </p>}
            </section>
            <section >
                <h2>สาขาองค์กร</h2> 
                <input
                    placeholder='กรุณาใส่ข้อมูล'
                    className="inputContainer"
                    defaultValue={organizationData.branchname}
                    onInput={(event) => {setOrganizationData({...organizationData, branchname: event.target.value})}}
                    style={{textAlign:'center'}}
                />
            </section>
            <section >
                <h2>อีเมล</h2> 
                <input
                    placeholder='กรุณาใส่ข้อมูล'
                    className="inputContainer"
                    defaultValue={organizationData.email}
                    onInput={(event) => {setOrganizationData({...organizationData, email: event.target.value})}}
                    style={{textAlign:'center'}}
                />
                {(!(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'g')
                .test(organizationData.email)) && organizationData.email) && <p className='error'> อีเมลผิดรูปแบบ </p>}
            </section>
            <section >
                <h2>รายละเอียด</h2> 
                <textarea
                    placeholder='กรุณาใส่ข้อมูล'
                    className="textAreaContainer"
                    defaultValue={organizationData.description}
                    onInput={(event) => {setOrganizationData({...organizationData, description: event.target.value})}}
                    style={{textAlign:'center'}}
                />
                {!organizationData.description && <p className='error'> กรุณาใส่รายละเอียด </p>}
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
                          if(!organizationData.name)
                            throw new Error(`กรุณาใส่ชื่อองค์กร`)
                          if(organizationData.email && !(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'g')
                          .test(organizationData.email)))
                            throw new Error(`อีเมลผิดรูปแบบ`)
                          if(!organizationData.description)
                            throw new Error(`กรุณาใส่รายละเอียดองค์กร`)
                          
                          await editOrganizationData(location.state._id,organizationData)
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


          <section className='userVolunteerDataList' style={{marginBottom:'5vh'}}>
            <h2>สมาชิกในทีม</h2> 
            { volunteers.map((volunteer,index) => {
              return(
              <div key={index}  className='volunteer_onclicklist' style={{marginBottom:'1vh'}}>
                <div className='row center'>
                  <img className = {'volunteer_image'} alt={'volunteer_image'} src={(volunteer?.image) ? volunteer?.image : default_user}/>
                  <div>
                    <div className='row center'>
                      
                      <h4>ชื่อบัญชี</h4>
                      <input
                        placeholder='type here'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.username}
                      />
                    </div>
                    <div className='row center'>
                      <h4>ตำแหน่งในทีม</h4>
                      <Dropdown 
                          controlClassName="role"
                          menuClassName="roleMenu"
                          options={[{ value: 'leader', label: 'leader'},{ value: 'deputy', label: 'deputy' }
                          ,{ value: 'staff', label: 'staff' }]} 
                          onChange={({value})=> {


                            confirmAlert({
                              title: 'ยืนยันการเปลี่ยนตำแน่งในหน่วยงาน',
                              message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                              buttons: [
                                {
                                  label: 'ตกลง',
                                  onClick: async () => {
                                    try {
                                      if(volunteers.filter(({_id,teamrole}) => teamrole === 'leader' && _id !==  volunteer?._id).length > 0 && value === 'leader')
                                        throw new Error('มีตำแหน่งหััวหน้าอยู่ในทีมอยู่แล้วไม่สามารถเปลี่ยนได้')
                                      await changeVolunteerRole(volunteer._id,value)
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


                          }}
                          value={volunteer?.teamrole} 
                          placeholder="Select an option" 
                      />
                    </div>
                    <div className='row center'>
                      <h4>จำนวนการรายงาน</h4>
                      <input
                        placeholder='ไม่อยู่ในระบบ'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.count.report_count}
                        style={{width:'5vw'}}
                      />
                    </div>
                    <div className='row center'>
                      <h4>จำนวนการรับเรื่อง</h4>
                      <input
                        placeholder='ไม่ระบุ'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.count.validate_count}
                        style={{width:'5vw'}}
                      />
                    </div>
                  </div>
                </div>
                <button className="look_volunteer_button" onClick={() => navigate(`/users/${volunteer._id}`,{state:volunteer})}> ดูบัญชี </button>
                <button className="look_volunteer_button" style={{backgroundColor: 'red'}} 
                onClick={async () => {confirmAlert({
                  title: 'ยืนยันการนำอาสาสมัครออก',
                  message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                  buttons: [
                    {
                      label: 'ตกลง',
                      onClick: async () => {
                        try {
                          await removeVolunteer(location.state._id,volunteer);
                          setVolunteers(volunteers.filter(({_id}) => volunteer._id !== _id))
                          alert.success('ดำเนินการเสร็จสิ้น')
                        } catch (err) {
                          alert.error((err?.response?.data?.message) ? err.response.data.message : err.message)
                        }
                      }
                    },
                    {
                      label: 'ไม่',
                    }
                  ]
                })}}> ปลดออก </button>
              </div>
            )})}
            <button className="addButton" onClick={() => {

              setIsOpen(true)

            }}> เพื่มสมาชิก </button>
          </section>
        </section>
        {loading && <LoadingScreen/>}
      </main>
    )
}


  export default Users;