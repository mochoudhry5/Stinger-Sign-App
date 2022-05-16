import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation add_UserInfo(
    $userEmail: String!
    $userFirstName: String!
    $userLastName: String!
    $userPassword: String!
    $userCompany: String!
    $userJobTitle: String!
    $userProfilePicture: String!
  ) {
    add_UserInfo(
      syncMode: NODE_LEDGERED
      input: {
        userEmail: $userEmail
        userFirstName: $userFirstName
        userLastName: $userLastName
        userPassword: $userPassword
        userCompany: $userCompany
        userJobTitle: $userJobTitle
        userProfilePicture: $userProfilePicture
      }
    ) {
      transaction {
        version
        _id
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation remove_UserInfo($id: ID!) {
    remove_UserInfo(id: $id syncMode: NODE_LEDGERED) {
      transaction {
        _id
      }
    }
  }
`;

export const ADD_FILE_TO_VENDIA = gql`
  mutation addVendia_File(
    $sourceBucket: String!
    $sourceKey: String!
    $sourceRegion: String!
    $destinationKey: String!
  ) {
    addVendia_File(
      syncMode: NODE_LEDGERED
      input: {
        sourceBucket: $sourceBucket
        sourceKey: $sourceKey
        sourceRegion: $sourceRegion
        destinationKey: $destinationKey
      }
    ) {
      transaction {
        _id
      }
    }
  }
`;

export const UPDATE_DOCS_SENT_FOR_USER = gql`
  mutation update_UserInfo(
    $id: ID!
    $documentsSentInfo: [Self_UserInfo_documentsSent_documentsSentInfo_documentsSentInfoItem_UpdateInput_]
  ) {
    update_UserInfo(
      id: $id
      syncMode: NODE_LEDGERED
      input: { documentsSent: { documentsSentInfo: $documentsSentInfo } }
    ) {
      transaction {
        _id
      }
    }
  }
`;

export const UPDATE_DOCS_TO_SIGN_FOR_USER = gql`
  mutation update_UserInfo(
    $id: ID!
    $documentsToSignInfo: [Self_UserInfo_documentsToSign_documentsToSignInfo_documentsToSignInfoItem_UpdateInput_]
  ) {
    update_UserInfo(
      id: $id
      syncMode: NODE_LEDGERED
      input: { documentsToSign: { documentsToSignInfo: $documentsToSignInfo } }
    ) {
      transaction {
        _id
      }
    }
  }
`;

export const DELETE_FILE_VENDIA = gql`
  mutation removeVendia_File($id: ID!, $syncMode: Vendia_SyncMode!) {
    removeVendia_File(id: $id, syncMode: $syncMode) {
      transaction {
        _id
      }
    }
  }
`;

export const UPDATE_FILE = gql`
  mutation updateVendia_File($id: ID!, $syncMode: Vendia_SyncMode!) {
    updateVendia_File(id: $id, input: {}, syncMode: $syncMode) {
      transaction {
        _id
      }
    }
  }
`;

export const UPDATED_USER_INFO = gql`
  mutation update_UserInfo(
    $id: ID!
    $userEmail: String!
    $userCompany: String!
    $userJobTitle: String!
  ) {
    update_UserInfo(
      id: $id
      syncMode: NODE_LEDGERED
      input: {
        userEmail: $userEmail
        userCompany: $userCompany
        userJobTitle: $userJobTitle
      }
    ) {
      transaction {
        _id
      }
    }
  }
`;
