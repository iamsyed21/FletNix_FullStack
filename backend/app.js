import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from 'cookie-parser';
dotenv.config(); // sets up abstraction using the process object thats available in node
const port = process.env.PORT || 3000;
const app = express();
connectDB(); // database configuration that triggers and establishes connection between mongo database and node server.
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import contentRouter from './routes/contentRoutes.js';
import fs from 'fs';
import Content from "./models/content.js";

// const corsOptions = {
//     origin: 'TBD', 
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true, // Allows cookies to be sent
//     optionsSuccessStatus: 200 
//   };
// app.use(cors(corsOptions));
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// This is a ping to wake up my backend server in case it sleeps due to inactivity. Reduces Time-to-First-Byte; Helps in User experience.
app.get('/ping', (req, res) => {
    res.status(200).send('Server is awake');
  });

app.use('/api', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
});




//THE FOLLOWING IS ONE TIME CODE TO INSERT 8806 OBJECTS INTO MONGODB, THE OUTPUTFILE IS RECIEVED AFTER PROCESSING THROUGH PYTHON SCRIPT
// const insertContentData = async () => {
//     try {
        
//         const data = fs.readFileSync('./outputfile.json', 'utf8');
//         const contentData = JSON.parse(data);

        
//         const result = await Content.insertMany(contentData);
//         console.log(`${result.length} items were successfully inserted.`);
        
//     } catch (error) {
//         console.error('Error inserting content data:', error);
//     }
// };
//insertContentData()
