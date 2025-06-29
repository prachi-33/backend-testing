import express from 'express';
import { z } from 'zod';
import authenticate from '../middleware/auth';
import { checkRole } from '../middleware/role-check';
const router=express.Router();

const contributionSchema=z.object({
    title:z.string(),
    type:z.string(),
    userId:z.string(),
    projectId:z.string(),
    status:z.string().optional(),
    url:z.string().optional(),

})




export default router;