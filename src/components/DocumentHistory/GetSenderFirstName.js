import React from 'react'
import { USER_INFO_BASIC } from "../../Graphql/Query";
import { useQuery } from "@apollo/client";

export default function GetSenderFirstName(props) {
    const { data } = useQuery(USER_INFO_BASIC, {
        variables: {
          id: props.fromWho,
        },
      });

  return (
    <>
    {data ? (
    <div>{data.get_UserInfo.userFirstName} {data.get_UserInfo.userLastName}</div>
    ) : <div> Loading... </div>}
    </>
  )
}
