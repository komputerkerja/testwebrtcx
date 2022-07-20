let Socket, canvas, ctx, userVideo, userName, 
    video, guestCtx

window.addEventListener('load', init, false)

function init(){
    guestCtx = guestcanvas.getContext('2d')
    guestcanvas.width=380
    guestcanvas.height=300

    userName = "user"+Date.now()+""+Math.floor(Math.random()*10000)
    video = document.createElement('video')
    canvas = document.querySelector('#mycanvas')
    ctx = canvas.getContext('2d')
    userVideo = document.querySelector('.user-video')
    video.width=150
    video.height=90
    canvas.width=380
    canvas.height=300
    navigator.mediaDevices.getUserMedia({video:true})
    .then(stream => {
        video.srcObject = stream
        video.play()
        video.addEventListener('loadedmetadata', e => {
            userVideo.append(video)
            setInterval(() => {
                ctx.drawImage(video,0,0,canvas.width,canvas.height)
                Socket.send(canvas.toDataURL())
            },100)
        })
    }).catch(err=>console.log(err))
}

Socket = new WebSocket('ws://' + window.location.hostname + ':8082')
Socket.onopen = e => console.log('connected')
Socket.onmessage = data => {
    myimg.src = data.data
    guestCtx.drawImage(myimg,0,0,guestcanvas.width,guestcanvas.height)
}
