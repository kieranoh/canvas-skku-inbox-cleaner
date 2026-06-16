# Privacy Policy

Last updated: 2026-06-16

Canvas SKKU Inbox Cleaner is a Chrome extension for `https://canvas.skku.edu`. It helps users find Canvas Inbox conversations from `LectureNoti` and `스마트 알림`, then manually mark those conversations as read or delete them from the current user’s Canvas Inbox view.

## Data the extension handles

When the user clicks `Scan Inbox`, the extension reads Canvas Inbox conversation metadata from `canvas.skku.edu`, such as:

- conversation IDs
- conversation subjects
- participant or sender display names
- message timestamps

The extension uses this information only to find matching conversations and show the result list in the popup.

When the user clicks `Mark Read` or `Delete Matched`, the extension sends the requested action to Canvas API endpoints on `canvas.skku.edu` using the user’s existing Canvas login session.

## Data collection and storage

The extension does not collect, store, or maintain user data on developer-controlled servers.

The extension does not use analytics, advertising SDKs, tracking scripts, or external data collection services.

The extension does not ask for or store Canvas passwords.

## Data sharing

The extension does not sell, share, or transfer user data to the developer, advertisers, analytics providers, or other third parties.

The extension communicates only with `canvas.skku.edu` to provide the user-requested scan, mark-read, and delete features.

## User control

The extension does not run automatic cleanup in the background. The user must open the extension popup and explicitly click:

- `Scan Inbox`
- `Mark Read`
- `Delete Matched`

Delete actions require an additional confirmation prompt before any deletion request is sent.

## Permissions

The extension requests the following Chrome permissions:

- `activeTab`: used to run only on the active `canvas.skku.edu` tab after the user opens the popup.
- `scripting`: used to execute the scan, mark-read, and delete logic inside the active Canvas tab.
- `https://canvas.skku.edu/*`: used to communicate with the SKKU Canvas site and Canvas Inbox API.

These permissions are used only for the extension’s single purpose: helping users clean up matching Canvas Inbox conversations.

## Contact

For questions, issues, or removal requests, use the GitHub issue tracker:

https://github.com/kieranoh/canvas-skku-inbox-cleaner/issues
