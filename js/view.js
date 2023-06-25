/* For comment text area */
function clearDefaultText(element) {
    if (element.value.trim() === element.getAttribute('data-default-value')) {
        element.value = '';
    }
}

function restoreDefaultText(element) {
    if (element.value.trim() === '') {
        element.value = element.getAttribute('data-default-value');
    }
}

    // ._____________________________________.
    // ||			                        ||
    // ||   code for updating comment page  ||
    // ||___________________________________||
    // '			                         '


const User = function(name) {
    this.name = name;
    this.lname = this.name.toLowerCase();
    this.uname = this.name.toUpperCase();
    this.nav = "#nav-" + this.lname;
    this.img = "images\\" + name + ".png";
}


const Comment = function(user, content){
    this.user = user;
    this.content = content;
}

let comments = [];
let comCtr = 0;
let currentUser = new User("profile");



document.addEventListener("DOMContentLoaded",function() {

    document.querySelector(".submit-button")?.addEventListener("click", function(e){
        e.preventDefault();

        const content = document.querySelector(".comment-area").value;
        if (comCtr === 0) {
            document.querySelector(".view-comments").textContent = "";
        }
        let comment = new Comment(currentUser, content);
        comments.push(comment);
        comCtr++;
        
        refreshDisplay(comments);
        resetCreateComment();
        document.querySelector(".comment-area").value = "    Write a Comment...";
    })

    window.onload = () => {
        let initComment = new Comment(new User("MamaMo"), "Tama na kaka anime mo!");
        comments.push(initComment);
        comCtr++;
        refreshDisplay(comments);
    }

    function refreshDisplay(displayedComments) {
		const commentsContainer = document.querySelector(".view-comments")
		commentsContainer.innerHTML = ""; // Clear post-container
		displayComments(displayedComments);
	}
    function displayComments(newComment) {
		// Clear post-container and add each post inside newPosts inside it instead
        for (let i = newComment.length - 1; i >= 0; i--) {
            displayComment(newComment[i]);
        }
	}
    function displayComment(newComment) {
		const commContainer = document.querySelector(".view-comments");
		
		const commMain = document.createElement("div");
		const singleComment = document.createElement("div");
		const scLeft = document.createElement("div");
		const scRight = document.createElement("div");
		const scPic = document.createElement("img");
		const scRightCont = document.createElement("div");
        const scName = document.createElement("div");
		const scBody = document.createElement("div");
        const scVote = document.createElement("div");
        const scUp = document.createElement("button");
        const scNumVote = document.createElement("p");
        const scDown = document.createElement("button");
        

		commMain.className = "single-comment-main";
		singleComment.className = "single-comment";
		scLeft.className = "sc-left";
		scRight.className = "sc-right";
		scPic.className = "sc-picture";
		scRightCont.className = "sc-right-content";
        scName.className = "sc-name";
		scBody.className = "sc-body";
        scVote.className = "sc-vote";
        scUp.className = "sc-upvote-button";
        scNumVote.className = "sc-num-votes";
        scDown.className = "sc-downvote-button";

	
		commMain.appendChild(singleComment);
		singleComment.appendChild(scLeft);
		singleComment.appendChild(scRight);
		scLeft.appendChild(scPic);
		scRight.appendChild(scName);
        scRight.appendChild(scRightCont);
        scRight.appendChild(scVote)
        scRightCont.appendChild(scBody);
        scVote.appendChild(scUp);
        scVote.appendChild(scNumVote);
        scVote.appendChild(scDown);
        
		scPic.src = newComment.user.img;
        scName.innerHTML = newComment.user.name;
		scBody.innerText = newComment.content;
        scUp.innerHTML = `<img src="images/post/upvote.png" class="sc-upvote"></img>`;
        scDown.innerHTML = `<img src="images/post/downvote.png" class="sc-downvote"></img>`;
        scNumVote.innerText = 0;

		commContainer.appendChild(commMain);
	}

    function resetCreateComment() {
        const content = document.querySelector('.comment-area');

        content.value = "";
	}

    document.addEventListener("visibilitychange", function() {
        var activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === "INPUT") {
          activeElement.blur();
        } 
      });

    // ._____________________________________.
    // ||			                        ||
    // ||   Checks which post called view   ||
    // ||___________________________________||
    // '			                         '

    const url = new URLSearchParams(window.location.search);
    const postId = url.get('id');

    const postContent = document.querySelector('.actual-post');
    const postComments = document.querySelector('.view-comments');

    if (postId == "1") {
        postContent.innerHTML = `<div class="post-container">
                                    <div class="vote">
                                        <button class="upvote-button">
                                            <img src="images/post/upvote.png" class="upvote">
                                        </button>
                                        <p class="num-votes">45</p>
                                        <button class="downvote-button">
                                            <img src="images/post/downvote.png" class="downvote">
                                        </button>
                                    </div>
                                    <div class="content">
                                        <div class="post-content">
                                            <h4 class="title">Demon Slayer mid-tier?</h4>
                                            <p class="author">by <a href="profile.html">pocchi</a></p>
                                            <p class="text">Despite its visually stunning animation and action sequences, Demon Slayer
                                                fails to explore significant thematic depth. It primarily focuses on the battle between
                                                good and evil, neglecting opportunities to delve into complex societal, moral, or
                                                philosophical themes. The absence of deeper thematic exploration prevents it from
                                                resonating on a profound and hought-provoking level. So why did I watch it? Inosuke.</p>
                                            <img src="images/post/media/sample1.jpeg" class="sample">
                                        </div>
                                        <div class="post-actions">
                                            <button class="comment-button">
                                                <img src="images/post/comment.png" class="comment">
                                            </button>
                                            <p>12 Comments</p>
                                            <button class="share-button">
                                                <img src="images/post/share.png" class="share">
                                            </button>
                                            <p>Share</p>
                                            <button class="save-button">
                                                <img src="images/post/save.png" class="save">
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
        postComments.innerHTML = 'Comments for Post 1';
    } else if (postId === '2') {
        postContent.innerHTML = `<div class="post-container">
                                <div class="vote">
                                    <button class="upvote-button">
                                        <img src="images/post/upvote.png" class="upvote">
                                    </button>
                                    <p class="num-votes">43</p>
                                    <button class="downvote-button">
                                        <img src="images/post/downvote.png" class="downvote">
                                    </button>
                                </div>
                                <div class="content">
                                    <div class="post-content">
                                        <h4 class="title">Should I play Genshin again?</h4>
                                        <p class="author">by <a href="user-profiles/profile3.html">DedInComSci</a></p>
                                        <p class="text">Lately, I've been stumbling upon tons of Genshin-related stuff like MMDs,
                                            fan comics, breathtaking artwork, and mind-blowing MVs featuring the characters on
                                            YouTube. It's rekindling my interest like never before!
                                            <br><br>
                                            To give you some background, I gave Genshin a shot last year but ended up dropping it
                                            because I was also engrossed in playing Honkai Impact (which I still do, by the way).
                                            Back then, I thought managing the gacha systems in both games would be overwhelming, not
                                            to mention the occasional negativity aimed at Genshin players. However, things have
                                            changed for me now.
                                            <br><br>
                                            Recently, I've been bombarded with a flood of amazing Genshin content, and it's making
                                            me seriously consider jumping back into the game. The only thing that's giving me second
                                            thoughts is the game's free-to-play aspect. How feasible is it to enjoy the game without
                                            spending a fortune? Is Genshin Impact worth giving another shot?
                                        </p>
                                    </div>
                                    <div class="post-actions">
                                        <button class="comment-button">
                                            <img src="images/post/comment.png" class="comment">
                                        </button>
                                        <p>30 Comments</p>
                                        <button class="share-button">
                                            <img src="images/post/share.png" class="share">
                                        </button>
                                        <p>Share</p>
                                        <button class="save-button">
                                            <img src="images/post/save.png" class="save">
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        postComments.innerHTML = 'Comments for Post 2';
    } else if (postId === '3') {
        postContent.innerHTML = `<div class="post-container">
                                <div class="vote">
                                    <button class="upvote-button">
                                        <img src="images/post/upvote.png" class="upvote">
                                    </button>
                                    <p class="num-votes">29</p>
                                    <button class="downvote-button">
                                        <img src="images/post/downvote.png" class="downvote">
                                    </button>
                                </div>
                                <div class="content">
                                    <div class="post-content">
                                        <h4 class="title">The Ultimate Showdown: Kafka or Himeko?</h4>
                                        <p class="author">by <a href="user-profiles/profile5.html">IAmLoaf21</a></p>
                                        <p class="text">As a Kafka lover this is still the hardest question ... As much as I love
                                            Himeko, Kafka has awakened something in me.</p>
                                        <img src="images/post/media/sample3.jpg" class="sample">
                                    </div>
                                    <div class="post-actions">
                                        <button class="comment-button">
                                            <img src="images/post/comment.png" class="comment">
                                        </button>
                                        <p>12 Comments</p>
                                        <button class="share-button">
                                            <img src="images/post/share.png" class="share">
                                        </button>
                                        <p>Share</p>
                                        <button class="save-button">
                                            <img src="images/post/save.png" class="save">
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        postComments.innerHTML = 'Comments for Post 3';
    } else if (postId === '4') {
        postContent.innerHTML = `<div class="post-container">
                                <div class="vote">
                                    <button class="upvote-button">
                                        <img src="images/post/upvote.png" class="upvote">
                                    </button>
                                    <p class="num-votes">25</p>
                                    <button class="downvote-button">
                                        <img src="images/post/downvote.png" class="downvote">
                                    </button>
                                </div>
                                <div class="content">
                                    <div class="post-content">
                                        <h4 class="title">Lotad BEST POKEMON!</h4>
                                        <p class="author">by <a href="user-profiles/profile2.html">Lotad_is_Life</a></p>
                                        <p class="text">Hey, fellow crafters! I gotta spill the beans about Lotad 'cause it's, like,
                                            the sickest Pokémon in Minecraft! Here's why Lotad is the absolute BEST:<br><br>

                                            Water Splash Master: Lotad is all about those water moves,
                                            fam! It can use Water
                                            Gun and
                                            Bubble Beam to soak enemies like a pro. No one stands a chance against its splashy
                                            powers!<br><br>

                                            Epic Minecraft Skin: Have you seen Lotad's skin? It's legit
                                            awesome! The lil'
                                            blue body
                                            and the leafy headgear are perfect for any Minecraft adventure. Your pals will be jelly,
                                            trust me!<br><br>

                                            Grass Block Surfing: Lotad's got mad skills on land too! It
                                            can walk on water and
                                            even
                                            surf on grass blocks. It's like riding the coolest wave in Minecraft history.
                                            Cowabunga!<br><br>

                                            Evolution Quest: Lotad's evolutions are like leveling up in
                                            Minecraft. It can
                                            become
                                            Lombre and then evolve into Ludicolo, and each stage is more epic than the last. It's
                                            like unlocking secret power-ups!<br><br>

                                            Rainy Day MVP: Yo, check this out! Lotad's got a hidden
                                            ability called Rain Dish.
                                            When
                                            it's raining in Minecraft, it regenerates its HP like a boss. It's like having a
                                            built-in healing potion!
                                        </p>
                                    </div>
                                    <div class="post-actions">
                                        <button class="comment-button">
                                            <img src="images/post/comment.png" class="comment">
                                        </button>
                                        <p>10 Comments</p>
                                        <button class="share-button">
                                            <img src="images/post/share.png" class="share">
                                        </button>
                                        <p>Share</p>
                                        <button class="save-button">
                                            <img src="images/post/save.png" class="save">
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        postComments.innerHTML = 'Comments for Post 4';
    } else if (postId === '5') {
        postContent.innerHTML = `<div class="post-container">
                                <div class="vote">
                                    <button class="upvote-button">
                                        <img src="images/post/upvote.png" class="upvote">
                                    </button>
                                    <p class="num-votes">12</p>
                                    <button class="downvote-button">
                                        <img src="images/post/downvote.png" class="downvote">
                                    </button>
                                </div>
                                <div class="content">
                                    <div class="post-content">
                                        <h4 class="title">Best Agent on Ascent?</h4>
                                        <p class="author">by <a href="main-profile.html">shellyace</a></p>
                                        <p class="text">Hey fellow Valorant enthusiasts! After countless hours of gameplay and
                                            intense battles on the Ascent map, I've finally discovered the ultimate agent that
                                            dominates this battlefield. Drum roll, please... It's none other than Jett! Her mobility
                                            and versatility make her the queen of Ascent, allowing for epic plays and outmaneuvering
                                            opponents. Give her a try and witness the chaos she unleashes! #AscentQueen #JettMain
                                            #GetReadyToAscend</p>
                                        <img src="images/post/media/sample5.png" class="sample">
                                    </div>
                                    <div class="post-actions">
                                        <button class="edit-button">
                                            <img src="images/post/edit.png" class="edit">
                                        </button>
                                        <p id="edit-post">Edit Post</p>
                                        <button class="comment-button">
                                            <img src="images/post/comment.png" class="comment">
                                        </button>
                                        <p>12 Comments</p>
                                        <button class="share-button">
                                            <img src="images/post/share.png" class="share">
                                        </button>
                                        <p>Share</p>
                                        <button class="save-button">
                                            <img src="images/post/save.png" class="save">
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        postComments.innerHTML = 'Comments for Post 5';
    } else if (postId === '6') {
    postContent.innerHTML = `<div class="post-container">
                                <div class="vote">
                                    <button class="upvote-button">
                                        <img src="images/post/upvote.png" class="upvote">
                                    </button>
                                    <p class="num-votes">98</p>
                                    <button class="downvote-button">
                                        <img src="images/post/downvote.png" class="downvote">
                                    </button>
                                </div>
                                <div class="content">
                                    <div class="post-content">
                                        <h4 class="title">Komi Can't Communicate</h4>
                                        <p class="author">by <a href="user-profiles/profile4.html">cornbrip69</a></p>
                                        <p class="text">Before this season started there was a lot of hype around this show. 
                                        Honestly, I initially brushed off "Komi Can't Communicate" as your typical slice-of-life school story, 
                                        but oh boy, was I in for a surprise! This show is an absolute delight, radiating with its own unique 
                                        charm. Every episode leaves me with a big smile on my face. Not only is the source material fantastic, 
                                        but the adaptation itself is flawless. OLM Studio has poured so much love and attention into every 
                                        detail, and it truly makes a world of difference. Trust me, if you haven't given this show a chance 
                                        yet, do yourself a favor and dive right in. It's an experience that's definitely worth every minute 
                                        of your time!</p>
                                        <img src="images/post/media/top-sample.jpeg" class="sample">
                                    </div>
                                    <div class="post-actions">
                                        <button class="comment-button">
                                            <img src="images/post/comment.png" class="comment">
                                        </button>
                                        <p>2 Comments</p>
                                        <button class="share-button">
                                            <img src="images/post/share.png" class="share">
                                        </button>
                                        <p>Share</p>
                                        <button class="save-button">
                                            <img src="images/post/save.png" class="save">
                                        </button>
                                    </div>
                                </div>
                            </div>`;
    postComments.innerHTML = 'Comments for Post 6';
    }

    // .________________________.
    // ||			           ||
    // ||      Save Post       ||
    // ||______________________||
    // '			            '
    var saveButtons = document.querySelectorAll(".save-button");

    saveButtons.forEach(function (saveButton) {
        var saveImage = saveButton.querySelector(".save");
        saveButton.addEventListener("click", savePost);

        function savePost() {
            if (saveImage.src.includes("save.png")) {
                saveImage.src = "images/post/clicked/c-saved.png";
            } else {
                saveImage.src = "images/post/save.png";
            }
        }
    });

    // .________________________.
    // ||			           ||
    // ||     Vote Buttons     ||
    // ||______________________||
    // '			            '

    var upvoteButtons = document.querySelectorAll(".upvote-button");
    var downvoteButtons = document.querySelectorAll(".downvote-button");
    var numVotesList = document.querySelectorAll(".num-votes");

    upvoteButtons.forEach(function (upvoteButton, index) {
        var downvoteButton = downvoteButtons[index];
        var numVotes = numVotesList[index];

        var upvoteImage = upvoteButton.querySelector(".upvote");
        var downvoteImage = downvoteButton.querySelector(".downvote");

        upvoteButton.addEventListener("click", upvotePost);
        downvoteButton.addEventListener("click", downvotePost);

		function upvotePost() {
			if (upvoteImage.src.includes("upvote.png")  && downvoteImage.src.includes("downvote.png")) {
				upvoteImage.src = "images/post/clicked/c-upvoted.png";
				numVotes.textContent++;
			} 
			else if (downvoteImage.src.includes("c-downvoted.png")) {
				upvoteImage.src = "images/post/clicked/c-upvoted.png";
				downvoteImage.src = "images/post/downvote.png"
				numVotes.textContent++;
				numVotes.textContent++;
			} else {
				upvoteImage.src = "images/post/upvote.png";
				numVotes.textContent--;
			}
		}

		function downvotePost() {
			if (downvoteImage.src.includes("downvote.png") && upvoteImage.src.includes("upvote.png")) {
				downvoteImage.src = "images/post/clicked/c-downvoted.png";
				upvoteImage.src = "images/post/upvote.png";
				numVotes.textContent--;
			}
			else if (upvoteImage.src.includes("c-upvoted.png")) {
				downvoteImage.src = "images/post/clicked/c-downvoted.png";
				upvoteImage.src = "images/post/upvote.png";
				numVotes.textContent--;
				numVotes.textContent--;
			}
			else {
				downvoteImage.src = "images/post/downvote.png";
				numVotes.textContent++;
			}
		}
    });

    // .________________________________.
    // ||			                   ||
    // ||     Comment Vote Buttons     ||
    // ||______________________________||
    // '			                    '
    function CheckCommentButtons(){
        var upvoteButtons = document.querySelectorAll(".sc-upvote-button");
        var downvoteButtons = document.querySelectorAll(".sc-downvote-button");
        var numVotesList = document.querySelectorAll(".sc-num-votes");

        upvoteButtons.forEach(function (upvoteButton, index) {
            var downvoteButton = downvoteButtons[index];
            var numVotes = numVotesList[index];

            var upvoteImage = upvoteButton.querySelector(".sc-upvote");
            var downvoteImage = downvoteButton.querySelector(".sc-downvote");
            console.log('testnig');
            upvoteButton.addEventListener("click", upvotePost);
            downvoteButton.addEventListener("click", downvotePost);

            function upvotePost() {
                if (upvoteImage.src.includes("upvote.png")  && downvoteImage.src.includes("downvote.png")) {
                    upvoteImage.src = "images/post/clicked/c-upvoted.png";
                    numVotes.textContent++;
                    console.log('testnig');
                } 
                else if (downvoteImage.src.includes("c-downvoted.png")) {
                    upvoteImage.src = "images/post/clicked/c-upvoted.png";
                    downvoteImage.src = "images/post/downvote.png"
                    numVotes.textContent++;
                    numVotes.textContent++;
                } else {
                    upvoteImage.src = "images/post/upvote.png";
                    numVotes.textContent--;
                }
            }

            function downvotePost() {
                if (downvoteImage.src.includes("downvote.png") && upvoteImage.src.includes("upvote.png")) {
                    downvoteImage.src = "images/post/clicked/c-downvoted.png";
                    upvoteImage.src = "images/post/upvote.png";
                    numVotes.textContent--;
                }
                else if (upvoteImage.src.includes("c-upvoted.png")) {
                    downvoteImage.src = "images/post/clicked/c-downvoted.png";
                    upvoteImage.src = "images/post/upvote.png";
                    numVotes.textContent--;
                    numVotes.textContent--;
                }
                else {
                    downvoteImage.src = "images/post/downvote.png";
                    numVotes.textContent++;
                }
            }
        });
    }

});
