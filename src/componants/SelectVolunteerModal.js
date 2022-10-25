import { useEffect, useState } from 'react'
import Modal from 'react-modal';
import getVolunteerList from '../controllers/userControllers/getVolunteerListController';
import './styles/SelectVolunteerModal.css'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import default_user from '../assets/default_user.png'

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

function SelectVolunteerModal ({open,onClose,setVolunteer}) {

    const [volunteerlist,setVolunteerList] = useState([]);
    const alert = useAlert()
    const navigate = useNavigate();

    useEffect(()=>{
      let active = true;
        load() 
      return () => {active = false}


      async function load() {

        try {
          let data = await getVolunteerList()
          if(active)
            setVolunteerList(data);
        } catch (err) {
          
          if(err?.response?.status === 401) {
            navigate('/');
          } else {
            alert.error((err?.response?.data?.message) ? err.response.data.message : err.message);
          }

        }


      }

    },[alert,navigate])


    return (
        <Modal
        isOpen={open}
        onRequestClose={onClose}
        style={customStyles}
        shouldCloseOnEsc={false}
        preventScroll={true}
        >
        <ul>{
          volunteerlist.map((volunteer,index) => {

            return (
              <div key={index}  className='volunteer_selectlist' onClick={
                () => {
                  setVolunteer(volunteer)
                }
              }>
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
                      <h4>หน่วยงาน</h4>
                      <input
                        placeholder='type here'
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
                        placeholder='type here'
                        className="volunteer_inputbox"
                        disabled={true}
                        defaultValue={volunteer?.teamrole}
                     />
                    </div>
                  </div>
                </div>
              </div>
            )
              
          })  
        }
      </ul>
      </Modal>
    )
  }
  
  export default SelectVolunteerModal