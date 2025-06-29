import express from 'express';
import { prisma } from '../index.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Get user role by user ID
router.get("/role",authenticate,async (req,res)=>{
    const id =req.user.id;
    try{
        const user_info=await prisma.user_role.findUnique({
            where:{
                id:id
            }
        })
        res.status(200).json({
            "role":user_info.role
        })
    }catch(error){
        res.status(400).json({error:error.message})
    }
})

export default router;
