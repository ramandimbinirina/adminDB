import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/register";
const Inscription = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(API_URL, { username, email, password });

      setMessage("Inscription réussie ! Connectez-vous.");
    } catch (error) {
      setMessage("Échec de l'inscription !");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} textAlign="center">
        <Typography variant="h4">Inscription</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Nom d'utilisateur"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mot de passe"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleRegister}
        >
          S'inscrire
        </Button>
        <Typography mt={2}>{message}</Typography>
      </Box>
    </Container>
  );
};

export default Inscription;
