import { jwtDecode } from 'jwt-decode';

type TokenPaylad = {
	email: string;
	id: number;
	username: string;
};

class TokenService {
	getPayload(token: string): TokenPaylad {
		return jwtDecode(token);
	}
}

export default new TokenService();
