require("dotenv").config();
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const bcrypt = require("bcrypt");

class UserController {
  static async get(req, res) {
    const user = await User.findAll();
    res.status(200).json({
      message: "Users retrieved successfully",
      users: user,
    });
  }

  static async store(req, res) {
    let { userName, email, password } = req.body;

    password = require("bcrypt").hashSync(password, 10);
    const user = await User.create({
      userName,
      email,
      password,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  }

  static async detail(req, res) {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { userName, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.userName = userName || user.userName;
    user.email = email || user.email;
    if (password) {
      user.password = require("bcrypt").hashSync(password, 10);
    }
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();

    res.status(200).json({
      message: "User Deleted successfully",
    });
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { [Op.or]: [{ email: email }, { userName: email }] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (!isPasswordvalid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  }

  static async register(req, res) {
    try {
      let { userName, email, password } = req.body;

      if (!userName || !email || !password) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
      }

      password = require("bcrypt").hashSync(password, 10);
      const user = await User.create({
        userName,
        email,
        password,
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({
        message: "Register successfully",
        token,
        user,
      });
    } catch (error) {
      console.error("Register Error:", error); // log ke terminal
      res.status(500).json({
        message: "Failed to register user",
        error: error.message,
        details: error.errors || null,
      });
    }
  }
}

module.exports = UserController;
