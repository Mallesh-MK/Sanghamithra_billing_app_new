require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Order = require('./Model/billingschema');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/get_orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/add_order', async (req, res) => {
    try {
      const { customerName, products, contact, paymentMethod, finalTotal, qrCodeUrl } = req.body;
      
      if (!customerName || !products || !contact || !paymentMethod || !finalTotal) {
        return res.status(400).json({ message: "All required fields must be provided." });
      }
  
      const formattedProducts = products.map(product => ({
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        total: product.price * product.quantity
      }));
  
      const calculatedFinalTotal = formattedProducts.reduce((sum, product) => sum + product.total, 0);
  
      if (calculatedFinalTotal !== finalTotal) {
        return res.status(400).json({ message: "Final total does not match the sum of product totals." });
      }
  
      const newOrder = new Order({
        customerName,
        products: formattedProducts,
        contact,
        paymentMethod,
        finalTotal,
        qrCodeUrl: qrCodeUrl || ''
      });
      
      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
