import mongoose from "mongoose";

export class DB {
	private dbClient: mongoose.Mongoose | null = null;
	constructor(private config: { databaseUrI: string }) {}

	async client() {
		if (!this.dbClient) {
			this.dbClient = await mongoose.connect(this.config.databaseUrI);
		}
    return this.dbClient
	}
}