import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
	transports: ['websocket'],
	autoConnect: false,
	auth: {
		authorization: localStorage.getItem('Authorization') ?? '',
	},
	withCredentials: true,
});
