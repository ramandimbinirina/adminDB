import { useEffect, useState } from "react";
import axios from "axios";

const AuditTable = () => {
  const [audits, setAudits] = useState([]);
  const [stats, setStats] = useState({ ajout: 0, modification: 0, suppression: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/audit").then((res) => setAudits(res.data));
    axios.get("http://localhost:5000/api/audit/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <h2>Audit des Inscriptions</h2>
      <table>
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
              <td>{audit.date_mise_a_jour}</td>
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
      <p>Ajouts : {stats.total_ajout} | Modifications : {stats.total_modification} | Suppressions : {stats.total_suppression}</p>
    </div>
  );
};

export default AuditTable;
