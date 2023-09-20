import {useEffect, useState} from 'react';
import { socket } from '../utils/socket';

type UserDto = {
	id: number,
	username: string,
	avatar: any,
	onlineStatus: 'ONLINE' | 'OFFLINE' | 'INGAME',
}

function FriendList({ friends }: { friends: UserDto[]}) {
	
	const myMap = (user: UserDto) => {
		return (
			<li key={user.id}>
				{user.username}
			</li>
		)
	}

	return (
		<ul>
			<p style={{color: 'white'}}>FriendList</p>
			{(friends.length == 0) ? (
				<p style={{ color: 'white' }}>
					Nothing
				</p>
			) : (
				friends.map(myMap))}
		</ul>
	);
}

function FriendReqList({ reqs, setReqs }: { reqs: UserDto[], setReqs: React.Dispatch<React.SetStateAction<UserDto[]>> }) {

	async function handleClick(
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
		possibleFriend: string, 
		result: boolean
	) {
		e.preventDefault();
		socket.emit('replyReq', {nick: possibleFriend, result}, (success: boolean) => {
			if (success) {
				const update = reqs.filter((x) => (x.username != possibleFriend))
				setReqs(update);
			}
		})	
	}
	
	const myMap = (user: UserDto) => {
		return (
			<li key={user.id}>
				<div>
					<p style={{color: 'white'}}>
						{user.username}
					</p>
					<button 
						className='btn btn-primary' 
						onClick={(e) => handleClick(e, user.username, true)}>
						Accept
					</button>
					<button 
						className='btn btn-secondary' 
						onClick={(e) => handleClick(e, user.username, false)}>
						Decline
					</button>
				</div>
			</li>
		)
	}

	return (
		<ul>
			<p style={{color: 'white'}}>Friend request</p>
			{(reqs.length == 0) ? (
				<p style={{color: 'white'}}>
					Nothing
				</p> 
			): (
				reqs.map(myMap))}
		</ul>
	);
}

function SendRequest() {
	
	const [nick, setNick] = useState('');
	const [mess, setMess] = useState('');

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		socket.emit('sendReq', nick, (success: boolean) => {
			success ? setMess('Success') : setMess('Fails')
			setNick('');
		})
	}
	
	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<label htmlFor='send-friend-request'>Send friend request</label>
			<input type='text'
				value={nick}
				onChange={(e) => setNick(e.target.value)}
				></input>
			<button type="submit" className=""> send </button>
			<div id='form-message' style={{color: 'white'}}>{mess}</div>
		</form>
	)
}

function BlockList({ blocks, setBlocks }: { blocks: UserDto[], setBlocks: React.Dispatch<React.SetStateAction<UserDto[]>> }) {
	
	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, nick: string) => {
		e.preventDefault();
		// socket.emit('unblock', nick, (success: boolean) => {
		// 	success && setBlocks(blocks.map(() => (

		// 		)))
		// 	}
		// });
	}
	
	const myMap = (user: UserDto) => {
		return (
			<li key={user.id}>
				{user.username}
				<button onClick={(e) => handleClick(e, user.username)}>
					unBlock
				</button>
			</li>
		)
	}
	
	return (
		<ul style={{color: 'white'}}>
			<p>Block list</p>
			{blocks.length == 0 ? (
				<p>Nothing</p>
			) : (
				blocks.map(myMap)
			)}
		</ul>
	)
}

export function Friends() {
	const [friends, setFriends] = useState<UserDto[]>([]);
	const [reqs, setReqs] = useState<UserDto[]>([]);
	const [blocks, setBlocks] = useState<UserDto[]>([]);
	
	useEffect(() => {
		socket.emit('findAllReqs', (res: UserDto[]) => {
			setReqs(res)
			console.log('reqs: ', res)
		})
		socket.emit('findAllBlocks', (res: UserDto[]) => {
			setBlocks(res)
			console.log('blocks: ', res)
		})
	}, [])

	useEffect(() => {
		socket.emit('findAllFriends', (res: UserDto[]) => {
			setFriends(res)
			console.log('friends: ', res)
		})
	}, [reqs])

	return (
		<div style={{color: 'white'}}>
			<SendRequest></SendRequest>
			<FriendReqList reqs={reqs} setReqs={setReqs}></FriendReqList>
			<FriendList friends={friends}></FriendList>
			<BlockList blocks={blocks} setBlocks={setBlocks}></BlockList>
		</div>
	);
}

export default Friends;