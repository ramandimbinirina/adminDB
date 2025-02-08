const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestion_inscription"
});

// Vérification de la connexion
db.connect(err => {
    if (err) throw err;
    console.log("Connecté à la base de données !");
});

// Route pour récupérer les inscriptions
app.get("/api/inscriptions", (req, res) => {
    db.query("SELECT * FROM inscription", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


// Ajouter une inscription
app.post("/api/inscriptions", (req, res) => {
    const { matricule, nom, droit_inscription } = req.body;
    db.query("INSERT INTO inscription (matricule, nom, droit_inscription) VALUES (?, ?, ?)",
        [matricule, nom, droit_inscription],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Inscription ajoutée !" });
        }
    );
});

// Supprimer une inscription
app.delete("/api/inscriptions/:id", (req, res) => {
    const { id } = req.params;
    console.log("ID reçu pour suppression :", id); // 🔍 Vérification ID
    db.query("DELETE FROM inscription WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Résultat SQL :", result); // 🔍 Vérification du résultat SQL
        res.json({ message: "Inscription supprimée !" });
    });
});


app.listen(5000, () => console.log("Serveur backend sur http://localhost:5000"));


app.put("/api/inscription/:id", (req, res) => {
    const { id } = req.params; // Récupérer l'ID depuis l'URL
    const { matricule, nom, droit_inscription } = req.body; // Récupérer les données envoyées par le frontend

    if (!matricule || !nom || !droit_inscription) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const query = "UPDATE inscription SET matricule = ?, nom = ?, droit_inscription = ? WHERE id = ?";

    db.query(query, [matricule, nom, droit_inscription, id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la modification :", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Inscription non trouvée" });
        }

        res.json({ message: "Inscription mise à jour avec succès !" });
    });
});