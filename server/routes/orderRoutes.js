// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get("/:orderId/invoice", orderController.getInvoice);

module.exports = router;
