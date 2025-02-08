import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/inscriptions";
const API_URLa = "http://localhost:5000/api/inscription";

function InscriptionTable() {
  const [inscriptions, setInscriptions] = useState([]);
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [droitInscription, setDroitInscription] = useState("");
  const [edit,setEdit]= useState("");
  const [idInscription, setIdInscription] = useState(null);

  // Charger les inscriptions
  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    try {
      const res = await axios.get(API_URL);
      setInscriptions(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des inscriptions", error);
    }
  };

  // Ajouter une inscription
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { matricule, nom, droit_inscription: droitInscription });
      fetchInscriptions();
      setMatricule("");
      setNom("");
      setDroitInscription("");
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
    }
  };
  // modifier...............................
  const handelEdit = async (e) => {
    e.preventDefault();
    if (!matricule || !nom || !droitInscription) {
        alert("Tous les champs sont obligatoires !");
        return;
    }

    try {
        const response = await axios.put(`${API_URLa}/${idInscription}`, {
            matricule,
            nom,
            droit_inscription: Number(droitInscription) // Convertir en nombre
        });

        console.log("Réponse serveur :", response.data);
        fetchInscriptions(); // Recharger la liste après modification
        setEdit(false); // Désactiver le mode édition
        setMatricule("");
        setNom("");
        setDroitInscription("");
    } catch (error) {
        console.error("Erreur lors de la modification", error);
    }
};


  // Supprimer une inscription
  const handleDelete = async (id) => {
    console.log("ID à supprimer :", id); // Vérifie si l'ID est correct
    if (!id) {
      console.error("ID invalide pour la suppression");
      return;
    }
  
    const confirmation = window.confirm("Voulez-vous vraiment supprimer cette inscription ?");
    if (!confirmation) return;
  
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log("Réponse serveur :", response.data); // Vérifie la réponse du serveur
      fetchInscriptions(); // Met à jour la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Gestion des Inscriptions</h2>
      <form onSubmit={handelEdit}>
        <input type="text" placeholder="Matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required />
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input type="number" placeholder="Droit d'inscription" value={droitInscription} onChange={(e) => setDroitInscription(e.target.value)} required />
        {edit?
        <button type="submit" >modifier</button>:
        <button type="" onClick={handleAdd}>Ajouter</button>
      }

      </form>

      <table border="1">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Droit d'inscription (Ar)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inscriptions.map((etudiant) => (
            <tr key={etudiant.id}>
              <td>{etudiant.matricule}</td>
              <td>{etudiant.nom}</td>
              <td>{etudiant.droit_inscription} Ar</td>
              <td>
                <button onClick={() =>{setEdit('a');setIdInscription(etudiant.id);setMatricule(etudiant.matricule);setNom(etudiant.nom);setDroitInscription(etudiant.droit_inscription)}}>Modifier</button>
              </td>
              <td>
                <button onClick={() =>{handleDelete(etudiant.id)} }>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InscriptionTable;
