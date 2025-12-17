import { gql } from "apollo-server";



export const typeDefs = gql`

type User {
    _id: ID!
    email: String!
    CosasDeUsuario: [UserCosa!]!
}

type Cosa {
    id: ID!
    atributo: String
}

input CosaInput {
  atributo: String
}

type UserCosa {
    id: ID!
    atributo: String
}

type Query {
    me: User
    Cosas: [Cosa!]!
    Cosa(id: ID!): Cosa
}

type Mutation {
    register(email: String!, password: String!): String!
    login(email: String!, password: String!): String!

    addCosa(atributo: String): Cosa!
    addMuchasCosas(cosas: [CosaInput!]!): [Cosa!]!
    addCosaAUser(cosaId: ID!): User

}


`;