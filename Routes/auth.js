import express from 'express';
import z from 'zod';
import { supabase, prisma } from "../index.js";
import { email } from 'zod/v4';

const router = express.Router();

const signUpschema=z.object({
    email:z.string().email(),
    password:z.string()
})

// Sign up new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result=signUpschema.safeParse(req.body);
    if(!result.success){
        return res.status(409).json({"msg":"Incorrect inputs"});
    }
    
    // First check if user exists in your database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email:email,
      password:password,
      options: {
        emailRedirectTo: 'http://localhost:8080/profile-setup'  
      }
    });

    if (authError) res.status(400).json({"err":authError});
    const newUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        email:email
      }
    });

    res.status(201).json({ 
      message: "User created successfully",
      user: newUser,
      session: authData 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sign in existing user

const signInschema=z.object({
    email:z.string().email(),
    password:z.string()
})
router.post('/signin', async (req, res) => {
  try {
    const result=signInschema.safeParse(req.body);
    if(!result.success){
        return res.status(409).json({"msg":"Incorrect inputs"});
    }
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return res.status(400).json({ error: "User doesn't exist ...Signup first" });
    }


    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get current user session
router.get('/session', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!data.session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json(data.session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default  router;