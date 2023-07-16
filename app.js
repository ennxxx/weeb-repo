/* const http = require('http');

const server = http.createServer((req,res)=>{
    console.log("Request url:" + req.url )
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Home</title>
            </head>
            <body>
              <h1>Welcome to the homepage!</h1>
            </body>
          </html>
        `);
        res.end();
      } else if (req.url === '/about') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>About</title>
            </head>
            <body>
              <h1>About Page</h1>
              <p>This is the about page.</p>
            </body>
          </html>
        `);
        res.end();
      } else if (req.url.startsWith('/profile/')) {
        const username = req.url.substring(9);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Profile</title>
            </head>
            <body>
              <h1>Profile Page</h1>
              <p>You are viewing the profile of ${username}.</p>
            </body>
          </html>
        `);
        res.end();
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>404 - Page Not Found</title>
            </head>
            <body>
              <h1>404 - Page Not Found</h1>
            </body>
          </html>
        `);
        res.end();
      }
})

server.listen(3000, 'localhost', () => {
    console.log('Server is listening');
});
*/

const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./helpers.js');


const posts = [
    {
        title: "Demon Slayer mid-tier?",
        author: "pocchi",
        content: `Despite its visually stunning animation and action sequences, Demon
                  Slayer
                  fails to explore significant thematic depth. It primarily focuses on the battle
                  between
                  good and evil, neglecting opportunities to delve into complex societal, moral, or
                  philosophical themes. The absence of deeper thematic exploration prevents it from
                  resonating on a profound and hought-provoking level. So why did I watch it? Inosuke.`,
        image: "sample1.jpeg",
        id: 0,
        comments: [
          {
              author: "Nigel",
              content: "This is the first comment.",
              profpic: "cornbrip69.png",
              comID: 0,
              reply:[
                {
                  author: "Cinnamoroll",
                  content:"sure.",
                  profpic: "cinnamoroll.png"
                }
              ]
          },
          {
              author: "Johann",
              content: "weh di nga",
              profpic: "Johann.png",
              comID: 1,
              reply:[]
          }
        ]
    },
    {
        title: "Should I play Genshin again?",
        author: "DedInComSci",
        content: `Lately, I've been stumbling upon tons of Genshin-related stuff like
                  MMDs,
                  fan comics, breathtaking artwork, and mind-blowing MVs featuring the characters on
                  YouTube. It's rekindling my interest like never before!
                  <br><br>
                  To give you some background, I gave Genshin a shot last year but ended up dropping
                  it
                  because I was also engrossed in playing Honkai Impact (which I still do, by the
                  way).
                  Back then, I thought managing the gacha systems in both games would be overwhelming,
                  not
                  to mention the occasional negativity aimed at Genshin players. However, things have
                  changed for me now.
                  <br><br>
                  Recently, I've been bombarded with a flood of amazing Genshin content, and it's
                  making
                  me seriously consider jumping back into the game. The only thing that's giving me
                  second
                  thoughts is the game's free-to-play aspect. How feasible is it to enjoy the game
                  without
                  spending a fortune? Is Genshin Impact worth giving another shot?`,
        image: "",
        id: 1,
        comments: []
    },
    {
        title: "The Ultimate Showdown: Kafka or Himeko?",
        author: "IAmLoaf21",
        content: `As a Kafka lover this is still the hardest question ... As much as I
        love
        Himeko, Kafka has awakened something in me.`,
        image: "sample3.jpg",
        id: 2,
        comments: []
    },
    {
        title: "Lotad BEST POKEMON!",
        author: "Lotad_is_Life",
        content: `Hey, fellow crafters! I gotta spill the beans about Lotad 'cause it's,
                  like,
                  the sickest Pokémon in Minecraft! Here's why Lotad is the absolute BEST:<br><br>

                  Water Splash Master: Lotad is all about those water moves,
                  fam! It can use Water
                  Gun and
                  Bubble Beam to soak enemies like a pro. No one stands a chance against its splashy
                  powers!<br><br>

                  Epic Minecraft Skin: Have you seen Lotad's skin? It's legit
                  awesome! The lil'
                  blue body
                  and the leafy headgear are perfect for any Minecraft adventure. Your pals will be
                  jelly,
                  trust me!<br><br>

                  Grass Block Surfing: Lotad's got mad skills on land too! It
                  can walk on water and
                  even
                  surf on grass blocks. It's like riding the coolest wave in Minecraft history.
                  Cowabunga!<br><br>

                  Evolution Quest: Lotad's evolutions are like leveling up in
                  Minecraft. It can
                  become
                  Lombre and then evolve into Ludicolo, and each stage is more epic than the last.
                  It's
                  like unlocking secret power-ups!<br><br>

                  Rainy Day MVP: Yo, check this out! Lotad's got a hidden
                  ability called Rain Dish.
                  When
                  it's raining in Minecraft, it regenerates its HP like a boss. It's like having a
                  built-in healing potion!`,
        image: "",
        id: 3,
        comments: []
    },
    {
        title: "Best Agent on Ascent?",
        author: "shellyace",
        content: `Hey fellow Valorant enthusiasts! After countless hours of gameplay and
                  intense battles on the Ascent map, I've finally discovered the ultimate agent that
                  dominates this battlefield. Drum roll, please... It's none other than Jett! Her
                  mobility
                  and versatility make her the queen of Ascent, allowing for epic plays and
                  outmaneuvering
                  opponents. Give her a try and witness the chaos she unleashes! #AscentQueen
                  #JettMain
                  #GetReadyToAscend`, 
        image: "sample5.png",
        id: 4,
        comments: []
    },
    {
      title: "Komi Can't Communicate Best Anime Fr?",
      author: "cornbrip69",
      content: `Before this season started there was a lot of hype around this show. 
                and tbh, I initially brushed off "Komi Can't Communicate" as your rom-com school story, 
                but sheeshhh was I wrong. This show is an absolute masterpiece frfr, the show has its own unique 
                charm. Every episode leaves me with a smile on my face and a light feeling in my heart tlga. Not 
                only is the source material fantastic, i've read the manga and can confirm, but the adaptation itself
                is also top-notch. OLM Studio really has poured so much love and attention into every detail, and it truly
                shows. Trust me pareh, if you haven't given this show a chance yet, do yourself a favor and watch it na. 
                It's an experience that's definitely worth every minute of your time! Shoutout to mr <a href="profile2.html">u/Lotad_is_Life</a> for
                recommending me this masterpiece frfr no cap`, 
      image: "top-sample.jpeg",
      id: 5,
      comments: []
  }

];

