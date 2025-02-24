



export const Connection = () => {

   const socket = io("https://manithbbratnayake.com:3000");
   

   socket.on('connect', () => {
     console.log("Connected to the server");
   })

  socket.emit("message", "Hello Server")

  socket.on()
  
  socket.on('disconnect', () => {
    console.log("Disconnected from the server")
  })
  
}


