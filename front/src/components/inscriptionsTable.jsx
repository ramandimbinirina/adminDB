import { useState, useEffect } from "react";
import axios from "axios";
import "./inscriptionsTable.css";
import Stack from '@mui/material/Stack'; // Import is not used. Remove if not needed elsewhere.
import { green } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add'; // Import specific icon
import IconButton from '@mui/material/IconButton';
import Swal from "sweetalert2";


const API_URL = "http://localhost:5000/api/inscriptions";
// const API_URLa = "http://localhost:5000/api/inscription";

function InscriptionTable() {
  const [inscriptions, setInscriptions] = useState([]);
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [droitInscription, setDroitInscription] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Renamed for clarity
  const [editingInscriptionId, setEditingInscriptionId] = useState(null); // Renamed for clarity
  const [showModal, setShowModal] = useState(false); // More descriptive name

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { matricule, nom, droit_inscription: droitInscription }).then( (result)=>{
        Swal.fire(
          {
            title: 'Ajout!',
            text: 'Inscription ajoutee avec succes',
            icon:'success',
            timer: 2000
          }
        )
        fetchInscriptions();
        resetForm();
        handleCloseModal(); // Close the modal after adding
      }

      )
     
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
      
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!matricule || !nom || !droitInscription) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${editingInscriptionId}`, {
        matricule,
        nom,
        droit_inscription: Number(droitInscription),
      }).then( (result)=>{
        fetchInscriptions();
         
      resetForm();
      setIsEditing(false);
      setEditingInscriptionId(null);
      handleCloseModal(); // Close the modal after editing
      Swal.fire(
          {
            title: 'Modification!',
            text: 'Inscription modifie avec succes',
            icon:'success',
            timer: 2000
          }
        )

      console.log("Réponse serveur :", response.data);
   
      })
    } catch (error) {
      console.error("Erreur lors de la modification", error);
    }
  };

  const handleDelete =  (id) => {

    Swal.fire({
      width : 450,
      icon : "question",
      title: 'Suppression!',
      text: 'Voullez vous vraiment supprimer cette inscription?',
      timer: 5000,
      showCancelButton : true,
      showConfirmButton : true,
      confirmButtonColor : "#ff0000",
      cancelButtonColor : "grey",
      confirmButtonText : "Supprimer",
      cancelButtonText : "Annuler",
    }).then((result)=>{
      if(result.isConfirmed){
        const response = axios.delete(`${API_URL}/${id}`);
        console.log("Réponse serveur :", response.data);
        fetchInscriptions();

      }

    })
  };

  const handleEditClick = (etudiant) => {
    setIsEditing(true);
    setEditingInscriptionId(etudiant.id);
    setMatricule(etudiant.matricule);
    setNom(etudiant.nom);
    setDroitInscription(etudiant.droit_inscription);
    handleShowModal(); // Open the modal for editing
  };

  const resetForm = () => {
    setMatricule("");
    setNom("");
    setDroitInscription("");
  };

  return (
    <div className="audit-container">
      <div className="row">
        <div className="col">
        <IconButton onClick={handleShowModal} aria-label="add"> {/* Use IconButton */}
            <AddIcon sx={{ color: green[500] }} /> {/* Use specific icon */}
          </IconButton>

          {/* Modal Bootstrap */}
          <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" style={{ background: showModal ? "rgba(0, 0, 0, 0.5)" : "transparent" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Modifier l'élément" : "Ajouter un nouvel élément"}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>

                <div className="modal-body">
                  <form className="form-control" onSubmit={isEditing ? handleEdit : handleAdd}> {/* Use conditional submit handler */}
                    <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <input type="number" className="form-control" placeholder="Droit d'inscription" value={droitInscription} onChange={(e) => setDroitInscription(e.target.value)} required />
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                        Fermer
                      </button>
                      <button type="submit" className={`btn btn-${isEditing ? "success" : "primary"}`}>
                        {isEditing ? "Modifier" : "Ajouter"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <table border="1" className="audit-table">
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
                    <button className="btn bg-success text-white" onClick={() => handleEditClick(etudiant)}>
                      Modifier
                    </button>
                    <button className="btn offset-1 bg-danger text-white" onClick={() => handleDelete(etudiant.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InscriptionTable;