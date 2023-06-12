'use client'

import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import cl from 'classnames'
import styles from './Task.module.scss'
import { useBoardStore } from '@/store/BoardStore'
import { types } from '@/utils/radio-group'
import { checkIsOnDemandRevalidate } from 'next/dist/server/api-utils'

const TaskTypeRadioGroup = () => {
	const { newTaskType, setNewTaskType } = useBoardStore((state) => state)

	return (
		<div className="w-full py-5">
			<div className="mx-auto w-full max-w-md">
				<RadioGroup onChange={(e) => setNewTaskType(e)} value={newTaskType}>
					<div className="space-y-2">
						{types.map((type) => (
							<RadioGroup.Option
								value={type.id}
								key={type.id}
						    className={({active,checked})=>{
                  return cl(styles.radio,checked&&type.bg,{
										[styles.active]:active,
										[styles.checked]:checked,
									
								 })
								}}				 
							>
								{({ active, checked }) => (
									<>
										<div className="w-full flex items-center justify-between">
											<div className="flex items-center">
												<div className="text-sm">
													<RadioGroup.Label
														as="p"
														className={`font-medium ${
															checked ? 'text-white' : 'text-gray-900'
														}`}
													>
														{type.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as="span"
														className={`inline ${
															checked ? 'text-white' : 'text-gray-500'
														}`}
													>
														<span>{type.description}</span>
													</RadioGroup.Description>
												</div>
											</div>
											{checked && (
												<div className="shrink-0 text-white">
													<CheckCircleIcon className="h-6 w-6" />
												</div>
											)}
										</div>
									</>
								)}
							</RadioGroup.Option>
						))}
					</div>
				</RadioGroup>
			</div>
		</div>
	)
}

export default TaskTypeRadioGroup
