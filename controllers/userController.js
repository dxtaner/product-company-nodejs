const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../models/User");

const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    const existingEmailUser = await User.findOne({ email });
    const existingUsernameUser = await User.findOne({ username });

    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: "Bu e-posta adresi zaten kullanımda.",
      });
    }

    if (existingUsernameUser) {
      return res.status(400).json({
        success: false,
        message: "Bu kullanıcı adı zaten kullanımda.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || ROLES.USER,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu.",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcı oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "E-posta veya şifre hatalı.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Kullanıcı girişi başarılı.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Giriş işlemi sırasında bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.checkUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcı sorgulanırken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      success: true,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Toplam kullanıcı sayısı alınırken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await User.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  try {
    results.totalUsers = await User.countDocuments();
    results.users = await User.find()
      .sort({ createdAt: -1 }) // createdAt alanına göre azalan sıralama
      .limit(limit)
      .skip(startIndex)
      .exec();

    res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcılar alınırken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    const userRoleId = req.user.userId;
    const user_2 = await User.findById(userRoleId);
    const userRole = user_2.role;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bu kullanıcıyı silme yetkiniz yok.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Kullanıcı başarıyla silindi.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcı silinirken bir hata oluştu.",
      error: error.message,
    });
  }
};

exports.getDashboard = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);

  const dashboardData = {
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  res.status(200).json({
    success: true,
    data: dashboardData,
  });
};
