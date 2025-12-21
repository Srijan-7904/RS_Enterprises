import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    try {
        if(!filePath){
            console.log("No file path provided")
            return null
        }
        
        console.log("Uploading to Cloudinary:", filePath)
        const uploadResult = await cloudinary.uploader.upload(filePath)
        
        // Delete local file after successful upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        
        console.log("Upload successful:", uploadResult.secure_url)
        return uploadResult.secure_url
        
    } catch (error) {
        console.log("Cloudinary upload error:", error.message)
        // Delete local file even if upload fails
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        throw error
    }
    
}
export default uploadOnCloudinary