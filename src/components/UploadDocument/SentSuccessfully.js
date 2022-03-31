import React, { useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import WebViewer from "@pdftron/webviewer";

export default function SentSuccessfully() {
    const viewer = useRef(null);
    useEffect(() => {
        WebViewer(
          {
            path: "/webviewer/lib",
            initialDoc: "/files/itworked.pdf",
          },
          viewer.current
        ).then((instance) => {
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
          
        });
      }, []);

  return (
    <div>
        <p className="signedandsentupload"> Sent Successfully! </p>
            <Link to="/">
            <p className="signedandsentupload2"> Go to Home page </p>
            </Link>

            <div className="webviewer" ref={viewer}></div>
    </div>
  )
}
