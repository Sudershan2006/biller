import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

export function OList() {
    const [orders, setOrders] = useState([]);
    const [orderlist, setOrderlist] = useState([]);
    const [products, setProducts] = useState([]);

    const Bill = (order) => {
        console.log('Generating Bill...');
        const invoiceContent = `
      <div style="text-align: center;">
      <!DOCTYPE html>
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
          <p>Order No: <span id="invoiceNo"></span></p>
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
      </html>`;
        
        const dwindow = window.open('', 'height=600,width=400');
        dwindow.document.write(invoiceContent);
        dwindow.document.getElementById('invoiceDate').innerHTML = order.date;
        dwindow.document.getElementById('invoiceNo').innerHTML = order.id;
        dwindow.document.getElementById('orderType').innerHTML = order.type;

        const invoiceItems = dwindow.document.getElementById('invoiceItems');
        const orderset = orderlist.filter(o => o.orderId === order.id);
        let total = 0;

        orderset.forEach(item => {
            const row = dwindow.document.createElement('tr');
                total += item.quantity*item.price;
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity * item.price}</td>`;
                invoiceItems.append(row);
            // const productset = products.find(p => p.id === item.productId);
            // if(productset){
            //     total += productset.quantity * productset.price;
    
            //     row.innerHTML = `
            //         <td>${productset.id}</td>
            //         <td>${productset.name}</td>
            //         <td>${productset.quantity}</td>
            //         <td>${productset.price}</td>
            //         <td>${productset.quantity * productset.price}</td>`;
            // }
        });

        dwindow.document.getElementById('cgstAmount').innerHTML = (total * 0.06).toFixed(2);
        dwindow.document.getElementById('sgstAmount').innerHTML = (total * 0.06).toFixed(2);
        dwindow.document.getElementById('totalAmount').innerHTML = (total + (total * 0.12)).toFixed(2);
        dwindow.document.close();

        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
                event.preventDefault();
                dwindow.print();
            }
        };

        dwindow.addEventListener('keydown', handleKeyDown);
        return () => {
            dwindow.removeEventListener('keydown', handleKeyDown);
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            const resOrders = await window.electron.fetchData('http://localhost:5000/api/orderlist');
            setOrderlist(resOrders);
            const resProducts = await window.electron.fetchData('http://localhost:5000/api/products');
            setProducts(resProducts);
            const resAllOrders = await window.electron.fetchData('http://localhost:5000/api/orders');
            setOrders(resAllOrders);
        };
        
        fetchData();
    }, []);

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom> Orders List </Typography>
            <Link to="/">
                <Button variant="outlined" style={{ marginTop: '20px' }}>To Orders</Button>
            </Link>
            {orders.length > 0 ? (
                <List>
                    {orders.reverse().map((val, index) => (
                        <ListItem key={index} divider>
                            <ListItemText
                                primary={`Order ID: ${val.id}`}
                                secondary={`Date: ${val.date}, Type: ${val.type}, Total Amount: ₹${val.totalAmount}`}
                            />
                            <Button variant="contained" color="primary" onClick={() => Bill(val)}>
                                View Bill
                            </Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1">No orders available.</Typography>
            )}

            {/* Navigation Button */}
            
        </Container>
    );
}
