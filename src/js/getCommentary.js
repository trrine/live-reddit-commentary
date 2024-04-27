let FETCH_COMMENTS = false;              // To check whether to keep fetching/displaying comments
let DISPLAYED_COMMENT_IDS = new Set();   // To track displayed comments by their IDs


function modifyRedditUrl(url) {
    return url.slice(0, -1).concat(".json?sort=new");
}


function toggleDarkMode() {
    const commentSection = document.getElementById("redditCommentSection");
    commentSection.classList.toggle("darkMode");
}


function extractComments(data) {
    if (data && data[1] && data[1].data.children) {
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
    const dateTime = new Date(utcDate * 1000);
    return formattedDateTime = dateTime.toLocaleString();
}


async function displayCommentWithDelay(comment, displayDelay) {
    return new Promise(resolve => {
        setTimeout(() => {
            addCommentToDisplay(comment);
            resolve();
        }, displayDelay);
    });
}


function addCommentToDisplay(comment) {
    if (!FETCH_COMMENTS) return;
    
    const commentSection = document.getElementById("redditComments");
    
    if (commentSection) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("redditComment");
        commentDiv.innerHTML = `<p class="redditCommentHeader">${comment.author} @ ${formatUtcDate(comment.created_utc)} [${comment.score}]:</p><p>${comment.body}</p>`;
        commentSection.appendChild(commentDiv);

        // Automatically scroll to the bottom
        commentSection.scrollTop = commentSection.scrollHeight;
    }
}


async function fetchAndDisplayCommentsWithDelay(url, displayDelay, lagTime) {
    try {
        let commentStack = await fetchRedditComments(url);

        commentStack = (commentStack || []).filter(comment => {
                const displayTime = parseFloat(comment.created_utc) + lagTime;
                return !DISPLAYED_COMMENT_IDS.has(comment.id) && displayTime <= Date.now();
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


function removeCommentSection() {
    const commentSection = document.getElementById("redditCommentSection");
    if (commentSection) commentSection.remove();
}


function createCommentSection() {
    removeCommentSection();

    // Create a new div element for the comment section
    let commentSection = document.createElement("div");
    commentSection.id = "redditCommentSection";
    commentSection.classList.add("commentSection");

    // Create header + comment div
    let commentSectionHeader = document.createElement("div");
    commentSectionHeader.id = "redditCommentSectionHeader";
    commentSectionHeader.textContent = "Discussion";
    commentSection.appendChild(commentSectionHeader);

    let comments = document.createElement("div");
    comments.id = "redditComments";
    commentSection.appendChild(comments);

    document.body.appendChild(commentSection);
    dragElement(commentSection);

    // Add event listener to the toggle dark mode button
    commentSection.addEventListener("click", function() {
        toggleDarkMode();
    });
}


// Initialize settings 
chrome.storage.session.get(["redditPostUrl", "displayDelay", "lagTime", "fetchComments"], function(data) {
    const settingsExist = Object.keys(data).length !== 0;

    // If the settings do not exist, set the default values
    if (!settingsExist) {
        chrome.storage.session.set({
            redditPostUrl: "",
            displayDelay: 3,
            lagTime: 0,
            fetchComments: "false"
        }).catch(error => {
            console.error("Error initialising session storage with default values:", error);
        });
    }
});
    

// Event listener for changes in Chrome storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.redditPostUrl || changes.displayDelay || changes.lagTime || changes.fetchComments) {
        // Retrieve the updated settings
        chrome.storage.session.get(["redditPostUrl", "displayDelay", "lagTime", "fetchComments"], function(data) {
            const fetchComments = data.fetchComments;

            // Check if fetchComments is set to "true"
            if (fetchComments === "true") {
                const redditPostUrl = data.redditPostUrl;
                const displayDelay = parseInt(data.displayDelay) * 1000;
                const lagTime = parseInt(data.lagTime) * 1000;
                FETCH_COMMENTS = true;
                createCommentSection();
                startFetchingComments(redditPostUrl, displayDelay, lagTime);
            } else {
                FETCH_COMMENTS = false;
            }
        });
    }
});