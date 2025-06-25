import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import authenticate from "./middleware/auth.js";
import { checkRole } from "./middleware/role-check.js";
import mainRouter from "./Routes/index.js";

// Initialize clients
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/api",mainRouter);
app.use(cors());
app.use(authenticate);
app.use(checkRole);



// Start server
app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});

// Export for use in other files
export {
  supabase,
  prisma
};