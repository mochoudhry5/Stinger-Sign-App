import {gql } from "@apollo/client";


export const ADD_USER = gql`
  mutation add_UserInfo_async($userEmail: String!, $userFirstName: String!, $userLastName: String!, $userPassword: String!, $userCompany: String!, $userJobTitle: String!) {
    add_UserInfo_async(input: {
      userEmail: $userEmail, userFirstName: $userFirstName, 
      userLastName: $userLastName, userPassword: $userPassword,
      userCompany: $userCompany, userJobTitle: $userJobTitle}){ 
      result {
        _id
      }
    }
  }
`
