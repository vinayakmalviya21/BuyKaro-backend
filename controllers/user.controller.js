const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Signup Controller
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password, // Password will be hashed in the middleware
    });

    await newUser.save();
    res.status(200).json({
      message: "User registered successfully"
    });    
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Edit Profile Controller
const editProfile = async (req, res) => {
  const userId = req.body.userId;
  const { phone, address, city, postalCode, country } = req.body;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const updatedShippingAddress = {
          address: address || user.shippingAddress.address,
          city: city || user.shippingAddress.city,
          postalCode: postalCode || user.shippingAddress.postalCode,
          country: country || user.shippingAddress.country,
      };

      const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
              shippingAddress: updatedShippingAddress,
              phone: phone || user.phone, 
          },
          { new: true } 
      );

      res.status(200).json({
          message: "Profile updated successfully",
          user: updatedUser,
      });
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};

// Get User Controller
const getUser = async (req, res) => {
  const userId = req.body.userId;

  try {
      const user = await User.findById(userId,{password:0});

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
          message: "Profile updated successfully",
          user: user,
      });
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  signup,
  login,
  editProfile,
  getUser
};