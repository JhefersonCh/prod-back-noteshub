const { Op } = require("sequelize");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const validateUserExistence = async (id, res) => {
  if (!id) {
    res.status(400).json({ error: 'Id is required.' });
    return false;
  }
  const userExist = await User.findByPk(id);
  if (!userExist) {
    res.status(404).json({ error: 'User does not exist.' });
    return false;
  }
  return userExist;
};

exports.createUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const userExist = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (userExist) {
      return res.status(400).json({ error: 'Email or username duplicated.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      username,
      password: hashedPassword
    });

    const userWithoutPassword = {
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email
    };

    return res.status(201).json({
      message: 'User created successfully.',
      data: userWithoutPassword
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, fullName, username, email } = req.body;

    const userExist = await validateUserExistence(id, res);
    if (!userExist) return;

    const [affectedRows] = await User.update({
      fullName,
      username,
      email
    }, {
      where: { id }
    });

    if (affectedRows === 0) {
      return res.status(400).json({ message: 'No user was updated.' });
    }

    return res.status(200).json({
      message: 'User updated successfully.',
      data: { id }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    const userExist = await validateUserExistence(id, res);
    if (!userExist) return;

    await User.destroy({ where: { id } });

    return res.status(200).json({
      message: 'User deleted successfully.',
      data: { id }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};