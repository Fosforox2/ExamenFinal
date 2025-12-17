import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { IResolvers } from "@graphql-tools/utils";
import { createUser, validateUser } from "../collections/usersExamenFinal";
import { getCosas, getCosaById, addCosa, addCosas, addCosaAUser} from "../collections/CosasDeLasCosas";

import { signToken } from "../auth";
import { COLLECTION } from '../utils';
import { UserCosa } from "../types";

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;

      return {
        _id: user._id.toString(),
        email: user.email,
        pokemonGamesLibrary: user.pokemonGamesLibrary || [],
      };
    },
    Cosas: () => getCosas(),
    Cosa: (_, { id }) => getCosaById(id),
  },

  
  User: {
  CosasDeUsuario: (parent) => {
    return parent.pokemonGamesLibrary.map((entry: UserCosa) => ({
      cosaId: entry.cosaId,
    }));
  },
},

  Mutation: {
    register: async (_,{ email, password }: { email: string; password: string }) => {
      const userId = await createUser(email, password);
      return signToken(userId);
    },
    login: async (_,{ email, password }: { email: string; password: string }) => {
      const user = await validateUser(email, password);
      if (!user) throw new Error("Invalid credentials");
      return signToken(user._id.toString());
    },


    addCosa: async (_, { atributo }) => {
      return addCosa(atributo);
    },

    addMuchasCosas: async (_, { cosas }) => {
    return addCosas(cosas);
    },
    addCosaAUser: (_, { cosaId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return addCosaAUser(user._id, cosaId);
    },
  },
};