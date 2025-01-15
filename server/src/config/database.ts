import { MongoClient, Db, Collection } from "mongodb";

let db: Db | null = null;
let collection: Collection | null = null;

const DB_NAME = "sample_airbnb"
const COLLECTION_NAME = "listingsAndReviews"

export const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI!;
    const client = new MongoClient(uri);

    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
};

export const getDatabase = (): Db | null => db;
export const getCollection = (): Collection | null => collection;
