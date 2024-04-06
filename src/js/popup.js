// Function to handle clicking the "Start" button
document.getElementById("start").onclick = function () {
    const redditPostUrl = document.getElementById("redditPostUrl").value.trim();
    const displayDelay = parseInt(document.getElementById("displayDelay").value.trim()) || 5000; // Default display delay 5000ms if not specified
    const lagTime = parseInt(document.getElementById("lagTime").value.trim()) || 0; // Default lag time 0ms if not specified
    const fetchInterval = parseInt(document.getElementById("fetchInterval").value.trim()) || 30000; // Default fetch interval 30000ms if not specified

    // Check if mandatory input (URL) is provided
    if (!redditPostUrl) {
        alert("Please provide a Reddit post URL.");
        return;
    }

    // Save settings to Chrome storage
    chrome.storage.sync.set({
        redditPostUrl: redditPostUrl,
        displayDelay: displayDelay,
        lagTime: lagTime,
        fetchInterval: fetchInterval,
        fetchComments: "true"           // Set flag indicating to start/keep fetching comments
    }, function() {
        alert("Settings saved successfully!");
    });   
}