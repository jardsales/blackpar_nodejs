const jwt = require("jsonwebtoken")

// Função responsável por restringir acesso a rotas onde precisa estar logado
// [string="all" || array] role (Array com qual nível de usuário pode visualizar a página)
auth = function (role="all") {
    return function(req,res,next) {
        token = req.headers["x-access-token"];
        jwt.verify(token, process.env.SECRET_TOKEN, function(err, result) {
            if(err) { // JWT Inválido
                return res.status(401).send()
            }
            if(role !== "all" && role.includes(result.tipo) == false) { // Nível de usuário não permitido
                return res.status(401).send()
            }
            
            req.user_logged = result
            next()
        })
    }
}

module.exports = auth