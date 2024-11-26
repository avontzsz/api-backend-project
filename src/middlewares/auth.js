const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  // Captura o token do cabeçalho Authorization
  const token = req.headers.authorization?.split(' ')[1];

 
  console.log('Token recebido:', token);

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    // Logando o erro para mais detalhes
    console.error('Erro ao verificar token:', err);
    res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = authenticate;
