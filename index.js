require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// const fs = require('fs');
// const path = require('path');
// const messageFile = path.join(__dirname, 'messages.json');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static("public"));
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});
app.get('/messages', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'messages.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Ready!!"))
  .catch((err) => console.error("MongoDB Error", err));

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

const message = mongoose.model('message', messageSchema);

app.post('/message', async (req, res) => {
  try {
      const newMessage = new message(req.body);
      const savedMessage = await newMessage.save();
      res.status(201).json(savedMessage);
      
  } catch(err) {
      res.status(400).json({ message: err.message });
  }
});

app.get('/message', async (req, res) => {
  try {
      const messages = await message.find();
      res.json(messages);
  } catch(err) {
      res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});









// เสิร์ฟไฟล์ static จากโฟลเดอร์ public
// app.use(express.static('public'));


// // เสิร์ฟไฟล์ index.html เมื่อเข้าเว็บ
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // API สำหรับรับข้อความ
// app.post('/api/message', (req, res) => {
//   const { message } = req.body;

//   if (!message || !message.trim()) {
//     return res.status(400).json({ status: 'ข้อความว่าง' });
//   }

//   const newEntry = {
//     message,
//     time: new Date().toISOString()
//   };

//   let messages = [];
//   if (fs.existsSync(messageFile)) {
//     try {
//       messages = JSON.parse(fs.readFileSync(messageFile));
//     } catch (error) {
//       console.error('Error reading messages.json:', error);
//       return res.status(500).json({ status: 'ไม่สามารถอ่านข้อมูลได้' });
//     }
//   }

//   messages.push(newEntry);

//   try {
//     fs.writeFileSync(messageFile, JSON.stringify(messages, null, 2));
//     res.json({ status: 'ส่งข้อความสำเร็จแล้ว!' });
//   } catch (error) {
//     console.error('Error writing to messages.json:', error);
//     return res.status(500).json({ status: 'ไม่สามารถบันทึกข้อความได้' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(` Server is running at http://localhost:${PORT}`);
// });
