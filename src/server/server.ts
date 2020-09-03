import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as compression from 'compression';
import * as morgan from 'morgan';
import apiRouter from './routes';

const app = express();
const server = new http.Server(app);
export const io = socketIO(server);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));

io.on('connection', () => {
	console.log('a user is connected');
});

app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server listening on port: ${port}`));