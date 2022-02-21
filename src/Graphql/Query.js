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
 {
  list_UserInfoItems {
    _UserInfoItems {
      docsSent {
        sentInfo {
          recieverPDFName
          timeSent
          usersRecieved
        }
      }
      docsToSign {
        info {
          fromWho
          senderPDFName
          sentToWho
          timeOfSend
        }
      }
      userFirstName
      userLastName
      _id
    }
  }
}

`
