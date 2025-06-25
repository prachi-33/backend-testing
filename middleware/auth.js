import { supabase } from '../index.js';
import {prisma} from "../index.js"

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return res.status(401).json({ message: 'User not found in internal DB' });
    }
    req.user = dbUser;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default  authenticate ;