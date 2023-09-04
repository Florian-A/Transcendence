import '../styles/ProfileSetting.css';
import '../styles/Chat.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Title } from './ProfileSetting';

import eyeopen from '../assets/eyeopen.svg';
import eyeclose from '../assets/eyeclose.svg';
import { Link, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";

import Form from 'react-bootstrap/Form';
import { socket } from '../utils/socket';
import { useEffect, useRef, useState } from 'react';
import { proxy } from 'valtio';
import { Socket } from 'socket.io-client';
import { ListGroup } from 'react-bootstrap';
import { io } from "socket.io-client";

import { useLocation } from 'react-router-dom';


type message = {
	id: string,
	date: Date,
	from: string,
	to: string,
	content: string,
}


//get chat content according to id
export function ChatBox() {
	const { chatId } = useParams();
	const [mess, setMess] = useState('');

	//get old message; nickname
	const messages: message[] = [
		{ id: '1', date: new Date(), from: 'pigeon', to: 'me', content: 'coucou' },
		{ id: '2', date: new Date(), from: 'pigeon', to: 'me', content: 'Got any peanuts?' },
		{ id: '3', date: new Date(), from: 'me', to: 'pigeon', content: 'Hi' },
		{ id: '4', date: new Date(), from: 'me', to: 'pigeon', content: 'I got something better long textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong text' },
		{ id: '4', date: new Date(), from: 'pigeon', to: 'me', content: 'I got something better long textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong textlong text' }
	];

	const myMap = (message: message) => {
		const classname = (message.to == 'me') ? 'messageBlue' : 'messagePink';

		return (
			<li key={message.id} className={classname} >
				{message.content}
			</li>
		);
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		//send message to server
		setMess('');
	}

	return (
		<div className='h-100 d-flex flex-column'>
			<div className='d-flex w-100 align-items-center p-1 ps-sm-5' style={{ backgroundColor: "black" }}>
				<span className='d-sm-none'>
					<Link to=".."><button className='goBack'></button></Link>
				</span>
				<h4 style={{ color: "white", margin: "auto 0" }}>{chatId}</h4>
			</div>

			<div className='p-5 flex-grow' style={{ overflowY: 'auto' }}>
				<ul className='nostyleList d-flex flex-column' style={{ color: 'white' }}>
					{messages.map(myMap)}
					{messages.map(myMap)}
					{messages.map(myMap)}
					{messages.map(myMap)}
				</ul>
			</div>

			<div className='mb-5 mb-sm-0 p-3  d-flex align-items-center'>
				<input className='p-2 flex-grow-1' style={{ borderRadius: '10px' }}
					value={mess}
					onChange={(e) => setMess(e.target.value)} />
				<button className='send-message' onClick={handleClick}></button>
			</div>
		</div>
	);
}

type formProp = {
	label: string,
	button: 'Send' | 'Join' | 'Create',
	value: string,
	setValue: React.Dispatch<React.SetStateAction<string>>,
}
const users = [
	{ id: 1, username: 'user1', avatar: 'url_de_l_avatar' },
	{ id: 2, username: 'user2', avatar: 'url_de_l_avatar' },
];



// export function Chat() {
// 	const message = useRef('');
// 	useEffect(() => {
// 		state.socketClient = socket
// 		return () => {
// 			if (state.socketClient) state.socketClient.disconnect()
// 		}
// 	}, [])

const MyForm = ({ label, button, value, setValue }: formProp) => {
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>,
		type: 'Send' | 'Join' | 'Create', value: string, setValue: React.Dispatch<React.SetStateAction<string>>) {
		e.preventDefault();
		setValue('');
	}

	return (
		<form className='d-flex flex-column align-items-center p-2 gap-2'
			onSubmit={(e) => handleSubmit(e, button, value, setValue)}>
			<label
				className='w-75'
				htmlFor='private-message'>
				{label}
			</label>
			<input
				id='private-message'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className='w-75' />
			<button type='submit' className='btn btn-outline-secondary w-75'>
				{button}
			</button>
		</form>
	);
}

