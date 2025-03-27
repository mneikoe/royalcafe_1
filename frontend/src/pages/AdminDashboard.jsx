import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiUser,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiCoffee,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ message: "", type: "" });
  const [newMeal, setNewMeal] = useState({
    type: "monthly",
    times: 1,
    duration: 7,
    price: 0,
    validity: 0,
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showMealForm, setShowMealForm] = useState(false);
  const [mealStatus, setMealStatus] = useState({ message: "", type: "" });

  // Filter users based on search input
  const filteredUsers = searchName
    ? allUsers.filter((user) =>
        user.name
          ?.toString()
          .toLowerCase()
          .includes(searchName.toString().toLowerCase())
      )
    : allUsers;

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user?.role]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/allusers`);
      setAllUsers(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await axios.delete(`${API_URL}/auth/delete/${userId}`);
        setDeleteStatus({
          message: `User ${userName} deleted successfully`,
          type: "success",
        });
        fetchUsers();
        setTimeout(() => {
          setDeleteStatus({ message: "", type: "" });
        }, 3000);
      } catch (err) {
        console.error("Error deleting user:", err);
        setDeleteStatus({
          message: `Failed to delete user: ${
            err.response?.data?.error || err.message
          }`,
          type: "error",
        });
      }
    }
  };

  const toggleMealView = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleCreateMeal = async (e) => {
    e.preventDefault();
    const selectedUser = allUsers.find((u) => u._id === selectedUserId);
    if (!selectedUser) return;

    try {
      const response = await axios.post(`${API_URL}/meals/create`, {
        phone: selectedUser.phone,
        ...newMeal,
      });

      setMealStatus({
        message: `Meal created successfully for ${selectedUser.name}`,
        type: "success",
      });

      setNewMeal({
        type: "monthly",
        times: 1,
        duration: 7,
        price: 0,
        validity: 0,
      });

      setShowMealForm(false);
      fetchUsers();

      setTimeout(() => {
        setMealStatus({ message: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error("Error creating meal:", err);
      setMealStatus({
        message: `Failed to create meal: ${
          err.response?.data?.message || err.message
        }`,
        type: "error",
      });
    }
  };

  const openMealForm = (userId) => {
    setSelectedUserId(userId);
    setShowMealForm(true);
  };

  const handleAdminConsumeMeal = async (userId, mealId) => {
    if (window.confirm(`Meal Consumption ?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token missing");
          return;
        }

        // Optimistic UI update
        setAllUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user._id === userId) {
              return {
                ...user,
                meals: user.meals.map((meal) => {
                  if (meal._id === mealId) {
                    return {
                      ...meal,
                      remainingMeals: Math.max(0, meal.remainingMeals - 1),
                      consumptions: [
                        ...meal.consumptions,
                        {
                          consumedAt: new Date().toISOString(),
                          _id: `temp-${Date.now()}`,
                        },
                      ],
                    };
                  }
                  return meal;
                }),
              };
            }
            return user;
          })
        );

        const response = await axios.post(
          `${API_URL}/meals/consume/${mealId}/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAllUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user._id === userId) {
              return {
                ...user,
                meals: user.meals.map((meal) => {
                  if (meal._id === mealId) {
                    return {
                      ...meal,
                      remainingMeals: response.data.remainingMeals,
                      consumptions: [
                        ...meal.consumptions.filter(
                          (c) => !c._id.startsWith("temp")
                        ),
                        response.data.consumption,
                      ],
                    };
                  }
                  return meal;
                }),
              };
            }
            return user;
          })
        );

        toast.success(response.data.message || "Meal consumed successfully!");
      } catch (err) {
        console.error("Meal consumption error:", err);
        setAllUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user._id === userId) {
              return {
                ...user,
                meals: user.meals.map((meal) => {
                  if (meal._id === mealId) {
                    return {
                      ...meal,
                      remainingMeals: meal.remainingMeals + 1,
                      consumptions: meal.consumptions.filter(
                        (c) => !c._id.startsWith("temp")
                      ),
                    };
                  }
                  return meal;
                }),
              };
            }
            return user;
          })
        );

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to consume meal";
        toast.error(errorMessage);

        if (err.response?.status === 401) {
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      }
    }
  };

  const handleDeleteMeal = async (userId, mealId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this meal?"
      );
      if (!confirmed) return;

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/meals/delete/${mealId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Meal deleted successfully.");
        fetchUsers();
      }
    } catch (error) {
      console.error(
        "Error deleting meal:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete meal. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-blue-800 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 max-w-md">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiUser className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Welcome back,{" "}
                <span className="text-blue-600">{user?.name || "Admin"}</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === "admin"
                  ? "Administrator Dashboard"
                  : "User Dashboard"}
              </p>
            </div>

            {user?.role !== "admin" && (
              <button
                onClick={() => navigate(`/search`)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <FiCoffee className="text-lg" />
                <span>View Meal Details</span>
              </button>
            )}
          </div>
        </header>

        {/* Status Messages */}
        {(deleteStatus.message || mealStatus.message) && (
          <div
            className={`mb-6 p-4 rounded-xl shadow-sm ${
              deleteStatus.type === "success" || mealStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  deleteStatus.type === "success" ||
                  mealStatus.type === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {deleteStatus.type === "success" ||
                mealStatus.type === "success" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                )}
              </div>
              <div>{deleteStatus.message || mealStatus.message}</div>
            </div>
          </div>
        )}

        {user?.role === "admin" ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Dashboard Controls */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Student Management
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {filteredUsers.filter((u) => u.role === "student").length}{" "}
                    students found
                  </p>
                </div>

                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Joined
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Meal Plans
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No students found matching your search
                      </td>
                    </tr>
                  ) : (
                    filteredUsers
                      .filter((userData) => userData.role === "student")
                      .map((userData) => (
                        <>
                          <tr
                            key={userData._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <FiUser className="text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {userData.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {userData.phone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {userData.createdAt
                                  ? format(
                                      new Date(userData.createdAt),
                                      "dd MMM yyyy"
                                    )
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {userData.meals?.length || 0} active
                                </span>
                                <button
                                  onClick={() => toggleMealView(userData._id)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  {expandedUserId === userData._id ? (
                                    <FiChevronUp className="h-5 w-5" />
                                  ) : (
                                    <FiChevronDown className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openMealForm(userData._id)}
                                  disabled={
                                    userData.role !== "student" ||
                                    userData.meals?.length === 1
                                  }
                                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-all ${
                                    userData.role !== "student" ||
                                    userData.meals?.length === 1
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                                  title={
                                    userData.role !== "student"
                                      ? "Only students can have meals"
                                      : "Create meal"
                                  }
                                >
                                  <FiPlus className="mr-1" /> Add Meal
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteUser(
                                      userData._id,
                                      userData.name
                                    )
                                  }
                                  disabled={userData._id === user?._id}
                                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-all ${
                                    userData._id === user?._id
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                  title={
                                    userData._id === user?._id
                                      ? "Cannot delete your own account"
                                      : "Delete user"
                                  }
                                >
                                  <FiTrash2 className="mr-1" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                          {expandedUserId === userData._id && (
                            <tr>
                              <td colSpan="4" className="px-0 py-0">
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiCoffee className="text-blue-600" />
                                    Meal Plans for {userData.name}
                                  </h3>
                                  {userData.meals &&
                                  userData.meals.length > 0 ? (
                                    <div className="space-y-4">
                                      {userData.meals.map((meal) => (
                                        <div
                                          key={meal._id}
                                          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                                        >
                                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                            <div>
                                              <h4 className="font-medium text-gray-900 capitalize">
                                                {meal.type} Plan
                                              </h4>
                                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                  <FiClock className="text-blue-500" />{" "}
                                                  {meal.times} times/day
                                                </span>
                                                <span className="flex items-center gap-1">
                                                  <FiCalendar className="text-blue-500" />{" "}
                                                  {meal.duration} days
                                                </span>
                                                <span className="flex items-center gap-1">
                                                  <FiDollarSign className="text-blue-500" />{" "}
                                                  ₹{meal.price}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() =>
                                                  handleAdminConsumeMeal(
                                                    userData._id,
                                                    meal._id
                                                  )
                                                }
                                                disabled={
                                                  meal.remainingMeals <= 0
                                                }
                                                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-all ${
                                                  meal.remainingMeals > 0
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                              >
                                                <FiMinus /> Consume
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDeleteMeal(
                                                    userData._id,
                                                    meal._id
                                                  )
                                                }
                                                className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                                              >
                                                <FiTrash2 /> Delete
                                              </button>
                                            </div>
                                          </div>

                                          <div className="mb-3">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                              <span>
                                                Meals remaining:{" "}
                                                {meal.remainingMeals}/
                                                {meal.total}
                                              </span>
                                              <span>
                                                Expires:{" "}
                                                {meal.expiryDate
                                                  ? format(
                                                      new Date(meal.expiryDate),
                                                      "dd MMM yyyy"
                                                    )
                                                  : "N/A"}
                                              </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                              <div
                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                                                style={{
                                                  width: `${
                                                    (meal.remainingMeals /
                                                      meal.total) *
                                                    100
                                                  }%`,
                                                }}
                                              ></div>
                                            </div>
                                          </div>

                                          <div className="text-sm text-gray-500">
                                            <p>
                                              Started:{" "}
                                              {format(
                                                new Date(meal.date),
                                                "dd MMM yyyy"
                                              )}
                                            </p>
                                            <p>
                                              Validity: {meal.validity} days
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 text-gray-500">
                                      <FiCoffee className="mx-auto h-12 w-12 text-gray-300" />
                                      <p className="mt-2">
                                        No meal plans found for this student
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FiUser className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Your Profile
                  </h2>
                  <p className="text-gray-500">
                    Manage your account information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.name || "N/A"}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit />
                  </button>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{user?.phone || "N/A"}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit />
                  </button>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium capitalize">
                      {user?.role || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {user?.createdAt
                        ? format(new Date(user.createdAt), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate(`/search`)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <FiCoffee className="text-lg" />
                  <span>View My Meal Details</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meal Creation Modal */}
        {showMealForm && selectedUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-semibold">
                  Create New Meal Plan for{" "}
                  <span className="font-bold">
                    {allUsers.find((u) => u._id === selectedUserId)?.name}
                  </span>
                </h3>
              </div>
              <form onSubmit={handleCreateMeal} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Type
                    </label>
                    <select
                      value={newMeal.type}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, type: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="15 Days">15 Days</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Times (per day)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newMeal.times}
                        onChange={(e) =>
                          setNewMeal({
                            ...newMeal,
                            times: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newMeal.duration}
                        onChange={(e) =>
                          setNewMeal({
                            ...newMeal,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validity (days)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newMeal.validity}
                        onChange={(e) =>
                          setNewMeal({
                            ...newMeal,
                            validity: parseFloat(e.target.value),
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newMeal.price}
                        onChange={(e) =>
                          setNewMeal({
                            ...newMeal,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMealForm(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
                  >
                    Create Meal Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
