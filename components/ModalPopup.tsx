'use client'

import { Dialog, Transition } from '@headlessui/react'
import { PhotoIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { FormEvent, Fragment, useRef } from 'react'

import TaskTypeRadioGroup from './TaskTypeRadioGroup'
import { useBoardStore } from '@/store/BoardStore'
import { useModalStore } from '@/store/ModalStore'

const ModalPopup = () => {
	const imagePickRef = useRef<HTMLInputElement | null>(null)

	const { isOpen, closeModal } = useModalStore((state) => state)
	const { newTaskInput, setNewTaskInput, setImage, image,addTask,newTaskType } = useBoardStore(
		(state) => state
	)

	const handleSubmit =(e:FormEvent<HTMLFormElement>)=>{
       e.preventDefault() 
			 if(!newTaskInput) return 
       
       addTask(newTaskInput,newTaskType,image)

			 setImage(null)
			 closeModal()
				}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog		
			 onSubmit={handleSubmit}		 		 
			as="form" className="relative z-10" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0  bg-black bg-opacity-25" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900 pb-2"
								>
									Добавление задачи
								</Dialog.Title>
								<div className="mt-2">
									<input
										placeholder="Добавьте задачу"
										value={newTaskInput}
										onChange={(e) => setNewTaskInput(e.target.value)}
										type="text"
										className="w-full border border-gray-300 rounded-md outline-none p-5"
									/>
								</div>
								<TaskTypeRadioGroup />
								<div className='mt-2'>
									<button
										type="button"
										onClick={() => {
											imagePickRef.current?.click()
										}}
										className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
									>
										<PhotoIcon className="w-6 h-6 mr-2 inline-block" />
										Upload image...
									</button>
									{image && (
										<Image
											alt="Upload Image"
											width={200}
											height={200}
											className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
											src={URL.createObjectURL(image)}
											onClick={() => setImage(null)}
										/>
									)}
									<input
										ref={imagePickRef}
										hidden
										onChange={(e) => {
											if (!e.target.files![0].type.startsWith('image/')) return
											setImage(e.target.files![0])
										}}
										type="file"
									/>
								</div>
								<div className='mt-4'>
									<button 
									type='submit' 
									disabled={!newTaskInput}
									className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed">
										Add Task
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default ModalPopup
