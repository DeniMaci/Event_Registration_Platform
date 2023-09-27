// controllers/adminController.js
const { User } = require('../Models/User');

const adminDashboard = async (req, res) => {
  try {
    const users = await User.findAll();
    const events = await Event.findAll();

    res.status(200).json({ users });
    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load admin dashboard' });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

module.exports = {
  adminDashboard,
  checkAdmin,
};