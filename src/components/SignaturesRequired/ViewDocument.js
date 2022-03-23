import React, { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import { Link } from "react-router-dom";

export default function ViewDocument() {
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/stingerintro.pdf",
      },
      viewer.current
    ).then((instance) => {
      instance.UI.setTheme("dark");
      instance.UI.disableElements(["toolbarGroup-Shapes"]);
      instance.UI.disableElements(["toolbarGroup-Edit"]);
      instance.UI.disableElements(["toolbarGroup-Insert"]);
      instance.UI.disableElements(["toolbarGroup-Annotate"]);
      instance.UI.disableElements(["toolbarGroup-Forms"]);
      instance.UI.disableElements(["toolbarGroup-FillAndSign"]);
      instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.VIEW);
    });
  }, []);

  return (
    <div>
      <Link
        className="upload-docs"
        to={{
          pathname: "/nav/signdocuments",
          state: { pdfName: "placeholder", fileData: "placeholder" },
        }}
      >
        <span className="backclick"> &lt;Back</span>
      </Link>
      <span className="title-sends">View Document</span>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
}
