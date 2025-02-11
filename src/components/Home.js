import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";
import dayjs from "dayjs";
import bgImage from "../assets/bg.jpg"; 

const Home = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/appointments/available`);
      setSlots(response.data);
    } catch (error) {
      setError("Failed to load available slots. Please try again.");
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (appointmentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to book an appointment.");
      navigate("/login");
    } else {
      navigate(`/book-appointment/${appointmentId}`);
    }
  };

  const formatDateTime = (dateArray, startTimeArray, endTimeArray) => {
    if (!Array.isArray(dateArray) || !Array.isArray(startTimeArray) || !Array.isArray(endTimeArray)) {
      return { formattedDate: "Invalid Date", formattedStartTime: "Invalid Time", formattedEndTime: "Invalid Time" };
    }

    const [year, month, day] = dateArray;
    const [startHour, startMinute] = startTimeArray;
    const [endHour, endMinute] = endTimeArray;

    // Format date
    const formattedDate = dayjs(new Date(year, month - 1, day)).format("DD MMM YYYY");

    // Format start and end time
    const formatTime = (hour, minute) => dayjs().hour(hour).minute(minute).format("hh:mm A");

    const formattedStartTime = formatTime(startHour, startMinute);
    const formattedEndTime = formatTime(endHour, endMinute);

    return { formattedDate, formattedStartTime, formattedEndTime };
  };

  return (
    <Box
    sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: -1, // Keep it behind other elements
        }}
    >
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        Available Appointment Slots
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Time</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.length > 0 ? (
                slots.map((slot) => {
                  const { formattedDate, formattedStartTime, formattedEndTime } = formatDateTime(
                    slot.date,
                    slot.startTime,
                    slot.endTime
                  );

                  return (
                    <TableRow key={slot.id}>
                      <TableCell align="center">{formattedDate}</TableCell>
                      <TableCell align="center">{formattedStartTime} - {formattedEndTime}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" sx={{ backgroundColor: "#9575cd", color: "white", "&:hover": { backgroundColor: "#3A0066" } }} color="#4B0082" onClick={() => handleBook(slot.id)}>
                          Book Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No available slots</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
    </Box>
  );
};

export default Home;
