const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const messageFile = path.join(__dirname, 'messages.json');

// เสิร์ฟไฟล์ static จากโฟลเดอร์ public
app.use(express.static('public'));
app.use(express.json());

// เสิร์ฟไฟล์ index.html เมื่อเข้าเว็บ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API สำหรับรับข้อความ
app.post('/api/message', (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ status: 'ข้อความว่าง' });
  }

  const newEntry = {
    message,
    time: new Date().toISOString()
  };

  let messages = [];
  if (fs.existsSync(messageFile)) {
    try {
      messages = JSON.parse(fs.readFileSync(messageFile));
    } catch (error) {
      console.error('Error reading messages.json:', error);
      return res.status(500).json({ status: 'ไม่สามารถอ่านข้อมูลได้' });
    }
  }

  messages.push(newEntry);

  try {
    fs.writeFileSync(messageFile, JSON.stringify(messages, null, 2));
    res.json({ status: 'ส่งข้อความสำเร็จแล้ว!' });
  } catch (error) {
    console.error('Error writing to messages.json:', error);
    return res.status(500).json({ status: 'ไม่สามารถบันทึกข้อความได้' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
