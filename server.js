const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersegredonofuturo'; // troca depois

app.use(cors());
app.use(express.json());

// Banco fake na memória
const users = [];

// Cadastro
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Preencha todos os campos.' });

  if (users.find(u => u.email === email))
    return res.status(409).json({ message: 'Email já cadastrado.' });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, email, password: hashed });

  res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(401).json({ message: 'Email ou senha inválidos.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: 'Email ou senha inválidos.' });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
});

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Rota protegida de exemplo
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Bem vindo, ${req.user.email}!` });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
