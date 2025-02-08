import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getInscriptions = async () => {
    const res = await axios.get(`${API_URL}/inscriptions`);
    return res.data;
};
