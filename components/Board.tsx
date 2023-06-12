'use client'

import { useEffect } from 'react'
import {
	DragDropContext,
	DropResult,
	Droppable,
	DroppableProvided,
	DroppableStateSnapshot,
} from 'react-beautiful-dnd'

import BoradItem from './BoradItem'
import { useBoardStore } from '@/store/BoardStore'
import { Column } from '@/types/board'

const Board = () => {
	const { getBoard, board, setBoardState, updateTodoInDb, searchTerm } =
		useBoardStore((state) => state)

	const onDragEnd = (result: DropResult) => {
		const { destination, source, type } = result

		if (!destination) return

		if (type === 'column') {
			const entries = Array.from(board.columns.entries())
			const removed = entries.splice(source.index, 1)[0]
			entries.splice(destination.index, 0, removed)
			const rearrangeColumns = new Map(entries)
			setBoardState({
				...board,
				columns: rearrangeColumns,
			})
		}
		const columns = Array.from(board.columns)
		const startColIndex = columns[Number(source.droppableId)]
		const endColIndex = columns[Number(destination.droppableId)]

		const startCol: Column = {
			id: startColIndex[0],
			todos: startColIndex[1].todos,
		}
		const finishCol: Column = {
			id: endColIndex[0],
			todos: endColIndex[1].todos,
		}

		if (!startCol || !finishCol) return

		if (source.index === destination.index && startCol === finishCol) return

		const newStartTodos = startCol.todos
		const removed = newStartTodos.splice(source.index, 1)[0]

		if (startCol.id === finishCol.id) {
			newStartTodos.splice(destination.index, 0, removed)
			const newColumn = {
				id: startCol.id,
				todos: newStartTodos,
			}
			const newColumns = new Map(board.columns)
			newColumns.set(startCol.id, newColumn)
			setBoardState({
				...board,
				columns: newColumns,
			})
		} else {
			const finishTodos = Array.from(finishCol.todos)
			finishTodos.splice(destination.index, 0, removed)
			const newColumns = new Map(board.columns)
			const newStartCol = {
				id: startCol.id,
				todos: newStartTodos,
			}
			newColumns.set(startCol.id, newStartCol)

			const newFinishCol = {
				id: finishCol.id,
				todos: finishTodos,
			}

			newColumns.set(finishCol.id, newFinishCol)
			updateTodoInDb(removed, finishCol.id)

			setBoardState({
				...board,
				columns: newColumns,
			})
		}
	}

	useEffect(() => {
		getBoard()
	}, [getBoard])

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="board" direction="horizontal" type="column">
					{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="grid grid-col-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto "
						>
							{Array.from(board.columns.entries()).map(
								([id, column], index) => (
									<BoradItem
										key={id}
										id={id}
										index={index}
										todos={column.todos}
									/>
								)
							)}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</>
	)
}

export default Board
