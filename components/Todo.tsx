import { XCircleIcon } from '@heroicons/react/24/solid'
import {
	DraggableProvidedDragHandleProps,
	DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd'

import { useBoardStore } from '@/store/BoardStore'
import { ITodo, TypedColumn } from '@/types/board'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getImgUrl } from '@/utils/getImgUrl'

interface ITodoProps {
	item: ITodo
	index: number
	id: TypedColumn
	innerRef: (el: HTMLElement | null) => void
	draggableProps: DraggableProvidedDraggableProps
	dragHandlerProps: DraggableProvidedDragHandleProps | null | undefined
}

const Todo = ({
	item,
	index,
	id,
	innerRef,
	dragHandlerProps,
	draggableProps,
}: ITodoProps) => {
	const [urlImg,setUrlImg]=useState<string|null>(null)
	const { deleteTask} = useBoardStore((state) => state)

		 

	useEffect(()=>{
   if(item.image){
		const fetchImage = async()=>{
			const url =await getImgUrl(item.image!)		 
			  if(url){
					setUrlImg(url.toString()) 		
				}	
	 }
	   fetchImage()
	 }	
   
	},[item])

	return (
		<div
			className="bg-white rounded-md space-y-2 drop-shadow-md"
			ref={innerRef}
			{...dragHandlerProps}
			{...draggableProps}
		>
			<div className="flex p-5  items-center justify-between">
				{item.title}
				<button
					onClick={() => deleteTask(index, item, id)}
					className="text-red-500 hover:text-red-600 transition"
				>
					<XCircleIcon className="h-5 w-5" />
				</button>
			</div>
			{urlImg && (
				 <div className='w-full h-full rounded-b-md'>
         <Image
				  src={urlImg}
					alt="Task Image"
					width={400}
					height={200}
					className="w-full object-contain rounded-b-md"			  		
				/>
				 </div>
			)}
		</div>
	)
}

export default Todo
