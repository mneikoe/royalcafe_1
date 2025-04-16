import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import { format } from "date-fns";

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create a fetchData function that we can call both initially and on refresh
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Make sure the token is properly set in API headers
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
      }

      // We need to explicitly set auth header as this might be called after a token refresh
      const response = await api.get(`/auth/user/${user.phone}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudentData(response.data);

      // Update user context if we have new user data
      if (response.data && response.data._id) {
        updateUser({
          ...user,
          ...response.data,
        });
      }
    } catch (err) {
      console.error("Failed to fetch student data:", err);

      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Failed to fetch your data. Please try refreshing the page.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  // Load data when component mounts or user changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add a refresh handler
  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-center">{error}</p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="p-8 text-center">
        <p>No data available.</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">
            Welcome, {studentData?.name}
          </h1>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            Your Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-medium truncate">{studentData?.name}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="font-medium">{studentData?.phone}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-3">
          Your Meal Plans
        </h2>
        {studentData?.meals?.length > 0 ? (
          <div className="grid gap-3">
            {studentData.meals.map((meal) => (
              <div
                key={meal._id}
                className="bg-white rounded-lg shadow-md p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2">
                  <h3 className="text-base sm:text-lg font-medium capitalize mb-1 sm:mb-0">
                    {meal.type}
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {format(new Date(meal.date), "dd MMM yyyy")}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span className="font-medium">₹{meal.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">{meal.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Valid Till:</span>
                    <span className="font-medium">
                      {format(new Date(meal.expiryDate), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Meals per day:</span>
                    <span className="font-medium">{meal.times}</span>
                  </div>

                  <div className="pt-1.5">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Remaining:</span>
                      <span className="font-medium">
                        {meal.remainingMeals}/{meal.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max(
                            0,
                            (meal.remainingMeals / meal.total) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-semibold mt-3">
                  Consumption History
                </h4>
                {meal.consumptions && meal.consumptions.length > 0 ? (
                  <ul className="list-disc list-inside mt-1.5">
                    {meal.consumptions.map((history) => (
                      <li key={history._id} className="text-xs sm:text-sm">
                        {format(
                          new Date(history.consumedAt),
                          "dd MMM yyyy, HH:mm"
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-xs sm:text-sm">
                    No consumption history available.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 text-center text-sm sm:text-base">
            <p>You don't have any meal plans yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
