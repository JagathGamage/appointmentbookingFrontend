import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ loggedIn, role, handleLogout }) => {
  const navigate = useNavigate(); // ✅ Safe to use here since it's inside Router

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Appointment Booking
        </Typography>

        {loggedIn ? (
          <>
            {role === "USER" && (
              <>
                <Button color="inherit" onClick={() => navigate("/myappointments")}>My Appointments</Button>
                <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
              </>
            )}
            {role === "ADMIN" && (
              <Button color="inherit" onClick={() => navigate("/admin")}>Admin Panel</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            <Button color="inherit" onClick={() => navigate("/signup")}>Signup</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
