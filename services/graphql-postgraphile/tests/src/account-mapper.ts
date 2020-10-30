import { GraphQLClient, gql } from 'graphql-request';

import {
  CreateAccountInput
} from '../../__generated__/types';

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($accountInput: CreateAccountInput!) {
    createAccount(input: $accountInput) {
      __typename
      account {
        accountId
        email
        createdAt
        emailVerified
        firstName
        fullName
        updatedAt
        lastName
      }
    }
  }
`;

interface AccountInputVar {
  accountInput: CreateAccountInput
}

interface Account {
  accountId: string,
  email: string,
  emailVerified: boolean
}

interface CognitoAccount {
  sub: string,
  email: string,
  emailVerified: boolean
}

export default class AccountMapper {
  graphQLClient: GraphQLClient;

  constructor(endpoint: string, authToken: string) {
    this.graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `BEARER ${authToken}`
      }
    });
  }

  async createAccountFromCognito(cognitoAccount: CognitoAccount) {
    const account = {
      accountId: cognitoAccount.sub,
      email: cognitoAccount.email,
      emailVerified: cognitoAccount.emailVerified
    }
    const response = await this.createAccount(account);
  }

  async createAccount(account: Account) {
    const accountInputVar = this.createAccountInput(account);
    const response = await this.graphQLClient.request(CREATE_ACCOUNT, accountInputVar);
    console.log(response);

    return response;
  }

  createAccountInput(account: Account): AccountInputVar {
    return {
      accountInput: {
        account: {
          ...account
        }
      }
    }
  }
}

//sample id token from cognito
// {
//   "sub": "46d3f3d1-879b-4314-9301-ae470c5a2062",
//   "cognito:groups": [
//     "margins_account"
//   ],
//   "email_verified": true,
//   "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_jcGG3tVBb",
//   "cognito:username": "46d3f3d1-879b-4314-9301-ae470c5a2062",
//   "cognito:roles": [
//     "arn:aws:iam::516851544810:role/amplify-marginsmereact-dev-205104-authRole"
//   ],
//   "aud": "4v1q302r040fct1ve3kkhoo30b",
//   "event_id": "d207a8f6-f162-426c-acf8-890644f8b58e",
//   "token_use": "id",
//   "auth_time": 1604060976,
//   "exp": 1604147376,
//   "iat": 1604060976,
//   "email": "uilxela7@gmail.com"
// }