// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersegredonofuturo'; // muda isso, sério

app.use(cors());
app.use(bodyParser.json());

// Simula um banco de dados (você pode trocar pra real depois)
const users = [
  { id: 1, email: 'teste@exemplo.com', password: '123456' }, // senha no claro, só demo
];

// Endpoint login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  // Cria o token JWT
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware para proteger rotas
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rota protegida exemplo
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Bem vindo ao dashboard, usuário ${req.user.email}` });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
