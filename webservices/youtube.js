const google = require("googleapis")

// Função responsável por pesquisar vídeos no YouTube
// [string] query (Palavra chave para busca)
// [int] maxResults (Número máximo de resultados da busca)
youtube = {}
youtube.search = async function(query, maxResults=5) {
    youtube_api = new google.youtube_v3.Youtube({
        version: 'v3',
        auth: process.env.GOOGLE_API_KEY
    })
    result = await youtube_api.search.list({
            q: query,
            maxResults: maxResults,
            part: 'snippet',
            type: 'video,channel',
            fields: 'items(id(videoId),id(channelId),id(kind),snippet(title),snippet(channelTitle),snippet(thumbnails(medium(url))))'
    })
    return result.data
}

module.exports = youtube