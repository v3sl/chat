import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../service/user.service';
import { Modal } from '../modal/Modal';

const defaultTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

type AuthProps = {
	type: 'in' | 'up';
};

export default function Auth(props: AuthProps) {
	const navigate = useNavigate();

	const [errorInfo, setErrorInfo] = React.useState<string>('');
	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const rPassword = data.get('retype password')?.toString();
		if (props.type == 'up' && rPassword !== password) {
			setErrorInfo('passwords are not same');
			setModalOpen(true);
		}
		const username = data.get('username')?.toString();
		try {
			if (props.type == 'in') {
				await userService.signIn(email, password);
			} else await userService.signUp(email, username, password);
			navigate('/chat');
		} catch (error) {
			if (!(error instanceof AxiosError)) return;
			if (typeof error.response?.data.message === 'string')
				setErrorInfo(error.response?.data.message);
			else setErrorInfo((error.response?.data.message as string[]).join('\n'));
			setModalOpen(true);
		}
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						{`Sign ${props.type}`}
					</Typography>
					<Box
						component='form'
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoFocus
						/>
						{props.type === 'up' && (
							<TextField
								margin='normal'
								required
								fullWidth
								id='username'
								label='User Name'
								name='username'
								autoFocus
							/>
						)}
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
						/>
						{props.type === 'up' && (
							<TextField
								margin='normal'
								required
								fullWidth
								name='retype password'
								label='Retype password'
								type='password'
								id='retype_password'
							/>
						)}
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
						>
							{`Sign ${props.type}`}
						</Button>
						<Grid container>
							<Grid item container justifyContent={'center'}>
								<Link
									href={`/sign${props.type === 'in' ? 'up' : 'in'}`}
									variant='body2'
								>
									{props.type === 'in'
										? "Don't have an account? Sign Up"
										: 'Already have an account? Sign In'}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				{modalOpen && (
					<Modal text={errorInfo} closeModal={() => setModalOpen(false)} />
				)}
			</Container>
		</ThemeProvider>
	);
}
