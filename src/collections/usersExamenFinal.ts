import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { COLLECTION_USERS } from "../utils";
import { ObjectId } from "mongodb";





export const createUser = async (email: string, password: string) => {
    const db = getDB();

    
    //comprobamos que el formato sea valido
    const normalizedEmail = email.trim().toLowerCase();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(normalizedEmail)) throw new Error("Invalid email format");

    //comprobamos si existe ya el usuario
     const existeUser = await db
    .collection(COLLECTION_USERS)
    .findOne({ email });
    if (existeUser) throw new Error("User already exists");


    const toEncriptao = await bcrypt.hash(password, 10);

    const result = await db.collection(COLLECTION_USERS).insertOne({
        email,
        password: toEncriptao
    });

    return result.insertedId.toString();
};

export const validateUser = async (email: string, password: string) => {
    const db = getDB();
    const user = await db.collection(COLLECTION_USERS).findOne({email});
    if( !user ) return null;

    const laPassEsLaMismaMismita = await bcrypt.compare(password, user.password);
    if(!laPassEsLaMismaMismita) return null;

    return user;
};

export const findUserById = async (id: string) => {
    const db = getDB();
    return await db.collection(COLLECTION_USERS).findOne({_id: new ObjectId(id)})
}