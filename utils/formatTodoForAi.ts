import { IBoard, ITodo, TypedColumn } from '@/types/board'

export const formatTodoForAi = (board: IBoard) => {
	const todos = Array.from(board.columns.entries())
	const flatArray = todos.reduce((map, [key, value]) => {
		map[key] = value.todos
		return map
	}, {} as { [key in TypedColumn]: ITodo[] })

	const flatArrayCounted = Object.entries(flatArray).reduce(
		(map, [key, value]) => {
			map[key as TypedColumn] = value.length
			return map
		},
		{} as { [key in TypedColumn]: number }
	)

	return flatArrayCounted
}
