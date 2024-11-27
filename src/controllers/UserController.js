const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findUserByEmail, createUser, deleteUserByEmail } = require('../repositories/UserRepository');

// Função de registro de usuário
const register = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await findUserByEmail(email);
  if (userExists) return res.status(400).json({ error: 'Email já registrado' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(email, passwordHash);
  res.status(201).json(user);
};

// Função de login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
};

// Função para deletar usuário
const deleteUser = async (req, res) => {
  const { email } = req.params; // O e-mail será passado como parâmetro na URL

  try {
    const user = await deleteUserByEmail(email); // Função para deletar usuário do banco

    if (user) {
      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar o usuário:', error);
    return res.status(500).json({ error: 'Erro ao deletar o usuário' });
  }
};

module.exports = { register, login, deleteUser };
