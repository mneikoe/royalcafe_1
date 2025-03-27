import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function StudentDashboard({ phone }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (phone) {
      fetchStudentData(phone);
    }
  }, [phone]);

  const fetchStudentData = async (phone) => {
    try {
      const response = await axios.get(`${API_URL}/meals/student/${phone}`);
      setStudentData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student data");
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const { student, meals } = studentData || {};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {student?.name}</h1>
      <p>Email: {student?.email}</p>
      <p>Phone: {student?.phone}</p>

      <h2 className="text-2xl font-bold mt-6">Your Meals</h2>
      {meals?.length > 0 ? (
        <div>
          {meals.map((meal) => (
            <div key={meal._id} className="border p-4 rounded mb-4">
              <div>
                <strong>Meal Name:</strong> {meal.name}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {format(new Date(meal.date), "dd MMM yyyy")}
              </div>
              <div>
                <strong>Total Meals:</strong> {meal.total}
              </div>
              <div>
                <strong>Remaining Meals:</strong> {meal.remainingMeals}
              </div>
              <div>
                <strong>Last Consumed:</strong>{" "}
                {meal.lastConsumedDate
                  ? format(
                      new Date(meal.lastConsumedDate),
                      "dd MMM yyyy, hh:mm a"
                    )
                  : "Not yet consumed"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No meals assigned</div>
      )}
    </div>
  );
}
