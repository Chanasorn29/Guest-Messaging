const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const messageFile = path.join(__dirname, 'messages.json');

app.use(express.json());
app.use(express.static('public'));

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
    messages = JSON.parse(fs.readFileSync(messageFile));
  }

  messages.push(newEntry);
  fs.writeFileSync(messageFile, JSON.stringify(messages, null, 2));

  res.json({ status: 'ส่งข้อความสำเร็จแล้ว!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
