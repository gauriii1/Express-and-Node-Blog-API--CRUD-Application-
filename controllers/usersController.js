const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../data/users.json');

const readUsers = () => JSON.parse(fs.readFileSync(usersFile));
const writeUsers = (data) => fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));

exports.getAllUsers = (req, res) => res.json(readUsers());

exports.getUserById = (req, res) => {
  const user = readUsers().find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.createUser = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const users = readUsers();
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.name = req.body.name || user.name;
  writeUsers(users);
  res.json(user);
};

exports.deleteUser = (req, res) => {
  let users = readUsers();
  users = users.filter(u => u.id !== parseInt(req.params.id));
  writeUsers(users);
  res.status(204).send();
};
