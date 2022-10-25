import logo from '../assets/logo.png'
import './styles/Home.css'
function Home() {
    return (
      <>
        <section style={{width:'100%',top:'30%',position:'absolute'}}>
            <img  className = 'Applogo' alt={'logo_image'} src={logo}/>
        </section>
        <h1>ยินดีต้อนรับ</h1>
      </>
    );
}

export default Home;