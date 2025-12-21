import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'


const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies
        
        if(!token){
            return res.status(400).json({message:"user does not have token"})
        }
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)

        if(!verifyToken){
            return res.status(400).json({message:"user does not have a valid token"})
        }
        
        // Fetch the full user object
        const user = await User.findById(verifyToken.userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        
        req.userId = verifyToken.userId
        req.user = user
        next()

    } catch (error) {
         console.log("isAuth error", error)
    return res.status(500).json({message:`isAuth error ${error}`})
        
    }
}

export default isAuth