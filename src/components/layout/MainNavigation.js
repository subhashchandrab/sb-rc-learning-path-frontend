import { Link } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom';
function MainNavigation() {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    return 			<header className="site-header">
    <div className="top-header">
        <div className="container">
            <a href="/" id="branding">
                <img src="images/sunbird.png" alt="Company Name" className="logo"/>
                <div className="logo-text">
                    <h1 className="site-title">Sunbird RC Demo</h1>
                    <small className="description">Vehicle Registry</small>
                </div>
            </a> 
        
            <div className="right-section pull-right">
                <a href="#" className="phone"><img src="images/Oracle-oci-logo.png" className="icon"/>
                </a>
        
            </div>
        </div> 

    
    <div className="bottom-header">
        <div className="container">
            <div className="main-navigation">
                <button type="button" className="menu-toggle"><i className="fa fa-bars"></i></button>
                <ul className="menu">
                    {!keycloak.authenticated && 
                    (<li className="menu-item"><Link to='/'>Home</Link></li>)
                    }
                    {keycloak.authenticated && 
                    (<li className="menu-item"><Link to='/profile'>Profile</Link></li>)
                    }
                    {!!keycloak.authenticated &&   keycloak.realmAccess["roles"].includes("admin") &&
                    (<li className="menu-item"><Link to='/vehicleRecords'>Vehicle Records</Link></li>)
                    }
                    {!!keycloak.authenticated &&   keycloak.realmAccess["roles"].includes("admin") &&
                    (<li className="menu-item"><Link to='/claims'>Claims</Link></li>)
                    }                    
                    {!!keycloak.authenticated &&   keycloak.realmAccess["roles"].includes("CitizenV2") &&
                    (<li className="menu-item"><Link to='/myVehicles'>My Vehicles</Link></li>)
                    }
                   
                </ul> 
            </div> 
            
            <div className="social-links" >
                      {!!keycloak.authenticated && (
                        <a className="menu-item" onClick={() => {
                            navigate('/', { replace: true });
                            keycloak.logout();
                        }}
                            >
                          Logout ({keycloak.tokenParsed.preferred_username})
                        </a>
                      )} 
            </div>
            
        </div>
    </div>
    
    </div>
    
</header>

}

export default MainNavigation;
