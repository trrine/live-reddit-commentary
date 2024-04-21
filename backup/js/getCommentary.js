let FETCH_COMMENTS = false;              // To check whether to keep fetching/displaying comments
let DISPLAYED_COMMENT_IDS = new Set();   // To track displayed comments by their IDs


// Function to prepare url to get JSON listing of subreddit post
function modifyRedditUrl(url) {
    return url.slice(0, -1).concat(".json?sort=new");
}


// Function to toggle dark mode
function toggleDarkMode() {
    const commentSection = document.getElementById("commentSection");
    commentSection.classList.toggle("darkMode");
}


// Function to extract comments from Reddit API response data
function extractComments(data) {
    // Check if the required data structure exists
    if (data && data[1] && data[1].data.children) {
        // Extract comments from the data and map them to a more simplified format
        const comments = data[1].data.children.map(comment => {
            return {
                id: comment.data.id,
                created_utc: comment.data.created_utc,
                author: comment.data.author,
                score: comment.data.score,
                body: comment.data.body
            };
        });
        return comments;
    }
    return [];
}


// Function to fetch comments from a Reddit post
async function fetchRedditComments(url) {
    try {
        const apiUrl = modifyRedditUrl(url);
        const response = await fetch(apiUrl);
        const data = await response.json();
        return extractComments(data);
        
    } catch (error) {
        console.error("Error fetching comments:", error);
        return []; 
    }
}


function formatUtcDate(utcDate) {
    const dateTime = new Date(utcDate * 1000); // Convert UTC timestamp to milliseconds
    return formattedDateTime = dateTime.toLocaleString(); // Convert to local date time string
}


// Function to display a single comment with a specified delay
async function displayCommentWithDelay(comment, displayDelay) {
    return new Promise(resolve => {
        setTimeout(() => {
            addCommentToDisplay(comment);
            resolve();
        }, displayDelay);
    });
}


// Function to display a single comment in the comment section
function addCommentToDisplay(comment) {
    if (!FETCH_COMMENTS) return;
    
    const commentSection = document.getElementById("comments");
    
    if (commentSection) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `<p class="commentHeader">${comment.author} @ ${formatUtcDate(comment.created_utc)} [${comment.score}]:</p><p>${comment.body}</p>`;
        commentSection.appendChild(commentDiv);

        // Automatically scroll to the bottom
        commentSection.scrollTop = commentSection.scrollHeight;
    }
}


// Function to fetch and display comments with a specified display delay
async function fetchAndDisplayCommentsWithDelay(url, displayDelay, lagTime) {
    try {
        let commentStack = await fetchRedditComments(url);

        commentStack = (commentStack || []).filter(comment => {
                const displayTime = parseFloat(comment.created_utc) + lagTime; // Calculate the time when the comment should be displayed
                return !DISPLAYED_COMMENT_IDS.has(comment.id) && displayTime <= Date.now(); // Check if the comment is eligible for display
        });

        while (commentStack.length !== 0 && FETCH_COMMENTS) {
            const comment = commentStack.pop();
            await displayCommentWithDelay(comment, displayDelay);
            DISPLAYED_COMMENT_IDS.add(comment.id);
        }
        
        if (!FETCH_COMMENTS) {
            removeCommentSection();
        }
    } catch (error) {
        console.error("Error fetching and displaying comments:", error);
    }
}


// Function to continuously fetch comments 
async function startFetchingComments(url, displayDelay, lagTime) {
    const startTime = new Date();

    // Fetch comments initially
    await fetchAndDisplayCommentsWithDelay(url, displayDelay, lagTime);

    const duration = new Date() - startTime;

    // Continue fetching if fetchComments flag is true
    if (FETCH_COMMENTS) {

        // Wait if less than 5 seconds have passed since last fetch
        setTimeout(function() {
            startFetchingComments(url, displayDelay, lagTime);
        }, 5000 - duration);
        
    }
}


// Function to remove the comment display section
function removeCommentSection() {
    const commentSection = document.getElementById("commentSection");
    if (commentSection) commentSection.remove();
}


// Function to create the comment display section
function createCommentSection() {
    let commentSection = document.getElementById("commentSection");
    
    // Create a new div element for the comment section
    if (!commentSection) {
        commentSection = document.createElement("div");
        commentSection.id = "commentSection";

        // Create header + comment div
        let commentSectionHeader = document.createElement("div");
        commentSectionHeader.id = "commentSectionHeader";
        commentSectionHeader.textContent = "Discussion";
        commentSection.appendChild(commentSectionHeader);

        let comments = document.createElement("div");
        comments.id = "comments";
        commentSection.appendChild(comments);

        // Create toggle dark mode button
        let toggleDarkModeButton = document.createElement("button");
        toggleDarkModeButton.textContent = "Toggle Dark Mode";
        toggleDarkModeButton.id = "toggleDarkModeButton";
        commentSection.appendChild(toggleDarkModeButton);

        document.body.appendChild(commentSection);
        dragElement(commentSection);

        // Add event listener to the toggle dark mode button
        toggleDarkModeButton.addEventListener("click", function() {
            toggleDarkMode();
        });
    }
}


// Event listener for changes in Chrome storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.redditPostUrl || changes.displayDelay || changes.lagTime || changes.fetchComments) {
        // Retrieve the updated settings
        chrome.storage.sync.get(["redditPostUrl", "displayDelay", "lagTime", "fetchComments"], function(data) {
            const fetchComments = data.fetchComments;

            // Check if fetchComments is set to "true"
            if (fetchComments === "true") {
                const redditPostUrl = data.redditPostUrl;
                const displayDelay = parseInt(data.displayDelay) * 1000; // Convert to milliseconds
                const lagTime = parseInt(data.lagTime) * 1000;           // Convert to milliseconds
                FETCH_COMMENTS = true;
                createCommentSection();
                startFetchingComments(redditPostUrl, displayDelay, lagTime);
            } else {
                FETCH_COMMENTS = false;
            }
        });
    }
});


// Initialise settings 
chrome.storage.sync.get(["redditPostUrl", "displayDelay", "lagTime", "fetchComments"], function(data) {
    const settingsExist = Object.keys(data).length !== 0;
    console.log(data.fetchComments);
    console.log("fdasfas");

    // If the settings do not exist, set the default values
    if (!settingsExist) {
        chrome.storage.sync.set({
            redditPostUrl: "",
            displayDelay: 3,
            lagTime: 0,
            fetchComments: "false"
        });
    }
});