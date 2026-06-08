# Canvas SKKU Inbox Cleaner

Chrome extension for manually deleting Canvas Inbox conversations from `canvas.skku.edu` when the subject or sender/participant name contains:

- `LectureNoti`
- `스마트 알림`

## Install

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this folder: `canvas-skku-inbox-cleaner`.

## Use

1. Open a `https://canvas.skku.edu` tab and sign in.
2. Click the extension icon.
3. Click `Scan`.
4. Review the matched conversations. Click any listed item to open that conversation in Canvas.
5. Click `Mark Read` to mark matched conversations as read without deleting them.
6. Click `Delete matched` and confirm when you want to remove them from your Canvas view.
7. Watch the progress bar and final read/deleted/failed counts.

Deletion uses Canvas Conversations API and only removes the conversations from the current user's Canvas view.

The extension includes PNG icons in `icons/` for Chrome manifest compatibility.
