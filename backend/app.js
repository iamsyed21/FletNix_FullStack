import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import fs from 'fs';
import Content from "./models/content.js";
import mongoose from "mongoose";



dotenv.config(); // sets up abstraction using the process object thats available in node
const port = process.env.PORT || 3000;
const app = express();
connectDB(); // database configuration that triggers and establishes connection between mongo database and node server.



import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import contentRouter from './routes/contentRoutes.js';




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

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

// TEST CASE FOR COOKIE SETTING:
// app.get('/test-cookie', (req, res) => {
//   res.cookie('test', 'value', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development',
//     sameSite: 'lax',
//     maxAge: 14 * 24 * 60 * 60 * 1000
//   });
//   res.send('Test cookie set');
// });



// ONE TIME CODE TO CREATE INDEX FOR SEARCHING
// mongoose.connection.on('open', async () => {
//   try {
//     await Content.createIndexes(); 
//     console.log('Text indexes created for title');
//   } catch (error) {
//     console.error('Error creating text indexes', error);
//   }
// });