import { Router } from 'express';
import { registerUser, loginUser } from '../services/authService';

const router = Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, inviteCode } = req.body;
    const user = await registerUser(username, password, email, inviteCode);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await loginUser(username, password);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
