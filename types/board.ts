export interface IBoard {
	columns: Map<TypedColumn, Column>
}

export type TypedColumn = 'todo' | 'inprogress' | 'done'

export interface Column {
	id: TypedColumn
	todos: ITodo[]
}

export interface ITodo {
	$id: string
	$createdAt: string
	title: string
	status: string
	image?: IImage
}

export interface IImage {
	bucketId: string
	fileId: string
}
