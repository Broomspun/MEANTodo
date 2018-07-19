const express = require('express')
const path = require('path');
const PORT = process.env.PORT || 5000
const todosRouter = require('./routes/todo');
const authRouter = require('./routes/auth');


express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.static(path.join(__dirname, 'client')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .engine('html', require('ejs').renderFile)
    .get('/', (req, res) => res.render('pages/index'))
    .use('/api/v1/', todosRouter)
    .use('/auth/', authRouter)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
