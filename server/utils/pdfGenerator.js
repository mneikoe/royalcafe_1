const PDFDocument = require("pdfkit");

const generateInvoiceBuffer = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];

      // Document metadata
      doc.info.Title = `Invoice #${order.orderId}`;
      doc.info.Author = "Royal Cafe";

      // Header with logo space and styled title
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("Royal Cafe", { align: "center" });
      doc
        .fontSize(14)
        .font("Helvetica")
        .text("Your Taste, Our Priority", { align: "center" });
      doc.moveDown(2);

      // Draw a horizontal line
      drawHorizontalLine(doc, 50);
      doc.moveDown();

      // Order Details - Invoice number and date properly formatted
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(`Invoice #${order.orderId}`, { align: "center" });

      // Fix the date formatting issue
      const orderDate = order.createdAt
        ? new Date(order.createdAt)
        : new Date();
      const formattedDate = orderDate.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Date: ${formattedDate}`, { align: "center" });
      doc.moveDown(2);

      // Customer Info in a neat box
      const customerStartY = doc.y;
      doc
        .font("Helvetica-Bold")
        .text("Customer Information:", { underline: true });
      doc
        .font("Helvetica")
        .text(`Name: ${order.customer.name}`)
        .text(`Contact: ${order.customer.phone}`);

      doc
        .rect(45, customerStartY - 5, 250, doc.y - customerStartY + 10)
        .stroke();
      doc.moveDown(2);

      // Items Table with improved structure
      drawItemsTable(doc, order.items);
      doc.moveDown(2);

      // Totals in a styled box on the right - WIDER BOX
      const totalsStartY = doc.y;
      doc.font("Helvetica-Bold");

      // Right-aligned with proper indentation - adjusted for wider payment summary
      const rightColumnX = 350; // Changed from 400 to 350 for more width
      const amountColumnX = 500;
      const boxWidth = 200; // Increased from 155 to 200

      doc.text("Payment Summary:", rightColumnX, totalsStartY);
      doc.font("Helvetica");

      doc.text(`Subtotal:`, rightColumnX, doc.y);
      // Use "Rs." instead of the rupee symbol
      doc.text(
        `Rs. ${order.subtotal.toFixed(2)}`,
        amountColumnX,
        doc.y - doc.currentLineHeight()
      );

      doc.moveDown(0.5);
      // Draw a line above total
      doc
        .moveTo(rightColumnX, doc.y - 5)
        .lineTo(rightColumnX + boxWidth, doc.y - 5)
        .stroke();

      doc.font("Helvetica-Bold");
      doc.text(`Total:`, rightColumnX);
      doc.text(
        `Rs. ${order.total.toFixed(2)}`,
        amountColumnX,
        doc.y - doc.currentLineHeight()
      );

      // Box around the totals - WIDER BOX
      doc
        .rect(
          rightColumnX - 5,
          totalsStartY - 5,
          boxWidth,
          doc.y - totalsStartY + 10
        )
        .stroke();

      // Collect PDF data
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to draw items table
function drawItemsTable(doc, items) {
  // Table headers
  const tableTop = doc.y;
  const tableLeft = 50;
  const colWidths = [200, 100, 100, 100];

  // Draw header background
  doc
    .fillColor("#f0f0f0")
    .rect(tableLeft, tableTop, 500, 20)
    .fill()
    .fillColor("#000000");

  // Header text
  doc.font("Helvetica-Bold");
  doc.text("Item", tableLeft, tableTop + 5);
  doc.text("Price", tableLeft + colWidths[0], tableTop + 5);
  doc.text("Qty", tableLeft + colWidths[0] + colWidths[1], tableTop + 5);
  doc.text(
    "Total",
    tableLeft + colWidths[0] + colWidths[1] + colWidths[2],
    tableTop + 5
  );

  // Move to next line
  doc.moveDown();
  let itemY = doc.y;

  // Draw items
  doc.font("Helvetica");
  items.forEach((item, i) => {
    // Alternating row colors
    if (i % 2 === 1) {
      doc
        .fillColor("#f9f9f9")
        .rect(tableLeft, itemY, 500, 20)
        .fill()
        .fillColor("#000000");
    }

    doc.text(item.name, tableLeft, itemY + 5);
    // Use "Rs." instead of rupee symbol
    doc.text(
      `Rs. ${item.price.toFixed(2)}`,
      tableLeft + colWidths[0],
      itemY + 5
    );
    doc.text(
      item.quantity.toString(),
      tableLeft + colWidths[0] + colWidths[1],
      itemY + 5
    );
    doc.text(
      `Rs. ${(item.price * item.quantity).toFixed(2)}`,
      tableLeft + colWidths[0] + colWidths[1] + colWidths[2],
      itemY + 5
    );

    itemY += 20;
  });

  // Draw table border
  doc.rect(tableLeft, tableTop, 500, itemY - tableTop).stroke();

  // Draw column divider lines
  let x = tableLeft;
  for (let i = 0; i < colWidths.length - 1; i++) {
    x += colWidths[i];
    doc.moveTo(x, tableTop).lineTo(x, itemY).stroke();
  }

  // Draw header divider
  doc
    .moveTo(tableLeft, tableTop + 20)
    .lineTo(tableLeft + 500, tableTop + 20)
    .stroke();

  // Set y position after the table
  doc.y = itemY + 10;
}

// Helper function to draw horizontal lines
function drawHorizontalLine(doc, y) {
  doc
    .moveTo(50, y)
    .lineTo(doc.page.width - 50, y)
    .stroke();
}

module.exports = { generateInvoiceBuffer };
