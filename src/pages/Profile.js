import React, { useState, useEffect } from 'react';
import WelcomePage from './Welcome';
import OfficialProfilePage from './OfficialProfile';
import { useKeycloak } from "@react-keycloak/web";
import CitizenProfilePage from './CitizenProfile';
import { useNavigate } from 'react-router-dom';

const ProfilePage = (props) => {
    const keycloak = props.keycloak;
    const navigate = useNavigate();

    let currentUserRoles = keycloak && keycloak.realmAccess ? keycloak.realmAccess["roles"] : [];
        if(currentUserRoles.includes("admin"))
        {
            return <OfficialProfilePage keycloak={keycloak}/>
        }
        else if(currentUserRoles.includes("CitizenV2")){
            return <CitizenProfilePage keycloak={keycloak}/>
        }
        else{
            return <WelcomePage keycloak={keycloak}/>;
        }

}

export default ProfilePage;