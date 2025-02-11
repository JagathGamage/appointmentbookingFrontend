import { useState } from "react";
import { TextField, Button, Container, Typography, Card, CardContent, Box, Alert } from "@mui/material";
import axios from "axios";
import bgImage from "../assets/bg.jpg"; 

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        name,
        email,
        password,
      });
      setMessage("Signup successful! Please login.");
    } catch (error) {
      setError("Error signing up. Please try again.");
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
    <Container maxWidth="sm" sx={{mt:15}}>
      <Card sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <Button variant="contained" color="primary" fullWidth type="submit">
              Sign Up
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};

export default Signup;
