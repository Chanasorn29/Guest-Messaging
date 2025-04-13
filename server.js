const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;  // ใช้ process.env.PORT เพื่อให้รองรับการ deploy
const messageFile = path.join(__dirname, 'messages.json');  // ไฟล์ที่เก็บข้อความ

app.use(express.json());  // middleware สำหรับการรับข้อมูลแบบ JSON
app.use(express.static('public'));  // ให้บริการไฟล์ในโฟลเดอร์ public

// เส้นทางสำหรับรับข้อความ
app.post('/api/message', (req, res) => {
  const { message } = req.body;  // รับข้อความจาก body

  if (!message || !message.trim()) {
    return res.status(400).json({ status: 'ข้อความว่าง' });  // ถ้าข้อความว่างให้ส่งข้อผิดพลาด
  }

  const newEntry = {
    message,
    time: new Date().toISOString()  // เก็บเวลาที่ข้อความถูกส่ง
  };

  let messages = [];
  if (fs.existsSync(messageFile)) {
    // ถ้ามีไฟล์ messages.json ให้ทำการอ่านข้อมูล
    try {
      messages = JSON.parse(fs.readFileSync(messageFile));
    } catch (error) {
      console.error('Error reading messages.json:', error);
      return res.status(500).json({ status: 'ไม่สามารถอ่านข้อมูลได้' });
    }
  }

  messages.push(newEntry);  // เพิ่มข้อความใหม่เข้าไป
  
  try {
    // เขียนข้อมูลกลับไปยังไฟล์ JSON
    fs.writeFileSync(messageFile, JSON.stringify(messages, null, 2));
    res.json({ status: 'ส่งข้อความสำเร็จแล้ว!' });
  } catch (error) {
    console.error('Error writing to messages.json:', error);
    return res.status(500).json({ status: 'ไม่สามารถบันทึกข้อความได้' });
  }
});

// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
