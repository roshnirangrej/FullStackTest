import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faHome,faRecycle,faRoute, faRobot,faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'; 




export default function  Navbar () {
const navigate = useNavigate();
  const [open, setopen] = useState(true);

  const togglenavbar = () => {
    setopen(!open);
  };
  const routeHandler = (path) => {
    navigate(path); 
  };

  return (
    <>
    <div className = {`navbar ${open ? 'open' : 'closed'}`}>
    <div className="navbar-header">
                     <button onClick={togglenavbar} className="navbar-toggle">
                        <FontAwesomeIcon icon={faBars} /> 
                    </button>
                
                </div>
              
                <ul className="navbar-menu">
                    <li onClick={() => routeHandler("/")}> <FontAwesomeIcon icon={faHome} className="icon" /> {open && <span className='text'>Home</span>}</li>
                    <li onClick={() => routeHandler("/Lifecycle")}> <FontAwesomeIcon icon={faRecycle} className="icon" /> {open && <span className='text'> Forklift Lifecycle</span>}</li>
                    <li onClick={() => routeHandler("/Moves")}> <FontAwesomeIcon icon={faRobot} className="icon" /> {open && <span className='text'>Forklift Movements</span>}</li>
                    <li onClick={() => routeHandler("/Obstacles")}> <FontAwesomeIcon icon={faExclamationTriangle} className="icon" /> {open && <span className='text'>Obstacle Detector</span>}</li>
                    <li onClick={() => routeHandler("/Tracking")}> <FontAwesomeIcon icon={faRoute} className="icon" /> {open && <span className='text'>Tracking System</span>}</li>
                    
                </ul>
                
            </div>   
            </>
  );
}


