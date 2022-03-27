import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_SENT_INFO_DOCS_TO_SIGN,
  LIST_ALL_FILES,
} from "../../Graphql/Query";
import { Link } from "react-router-dom";

function ReqSignatures(props) {
  const [count, setCount] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const { data: data2 } = useQuery(LIST_ALL_FILES);
  const { data, loading } = useQuery(GET_SENT_INFO_DOCS_TO_SIGN, {
    variables: {
      id: loggedIn,
    },
  });


  useEffect(() => {
    console.log("USE EFFECT -> ReqSignatures");

    if (data) {
      if (data.get_UserInfo.documentsToSign) {
        data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            if (!document.isSigned) {
              setCount((count) => count + 1);
            }
            return null;
          }
        );
      }
    }
  }, [data]);

  return (
    <Link
      className="upload-docs"
      to={{
        pathname: "/nav/signdocuments",
        state: { fileData: data2 },
      }}
    >
      <div className="titles">
        <span> Signatures Required - </span>
        {!loading ? <span className="red-sigreq"> {count} </span> : null}
      </div>
    </Link>
  );
}
export default ReqSignatures;
