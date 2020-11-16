import { gql } from "apollo-boost";

const createCurrency = gql`
  mutation($data: CurrencyCreateInput!) {
    createCurrency(data: $data) {
      id
      name
      nameEng
      nominal
      charCode
      value
    }
  }
`;

const getCurrency = gql`
  query($where: CurrencyWhereUniqueInput!) {
    currency(where: $where) {
      id
      name
      nameEng
      nominal
      charCode
      value
    }
  }
`;

const getCurrencies = gql`
  query {
    currencies {
      id
      name
      nameEng
      nominal
      charCode
      value
    }
  }
`;

const deleteCurrency = gql`
  mutation($where: CurrencyWhereUniqueInput!) {
    deleteCurrency(where: $where) {
      id
      name
      nameEng
      nominal
      charCode
      value
    }
  }
`;

const updateCurrency = gql`
  mutation($data: CurrencyUpdateInput!, $where: CurrencyWhereUniqueInput!) {
    updateCurrency(data: $data, where: $where) {
      id
      name
      nameEng
      nominal
      charCode
      value
    }
  }
`;

const upsertCurrency = gql`
  mutation(
    $where: CurrencyWhereUniqueInput!
    $create: CurrencyCreateInput!
    $update: CurrencyUpdateInput!
  ) {
    upsertCurrency(where: $where, create: $create, update: $update) {
      id
      name
      nameEng
      nominal
      charCode
      value
    }
  }
`;

export {
  createCurrency,
  getCurrency,
  getCurrencies,
  deleteCurrency,
  updateCurrency,
  upsertCurrency
};
