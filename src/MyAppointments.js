import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userEmail || !token) {
      console.error("User email or token missing");
      return;
    }

    axios
      .get(`http://localhost:8080/api/appointments/user/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setAppointments(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error.response?.data || error);
      });
  }, [userEmail, token]);

  // ✅ Function to format API date and time arrays
  const formatDateTime = (dateArray, startTimeArray, endTimeArray) => {
    if (!Array.isArray(dateArray) || !Array.isArray(startTimeArray) || !Array.isArray(endTimeArray)) {
      return { formattedDate: "Invalid Date", formattedStartTime: "Invalid Time", formattedEndTime: "Invalid Time" };
    }

    const [year, month, day] = dateArray;
    const [startHour, startMinute] = startTimeArray;
    const [endHour, endMinute] = endTimeArray;

    const appointmentDate = new Date(year, month - 1, day); // Month is 0-based in JS

    // Format the date
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(appointmentDate);

    // Format start and end time
    const formatTime = (hour, minute) =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(0, 0, 0, hour, minute));

    const formattedStartTime = formatTime(startHour, startMinute);
    const formattedEndTime = formatTime(endHour, endMinute);

    return { formattedDate, formattedStartTime, formattedEndTime };
  };

  const cancelAppointment = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/appointments/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      alert("Appointment cancelled");
    } catch (error) {
      console.error("Error cancelling appointment:", error.response?.data || error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}>
        My Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
          No appointments found.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {appointments.map((appt) => {
            const { formattedDate, formattedStartTime, formattedEndTime } = formatDateTime(appt.date, appt.startTime, appt.endTime);

            return (
              <Card key={appt.id} sx={{ p: 2, borderRadius: 2, boxShadow: 3 ,width:'80%',}}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    {formattedDate}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: "1.1rem",
                      color: "#555",
                    }}
                  >
                    <AccessTimeIcon fontSize="small" /> {formattedStartTime} - {formattedEndTime}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => cancelAppointment(appt.id)}
                  >
                    Cancel Appointment
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default MyAppointments;
