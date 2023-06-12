import { NextResponse } from 'next/server'

import openai from '@/openai'

export async function POST(request: Request) {
	const { todos } = await request.json()

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		temperature: 0.8,
		n: 1,
		stream: false,
		messages: [
			{
				role: 'system',
				content:
					'Добро пожаловать пользователь доски Trello.Здесь будут появляться сообщения о твоих достижениях в течении твоего дня!!Ответ  желательно сформировать в 400 символов',
			},
			{
				role: 'user',
				content: `Привет.Дай пожалуйста краткое изложение моих дел.Что нужно сделать - это подсчитать сколько у меня дел запланировано на день, какие в процессе выполнения, какие уже готовы, какие только нужно сделать из  запланированных дел:${JSON.stringify(
					todos
				)} `,
			},
		],
	})
	const { data } = response

	return NextResponse.json(data.choices[0].message)
}
