import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "../../styles/pdfstyle.css";
import "../../styles/sendingpdf.css";
import SendToBucketAndUser from "./SendToBucketAndUser";
import { ALL_USERS } from "../../Graphql/Query";
import { useQuery } from "@apollo/client";
import { GET_SENT_INFO, GET_SENT_INFO_DOCS_TO_SIGN } from "../../Graphql/Query";

const initialValues = {
  email: "",
};

const initValuesForFile = {
  nameOfFile: "",
};

export default function SettingUpPDF(props) {
  const [userEmail, setUserEmail] = useState([]);
  const [formValue, setFormValue] = useState(initialValues);
  const [fileName, setFileName] = useState([initValuesForFile]);
  const [isFilenameSubmit, setIsFilenameSubmit] = useState(false);
  const loggedIn = window.localStorage.getItem("state");
  const [prev, setPrev] = useState([]);
  const [prevToSign, setPrevToSign] = useState([]);
  const [error, setError] = useState();
  const { data } = useQuery(ALL_USERS);
  const [id, setId] = useState([]);
  const viewer = useRef(null);
  const [f, setFile] = useState({});
  let counter = 1;
  const { loading: l, data: d } = useQuery(GET_SENT_INFO, {
    variables: {
      id: loggedIn,
    },
  });
  const { loading: loading1, data: data1 } = useQuery(
    GET_SENT_INFO_DOCS_TO_SIGN,
    {
      variables: {
        id: loggedIn,
      },
    }
  );

  if (l) (<div>Loading...</div>);

  if (loading1) (<div>Loading...</div>);

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
      instance.UI.disableFeatures([Feature.TextSelection]);
      instance.UI.disableTools([
        "AnnotationCreateSticky",
        "AnnotationCreateFreeText",
      ]);
      instance.UI.setTheme("dark");
      instance.UI.disableElements(["toolbarGroup-Shapes"]);
      instance.UI.disableElements(["toolbarGroup-Edit"]);
      instance.UI.disableElements(["toolbarGroup-Insert"]);
      instance.UI.disableElements(["toolbarGroup-Annotate"]);
      instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.VIEW);
      instance.UI.enableFeatures([Feature.FilePicker]);
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: "https://www.seekpng.com/png/detail/395-3956812_save-file-button-save-button-logo-png.png",
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

  const setPrevFiles = () => {
    let tempArray = [];
    if (d.get_UserInfo.documentsSent) {
      d.get_UserInfo.documentsSent.documentsSentInfo.map((document) => {
        let tempObject = {};
        tempObject.pdfName = document.pdfName;
        tempObject.usersSentTo = document.usersSentTo;
        tempObject.timeSent = document.timeSent;
        tempObject.reasonForSigning = document.reasonForSigning;
        tempObject.isRejected = document.isRejected;
        tempArray.push(tempObject);
      });
    }
    setPrev(tempArray);
  };

  const setPrevToSignFiles = () => {
    let tempArray = [];
    if (data1.get_UserInfo.documentsToSign) {
      data1.get_UserInfo.documentsToSign.documentsToSignInfo.map((document) => {
        let tempObject = {};
        tempObject.pdfName = document.pdfName;
        tempObject.nextToSend = document.nextToSend;
        tempObject.timeOfSend = document.timeOfSend;
        tempObject.isSigned = document.isSigned;
        tempObject.fromWho = document.fromWho;
        tempObject.reasonForSigning = document.reasonForSigning;
        tempArray.push(tempObject);
      });
    }
    setPrevToSign(tempArray);
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

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value.trim() });
  };

  const handleChangeForFilename = (e) => {
    setError("");
    const { name, value } = e.target;
    setFileName({ ...fileName, [name]: value.substring(0, 15) });
  };

  const handleSubmitForFileName = (e) => {
    e.preventDefault();
    setIsFilenameSubmit(true);
    setPrevFiles();
    setPrevToSignFiles();
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
    setFormValue({ ...formValue, email: "" });
  };

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

  return (
    <div>
      <div className="title-send">Upload and Send</div>

      <form onSubmit={handleSubmitForFileName}>
        <label className="filename-header-send">Subject:</label>
        {!isFilenameSubmit ? (
          <>
            <input
              className="filename-header"
              type="text"
              name="nameOfFile"
              placeholder="Max. of 15 characters"
              value={fileName.nameOfFile}
              onChange={handleChangeForFilename}
            />
            <p className="err-notfound"> {error} </p>
            <button className="button-setfilename"> Submit</button>
          </>
        ) : (
          <>
            <input
              className="filename-header"
              disabled
              placeholder={fileName.nameOfFile}
            />
            <button disabled className="button-setfilename">
              {" "}
              Submit
            </button>
          </>
        )}
      </form>

      <form onSubmit={handleSubmit}>
        <label className="email-header-send">Send to:</label>
        {isFilenameSubmit ? (
          <>
            <input
              className="email-header"
              type="text"
              name="email"
              placeholder="Email"
              value={formValue.email}
              onChange={handleChange}
            />
            <p className="err-notfound"> {error} </p>
            <button className="button-setfilename"> Add user</button>
          </>
        ) : (
          <>
            <input
              className="email-header"
              type="text"
              disabled
              placeholder="Email"
            />
            <button disabled className="button-setfilename">
              {" "}
              Set File First
            </button>
          </>
        )}
      </form>

      <div className="printemails">
        {userEmail.map((i) => {
          return (
            <div>
              <span className="counter"> {counter++}. </span>
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
        <SendToBucketAndUser
          file={f}
          ids={id}
          prevFiles={prev}
          prevToSign={prevToSign}
          reason={fileName.nameOfFile}
        />
      ) : (
        <div className="savedoc"> (Click Save on Document and Add Users) </div>
      )}
    </div>
  );
}
