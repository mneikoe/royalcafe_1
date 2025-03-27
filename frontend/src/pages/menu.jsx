/*import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offer: "",
    image: null,
  });
  const [error, setError] = useState("");

  // Fetch existing menu items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/menu`);
        setMenuItems(response.data);
      } catch (err) {
        setError("Failed to load menu items");
      }
    };
    fetchItems();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("offer", formData.offer);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await axios.post(`${API_URL}/menu`, data);
      setMenuItems([...menuItems, response.data]);
      setFormData({
        name: "",
        description: "",
        price: "",
        offer: "",
        image: null,
      });
      setError("");
    } catch (err) {
      setError("Failed to create menu item");
    }
  };

  // Handle delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/menu/${id}`);
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
    
      <div className="max-w-md mx-auto mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Create New Menu Item
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Offer
            </label>
            <input
              type="string"
              value={formData.offer}
              onChange={(e) =>
                setFormData({ ...formData, offer: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Item
          </button>
        </form>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white w-full rounded-lg shadow-md overflow-hidden"
          >
            {item.image && (
              <img
                src={`data:${item.image.contentType};base64,${item.image.data}`}
                alt={item.name}
                className="w-full h-99 object-cover"
              />
            )}
            <div className="p-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <span className="text-blue-600 font-bold">₹{item.price}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <p className="text-sm text-blue-600 mb-3">{item.offer}</p>
              <button
                onClick={() => handleDelete(item._id)}
                className="w-full bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiImage,
  FiDollarSign,
  FiTag,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offer: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch existing menu items
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/menu`);
        setMenuItems(response.data);
      } catch (err) {
        setError("Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("offer", formData.offer);
    if (formData.image) data.append("image", formData.image);

    try {
      let response;
      if (editingId) {
        response = await axios.put(`${API_URL}/menu/${editingId}`, data);
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingId ? response.data : item
          )
        );
      } else {
        response = await axios.post(`${API_URL}/menu`, data);
        setMenuItems([...menuItems, response.data]);
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        offer: "",
        image: null,
      });
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit item
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      offer: item.offer,
      image: null,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`${API_URL}/menu/${id}`);
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Menu Management
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Create and manage your restaurant menu items
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Create/Edit Menu Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-2xl font-bold text-white">
              {editingId ? "Edit Menu Item" : "Create New Menu Item"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Margherita Pizza"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the item..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Offer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer/Discount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.offer}
                    onChange={(e) =>
                      setFormData({ ...formData, offer: e.target.value })
                    }
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 10% off"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span className="flex items-center gap-2">
                          <FiImage className="h-5 w-5" />
                          {formData.image
                            ? formData.image.name
                            : "Upload an image"}
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              image: e.target.files[0],
                            })
                          }
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      offer: "",
                      image: null,
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg text-white transition-colors ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } flex items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  <>
                    <FiPlus />
                    {editingId ? "Update Item" : "Create Item"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Menu Items Grid */}
        {isLoading && menuItems.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No menu items
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new menu item.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Current Menu
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden">
                    {item.image ? (
                      <img
                        src={`data:${item.image.contentType};base64,${item.image.data}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FiImage className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    {item.offer && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.offer}
                        </span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <FiEdit className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
