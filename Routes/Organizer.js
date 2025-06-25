import express from 'express';
import {prisma} from "../index.js";
import z from "zod";
import authenticate from '../middleware/auth.js';
import { checkRole } from '../middleware/role-check.js';
const router=express.Router();

const createProblemSchema=z.object({
    title:z.string(),
    description:z.string(),
    repository_url:z.string().optional(),
    website_url:z.string().optional(),
    tags:z.string().optional(),
    difficulty_lvl:z.string().optional(),
    status:z.string().optional(),
    look_for_contributor:z.boolean().optional(),
    mentor_available:z.boolean().optional(),
    no_of_contributor:z.string().optional(),
    open_issues:z.string().optional(),
    merged_prs:z.string().optional()

})

router.post("/problem-info",authenticate,checkRole("Organizer"),async (req,res)=>{
    const {
        title,
        description,
        repository_url,
        website_url,
        tags,
        difficulty_lvl,
        status,
        look_for_contributor,
        mentor_available,
        no_of_contributor,
        open_issues,
        merged_prs
    }=req.body;
    const organizer_id=req.user.id;
    try{
        const result=createProblemSchema.safeParse(req.body);
        if(!result.success){
            return res.status(409).json({"msg":"Incorrect Inputs"});
        }
        const problem=await prisma.Project.create({
            data:{
                organizer_id:organizer_id,
                title:title,
                description:description,
                repository_url:repository_url,
                website_url:website_url,
                tags:tags,
                difficulty_lvl:difficulty_lvl,
                status:status,
                look_for_contributor:look_for_contributor,
                mentor_available:mentor_available,
                no_of_contributor:no_of_contributor,
                open_issues:open_issues,
                merged_prs:merged_prs

            }
        })

        res.status(201).json({
            "message":"Problem created",
            "problem-info":problem
        })
    }catch(error){
        res.status(400).json({error : error.message})

    }
})

router.get("/all-problems-info",authenticate,async (req,res)=>{
    try{
        const problems =await prisma.Project.findMany()
        res.status(200).json({
            "message":"All Problems",
            "ProfileInfo":problems
        })
    }catch(error){
        res.status(400).json({error:error.message})
    }
})

router.get("/search-problem",authenticate,async(req,res)=>{
    const {title}=req.query;
    try {
        const projects = await prisma.project.findMany({
        where: {
            title: {
            contains: title, 
            mode: 'insensitive', 
            },
        },
        });

        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
})




export default router;