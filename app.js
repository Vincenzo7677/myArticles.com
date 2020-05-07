const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/local', { useUnifiedTopology: true })

const db = mongoose.connection;

db.once('open', function () {
    console.log("Connected to MongoDB...")
})
db.on('error', function (err) {
    console.log(err)
})

const app = express()
const Article = require('./models/article')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))

app.get('/', (req, res) => {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: "Articles",
                articles: articles
            })
        }
    })
})

app.get('/article/:id', (req,res) => {
    Article.findById(req.params.id, (err,article) => {
        res.render('article', {
           article: article
        })
    })
})

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: "Add article"
    })
})

app.get('/articles/edit/:id', (req,res) => {
    Article.findById(req.params.id, (err,article) => {
        res.render('edit_article', {
            title: "Edit Article",
           article: article
        })
    })
})

app.post('/articles/add', (req,res) => {
    const article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save( (err) => {
        if (err) {
            console.log(err)
            return
        }else {
            res.redirect('/')
        }
    })
})

app.post('/articles/edit/:id', (req,res) => {
    const article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    const query = { _id:req.params.id }

    Article.update(query, article,  (err) => {
        if (err) {
            console.log(err)
            return
        }else {
            res.redirect('/')
        }
    })
})

app.delete('/article/:id', (req,res) => {
    const query = {
        _id:req.params.id
    }

    Article.remove(query, (err) => {
        if (err) {
            console.log(err)
        }
        res.send('Success')
    })
})


app.listen(3000, () => console.log('Server is listening on port 3000...'))
