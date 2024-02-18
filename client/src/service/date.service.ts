class DateService {
	formatDate(date: Date) {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();

		return `${year}-${month}-${day} ${hours}:${
			minutes >= 10 ? minutes : `0${minutes}`
		}`;
	}
}

export default new DateService();
