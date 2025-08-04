const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}`);
});
