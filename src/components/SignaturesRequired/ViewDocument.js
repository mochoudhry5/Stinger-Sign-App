import React, { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ViewDocument() {
  const location = useLocation();
  const blobData = location.state.blobData;
  const pdfName = location.state.pdfName;
  const redirect = location.state.redirect;
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
      },
      viewer.current
    ).then((instance) => {
      console.log(blobData);
      console.log(pdfName);
      instance.UI.loadDocument(blobData, { filename: pdfName });
      instance.UI.setTheme("dark");
      instance.UI.disableElements(["toolbarGroup-Shapes"]);
      instance.UI.disableElements(["toolbarGroup-Edit"]);
      instance.UI.disableElements(["toolbarGroup-Insert"]);
      instance.UI.disableElements(["toolbarGroup-Annotate"]);
      instance.UI.disableElements(["toolbarGroup-Forms"]);
      instance.UI.disableElements(["toolbarGroup-FillAndSign"]);
      instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.VIEW);
    });
  }, [blobData, pdfName]);

  return (
    <div>
      <Link
        className="upload-docs"
        to={{
          pathname: redirect,
          state: { pdfName: "placeholder", fileData: "placeholder" },
        }}
      >
        <span className="backclick5"> &lt;Back&nbsp;</span>
      </Link>
      <span className="title-view">Document Viewer</span>
      <div className="webviewer-view" ref={viewer}></div>
    </div>
  );
}
