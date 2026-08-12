const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create item (lost ya found post karna)
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date } = req.body;

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date,
      image: req.file ? req.file.path : '',
      postedBy: req.user.id,
    });

    res.status(201).json(item);
  } catch (error) {
  console.error('CREATE ITEM ERROR:', error.message);
  res.status(500).json({ message: error.message });
}
};

// Sab items get karo (with filters)
exports.getItems = async (req, res) => {
  try {
    const { category, type, location, search } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Single item get karo
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Item status update karo (claim/resolve)
exports.updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const newStatus = req.body.status;

    // Jab item claim ho
    if (newStatus === 'claimed' && item.status !== 'claimed') {
      item.claimedBy = req.user.id;

      const claimer = await User.findById(req.user.id);

      await Notification.create({
        user: item.postedBy,
        message: `${claimer.name} claimed your item "${item.title}"`,
        item: item._id,
        type: 'claim',
      });
    }

    // Jab item resolve ho
    if (newStatus === 'resolved' && item.status !== 'resolved') {
      await Notification.create({
        user: item.postedBy,
        message: `Your item "${item.title}" has been marked as resolved`,
        item: item._id,
        type: 'resolve',
      });

      if (item.claimedBy) {
        await Notification.create({
          user: item.claimedBy,
          message: `The item "${item.title}" you claimed has been resolved`,
          item: item._id,
          type: 'resolve',
        });
      }
    }

    item.status = newStatus;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Item delete karo
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Sirf jisne post kiya wahi ya admin delete kar sake
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};