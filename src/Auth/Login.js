import { useState } from "react";
import { TextField, Button, Container, Typography, Card, CardContent, Box, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setLoggedIn, setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async () => {
    setError("");

    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

      // Store token and role in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);

      // Update App.js state for navbar changes
      setLoggedIn(true);
      setRole(response.data.role);

      // alert("Login successful!");

      // Redirect based on role
      navigate(response.data.role === "ADMIN" ? "/admin" : "/");

    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
