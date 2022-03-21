import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SENT_INFO_DOCS_TO_SIGN, LIST_ALL_FILES } from "../../Graphql/Query";
import {Link} from "react-router-dom"

function ReqSignatures() {
  const [numDocs, setNumDocs] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const {data: data2, loading: loading2, error: error2} = useQuery(LIST_ALL_FILES)
  const { data, loading, refetch } = useQuery(GET_SENT_INFO_DOCS_TO_SIGN, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    refetch();
    updateNumDocs();
  });

  if (loading) (
    <div> Loading...</div>
  )

  if (loading2) (
    <div> Loading...</div>
  )

  const updateNumDocs = () => {
    if (data.get_UserInfo.documentsToSign)
      setNumDocs(data.get_UserInfo.documentsToSign.documentsToSignInfo.length);
  };

  return (
    <Link className = "upload-docs" 
    to={{
      pathname: "/nav/signdocuments",
      state: { fileData: data2 },
    }} >
    <div className="titles">
      Signatures Required - <span className="red-sigreq"> {numDocs} </span>
    </div>
    </Link>
  );
}
export default ReqSignatures;
