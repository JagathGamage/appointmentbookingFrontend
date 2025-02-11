import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import BookAppointment from "./components/BookAppointment";
import MyAppointments from "./components/MyAppointments";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import AdminPanel from "./components/AdminPanel";
import { AppBar, Toolbar, Button, Typography, Container } from "@mui/material";

// Check authentication status
const isAuthenticated = () => !!localStorage.getItem("token");

// Get user role
const getUserRole = () => localStorage.getItem("role");

// Protected Route Wrapper
const ProtectedRoute = ({ element, allowedRoles }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to={userRole === "ADMIN" ? "/admin" : "/"} />;

  return element;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [role, setRole] = useState(getUserRole());

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setRole(getUserRole());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setLoggedIn(false);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: "#9575cd" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Appointment Booking
          </Typography>

          {loggedIn ? (
            <>
              {role === "USER" && (
                <>
                  <Button color="inherit" href="/myappointments">My Appointments</Button>
                  <Button color="inherit" href="/">Home</Button>
                </>
              )}
              {role === "ADMIN" && <Button color="inherit" href="/admin">Admin Panel</Button>}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" href="/login">Login</Button>
              <Button color="inherit" href="/signup">Signup</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          {/* Redirect Admins trying to access User pages */}
          <Route path="/" element={role === "ADMIN" ? <Navigate to="/admin" /> :role ==="USER"?  <Home />:<Navigate to="/login" />} />
          <Route path="/myappointments" element={<ProtectedRoute element={<MyAppointments />} allowedRoles={["USER"]} />} />
          <Route path="/book-appointment/:appointmentId" element={<ProtectedRoute element={<BookAppointment />} allowedRoles={["USER"]} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={["ADMIN"]} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setRole={setRole} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
