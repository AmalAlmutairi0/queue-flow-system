const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Ticket = require('./models/Ticket');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// 1. جلب التذاكر
app.get('/api/queue', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: 1 });
    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. إنشاء تذكرة
app.post('/api/queue/ticket', async (req, res) => {
  try {
    const newTicket = new Ticket({
      ticketNumber: req.body.ticketNumber || req.body.id,
      department: req.body.department || req.body.serviceName,
      status: req.body.status || 'Waiting'
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({ success: true, data: savedTicket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 3. تحديث حالة التذكرة
app.patch('/api/queue/ticket/:id', async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: updatedTicket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));