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
                    body: comment.data.body
                };
            });
            return comments;
        } else {
            console.log("No comments found");
            return []; 
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
            console.log(comment.body); 
            resolve();
        }, displayDelay);
    });
}


// Function to fetch and display comments with a specified display delay
async function fetchAndDisplayCommentsWithDelay(url, displayDelay, lagTime) {
    // Set to track displayed comments by their IDs
    const displayedCommentIds = new Set();

    try {
        // Fetch comments from the Reddit post
        const comments = await fetchRedditComments(url);

        // Filter out comments that have already been displayed
        const newComments = comments.filter(comment => {
            const displayTime = parseFloat(comment.created_utc) + lagTime; // Calculate the time when the comment should be displayed
            return !displayedCommentIds.has(comment.id) && displayTime <= Date.now(); // Check if the comment is eligible for display
        });

        // Display new comments with a delay between each comment
        for (const comment of newComments) {
            await displayCommentWithDelay(comment, displayDelay);
            displayedCommentIds.add(comment.id);
        }
    } catch (error) {
        console.error("Error fetching and displaying comments:", error);
    }
}

// Example usage:
const redditPostUrl = "https://www.reddit.com/r/MAFS_AU/comments/1bs4l7m/married_at_first_sight_s11e35_live_episode/";
const displayDelay = 5000; // 5 seconds display delay between comments
const lagTime = 1 * 60 * 1000; // 1 minute lag time in milliseconds
fetchAndDisplayCommentsWithDelay(redditPostUrl, displayDelay, lagTime);
