import { useEffect, useState } from 'react'
import Modal from 'react-modal';
import './styles/AuthorizeModal.css'
import logo from '../assets/logo.png'
import {
  Link
} from "react-router-dom";

import Login from '../controllers/authorizationController/loginController';
import { useAlert } from 'react-alert'
import checkSessionExpire from '../controllers/sessionControllers/checkSessionExpire';
import { useNavigate } from 'react-router-dom'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      paddingLeft: '3vw',
      paddingRight: '3vw',
      transform: 'translate(-50%, -50%)',
      zindex: 1,
    },
};

Modal.setAppElement('#root');

function AuthorizeModal (props) {

    const alert = useAlert()
    const [modalIsOpen, setIsOpen] = useState(true);
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => { 

      let token = sessionStorage.getItem('@token');
      if(checkSessionExpire(token)) {
        setIsOpen(false);
      }
      else 
        alert.show('session หมดอายุ');

    },[alert])


    return (
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        contentLabel="Example Modal"
        >
        <h2>Login</h2>
        <form>
            <img src={logo} alt="Logo" />
            <section>
                <h3>Username</h3>
                <input type={'text'} className={'login_input'} value={username} onInput={text => setUsername(text.target.value)}/>
                <h3>Password</h3>
                <input type={'password'} className={'login_input'} value={password} onInput={text => setPassword(text.target.value)} autoComplete="true"/>
            </section>
            <section>
              <button type="button" className='btn_login' 
              onClick={async () => {

                try {

                  sessionStorage.setItem('@token',await Login(username,password));
                  setIsOpen(false);
                  alert.success('ยินยันตัวตนเสร็จสิ้น');
                  navigate('/');
                  
                } catch (err) {
                  alert.error((err?.response?.data?.message) ? err.response.data.message : err.message)
                }


              }}> 
                  Login
              </button>
            </section>
            <Link className={'hyperlink'} to={'/register'}>ลงทะเบียน admin</Link>
        </form>
      </Modal>
    )
  }
  
  export default AuthorizeModal