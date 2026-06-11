# Canvas SKKU Inbox Cleaner

`canvas.skku.edu` 메시지함에서 `LectureNoti`, `스마트 알림` 대화를 빠르게 정리하는 Chrome 확장 프로그램입니다.

스캔 결과를 먼저 확인한 뒤, 원하는 작업을 직접 누르는 방식입니다.

- `Mark Read`: 삭제하지 않고 읽음 처리
- `Delete Matched`: 현재 사용자 화면의 Canvas Inbox에서 삭제
- 목록 클릭: 해당 Canvas 대화로 이동

## 다운로드

### 방법 1: ZIP으로 받기

1. GitHub 저장소로 이동합니다.
   - https://github.com/kieranoh/canvas-skku-inbox-cleaner
2. 초록색 `Code` 버튼을 누릅니다.
3. `Download ZIP`을 누릅니다.
4. 다운로드된 ZIP 파일의 압축을 풉니다.
5. 압축을 푼 폴더 안의 `canvas-skku-inbox-cleaner-main` 폴더를 기억해둡니다.

### 방법 2: git clone으로 받기

```bash
git clone https://github.com/kieranoh/canvas-skku-inbox-cleaner.git
```

## Chrome에 설치하기

이 확장은 Chrome Web Store에 올린 확장이 아니라, 직접 불러오는 방식입니다.

1. Chrome 주소창에 아래 주소를 입력합니다.

```text
chrome://extensions
```

2. 오른쪽 위의 `Developer mode`를 켭니다.
3. 왼쪽 위의 `Load unpacked`를 누릅니다.
4. 다운로드한 확장 폴더를 선택합니다.
   - ZIP으로 받은 경우: 압축을 푼 `canvas-skku-inbox-cleaner-main` 폴더
   - git clone으로 받은 경우: `canvas-skku-inbox-cleaner` 폴더
5. Chrome 툴바에 확장 아이콘이 생기면 설치 완료입니다.

## 사용 방법

1. `https://canvas.skku.edu`에 로그인합니다.
2. Canvas 탭을 열어둔 상태에서 확장 아이콘을 누릅니다.
3. `Scan Inbox`를 누릅니다.
4. 아래 목록에서 정리 대상이 맞는지 확인합니다.
5. 삭제하지 않고 알림만 줄이고 싶으면 `Mark Read`를 누릅니다.
6. 메시지함에서 없애고 싶으면 `Delete Matched`를 누른 뒤 확인합니다.
7. 진행 바와 `Read`, `Deleted`, `Failed` 숫자를 확인합니다.

## 친구에게 공유하기

가장 쉬운 방법은 GitHub 링크를 보내는 것입니다.

```text
https://github.com/kieranoh/canvas-skku-inbox-cleaner
```

받는 사람에게는 README의 `다운로드`와 `Chrome에 설치하기` 순서대로 진행하라고 안내하면 됩니다.

직접 ZIP 파일로 공유할 수도 있지만, GitHub 링크를 보내는 편이 최신 버전을 받기 쉽습니다.

## 업데이트하기

### ZIP으로 받은 경우

1. GitHub에서 ZIP을 다시 다운로드합니다.
2. 기존 폴더를 새 폴더로 교체합니다.
3. `chrome://extensions`에서 이 확장의 `Reload` 버튼을 누릅니다.

### git clone으로 받은 경우

확장 폴더에서 아래 명령을 실행합니다.

```bash
git pull
```

그 다음 `chrome://extensions`에서 이 확장의 `Reload` 버튼을 누릅니다.

## 주의사항

- 이 확장은 `canvas.skku.edu`에서만 동작합니다.
- 자동으로 삭제하지 않습니다. 사용자가 직접 `Scan Inbox`, `Mark Read`, `Delete Matched`를 눌러야 합니다.
- `Delete Matched`는 Canvas Conversations API를 사용하며, 현재 사용자 화면의 Inbox에서만 대화를 제거합니다.
- 중요한 메시지가 섞여 있을 수 있으니 삭제 전 목록을 확인하세요.
