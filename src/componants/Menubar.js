
import './styles/Menubar.css'
import { useState } from 'react'
import {Link} from "react-router-dom";
import logo from '../assets/logo.png'
import { FaBars } from "react-icons/fa";

function MenuBar (props) {

    const [items, setItems] = useState(props.items)
    const [active, setActive] = useState(false)
    
    const onHandleClick = d => {
        items.forEach(b => (b.active = false))
        d.active = true
        setItems([...items])
    }

    const openMenu = () => {
        setActive(!active)
    }

    return (
        <nav id="navbar-container">

            <h1 className='logo' onClick={() => openMenu()} >Wealert<img src={logo} alt="Logo" className='logo_img' /></h1>
            <div className='menu-icon' onClick={() => openMenu()}>
                <FaBars icon={'bars'} color={'white'} size={'50px'}/>
            </div>
            <div className={(active) ? 'menu open':'menu'}>
                {items.map(d => (
                    <Link key={d.label} className={d.active ? 'menuitem active' : 'menuitem'} style={{textDecoration:"none"}} to={d.path} onClick={() => onHandleClick(d)}>
                        <p>{d.icon}</p>
                        {d.label}
                    </Link>
                ))}
            </div>

        </nav>
    )
  }
  
  export default MenuBar


