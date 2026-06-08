const CANVAS_HOST = "canvas.skku.edu";
const KEYWORDS = ["LectureNoti", "스마트 알림"];

const statusEl = document.getElementById("status");
const scanButton = document.getElementById("scanButton");
const readButton = document.getElementById("readButton");
const deleteButton = document.getElementById("deleteButton");
const matchedCountEl = document.getElementById("matchedCount");
const readCountEl = document.getElementById("readCount");
const deletedCountEl = document.getElementById("deletedCount");
const failedCountEl = document.getElementById("failedCount");
const resultList = document.getElementById("resultList");
const progressPanel = document.getElementById("progressPanel");
const progressLabel = document.getElementById("progressLabel");
const progressCount = document.getElementById("progressCount");
const deleteProgress = document.getElementById("deleteProgress");

let activeTabId = null;
let matchedConversations = [];

scanButton.addEventListener("click", scanInbox);
readButton.addEventListener("click", markMatchedRead);
deleteButton.addEventListener("click", deleteMatched);

initialize();

async function initialize() {
  const tab = await getActiveTab();
  if (!tab || !isCanvasTab(tab)) {
    activeTabId = null;
    scanButton.disabled = true;
    readButton.disabled = true;
    deleteButton.disabled = true;
    setStatus("canvas.skku.edu 탭에서만 실행할 수 있습니다.");
    return;
  }

  activeTabId = tab.id;
  scanButton.disabled = false;
  setStatus("Scan을 눌러 삭제 대상을 확인하세요.");
}

async function scanInbox() {
  if (!activeTabId) return;

  setBusy(true, "Inbox를 스캔하는 중입니다...");
  resetResults();

  try {
    const result = await runInCanvasTab(scanCanvasConversations, [KEYWORDS]);
    if (result.error) {
      throw new Error(result.error);
    }

    matchedConversations = result.matches || [];
    renderMatches(matchedConversations);
    matchedCountEl.textContent = String(matchedConversations.length);
    readButton.disabled = matchedConversations.length === 0;
    deleteButton.disabled = matchedConversations.length === 0;
    setStatus(
      matchedConversations.length
        ? `${matchedConversations.length}개 대화를 찾았습니다. 삭제 전 목록을 확인하세요.`
        : "삭제 대상 대화를 찾지 못했습니다."
    );
  } catch (error) {
    setStatus(`스캔 실패: ${error.message}`);
  } finally {
    setBusy(false);
  }
}

async function markMatchedRead() {
  if (!activeTabId || matchedConversations.length === 0) return;

  const total = matchedConversations.length;
  const confirmed = window.confirm(
    [
      `${total}개 대화를 읽음 처리합니다.`,
      "",
      "대상: 현재 스캔 결과에 표시된 LectureNoti / 스마트 알림 대화",
      "영향: 대화는 삭제되지 않고 Inbox에 남습니다.",
      "계속할까요?"
    ].join("\n")
  );
  if (!confirmed) return;

  setBusy(true, "읽음 처리를 시작합니다...");
  readButton.disabled = true;
  deleteButton.disabled = true;
  readCountEl.textContent = "0";
  failedCountEl.textContent = "0";
  showProgress(0, total, "읽음 처리 준비 중");

  const read = [];
  const failed = [];
  try {
    for (let index = 0; index < matchedConversations.length; index += 1) {
      const conversation = matchedConversations[index];
      showProgress(index, total, `읽음 처리 중: ${conversation.subject || `id ${conversation.id}`}`);

      const result = await runInCanvasTab(markCanvasConversationRead, [conversation.id]);
      if (result.read) {
        read.push(conversation.id);
      } else {
        failed.push({ id: conversation.id, reason: result.reason || result.error || "Unknown error" });
      }

      readCountEl.textContent = String(read.length);
      failedCountEl.textContent = String(failed.length);
      showProgress(index + 1, total, `${index + 1} / ${total} 처리 완료`);
    }

    renderMatches(matchedConversations, failed);
    setStatus(
      failed.length
        ? `${read.length}개 읽음 처리, ${failed.length}개 실패했습니다.`
        : `${read.length}개 대화를 읽음 처리했습니다.`
    );
  } catch (error) {
    setStatus(`읽음 처리 실패: ${error.message}`);
  } finally {
    setBusy(false);
    readButton.disabled = matchedConversations.length === 0;
    deleteButton.disabled = matchedConversations.length === 0;
  }
}

