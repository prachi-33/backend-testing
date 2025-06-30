import express from 'express';
import {prisma} from "../index.js";
import z from "zod";
const router=express.Router();

const createProblemSchema=z.object({
    organizer_id:z.string(),
    title:z.string(),
    description:z.string(),
    repository_url:z.string().optional(),
    website_url:z.string().optional(),
    tags:z.array(z.string()).optional(),
    difficulty_lvl:z.string().optional(),
    status:z.string().optional(),
    look_for_contributor:z.boolean().optional(),
    mentor_available:z.boolean().optional(),
    no_of_contributor:z.string().optional(),
    open_issues:z.string().optional(),
    merged_prs:z.string().optional()

})

router.post("/project-info",async (req,res)=>{
    const {
        organizer_id,
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
    
    try{
        const result=createProblemSchema.safeParse(req.body);
        if(!result.success){
            return res.status(409).json({"msg":"Incorrect Inputs"});
        }
        const problem=await prisma.project.create({
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

        res.status(200).json({
            "message":"Problem created",
            "problem-info":problem
        })
    }catch(error){
        res.status(400).json({error : error.message})

    }
})

router.get("/all-projects-info",async (req,res)=>{
    try{
        const problems =await prisma.projects.findMany()
        res.status(200).json({
            "message":"All Problems",
            "ProfileInfo":problems
        })
    }catch(error){
        res.status(400).json({error:error.message})
    }
})

router.get("/search-project",authenticate,async(req,res)=>{
    const {title}=req.query;
    try {
        const projects = await prisma.projects.findMany({
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