import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Button from "react-bootstrap/esm/Button";
import VehicleVCData from './VehicleVCData';
import ViewVehicleVCPopup from './ViewVehicleVCPopup';

import { useKeycloak } from "@react-keycloak/web";
const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

const columns = [
    { field: 'regNumber', headerName: 'Registration Number', width: 350 },
    { field: 'mnfYear', headerName: 'Manufacturing Year', width: 250 },
    { field: 'vehicleType', headerName: 'Vehicle Type', width: 250 },
    { field: 'citizenName', headerName: 'Citizen Name', width: 350 }
];
let citizenData = {};
const vehicleDetails = [];
const vechicleVCMap = {};
// let citizenData = {};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function createData(regNumber, mnfYear, vehicleType, citizenName) {
    return {regNumber, mnfYear, vehicleType, citizenName };
  }

//   const invokeAddVehicle = (event) => {
//     loadVehicleData();
//    }



const CitizenVehiclesPage = (props) => {
  const keycloak = props.keycloak;
  
  const [ vehicleData, setVehicleData] = React.useState([]);
  const [ selectedVcOsId, setSelectedVcOsId] = React.useState('');
  const [viewVcModalShow, setViewVcModalShow] = React.useState(false);
  const [svgHtml, setSvgHtml] = React.useState('');
  const  issuerToken = keycloak.token;   
  

  const loadData = async() => {
      const citizenDetails = await fetch(REACT_APP_API_BASE_URL + "CitizenV2", 
        {
            method: "GET",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            })
          
        }).then(res => res.json())
        .catch((error) => {
          console.log(error)
        }); 
        let citizenData = citizenDetails[0];
        const vehicleData = await fetch(REACT_APP_API_BASE_URL + "VehicleV2/search", 
        {
            method: "POST",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "filters": { "owner.citizenOSID": {"=": citizenData.osid } },
                "limit": 10,
                "offset": 0
            })            
        })
        .then(response => response.json())
        .catch((error) => {
          console.log(error)
        }); 

        
        setVehicleData([]);
        for (let i = 0; i < vehicleData.length; i++) {
            let vehicleEntry = {};
            // let vehicleData = vehicleData[i];
           
            vehicleEntry = createData(vehicleData[i]['regnumber'],vehicleData[i]['mnfyear'], vehicleData[i]['vehicletype'], vehicleData[i]['owner']['citizenName'] );
            vehicleDetails.push(vehicleEntry);
            setVehicleData(arr => [...arr, vehicleEntry]);
        }

        const vehicleVCData = await fetch(REACT_APP_API_BASE_URL + "VehicleCertificateV2/search", 
        {
            method: "POST",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "filters": {  },
                "limit": 1000,
                "offset": 0
            })            
        })
        .then(response => response.json())
        .catch((error) => {
          console.log(error)
        });
        
        for(let i=0; i< vehicleVCData.length; i++){
          var vehicleVC = vehicleVCData[i];
          for(let j=0; j<vehicleData.length; j++){
            if(vehicleVC['regnumber'] == vehicleData[j]['regnumber']){
              var regNumber = vehicleVC['regnumber'];
              vechicleVCMap[regNumber] = vehicleVC['osid'];
            }
          }
        }
    }

    const showVC = async (regNum) => {
      
      // let vcOsId = '1-36b1fb05-01b4-4f27-afa1-5a79d0fd6f2a';
      let vcOsId = vechicleVCMap[regNum];
      console.log("View VC**************");
      let issuerToken = keycloak.token;
      console.log("VC Url: " + REACT_APP_API_BASE_URL + "VehicleCertificateV2/" + vcOsId);
      console.log("issuerToken: " + issuerToken);
      let fetchVC = await fetch(REACT_APP_API_BASE_URL + "VehicleCertificateV2/" + vcOsId, 
      {
          method: "GET",
          headers: new Headers({
            'Accept': 'image/svg+xml',
            'Authorization': 'bearer %s'%issuerToken,
            "template-key": "html"
          })          
      })
      .then(response => response.text())
      .then(text => {console.log(text);
        setSvgHtml(text);
        setViewVcModalShow(true);  
      setSelectedVcOsId(vechicleVCMap[regNum]);})
      .catch((error) => {
        console.log(error)
      });      
    }

    React.useEffect(() => {
      loadData();
    }, []); 

         
    return <div> 

        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Registration Number</StyledTableCell>
            <StyledTableCell align="right">Manufacturing Year</StyledTableCell>
            <StyledTableCell align="right">Vehcile Type</StyledTableCell>
            <StyledTableCell align="right">Citizen Name</StyledTableCell>
            <StyledTableCell align="right">View VC</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicleData.map((row) => (
            <StyledTableRow key={row.regNumber}>
              <StyledTableCell component="th" scope="row">
                {row.regNumber}
              </StyledTableCell>
              <StyledTableCell align="right">{row.mnfYear}</StyledTableCell>
              <StyledTableCell align="right">{row.vehicleType}</StyledTableCell>
              <StyledTableCell align="right">{row.citizenName}</StyledTableCell>
              <StyledTableCell align="right">
              <Button onClick={() => {showVC(row.regNumber);}}>View</Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <ViewVehicleVCPopup key="showVc"
        show={viewVcModalShow} 
        svgHtml={svgHtml}
        vcOsId={selectedVcOsId} 
        keycloak={keycloak}
        onHide={() => setViewVcModalShow(false)}
    />          
    </div>
};

export default CitizenVehiclesPage;