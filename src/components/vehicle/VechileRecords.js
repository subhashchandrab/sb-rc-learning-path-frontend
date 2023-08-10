import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { styled } from '@mui/material/styles';
import { useKeycloak } from "@react-keycloak/web";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddVehiclePopup from './AddVehiclePopup';
import VehicleVCData from './VehicleVCData';
import TablePaginationActions from '../ui/PagenatedTable';

const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

const vehicleDetails = [];


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

const VehicleRecordsPage = (props) => {
    const keycloak = props.keycloak;
    const [addVehicleModalShow, setAddVehicleModalShow] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [ vehicleData, setVehicleData] = React.useState([]);
    const [ citizenData, setCitizenData] = React.useState([]);
    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - vehicleData.length) : 0;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const loadVehicleData = () => {
        let issuerToken = keycloak.token;
        fetch(REACT_APP_API_BASE_URL + "VehicleV2/search", 
        {
            method: "POST",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "filters": {},
                "limit": 1000,
                "offset": 0
            })            
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            setVehicleData([]);
            for (let i = 0; i < data.length; i++) {
                let vehicleEntry = {};
                let vehicleData = data[i];
                // vehicleEntry['regNumber'] = vehicleData['regnumber'];
                // vehicleEntry['mnfYear'] = vehicleData['mnfyear'];
                // vehicleEntry['vehicleType'] = vehicleData['vehicletype'];
                // vehicleEntry['citizenName'] = vehicleData['owner']['citizenName'];
                vehicleEntry = createData(vehicleData['regnumber'],vehicleData['mnfyear'], vehicleData['vehicletype'], vehicleData['owner']['citizenName'] );
                vehicleDetails.push(vehicleEntry);
                setVehicleData(arr => [...arr, vehicleEntry]);
            }

            // setVehicleData(vehicleDetails);
            
         } )
        .catch((error) => {
            console.log(error)
          });        
    }

    const loadCitizenData = () => {
        let issuerToken = keycloak.token;
        fetch(REACT_APP_API_BASE_URL + "CitizenV2/search", 
        {
            method: "POST",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "filters": {},
                "limit": 10,
                "offset": 0
            })            
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            setCitizenData([]);
            for (let i = 0; i < data.length; i++) {
                let citizenEntry = {};
                let citizen = data[i];
                citizenEntry['name'] = citizen['name'];
                citizenEntry['id'] = citizen['osid'];
                // vehicleDetails.push(citizenEntry);
                setCitizenData(arr => [...arr, citizenEntry]);
            }

            // setVehicleData(vehicleDetails);
            
         } )
        .catch((error) => {
            console.log(error)
          });        
    }    

    React.useEffect(() => {
        loadVehicleData();
    },[]); 

   
    React.useEffect(() => {
        loadCitizenData();
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
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? vehicleData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : vehicleData
          )
          .map((row) => (
            <StyledTableRow key={row.regNumber}>
              <StyledTableCell component="th" scope="row">
                {row.regNumber}
              </StyledTableCell>
              <StyledTableCell align="right">{row.mnfYear}</StyledTableCell>
              <StyledTableCell align="right">{row.vehicleType}</StyledTableCell>
              <StyledTableCell align="right">{row.citizenName}</StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <StyledTableRow style={{ height: 53 * emptyRows }}>
              <StyledTableCell colSpan={6} />
            </StyledTableRow>
          )}          
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={vehicleData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>        
      </Table>
      <Button variant="contained" style={{ marginLeft: "12px" }} 
        onClick={(e) => {
            // setSeletedQuote(quoteItem);
            setAddVehicleModalShow(true);
            }}
        disableElevation sx={{ m: 1, width: '25ch' }}>
        Add Vehicle
        </Button>
    </TableContainer>
    <AddVehiclePopup key="addVhcl"
        show={addVehicleModalShow} citizenData={citizenData} keycloak={keycloak}
        onHide={() => setAddVehicleModalShow(false)}
        addVehicleCallback={() => {setAddVehicleModalShow(false);}}
    />
    </div>
};

export default VehicleRecordsPage;