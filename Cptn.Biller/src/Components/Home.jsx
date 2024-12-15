import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Button,
} from '@mui/material';

export const Home = () => {
  const [rows, setRows] = useState([{ id: '', name: '', quantity: '', price: '', amount: '' }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cgst,setCgst] = useState(0);
  const [sgst,setSgst] = useState(0);
  const [id,setId] = useState(1);
  const [orders,setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  
  // State for storing dropdown value
  const [orderType, setOrderType] = useState('');
  const [date,setDate] = useState(()=>{
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  });

  const ref = useRef(null);

  
  // CGST and SGST calculations
  // const cgst = (totalAmount * 0.18).toFixed(2);
  // const sgst = (totalAmount * 0.18).toFixed(2);

  const handleRows = () => {
    setRows([...rows, { id: '', name: '', quantity: '', price: '', amount: '' }]);
  };

  const generateId = async() =>{
    const res = await window.electron.fetchData('http://localhost:5000/api/orders');
    setOrders(res);
    console.log(res);
    if(res.length>0){
      setId(res[res.length-1].id+1)
    }

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        generateId();
        const result = await window.electron.fetchData('http://localhost:5000/api/products');
        setProducts(result); // Store fetched products in state
      } catch (err) {
        console.log("Error:" + err.message);
      }
    };
    fetchData();
  }, []);

  const calculateTotalAmount = (newRows) => {
    const total = newRows.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);
    setCgst((total*0.06).toFixed(2));
    setSgst((total*0.06).toFixed(2));
    setTotalAmount(total+total*0.12);
    // console.log(totalAmount);
  };

  const calculate = (index,value) =>{
    const newRows = [...rows];
    if(value){
      newRows[index] = { ...newRows[index],amount:parseFloat(value)*newRows[index]['price']};
      setRows(newRows);
    }
    calculateTotalAmount(newRows);
  }

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
    

    if (name === 'quantity' || name === 'price') {
      calculate(index,value); // Recalculate amount if quantity or price changes
    }
  };

  const handleSave = async () => {
    try {
        if (!rows[0]['id'] || rows[0]['quantity'] === 0) {
            alert('Provide bill details appropriately...');
            return;
        }

        const items = JSON.stringify(rows);
        const res = await window.electron.postData('http://localhost:5000/api/orders', {
            orderType,
            date,
            totalAmount,
            items
        });

        alert('Order saved');

        // Resetting form fields and states after successful save
        setTimeout(() => {
            setRows([{ id: '', name: '', quantity: '', price: '', amount: '' }]);
            setCgst(0);
            setSgst(0);
            setTotalAmount(0);
            setOrderType('');
            
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setDate(formattedDate);

            generateId(); // Generate new ID for next order
        }, 0);
      

    } catch (err) {
        alert("Error saving the Order...");
    }
};



  const handleRemoveRows = (index) =>{
    const newRows = [...rows];
    if(newRows[index]['id']==''){
      newRows.pop();
      setRows(newRows);
    }
  }

  const findProductDetails = (index, event) => {
    const val = event.target.value;
    if (products.length > 0) {
      const product = products.find(product => product.id == val);
      if (product) {
        const newRows = [...rows];
        newRows[index]['quantity'] = 1;
        setRows(newRows);
        newRows[index] = {...newRows[index],...product,amount:product.price} // Populate row with product details
        setRows(newRows);
        calculateTotalAmount(newRows);
        // console.log(rows); // Calculate amount based on populated data
      }
    }
  };

  // Handle dropdown change for order type
  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
    console.log(orderType); // Update state with selected value
  };

  const invoiceContent = `
  <div style="text-align: center;"><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .invoice {
            border: 1px solid #000;
            padding: 20px;
            width: 80%;
            margin: auto;
        }
        h1 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
        }
        .total {
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="invoice" id="invoice">
    <h1>Invoice</h1>
    <p>Date: <span id="invoiceDate"></span></p>
    <p>Order Type: <span id="orderType"></span></p>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody id="invoiceItems"></tbody>
    </table>

    <p class="total">CGST: ₹<span id="cgstAmount"></span></p>
    <p class="total">SGST: ₹<span id="sgstAmount"></span></p>
    <p class="total">Total Amount: ₹<span id="totalAmount"></span></p>
</div>


</body>
</html>

  `

  const printWindow = () =>{

    if(!rows[0]['id'] || rows[0]['quantity']==0){
      alert('Provide bill details appropriately...');
      return;
    }

    const dwindow = window.open('','height=600,width=800');
    dwindow.document.write(invoiceContent);
    dwindow.document.getElementById('invoiceDate').innerHTML=date;
    dwindow.document.getElementById('orderType').innerHTML=orderType;
    const invoiceItems = dwindow.document.getElementById('invoiceItems')
    rows.forEach(item =>{
      const row = dwindow.document.createElement('tr');
      row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
      <td>${item.amount}</td>
      `
      invoiceItems.append(row);
    });
    dwindow.document.getElementById('cgstAmount').innerHTML=cgst;
    dwindow.document.getElementById('sgstAmount').innerHTML=sgst;
    dwindow.document.getElementById('totalAmount').innerHTML=totalAmount;
    dwindow.document.close();
    dwindow.print();
  }

  return (
    <Container key={refreshKey} maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="otype-label">Order Type</InputLabel>
            <Select 
              labelId="otype-label" 
              id="otype" 
              label="Order Type" 
              value={orderType}
              onChange={handleOrderTypeChange}
            >
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
            value={date}
            onChange={(event)=>setDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
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
            value={id}
            
          />
        </Grid>

        {/* Add Button */}
        <Grid item xs={12} md={6}>
          <Link to='/add' style={{ textDecoration: 'none', marginTop:'10px' }}>
            <Button variant="contained" color="primary">
              Stock list
            </Button>
          </Link>
          <Link to='/list' style={{ textDecoration: 'none', marginTop:'10px',marginLeft:'10px' }}>
            <Button variant="contained" color="primary">
              Order List
            </Button>
          </Link>
        </Grid>
      </Grid>

      {/* Table for Order Items */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 && rows.map((row, index) => (
              <TableRow key={index}>
                {/* ID Column */}
                <TableCell >
                  <TextField
                    ref={ref}
                    name="id"
                    value={row.id}
                    onKeyDown={(event)=>{
                      if(event.key === 'Backspace'){
                        handleRemoveRows(index);
                      }
                    }}
                    onChange={(event) => {
                      handleInputChange(index, event);
                      findProductDetails(index, event);
                    }}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>

                {/* Product Name Column */}
                <TableCell>
                  <TextField
                    name="name"
                    value={row.name}
                    variant="outlined"
                    size="small"
                    readOnly
                  />
                </TableCell>

                {/* Quantity Column */}
                <TableCell>
                  <TextField
                    name="quantity"
                    type="number"
                    value={row.quantity}
                    onChange={(event) => handleInputChange(index, event)}
                    onKeyDown={(event)=>{
                      if(event.key=='Tab'){
                        handleRows();
                      }
                    }}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>

                {/* price Column */}
                <TableCell>
                  <TextField
                    name="price"
                    type="number"
                    value={row.price}
                    readOnly
                    variant="outlined"
                    size="small"
                  />
                </TableCell>

                {/* Amount Column */}
                <TableCell >
                  <TextField
                    name="amount"
                    type="number"
                    value={row.amount}
                    readOnly // Make amount read-only as it's calculated based on quantity and price
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bill Summary Section */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {/* Empty space to align summary to the right */}
          <Grid item><Button variant="contained" color="primary" onClick={handleSave}>
              SAVE
            </Button></Grid>
          <Grid item><Button variant="contained" color="primary" onClick={()=>{setRows([{id:'',name:'',quantity:'',price:'',amount:''}]);setCgst(0);setSgst(0);setTotalAmount(0)}}>
              CANCEL
            </Button></Grid>
          <Grid item><Button variant="contained" color="primary" onClick={printWindow}>
              PRINT
            </Button></Grid>
        {/* Bill Summary Paper */}
        <Grid item xs={12} md={4} style={{ marginLeft:'65vh '}}>
          <Paper style={{ padding: '16px', textAlign: 'right' }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography>CGST (6%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align='right'>₹ {cgst}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>SGST (6%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align='right'>₹ {sgst}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant='h6'>Total Amount:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h6' align='right'>₹ {totalAmount.toFixed(2)}</Typography>
              </Grid> 
            </Grid> 
          </Paper> 
      </Grid> 
        </Grid> 
    </Container>
  );
};
