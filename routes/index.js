import express from 'express';
import authRoute from './authRoutes.js'
import userRoute from './userRoutes.js'
import postRoute from './postRoutes.js'
    

const router=express.Router();


router.use(`/auth`,authRoute); //auth/reigster
router.use(`/users`,userRoute);
router.use(`/posts`,postRoute);
router.use(`/post`,postRoute);
export default router;

 