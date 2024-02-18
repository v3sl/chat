import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/auth/Auth';
import { Chat } from './components/chat/Chat';

export const App = () => {
	const token = localStorage.getItem('Authorization');
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={token ? <Navigate to='/chat' /> : <Navigate to='/signin' />}
				/>
				<Route path='/signup' element={<Login type='up' />} />
				<Route path='/signin' element={<Login type='in' />} />
				<Route path='/chat' element={<Chat />} />
			</Routes>
		</BrowserRouter>
	);
};
