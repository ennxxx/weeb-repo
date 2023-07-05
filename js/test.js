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
        <a href="wip.html">Featured</a>
        <a href="wip.html">Polls</a>
        <a href="anime.html">Anime</a>
        <a href="games.html">Games</a>
        <img src="images/profile.png" id="profile">
        <div class="dropdown">
            <a href="javascript:void(0);" id="user-dropdown">
                <img src="images/navbar/dropdown.png" id="dropdown">
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

function insertFooter() {
    document.write(`
    <footer>
    <br /><br />
    <div id="footer-logo">
        <img src="images/logo/logo.png" alt="Logo">
    </div>
    <br /><br />
    <div class="tabs">
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="main-profile.html">My Profile</a></li>
            <li><a href="games.html">Games</a></li>
            <li><a href="anime.html">Anime</a></li>
            <li><a href="wip.html">Polls</a></li>
            <li><a href="wip.html">Privacy Policy</a></li>
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