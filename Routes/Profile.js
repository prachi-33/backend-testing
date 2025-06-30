import express from 'express';
import z from "zod";
import { supabase, prisma } from "../index.js";
import authenticate from '../middleware/auth.js';
const router=express.Router();

const profileSchema=z.object({
    username:z.string(),
    full_name:z.string(),
    bio:z.string().optional(),
    skills:z.array(z.string()).optional(),
    interests:z.array(z.string()).optional(),
    role:z.enum(["organizer","contributor"]),
    github_username:z.string().optional(),
    discord_username:z.string().optional()

})

router.post("/profile-setup",authenticate, async (req,res)=>{
    const {
        username,
        full_name,
        bio,
        skills,
        interests,
        role,
        github_username,
        discord_username
    }=req.body;
    const id=req.user.id;

    try{
        const result=profileSchema.safeParse(req.body);
        if(!result.success){
            return res.status(409).json({
                "msg":"Incorrect Inputs"
            })
        }
        const profile= await prisma.profiles.create({
            data:{
                user_id:id,
                username:username,
                full_name:fullName,
                bio:bio,
                skills:skills,
                interests:interests,
                role:role,
                github_username:github_username,
                discord_username:discord_username
            }
            

            
        })
        
        res.status(201).json({
            "message":"Profile setup done",
            "profile":profile
        })
    }catch(error){
        res.status(400).json({error : error.message})

    }

    
})

router.get("/profile-info",authenticate,async (req,res)=>{
    const id =req.user.id;
    try{
        const profile =await prisma.profiles.findUnique({
            where:{
                user_id:id
            }
        })
        res.status(200).json({
            "message":"Profile info",
            "ProfileInfo":profile
        })
    }catch(error){
        res.status(400).json({error:error.message})
    }
})

const updateProfileSchema=z.object({
    username:z.string().optional(),
    full_name:z.string().optional(),
    bio:z.string().optional(),
    skills:z.string().optional(),
    interests:z.string().optional(),
    github_username:z.string().optional(),
    discord_username:z.string().optional()

})


router.put("/profile-edit",authenticate,async(req,res)=>{
    const id=req.user.id;
    const {
        username,
        fullName,
        bio,
        skills,
        interests,
        github_username,
        discord_username
    }=req.body;
    try{
        const result=updateProfileSchema.safeParse(req.body);
        if(!result.success){
            res.status(409).json({
                "msg":"Incorrect Inputs"
            })
        }
        const updated=await prisma.profiles.update({
            where:{
                user_id:id
            },
            data:{
                username:username,
                full_name:fullName,
                bio:bio,
                skills:skills,
                interests:interests,
                github_username:github_username,
                discord_username:discord_username
            }

        })
        res.status(200).json({
            "message":"Profile Updated",
            "UpdatedProfile":updated
        })
    }catch(error){
        res.status(400).json({error:error.message})
    }

})








export default router;