# Simple Video Call App using PeerJS

## Youtube video
[https://youtu.be/l2AYTVhrCXE](https://youtu.be/l2AYTVhrCXE)

## Installation
1. Download source code-nya
2. Buka terminal di direktori projek
3. Jalankan `npm install`

## Menjalankan untuk development
1. Pastikan di `public/script.js` pada saat menginstansiasi peer `new Peer()` option securenya harus `false`
    ```javascript
    const peer = new Peer(undefined, {
      ...
      secure: false,
      ...
    });
    ```
    kecuali localhost anda menggunakan protocol `https` maka tidak ada yang perlu diubah.

2. lalu buka terminal dan jalankan `node server`
3. lalu buka di web browser [http://localhost:3000](http://localhost:3000)