async function deleteMatched() {
  if (!activeTabId || matchedConversations.length === 0) return;

  const total = matchedConversations.length;
  const confirmed = window.confirm(
    [
      `${total}개 대화를 Canvas Inbox에서 삭제합니다.`,
      "",
      "대상: 제목 또는 보낸 사람/참여자 이름에 LectureNoti 또는 스마트 알림이 들어간 대화",
      "영향: Canvas API 기준으로 현재 사용자 화면에서만 삭제됩니다.",
      "주의: 삭제가 시작되면 중간에 취소할 수 없습니다.",
      "",
      "계속할까요?"
    ].join("\n")
  );
  if (!confirmed) return;

  setBusy(true, "삭제를 시작합니다...");
  deleteButton.disabled = true;
  deletedCountEl.textContent = "0";
  failedCountEl.textContent = "0";
  showProgress(0, total, "삭제 준비 중");

  const deleted = [];
  const failed = [];
  try {
    for (let index = 0; index < matchedConversations.length; index += 1) {
      const conversation = matchedConversations[index];
      showProgress(index, total, `삭제 중: ${conversation.subject || `id ${conversation.id}`}`);

      const result = await runInCanvasTab(deleteCanvasConversation, [conversation.id]);
      if (result.deleted) {
        deleted.push(conversation.id);
      } else {
        failed.push({ id: conversation.id, reason: result.reason || result.error || "Unknown error" });
      }

      deletedCountEl.textContent = String(deleted.length);
      failedCountEl.textContent = String(failed.length);
      showProgress(index + 1, total, `${index + 1} / ${total} 처리 완료`);
    }

    matchedConversations = matchedConversations.filter(
      (conversation) => !deleted.includes(conversation.id)
    );
    renderMatches(matchedConversations, failed);
    matchedCountEl.textContent = String(matchedConversations.length);
    deleteButton.disabled = matchedConversations.length === 0;
    setStatus(
      failed.length
        ? `${deleted.length}개 삭제, ${failed.length}개 실패했습니다. 실패 항목은 목록에 남겨뒀습니다.`
        : `${deleted.length}개 대화를 삭제했습니다.`
    );
  } catch (error) {
    setStatus(`삭제 실패: ${error.message}`);
  } finally {
    setBusy(false);
    deleteButton.disabled = matchedConversations.length === 0;
  }
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function isCanvasTab(tab) {
  try {
    return new URL(tab.url).host === CANVAS_HOST;
  } catch {
    return false;
  }
}

async function runInCanvasTab(func, args) {
  const [execution] = await chrome.scripting.executeScript({
    target: { tabId: activeTabId },
    world: "MAIN",
    func,
    args
  });
  return execution.result;
}

function resetResults() {
  matchedConversations = [];
  matchedCountEl.textContent = "0";
  readCountEl.textContent = "0";
  deletedCountEl.textContent = "0";
  failedCountEl.textContent = "0";
  resultList.innerHTML = "";
  readButton.disabled = true;
  deleteButton.disabled = true;
  hideProgress();
}

function renderMatches(matches, failed = []) {
  const failedMap = new Map(failed.map((item) => [String(item.id), item.reason]));
  resultList.innerHTML = "";

  for (const conversation of matches) {
    const item = document.createElement("li");
    item.className = "result";

    const link = document.createElement("button");
    link.type = "button";
    link.className = "result-link";
    link.title = "Canvas에서 이 대화 열기";
    link.addEventListener("click", () => openConversation(conversation.id));

    const subject = document.createElement("p");
    subject.className = "subject";
    subject.textContent = conversation.subject || "(No subject)";

    const meta = document.createElement("p");
    meta.className = "meta";
    const parts = [
      `id ${conversation.id}`,
      conversation.matchedBy ? `matched: ${conversation.matchedBy}` : "",
      conversation.lastMessageAt || "",
      failedMap.has(String(conversation.id)) ? `failed: ${failedMap.get(String(conversation.id))}` : ""
    ].filter(Boolean);
    meta.textContent = parts.join(" | ");

    link.append(subject, meta);
    item.append(link);
    resultList.append(item);
  }
}

async function openConversation(id) {
  if (!activeTabId) return;

  await chrome.tabs.update(activeTabId, {
    active: true,
    url: `https://${CANVAS_HOST}/conversations/${encodeURIComponent(id)}`
  });
  window.close();
}

function showProgress(current, total, label) {
  progressPanel.hidden = false;
  deleteProgress.max = total || 1;
  deleteProgress.value = current;
  progressCount.textContent = `${current} / ${total}`;
  progressLabel.textContent = label;
}

function hideProgress() {
  progressPanel.hidden = true;
  deleteProgress.value = 0;
  progressCount.textContent = "0 / 0";
  progressLabel.textContent = "Ready";
}

function setBusy(isBusy, message) {
  scanButton.disabled = isBusy || !activeTabId;
  readButton.disabled = isBusy || matchedConversations.length === 0;
  deleteButton.disabled = isBusy || matchedConversations.length === 0;
  if (message) setStatus(message);
}

function setStatus(message) {
  statusEl.textContent = message;
}

async function scanCanvasConversations(keywords) {
  try {
    const matches = [];
    let url = "/api/v1/conversations?per_page=100";

    while (url) {
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error(`GET conversations returned ${response.status}`);
      }

      const payload = parseCanvasJson(await response.text());
      const conversations = Array.isArray(payload) ? payload : payload.conversations || [];

      for (const conversation of conversations) {
        const match = matchConversation(conversation, keywords);
        if (!match) continue;

        matches.push({
          id: conversation.id,
          subject: conversation.subject || "",
          matchedBy: match,
          lastMessageAt: conversation.last_message_at || conversation.start_at || ""
        });
      }

      url = getNextPageUrl(response.headers.get("Link"));
    }

    return { matches };
  } catch (error) {
    return { error: error.message };
  }

  function matchConversation(conversation, rawKeywords) {
    const normalizedKeywords = rawKeywords.map(normalizeText);
    const fields = [
      conversation.subject,
      conversation.user_name,
      conversation.context_name,
      conversation.last_author && conversation.last_author.name,
      ...(Array.isArray(conversation.participants)
        ? conversation.participants.flatMap((participant) => [
            participant.name,
            participant.full_name,
            participant.display_name,
            participant.short_name
          ])
        : [])
    ].filter(Boolean);

    for (const field of fields) {
      const normalizedField = normalizeText(field);
      const keywordIndex = normalizedKeywords.findIndex((keyword) => normalizedField.includes(keyword));
      if (keywordIndex >= 0) {
        return String(field);
      }
    }

    return "";
  }

  function normalizeText(value) {
    return String(value || "").trim().toLocaleLowerCase("ko-KR");
  }

  function parseCanvasJson(text) {
    return JSON.parse(text.replace(/^\s*while\s*\(\s*1\s*\)\s*;\s*/, ""));
  }

  function getNextPageUrl(linkHeader) {
    if (!linkHeader) return "";

    for (const part of linkHeader.split(",")) {
      const match = part.match(/<([^>]+)>;\s*rel="next"/);
      if (match) {
        return new URL(match[1], window.location.origin).toString();
      }
    }

    return "";
  }
}

