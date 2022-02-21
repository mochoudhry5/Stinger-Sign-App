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
    docsSent {
      sentInfo {
        isSigned
        recieverPDFName
        timeSent
        usersRecieved
      }
    }
    docsToSign {
      info {
        fromWho
        isSignedOrNot
        senderPDFName
        sentToWho
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
`
