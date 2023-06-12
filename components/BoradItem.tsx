import { PlusCircleIcon } from '@heroicons/react/24/solid'
import {
	Draggable,
	DraggableProvided,
	DraggableStateSnapshot,
	Droppable,
	DroppableProvided,
	DroppableStateSnapshot,
} from 'react-beautiful-dnd'

import Todo from './Todo'
import { useBoardStore } from '@/store/BoardStore'
import { useModalStore } from '@/store/ModalStore'
import { ITodo, TypedColumn } from '@/types/board'

interface IBoardItem {
	id: TypedColumn
	index: number
	todos: ITodo[]
}

const idToColumnText: {
	[key in TypedColumn]: string
} = {
	todo: 'To Do',
	inprogress: 'In Progress',
	done: 'Done',
}
const BoradItem = ({ id, index, todos }: IBoardItem) => {
	const { searchTerm, setNewTaskType } = useBoardStore((state) => state)
	const { openModal } = useModalStore((state) => state)

	const handleOpenModal = () => {
		setNewTaskType(id)
		openModal()
	}
	return (
		<Draggable draggableId={id} index={index}>
			{(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					<Droppable droppableId={index.toString()} type="card">
						{(
							provided: DroppableProvided,
							snapshot: DroppableStateSnapshot
						) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className={`pb-2 p-2 rounded-2xl shadow-sm ${
									snapshot.isDraggingOver ? 'bg-green-200 ' : 'bg-white/50'
								}`}
							>
								<h2 className="text-black p-2 font-bold text-2xl  flex items-center justify-between">
									{idToColumnText[id]}
									{!!todos.length && (
										<span className="text-sm text-gray-500 bg-gray-200  font-normal px-2 py-1 rounded-full">
											{!searchTerm
												? todos.length
												: todos.filter((item) =>
														item.title
															.toLowerCase()
															.includes(searchTerm.toLowerCase())
												  ).length}
										</span>
									)}
								</h2>
								<div className="space-y-2">
									{todos.map((todo, index) => {
										if (
											searchTerm &&
											!todo.title
												.toLowerCase()
												.includes(searchTerm.toLowerCase())
										)
											return null

										return (
											<Draggable
												key={todo.$id}
												draggableId={todo.$id}
												index={index}
											>
												{(provided) => (
													<Todo
														id={id}
														innerRef={provided.innerRef}
														draggableProps={provided.draggableProps}
														dragHandlerProps={provided.dragHandleProps}
														item={todo}
														index={index}
													/>
												)}
											</Draggable>
										)
									})}
									{provided.placeholder}
									<div className="flex items-center justify-end p-2">
										<button
											onClick={handleOpenModal}
											className="text-green-500 hover:text-green-600 transition"
										>
											<PlusCircleIcon className="h-10 w-10 " />
										</button>
									</div>
								</div>
							</div>
						)}
					</Droppable>
				</div>
			)}
		</Draggable>
	)
}

export default BoradItem
