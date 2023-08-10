import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import MainNavigation from './components/layout/MainNavigation';
import SiteFooter from './components/layout/SiteFooter';
import React, { useState, useEffect } from 'react';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import ProfilePage from './pages/Profile';
import VehicleRecordsPage from './components/vehicle/VechileRecords';
import LicenseClaimsPage from './components/license/LicenseClaims';
import CitizenVehiclesPage from './components/vehicle/CitizenVehicles';
import { useKeycloak } from "@react-keycloak/web";

const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

const App = () => {
    const { keycloak, initialized } = useKeycloak();

    const fetchData = () => {
        // fetch(REACT_APP_PRODUCT_CATALOG_SERVICE_URL)
        //     .then((res) => res.json())
        //     .then((json) => {
        //         setProductData(json);
        //     });
    }

    React.useEffect(() => {
        fetchData();
    }, []);



    return <div>
        
        <MainNavigation />
        <Routes>
            <Route path='/' element={<HomePage  keycloak={keycloak}/>} />
            <Route path='/profile' element={<ProfilePage  keycloak={keycloak}/>} />
            <Route path='/vehicleRecords' element={<VehicleRecordsPage keycloak={keycloak}/>} />
            <Route path='/claims' element={<LicenseClaimsPage  keycloak={keycloak}/>} />
            <Route path='/myVehicles' element={<CitizenVehiclesPage keycloak={keycloak}/>} />
        </Routes>

        <SiteFooter />
    </div>
}

export default App;
