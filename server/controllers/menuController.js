const Menu = require("../models/Menu");

/*exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.buffer.toString("base64") : null;

    const newItem = new Menu({ name, description, price, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/
// In your menuController.js
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, offer } = req.body;

    // Verify file upload
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Validate MIME type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const newItem = new Menu({
      name,
      description,
      price,
      image: {
        data: req.file.buffer.toString("base64"),
        contentType: req.file.mimetype,
      },
      offer,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.buffer.toString("base64") : null;

    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
