import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation add_UserInfo_async(
    $userEmail: String!
    $userFirstName: String!
    $userLastName: String!
    $userPassword: String!
    $userCompany: String!
    $userJobTitle: String!
  ) {
    add_UserInfo_async(
      input: {
        userEmail: $userEmail
        userFirstName: $userFirstName
        userLastName: $userLastName
        userPassword: $userPassword
        userCompany: $userCompany
        userJobTitle: $userJobTitle
      }
    ) {
      result {
        _id
      }
    }
  }
`;

export const ADD_FILE = gql`
  mutation addVendia_File_async(
    $sourceBucket: String!
    $sourceKey: String!
    $sourceRegion: String!
    $destinationKey: String!
  ) {
    addVendia_File_async(
      input: {
        sourceBucket: $sourceBucket
        sourceKey: $sourceKey
        sourceRegion: $sourceRegion
        destinationKey: $destinationKey
      }
    ) {
      error
    }
  }
`;

export const UPDATE_SENDER_INFO = gql`
  mutation update_UserInfo_async(
    $id: ID!
    $pdfName: String
    $usersSentTo: [String]
    $timeSent: String
  ) {
    update_UserInfo_async(
      id: $id
      input: {
        documentsSent: {
          documentsSentInfo: [
            {
              pdfName: $pdfName
              usersSentTo: $usersSentTo
              timeSent: $timeSent
            }
          ]
        }
      }
    ) {
      result {
        _id
      }
    }
  }
`;

export const DELETE = gql`
  mutation remove_UserInfo_async($id: ID!) {
    remove_UserInfo_async(id: $id) {
      result {
        _id
      }
    }
  }
`;

export const ADD_FILE_TO_VENDIA = gql`
  mutation addVendia_File_async(
    $sourceBucket: String!
    $sourceKey: String!
    $sourceRegion: String!
    $destinationKey: String!
  ) {
    addVendia_File_async(
      input: {
        sourceBucket: $sourceBucket
        sourceKey: $sourceKey
        sourceRegion: $sourceRegion
        destinationKey: $destinationKey
      }
    ) {
      result {
        _id
      }
    }
  }
`;

export const ADD_TO_USER_TOSIGN = gql`
  mutation update_UserInfo_async(
    $id: ID!
    $fromWho: String
    $isSigned: Boolean
    $pdfName: String
    $nextToSend: [String]
    $timeOfSend: String
  ) {
    update_UserInfo_async(
      id: $id
      input: {
        documentsToSign: {
          documentsToSignInfo: {
            fromWho: $fromWho
            isSigned: $isSigned
            pdfName: $pdfName
            nextToSend: $nextToSend
            timeOfSend: $timeOfSend
          }
        }
      }
    ) {
      result {
        _id
      }
    }
  }
`;

export const UPDATE_SENDER_INFO_ = gql`
  mutation update_UserInfo_async(
    $id: ID!
    $documentsSentInfo: [Self_UserInfo_documentsSent_documentsSentInfo_documentsSentInfoItem_UpdateInput_]
  ) {
    update_UserInfo_async(
      id: $id
      input: { documentsSent: { documentsSentInfo: $documentsSentInfo }}
    ) {
      result {
        _id
      }
    }
  }
`;

export const UPDATE_SENDER_INFO_ToSign = gql`
  mutation update_UserInfo_async(
    $id: ID!
    $documentsToSignInfo: [Self_UserInfo_documentsToSign_documentsToSignInfo_documentsToSignInfoItem_UpdateInput_]
  ) {
    update_UserInfo_async(
      id: $id
      input: { documentsToSign: { documentsToSignInfo: $documentsToSignInfo }}
    ) {
      result {
        _id
      }
    }
  }
`;
