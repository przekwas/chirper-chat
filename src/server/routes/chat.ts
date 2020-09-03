import * as express from 'express';
import knex from '../db';
import { io } from '../server';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const chat = await knex('chat').select().orderBy('created_at', 'desc');
		res.json(chat);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'fuck', error });
	}
});

router.post('/', async (req, res) => {
	const newMessage = req.body;
	newMessage.id = uuidv4();
	try {
		await knex('chat').insert(newMessage);
		io.emit('newMessage');
		res.json({ msg: 'inserted new message', id: newMessage.id });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'fuck', error });
	}
});

export default router;
