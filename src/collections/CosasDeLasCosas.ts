import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { COLLECTION, COLLECTION_USERS } from "../utils";

export interface CosaInput {
  atributo: String
}



export const getCosas = async (page?: number, size?: number) => {
    const db = getDB();
    page = page || 1;
    size = size || 10;
    return await db.collection(COLLECTION).find().skip((page - 1) * size).limit(size).toArray();
};

export const getCosaById = async (id: string) => {
    const db = getDB();
    return await db.collection(COLLECTION).findOne({_id: new ObjectId(id)});
};

export const addCosa = async (atributo: string ) => {
    const db = getDB();
    const result = await db.collection(COLLECTION).insertOne({
        atributo
    });
    const newCosa = await getCosaById(result.insertedId.toString());
    return newCosa;
};


export const addCosas = async (cosas: CosaInput[]) => {
  const db = getDB();
  const result = await db.collection(COLLECTION).insertMany(
    cosas.map(p => ({
      atributo: p.atributo,
    }))
  );
  const insertedIds = Object.values(result.insertedIds);
  const insertedPokemons = await db
    .collection(COLLECTION)
    .find({ _id: { $in: insertedIds } })
    .toArray();

  return insertedPokemons.map(p => ({
    id: p._id.toString(),
    atributo: p.atributo,
  }));
};

export const addCosaAUser = async (CosaId: string, userId: string) => {
    const db = getDB();
    const localUserId = new ObjectId(userId);
    const localCosaId = new ObjectId(CosaId);

    const CosaToAdd = await db.collection(COLLECTION).findOne({_id: localCosaId});
    if(!CosaToAdd) throw new Error("Cosa not found");

    await db.collection(COLLECTION_USERS).updateOne(
        { _id: localUserId },
        {
            $addToSet: { cosas: CosaId }
        }
    );

    const updatedUser = await db.collection(COLLECTION_USERS).findOne({_id: localUserId});
    return updatedUser;
}