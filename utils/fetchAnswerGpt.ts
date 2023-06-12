import { formatTodoForAi } from './formatTodoForAi'
import { IBoard } from '@/types/board'

export const fetchAnswer = async (board: IBoard) => {
	const todos = formatTodoForAi(board)

	const res = await fetch('/api/generateSummary', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ todos }),
	})
	const gptData = await res.json()
	const { content } = gptData
	return content
}
