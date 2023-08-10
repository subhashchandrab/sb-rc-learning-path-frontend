import React, { useState, useEffect } from 'react';
import WelcomePage from './Welcome';
import { useKeycloak } from "@react-keycloak/web";
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Input } from '@mui/material';
import { FormHelperText } from '@mui/material';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/esm/Card';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Box from '@mui/material/Box';
import Container from "react-bootstrap/esm/Container";
import TextField from '@mui/material/TextField';
const { REACT_APP_API_BASE_URL } = process.env;

const OfficialProfilePage = (props) => {
    const keycloak = props.keycloak;
    const [profileData, setProfileData] = React.useState({});

    const loadOfficialProfile = async() => {
        let issuerToken = keycloak.token;
        console.log("process.env.REACT_APP_API_BASE_URL: " + REACT_APP_API_BASE_URL);
        const profileData = await fetch(REACT_APP_API_BASE_URL + "Official", {
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
        })
        .then(response => response.json())
        .then((data) => {
            let profileInfo = {};
            profileInfo['name'] = data[0].accountDetails['userId'];
            profileInfo['email'] = data[0].contactDetails['email'];
            profileInfo['location'] = data[0]['name'];
            setProfileData(profileInfo);
         } )
        .catch((error) => {
            console.log(error)
          });

          let profileInfo = {};
          if(profileData && profileData.length > 0 && profileData.accountDetails){
              profileInfo['name'] = profileData[0].accountDetails['userId'];
              profileInfo['email'] = profileData[0].contactDetails['email'];
              profileInfo['location'] = profileData[0]['name'];
              setProfileData(profileInfo);
          }

    };

    useEffect(() => {
        loadOfficialProfile();
    },[]);

    // const profileData = props.profileData;

    return <div style={{ marginLeft: '25px', marginRight: '25px' }} className="container">
        <FormControl fullWidth margin="normal"  >
            <TextField
                id="name"
                label="Name"
                InputLabelProps={{ shrink: true }}
                style={{ marginTop: '10px'}}
                value={profileData.name}
                InputProps={{
                    readOnly: true,
                }}
            />
            <TextField
                id="name"
                label="Email Address"
                style={{ marginTop: '10px'}}
                InputLabelProps={{ shrink: true }}
                value={profileData.email}
                InputProps={{
                    readOnly: true,
                }}
            />
            <TextField
                id="name"
                label="Date of Birth"
                style={{ marginTop: '10px' }}
                InputLabelProps={{ shrink: true }}
                value={profileData.location}
                InputProps={{
                    readOnly: true,
                }}
            />
        </FormControl>
    </div>

}

export default OfficialProfilePage;