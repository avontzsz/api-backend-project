const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findUserByEmail, createUser } = require('../repositories/UserRepository');

const register = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await findUserByEmail(email);
  if (userExists) return res.status(400).json({ error: 'Email já registrado' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(email, passwordHash);
  res.status(201).json(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { register, login };
