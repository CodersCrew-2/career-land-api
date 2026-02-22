import { type Db, type Collection, ObjectId } from "mongodb";

export interface IUser {
	_id?: ObjectId;
	firstName: string;
	lastName?: string;
	email: string;
	access_token: string;
	refresh_token?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export function getUserCollection(db: Db): Collection<IUser> {
	return db.collection<IUser>("users");
}
