// Ensure popup is initialised correct each time
window.onload = function() {
    const toggleButton = document.getElementById("toggleButton");

    chrome.storage.sync.get(["redditPostUrl", "displayDelay", "lagTime", "fetchComments"], function(data) {
        const redditPostUrl = data.redditPostUrl;
        const displayDelay = parseInt(data.displayDelay);
        const lagTime = parseInt(data.lagTime);
        const fetchComments = data.fetchComments;

        // Update input fields
        document.getElementById("redditPostUrl").value = redditPostUrl;
        document.getElementById("displayDelay").value = displayDelay || 3;    // Default is 3 s
        document.getElementById("lagTime").value = lagTime || 0;              // Default is 0 s

        // Ensure correct text is displayed on toggle button
        if (fetchComments === "true") {
            toggleButton.textContent = "Stop";
        } else {
            toggleButton.textContent = "Start";
        }
    });
}

// Handle clicking the "Start" button
document.getElementById("toggleButton").onclick = function () {
    const toggleButton = document.getElementById("toggleButton");

    if (toggleButton.textContent === "Start") {
        const redditPostUrl = document.getElementById("redditPostUrl").value.trim();
        const displayDelay = parseInt(document.getElementById("displayDelay").value.trim()) || 3; // Default display delay 3 seconds if not specified
        const lagTime = parseInt(document.getElementById("lagTime").value.trim()) || 0;           // Default lag time 0 seconds if not specified

        // Check if mandatory input (URL) is provided
        if (!redditPostUrl) {
            alert("Please provide a Reddit post URL.");
            return;
        }

        // Switch button to "Stop"
        toggleButton.textContent = "Stop";

        // Save settings to Chrome storage
        chrome.storage.sync.set({
            redditPostUrl: redditPostUrl,
            displayDelay: displayDelay,
            lagTime: lagTime,
            fetchComments: "true"           // Set flag indicating to start/keep fetching comments
        });   
    } else {
        // Switch button to "Start"
        toggleButton.textContent = "Start";
        
        // Set fetchComments to false
        chrome.storage.sync.set({
            fetchComments: "false"
        });  
    }
}