async function deleteCanvasConversation(id) {
  try {
    const csrfToken = getCanvasCsrfToken();

    const response = await fetch(`/api/v1/conversations/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {}
    });

    if (!response.ok) {
      return { deleted: false, reason: `HTTP ${response.status}` };
    }

    return { deleted: true };
  } catch (error) {
    return { deleted: false, error: error.message };
  }

  function getCanvasCsrfToken() {
    if (window.ENV && window.ENV.CSRF_TOKEN) {
      return window.ENV.CSRF_TOKEN;
    }

    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta && meta.content) {
      return meta.content;
    }

    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("_csrf_token="));

    return cookie ? decodeURIComponent(cookie.slice("_csrf_token=".length)) : "";
  }
}

async function markCanvasConversationRead(id) {
  try {
    const csrfToken = getCanvasCsrfToken();
    const body = new URLSearchParams();
    body.set("conversation[workflow_state]", "read");

    const response = await fetch(`/api/v1/conversations/${encodeURIComponent(id)}`, {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {})
      },
      body
    });

    if (!response.ok) {
      return { read: false, reason: `HTTP ${response.status}` };
    }

    return { read: true };
  } catch (error) {
    return { read: false, error: error.message };
  }

  function getCanvasCsrfToken() {
    if (window.ENV && window.ENV.CSRF_TOKEN) {
      return window.ENV.CSRF_TOKEN;
    }

    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta && meta.content) {
      return meta.content;
    }

    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("_csrf_token="));

    return cookie ? decodeURIComponent(cookie.slice("_csrf_token=".length)) : "";
  }
}
