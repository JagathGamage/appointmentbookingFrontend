import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, Snackbar, Alert, Box } from "@mui/material";
import bgImage from "../assets/bg.jpg"; 
const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ date: "", startTime: "", endTime: "" });
  const [editingId, setEditingId] = useState(null);
  const [editedAppointment, setEditedAppointment] = useState({ date: "", startTime: "", endTime: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/appointments/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedAppointments = response.data.map((appointment) => {
        const { id, date, startTime, endTime, scheduled, user } = appointment;
        const formattedDate = new Date(date[0], date[1] - 1, date[2]);

        return {
          id,
          date: formattedDate.toISOString().split("T")[0],
          startTime: `${startTime[0].toString().padStart(2, "0")}:${startTime[1].toString().padStart(2, "0")}`,
          endTime: `${endTime[0].toString().padStart(2, "0")}:${endTime[1].toString().padStart(2, "0")}`,
          status: scheduled ? "Scheduled" : "Pending",
          userName: scheduled && user ? user.name : "-",
          userEmail: scheduled && user ? user.email : "-",
        };
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const handleAddAppointment = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/appointments/admin/add`,
        newAppointment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
      setNewAppointment({ date: "", startTime: "", endTime: "" });
      setErrorMessage("");
      alert("Appointment added successfully");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
        setOpenSnackbar(true);
      } else {
        console.error("Error adding appointment", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/appointments/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment", error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setEditedAppointment({
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/appointments/admin/update/${id}`,
        editedAppointment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchAppointments();
    } catch (error) {
      setErrorMessage(error.response.data);
      setOpenSnackbar(true);
      console.error("Error updating appointment", error);
    }
  };

  return (
    <Box sx={{
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
        }}>
    <Box display="flex" padding="20px" gap="40px" sx={{mt:15}}>
      {/* Form for adding new appointments */}
      <Paper style={{ padding: "20px", width: "45%", textAlign: "center"}}>
        <h3>Schedule New Appointment</h3>
        <TextField
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          style={{ marginBottom: "20px" }}
          required
          
        />
        <TextField
          label="Start Time"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newAppointment.startTime}
          onChange={(e) => setNewAppointment({ ...newAppointment, startTime: e.target.value })}
          style={{ marginBottom: "20px" }}
          required
        />
        <TextField
          label="End Time"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newAppointment.endTime}
          onChange={(e) => setNewAppointment({ ...newAppointment, endTime: e.target.value })}
          style={{ marginBottom: "10px" }}
          required
        />
        <Button variant="contained" color="primary" onClick={handleAddAppointment} style={{ marginTop: "20px" }}>
          Add Appointment
        </Button>
      </Paper>

      {/* Table displaying appointments */}
      <Box flex={1}>
        <TableContainer component={Paper} style={{ width: "100%", maxHeight: "400px",maxWidth:"900px", overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>
                    {editingId === appointment.id ? (
                      <TextField
                        type="date"
                        value={editedAppointment.date}
                        onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
                      />
                    ) : (
                      appointment.date
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === appointment.id ? (
                      <TextField
                        type="time"
                        value={editedAppointment.startTime}
                        onChange={(e) => setEditedAppointment({ ...editedAppointment, startTime: e.target.value })}
                      />
                    ) : (
                      appointment.startTime
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === appointment.id ? (
                      <TextField
                        type="time"
                        value={editedAppointment.endTime}
                        onChange={(e) => setEditedAppointment({ ...editedAppointment, endTime: e.target.value })}
                      />
                    ) : (
                      appointment.endTime
                    )}
                  </TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{appointment.userName}</TableCell>
                  <TableCell>{appointment.userEmail}</TableCell>
                  <TableCell>
                    <Box display="flex" gap="10px">
                      {editingId === appointment.id ? (
                        <>
                          <Button variant="contained" color="primary" onClick={() => handleSaveEdit(appointment.id)}>
                            Save
                          </Button>
                          <Button variant="contained" color="secondary" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="contained" color="secondary" onClick={() => handleDelete(appointment.id)}>
                            Delete
                          </Button>
                          <Button variant="contained" color="primary" onClick={() => handleEdit(appointment)}>
                            Edit
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Snackbar for error messages */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
    </Box>
  );
};

export default AdminPanel;
