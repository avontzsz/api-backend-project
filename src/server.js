const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');  // Biblioteca para interagir com o PostgreSQL

// Carregar as variáveis de ambiente
dotenv.config();

// Criar uma instância do servidor Express
const app = express();

// Middleware para processar o corpo das requisições em JSON
app.use(express.json());

// Conectar ao banco de dados PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

client.connect();

// Endpoint de exemplo (POST)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Exemplo de verificação simples de credenciais
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Endpoint de exemplo (GET)
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'Token não fornecido' });

  // Remover o prefixo "Bearer " caso esteja presente
  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido', error: err.message });
    }

    // Se o token for válido, você pode acessar os dados decodificados (como o nome de usuário)
    res.json({ message: 'Acesso permitido', user: decoded });
  });
});

// Configurar o servidor para escutar requisições na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
