const pool = require('../config/database');

// Função para encontrar um usuário pelo e-mail
const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Função para criar um usuário
const createUser = async (email, passwordHash) => {
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
    [email, passwordHash]
  );
  return result.rows[0];
};

// Função para excluir um usuário pelo e-mail
const deleteUserByEmail = async (email) => {
  const result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
  return result.rowCount > 0;  // Retorna true se o usuário foi excluído, ou false se não foi encontrado
};

module.exports = { findUserByEmail, createUser, deleteUserByEmail };
