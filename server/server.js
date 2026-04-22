import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// support arrays in query params
app.set('query parser', 'extended')

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        paginationOn: req.query.paginationOn === 'true',
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || 'title',
        sortDir: +req.query.sortDir || 1,
        createdAt: +req.query.createdAt || 0,
        labels: req.query.labels || []
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/:_id', (req, res) => {
    const bugId = req.params._id

    let EXPIRATION = 7000

    let visitedBugs = req.cookies['visited-bugs'] || []

    if (visitedBugs.length === 3) return res.status(401).send('Wait for a bit')

    let visitedBug = { id: bugId, visitedAt: Date.now() }

    visitedBugs = visitedBugs.filter(bug => Date.now() - bug.visitedAt < EXPIRATION)

    visitedBugs.push(visitedBug)

    bugService.get(bugId)
        .then(bug => {
            res.cookie('visited-bugs', visitedBugs, { maxAge: EXPIRATION })

            console.log('user visited the following bugs: ' + visitedBugs.map(bug => bug.id))

            res.send(bug)
        })
        .catch(err => {
            loggerService.error(err)
            res.status(404).send('Cant find bug')
        })
})

app.delete('/api/bug/:_id', (req, res) => {

    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Unauthenticated...')

    const bugId = req.params._id

    bugService.remove(bugId)
        .then(() => res.send('OK'))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send('Cant remove bug')
        })
})

app.put('/api/bug/:_id', (req, res) => {

    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Unauthenticated...')

    const { _id, title, severity, description, labels } = req.body

    const bugToSave = {
        _id,
        title,
        severity: +severity,
        description,
        labels: labels || []
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.post('/api/bug', (req, res) => {

    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Unauthenticated...')

    const { title, severity, description, labels } = req.body
    const bugToSave = {
        title,
        severity: +severity,
        description,
        labels: labels || [],
        createdAt: Date.now(),                 
        creator: {
            _id: loggedInUser._id,
            fullname: loggedInUser.fullname
        }
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Invalid Credentials'))
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.add(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => res.status(400).send('Username taken.'))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('{*splat}', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(5501, () => console.log('Server ready at port 5501'))