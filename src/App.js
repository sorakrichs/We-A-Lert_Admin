import MenuBar from './componants/Menubar'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useLocation
} from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import AuthorizeModal from './componants/AuthorizeModal'
import Home from './views/Home'
import Users from './views/Users'
import User from './views/User'
import Organizations from './views/Organizations'
import Organization from './views/Organization'
import Register from './views/Register';
import Reports from './views/Reports'
import Report from './views/Report'
import Logs from './views/Logs'
import { FaHome,FaUserAlt,FaBuilding } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { GrDocument } from "react-icons/gr";
function App() {

  // optional configuration
  const options = {
    // you can also just use 'bottom center'
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '30px',
    // you can also just use 'scale'
    transition: transitions.SCALE
  }

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Router>
        <Routes>
          <Route path="/" element={<LayoutsWithNavbar/>}>
            <Route path="/users" element={<Users />}/>
            <Route path="/users/:id" element={<User />}/>
            <Route path="/organization" element={<Organizations />}/>
            <Route path="/organization/:id" element={<Organization />}/>
            <Route path="/reports" element={<Reports />}/>
            <Route path="/reports/:id" element={<Report />}/>
            <Route path="/log" element={<Logs />}/>
            <Route path="/" element={<Home />}/>
          </Route>
          <Route path="/login" element={<AuthorizeModal/>}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      </Router>
    </AlertProvider>
  );
}



function LayoutsWithNavbar() {
  return (
    <>
      {/* Your navbar component */}
      <MenuBar items={[
          { label: 'Home', path:'/', active: (useLocation().pathname === '/') ? true : false, icon: <FaHome size={30} style={{marginRight:5}}/>},
          { label: 'User', path:'/users',active: (useLocation().pathname.includes('/users')) ? true : false, icon: <FaUserAlt size={30} style={{marginRight:5}}/>},
          { label: 'Organization', path:'/organization' ,active: (useLocation().pathname.includes('/organization')) ? true : false, icon: <FaBuilding size={30} style={{marginRight:5}}/>},
          { label: 'Report', path:'/reports' ,active: (useLocation().pathname.includes('/reports')) ? true : false, icon: <GoReport size={30} style={{marginRight:5}}/>},
          { label: 'Log', path:'/log' ,active: (useLocation().pathname === '/log') ? true : false, icon: <GrDocument size={30} style={{marginRight:5}}/>},
      ]}/>

      {/* This Outlet is the place in which react-router will render your components that you need with the navbar */}
      <Outlet /> 
      
      {/* You can add a footer to get fancy in here :) */}
    </>
  );
}


export default App;
