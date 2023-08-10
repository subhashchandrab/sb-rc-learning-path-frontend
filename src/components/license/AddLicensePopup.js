import React from 'react';
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

const AddLicensePopup = (props) => {
    let citizenData = props.citizenData;
    const keycloak = props.keycloak;
  
    const [vehicleType, setVehicleType] = React.useState('');
    const [licNumber, setLicNumber] = React.useState('');
    const [issuedDate, setIssuedDate] = React.useState('');
    const [validUpto, setValidupto] = React.useState('');
    const [state, setState] = React.useState('');
    const [licenseInfo, setLicenseInfo] = React.useState({});

    const states = [
        "Andaman and Nicobar Islands",
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chandigarh",
        "Chhattisgarh",
        "Dadra and Nagar Haveli",
        "Daman and Diu",
        "Delhi",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Ladakh",
        "Lakshadweep",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Puducherry",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal"
      ];
    const stateMap = [];
    for(let i=0; i<states.length; i++){
        stateMap.push({"name":states[i], "code":states[i]})
    }

    const handleVehicleTypeChange = (event) => {
        setVehicleType(event.target.value);
    };

    const handleLicNumberChange = (event) => {
        setLicNumber(event.target.value);
    };
    
    const handleIssuedDateChange = (event) => {
        setIssuedDate(event.target.value);
    };

    const handleValidityDateChange = (event) => {
        setValidupto(event.target.value);
    };

    const handleStateChange = (event) => {
        setState(event.target.value);
    };

    const addLicenseData = async () => {
        let issuerToken = keycloak.token;  
       const licenseResponse = await fetch(REACT_APP_API_BASE_URL + "CitizenV2/" + citizenData.osid, 
        {
            method: "PUT",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "drivinglicense": [
                    {
                    "vehicletype": vehicleType,
                    "licnumber": licNumber,
                    "issueddate": issuedDate,
                    "validupto": validUpto,
                    "state": state
                    }
                ]
            })            
        })
        .then(response => response.json())
        .catch((error) => {
            console.log(error)
          });


            const updatedCitizenData = await fetch(REACT_APP_API_BASE_URL + "CitizenV2", {
                headers: new Headers({
                    'Authorization': 'bearer ' + issuerToken,
                    'Content-Type': 'application/json'
                }),
            })
            .then(response => response.json())
            .catch((error) => {
                console.log(error)
              });
              setLicenseInfo(updatedCitizenData[0].drivinglicense[0]);
          const attestationResponse = await fetch(REACT_APP_API_BASE_URL + "send?send=true", 
          {
              method: "PUT",
              headers: new Headers({
                  'Authorization': 'bearer ' + issuerToken,
                  'Content-Type': 'application/json'
              }),
              body: JSON.stringify({
                      "entityName": "CitizenV2",
                      "entityId": citizenData.osid,
                      "name": "CitizenAffiliation",
                      "propertiesOSID":{
                        "drivinglicense": [updatedCitizenData[0].drivinglicense[0].osid]
                    }
              })        
          })
          .then(response => response.json())
          .catch((error) => {
              console.log(error)
            });
    };

    return <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Add License
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
                        id="licNum"
                        label="License Number"
                        required
                        style={{ marginTop: '15px' }}
                        value={licNumber}
                        onChange={handleLicNumberChange}
                    /> 
                <TextField
                        id="issDt"
                        label="Date of Issue"
                        required
                        style={{ marginTop: '15px' }}
                        value={issuedDate}
                        onChange={handleIssuedDateChange}
                    /> 
                <TextField
                        id="validUpto"
                        label="Date of Validity "
                        required
                        style={{ marginTop: '15px' }}
                        value={validUpto}
                        onChange={handleValidityDateChange}
                    /> 
                    <TextField
                        id="state"
                        select
                        label="Issuing Authority State"
                        style={{ marginTop: '15px' }}
                        value={state}
                        onChange={handleStateChange}
                    >
                        {stateMap.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>                                                                            
        </FormControl>            
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={() => { addLicenseData(); props.addLicenseCallback(licenseInfo); }}>Add</Button>
            <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
    </Modal>;

};

export default AddLicensePopup;
