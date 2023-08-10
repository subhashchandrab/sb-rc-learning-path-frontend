import React from 'react';
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useKeycloak } from "@react-keycloak/web";
const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

const AddVehiclePopup = (props) => {
    // const { keycloak, initialized } = useKeycloak();
    let citizenData = props.citizenData;
    const keycloak = props.keycloak;
    let issuerToken = keycloak.token;
    // let selectedCitizen = {};
    const [vehicleType, setVehicleType] = React.useState('');
    const [regNum, setRegNum] = React.useState('');
    const [mnfYear, setMnfYear] = React.useState('');
    const [citizen, setCitizen] = React.useState({});
    const yearMap = [];
    for(let i=2005;i<=2023;i++){
        yearMap.push({"label":i, "value": ""+i});
    }
    const handleVehicleTypeChange = (event) => {
        setVehicleType(event.target.value);
    };

    const handleRegNumChange = (event) => {
        setRegNum(event.target.value);
    };

    const handleMnfYearChange = (event) => {
        setMnfYear(event.target.value);
    };

    const handleCitizenChange = (event) => {
        let selectedCitizenId = event.target.value;
        for(let i=0; i < citizenData.length; i++){
            if(citizenData[i].id == selectedCitizenId){
                setCitizen(citizenData[i]);
            }
        }
    };

    const addVehicleData = async() => {
        
        const vehiceEntry = await fetch(REACT_APP_API_BASE_URL + "VehicleV2/invite", 
        {
            method: "POST",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "regnumber": regNum,
                "mnfyear": mnfYear,
                "vehicletype": vehicleType,
                "owner": 
                  {
                  "citizenOSID": citizen.id,
                  "citizenName": citizen.name,
                  }
            })            
        })
        .then(response => response.json())
        .catch((error) => {
            console.log(error)
          });
          const date = new Date();
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          //let currentDate = `${year}-${month}-${day}`;
          let currentDate = '2023-08-03';
          let jsonBody = JSON.stringify({
            "regnumber": regNum,
            "name": citizen.name,
            "mnfyear": mnfYear,
            "vehicletype": vehicleType,
            "dateofaward": currentDate,
            "nameofScheme": "Vehicle Registration"
        }) ;
        console.log(jsonBody);
          const vehiceVCresponse = await fetch(REACT_APP_API_BASE_URL + "VehicleCertificateV2", 
          {
              method: "POST",
              headers: new Headers({
                  'Authorization': 'bearer ' + issuerToken,
                  'Content-Type': 'application/json'
              }),
              body: jsonBody  
                       
          })
          .then(response => response.json())
          .catch((error) => {
              console.log(error)
            });          
           let credentialOsid = vehiceVCresponse["result"]['VehicleCertificateV2']["osid"];
           console.log("new VC Created: " + credentialOsid);
    }

    return <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Add Vehicle
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormControl fullWidth margin="dense" >
                <InputLabel id="vehcile-type-label">Vehicle Type</InputLabel>
                <Select
                    labelId="vehcile-type-label"
                    id="demo-simple-select"
                    value={vehicleType}
                    label="Vehicle Type"
                    style={{ marginTop: '15px' }}
                    onChange={handleVehicleTypeChange}
                >
                    <MenuItem value="Car">Car</MenuItem>
                    <MenuItem value="Motorbike">Motorbike</MenuItem>
                    <MenuItem value="Truck">Truck</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                </Select>
                <TextField
                    required
                    variant="outlined"
                    id="outlined-required"
                    label="Registration Number"
                    defaultValue=""
                    value={regNum}
                    style={{ marginTop: '15px' }}
                    onChange={handleRegNumChange}
                /> 
                    <TextField
                        id="mnfYear"
                        select
                        label="Manufacturing Year"
                        style={{ marginTop: '15px' }}
                        value={mnfYear}
                        onChange={handleMnfYearChange}
                    >
                        {yearMap.map((option) => (
                            <MenuItem key={option.label} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>    

                    <TextField
                        id="citizen"
                        select
                        label="Citizen Name"
                        style={{ marginTop: '15px' }}
                        value={citizen.id}
                        onChange={handleCitizenChange}
                    >
                        {citizenData.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>                                                
            </FormControl>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={()=> {addVehicleData(); props.addVehicleCallback();}}>Add</Button>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
    </Modal>;
}

export default AddVehiclePopup;