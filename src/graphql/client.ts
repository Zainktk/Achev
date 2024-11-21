import { setContext } from "@apollo/client/link/context";

import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { onError } from "@apollo/client/link/error";

// import { globalErrorMessageVariable, serverUrl } from "utils";
// import { getLocalStorageItem } from "utils/LocalStorage";
import { globalErrorMessageVariable, serverUrl } from "@utils";
import { getLocalStorageItem } from "@utils";

const cache = new InMemoryCache();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  let messageVar: string | null = null;
  console.log("errorrrrr====>", graphQLErrors, networkError);
  let multiErrors;
  if (graphQLErrors) {
    messageVar = graphQLErrors.map(({ message }) => ` ${message}`).join(",");
    const objMessage = messageVar;
    multiErrors = objMessage
      ?.split(",")
      .find((currentValue) => currentValue.includes("detail"));
  }

  if (networkError) messageVar = `Network Error ${networkError}`;

  globalErrorMessageVariable({ message: multiErrors || messageVar });
});

const httpLink = new HttpLink({
  uri: serverUrl,
});

const authMiddleware = setContext(() =>
  getLocalStorageItem("token").then((item: string) => {
    const token = item;
    console.log("token", token);
    return {
      // Make sure to actually set the headers here
      headers: {
        authorization: `Bearer ${token}` || null,
      },
    };
  })
);

export const client = new ApolloClient({
  link: from([errorLink, authMiddleware as unknown as ApolloLink, httpLink]),
  cache,
  connectToDevTools: true,
});
