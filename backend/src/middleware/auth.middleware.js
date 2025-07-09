import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => { //? next is a function that is called to pass control to the next middleware function in the stack like in this case the updateProfile function
    try {
        const token = req.cookies.jwt; //? get the token from the cookies   

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized-No Token Provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //? verify the token using the secret key 

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized-Invalid Token' });
        }

        const user = await User.findById(decoded.userId).select("-password"); //? find the user by id in the token and exclude the password field from the result
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized-User Not Found' });
        }

        req.user = user; //? add the user to the request object so that it can be accessed in the next middleware function
        next(); //? call the next middleware function in the stack which is the updateProfile function in this case
    }
    catch (error) {
        console.log('Error in protectRoute middleware', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}