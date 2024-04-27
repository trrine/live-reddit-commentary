# Live Reddit Commentary (in progress)
 Chrome extension for displaying live Reddit comments while streaming TV shows.

<img src="https://github.com/trrine/live-reddit-commentary/blob/main/assets/example.png" height="400">


## Description
The Live Reddit Commentary Chrome extension allows you to effortlessly view real-time comments from Reddit discussions directly within your browser. Designed for live TV show streams and episode discussions, this extension keeps you connected with the conversation without the need to constantly keep checking Reddit and refreshing the page. Simply enter the URL of a live discussion post on Reddit, set the display delay and lag time, and start receiving live commentary as it happens.

### Features:
- View real-time comments from Reddit discussions during live TV show streams
- Customise display delay and lag time for a personalised experience
- Resizable and draggable comment section with integrated dark mode toggle


## How to Use
1. <b>Install the Extension: Install the Live Reddit Commentary Chrome extension from the Chrome Web Store.</b>
2. Navigate to Your Content: Before using the extension, navigate to the webpage where you want to view live comments, such as a live TV show stream or an ongoing event discussion.
3. Access the Settings and Set Parameters: Click on the extension icon in your browser's toolbar to access the settings. 
- Reddit Post URL: Enter the URL of the live discussion post on Reddit that corresponds to the content you're watching.
- Display Delay (seconds): Set the time interval between each displayed comment.
- Lag Time (seconds): If you're watching a live broadcast with a delay, enter the lag time to avoid spoilers.
4. Start Displaying Comments: Once the settings are configured, click "Start" to begin displaying comments in real time. The comment section will appear on the webpage where you've navigated.
5. Customise the Comment Section:
- Drag and Drop: Move the comment section to a different position on your screen by dragging the header.
- Resize: Adjust the size of the comment section by dragging the bottom-right corner of the box.
- Toggle Dark Mode: Click within the comment section to switch between light and dark mode for comfortable viewing.
6. Stop Fetching Comments: To stop fetching and displaying comments, click "Stop". This will remove the comment section from the webpage.

<img src="https://github.com/trrine/live-reddit-commentary/blob/main/assets/popup.png" height="400"> <img src="https://github.com/trrine/live-reddit-commentary/blob/main/assets/popup_dark.png" height="400">



### Limitations
The Reddit API only allows fetching the 1000 most recent comments on a post. For this reason, this extension is best suited for watching live-streamed rather than recorded TV content - even with the lag option.

## Acknowledgements
- Code for making comment section draggable adapted from [W3Schools](https://www.w3schools.com/howto/howto_js_draggable.asp).

### TO DO:
- Handle replies
- Isolate to single tab
