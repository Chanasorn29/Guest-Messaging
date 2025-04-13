const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;  // ใช้ process.env.PORT ในการกำหนดพอร์ตที่เหมาะสมเมื่อ deploy
const messageFile = path.join(__dirname, 'messages.json');

app.use(express.json());  // ให้ app รองรับการรับข้อมูลแบบ JSON
app.use(express.static('public'));  // ให้บริการไฟล์ในโฟลเดอร์ public (ถ้ามี)

app.post('/api/message', (req, res) => {
  const { message } = req.body;  // รับข้อความจากการส่ง request

  if (!message || !message.trim()) {
    return res.status(400).json({ status: 'ข้อความว่าง' });
  }

  const newEntry = {
    message,
    time: new Date().toISOString()  // เก็บเวลาในรูปแบบ ISO string
  };

  let messages = [];
  if (fs.existsSync(messageFile)) {
    // อ่านไฟล์ messages.json ถ้ามี
    try {
      messages = JSON.parse(fs.readFileSync(messageFile));
    } catch (error) {
      console.error('Error reading messages.json:', error);
      return res.status(500).json({ status: 'ไม่สามารถอ่านข้อมูลได้' });
    }
  }

  messages.push(newEntry);  // เพิ่มข้อความใหม่เข้าไปในอาเรย์

  try {
    // เขียนข้อมูลลงในไฟล์ JSON
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
