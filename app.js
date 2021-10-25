const express = require("express")
const youtube = require("./webservices/youtube")
const auth = require("./middlewares/auth")
const cors = require("cors")
const mysql = require("./mysql")
require('dotenv').config()

const route_users = require("./routes/users")
const route_history = require("./routes/history")


const app = express()

app.use(cors())

// Rota responsável por usar API do YouTube
app.get('/youtube', auth(), async function(req, res) {
    query = req.query.q
    numberResults = req.query.n

    mysql.getConnection(async function(err,conn) {
		conn.query("SELECT * FROM history WHERE user = ? AND query = ?",[req.user_logged.id,query],function(err,rows) {
            // Verifica se o histórico já existe
			if(rows.length == 1) { // Histórico já existe, apenas editaremos o time para mais recente
                conn.query("UPDATE history SET time = ? WHERE id = ?",[+ new Date() / 1000, rows[0]["id"]],function(err,rows) {
                if(err) console.log(err)
                })
            }
            else { // Histórico não existe, vamos cria-lo
                conn.query("INSERT INTO history (user,query,time) VALUES (?,?,?)",[req.user_logged.id,query,+ new Date() / 1000],function(err,rows) {
                if(err) console.log(err)
                })
            }
        })
        conn.release()
		})


    res.send(await youtube.search(query,numberResults))
})

// Rotas /users (responsável pelo controle de usuários)
app.use('/users', route_users)

// Rotas /history (responsável pelo controle de histórico)
app.use('/history', route_history)


app.listen(3000, () => {
    console.log("Servidor rodando")
})