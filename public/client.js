const userVideo = document.getElementById('user-video')
const remoteVideo = document.getElementById('remote-video')
const socket = io()
let peer;
let guestId;

socket.on('other join', rooms => {
    guestId = rooms.filter(id => socket.id!=id)[0]
    createPeerConnection()
})

socket.on('offer', async data => {
    guestId = data.from
    await createPeerConnection()
    const offer = new RTCSessionDescription(data.offer)
    await peer.setRemoteDescription(offer)
    const answer = await peer.createAnswer()
    socket.emit('answer', {answer, from:socket.id, to: guestId })
    await peer.setLocalDescription(new RTCSessionDescription(answer))
})

socket.on('answer', async data => {
    const answer = new RTCSessionDescription(data.answer)
    await peer.setRemoteDescription(answer)
})

socket.on('ice candidate', async data => {
    try{
        const c = new RTCIceCandidate(data.candidate)
        await peer.addIceCandidate(c)
        console.log('success')
    }catch(e){
        console.warn(e);
    }
})

async function createPeerConnection(){
    peer = new RTCPeerConnection({iceServers: [{urls: 'stun:stun.stunprotocol.org'}]})
    const userStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    userVideo.muted = true
    userVideo.srcObject = userStream
    userVideo.onloadedmetadata = () => userVideo.play()    
    userStream.getTracks().forEach(track => peer.addTrack(track,userStream))
    // Handle Event
    peer.onicecandidate = handleIceCandidate
    peer.ontrack = handleTracks
    peer.onnegotiationneeded = handleNegotiationneeded

}

async function handleNegotiationneeded(){
    const offer = await peer.createOffer()
    socket.emit('offer', {offer, from:socket.id, to: guestId })
    await peer.setLocalDescription(new RTCSessionDescription(offer))
}

async function handleTracks(e){
    const [stream] = e.streams
    remoteVideo.muted = true
    remoteVideo.srcObject = stream
    remoteVideo.onloadedmetadata = () => remoteVideo.play()
}

async function handleIceCandidate(e){
    socket.emit('ice candidate', {candidate: e.candidate, to: guestId})
}