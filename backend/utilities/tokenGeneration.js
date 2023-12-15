import jwt from 'jsonwebtoken';


const generateToken = (id, role) =>{
   
    //basic jwt auth mechanism
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "14d" });


};


export default generateToken;
