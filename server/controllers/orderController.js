// controllers/orderController.js
const Order = require("../models/Order");
const { generateInvoiceBuffer } = require("../utils/pdfGenerator");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
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
      `https://royalcafe1-production.up.railway.app/api/orders/${orderId}/invoice`
    );
    const invoicesDir = path.join(__dirname, "..", "public", "invoices");
    if (!fs.existsSync(invoicesDir))
      fs.mkdirSync(invoicesDir, { recursive: true });
    const filename = `invoice_${orderId}.pdf`;
    const filePath = path.join(invoicesDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    const invoiceUrl = `${req.protocol}://${req.get(
      "host"
    )}/invoices/${filename}`;
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
        invoiceUrl,
        //invoiceUrl: `https://rc.atithikripa.com/api/orders/${orderId}/invoice`,
      },
    });
  } catch (error) {
    console.error("🔥 createOrder error:", err);
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
// controllers/orderController.js
exports.getPrintableText = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Not found" });

    // Build a plain‑text receipt
    let lines = [];
    lines.push("*** Royal Cafe ***");
    lines.push(`Order ID: ${order.orderId}`);
    lines.push(`Customer: ${order.customer.name}`);
    lines.push(`Phone: ${order.customer.phone}`);
    lines.push("-----------------------------");
    order.items.forEach((i) => {
      const line = `${i.name} x${i.quantity}  Rs.${(
        i.price * i.quantity
      ).toFixed(2)}`;
      lines.push(line);
    });
    lines.push("-----------------------------");
    lines.push(`TOTAL: Rs.${order.total.toFixed(2)}`);
    lines.push("Thank you for your visit!");
    lines.push("\n\n"); // feed lines

    const text = lines.join("\n");
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
