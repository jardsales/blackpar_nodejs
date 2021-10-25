## Projeto API Laravel & NodeJS

### Repositório do projeto NodeJS

Instruções para iniciar:

**Instale as dependências com o NPM**
```
npm install
```

**Importe o arquivo** ***projeto.sql*** **para o seu banco de dados**
Após a importação, automaticamente será gerado um usuário admin com as credenciais:
E-mail: fulano@gmail.com
Senha: 123456
```
mysql db_name < projeto.sql
```

**Copie o arquivo .env.example para .env**
```
cp .env.example .env
```
**Adicionar no arquivo .env as informações como:**
- Dados de conexão do banco de dados
- GOOGLE_API_KEY com acesso a YouTube Data API ( Para adiantar a avalição, o arquivo já vem com a minha própria chave que pode ser usada sem problemas )

**Após finalizar os procedimentos, rodar a aplicação**
```
node app.js     OU     npm start
```