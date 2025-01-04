import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [rows, setRows] = useState([{ id: '', name: '', quantity: '', price: '', amount: '' }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [id, setId] = useState(1);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [orderType, setOrderType] = useState('');
  const [date, setDate] = useState(() => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  });
  const ref = useRef(null);

  const handleRows = () => {
    setRows([...rows, { id: '', name: '', quantity: '', price: '', amount: '' }]);
  };

  const generateId = async () => {
    const res = await window.electron.fetchData('http://localhost:5000/api/orders');
    setOrders(res);
    if (res.length > 0) {
      setId(res[res.length - 1].id + 1);
    }
  };

  useEffect(() => {
    const fetchData = () => {
        generateId();
        window.electron.fetchData('http://localhost:5000/api/products')
        .then(data=>{
          setProducts(data);
        })
        .catch(err=>{
          console.error("Error:", err.message);
        })
      }
    fetchData();
  }, []);

  const calculateTotalAmount = (newRows) => {
    const total = newRows.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);
    setCgst((total * 0.06).toFixed(2));
    setSgst((total * 0.06).toFixed(2));
    setTotalAmount(total + total * 0.12);
  };

  const calculate = (index, value) => {
    const newRows = [...rows];
    if (value) {
      newRows[index] = {
        ...newRows[index],
        amount: parseFloat(value) * newRows[index]['price'],
      };
      setRows(newRows);
    }
    calculateTotalAmount(newRows);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);

    if (name === 'quantity' || name === 'price') {
      calculate(index, value);
    }
  };

  const handleSave = () => {
      if (!rows[0]['id'] || rows[0]['quantity'] === 0) {
        alert('Provide bill details appropriately...');
        return;
      }

      const items = JSON.stringify(rows);
      window.electron.postData('http://localhost:5000/api/orders', {
        orderType,
        date,
        totalAmount,
        items,
      })
      .then(data=>{
        alert('Order saved');
  
        setRows([{ id: '', name: '', quantity: '', price: '', amount: '' }]);
        setCgst(0);
        setSgst(0);
        setTotalAmount(0);
        setOrderType('');
        setDate(new Date().toISOString().split('T')[0]);
        generateId();

      })
      .catch(err=>{
        alert("Error saving the Order...");

      })
  };

  const handleRemoveRows = (index) => {
    const newRows = [...rows];
    if (newRows[index]['id'] === '' && rows.length>1) {
      newRows.pop();
      setRows(newRows);
    }
  };

  const findProductDetails = (index, event) => {
    const val = event.target.value;
    console.log(products);
    if (products.length > 0) {
      const product = products.find((product) => product.id == val);
      if (product) {
        const newRows = [...rows];
        newRows[index]['quantity'] = 1;
        newRows[index] = { ...newRows[index], ...product, amount: product.price };
        setRows(newRows);
        calculateTotalAmount(newRows);
      }
    }
  };

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const printWindow = () => {
    if (!rows[0]['id'] || rows[0]['quantity'] === 0) {
      alert('Provide bill details appropriately...');
      return;
    }

    const invoiceWindow = window.open('', 'Invoice', 'height=600,width=800');
    invoiceWindow.document.write(
      `<html><head><title>Invoice</title><link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></head><body class="bg-gray-50">`
    );
    invoiceWindow.document.write(
      `<div class="max-w-2xl mx-auto bg-white p-8 border border-gray-200 shadow-md rounded-lg mt-8">
        <h1 class="text-xl font-semibold text-center">Invoice</h1>
        <p class="mt-2">Date: ${date}</p>
        <p>Order Type: ${orderType}</p>
        <table class="w-full border-collapse mt-4">
          <thead>
            <tr class="bg-gray-200">
              <th class="border px-4 py-2">ID</th>
              <th class="border px-4 py-2">Name</th>
              <th class="border px-4 py-2">Quantity</th>
              <th class="border px-4 py-2">Price</th>
              <th class="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>`
    );
    rows.forEach((item) => {
      invoiceWindow.document.write(
        `<tr>
          <td class="border px-4 py-2">${item.id}</td>
          <td class="border px-4 py-2">${item.name}</td>
          <td class="border px-4 py-2">${item.quantity}</td>
          <td class="border px-4 py-2">${item.price}</td>
          <td class="border px-4 py-2">${item.amount}</td>
        </tr>`
      );
    });
    invoiceWindow.document.write(
      `</tbody></table>
        <div class="mt-4">
          <p class="text-right">CGST: ₹${cgst}</p>
          <p class="text-right">SGST: ₹${sgst}</p>
          <p class="text-right font-semibold">Total Amount: ₹${totalAmount.toFixed(2)}</p>
        </div>
      </div>
      </body></html>`
    );
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">Order Type</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={orderType}
            onChange={handleOrderTypeChange}
          >
            <option value="">Select Order Type</option>
            <option value="dine_in">Dine-in</option>
            <option value="take_away">Take Away</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-2 font-semibold">Bill No.</label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          value={id}
          readOnly
        />
      </div>

      <div className="mt-4 flex space-x-4">
        <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Stock List</Link>
        <Link to="/list" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Order List</Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  <input
                    name='id'
                    className="w-full p-1 border rounded"
                    value={row.id}
                    onChange={(e) => {
                      handleInputChange(index, e);
                      findProductDetails(index, e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        handleRemoveRows(index);
                      }
                    }}
                  />
                </td>
                <td className="border px-4 py-2">{row.name}</td>
                <td className="border px-4 py-2">
                  <input
                  name='quantity'
                    type="number"
                    className="w-full p-1 border rounded"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, e)}
                    onKeyDown={(e)=>{
                      if(e.key == 'Tab'){
                        handleRows();
                      }
                    }}
                  />
                </td>
                <td className="border px-4 py-2">{row.price}</td>
                <td className="border px-4 py-2">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-end">
        <div className="flex justify-between w-full max-w-md">
          <span>CGST (6%):</span>
          <span>₹ {cgst}</span>
        </div>
        <div className="flex justify-between w-full max-w-md">
          <span>SGST (6%):</span>
          <span>₹ {sgst}</span>
        </div>
        <div className="flex justify-between w-full max-w-md font-semibold text-lg">
          <span>Total Amount:</span>
          <span>₹ {totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSave}
          >
            SAVE
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setRows([{ id: '', name: '', quantity: '', price: '', amount: '' }]);
              setCgst(0);
              setSgst(0);
              setTotalAmount(0);
            }}
          >
            CANCEL
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={printWindow}
          >
            PRINT
          </button>
        </div>
      </div>
    </div>
  );
};
