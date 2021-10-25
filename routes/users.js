const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const mysql = require("../mysql")
const bcrypt = require("bcrypt")
const auth = require("../middlewares/auth.js")

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

// Rota responsável por listar todos os usuários
router.get("/", auth(["admin"]), function(req, res) {
	mysql.getConnection(function(err,conn) {
		conn.query("SELECT * FROM users",function(err,rows) {
			conn.release()
			res.send(rows)
		})
	})
})

// Rota responsável por listar um usuário específico
router.get("/:id", auth(["admin"]), function(req, res) {
	id = req.params.id
	mysql.getConnection(function(err,conn) {
		conn.query("SELECT * FROM users WHERE id = ?",[id],function(err,rows) {
			conn.release()
			res.send(rows[0])
		})
	})
})

// Rota responsável por adicionar um usuário
router.post("/", auth(["admin"]), function(req, res) {
	mysql.getConnection(async function(err,conn) {
		hash = await bcrypt.hash(req.body.senha, 10)
		conn.query("INSERT INTO users (nome,sobrenome,tipo,telefone,email,senha) VALUES (?,?,?,?,?,?)",[req.body.nome,req.body.sobrenome,req.body.tipo,req.body.telefone,req.body.email,hash],function(err,rows) {
			conn.release()
			if(err) return res.status(500).send({ status: "error" })
			res.status(201).send({
				status: "ok"
			})
		})
	})
})

// Rota responsável por editar um usuário
router.put("/:id", auth(["admin"]), function(req,res) {
	id = req.params.id
	mysql.getConnection(async function(err,conn) {
		conn.query("UPDATE users SET nome = ?, sobrenome = ?, tipo = ?, telefone = ?, email = ? WHERE id = ?",[req.body.nome,req.body.sobrenome,req.body.tipo,req.body.telefone,req.body.email,id],function(err,rows) {
			conn.release()
			res.status(200).send({
				status: "ok"
			})
		})
	})
})

// Rota responsável por deletar um usuário
router.delete("/:id", auth(["admin"]), function(req,res) {
	id = req.params.id
	mysql.getConnection(async function(err,conn) {
		conn.query("DELETE FROM users WHERE id = ?",[id],function(err,rows) {
			conn.release()
			if(err) return res.status(500).send(err)
			res.status(200).send({
				status: "ok"
			})
		})
	})
})

// Rota responsável por fazer login
router.post("/login", function(req, res) {
	email = req.body.email
	senha = req.body.senha || ""
	mysql.getConnection(function(err,conn) {
		conn.query("SELECT * FROM users WHERE email = ?",[email], async function(err,rows) {
			conn.release()
			if(rows.length == 0) { // Email não cadastrado
				return res.send({
					status: "error",
					msg: "Email ou senha incorretos" // Mensagem padrão para evitar ataques que descobrem emails cadastrados
				})
			}
			check_password = await bcrypt.compare(senha, rows[0]["senha"])
			if(check_password == false) { // Senha incorreta
				return res.send({
					status: "error",
					msg: "Email ou senha incorretos"
				})
			}
			// Apartir daqui o login foi um sucesso
			jwt_token = jwt.sign({id: rows[0]["id"], email: email,tipo:rows[0]["tipo"]},process.env.SECRET_TOKEN)
			res.send({
				status: "success",
				token: jwt_token,
				user: rows[0]
			})
		})
	})
})

module.exports = router