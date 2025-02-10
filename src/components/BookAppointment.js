import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";

const BookAppointment = () => {
  const { appointmentId } = useParams();
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointmentDetails();
    prefillUserDetails();
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/appointments/getappointment/${appointmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointmentDetails(response.data);
    } catch (error) {
      setError("Failed to fetch appointment details.");
      console.error("Error fetching appointment:", error);
    }
  };

  const prefillUserDetails = () => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
     

      if (!token || token.split(".").length !== 3) {
        throw new Error("Invalid or missing JWT token. Please log in again.");
      }

      await axios.post(
        "http://localhost:8080/api/appointments/book",
        { appointmentId, ...formData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment booked successfully!");
    } catch (error) {
      setError(error.message || "Error booking appointment. Please try again.");
      console.error("Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateArray, startTimeArray, endTimeArray) => {
    if (!Array.isArray(dateArray) || !Array.isArray(startTimeArray) || !Array.isArray(endTimeArray)) {
      return { formattedDate: "Invalid Date", formattedStartTime: "Invalid Time", formattedEndTime: "Invalid Time" };
    }

    const [year, month, day] = dateArray;
    const [startHour, startMinute] = startTimeArray;
    const [endHour, endMinute] = endTimeArray;

    const formattedDate = dayjs(new Date(year, month - 1, day)).format("DD MMM YYYY");
    const formattedStartTime = dayjs().hour(startHour).minute(startMinute).format("hh:mm A");
    const formattedEndTime = dayjs().hour(endHour).minute(endMinute).format("hh:mm A");

    return { formattedDate, formattedStartTime, formattedEndTime };
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Book Appointment
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {appointmentDetails ? (
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: "#f9f9f9" }}>
            
            <Typography>
              <strong>Date:</strong> {formatDateTime(appointmentDetails.date, appointmentDetails.startTime, appointmentDetails.endTime).formattedDate}
            </Typography>
            <Typography>
              <strong>Time:</strong> {formatDateTime(appointmentDetails.date, appointmentDetails.startTime, appointmentDetails.endTime).formattedStartTime} - {formatDateTime(appointmentDetails.date, appointmentDetails.startTime, appointmentDetails.endTime).formattedEndTime}
            </Typography>
          </Paper>
        ) : (
          <Typography>Loading appointment details...</Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mt: 2 }}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default BookAppointment;
