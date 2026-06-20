



export  const uploadToCloudinary = async (uri: string) => {
 const data = new FormData();
 
 // File details
 data.append('file', {
   uri: uri,
   name: 'upload.jpg',
   type: 'image/jpeg',
 } as any);

 data.append('upload_preset', 'BOOKWORM');
 data.append('cloud_name', 'dzhfxnsbf');

 try {
   const response = await fetch(
     `https://api.cloudinary.com/v1_1/dzhfxnsbf/image/upload`,
     {
       method: 'POST',
       body: data,
       // Header add karna zaroori hai
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'multipart/form-data',
       },
     }
   );
   
   const result = await response.json();
   
   
   if (result.error) {
     throw new Error(result.error.message);
   }
   
   return{ secure_url:result.secure_url,url:result.public_id}; // Yeh URL aapke database mein save hoga
 } catch (error) {
   console.error("Cloudinary Error:", error);
   throw error;
 }
};
// The function to call from your app
