import { storage,ID } from '@/appwrite'


export const uploadImgToDb =async(file:File)=>{ 
	   if(!file) return  
		 const uploadFile = await storage.createFile(
      '6482403c79053c47e110',
			 ID.unique(),
			 file
		 )
    console.log(uploadFile)
		 return uploadFile

   



}