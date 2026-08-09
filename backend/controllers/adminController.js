const User = require('../models/User');
const Item = require('../models/Item');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const openItems = await Item.countDocuments({ status: 'open' });
    const claimedItems = await Item.countDocuments({ status: 'claimed' });
    const resolvedItems = await Item.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments();

    res.status(200).json({ totalItems, openItems, claimedItems, resolvedItems, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};