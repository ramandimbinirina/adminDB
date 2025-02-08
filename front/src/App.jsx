// import InscriptionTable from "./components/inscriptionsTable.jsx";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Button, Box } from "@mui/material";
import Connexion from "./pages/authentification/connexion.jsx";
import Inscription from "./pages/authentification/inscription.jsx";

function App() {
  return (
    <Router>
            <Container maxWidth="sm">
                <Box display="flex" justifyContent="center" mt={3} gap={2}>
                    <Button variant="outlined" component={Link} to="/login">
                        Connexion
                    </Button>
                    <Button variant="outlined" component={Link} to="/register">
                        Inscription
                    </Button>
                </Box>

                <Routes>
                    <Route path="/login" element={<Connexion />} />
                    <Route path="/register" element={<Inscription />} />
                </Routes>
            </Container>
        </Router>
  );
}

export default App;
