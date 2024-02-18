import { HTMLAttributes } from 'react';
import dateService from '../../../service/date.service';
import styles from './message.module.scss';

type MessageProps = HTMLAttributes<HTMLDivElement> & {
	variant: 'sended' | 'received';
	text: string;
	username: string;
	createdAt: Date;
};

export const Message: React.FC<MessageProps> = props => {
	return (
		<div
			className={[
				styles.container,
				props.variant === 'received' ? styles.left : styles.right,
			].join(' ')}
		>
			<div className={styles.username}>{props.username}</div>
			<div className={styles.text}>{props.text}</div>
			<div className={styles.datetime}>
				{dateService.formatDate(new Date(props.createdAt))}
			</div>
		</div>
	);
};
