import {io} from 'socket.io-client';

const socket = io(
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_URL // 배포 환경에서는 이 URL 사용
        : process.env.REACT_APP_LOCALHOST_URL // 개발 환경에서는 이 URL 사용
);

export default socket;