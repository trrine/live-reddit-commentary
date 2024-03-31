let url = "https://www.reddit.com/r/MAFS_AU/comments/1bs4l7m/married_at_first_sight_s11e35_live_episode/"


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




// Fetch comments from the Reddit post
fetchRedditComments(url)
    .then(comments => {
        if (comments) {
            console.log("Comments:", comments);

            comments.forEach(comment => {
                console.log(comment.body); 
            });
        } else {
            console.log("No comments found");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });