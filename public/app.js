window.addEventListener('load', init, false)
const socket = io()
const userName = "user"+Date.now()+""+Math.floor((Math.random()*100000))
const guestCanvas = document.querySelector('.guest-video')
guestCanvas.width = innerWidth*0.8
guestCanvas.height = innerHeight*0.8
const guestCtx = guestCanvas.getContext('2d')

function init(){
    const video = document.createElement('video')
    const userVideo = document.querySelector('.user-video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width=innerWidth
    canvas.height=innerHeight
    canvas.style.display = "none"
    document.body.append(canvas)
    let lastTime = 0
    let fps = 60
    let frameInterval = 1000/fps
    let frameElapsed = 0

    video.width=100
    video.height=100
    navigator.mediaDevices.getUserMedia({video:true})
    .then(stream => {
        video.srcObject = stream
        video.play()
        video.addEventListener('loadedmetadata', e => {
            userVideo.append(video)
            animate(0)
        })
    })
    .catch(err => console.log(err))
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        
        if(frameElapsed%frameInterval==0){
            ctx.drawImage(video,0,0,canvas.width,canvas.height)
            let imgData = canvas.toDataURL();
            socket.emit('stream', {user: userName, stream: imgData})
            frameElapsed = 0
        } else frameElapsed += deltaTime

        requestAnimationFrame(animate)
    }
} 

socket.on('message', data => {
    console.log(data)
})

socket.on('stream', data => {
    // if(data.user!=userName){
        let myImage = new Image();
        myImage.src = data.stream;
        guestCtx.drawImage(myImage, 0, 0,guestCanvas.width,guestCanvas.height);
    // }
})