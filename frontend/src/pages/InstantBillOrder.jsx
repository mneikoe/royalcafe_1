// src/App.js
/*import { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const InstantBillOrder = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: 1 });
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const addItem = () => {
    if (newItem.name && newItem.price > 0) {
      setItems([
        ...items,
        {
          ...newItem,
          price: parseFloat(newItem.price),
          quantity: parseInt(newItem.quantity),
        },
      ]);
      setNewItem({ name: "", price: "", quantity: 1 });
    }
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/orders`, {
        items,
        customer,
      });

      setOrder(response.data.order);
    } catch (error) {
      alert("Error creating order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          JainKuti Order System
        </h1>

        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Items</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Item name"
              className="p-2 border rounded"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="p-2 border rounded"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              className="p-2 border rounded"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              min="1"
            />
            <button
              onClick={addItem}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>

          
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Current Items:</h3>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span>
                      ₹{item.price} x {item.quantity}
                    </span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="p-2 border rounded"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="p-2 border rounded"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
            </div>
          </div>

        
          <div className="bg-gray-50 p-4 rounded mb-6">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>GST (18%):</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

        
          <button
            onClick={createOrder}
            disabled={items.length === 0 || !customer.name || !customer.phone}
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Generate Order"}
          </button>
        </div>

        
        {order && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Order Generated Successfully!
            </h2>
            <div className="flex flex-col items-center">
              <QRCodeSVG value={order.invoiceUrl} size={200} className="mb-4" />
              <p className="mb-4">Scan the QR code to download your invoice</p>
              <a
                href={order.invoiceUrl}
                download
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Download Invoice Directly
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantBillOrder;*/
import { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiTrash2,
  FiDownload,
  FiUser,
  FiPhone,
  FiShoppingCart,
} from "react-icons/fi";
import {
  printToBluetoothPrinter,
  initBluetoothPrinter,
} from "../utils/bluetoothPrinter";

const InstantBillOrder = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: 1 });
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiptText, setReceiptText] = useState("");
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addItem = () => {
    if (newItem.name && newItem.price > 0) {
      setItems([
        ...items,
        {
          ...newItem,
          price: parseFloat(newItem.price),
          quantity: parseInt(newItem.quantity),
        },
      ]);
      setNewItem({ name: "", price: "", quantity: 1 });
    }
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/orders`, {
        items,
        customer,
      });
      const newOrder = response.data.order;
      setOrder(newOrder);

      const txtRes = await axios.get(
        `${API_URL}/orders/${newOrder.orderId}/printable`
      );
      setReceiptText(txtRes.data.text);
    } catch (error) {
      toast.error("Error creating order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <FiShoppingCart className="text-white" />
              Order System
            </h1>
          </div>

          {/* Order Form */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dal Rice"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    min="1"
                  />
                  <button
                    onClick={addItem}
                    className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-gray-700">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiUser className="mr-2 text-blue-500" />
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiPhone className="mr-2 text-blue-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={createOrder}
              disabled={items.length === 0 || !customer.name || !customer.phone}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
                items.length === 0 || !customer.name || !customer.phone
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Generate Order"
              )}
            </button>
          </div>
        </div>

        {/* Order Result */}
        {order && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Order Generated Successfully!
              </h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <QRCodeSVG
                  value={order.invoiceUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="mb-4 text-gray-600 text-center">
                Scan the QR code to view or download your invoice
              </p>
              <a
                href={order.invoiceUrl}
                download
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiDownload />
                Download Invoice
              </a>
            </div>
          </div>
        )}
        {order && receiptText && (
          <div className="mt-6 bg-gray-50 p-4 rounded shadow">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {receiptText}
            </pre>
            <button
              onClick={async () => {
                try {
                  await initBluetoothPrinter();
                  toast.success("Printer connected!");
                } catch (e) {
                  toast.error("Printer connection failed");
                }
              }}
              className="mr-4 bg-gray-600 text-white px-4 py-2 rounded"
            >
              Connect Printer
            </button>

            <button
              onClick={() => printToBluetoothPrinter(receiptText)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Print Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantBillOrder;
