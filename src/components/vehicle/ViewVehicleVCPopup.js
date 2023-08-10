import React, { useEffect, useRef }from 'react';
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal';
import { useKeycloak } from "@react-keycloak/web";

const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

const ViewVehicleVCPopup = (props) => {
    const svgHtml = props.svgHtml;
    const vcDivRef = useRef(null);
    // const keycloak = props.keycloak;
    const { keycloak, initialized } = useKeycloak();
    // const vcOsId = props.vcOsId;
    if(vcDivRef && vcDivRef.current){

      console.log("vcDivRef..", vcDivRef.current);
      vcDivRef.current.innerHTML = svgHtml;
    }
    const loadVcSVG = (vcOsId) => {
        // let vcOsId = '1-36b1fb05-01b4-4f27-afa1-5a79d0fd6f2a'
        console.log("View VC");
        let issuerToken = keycloak.token;
        console.log("VC Url: " + REACT_APP_API_BASE_URL + "VehicleCertificateV2/" + vcOsId);
        fetch(REACT_APP_API_BASE_URL + "VehicleCertificateV2/" + vcOsId, 
        {
            method: "GET",
            headers: new Headers({
              'Accept': 'image/svg+xml',
              'Authorization': 'bearer %s'%issuerToken,
              "template-key": "html"
            })          
        })
        .then(response => response.text())
        .then(text => {vcDivRef.current.innerHTML = text;})
        .catch((error) => {
          console.log(error)
        });
      };
    //  useEffect(() => {
    //     loadVcSVG();}
    // );
     useEffect(() => {
      if(vcDivRef && vcDivRef.current){

        console.log("vcDivRef..", vcDivRef.current);
        vcDivRef.current.innerHTML = svgHtml;
      }
      });

    return <Modal
    show={props.show}
    onHide={props.onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered>
    <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            Vehice Registration Certificate
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <div ref={vcDivRef}>

        </div>
    </Modal.Body>
    <Modal.Footer>
       <Button onClick={props.onHide}>Close</Button>
    </Modal.Footer>
</Modal>;
}


export default ViewVehicleVCPopup;    