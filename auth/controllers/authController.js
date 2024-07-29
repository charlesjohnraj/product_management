const User = require('../models/users');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken, verifyToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await hashPassword(password);
  try{
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    res.status(201).send('User registered');  
  }catch{ 
    res.status(500).send('Error adding user');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await comparePassword(password, user.password)) {
    const token = generateToken(user._id);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
};

module.exports = { register, login };