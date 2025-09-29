// src/types/context.ts

import type { Request } from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";

// The name is now GraphQLContext and it is exported.
// The `req` property is now optional and uses the correct Express type.
export interface Context {
  req?: Request;
  db: mongoose.mongo.Db;
  userId?: string;
  username?: string;
  role?: string;
  clientId?: string;
  lawyerId?: string;
  io: Server;
}
