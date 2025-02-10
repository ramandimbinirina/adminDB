import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./auditTable.css"; // Ajoutez un fichier CSS pour le style

const socket = io("http://localhost:5000");

const AuditTable = () => {
  const [audits, setAudits] = useState([]);
  const [stats, setStats] = useState({ total_ajout: 0, total_modification: 0, total_suppression: 0 });

  const fetchAuditData = async () => {
    try {
      const auditRes = await axios.get("http://localhost:5000/api/audit");
      setAudits(auditRes.data);

      const statsRes = await axios.get("http://localhost:5000/api/audit/stats");
      setStats(statsRes.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données d'audit :", error);
    }
  };

  useEffect(() => {
    fetchAuditData();

    socket.on("auditUpdated", () => {
      fetchAuditData();
    });

    return () => socket.off("auditUpdated");
  }, []);

  return (
    <div className="audit-container1">
      <div className="row">
        <div className="col">
        <h2>Audit des Inscriptions</h2>
          <table className="audit-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Ancien Droit</th>
                <th>Nouveau Droit</th>
                <th>Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit, index) => (
                <tr key={index}>
                  <td>{audit.type_action}</td>
                  <td>{new Date(audit.date_mise_a_jour).toLocaleString()}</td>
                  <td>{audit.matricule}</td>
                  <td>{audit.nom}</td>
                  <td>{audit.droit_ancien ?? "—"}</td>
                  <td>{audit.droit_nouv ?? "—"}</td>
                  <td>{audit.utilisateur}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Statistiques</h3>
          <div className="audit-stats">
            <p>Ajouts : {stats.total_ajout}</p>
            <p>Modifications : {stats.total_modification}</p>
            <p>Suppressions : {stats.total_suppression}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTable;
