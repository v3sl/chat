import SendIcon from '@mui/icons-material/Send';
import { Button } from '@mui/material';
import { AxiosError } from 'axios';
import {
	KeyboardEvent,
	MutableRefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import tokenService from '../../service/token.service';
import userService from '../../service/user.service';
import { socket } from '../../socket';
import { ConnectedUser } from '../../types/types';
import { Message } from '../ui/message/Message';
import { Sidebar } from '../ui/sidebar/Sidebar';
import styles from './chat.module.scss';

type Message = {
	id: number;
	userId: number;
	text: string;
	createdAt: Date;
	user: {
		name: string;
	};
};

export const Chat = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [users, setUsers] = useState<ConnectedUser[]>([]);
	const inputRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
	const messagesContainerRef: MutableRefObject<HTMLDivElement | null> =
		useRef(null);
	useEffect(() => {
		const handleRecMessage = (response: Message) => {
			setMessages(prevMessages => [...prevMessages, response]);
		};

		const getConnectedUsers = () => {
			socket.emit('getJoinedUsers', {}, (response: ConnectedUser[]) => {
				setUsers([...response]);
			});
		};

		const configureSocket = () => {
			socket.on('disconnect', () => {
				console.log('d');
			});
			socket.on('accessGranted', () => {
				socket.emit('join');
				getConnectedUsers();
				socket.emit('findAllMessages', {}, (response: Message[]) => {
					setMessages([...response]);
				});
			});

			socket.on('recMessage', handleRecMessage);
			socket.on('userJoin', getConnectedUsers);
			socket.on('userExit', getConnectedUsers);
			socket.on('message', async data => {
				if (data.event !== 'error') return;
				if (data.data.message !== 'Access Denied')
					console.log(data.data.message);
				else {
					try {
						await userService.refreshTokens();
						socket.auth = {
							authorization: localStorage.getItem('Authorization') ?? '',
						};
						socket.connect();
					} catch (error) {
						if (!(error instanceof AxiosError)) return;
						if (error.response?.data.message === 'Unauthorized')
							navigate('/signin');
					}
				}
			});

			socket.connect();
		};

		let timerId = setTimeout(async function refresh() {
			socket.disconnect();
			await userService.refreshTokens();
			socket.auth = {
				authorization: localStorage.getItem('Authorization') ?? '',
			};
			socket.connect();
			timerId = setTimeout(refresh, 1000 * 60 * 13);
		}, 1000 * 60 * 13);

		configureSocket();

		const disableSocket = () => {
			socket.emit('exit');
			socket.off('recMessage', handleRecMessage);
			socket.off('userJoin', getConnectedUsers);
			socket.off('userExit', getConnectedUsers);
			socket.disconnect();
		};

		const handleBeforeUnload = () => {
			clearInterval(timerId);
			disableSocket();
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			clearInterval(timerId);
			disableSocket();
		};
	}, []);

	const navigate = useNavigate();

	const sendMessage = () => {
		if (!inputRef.current?.innerText) return;
		const text = inputRef.current?.innerText.trim().replace(/^\n+|\n+$/g, '');
		if (!text) return;
		socket.emit('createMessage', { text });
		inputRef.current!.innerText = '';
	};

	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) return;
		container.scrollTop = container.scrollHeight;
	}, [messages]);

	return (
		<>
			<div className={styles.mainContainer}>
				<Sidebar className={styles.sideContainer} users={users} />
				<div className={styles.chatContainer}>
					<div className={styles.messagesContainer} ref={messagesContainerRef}>
						{messages.map(msg => (
							<Message
								key={msg.id}
								createdAt={msg.createdAt}
								text={msg.text}
								username={msg.user.name}
								variant={
									tokenService.getPayload(
										localStorage.getItem('Authorization') ?? ''
									).username === msg.user.name
										? 'sended'
										: 'received'
								}
							/>
						))}
					</div>
					<div className={styles.inputContainer}>
						<div
							className={styles.inputArea}
							contentEditable
							ref={inputRef}
							onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
								if (event.key === 'Enter' && !event.shiftKey) {
									event.preventDefault();
									sendMessage();
								}
							}}
						/>
						<Button
							onClick={sendMessage}
							endIcon={<SendIcon />}
							className={styles.sendButton}
							sx={{
								color: 'rgb(240, 240, 240)',
							}}
						>
							<div className={styles.sendButtonText}>Send</div>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
