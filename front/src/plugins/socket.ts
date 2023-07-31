import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_APP_API_URL,{
    path : '/api/ws',
    transports: ['websocket']
})

socket.on("connect", () => {
    console.log("socket connection etablish"); 
  });

export default socket