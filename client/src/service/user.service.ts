import axios from 'axios';

type Tokens = {
	accessToken: string;
};

const API = axios.create({
	baseURL: 'http://localhost:3000/auth',
	withCredentials: true,
});

class UserService {
	async signIn(email: string | undefined, password: string | undefined) {
		const { data } = await API.post<Tokens>('/signin', {
			email,
			password,
		});
		localStorage.setItem('Authorization', 'Bearer ' + data.accessToken);
	}
	async signUp(
		email: string | undefined,
		username: string | undefined,
		password: string | undefined
	) {
		const { data } = await API.post<Tokens>('/signup', {
			email,
			password,
			name: username,
		});
		localStorage.setItem('Authorization', 'Bearer ' + data.accessToken);
	}

	async refreshTokens() {
		const { data } = await API.get<Tokens>('/refresh');
		localStorage.setItem('Authorization', 'Bearer ' + data.accessToken);
	}
}

export default new UserService();
