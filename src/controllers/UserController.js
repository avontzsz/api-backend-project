const UserService = require('../services/UserService');

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserService.registerUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await UserService.loginUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    await UserService.deleteUserByEmail(email);
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { register, login, deleteUser };
