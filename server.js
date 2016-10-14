/*
 * server.js
 */
'use strict';
const config        = require('./config.json')
const express       = require('express')
const mongoose      = require('mongoose')
const bodyParser    = require('body-parser')
const randomstring  = require('randomstring')
const chalk         = require('chalk')
const shortURL      = require('./schemas/shorturl-schema')
const apiKey        = require('./schemas/apikey-schema')
const log           = new (require('./log.js'))(config.production, config.verbose);
const jsonParser    = bodyParser.json()
const app           = express()

/* check config values */
if(!config.production) log.warn(`${chalk.gray('[')}${chalk.red('!!')}${chalk.gray(']')} Application running in development mode.`)
log.debug('Verbose mode enabled.')

mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@${config.db.host}/${config.db.name}?authSource=admin`)
log.debug(`Connecting to MongoDB. Connection string: mongodb://${config.db.user}:**CENSORED**@${config.db.host}/${config.db.name}?authSource=admin`)

app.use(jsonParser)

app.get('/', (req,res)=>{
    return res.send(`<html><h1>shortURL by Relative</h1><br/><a href="https://twitter.com/SethFNC">Follow me on Twitter!</a></html>`)
})

function handleShortReq(req,res){
    let shortId = req.params.id
    shortURL.find({shortKey: shortId}).exec((err,urls)=>{
        if(err) return res.sendStatus(500).res.send(`<html><h1>500 - Internal Server Error</h1></html>`)
        if(!urls[0]){
            return res.sendStatus(500).res.send(`<html><h1>That shortURL doesn't exist!</h1></html>`)
        }
        res.redirect(urls[0].url)
    })
}

app.get('/:id', handleShortReq)
app.get('/:id/', handleShortReq)

app.post('/api/v1/shorten/', (req,res)=>{
    try{
        if(!req.body){
            return res.sendStatus(400).res.send(`400 Bad Request - please send a request body!`)
        }
        if(!req.query.key){
            return res.sendStatus(400).res.send(`400 Bad Request - please send a key!`)
        }
        apiKey.find({apiKey: req.query.key}).exec((err,keys)=>{
            if(!keys[0]){
                return res.sendStatus(401).res.send(`401 Unauthorized - your key is invalid.`)
            }
            let randomId = randomstring.generate(5)
            var shortenedUrl = new shortURL({shortKey: randomId, url: req.body.url})
            shortenedUrl.save((err)=>{
                if(err){
                    return res.sendStatus(500).res.send(`500 Internal Server Error - Our server sucks! D:!`)
                }else{
                    if(!config.production){
                        return res.send(`http://localhost:${config.server.port}/${randomId}`)
                    }
                    return res.send(`${config.server.url}/${randomId}`)
                }
            })
        })
    }catch(ex){
        return res.sendStatus(500).res.send(`500 Internal Server Error!`)
    }


})
app.get('/api/v1/shorten/', (req,res)=>{
    try{
        if(!req.query.url){
            return res.sendStatus(400).res.send(`400 Bad Request - please send a url!`)
        }
        if(!req.query.key){
            return res.sendStatus(400).res.send(`400 Bad Request - please send a key!`)
        }
        apiKey.find({apiKey: req.query.key}).exec((err,keys)=>{
            let randomId = randomstring.generate(5)
            var shortenedUrl = new shortURL({shortKey: randomId, url: req.query.url})
            shortenedUrl.save((err)=>{
                if(err){
                    return res.sendStatus(500).res.send(`500 Internal Server Error - Our server sucks! D:!`)
                }else{
                    if(!config.production){
                        return res.send(`http://localhost:${config.server.port}/${randomId}`)
                    }
                    return res.send(`${config.server.url}/${randomId}`)
                }
            })
        })
    }catch(ex){
        return res.sendStatus(500).res.send(`500 Internal Server Error!`)
    }
})

function shortenUrl(url, length,callback){
    let randomId = randomstring.generate(length || 5)
    var shortenedUrl = new shortURL({shortKey: randomId, url: url})
    shortenedUrl.save((err)=>{
        if(err){
            return callback(true)
        }else{
            return callback(false, randomId)
        }
    })
}

app.get('/api/v1/admin_generate_key', (req,res)=>{
    //TODO: You can remove this after generating key, or you don't have to. Whatever end user decides.
    if(!req.query.privileges){
        return res.sendStatus(400).res.send(`400 Bad Request - please send a privilege!`)
    }
    var rawApiKey = randomstring.generate(32)
    var newApiKey = new apiKey({apiKey: rawApiKey, privileges: parseInt(req.query.privileges)})
    newApiKey.save((err)=>{
        if(err){
            return res.sendStatus(500).res.send(`500 Internal Server Error!`)
        }else{
            return res.send(rawApiKey)
        }
    })

})

app.listen(config.server.port, log.info(`shortURL listening on port ${config.server.port}`))
