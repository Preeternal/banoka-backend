import { GraphQLClient } from 'graphql-request';

// const getClient = jwt => {
//   return new ApolloBoost({
//     uri: 'http://localhost:4000',
//     request(operation) {
//       if (jwt) {
//         operation.setContext({
//           headers: {
//             Authorization: `Bearer ${jwt}`,
//           },
//         });
//       }
//     },
//   });
// };

const getClient = (jwt?: string): GraphQLClient => {
  return new GraphQLClient('http://localhost:4000/graphql', {
    headers: { Authorization: `Bearer ${jwt}` },
  });
};

export default getClient;
