import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
const { REACT_APP_API_BASE_URL } = process.env;
// const REACT_APP_API_BASE_URL = "http://demo-admin-portal.sunbirdrc.oci/registry/api/v1/";

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

  function createData(requestorName, createdAt, status, attestedOn, claimId ) {
    return {requestorName, createdAt, status, attestedOn, claimId };
  }

const LicenseCliamsPage = (props) => {

    const keycloak = props.keycloak;
    const [ claimData, setClaimData] = React.useState([]);

    const loadClaimData = () => {
        let issuerToken = keycloak.token;
        fetch(REACT_APP_API_BASE_URL + "Official/claims", 
        {
            method: "GET",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            })
        })
        .then(response => response.json())
        .then((data) => {
            console.log("License Claims: " +data.content);
            let claims = data.content;
            setClaimData([]);
            for (let i = 0; i < claims.length; i++) {
                let claim = claims[i];
                // requestorName, createdAt, attestedOn, status
                let claimEntry = createData(claim['requestorName'], claim['createdAt'],  claim['status'], claim['attestedOn'], claim['id']);
                setClaimData(arr => [...arr, claimEntry]);
            }
        })
        .catch((error) => {
            console.log(error)
          });         
    }

    const approveClaim = (claim) => {
        let issuerToken = keycloak.token;
        console.log("Approving the claim: " + claim );
        fetch(REACT_APP_API_BASE_URL + "Official/claims/"+claim.claimId+"/attest", 
        {
            method: "POST",
            headers: new Headers({
                'Authorization': 'bearer ' + issuerToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(
                {
                    "action":"GRANT_CLAIM"
                }
            )
        })
        .then(response => response.json())
        .then((data) => {
            loadClaimData();
        })  
        .catch((error) => {
            console.log(error)
          });                
    }

    React.useEffect(() => {
        loadClaimData();
    }, []); 

    return <div> 
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Requester Name</StyledTableCell>
            <StyledTableCell align="left">Created Date </StyledTableCell>
            <StyledTableCell align="left">Status</StyledTableCell>
            <StyledTableCell align="left">Attested Date</StyledTableCell>
            <StyledTableCell align="left">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claimData.map((row) => (
            <StyledTableRow key={row.requestorName}>
                
              <StyledTableCell component="th" scope="row">
                {row.requestorName}
              </StyledTableCell>
              <StyledTableCell align="left">{row.createdAt}</StyledTableCell>
              <StyledTableCell align="left">{row.status}</StyledTableCell>
              <StyledTableCell align="left">{row.attestedOn}</StyledTableCell>
              <StyledTableCell align="left">
              {row.status == 'OPEN' ?  
                <Button onClick={(e) => {approveClaim(row);}}>Approve</Button>:
                <p></p>
             }
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
      </div>
};

export default LicenseCliamsPage;