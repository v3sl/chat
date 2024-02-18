import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

type ModalProps = {
	closeModal: () => void;
	text: string;
};

export const Modal: React.FC<ModalProps> = props => {
	const [open, setOpen] = React.useState(true);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<React.Fragment>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
				sx={{
					whiteSpace: 'pre-line',
				}}
			>
				<DialogTitle id='alert-dialog-title'>{'Input Error'}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{props.text}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={props.closeModal} autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
