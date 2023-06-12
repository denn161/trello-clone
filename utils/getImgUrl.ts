import { storage } from '@/appwrite'
import { IImage } from '@/types/board'


export const getImgUrl =async(image:IImage)=>{

    const url = storage.getFilePreview(image.bucketId,image.fileId) 

		return url
}