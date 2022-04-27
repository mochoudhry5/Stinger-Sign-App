import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { USER_INFO_BASIC, LIST_ALL_FILES } from "../../Graphql/Query";
import { Link } from "react-router-dom";
import AWS from "aws-sdk";
import { S3Bucket } from "../../AWS/SecurityInfo";

export default function ShowAllDocsToSign(props) {
  const [link, setLink] = useState();
  const [blobData, setBlobData] = useState();
  const [fileID, setFileID] = useState("");
  const { data, loading, error } = useQuery(USER_INFO_BASIC, {
    variables: {
      id: props.senderID,
    },
  });
  const { loading: loading1, data: data1, refetch } = useQuery(LIST_ALL_FILES);

  useEffect(() => {
    console.log("USE EFFECT -> ShowAllDocsToSign");
    const s3 = new AWS.S3();
    let params = {
      Bucket: S3Bucket,
      Key: props.pdfName,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        const blob = new Blob([data.Body], { type: "application/pdf" });
        setBlobData(blob);
      }
    });

    if (data) {
      params = {
        Bucket: S3Bucket,
        Key: data.get_UserInfo.userProfilePicture,
      };
      new AWS.S3().getObject(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          let blob = new Blob([data.Body], { type: "image/*" });
          let tempLink = URL.createObjectURL(blob);
          setLink((link) => tempLink);
          console.log(link);
        }
      });
    }

    let fileId = "";
    refetch();
    data1.listVendia_FileItems.Vendia_FileItems.map((file) => {
      if (file.destinationKey === props.pdfName) {
        fileId = file._id;
      }
    });
    setFileID(fileId);
  }, [props.pdfName, data1, data]);

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;
  if (loading1) return <div></div>;

  return (
    <div>
      {data ? (
        <p className="toSignDocs">
          <img className="sig-reg-pic" src={link} alt="" />
          <br />
          &nbsp; Sender:
          <span className="headdoc">
            {" "}
            {data.get_UserInfo.userFirstName} {data.get_UserInfo.userLastName} (
            {data.get_UserInfo.userEmail}){" "}
          </span>
          <br />
          Sent When:
          <span className="headdoc"> {props.time} </span>
          <br /> Reason:
          <span className="headdoc"> {props.reason} </span>
          <br />
          <Link
            className="upload-docs"
            to={{
              pathname: "/nav/signdocuments/viewdocument",
              state: {
                pdfName: props.pdfName,
                blobData: blobData,
                redirect: "/nav/signdocuments",
              },
            }}
          >
            <button className="buttontoview"> View </button>
          </Link>
          <Link
            className="upload-docs"
            to={{
              pathname: "/nav/signdocuments/signaturetime",
              state: {
                pdfName: props.pdfName,
                blobData: blobData,
                fileID: fileID,
              },
            }}
          >
            <button className="buttontosign"> Sign </button>
          </Link>
          <Link
            className="upload-docs"
            to={{
              pathname: "/nav/signdocuments/rejectdocument",
              state: {
                pdfName: props.pdfName,
                senderID: props.senderID,
                fileID: fileID,
              },
            }}
          >
            <button className="buttontoreject"> Reject </button>
          </Link>
        </p>
      ) : null}
      <hr className="hr-sigreq" />
      <br />
      <br />
      <br />
    </div>
  );
}
