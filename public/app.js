const uservideo = document.getElementById('user-video')
const remotevideo = document.getElementById('remote-video')
const socket = io()
let peer;
let otherId;

socket.on('other join', async data => {
    otherId=data.filter(id=>socket.id!=id)[0]
    await createPeerConnection()
})

socket.on('offer', async ({offer, from}) => {
    otherId = from
    await createPeerConnection()
    await peer.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peer.createAnswer()
    socket.emit('answer', ({answer,from:socket.id,to:otherId}))
    await peer.setLocalDescription(new RTCSessionDescription(answer))
})

socket.on('answer', async ({answer}) => {
    await peer.setRemoteDescription(new RTCSessionDescription(answer))  
})

socket.on('ice candidate', async ({candidate}) => {
    try{
        await peer.addIceCandidate(new RTCIceCandidate(candidate))
        console.log('success add candidate')
    }catch{
        console.warn('failed on add candidate')
    }
})

socket.on('call ended', () => window.location.href = "/")

async function createPeerConnection(){
    peer = new RTCPeerConnection({iceServers:[{urls:'stun:stun.stunprotocol.org'}]})
    const streamUserVideo = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    uservideo.muted=true
    uservideo.srcObject=streamUserVideo
    streamUserVideo.getTracks().forEach(track=>peer.addTrack(track,streamUserVideo))
    // handle peer events
    peer.onicecandidate=handleIceCandidate
    peer.ontrack=handleTrack
    peer.onnegotiationneeded=handleNegotiationneeded
}

async function handleNegotiationneeded(){
    const offer = await peer.createOffer()
    socket.emit('offer',{offer,from:socket.id,to:otherId})
    peer.setLocalDescription(new RTCSessionDescription(offer))
}

async function handleTrack(e){
    const [stream] = e.streams
    remotevideo.muted = true
    remotevideo.srcObject = stream
}

async function handleIceCandidate(e){
    socket.emit('ice candidate', {candidate:e.candidate, to: otherId})
}

uservideo.onclick = e => uservideo.muted = !uservideo.muted
remotevideo.onclick = e => remotevideo.muted = !remotevideo.muted