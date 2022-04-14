import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  GET_DOCS_TO_SIGN_INFO,
  LIST_ALL_FILES,
} from "../../Graphql/Query";

function RequiredSignaturesHeader(props) {
  const [count, setCount] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const { data: data2 } = useQuery(LIST_ALL_FILES);
  const [getDocumentsToSign, { data, loading }] = useLazyQuery(
    GET_DOCS_TO_SIGN_INFO
  );

  useEffect(() => {
    let temp = 0;
    getDocumentsToSign({
      variables: {
        id: loggedIn,
      },
    });
    if (data) {
      if (data.get_UserInfo.documentsToSign) {
        data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            if (!document.isSigned) {
              temp = temp + 1;
              setCount(temp);
            }
          }
        );
      }
    }
  }, [data, loggedIn, getDocumentsToSign]);

  return (
    <Link
      className="upload-docs"
      to={{
        pathname: "/nav/signdocuments",
        state: { fileData: data2 },
      }}
    >
      <div className="titles">
        <span> Signatures Required →</span>
        {!loading ? <span className="red-sigreq"> {count} </span> : null}
      </div>
    </Link>
  );
}
export default RequiredSignaturesHeader;
