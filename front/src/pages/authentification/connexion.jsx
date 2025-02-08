import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/login";

const Connexion = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.get(API_URL, { email, password });
            localStorage.setItem("token", response.data.token);
            setMessage(`Bienvenue ${response.data.user.username} !`);
        } catch (error) {
            setMessage("Échec de connexion !");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box mt={5} textAlign="center">
                <Typography variant="h4">Connexion</Typography>
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
                <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
                    Se connecter
                </Button>
                <Typography mt={2}>{message}</Typography>
            </Box>
        </Container>
    );
};

export default Connexion;
