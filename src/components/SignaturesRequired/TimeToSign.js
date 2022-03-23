import React, {useEffect, useRef} from 'react'
import WebViewer from "@pdftron/webviewer";
import {Link} from "react-router-dom";

export default function TimeToSign(props) {
  const viewer = useRef(null);
  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/stingerintro.pdf",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;
      instance.UI.setTheme("dark");
      instance.UI.disableElements(['toolbarGroup-Shapes']);
      instance.UI.disableElements(['toolbarGroup-Edit']);
      instance.UI.disableElements(['toolbarGroup-Insert']);
      instance.UI.disableElements(['toolbarGroup-Annotate']);
      instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.FILL_AND_SIGN);
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: "https://www.seekpng.com/png/detail/395-3956812_save-file-button-save-button-logo-png.png",
          onClick: async () => {
            // const filename = getRandomString(10);
            const doc = documentViewer.getDocument();
            const xfdfString = await annotationManager.exportAnnotations();
            const data = await doc.getFileData({ xfdfString });
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: "application/pdf" });
            const file = new File([blob], "temp.pdf", {
              type: "application/pdf",
            });
            // setFile(file);
          },
        });
      });
    });
  }, []);
  return (
    <div>
       <Link
            className="upload-docs"
            to={{
              pathname: "/nav/signdocuments" ,
              state: { pdfName: props.pdfName, fileData: "HELO" },
            }}
          >
      <span className="backclick"> &lt;Back</span>
      </Link>
      <span className="title-sends">Sign Document</span>
       <div className="webviewer" ref={viewer}></div>
    </div>
  )
}

