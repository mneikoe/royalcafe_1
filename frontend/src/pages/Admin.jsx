/*import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state immediately

    try {
      // Add optimistic feedback before the API call completes
      toast.loading("Registering student...");

      // Make the API call
      await api.post("/auth/register", { ...formData, role: "student" });

      // Dismiss the loading toast and show success
      toast.dismiss();
      toast.success("Student registered successfully!");

      // Reset form (optional)
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      // Navigate after a very short delay to allow the user to see the success message
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 500);
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              required
              className="w-full p-2 border rounded"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
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
                Registering...
              </span>
            ) : (
              "Register Student"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}*/
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/auth/register", { ...formData, role: "student" });
      toast.success("Student registered successfully!");
      navigate("/admin/dashboard"); // Immediate navigation
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Student Registration
          </h2>
          <p className="text-gray-600">Create a new student account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiUser className="mr-2 text-blue-500" />
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isSubmitting}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiMail className="mr-2 text-blue-500" />
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isSubmitting}
              placeholder="student@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiPhone className="mr-2 text-blue-500" />
              Phone Number
            </label>
            <input
              type="tel"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={isSubmitting}
              placeholder="+1 234 567 890"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiLock className="mr-2 text-blue-500" />
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isSubmitting}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
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
                Registering...
              </span>
            ) : (
              "Register Student"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
