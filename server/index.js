require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');
const { v2: cloudinary } = require('cloudinary');
const prisma = new PrismaClient(); // V6 mein yahan extra kuch nahi chahiye
cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.post('/useradd', async (req, res) => {
  const { email, id, first_name, lastname } = req.body;
  
  try {
    const existing = await prisma.user.findFirst({
        where: { id: id }
    });
    
    if (existing) {
      // Use res.json here, NOT return existing
      return res.status(200).json(existing); 
    }
    
    const newUser = await prisma.user.create({
      data: {
        first_name: first_name,
        last_name: lastname,
        email: email,
        id: id
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "User create nahi ho paya!" });
  }
});
app.get("/getuserbyid", async (req, res) => {
    const id = req.query.id;
  
    
    try {
       const data = await prisma.user.findFirst({
        where: { id: id }
       });
       if(!data)
       {
        return res.status(400).json({sucess:false})
       }
       // Send the response back to the client
       return res.status(200).json({ user: data });
    } catch (error) {
       console.error(error);
       return res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/featuredproperties",async (req,res) => {
  try {
      const data=await prisma.property.findMany({
        where:{
          is_featured:true
        }
      })
      
      return res.status(200).json({pfdata:data})
  } catch (error) {
     return  res.status(404).json({message:"not found"})
  }
})
app.get("/properties",async (req,res) => {
  try {
      const data=await prisma.property.findMany()
      
      return res.status(200).json({pdata:data})
  } catch (error) {
     return  res.status(404).json({message:"not found"})
  }
})
app.get("/savedproperties",async (req,res) => {
   const id = req.query.id;
  try {
      const data=await prisma.savedProperty.findMany({
        where:{
          user_id:id
        },
        include:{
          property:true
        }
      })
      if(data)
      {
        return res.status(200).json({sdata:data})
      }
  } catch (error) {
    console.log(error);
    
  }
})
app.get("/property",async (req,res) => {
   const id = req.query.id;
  try {
      const data=await prisma.property.findUnique({
        where:{
          id:id
        }
      })
      if(data)
      {
        return res.status(200).json({property:data})
      }
  } catch (error) {
    console.log(error);
    
  }
})
app.post("/save",async (req,res) => {
   const {user_id,p_id}=req.body;
   
   if (!user_id || !p_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const data=await prisma.savedProperty.findFirst({
      where:{
        property_id:p_id,
        user_id:user_id
      }
    })
    if(data)
    {
      await prisma.savedProperty.delete({
        where:{
          id:data.id
        }
      })
      return res.status(201).json({ message: "Removed" });
    }
    else{
      await prisma.savedProperty.create({
        data:{
          user_id:user_id,
          property_id:p_id
        }
      })
      return res.status(201).json({ message: "Saved" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
})
app.post("/deleteprop",async (req,res) => {
    const {prop_id}=req.body
    if(!prop_id) 
    {
       return res.status(404).json({message:"Not Found",success:false})
    }
  try {
     const data=await prisma.property.findUnique({
      where:{
        id:prop_id
      }
     })
     if(!data)
     {
      return res.status(404).json({message:"Not Found",success:false})
     }
     const deletedata=await prisma.property.delete({
      where:{
        id:data.id
      }
     })
     if(deletedata)
     {
       return res.status(200).json({message:"Deleted",success:true})
     }
   } catch (error) {
    console.log(error);
    
    return res.status(404).json({message:"Not Found",success:false})

   }
})
app.post("/marksoldprop",async (req,res) => {
    const {prop_id}=req.body
     if(!prop_id) 
    {
       return res.status(404).json({message:"Not Found",success:false})
    }
  try {
     const data=await prisma.property.findUnique({
      where:{
        id:prop_id
      }
     })
     if(!data)
     {
      return res.status(404).json({message:"Not Found",success:false})
     }
     if(!data.is_sold)
     {
       const updateddata=await prisma.property.update({
        where:{
          id:prop_id
        },
        data:{
          is_sold:true
        }
       })

     }
     else{
      const updateddata=await prisma.property.update({
        where:{
          id:prop_id
        },
        data:{
          is_sold:false
        }
       })
     }
     
       return res.status(200).json({message:"Updated",success:true})
     
   } catch (error) {
    console.log(error);
    
    return res.status(404).json({message:"Not Found",success:false})

   }
})
app.post("/createproperty",async (req,res) => {
  const { 
    title, price, type, bedroom, bathroom, area, 
    city, address, lat, long,  
    description, images, publicid ,isChecked
  } = req.body;
  try {
    const newProperty = await prisma.property.create({
      data: {
        title,
        price: parseFloat(price), // Ensure it's a number/decimal
        type,
        bedrooms: parseInt(bedroom),
        bathrooms: parseInt(bathroom),
        area_sqft: parseInt(area),
        city,
        address,
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
        is_featured: isChecked,
        description,
        images: images,    // This maps to your new string[] array
        publicIds:publicid// This maps to your new string[] array
      }
    });
    if(newProperty)
    {
     return res.status(200).json({success:true})
    }
       return res.status(400).json({success:false})
  } catch (error) {
    console.log(error);
    
    return res.status(400).json({success:false})
  }
})
app.post('/delete-images', async (req, res) => {
  const { publicIds } = req.body;
  
  try {
    const results = await Promise.all(
      publicIds.map((id) => cloudinary.uploader.destroy(id))
    );
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log('Server running on port 3000'));