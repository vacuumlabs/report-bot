import axios from 'axios'
import qs from 'querystring'
import c from './config'
import url from 'url'

const ghApiUrl = `${c.ssoUrl}/api/github`

export const authorize = async (req, res, next) => {
  if (c.disableAuth) {
    next()
    return
  }

  if (!req.cookies.authToken) {
    res.sendStatus(401)
    return
  }

  try {
    const {data: userTeams} = await axios.get(`${ghApiUrl}/user/teams`, {
      headers: {
        Authorization: `${c.ssoKey} ${req.cookies.authToken}`,
      },
    })

    // API call to get user's GitHub handle to let him in if he's configured as admin even if he's not part of the management
    const {data: user} = await axios.get(`${ghApiUrl}/user`, {
      headers: {
        Authorization: `${c.ssoKey} ${req.cookies.authToken}`,
      },
    })

    if (!userTeams.some((x) => x.id === c.requiredTeamId) || user.login === c.adminGithub) {
      res.sendStatus(403)
      return
    }

  } catch (e) {
    if (e.response.status === 401) {
      res.sendStatus(401)
      return
    } else {throw e}
  }

  next()
}

export const registerAuthRoutes = (app) => {
  app.get('/auth/login', (req, res) => {
    const oauthUrl = url.format({
      protocol: c.isDev ? 'http' : 'https',
      host: req.headers.host,
      pathname: '/auth/callback',
    })
    res.redirect(`${c.ssoUrl}/$login?${qs.stringify({url: oauthUrl})}`)
  })

  app.get('/auth/callback', (req, res) => {
    res.cookie('authToken', req.query.code, {
      httpOnly: true,
      secure: !c.isDev,
    })

    res.redirect(c.ssoRedirect)
  })

  app.get('/auth', authorize, (req, res) => {
    res.sendStatus(200)
  })
}
