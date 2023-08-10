import React from 'react'
import ProfilePage from './Profile';
import WelcomePage from './Welcome';
import { useKeycloak } from "@react-keycloak/web";

const HomePage = (props) => {
    const { keycloak, initialized } = useKeycloak();
    if(!keycloak.authenticated)
        return <WelcomePage keycloak={keycloak}/>;
    else 
        return <ProfilePage keycloak={keycloak}/>;

}

export default HomePage;