function NewChat({ setPage }: { setPage: React.Dispatch<React.SetStateAction<"chatList" | "newChat">> }) {

	const [nick, setNick] = useState('');
	const [join, setJoin] = useState('');
	const [create, setCreate] = useState('');

	return (
		<div className='w-100 h-100 d-flex flex-column p-1 pb-5 pb-sm-0 m-0' style={{ color: 'white', overflowY: 'auto' }}>
			<button className='cross ms-auto' onClick={() => setPage('chatList')} />
			<MyForm label='Private message to:' button='Send' value={nick} setValue={setNick} />
			<MyForm label='Join a group:' button='Join' value={join} setValue={setJoin} />
			<MyForm label='Create a group' button='Create' value={create} setValue={setCreate} />
		</div>
		// <>
		// 	<Container>
		// 		<Form.Control type="text" placeholder="Chat anything"
		// 			onChange={msg => message.current = msg.target.value}
		// 			onKeyDown={handleKeyDown} />
		// 		<ChatView socket={socket} />
		// 		<Row>
		// 			<Col md={4}>
		// 				<ListGroup>
		// 					{users.map((user) => (
		// 						<ListGroup.Item key={user.id} className="d-flex align-items-center">
		// 							<Image src={user.avatar} roundedCircle className="mr-2" width={40} height={40} />
		// 							{user.username}
		// 						</ListGroup.Item>
		// 					))}
		// 				</ListGroup>
		// 			</Col>
		// 			<Col md={8}>
		// 				{/* Contenu de la page principale */}
		// 			</Col>
		// 		</Row>
		// 	</Container>
		// </>
	)
}

function ChatList() {
	const [page, setPage] = useState<'chatList' | 'newChat'>('chatList');
	//get all chat
	const chatList = ['fox', 'crow', 'crowGroup'];

	const myMap = (name: string) => {
		return (
			<li key={name}>
				<Link to={name} className='link-text' style={{ color: 'white' }}>
					<div className='chatListItem'>{name}</div>
				</Link>
			</li>
		)
	}

	return (
		<div className='w-100 h-100 d-flex flex-column'>
			{page == 'newChat' && <NewChat setPage={setPage} />}
			{page == 'chatList' &&
				<>
					<div className='d-flex w-100 align-items-center p-2 ps-4 ps-sm-2' style={{ backgroundColor: "black" }}>
						<h4 style={{ color: "white", margin: "auto 0" }}>Chat</h4>
						<button className='new-chat ms-auto' onClick={() => setPage('newChat')} />
					</div>

					<div className='flex-grow-1 pb-5 pb-sm-0' style={{ overflowY: 'auto' }}>
						<ul className='nostyleList py-0' >
							{chatList.map(myMap)}
							{/* {chatList.map(myMap)}
							{chatList.map(myMap)}
							{chatList.map(myMap)}
							{chatList.map(myMap)}
							{chatList.map(myMap)} */}
						</ul>
					</div>
				</>}
		</div>
	);
}


export function Chat() {

	const location = useLocation();
	const classname1 = location.pathname == '/chat' ? '' : 'd-none d-sm-flex';
	const classname2 = location.pathname == '/chat' ? 'd-none d-sm-flex' : '';

	return (
		<div className='container-fluid h-100' >
			<div className='row h-100' >
				<div className={`col-12 col-sm-3 p-0 m-0 h-100 ${classname1}`} >
					<ChatList />
				</div>
				<div className={`col-12 col-sm-9 p-0 m-0 h-100 ${classname2}`}>
					<Outlet />
				</div>
			</div>
		</div>
	);
}

















// const state = proxy({
// 	socketClient: null as Socket | null,
// })

// interface Props {
// 	socket: Socket;
// }

// function ChatView(props: Props) {
// 	const [messages, setMessages] = useState<any[]>([]);

// 	useEffect(() => {
// 		// Update the messages state whenever new messages are received
// 		props.socket.on('receiveMessage', (newMessages: any) => {
// 			console.log('RECEIVE MESSAGE', newMessages)
// 			setMessages(newMessages);
// 		});
// 	}, [props.socket]);

// 	return (
// 		<>
// 			<ListGroup>
// 				{messages.map((message) =>
// 					<ListGroup.Item key={message.id}>{message.message}</ListGroup.Item>)}
// 			</ListGroup>
// 		</>
// 	);
// }

// export function Chat() {
// 	const message = useRef('');
// 	useEffect(() => {
// 		state.socketClient = socket
// 		return () => {
// 			if (state.socketClient) state.socketClient.disconnect()
// 		}
// 	}, [])

// 	const handleKeyDown = (event: any) => {
// 		if (event.key === 'Enter') {
// 			event.preventDefault();
// 			socket.emit('sendMessage', message.current);
// 			message.current = '';
// 		}
// 	};

// 	useEffect(() => {
// 		if (state.socketClient) {
// 			socket.on('connect', function () {
// 				console.log('connected to messages')
// 			})
// 			socket.on('disconnect', function (message: any) {
// 				console.log('disconnect ' + message)
// 			})
// 		}
// 	}, [state.socketClient])
// 	return (
// 		<>
// 			<Form.Control type="text" placeholder="Chat anything"
// 				onChange={msg => message.current = msg.target.value}
// 				onKeyDown={handleKeyDown} />
// 			<ChatView socket={socket} />
// 			<Outlet />
// 		</>
// 	)
// }