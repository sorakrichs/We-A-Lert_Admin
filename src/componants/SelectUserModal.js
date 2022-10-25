import { useEffect, useState } from 'react'
import Modal from 'react-modal';
import getMemberList from '../controllers/userControllers/getMemberListController';
import './styles/SelectVolunteerModal.css'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import default_user from '../assets/default_user.png'
import { confirmAlert } from 'react-confirm-alert';

const customStyles = {
  content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      height: '50vh',
      transform: 'translate(-50%, -50%)',
      zindex: 1,
  },
};

Modal.setAppElement('#root');

function SelectUserModal ({open,onClose,setVolunteer,volunteers}) {

    const [userlist,setUserList] = useState([]);
    const alert = useAlert()
    const navigate = useNavigate();

    useEffect(()=>{
      let active = true;
        load() 
      return () => {active = false}


      async function load() {

        try {
          let data = await getMemberList()
          if(active && data) 
            setUserList(data.filter((user) => !volunteers.find(({ _id }) => user._id === _id)));
        } catch (err) {
          
          if(err?.response?.status === 401) {
            navigate('/');
          } else {
            alert.error((err?.response?.data?.message) ? err.response.data.message : err.message);
          }

        }


      }

    },[alert,navigate,volunteers])


    return (
        <Modal
        isOpen={open}
        onRequestClose={onClose}
        style={customStyles}
        shouldCloseOnEsc={false}
        preventScroll={true}
        >
        <ul>{
          (userlist.length > 0) ? userlist.map((user,index) => {

            return (
              <div key={index}  className='volunteer_selectlist' onClick={
                
                async () => {
                  confirmAlert({
                    title: 'ยืนยันการเพื่ม',
                    message: 'กรุณาตรวจสอบก่อนที่จะกดตกลง',
                    buttons: [
                      {
                        label: 'ตกลง',
                        onClick: async () => {
                          try {
                            await setVolunteer(user)
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
                  })
                }
              }>
                <div className='row center'>
                  <img className = {'volunteer_image'} alt={'volunteer_image'} src={(user?.image) ? user?.image : default_user}/>
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
                    <div className='row center'>
                      <h4>ชื่อ</h4>
                      <input
                          placeholder='type here'
                          className="volunteer_inputbox"
                          disabled={true}
                          defaultValue={user?.name}
                          style={{width:'5vw'}}
                      />
                      <h4>นามสกุล</h4>
                      <input
                          placeholder='type here'
                          className="volunteer_inputbox"
                          disabled={true}
                          defaultValue={user?.surname}
                          style={{width:'5vw'}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
              
          })  : 
          <div className='waiting_memberlist' style={{justifyContent: 'center'}}>
            <h2> กำลังโหลด</h2>
          </div>
        }
      </ul>
      </Modal>
    )
  }
  
  export default SelectUserModal