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
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { styled } from '@mui/material/styles';
import AddLicensePopup from '../components/license/AddLicensePopup';
const { REACT_APP_API_BASE_URL } = process.env;

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));


const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



const CitizenProfilePage = (props) => {
    const { keycloak, initialized } = useKeycloak();
    const [expanded, setExpanded] = React.useState('panel1');
    const [addLicenseModalShow, setAddLicenseModalShow] = React.useState(false);
    const [licenseData, setLicenseData] = React.useState({});
    const [profileData, setProfileData] = React.useState({});
    const [attestationStatus, setAttestationStatus] = React.useState('PENDING');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        if(panel == "panel2"){
            loadCitizenProfile();
        }
    };
    // let profileData = props.profileData;

    const loadCitizenProfile = async () => {
        let issuerToken = keycloak.token;
        const citizenDataResponse = await fetch(REACT_APP_API_BASE_URL + "CitizenV2", {
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
        })
        .then(response => response.json())
        .catch((error) => {
            console.log(error)
          });
          let citizenData = citizenDataResponse[0]
          setProfileData(citizenData);
          if(citizenData.drivinglicense){
              let licenseInfo = citizenData.drivinglicense[0];
              setLicenseData(citizenData.drivinglicense[0]);
              let affiliationData = citizenData['CitizenAffiliation'];
              if(affiliationData && affiliationData.length > 0){
                for(let i=0;i <affiliationData.length; i++){
                    // attestationStatus = affiliationData[i]["_osState"];
                    setAttestationStatus(affiliationData[i]["_osState"]);
                }
              }
          }
    };

    useEffect(() => {
        loadCitizenProfile();
    },[]);
  return <div style={{ marginLeft: '25px', marginRight: '25px' }}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Personal Information</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ marginLeft: '25px', marginRight: '25px' }}>
                    <FormControl fullWidth margin="dense"  >
                        <TextField
                            id="name"
                            label="Name"
                            style={{ marginTop: '15px' }}
                            value={profileData.name}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            id="name"
                            label="Email Address"
                            style={{ marginTop: '15px' }}
                            value={profileData.email}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            id="name"
                            label="Gender"
                            style={{ marginTop: '15px' }}
                            value={profileData.gender}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            id="name"
                            label="Date of Birth"
                            style={{ marginTop: '15px' }}
                            value={profileData.dob}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} >
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>License Information</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ marginLeft: '25px', marginRight: '25px' }}>
                {
                    licenseData && licenseData.osid ? 
                    <FormControl fullWidth margin="normal"  >
                        <TextField
                            id="licNum"
                            label="License Number"
                            style={{ marginTop: '15px' }}
                            value={licenseData.licnumber}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            id="issSt"
                            label="Issuing State Authority"
                            style={{ marginTop: '15px' }}
                            value={licenseData.state}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        /> 
                        <TextField
                            id="dtOfIs"
                            label="Date of Issue"
                            style={{ marginTop: '15px' }}
                            value={licenseData.issueddate}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />     
                        <TextField
                            id="dtOfVa"
                            label="Date of Validity"
                            style={{ marginTop: '15px' }}
                            value={licenseData.validupto}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />   
                        <TextField
                            id="attSta"
                            label="Attestation Status"
                            style={{ marginTop: '15px' }}
                            value={attestationStatus}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />                                                                                          
                        </FormControl>
                    :
                    <Button onClick={() => {setAddLicenseModalShow(true);}} >Add License</Button>
                }
                </AccordionDetails>
                <AddLicensePopup key="addLic"
        show={addLicenseModalShow} keycloak={keycloak}
        onHide={() => setAddLicenseModalShow(false)} citizenData={profileData}
        addLicenseCallback={(licenseData) => {setAddLicenseModalShow(false);loadCitizenProfile();}}
    />                
    </Accordion>
</div>;


}
export default CitizenProfilePage;