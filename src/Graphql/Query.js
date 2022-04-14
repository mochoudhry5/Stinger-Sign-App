import { gql } from "@apollo/client";

export const ALL_USERS = gql`
  {
    list_UserInfoItems {
      _UserInfoItems {
        userFirstName
        userLastName
        userEmail
        userPassword
        _id
      }
    }
  }
`;

export const USER_INFO = gql`
  query blocksQuery($id: ID!) {
    get_UserInfo(id: $id) {
      documentsSent {
        documentsSentInfo {
          pdfName
          timeSent
          usersSentTo
        }
      }
      documentsToSign {
        documentsToSignInfo {
          fromWho
          isSigned
          pdfName
          nextToSend
          timeOfSend
        }
      }
      userCompany
      userEmail
      userFirstName
      userJobTitle
      userLastName
      userProfilePicture
    }
  }
`;

export const GET_SENT_INFO = gql`
  query get_UserInfo($id: ID!) {
    get_UserInfo(id: $id) {
      documentsSent {
        documentsSentInfo {
          pdfName
          timeSent
          usersSentTo
          reasonForSigning
          isRejected
          isCompleted
        }
      }
    }
  }
`;


export const GET_DOCS_TO_SIGN_INFO = gql`
  query get_UserInfo($id: ID!) {
    get_UserInfo(id: $id) {
      documentsToSign {
        documentsToSignInfo {
          fromWho
          isSigned
          pdfName
          nextToSend
          timeOfSend
          reasonForSigning
        }
      }
    }
  }
`;

export const USER_INFO_BASIC = gql`
  query blocksQuery($id: ID!) {
    get_UserInfo(id: $id) {
      userCompany
      userEmail
      userFirstName
      userJobTitle
      userLastName
      userProfilePicture
    }
  }
`;

export const LIST_ALL_FILES = gql`
query blocksQuery {
  listVendia_FileItems {
    Vendia_FileItems {
      _id
      destinationKey
      temporaryUrl
    }
  }
}
`;

export const GETFILE = gql`
query blocksQuery($id: ID!) {
  getVendia_File(id: $id) {
    temporaryUrl
  }
}
`;

export const DOCS_SENT_OR_SIGNED = gql`
  query blocksQuery($id: ID!) {
    get_UserInfo(id: $id) {
      documentsSent {
        documentsSentInfo {
          pdfName
          timeSent
          usersSentTo
          reasonForSigning
          isRejected
          isCompleted
        }
      }
      documentsToSign {
        documentsToSignInfo {
          fromWho
          isSigned
          pdfName
          nextToSend
          timeOfSend
          reasonForSigning
        }
      }
    }
  }
`;

