import { Router, Request, Response } from "express";
const request = require('request')
const querystring = require('querystring')
const {promisify} = require('util')
const post = promisify(request.post)


export function oauth(router : Router) {

  const gh_host = process.env.GHE_HOST || "github.com";

  router.get('/github/login', (req, res) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol
    const host = req.headers['x-forwarded-host'] || req.get('host')
    
    const params = querystring.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: `${protocol}://${host}/github/callback`
    })
    const url = `https://${gh_host}/login/oauth/authorize?${params}`
    //req.log({url}, 'Redirecting to OAuth')
    res.redirect(url)
  })

  router.get('/github/callback', async (req, res) => {

    // complete OAuth dance
    const tokenRes = await post({
      url: `https://${gh_host}/login/oauth/access_token`,
      form: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code,
        state: req.query.state
      },
      json: true
    })

    if (tokenRes.statusCode === 200) {
      if(!req.session){
        req.session = {};
      }
      
      req.session.token = tokenRes.body.access_token
      res.redirect(req.session.redirect || '/')
    } else {
      res.status(500)
      res.send('Invalid code')
    }
  })
}

export async function authenticate (req : Request, res : Response, next : Function) {
  if (!req.session || !req.session.token) {
    req.session = {}
    req.session.redirect = req.originalUrl
    res.redirect('/github/login')
  } else {
    next()
  }
}
