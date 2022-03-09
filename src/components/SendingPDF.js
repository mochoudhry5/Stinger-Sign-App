import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "../styles/pdfstyle.css";
import "../styles/sendingpdf.css";
import SendToBucketAndUser from "./SendToBucketAndUser";
import { ALL_USERS } from "../Graphql/Query";
import { useQuery } from "@apollo/client";

const initialValues = {
  email: "",
};

export default function SendingPDF(props) {
  const [userEmail, setUserEmail] = useState([]);
  const [formValue, setFormValue] = useState(initialValues);
  const [error, setError] = useState();
  const { data } = useQuery(ALL_USERS);
  const [id, setId] = useState([]);
  const viewer = useRef(null);
  const [f, setFile] = useState({});

  useEffect(() => {
    if (localStorage.getItem("emails")) {
      setUserEmail(JSON.parse(localStorage.getItem("emails")));
    }
  }, []);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/stingerintro.pdf",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;
      const { Feature } = instance.UI;
      instance.UI.enableFeatures([Feature.FilePicker]);
      instance.UI.setTheme("dark");
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          text: "Send",
          onClick: async () => {
            const filename = getRandomString(10);
            const doc = documentViewer.getDocument();
            const xfdfString = await annotationManager.exportAnnotations();
            const data = await doc.getFileData({ xfdfString });
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: "application/pdf" });
            const file = new File([blob], filename, {
              type: "application/pdf",
            });
            setFile(file);
          },
        });
      });
    });
  }, []);

  const handleChange = (e) => {
    setError("")
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const checker = (value) => {
    let temp = "";
    data.list_UserInfoItems._UserInfoItems.map((item) => {
      if (item.userEmail.toLowerCase() === value.toLowerCase()) {
        temp = item._id;
      }
    });

    if (temp) {
      return temp;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formValue.email !== "" &&
      userEmail.indexOf(formValue.email.toLowerCase()) <= -1
    ) {
      const newId = checker(formValue.email);
      if (id && newId) {
        setId([...id, newId]);
        localStorage.setItem("ids", JSON.stringify([...id, newId]));
        setUserEmail([...userEmail, formValue.email]);
        localStorage.setItem(
          "emails",
          JSON.stringify([...userEmail, formValue.email])
        );
      } else {
        setError("User not found!");
      }
    }
    setFormValue(initialValues);
  };

  function getRandomString(length) {
    var randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "sentDocs_";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    result += ".pdf";
    return result;
  }

  const handleRemove = (e) => {
    let temp = userEmail;
    const email = e.target.getAttribute("email");
    const filteredItems = temp.filter((item) => item !== email);
    setUserEmail(filteredItems);

    localStorage.setItem("emails", JSON.stringify(filteredItems));
    let temp2 = id;
    const email2 = e.target.getAttribute("email");
    const idUser = checker(email2);
    const filteredItems2 = temp2.filter((item) => item !== idUser);
    setId(filteredItems2);
    localStorage.setItem("ids", JSON.stringify(filteredItems2));
  };

  return (
    <div>
      <div className="title-send">Upload and Send</div>
      <form onSubmit={handleSubmit}>
        <label className="email-header-send">Send to:</label>
        <input
          className="email-header"
          type="text"
          name="email"
          placeholder="Email"
          value={formValue.email}
          onChange={handleChange}
        />
        <p className="err-notfound"> {error} </p>
        <button className="button-adduser">Add user</button>
      </form>

      <div className="printemails">
        {userEmail.map((i) => {
          return (
            <div>
              <span> {i} </span>
              <span className="delete-button" email={i} onClick={handleRemove}>
              ❌
              </span>
              <br />
            </div>
          );
        })}
      </div>

      <div className="webviewer" ref={viewer}></div>
      {id.length > 0 && f.name !== undefined ? (
        <SendToBucketAndUser file={f} ids={id} />
      ) : (
        <div className="savedoc"> (Click Save on Document and Add Users) </div>
      )}
    </div>
  );
}
