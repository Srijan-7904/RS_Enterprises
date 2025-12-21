import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"


export const addProduct = async (req,res) => {
    try {
        console.log("=== Add Product Request ===")
        console.log("Body:", req.body)
        console.log("Files:", req.files)
        
        let {name,description,price,category,subCategory,sizes,bestseller} = req.body

        // Check if at least one image is present
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("No images provided")
            return res.status(400).json({message: "At least 1 product image is required"})
        }

        console.log("Starting Cloudinary uploads...")
        let image1 = null, image2 = null, image3 = null, image4 = null
        
        if (req.files.image1) {
            image1 = await uploadOnCloudinary(req.files.image1[0].path)
            console.log("Image 1 uploaded:", image1)
        }
        
        if (req.files.image2) {
            image2 = await uploadOnCloudinary(req.files.image2[0].path)
            console.log("Image 2 uploaded:", image2)
        }
        
        if (req.files.image3) {
            image3 = await uploadOnCloudinary(req.files.image3[0].path)
            console.log("Image 3 uploaded:", image3)
        }
        
        if (req.files.image4) {
            image4 = await uploadOnCloudinary(req.files.image4[0].path)
            console.log("Image 4 uploaded:", image4)
        }
        
        let productData = {
            name,
            description,
            price :Number(price),
            category,
            subCategory,
            sizes :JSON.parse(sizes),
            bestseller :bestseller === "true" ? true : false,
            date :Date.now(),
            image1,
            image2,
            image3,
            image4
            
        }

        const product = await Product.create(productData)

        return res.status(201).json(product)

    } catch (error) {
        console.log("AddProduct error:", error)
        return res.status(500).json({message:`AddProduct error: ${error.message}`})
    }
    
}


export const listProduct = async (req,res) => {
     
    try {
        const product = await Product.find({});
        return res.status(200).json(product)

    } catch (error) {
        console.log("ListProduct error")
    return res.status(500).json({message:`ListProduct error ${error}`})
    }
}

export const removeProduct = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
         return res.status(200).json(product)
    } catch (error) {
        console.log("RemoveProduct error")
    return res.status(500).json({message:`RemoveProduct error ${error}`})
    }
    
}

export const editProduct = async (req,res) => {
    try {
        let {id} = req.params
        let {name,description,price,category,subCategory,sizes,bestseller} = req.body

        let updateData = {
            name,
            description,
            price :Number(price),
            category,
            subCategory,
            sizes :JSON.parse(sizes),
            bestseller :bestseller === "true" ? true : false,
        }

        // Upload new images only if provided
        if(req.files?.image1){
            let image1 = await uploadOnCloudinary(req.files.image1[0].path)
            updateData.image1 = image1
        }
        if(req.files?.image2){
            let image2 = await uploadOnCloudinary(req.files.image2[0].path)
            updateData.image2 = image2
        }
        if(req.files?.image3){
            let image3 = await uploadOnCloudinary(req.files.image3[0].path)
            updateData.image3 = image3
        }
        if(req.files?.image4){
            let image4 = await uploadOnCloudinary(req.files.image4[0].path)
            updateData.image4 = image4
        }

        const product = await Product.findByIdAndUpdate(id, updateData, {new: true})

        return res.status(200).json(product)

    } catch (error) {
        console.log("EditProduct error")
    return res.status(500).json({message:`EditProduct error ${error}`})
    }
}