const app = express();

app.use("/static", express.static("public"));

app.engine('hbs', exphbs.engine({ 
    extname: "hbs",
    defaultLayout: "main",
    helpers: {
        capitalize: function(string) {
            return string.toUpperCase();
        },
        substring: helpers.substring
    }
}));

app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.render("index", {
      title: 'Home',
      posts: posts,
      toppost: posts[5]
    });
});

app.get("/view/:id", (req, res) => {
    const id = req.params.id;

    res.render("view", {
      post: posts[id]
    });
});

app.get("/main-profile", (req, res) => {
  
  const filters = ['overview', 'posts', 'comments', 'upvoted', 'downvoted', 'saved'];
    
  res.render("main-profile", {
    posts: posts,
    filters: filters
  });
});

app.get("/profile/comments", (req, res) => {
  const user=req.body;
  console.log(user);
  var postsByAuthor = posts.filter(function(post) {
    return post.comments.some(function(comment) {
        return comment.author == user;
    });
});
  
  res.render("main-profile", {
    commentPosts: postsByAuthor,
    filters: filters
  });
});

/* app.get("/anime", (req, res) => {
  res.render("anime");
});*/

// intercept all requests with the content-type, application/json
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.post("/post", (req, res) => {
    console.log("POST Request to /post received.");
    console.log(req.body);
    const {title, author, content, image} = req.body;
    if (title && author && content) {
        const newPost = {
            title: title,
            author: author,
            content: content, 
            image: image,
            comments:[],
            id: posts.length
        };
        posts.push(newPost);
        res.status(200);
        res.redirect("/");
    }
    else {
        res.status(400);
        res.redirect("/error");
    }
});

app.post("/comment", (req, res) => {
  console.log("POST Request to /post received.");
  console.log(req.body);
  const {author, content, profpic} = req.body;
  const id = req.body.id;
 
  if(author && content  && id){
    const newComment = {
      author: author,
      content: content,
      profpic: profpic,
      comID: posts[id].comments.length, 
      reply: []
    };
    posts[id].comments.push(newComment);
    res.status(200);
    res.redirect("/view/:id");
  }
  else {
    res.status(400);
  } 
});

app.post("/reply", (req, res) => {
  console.log("POST Request to /post received.");
  const {author, replyContent, profpic} = req.body;
  const id = req.body.id;
  
  const newReply = {
    author: author,
    content: replyContent,
    profpic: profpic,
    comID: posts[id].comments.length, 
    reply: []
  };
  if(newReply && id){
    posts[id].comments.push(newComment);
    res.status(200);
    res.redirect("/view/:id");
  }
  else {
    res.status(400);
  } 
});

app.listen(3000, () => console.log("Server is running on port 3000"));