import React from 'react'
import RoleListing from '../components/role/RoleListing';

const WelcomePage = (props) => {
    const keycloak = props.keycloak; 
    return (
        <div className="container">
            <h3 className="entry-title">Sunbird Registry for Vehicle Management</h3>
            <p>
                Select your role and click on register/login to continue
            </p>

            <RoleListing keycloak={keycloak}/>

        </div>
    );
}

export default WelcomePage;