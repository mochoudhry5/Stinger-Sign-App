import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_SENT_INFO_DOCS_TO_SIGN,
  LIST_ALL_FILES,
} from "../../Graphql/Query";
import { Link } from "react-router-dom";

function ReqSignatures() {
  const [count, setCount] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const { data: data2, loading: loading2 } = useQuery(LIST_ALL_FILES);
  const { data, loading, refetch } = useQuery(GET_SENT_INFO_DOCS_TO_SIGN, {
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
          }
        );
      }
    }
  }, [data]);

  if (loading) return <div> Loading...</div>;

  if (loading2) return <div> Loading...</div>;

  return (
    <Link
      className="upload-docs"
      to={{
        pathname: "/nav/signdocuments",
        state: { fileData: data2 },
      }}
    >
      <div className="titles">
        Signatures Required - <span className="red-sigreq"> {count} </span>
      </div>
    </Link>
  );
}
export default ReqSignatures;
