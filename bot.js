const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const moment = require('moment-timezone')
const axios = require('axios')
const gtts = require('gtts')
const fs = require('fs')
const P = require('pino')
const http = require('http')

// Biar Render gak mati
http.createServer((req,res)=>{
  res.writeHead(200);
  res.end('BANGCATS ON 24 JAM!');
}).listen(process.env.PORT || 3000, ()=> console.log('Web server ON'));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        printQRInTerminal: false
    })

    sock.ev.on('creds.update', saveCreds)

    // MINTA KODE PAIRING MAS
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode("628816863236")
                console.log('======================================')
                console.log(`KODE PAIRING BOT MAS: ${code}`)
                console.log(`KODE PAIRING BOT MAS: ${code}`)
                console.log(`KODE PAIRING BOT MAS: ${code}`)
                console.log('======================================')
                console.log('MASUKIN DI WA > PERANGKAT TERTAUT > TAUTKAN DGN NOMOR TELEPON')
            } catch(e){ console.log('Gagal minta kode', e) }
        }, 5000)
    }

    sock.ev.on('connection.update', async (up) => {
        const { connection, lastDisconnect } = up
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut
            if (shouldReconnect) startBot()
            else console.log('Logout mas')
        } else if (connection === 'open') {
            console.log('✅ BANGCATS CONNECTED 24 JAM ON MAS!')
        }
    })

    // ===== KODE BOT LAMA MAS DISINI (FITUR JADWAL SHOLAT DLL) =====
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if(!m.message) return
        //... tempel kode auto reply lama mas disini...
        console.log('Pesan masuk:', m.message?.conversation)
    })
}

startBot()
