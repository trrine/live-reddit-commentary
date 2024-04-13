let FETCH_COMMENTS = false;              // To check whether to keep fetching/displaying comments
let DISPLAYED_COMMENT_IDS = new Set();   // To track displayed comments by their IDs

// Function to prepare Reddit url for fetching comments
function modifyRedditUrl(url) {
    // Prepare url to get JSON listing of subreddit post
    return url.slice(0, -1).concat(".json?sort=new");
}


// Function to fetch comments from a Reddit post
async function fetchRedditComments(url) {
    try {
        // Modify the URL to get JSON data
        const apiUrl = modifyRedditUrl(url);

        // Fetch data from the Reddit API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if data is available
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
    } catch (error) {
        console.error("Error fetching comments:", error);
        return []; 
    }
}


// Function to display a single comment with a specified delay
async function displayCommentWithDelay(comment, displayDelay) {
    return new Promise(resolve => {
        setTimeout(() => {
            const dateTime = new Date(comment.created_utc * 1000); // Convert UTC timestamp to milliseconds
            const formattedDateTime = dateTime.toLocaleString(); // Convert to local date time string
            console.log(`${comment.author} @ ${formattedDateTime} [${comment.score}]: \n${comment.body}`);
            resolve();
        }, displayDelay);
    });
}


// Function to fetch and display comments with a specified display delay
async function fetchAndDisplayCommentsWithDelay(url, displayDelay, lagTime) {
    try {
        let commentStack = await fetchRedditComments(url);
        commentStack = commentStack.filter(comment => {
            const displayTime = parseFloat(comment.created_utc) + lagTime; // Calculate the time when the comment should be displayed
            return !DISPLAYED_COMMENT_IDS.has(comment.id) && displayTime <= Date.now(); // Check if the comment is eligible for display
        });

        while (commentStack.length !== 0 && FETCH_COMMENTS) {
            const comment = commentStack.pop();
            await displayCommentWithDelay(comment, displayDelay);
            DISPLAYED_COMMENT_IDS.add(comment.id);
        }
    } catch (error) {
        console.error("Error fetching and displaying comments:", error);
    }
}


// Function to continuously fetch comments with a specified interval
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


// Event listener for changes in Chrome storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.redditPostUrl || changes.displayDelay || changes.lagTime || changes.fetchComments) {
        // Retrieve the updated settings
        chrome.storage.sync.get(["redditPostUrl", "displayDelay", "lagTime", "fetchComments"], function(data) {
            const fetchComments = data.fetchComments;

            // Check if fetchComments is set to "true"
            if (fetchComments === "true") {
                const redditPostUrl = data.redditPostUrl;
                const displayDelay = parseInt(data.displayDelay);
                const lagTime = parseInt(data.lagTime);
                FETCH_COMMENTS = true;
                startFetchingComments(redditPostUrl, displayDelay, lagTime);
            } else {
                FETCH_COMMENTS = false;
            }
        });
    }
});


// Initialise settings with default values
chrome.storage.sync.set({
            redditPostUrl: "",
            displayDelay: 1000,
            lagTime: 0,
            fetchComments: "false"
});