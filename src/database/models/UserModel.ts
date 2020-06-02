import * as mongoose from "mongoose";
import { UserSchema } from "../schemas/UserSchema";
import { User } from "../../models/user";

export const UserModel = mongoose.model<User>("User", UserSchema);
