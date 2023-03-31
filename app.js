const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true });
const app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const articleSchema = {
    title: String,
    content: String
}

const Article = new mongoose.model("Article", articleSchema)

app.route("/articles")
.get((req, res) => {
    Article.find({}).then((article) =>{
        console.log(article)
        res.send(article)
    }).catch((error) =>{
        if (error) throw error;
    });
})
.post((req, res) => {
     console.log( req.body.title );
     console.log(req.body.content);

     const newArticle = new Article({
         title: req.body.title,
         content: req.body.content
     })

     newArticle.save().then(() =>{
          res.send("article saved successfully !")
     }).catch(err =>{
         throw err
     })
 })
.delete((req, res) =>{
    Article.deleteMany({}).then(() =>{
        res.send("article deleted All articles !")
    }).catch(err =>{
        throw err
    });
})

app.route('/articles/:articleTitle')
 

.get((req, res) =>{

    const articleTitle = _.startCase(req.params.articleTitle); 
    console.log(articleTitle);
    Article.findOne({title: articleTitle }).then((foundArticle)=>{

        if( foundArticle ){
            res.send(foundArticle)
        }else{
            res.send("Article not found with title " + req.params.articleTitle)
        }

    }).catch(err =>{
        throw err
    });
})

.delete((req, res) =>{
    const articleTitle = _.startCase(req.params.articleTitle); 
    console.log(articleTitle);
    Article.deleteOne({title: articleTitle }).then((foundArticle)=>{
        res.send("Article with title"+ articleTitle +" deleted successfully")
    }).catch(err =>{
        throw err
    });
})

.put((req, res) =>{
    const articleTitle = _.startCase(req.params.articleTitle); 
    console.log(articleTitle);
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {upsert:true},
        //{Overwrite: true}
        ).then(()=>{
            res.send("Article updated successfully");
        }).catch(err =>{
            throw err
        })
    
})
.patch((req, res) =>{
    const articleTitle = _.startCase(req.params.articleTitle); 
    console.log(articleTitle);
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then((foundArticle)=>{
        res.send("Successfully 'Patch' Updated Article")
    }).catch(err => {
        throw err
    })
})

app.listen(3000,()=>{
    console.log("listening on port 3000");
})