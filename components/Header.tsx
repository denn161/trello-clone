'use client'

import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import Avatar from 'react-avatar'

import { useBoardStore } from '@/store/BoardStore'
import { fetchAnswer } from '@/utils/fetchAnswerGpt'

const Header = () => {
	const [loading, setLoading] = useState(false)
	const [answer, setAnswer] = useState('')

	const { setSearchTerm, searchTerm, board } = useBoardStore((state) => state)

	useEffect(() => {
		if (board.columns.size === 0) return
		setLoading(true)
		const getAnswer = async () => {
			const answerGpt = await fetchAnswer(board)
			setAnswer(answerGpt)
			setLoading(false)
		}
		getAnswer()
	}, [board])

	return (
		<header>
			<div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055d1] rounded-md filter blur-3xl opacity-50 -z-50" />
			<div className="flex flex-col md:flex-row w-full p-5 bg-gray-500/10 rounded-b-2xl justify-between">
				<Image
					src={'https://links.papareact.com/c2cdd5'}
					alt="Trello Img"
					priority={true}
					width={300}
					height={100}
					className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
				/>
				<div className="flex items-center space-x-5">
					<form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
						<MagnifyingGlassIcon className="h-6 w-6 text-gray-400 opacity-75 transition-opacity hover:opacity-100" />
						<input
							type="text"
							value={searchTerm}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setSearchTerm(e.target.value)
							}
							placeholder="Search"
							className="flex-1 outline-none  p-2 "
						/>
						<button type="submit" hidden>
							Search
						</button>
					</form>
					<Avatar name="denn161" size="50" round color="#0055d1" />
				</div>
			</div>
			<div className="flex items-center justify-center px-5 py-2 md:py-5 ">
				<p className="flex items-center space-x-4 text-sm font-light p-5 pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055d1]">
					<UserCircleIcon
						className={`inline-block h-10 w-10 text-[#0055d1] mr-1 ${
							loading&& 'animate-spin'
						}`}
					/>
					{answer && !loading
						? answer
						: 'Gpt подводит итоги ваше рабочего дня....'}
				</p>
			</div>
		</header>
	)
}

export default Header
