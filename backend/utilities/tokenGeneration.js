import jwt from 'jsonwebtoken';


const generateToken = (res, id, role) =>{
    const token = jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn:"14d"});

    res.cookie('token', token, {
        httpOnly: true, //only accessible by the server side code enchaning security measures
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 14 * 24 * 60 * 60 * 1000 // 2 days of validity
    });
};


export default generateToken;
