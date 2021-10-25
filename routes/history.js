const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const mysql = require("../mysql")
const auth = require("../middlewares/auth.js")

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

// Rota resposável por mostrar histórico do usuário logado
router.get("/",auth(),function(req,res) {
	id = req.user_logged.id
	mysql.getConnection(function(err,conn) {
		conn.query("SELECT * FROM history WHERE user = ? ORDER BY time DESC",[id], async function(err,rows) {
			conn.release()
			if(rows.length == 0) { // Nenhum histórico encontrado
				return res.send({
					status: "error",
					msg: "Nenhum histórico encontrado"
				})
			}
			return res.send({
				status: "success",
				history: rows
			})
		})
	})
})

// Rota resposável por mostrar histórico dos usuários para administradores
router.get("/:id",auth(["admin"]),function(req,res) {
	id = req.params.id
	mysql.getConnection(function(err,conn) {
		conn.query("SELECT * FROM history WHERE user = ? ORDER BY time DESC",[id], async function(err,rows) {
			conn.release()
			if(rows.length == 0) { // Nenhum histórico encontrado
				return res.send({
					status: "error",
					msg: "Nenhum histórico encontrado"
				})
			}
			return res.send({
				status: "success",
				history: rows
			})
		})
	})
})

module.exports = router