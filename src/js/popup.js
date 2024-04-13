// Function to handle clicking the "Start" button
document.getElementById("toggleButton").onclick = function () {
    const toggleButton = document.getElementById("toggleButton");

    if (toggleButton.textContent === "Start") {
        const redditPostUrl = document.getElementById("redditPostUrl").value.trim();
        const displayDelay = 1000 * parseInt(document.getElementById("displayDelay").value.trim()) || 1000; // Default display delay 1 seconds if not specified
        const lagTime = 1000 * parseInt(document.getElementById("lagTime").value.trim()) || 0; // Default lag time 0 seconds if not specified

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
        }, function() {
            alert("Settings saved successfully!");
        });   
    } else {
        // Switch button to "Start"
        toggleButton.textContent = "Start";
        
        // Set fetchComments to false
        chrome.storage.sync.set({
            fetchComments: "false"
        }, function() {
            alert("Settings saved successfully!");
        });   
    }
}