import React from 'react'
import './managePage.css'
import { cpBody, cpMenu } from './cpMenu'
import LogoutIcon from '@mui/icons-material/Logout';

const ManagePage = () => {
  const [secTitle, setSecTitle] = React.useState("Administrar barberos")

  const logOut = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
    <div className='container-control-panel'>
      <nav>
        <div className="logo-name">
          <span className="logo_name">Panel administrador</span>
        </div>
        <div className="menu-items">
          <ul className="nav-links">
            {cpMenu.map((item, index) => (
              <li key={index} onClick={() => setSecTitle(item.title)}><a href="#">
                <item.icon className={`icon ${secTitle === item.title && 'active'}`} />
                <span className={`link-name ${secTitle === item.title && 'active'}`}>{item.title}</span>
              </a></li>
            ))}
          </ul>
          <ul className="logout-mode">
            <li onClick={logOut}><a href="#">
              <LogoutIcon className='icon exit-icon' />
              <span className="link-name">Cerrar sesion</span>
            </a></li>
          </ul>
        </div>
      </nav>
      <section className="cp-section">
        <div className='cp-section-top'>
          <p className='title'>{secTitle}</p>
        </div>
        {cpBody?.map((item, index) => (
          <div key={index}>
            {item.title === secTitle && <item.component />}
          </div>
        ))}
      </section>
    </div>
  )
}

export default ManagePage