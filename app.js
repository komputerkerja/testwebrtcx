let peer = new Peer()

let localStream;
const localId = document.getElementById('local-id')
const remoteId = document.getElementById('remote-id')
const callBtn = document.getElementById('call-btn')
const localVideo = document.getElementById('local-video')
const remoteVideo = document.getElementById('remote-video')

navigator.mediaDevices.getUserMedia({video:true,audio:true})
.then(stream => {
    localStream=stream
    localVideo.muted=true
    localVideo.srcObject=stream
    localVideo.onloadedmetadata = () => localVideo.play()
}).catch(err=>console.log(err))

peer.on('open', id => {
    localId.value = id
})

peer.on('call', function(call) {
	call.answer(localStream)
    call.on('stream', stream => {
        remoteVideo.muted=true
        remoteVideo.srcObject=stream
        remoteVideo.onloadedmetadata = () => remoteVideo.play()
    })
});

callBtn.onclick = () => {
    let call = peer.call(remoteId.value, localStream)
    call.on('stream', stream => {
        remoteVideo.muted=true
        remoteVideo.srcObject=stream
        remoteVideo.onloadedmetadata = () => remoteVideo.play()
    })
}