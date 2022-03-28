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


export const GET_SENT_INFO_DOCS_TO_SIGN = gql`
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
    }
  }
`;

export const LIST_ALL_FILES = gql`
query blocksQuery {
  listVendia_FileItems {
    Vendia_FileItems {
      _id
      destinationKey
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

