// Function to toggle dark mode
function toggleDarkMode() {
    const commentSection = document.getElementById("commentSection");
    const comments = document.getElementById("comments");

    // Toggle dark mode class on comment section
    commentSection.classList.toggle("darkMode");

    // Toggle dark mode class on comments
    comments.classList.toggle("darkModeComments");
}