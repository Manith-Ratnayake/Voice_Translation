import {useState, useRef, useEffect} from "react"


const main = () => {

  const [audiopermission, setaudiopermission]  =  useState(false);
  const [mediaRecoder, setMediaRecoder]       = useState(false)
  const [chunks, setChunks] = useState(false)
  const [stream, setStream] = useState(null)


  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices 
      .getUserMedia(
        {
          audio:true,
        },
      )

      .then(((stream) => {})
      .catch((err) => {
        alert("Error occured getUserMedia : ", err)
      });
  } else {
    alert("GetMedia does not support")
  }


  record.onclick = () => {
    MediaRecorder.start();
  }

  mediaRecoder.ondataavailable = (e) => {
    chunks.push(e.data)
  }

  
  stop.onclick = () => {
    mediaRecoder.stop()
  }


  mediaRecoder.onstop = (e) => {

  }

  return (
    <>







    </>
  )


}

export default main
