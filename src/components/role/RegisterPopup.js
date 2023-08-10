import React from 'react';
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

const RegisterPopup = (props) => {
        const keycloak = props.keycloak;
        let issuerToken = keycloak.token;
        const [name, setName] = React.useState('');
        const [email, setEmail] = React.useState('');
        const [dob, setDob] = React.useState('');
        const [gender, setGender] = React.useState('');
        

        const handleNameChange = (event) => {
            setName(event.target.value);
        };

        const handleEmailChange = (event) => {
            setEmail(event.target.value);
        };

        const handleDobChange = (event) => {
            setDob(event.target.value);
        };

        const handleGenderChange = (event) => {
            setGender(event.target.value);
        };     
        
        const registerUser = async() => {
            const registerResponse = await fetch(REACT_APP_API_BASE_URL + "CitizenV2/invite", 
            {
                method: "POST",
                headers: new Headers({
                    'Authorization': 'bearer ' + issuerToken,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "dob": dob,
                    "gender": gender
                })            
            })
            .then(response => response.json())
            .catch((error) => {
                console.log(error)
              });

              if(registerResponse.params.status == 'SUCCESFUL'){
                alert("User registration successful. Redirecting to home page.");
              }


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
                Citizen Registration
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormControl fullWidth margin="dense" >
                    <TextField
                        id="name"
                        label="Name"
                        required
                        style={{ marginTop: '15px' }}
                        value={name}
                        onChange={handleNameChange}
                    >
                    </TextField>    
                    <TextField
                        id="email"
                        label="Email"
                        required
                        style={{ marginTop: '15px' }}
                        value={email}
                        helperText="Enter valid Email Address"
                        onChange={handleEmailChange}
                    >
                    </TextField>     
                    <TextField
                        id="dob"
                        label="dob"
                        required
                        style={{ marginTop: '15px' }}
                        value={dob}
                        helperText="Enter valid date of birth in YYYY-MM-DD format"
                        onChange={handleDobChange}
                    >
                    </TextField> 
                    <FormLabel id="gender" style={{ marginTop: '15px' }}>Gender</FormLabel>
                <RadioGroup
                    aria-labelledby="gender"
                    name="genderGroup"
                    row
                    value={gender}
                    label="Gender"
                    labelPlacement="start"
                    onChange={handleGenderChange}
                    
                >
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>                                                                          
            </FormControl>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={()=> {registerUser(); props.registerUserCallback();}}>Register</Button>
            <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>        
    </Modal>
}
export default RegisterPopup;