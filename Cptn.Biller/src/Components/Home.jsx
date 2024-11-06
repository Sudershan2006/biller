import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axios from 'axios';


export const Home = () => {
  const [rows, setRows] = useState([
    { id: '', productName: '', quantity: '', rate: '', amount: '' },
    { id: '', productName: '', quantity: '', rate: '', amount: '' },
    { id: '', productName: '', quantity: '', rate: '', amount: '' },
  ]);

  useEffect(()=>{
    const fetchData = async()=>{
      const response = await Axios.get('http://localhost:5000/api/orders');
      try{
        console.log(response.data);
      }
      catch{
        console.log("error");
      }
    }
    setInterval(fetchData,1000);
    return () => clearInterval(intervalId);
  },[])

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="otype-label">Order Type</InputLabel>
            <Select labelId="otype-label" id="otype" label="Order Type">
              <MenuItem value="dine_in">Dine-in</MenuItem>
              <MenuItem value="take_away">Take Away</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            label="Date"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "none", // Remove border
                "& fieldset": {
                  display: "none", // Hide the fieldset that creates the border
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            type="number"
            label="Bill No."
            id="bno"
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "none", // Remove border
                "& fieldset": {
                  display: "none", // Hide the fieldset that creates the border
                },
              },
            }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table style={{border:5}}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {/* ID Column */}
                <TableCell >
                  <TextField
                    name="id"
                    value={row.id}
                    onChange={(event) => handleInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        "& fieldset": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </TableCell>

                {/* Product Name Column */}
                <TableCell>
                  <TextField
                    name="productName"
                    value={row.productName}
                    onChange={(event) => handleInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        "& fieldset": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </TableCell>

                {/* Quantity Column */}
                <TableCell>
                  <TextField
                    name="quantity"
                    type="number"
                    value={row.quantity}
                    onChange={(event) => handleInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        "& fieldset": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </TableCell>

                {/* Rate Column */}
                <TableCell>
                  <TextField
                    name="rate"
                    type="number"
                    value={row.rate}
                    onChange={(event) => handleInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        "& fieldset": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </TableCell>
                {/* Amount Column */}
                <TableCell >
                  <TextField
                    name="amount"
                    type="number"
                    value={row.amount}
                    onChange={(event) => handleInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "none",
                        "& fieldset": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};