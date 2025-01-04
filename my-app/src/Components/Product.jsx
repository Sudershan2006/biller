import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export function Product() {
  const [products, setProducts] = useState([]);
  const [addProductMode, setAddProductMode] = useState(false);
  const [add, setAdd] = useState(true);
  const [id, setId] = useState();
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const inputRef = useRef(null);

  const fetchData =  () => {
     window.electron.fetchData('http://localhost:5000/api/products')
    .then(data=>{
      setProducts(data);
    })
    .catch(err=>{
      console.error("Error fetching data:", err.message);

    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = () => {
      window.electron.postData('http://localhost:5000/api/products', { option: 'add', data: newProduct })
      .then(data=>{
        console.log(data);
        alert('Product added successfully!');
        fetchData();
        setNewProduct({ name: '', price: '' });
        setAddProductMode(false);
      }).catch (err=>{
        console.error("Error adding product:", err.message);
        alert("Failed to add product.");
      }) 
    };

  const handleEditProduct =  () => {
   
      window.electron.postData('http://localhost:5000/api/products', { option: 'edit', data: { id: id, newProduct } })
      .then(data=>{

        alert("Product updated successfully!");
        fetchData();
        setAddProductMode(false);
        setAdd(true);
        setId('');
      })
      .catch(err=>{
        console.error("Error updating product:", err.message);
        alert("Failed to update product.");

      })
  };

  const handleDeleteProduct = (id) => {
     window.electron.postData('http://localhost:5000/api/products', { option: 'delete', data: id })
      .then(data=>{
        alert("Product deleted successfully!");
        fetchData();
        setNewProduct({ name: '', price: '' });

      })
      .catch(err=>{
        console.error("Error deleting product:", err.message);
        alert("Failed to delete product.");

      })
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Stock List</h1>

      <div className="flex justify-between items-center mb-6">
        <Link to='/' className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">
          Go to Orders
        </Link>

        <button
          onClick={() => {setAddProductMode(true);inputRef.current.focus()}}
          className="text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Product
        </button>
      </div>

      {addProductMode && (
        <div className="mb-6 p-4 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">{add ? "Add New Product" : "Edit Product"}</h2>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              ref={inputRef} 
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="p-2 border rounded-md"
            />
            <div className="flex space-x-4">
              <button
                onClick={add ? handleAddProduct : handleEditProduct}
                disabled={!newProduct.name || !newProduct.price}
                className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {add ? "Add" : "Update"}
              </button>
              <button
                onClick={() => {
                  setAddProductMode(false);
                  setAdd(true);
                  setNewProduct({ name: '', price: '' });
                }}
                className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-md">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Product ID</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2 flex space-x-4">
                    <button
                      onClick={() => {
                        setAdd(false);
                        setAddProductMode(true);
                        setId(item.id);
                        setNewProduct({ name: item.name, price: item.price });
                      }}
                      className="text-white bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-2 text-gray-500">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
