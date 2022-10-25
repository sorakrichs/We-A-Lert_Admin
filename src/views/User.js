import { useState,useEffect, useRef } from "react";
import {useLocation} from "react-router-dom";
import getUserImage from '../controllers/userControllers/getUserImageController'
import getVolunteerData from '../controllers/userControllers/getVolunteerDataController'
import getUserAddress from "../controllers/userControllers/getUserAddressController";
import getAddress from '../controllers/microControllers/getAddress'
import default_user from '../assets/default_user.png'
import { useNavigate } from 'react-router-dom'
import { longdo, map, LongdoMap } from "../componants/Longdomap";
import changeUserStatus from '../controllers/userControllers/changeUserStatusController'
import updateUserAddress from '../controllers/userControllers/updateUserAddressController'
import { confirmAlert } from 'react-confirm-alert';
import { useAlert } from 'react-alert'
import editUser from '../controllers/userControllers/editUserController'
import './styles/User.css'

function User() {
    const location = useLocation();
    const [image,setImage] = useState();
    const [volunteer,setVolunteer] = useState();
    const [userData,setUserData] = useState({
      username:location.state.username,
      name: location.state.name,
      surname: location.state.surname,
      email: location.state.email,
      personalid: location.state.personalid,
      phone: location.state.phone,

    });
    const [status,setStatus] = useState(location.state.status);
    const [addresses,setAddress] = useState([]);
    const [action,_setAction] = useState(null);

    const actionRef = useRef(action);
    const setAction = data => {
      actionRef.current = data;
      _setAction(data);
  };
    const navigate = useNavigate();
    const alert = useAlert();

    const waitForMap = () => new Promise((resolve, reject) => {


      if(typeof map == "undefined") {
          console.log('waiting')
          resolve(window.setTimeout(waitForMap, 100)); /* this checks the flag every 100 milliseconds*/

      } else {
          map?.Event.bind('overlayDrop', async function(overlay) {
              let address = await getAddress(overlay.location())
              const updatedAddress = [...addresses];
              updatedAddress[overlay.title.split(" ")[1]-1] =  {
                location: overlay.location(),
                aoi: (address?.aoi) ? address.aoi : null,
                district: address.district,
                postcode: address.postcode,
                province: address.province,
                subdistrict: address.subdistrict
            }
            setAddress(updatedAddress);
      
          });

          map?.Event.bind('click', async function(overlay) {
            if(actionRef.current === 'add') {
              setAction(null)
              let mouseLocation = map.location(longdo.LocationMode.Pointer);
              map.Overlays.add(new longdo.Marker(mouseLocation,{draggable:true}));
              let address = await getAddress(mouseLocation)
              setAddress(prev => [...prev,
                {
                  location: mouseLocation,
                  name: (address?.name) ? address?.name : `บ้าน`,
                  aoi: (address?.aoi) ? address.aoi : null,
                  district: address.district,
                  postcode: address.postcode,
                  province: address.province,
                  subdistrict: address.subdistrict
               }]);

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
          await waitForMap();
          let data = await Promise.all([getUserImage(location.state.image_id),getUserAddress(location.state._id)]);
          let volunteerData = (location.state.role === 'volunteer') ? await getVolunteerData(location.state._id) : null;
          if(active && data){
            setImage(data[0]);
            console.log(location.state._id)
            await Promise.all(
              data[1].map((address,index) => {
                let marker = new longdo.Marker({ lon: address.location.coordinates[0], lat: address.location.coordinates[1] },
                  {title:`ที่อยู่ที่ ${index+1}`,detail: address?.name,draggable:true});
                map.Overlays.add(marker);
                setAddress(prev => [...prev,{
                  location: {lon: address.location.coordinates[0], lat: address.location.coordinates[1]},
                  name: (address?.name) ? address?.name : `บ้าน${index+1}`,
                  aoi: (address?.aoi) ? address.aoi : null,
                  district: address.district,
                  postcode: address.postcode,
                  province: address.province,
                  subdistrict: address.subdistrict
                }])


                return null;
              })
            )
            setVolunteer(volunteerData);
          }
        } catch (err) {
            if(err?.response?.status === 401) {
              navigate('/login');
          } else {
              alert.error((err?.response?.data?.message) ? err.response.data.message : err.message);
          }
        } 
      }


    },[location.state._id,location.state.role,location.state.image_id,navigate,alert])

    return (
    <main style={{position:'relative',backgroundColor:'gainsboro',paddingBottom:'5vh'}}>
      <header className="reportheader">
            <h1> ข้อมูลสมาชิก </h1>
      </header>
      <section>
        <h3 style={{textAlign: 'left'}}>User ID</h3> 
        <input
          placeholder='type here'
          className="inputContainer"
          disabled={true}
          defaultValue={location.state._id}
        />
      </section>
      <section  className="disasterAddress"  style={{marginBottom:'5vh'}}>
          <h2> ที่อยู่ </h2>
          <div style={{width:'30vw',height:'50vh'}} className='mapdata'>
              <LongdoMap id="longdo-map" mapKey={'0ba75287512b12f50f558308fb6c720c'}/>
          </div>
          <button style={{width:'5vw',backgroundColor:(action==='add') ? 'orangered' : 'red',height:'5vh',cursor:'pointer',marginTop:'4vh'}} onClick={()=>{
            setAction('add')
          }}>
            เพื่มที่อยู่
          </button>
          { addresses.map( (address,index) => {
          return (
          <section  key={index}  className="addressData">
              <h2 style={{textAlign:'left',marginLeft:'2vw'}}>ที่อยู่ที่{` ${index+1}`}</h2> 
              <section>
                  <h3>ชื่อ</h3> 
                  <input
                      placeholder='type here'
                      className="inputContainer"
                      onInput={(event) => {
                        const updatedAddress = [...addresses];
                        updatedAddress[index] =  {...address,name: event.target.value}
                        setAddress(updatedAddress)
                      }}
                      value={address?.name}
                  />
              </section>
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
          </section>)})}
          <button className="submitButton" 
          onClick={async () => {
                  confirmAlert({
                    title: 'ยืนยันการแก้ไข',
                    message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                    buttons: [
                      {
                        label: 'ตกลง',
                        onClick: async () => {
                          try {
                            let updateaddresses = addresses.map((address,index) => {
                              
                              return({
                                userId: location.state._id,
                                name: (address?.name) ? address?.name : `บ้าน${index+1}`,
                                aoi: (address?.aoi) ? address.aoi : null,
                                subdistrict: address.subdistrict,
                                district: address.district,
                                postcode: address.postcode,
                                province: address.province,
                                location: {
                                  type:"Point",
                                  coordinates: [address.location.lon,address.location.lat]
                                }
                              })})
                              await updateUserAddress(location.state._id,updateaddresses)
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
              }} >ยืนยันการแก้ไข</button>
      </section>
      <section className="userVolunteerData">
        <h2> ข้อมูลบัญชี </h2>
        <section className="row center">
          <img className="profile_image" style={{marginRight:90}} src={(image) ? image : default_user } alt="profile"/>
          <section className="column" style={{marginLeft:20}}>
            <section>
              <h3 style={{textAlign: 'left'}}>Username</h3> 
              <input
                placeholder='ชื่อบัญชี'
                className="inputContainer"
                onInput={(event) => {setUserData({...userData, username: event.target.value})}}
                defaultValue={userData.username}
              />
              {!userData.username && <p className='error'> กรุณาใส่ชื่อบัญชี </p>}
            </section>
            <section>
              <h3 style={{textAlign: 'left'}}>Name</h3> 
              <input
                placeholder='ชื่อ'
                className="inputContainer"
                onInput={(event) => {setUserData({...userData, name: event.target.value})}}
                defaultValue={userData.name}
              />
              {!userData.name && <p className='error'> กรุณาใส่ชื่อจริง </p>}
            </section>
            <section >
              <h3 style={{textAlign: 'left'}}>Surname</h3> 
              <input
                placeholder='นามสกุล'
                className="inputContainer"
                onInput={(event) => {setUserData({...userData, surname: event.target.value})}}
                defaultValue={userData.surname}
              />
              {!userData.surname && <p className='error'> กรุณาใส่นามสกุล </p>}
            </section>
            <section>
              <h3 style={{textAlign: 'left'}}>Role</h3> 
              <input
                placeholder='type here'
                className="inputContainer"
                disabled={true}
                defaultValue={location.state.role}
              />
            </section>
            <section>
              <h3 style={{textAlign: 'left'}}>Email</h3> 
              <input
                placeholder='ใส่ข้อมูล'
                className="inputContainer"
                onInput={(event) => {setUserData({...userData, email: event.target.value})}}
                defaultValue={userData.email}
              />
              {(!(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'g')
                .test(userData.email)) && userData.email) && <p className='error'> อีเมลผิดรูปแบบ </p>}
            </section>
            <section>
              <h3 style={{textAlign: 'left'}}>เลชบัตรประชาชน</h3> 
              <input
                placeholder='ใส่ข้อมูล'
                className="inputContainer"
                disabled={true}
                defaultValue={userData.personalid}
              />
            </section>
            <section>
              <h3 style={{textAlign: 'left'}}>เบอร์โทรศัพท์</h3> 
              <input
                placeholder='ใส่ข้อมูล'
                className="inputContainer"
                onInput={(event) => {setUserData({...userData, phone: event.target.value})}}
                defaultValue={userData.phone}
              />
              { !(new RegExp('^[0-9]{10}$', 'g').test(userData.phone)) &&  <p className='error'> หมายเลขโทรศัพท์ไม่ครบ 10 ตัว </p>}
              { !(new RegExp('^(0[689]{1})+([0-9]{8})+$', 'g').test(userData.phone)) &&  <p className='error'> หมายเลขโทรศัพท์ผิดรูปแบบในประเทศไทย </p>}
            </section>
          </section>
        </section>
        <button className="submitButton" 
          onClick={async () => {
                  confirmAlert({
                    title: 'ยืนยันการแก้ไข',
                    message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                    buttons: [
                      {
                        label: 'ตกลง',
                        onClick: async () => {
                          try {
                            await editUser(location.state._id,userData);
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
              }} >ยืนยันการแก้ไข</button>
      </section>  



      { volunteer &&
      <section className = 'userVolunteerData'>
        <h2> ข้อมูลอาสาสมัคร </h2>
        <section className="row center">
          <section>
            <h3>ชื่อองค์กร</h3> 
            <input
                placeholder='type here'
                className="inputContainer"
                disabled={true}
                defaultValue={volunteer?.organization_name}
            />
          </section>
          <section>
            <h3>สาขา</h3> 
            <input
                placeholder='ไม่ระบุ'
                className="inputContainer"
                disabled={true}
                defaultValue={volunteer.organization_branchname}
            />
          </section>
        </section>
        <section>
            <h3>ตำแหน่งในทีม</h3> 
            <input
                placeholder='type here'
                className="inputContainer"
                disabled={true}
                defaultValue={volunteer.teamrole}
            />
        </section>
      </section>}
      <section className = 'userVolunteerData' style={{marginTop:'5vh'}}>
        <h2>การแบน</h2> 
        {!(status === 'ban') ? 
        <h3>บัญชีนี้ยังไม่ถูกระงับการใช้งานกดปุ่มเพื่อระงับการใช้งาน</h3> : <h3>บัญชีนี้ถูกระงับการใช้งานกดปุ่มเพื่อปลดการระงับการใช้งาน</h3>
        }
        {!(status === 'ban') ? 
        <button className = 'banButton' style={{backgroundColor:'darkred'}} 
          onClick = {async ()=> {
            confirmAlert({
              title: 'ยืนยันการสั่งระงับการใช้งานบัญชีนี้',
              message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
              buttons: [
                {
                  label: 'ตกลง',
                  onClick: async () => {

                    await changeUserStatus(location.state._id,'ban')
                    .then(() => {
                      setStatus('ban')
                      alert.success('ระงับการใช้งานบัญชีเสร็จสิ้น')
                    })
                    .catch((err) => alert.error((err?.response?.data?.message) ? err.response.data.message : err.message))
                  }
                },
                {
                  label: 'ไม่',
                }
              ]
            })
          }
        }>
          ระงับการใช้งาน
        </button> : 
        <button className = 'banButton' style={{backgroundColor:'green'}}
          onClick = { async ()=> {
            confirmAlert({
              title: 'ยืนยันการสั่งปลดการระงับการใช้งานบัญชีนี้',
              message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
              buttons: [
                {
                  label: 'ตกลง',
                  onClick: async () => {

                    await changeUserStatus(location.state._id,'approved')
                    .then(() => {
                      setStatus('approved')
                      alert.success('ปลดการระงับการใช้งานบัญชีเสร็จสิ้น')
                    })
                    .catch((err) => alert.error((err?.response?.data?.message) ? err.response.data.message : err.message))
                  }
                },
                {
                  label: 'ไม่',
                }
              ]
            })}}>
          ปลดการระงับการใช้งาน
        </button>}
      </section>
    </main>
    );
}

  export default User;