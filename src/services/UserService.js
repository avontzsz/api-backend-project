const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, deleteUserByEmail } = require('../repositories/UserRepository');
require('dotenv').config();

class UserService {
  // Registra um usuário
  async registerUser(email, password) {
    const userExists = await findUserByEmail(email);
    if (userExists) throw new Error('Email já registrado');

    const passwordHash = await bcrypt.hash(password, 10);
    return await createUser(email, passwordHash);
  }

  // Faz login
  async loginUser(email, password) {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      throw new Error('Credenciais inválidas');

    return jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  }

  // Deleta um usuário
  async deleteUserByEmail(email) {
    const userDeleted = await deleteUserByEmail(email);
    if (!userDeleted) throw new Error('Usuário não encontrado');
    return true;
  }
}

module.exports = new UserService();
