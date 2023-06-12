import { title } from 'process'

import { databases } from '@/appwrite'
import { Column, IBoard, TypedColumn } from '@/types/board'

export const getTodosGroupedByColumn = async () => {
	const data = await databases.listDocuments(
		process.env.NEXT_PUBLIC_DATABASE_ID!,
		process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
	)

	const todos = data.documents

	const columns = todos.reduce((acc, todo) => {
		if (!acc.has(todo.status)) {
			acc.set(todo.status, {
				id: todo.status,
				todos: [],
			})
		}
		acc.get(todo.status)!.todos.push({
			$id: todo.$id,
			$createdAt: todo.$createdAt,
			status: todo.status,
			title: todo.title,
			...(todo.image && { image: JSON.parse(todo.image) }),
		})

		return acc
	}, new Map<TypedColumn, Column>())

	const typedColumns: TypedColumn[] = ['todo', 'inprogress', 'done']

	for (const typedColumn of typedColumns) {
		if (!columns.has(typedColumn)) {
			columns.set(typedColumn, {
				id: typedColumn,
				todos: [],
			})
		}
	}

	const sortedColumns = new Map(
		Array.from(columns.entries()).sort(
			(a, b) => typedColumns.indexOf(a[0]) - typedColumns.indexOf(b[0])
		)
	)

	const board: IBoard = {
		columns: sortedColumns,
	}

	return board
}
