import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';

export function Product() {
  const [products, setProducts] = useState([]);
  const [addProductMode, setAddProductMode] = useState(false);
  const [add,setAdd] = useState(true);
  const [id,setId] = useState();
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  const fetchData = async () => {
    try {
      const result = await window.electron.fetchData('http://localhost:5000/api/products');
      console.log(result);
      setProducts(result);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      const res = await window.electron.postData('http://localhost:5000/api/products',{ option:'add',data:newProduct });
      console.log(res);
      alert('Product added successfully!');
      fetchData();
      setNewProduct({ name: '', price: '' }); // Reset form
      setAddProductMode(false); // Exit add mode
    } catch (err) {
      console.error("Error adding product:", err.message);
      alert("Failed to add product.");
    }
  };

  const handleEditProduct = async () => {
    try {
      const res = await window.electron.postData('http://localhost:5000/api/products', { option: 'edit', data: { id: id, newProduct } });
      alert("Product updated successfully!");
      fetchData();
      // setNewProduct({ name: '', quantity: '', price: '' });
      setAddProductMode(false);
      setAdd(true);
      setId('');
    } catch (err) {
      console.error("Error updating product:", err.message);
      alert("Failed to update product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await window.electron.postData('http://localhost:5000/api/products', { option: 'delete', data:id });
      alert("Product deleted successfully!");
      fetchData();
      setNewProduct({ name: '', price: '' });
    } catch (err) {
      console.error("Error deleting product:", err.message);
      alert("Failed to delete product.");
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Stock List
      </Typography>

      <Link to='/' style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary" style={{ marginBottom: '20px', marginRight: '10px' }}>
          Go to Orders
        </Button>
      </Link>

      <Button variant="contained" color="primary" onClick={() => setAddProductMode(true)} style={{ marginBottom: '20px' }}>
        Add Product
      </Button>

      {addProductMode && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    name="productName"
                    value={newProduct.name}
                    onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="price"
                    value={newProduct.price}
                    onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={add ? handleAddProduct:handleEditProduct} 
                    disabled={!newProduct.name || !newProduct.price} 
                    style={{ marginRight: '10px' }}
                  >
                    {add ? 'ADD' : 'UPDATE'}
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => {setAddProductMode(false);setAdd(true)}}>
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      )}

      {/* Product Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    {/* Edit Button */}
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setAdd(false);setAddProductMode(true);setId(item.id);
                        setNewProduct({name:item.name,price:item.price});
                      }}
                    >
                      Edit
                    </Button>

                    {/* Delete Button */}
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}