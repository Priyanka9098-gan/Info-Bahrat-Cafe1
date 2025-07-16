const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Sample Menu
const menuData = [
  { id: 1, title: 'Espresso', category: 'Drinks', price: '₹150', image: '/drink.jpg' },
  { id: 2, title: 'Burger', category: 'Dishes', price: '₹200', image: '/Burger.jpg' },
  { id: 3, title: 'Chocolate Cake', category: 'Desserts', price: '₹180', image: '/dessert.jpg' }
];

// ✅ Get menu
app.get('/api/menu', (req, res) => {
  res.json(menuData);
});

// ✅ Save order
app.post('/api/orders', (req, res) => {
  const order = req.body;

  if (!order || !order.items || !Array.isArray(order.items)) {
    return res.status(400).json({ message: 'Invalid order data.' });
  }

  const newOrder = {
    items: order.items,
    timestamp: order.timestamp || new Date().toISOString(),
    status: order.status || 'Pending'
  };

  const filePath = path.join(__dirname, 'orders.json');
  let orders = [];

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      orders = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading orders:', err);
  }

  orders.push(newOrder);

  try {
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
    res.status(201).json({ message: 'Order saved!', orderId: orders.length - 1 });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ message: 'Failed to save order.' });
  }
});

// ✅ Get all orders
app.get('/api/orders', (req, res) => {
  const filePath = path.join(__dirname, 'orders.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const orders = JSON.parse(data);
    res.json(orders);
  } catch (err) {
    console.error('Error reading orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// ✅ Update order status
app.patch('/api/orders/:id', (req, res) => {
  const { status } = req.body;
  const orderId = parseInt(req.params.id);
  const filePath = path.join(__dirname, 'orders.json');

  try {
    const orders = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (orderId < 0 || orderId >= orders.length) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    orders[orderId].status = status;

    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
    res.json({ message: 'Order status updated.' });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Update failed.' });
  }
});

// ✅ Export the app for index.js
module.exports = app;