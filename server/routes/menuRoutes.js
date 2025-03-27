const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

router.post("/", upload.single("image"), createMenuItem);
router.get("/", getMenuItems);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;
