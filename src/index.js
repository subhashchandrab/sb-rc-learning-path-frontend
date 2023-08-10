import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import App from './App';
import keycloak from "./Keycloak";

ReactDOM.render(
    <ReactKeycloakProvider authClient={keycloak}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </ReactKeycloakProvider>,
    document.getElementById('root')
);

