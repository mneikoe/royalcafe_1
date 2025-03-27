// controllers/orderController.js
const Order = require("../models/Order");
const { generateInvoiceBuffer } = require("../utils/pdfGenerator");
const QRCode = require("qrcode");

exports.createOrder = async (req, res) => {
  try {
    const { items, customer } = req.body;

    // Validate input
    if (!items || !customer) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const total = subtotal;

    // Generate order ID
    const orderId = `RC${Date.now().toString().slice(-6)}`;

    // Generate PDF buffer
    const tempOrder = { items, customer, subtotal, total, orderId };
    const pdfBuffer = await generateInvoiceBuffer(tempOrder);

    // Generate QR Code
    const qrCode = await QRCode.toDataURL(
      `https://rc.atithikripa.com/api/orders/${orderId}/invoice`
    );

    // Create and save order
    const order = new Order({
      items,
      customer,
      subtotal,

      total,
      orderId,
      invoice: {
        data: pdfBuffer,
        contentType: "application/pdf",
      },
      qrCode,
    });

    await order.save();

    res.status(201).json({
      success: true,
      order: {
        orderId,
        total,
        qrCode,
        invoiceUrl: `https://rc.atithikripa.com/api/orders/${orderId}/invoice`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).select(
      "invoice"
    );

    if (!order || !order.invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.set("Content-Type", order.invoice.contentType);
    res.set(
      "Content-Disposition",
      `attachment; filename=invoice_${order.orderId}.pdf`
    );
    res.send(order.invoice.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
