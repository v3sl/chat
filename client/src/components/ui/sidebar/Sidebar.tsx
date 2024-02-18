import { FC, HTMLAttributes } from 'react';
import { ConnectedUser } from '../../../types/types';
import styles from './sidebar.module.scss';

type SidebarProps = HTMLAttributes<HTMLDivElement> & {
	users: ConnectedUser[];
};

export const Sidebar: FC<SidebarProps> = props => {
	return (
		<div className={props.className}>
			<div className={styles.title}>Connected Users</div>
			<div className={styles.usersContainer}>
				{props.users.map(user => {
					return (
						<div key={user.id} className={styles.userContainer}>
							{user.name}
						</div>
					);
				})}
			</div>
		</div>
	);
};
