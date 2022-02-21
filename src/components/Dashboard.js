import ReqSignatures from "./ReqSignatures";
import UploadDocs from "./UploadDocs";
import ManageDoc from "./ManageDoc";

export default function Dashboard() {
  
  return (
    <div>
      <h1 className="titles" align="center"> The SIMPLE Dashboard</h1>
      <hr></hr>
      <ReqSignatures />
      <br />
      <hr></hr>
      <UploadDocs />
      <br />
      <hr></hr>
      <ManageDoc />
      <br />
      <hr></hr>
    </div>
  );
}
