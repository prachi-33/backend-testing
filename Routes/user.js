import express from 'express';
import { prisma } from '../index.js';
import authenticate from '../middleware/auth.js';
import z from "zod";

const router = express.Router();

const userSchema=z.object({
    user_id:z.string(),
    role:z.enum(["organizer","contributor"])
})

router.post("/post",async (req,res)=>{
    try{
        const result=userSchema.safeParse(req.body);
        if(!result.success){
            return res.status(409).json({"msg":"Wrong inputs"})
        }
        const user=await prisma.user_roles.create({
            data:{
                user_id:req.body.user_id,
                role:req.body.role
            }
        })
        return res.status(200).json({"msg":"successfull "})
    }catch(error){
        res.status(400).json({error:error.description})
    }
})

// Get user role by user ID
router.get("/role",authenticate,async (req,res)=>{
    const id =req.user.id;
    try{
        const user_info=await prisma.user_roles.findUnique({
            where:{
                user_id:id
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
