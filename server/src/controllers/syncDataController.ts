import { MongoClient, Collection } from "mongodb";
import { getCollection } from "@config/database";

const connectionStringOrigem = process.env.MONGODB_URI_ORIGEM!;
const clientOrigin = new MongoClient(connectionStringOrigem);

export const syncData = async (): Promise<void> => {
  try {
    await clientOrigin.connect();
    const dbOrigin = clientOrigin.db("test");
    const collectionOrigin: Collection = dbOrigin.collection("chats");

    const collectionDestination = getCollection();
    if (!collectionDestination) {
      throw new Error("Banco de destino não inicializado.");
    }

    const documents = await collectionOrigin.find().toArray();

    if (documents.length > 0) {
      await collectionDestination.insertMany(documents);
      console.log(`${documents.length} documentos sincronizados com sucesso!`);
    } else {
      console.log("Nenhum documento encontrado na coleção de origem.");
    }
  } catch (error) {
    console.error("Erro ao sincronizar os dados:", error);
  } finally {
    await clientOrigin.close();
  }
};


//Trigger

// exports = async function(changeEvent) {
//   const { operationType, fullDocument } = changeEvent;

//   const dbDestino = context.services
//     .get("mongodb-atlas") 
//     .db("nome_do_banco_destino"); 
//   const collectionDestino = dbDestino.collection("KeyValue"); 

//   try {
//     switch (operationType) {
//       case "insert":
//         if (fullDocument) {
//           await collectionDestino.insertOne(fullDocument);
//           console.log("Documento inserido na coleção de destino:", fullDocument);
//         }
//         break;

//       case "update":
//         console.log("Atualização detectada. Sincronização não implementada para este tipo de operação.");
//         break;

//       case "delete":
//         console.log("Remoção detectada. Sincronização não implementada para este tipo de operação.");
//         break;

//       default:
//         console.log("Operação não tratada:", operationType);
//     }
//   } catch (error) {
//     console.error("Erro ao sincronizar os dados:", error);
//   }
// };