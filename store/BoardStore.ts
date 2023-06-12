import { create } from 'zustand'

import { databases, storage,ID } from '@/appwrite'
import { Column, IBoard, IImage, ITodo, TypedColumn } from '@/types/board'
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn'
import { uploadImgToDb } from '@/utils/uploadImgToDb'

interface IBoardState {
	board: IBoard
	searchTerm: string
	newTaskInput: string
	newTaskType: TypedColumn
	image:File|null
	getBoard: () => void
	addTask:(todo:string, columnId:TypedColumn,image?:File|null)=>void
	setBoardState: (board: IBoard) => void
	updateTodoInDb: (todo: ITodo, columnId: TypedColumn) => void	 
	setNewTaskType: (type: TypedColumn) => void
	setSearchTerm: (searchTerm: string) => void
	setImage:(image:File|null)=>void
	deleteTask: (taskIndex: number, todo: ITodo, id: TypedColumn) => void
	setNewTaskInput: (title: string) => void
}

export const useBoardStore = create<IBoardState>((set, get) => ({
	board: {
		columns: new Map<TypedColumn, Column>(),
	},
	searchTerm: '',
	newTaskInput: '',
	newTaskType: 'todo',
	image:null,
	getBoard: async () => {
		const board = await getTodosGroupedByColumn()
		set({ board })
	},
	setBoardState: (board) => set({ board }),
	updateTodoInDb: async (todo, columnId) => {
		await databases.updateDocument(
			process.env.NEXT_PUBLIC_DATABASE_ID!,
			process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
			todo.$id,
			{
				title: todo.title,
				status: columnId,
			}
		)
	},
	setSearchTerm(searchTerm) {
		set({ searchTerm })
	},
	deleteTask: async (index, todo, id) => {
		const newColumns = new Map(get().board.columns)
		newColumns.get(id)?.todos.splice(index, 1)

		set({ board: { columns: newColumns } })
		if (todo.image) {
			await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
		}
		await databases.deleteDocument(
			process.env.NEXT_PUBLIC_DATABASE_ID!,
			process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
			todo.$id
		)
	},
	setNewTaskInput: (title) => set({ newTaskInput: title }),
	setNewTaskType: (type: TypedColumn) => set({ newTaskType: type }),
	setImage: async(data)=>set({image:data}),
	addTask:async (todo:string,columnId:TypedColumn,image?:File|null)=>{ 
		let file:IImage|undefined

		 if(image){
			 const uploadFile =await uploadImgToDb(image) 
			 if(uploadFile){
				  file={
						bucketId:uploadFile.bucketId,
						fileId:uploadFile.$id
						
					}
			 }
		 }

		 const {$id}= await databases.createDocument(
			process.env.NEXT_PUBLIC_DATABASE_ID!,
			process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
			ID.unique(),
			{
				title:todo,
				status:columnId,
				...(file&&{image:JSON.stringify(file)})
			}
		 )
		 set({newTaskInput:""}) 
		  
		 set((state)=>{
			  const newColumns = new Map(state.board.columns)
				const newTodo:ITodo={
					  $id,
						title:todo,
						$createdAt:new Date().toISOString(),
						status:columnId,
						...(file&&{image:file})
				}

				const column = newColumns.get(columnId) 
				if(!column){
					 newColumns.set(columnId,{
						 id:columnId,
						 todos:[newTodo]
					 })
				}else{
					 newColumns.get(columnId)?.todos.push(newTodo)
				}
				
				return {
					board:{
						columns:newColumns
					}
				}
			  
		 })
		  
		 

	}
}))
