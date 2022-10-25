import logo from '../assets/logo.png'
import './styles/Loading.css'
function loadingScreen() {
    return (
      <>
        <section className='loadingbg'>
            <img  className = 'Loadinglogo' alt={'logo_image'} src={logo}/>
        </section>
        <h1>ยินดีต้อนรับ</h1>
      </>
    );
}

export default loadingScreen;