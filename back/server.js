const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" } // Remplacez par votre frontend
});

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestion_inscription"
});

// Vérification de la connexion MySQL
db.connect(err => {
    if (err) throw err;
    console.log("✅ Connecté à la base de données !");
});

/* -------------------- ROUTES POUR L'AUDIT -------------------- */

// Récupérer tous les logs d'audit
app.get("/api/audit", async (req, res) => {
    try {
        const query = "SELECT * FROM audit_inscription ORDER BY date_mise_a_jour DESC";
        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Récupérer les statistiques d'audit
app.get("/api/audit/stats", async (req, res) => {
    try {
        const query = `
            SELECT 
                SUM(type_action = 'ajout') AS total_ajout,
                SUM(type_action = 'modification') AS total_modification,
                SUM(type_action = 'suppression') AS total_suppression
            FROM audit_inscription;
        `;
        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result[0]);
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* -------------------- ROUTES POUR LES INSCRIPTIONS -------------------- */

// Récupérer toutes les inscriptions
app.get("/api/inscriptions", async (req, res) => {
    try {
        db.query("SELECT * FROM inscription", (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Ajouter une inscription
app.post("/api/inscriptions", async (req, res) => {
    try {
        const { matricule, nom, droit_inscription } = req.body;
        const query = "INSERT INTO inscription (matricule, nom, droit_inscription) VALUES (?, ?, ?)";
        
        db.query(query, [matricule, nom, droit_inscription], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            io.emit("auditUpdated"); // ⚡ Notification en temps réel
            res.json({ message: "✅ Inscription ajoutée avec succès !" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Modifier une inscription
app.put("/api/inscriptions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { matricule, nom, droit_inscription } = req.body;
        const query = "UPDATE inscription SET matricule = ?, nom = ?, droit_inscription = ? WHERE id = ?";

        db.query(query, [matricule, nom, droit_inscription, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            io.emit("auditUpdated"); // ⚡ Notification en temps réel
            res.json({ message: "✅ Inscription mise à jour !" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Supprimer une inscription
app.delete("/api/inscriptions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM inscription WHERE id = ?";

        db.query(query, [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            io.emit("auditUpdated"); // ⚡ Notification en temps réel
            res.json({ message: "✅ Inscription supprimée !" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* -------------------- ACTIVATION DES TRIGGERS MYSQL -------------------- */

const triggerInsert = `
CREATE TRIGGER after_inscription_insert
AFTER INSERT ON inscription
FOR EACH ROW
INSERT INTO audit_inscription (type_action, matricule, nom, droit_nouv, utilisateur)
VALUES ('ajout', NEW.matricule, NEW.nom, NEW.droit_inscription, 'admin');
`;

const triggerUpdate = `
CREATE TRIGGER after_inscription_update
AFTER UPDATE ON inscription
FOR EACH ROW
INSERT INTO audit_inscription (type_action, matricule, nom, droit_ancien, droit_nouv, utilisateur)
VALUES ('modification', OLD.matricule, OLD.nom, OLD.droit_inscription, NEW.droit_inscription, 'admin');
`;

const triggerDelete = `
CREATE TRIGGER after_inscription_delete
AFTER DELETE ON inscription
FOR EACH ROW
INSERT INTO audit_inscription (type_action, matricule, nom, droit_ancien, utilisateur)
VALUES ('suppression', OLD.matricule, OLD.nom, OLD.droit_inscription, 'admin');
`;

const activateTriggers = () => {
    db.query("DROP TRIGGER IF EXISTS after_inscription_insert");
    db.query("DROP TRIGGER IF EXISTS after_inscription_update");
    db.query("DROP TRIGGER IF EXISTS after_inscription_delete");

    db.query(triggerInsert, err => {
        if (err) console.error("❌ Erreur Trigger INSERT:", err);
    });
    db.query(triggerUpdate, err => {
        if (err) console.error("❌ Erreur Trigger UPDATE:", err);
    });
    db.query(triggerDelete, err => {
        if (err) console.error("❌ Erreur Trigger DELETE:", err);
    });

    console.log("✅ Triggers MySQL activés avec succès !");
};

// Activation des triggers au démarrage
activateTriggers();

/* -------------------- SOCKET.IO -------------------- */

io.on("connection", (socket) => {
    console.log("🟢 Un client est connecté !");
    socket.on("disconnect", () => {
        console.log("🔴 Un client s'est déconnecté !");
    });
});

/* -------------------- DÉMARRAGE DU SERVEUR -------------------- */

server.listen(5000, () => {
    console.log("🚀 Serveur backend en ligne sur http://localhost:5000");
});


//recuperatiion modification
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