import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/esm/Card';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import RoleItems from "./RoleItems";
import { useKeycloak } from "@react-keycloak/web";
import { useCallback } from 'react'
import RegisterPopup from "./RegisterPopup";
import { useNavigate } from 'react-router-dom';

const RoleListing = (props) => {
    const navigate = useNavigate();
    // const { keycloak, initialized } = useKeycloak();
    const keycloak = props.keycloak; 
    const [registerUserShow, setRegisterUserShow] = React.useState(false);
    let roleData = [
        {name:"RTO Official", id:0, description: "RTO Official associates the vehicles to citizens and approves the license claims by citizens."},
        {name:"Citizen", id:1, description: "Citizens can view their associated vehicles and raise the claim for license attestation"}
    ];

    // const handleLogin = (e) => {
    //     keycloak.login();
    //     console.log("Inside keycloak login");

    // }

    const handleLogin = useCallback(() => {
        // navigate('/profile', { replace: true });
        keycloak.login().then(
            () => navigate('/profile', { replace: true })
        );
        
        console.log(JSON.stringify(keycloak));
      }, [keycloak])
    

    const handleRegister = (e) => {
        setRegisterUserShow(true);
    };

    const addRegisterUserback = () => {

    }



    return (
        <div>
             <Row xs={1} md={3} className="g-4">
            {
                roleData.map((roleItem, index) => {

                    return <div key={'div_' + roleItem.id} id={index}>
                    <Col className="insurance-item filterable-item" key={'cat_' + roleItem.id}>
                        <Card style={{ width: '22rem' }} hoverable="true"
                            bg="primary" key={'card_' + roleItem.id}>
                            <Card.Header style={{ margin: "auto" }} as="h5">{roleItem.name}</Card.Header>
                            <Card.Body className="insurance-content">
                                <Card.Text>
                                    {roleItem.description}
                                </Card.Text>
                                {
                                roleItem.id == 1 && <Button variant="primary" style={{ margin: "10px" }} onClick={(e) => {handleRegister(e)}}>
                                    Register
                                </Button>
                                }
                                <Button style={{ margin: "5px" }} variant="primary" onClick={(e) => {handleLogin(e)}}>
                                    Login
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </div>;
                })}
                </Row>
            <RegisterPopup key="regUser"
                show={registerUserShow}
                keycloak={keycloak}
                registerUserCallback={() => {setRegisterUserShow(false);handleLogin();}}
                onHide={() => setRegisterUserShow(false)}
            />
        </div>
    );    
}

export default RoleListing;