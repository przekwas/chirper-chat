import * as React from 'react';
import * as moment from 'moment';
import * as socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000/';

const App = (props: AppProps) => {
	const [name, setName] = React.useState<string>('');
	const [message, setMessage] = React.useState<string>('');
	const [login, setLogin] = React.useState<boolean>(false);
	const [chat, setChat] = React.useState<IChat[]>([]);

	React.useEffect(() => {
		(async function () {
			const res = await fetch('/api/chat');
			const chat = await res.json();
			setChat(chat);
		})();
	}, []);

	React.useEffect(() => {
		const socket = socketIOClient(ENDPOINT);
		socket.on('newMessage', () => {
			(async function () {
				const res = await fetch('/api/chat');
				const chat = await res.json();
				setChat(chat);
			})();
		});

		return () => socket.disconnect();
	}, []);

	const clickLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!name.trim().length) return;

		setLogin(true);
	};

	const type = async (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();
		await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, message })
		});
		setMessage('');
	};

	if (!login || !name) {
		return (
			<main className="container">
				<section className="row justify-content-center align-items-center min-vh-100">
					<div className="col-md-6">
						<form className="form-group bg-light border rounded-lg p-5">
							<input
								value={name}
								onChange={e => setName(e.target.value)}
								type="text"
								placeholder="yo chirpin' name ..."
								className="form-control form-control-lg"
							/>
							<div className="d-flex justify-content-end mt-3">
								<button
									onClick={clickLogin}
									className="btn btn-primary btn-lg shadow-sm">
									Let's Go
								</button>
							</div>
						</form>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="container mt-1">
			<section className="row min-vh-100">
				<div className="offset-md-3 col-md-6">
					<form onSubmit={type}>
						<input
							value={message}
							onChange={e => setMessage(e.target.value)}
							type="text"
							placeholder="yo message ..."
							className="form-control form-control-lg"
						/>
					</form>
				</div>
				<div className="offset-md-3 col-md-6 h-100 bg-white">
					<ul className="list-group list-group-flush">
						{chat.map(msg => (
							<li className="list-group-item d-flex justify-content-between py-4">
								<div><i>{msg.name}:</i> <b>{msg.message}</b></div>
								<small className="text-muted">
									{moment(msg.created_at).fromNow()}
								</small>
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
};

type AppProps = {};

type IChat = {
	id: string;
	name: string;
	message: string;
	created_at: string;
};

export default App;
