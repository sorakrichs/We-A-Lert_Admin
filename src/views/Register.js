import React,{ useState } from 'react';
import './styles/Register.css'
import default_user from '../assets/default_user.png'
import thaiIdCard from 'thai-id-card';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useAlert } from 'react-alert'
import registerController from '../controllers/authorizationController/registerController';
import { useNavigate } from 'react-router-dom'

function Register() {

    const alert = useAlert()
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState(''); 
    const [confirmPassword,setConfirmPassword] = useState('') 
    const [name,setName] = useState('')  
    const [surname,setSurname] = useState('');
    const [id,setId] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');
    const [image,setImage] = useState(null)
    const [isValid,setIsValid] = useState(new Map([[0,false],[1,false],[2,false],[3,false]
        ,[4,false],[5,false],[6,false],[7,false],[8,false],[9,false],[10,false],[11,false]],[12,false],[13,false]));
    const navigate = useNavigate();

    
    return (
    <main className='register'>
        <header className='registerheader'> ลงทะเบียน </header>
        <form className='register_form'>
            <section>
                <img className = {'input_image'} alt={'register_image'} src={(image) ? URL.createObjectURL(image) : default_user}/> <br/>
                <input type={'file'} onChange={(event) => setImage(event.target.files[0])}/>
            </section>
            <section>
                <h1> ชื่อบัญชี </h1>
                <input type={'text'} value={username} className = {'input_text'}
                    onInput={text => {
                        (text.target.value !== '') ? setIsValid(isValid.set(0,true)) : setIsValid(isValid.set(0,false));
                        setUsername(text.target.value);
                    }
                } />
                {!isValid.get(0) && <p className='error'> กรุณาใส่ชื่อบัญชี </p>}
            </section>
            <section>
                <h1> รหัส </h1>
                <input type={'password'} className = {'input_text'} value={password} autoComplete={'true'} onInput={text => {

                    (text.target.value !== '') ? setIsValid(isValid.set(1,true)) : setIsValid(isValid.set(1,false));
                    (text.target.value.length >= 8) ? setIsValid(isValid.set(2,true)) : setIsValid(isValid.set(2,false));
                    setIsValid(isValid.set(3,(new RegExp('(?=.*\\d)', 'g')).test(text.target.value)));
                    setIsValid(isValid.set(4,(new RegExp('(?=.*[A-Z])', 'g')).test(text.target.value)));
                    setPassword(text.target.value)


                }} />

                <PasswordStrengthBar 
                    password={password} 
                    minLength={8}
                />

                { !isValid.get(1) && <p className='error'> กรุณาใส่รหัส </p>}
                { !isValid.get(2) &&  <p className='error'> Password ต้องมีอย่างน้อย 8 ตัวอักษร </p>}
                { !isValid.get(3) &&  <p className='error'> ต้องมีตัวเลขอยู่ในรหัสผ่าน </p>}
                { !isValid.get(4) &&  <p className='error'> ต้องมีต้องมีอักษรพิมพ์ใหญอยู่ในรหัสผ่านอย่างน้อย 1 ตัว </p>}
            </section>
            <section>
                <h1> ยืนยันรหัส </h1>
                <input type={'password'} className = {'input_text'} value={confirmPassword}  autoComplete={'true'} onInput={text => {

                    (text.target.value === password) ? setIsValid(isValid.set(5,true)) : setIsValid(isValid.set(5,false));
                    setConfirmPassword(text.target.value)

                }}/>
                { !isValid.get(5) &&  <p className='error'> รหัสผ่านไม่ตรงกัน</p>}
            </section>
            <section>
                <h1> ชื่อจริง </h1>
                <input type={'text'} value={name} className = {'input_text'} onInput={text => {

                    (text.target.value !== '') ? setIsValid(isValid.set(6,true)) : setIsValid(isValid.set(6,false));
                    setName(text.target.value)

                }} />
                 { !isValid.get(6) &&  <p className='error'> กรุณาใส่ชื่อจริง</p>}
            </section>
            <section>
                <h1> นามสกุล </h1>
                <input type={'text'} value={surname} className = {'input_text'} onInput={text => {

                    (text.target.value !== '') ? setIsValid(isValid.set(7,true)) : setIsValid(isValid.set(7,false));
                    setSurname(text.target.value)
                
                }}/>
                 { !isValid.get(7) &&  <p className='error'> กรุณาใส่นามสกุล </p>}
            </section>
            <section>
                <h1> เลขบัตรประชาชน </h1>
                <input type={'text'} value={id}  className = {'input_text'} onInput={text => {

                    (text.target.value !== '') ? setIsValid(isValid.set(8,true)) : setIsValid(isValid.set(8,false));
                    thaiIdCard.verify(text.target.value) ? setIsValid(isValid.set(9,true)) : setIsValid(isValid.set(9,false));
                    setId(text.target.value);

                }}/>
                { !isValid.get(8) &&  <p className='error'> กรุณาใส่เลชบัตรประชาชน </p>}
                { !isValid.get(9) &&  <p className='error'> รูปแบบเลขบัตรประชาชนไม่ถูกต้อง </p>}
            </section>
            <section>
                <h1> หมายเลขโทรศัพท์ </h1>
                <input type={'tel'} value={phone}  className = {'input_text'} onInput={text => {

                    setIsValid(isValid.set(10,(new RegExp('^[0-9]{10}$', 'g')).test(text.target.value)));
                    setIsValid(isValid.set(11,(new RegExp('^(0[689]{1})+([0-9]{8})+$', 'g')).test(text.target.value)));
                    setPhone(text.target.value)

                }}/>
                { !isValid.get(10) &&  <p className='error'> หมายเลขโทรศัพท์ไม่ครบ 10 ตัว </p>}
                { !isValid.get(11) &&  <p className='error'> หมายเลขโทรศัพท์ผิดรูปแบบในประเทศไทย </p>}
            </section>
            <section>
                <h1> อีเมล </h1>
                <input type={'email'} value={email}  className = {'input_text'} onInput={text => {

                    (text.target.value !== '') ? setIsValid(isValid.set(12,true)) : setIsValid(isValid.set(12,false));
                    setIsValid(isValid.set(13,(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'g')).test(text.target.value)));
                    setEmail(text.target.value)

                }}/>
                { !isValid.get(12) &&  <p className='error'> กรุณาใส่อีเมล </p>}
                { !isValid.get(13) &&  <p className='error'> อีเมลผิดรูปแบบ </p>}
            </section>
            <button type={'button'} className='submit_btn' onClick={ async () => {

                try {

                    let test = true;
                    isValid.forEach(callback => {
                        test = test && callback
                    })

                    if(test) {

                        await registerController({username: username, password: password, name:name, surname: surname, role:'admin', email:email, personalid:id, phone:phone});
                        alert.success('ลงทะเบียนเสร็จสิ้น');
                        navigate(`/`)

                    } else {
                        alert.error('ข้อมูลไม่ถูกต้อง');
                    }

                } catch (err) {
                    alert.error((err?.response?.data?.message) ? err.response.data.message : err.message);
                }
            }}>
                ลงทะเบียน
            </button>
        </form>
    </main>
    );
}



export default Register;