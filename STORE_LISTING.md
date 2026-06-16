# Chrome Web Store 등록정보 초안

아래 내용은 Chrome Web Store Developer Dashboard에 복사해서 넣기 위한 초안입니다.

참고 문서:

- Store listing: https://developer.chrome.com/docs/webstore/cws-dashboard-listing
- Privacy practices: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- User data policy FAQ: https://developer.chrome.com/docs/webstore/program-policies/user-data-faq

## Store Listing

### Extension name

```text
Canvas SKKU Inbox Cleaner
```

### Short description

```text
Clean up LectureNoti and smart notification messages from the SKKU Canvas Inbox.
```

### Detailed description

```text
Canvas SKKU Inbox Cleaner helps SKKU Canvas users reduce noisy Inbox messages from LectureNoti and smart notifications.

The extension works only on https://canvas.skku.edu. It scans the Canvas Inbox for conversations whose subject or sender/participant name contains “LectureNoti” or “스마트 알림”, then shows the matched results before taking any action.

Main features:
- Scan the Canvas Inbox for LectureNoti and smart notification conversations
- Open a matched conversation directly from the result list
- Mark matched conversations as read without deleting them
- Delete matched conversations from the current user’s Canvas Inbox view
- Show progress, success counts, and failure counts while processing

The extension does not run automatically in the background. Users must open the popup and click Scan Inbox, Mark Read, or Delete Matched. Delete actions require an additional confirmation prompt.

This extension does not send Canvas message data to the developer or to any external analytics, advertising, or tracking service. It only communicates with canvas.skku.edu using the user’s existing Canvas login session.
```

### Category

```text
Productivity
```

### Language

```text
English
```

권장: 한국어 사용자가 주 대상이면 나중에 `_locales/ko`를 추가하고 한국어 listing을 별도로 넣는 편이 더 깔끔합니다. 현재 확장은 `_locales` 구조가 없으므로 기본 언어는 `English`가 무난합니다.

### Homepage URL

```text
https://github.com/kieranoh/canvas-skku-inbox-cleaner
```

### Support URL

```text
https://github.com/kieranoh/canvas-skku-inbox-cleaner/issues
```

### Privacy policy URL

GitHub에 `PRIVACY.md`를 push한 뒤 아래 URL을 사용하세요.

```text
https://github.com/kieranoh/canvas-skku-inbox-cleaner/blob/main/PRIVACY.md
```

### Mature content

```text
No
```

### Suggested screenshot plan

Chrome Web Store에는 최소 1장의 1280x800 스크린샷이 필요합니다.

추천 스크린샷:

1. Canvas 탭에서 확장 팝업을 연 화면
2. Scan 결과가 표시된 화면
3. Mark Read 또는 Delete 진행 바가 보이는 화면

개인 메시지/이름/수업명은 반드시 가리거나 테스트 데이터로 찍으세요.

## Privacy Practices

### Single purpose description

```text
This extension helps SKKU Canvas users find LectureNoti and smart notification conversations in their Canvas Inbox, then manually mark them as read or delete them from the current user’s Canvas Inbox view.
```

### Permission justifications

#### activeTab

```text
Used only after the user opens the extension popup on canvas.skku.edu. It allows the extension to check the current active tab and run the user-requested scan/read/delete action only on that Canvas tab.
```

#### scripting

```text
Used to execute the scan, mark-read, and delete logic inside the active canvas.skku.edu tab after the user clicks a popup button. This is required so requests are made with the user’s existing Canvas session and are limited to the selected Canvas tab.
```

#### Host permission: https://canvas.skku.edu/*

```text
Required because the extension only works with the SKKU Canvas site. The extension uses Canvas Inbox API endpoints on canvas.skku.edu to list conversations, mark matched conversations as read, and delete matched conversations when the user explicitly confirms.
```

### Remote code

Select:

```text
No, I am not using remote code.
```

Explanation if a text box appears:

```text
The extension does not load or execute remotely hosted JavaScript. All extension code is packaged in the submitted extension files.
```

### Data usage disclosure

Recommended conservative selection:

```text
Website content
Personal communications
```

Reason:

```text
The extension reads Canvas Inbox conversation metadata, including conversation IDs, subjects, participant/sender display names, and timestamps, only to show matched results and perform the user-requested mark-read or delete action.
```

Do not select these unless the implementation changes:

```text
Personally identifiable information
Financial and payment information
Health information
Authentication information
Location
Web history
User activity
```

Note: The browser uses the user’s existing Canvas session to make same-origin Canvas API requests. The extension does not ask for, store, or transmit Canvas passwords. It does not send Canvas data to the developer.

### Limited use certification

You should be able to certify:

```text
I certify that this extension uses user data only to provide or improve its single purpose.
I certify that this extension does not sell or transfer user data to third parties, except as necessary to provide the extension’s single purpose, comply with law, or protect security.
I certify that this extension does not use or transfer user data for personalized advertising.
I certify that this extension does not allow humans to read user data.
```

### Privacy policy text summary

Use the full `PRIVACY.md` file as the privacy policy. The short version is:

```text
Canvas SKKU Inbox Cleaner processes Canvas Inbox conversation metadata locally in the browser and communicates only with canvas.skku.edu to provide the scan, mark-read, and delete features requested by the user. The extension does not collect, store, sell, share, or transmit user data to the developer, analytics providers, advertisers, or other third parties.
```

## Distribution

Recommended for first release:

```text
Visibility: Public or Unlisted
Regions: South Korea, or all regions if you want easier sharing
Pricing: Free
```

If the extension is mostly for SKKU students and you want review/testing with a smaller audience first, choose `Unlisted`.
