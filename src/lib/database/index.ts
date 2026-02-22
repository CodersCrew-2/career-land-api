import { MongoClient, type Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectDB(databaseUrl: string): Promise<Db> {
	if (cachedDb) {
		return cachedDb;
	}

	if (!cachedClient) {
		cachedClient = new MongoClient(databaseUrl);
		await cachedClient.connect();
	}

	cachedDb = cachedClient.db();
	return cachedDb;
}