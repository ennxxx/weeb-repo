/* TO BE DELETED: Filler Posts */

function insertFillerPost() {
    document.write(`<!-- Sample Post -->
    <div class="post-container">
        <div class="vote">
            <button class="upvote-button">
                <img src="images/post/upvote.png" class="upvote">
            </button>
            <p class="num-votes">67</p>
            <button class="downvote-button">
                <img src="images/post/downvote.png" class="downvote">
            </button>
        </div>
        <div class="content">
            <div class="post-content">
                <a href="view.html?id=1" class="post-clickable">
                    <h4 class="title">Demon Slayer mid-tier?</h4>
                </a>
                <p class="author">by <a href="sample-profile.html">pocchi</a></p>
                <a href="view.html?id=1" class="post-clickable">
                    <p class="text">Despite its visually stunning animation and action sequences, Demon
                        Slayer
                        fails to explore significant thematic depth. It primarily focuses on the battle
                        between
                        good and evil, neglecting opportunities to delve into complex societal, moral,
                        or
                        philosophical themes. The absence of deeper thematic exploration prevents it
                        from
                        resonating on a profound and hought-provoking level. So why did I watch it?
                        Inosuke.
                    </p>
                    <img src="images/post/media/sample1.jpeg" class="sample">
                </a>
            </div>
            <div class="post-actions">
                <a href="view.html?id=1" class="post-clickable">
                    <button class="comment-button">
                        <img src="images/post/comment.png" class="comment">
                    </button>
                </a>
                <p class="comment-num">12 Comments</p>
                <button class="save-button">
                    <img src="images/post/save.png" class="save">
                </button>
            </div>
        </div>
    </div>

    <!-- Editable Post -->
    <div class="post-container">
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
                <a href="view.html?id=5" class="post-clickable">
                    <h4 class="title">Best Agent on Ascent?</h4>
                </a>
                <p class="author">by <a href="main-profile.html">shellyace</a></p>
                <a href="view.html?id=5" class="post-clickable">
                    <p class="text">Hey fellow Valorant enthusiasts! After countless hours of gameplay
                        and
                        intense battles on the Ascent map, I've finally discovered the ultimate agent
                        that
                        dominates this battlefield. Drum roll, please... It's none other than Jett! Her
                        mobility
                        and versatility make her the queen of Ascent, allowing for epic plays and
                        outmaneuvering
                        opponents. Give her a try and witness the chaos she unleashes! #AscentQueen
                        #JettMain
                        #GetReadyToAscend</p>
                    <img src="images/post/media/sample5.png" class="sample">
                </a>
            </div>
            <div class="post-actions">
                <button class="edit-button" a href="javascript:void(0)" onclick="openEditPopup()">
                    <img src="images/post/edit.png" class="edit">
                </button>
                <script>openEditPost();</script>
                <p class="edit-post">Edit Post</p>
                <a href="view.html?id=5" class="post-clickable">
                    <button class="comment-button">
                        <img src="images/post/comment.png" class="comment">
                    </button>
                </a>
                <p>12 Comments</p>
                <button class="save-button">
                    <img src="images/post/save.png" class="save">
                </button>
            </div>
        </div>
    </div>`)
}

/* Navigation Bar */

function insertNav() {
    document.write(`
    <nav>
    <a href="index.html">
        <img src="images/logo/logo3.png" id="logo">
    </a>
    <div class="search-bar">
        <input type="text" placeholder="Search Weeb Lib..." id="search-text">
    </div>
    <div class="nav-buttons">
        <a href="featured.html">Featured</a>
        <a href="polls.html">Polls</a>
        <a href="anime.html">Anime</a>
        <a href="games.html">Games</a>
        <img src="images/profile/cinnamoroll.png" id="profile">
        <div class="dropdown">
            <a href="javascript:void(0);" id="user-dropdown">
                <img src="images/icons/dropdown.png" id="dropdown">
            </a>
            <div class="dropdown-content">
                <a href="main-profile.html">My Profile</a>
                <a href="signin.html">Log out</a>
            </div>
        </div>
        <a href="signin.html" id="signin-link">Sign In</a>
    </div>
</nav>
    `);
}

/* Footer */

function insertFooter() {
    document.write(`
    <footer>
    <br /><br />
    <div id="footer-logo">
        <img src="images/logo/logo1.png" alt="Logo">
    </div>
    <br /><br />
    <div class="tabs">
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="main-profile.html">Profile</a></li>
            <li><a href="games.html">Games</a></li>
            <li><a href="anime.html">Anime</a></li>
            <li><a href="polls.html">Polls</a></li>
            <li><a href="policy.html">Privacy Policy</a></li>
            <li><a href="wip.html">About Us </a></li>
        </ul>
    </div>
    <br /><br />
    <div class="social-icons">
        <a href="#"><i class="fab fa-discord"></i></a>
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-twitch"></i></a>
    </div>
    <br /><br />
    <div class="copyright">
        <p>All rights reserved. &copy; 2023</p>
    </div>
    <br /><br /><br />
</footer>
    `);
}