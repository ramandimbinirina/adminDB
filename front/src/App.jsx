import InscriptionTable from "./components/inscriptionsTable.jsx";
import AuditTable from "./components/auditTable.jsx";
import Menu from "./components/menu.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Menu/> <br /> <br />
      <InscriptionTable /> <br />
      <AuditTable/>
    </div>
  );
}

export default App;
