import {io} from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_LOCALHOST_URL);

export default socket;