// ==UserScript==
// @name         Faptap 全站优先备用源
// @description  全站优先尝试备用播放源，失败或超时后回退原始请求。
// @version      1.2
// @homepageURL  https://github.com/monokaiyo/uBlock-filter-lists
// @supportURL   https://github.com/monokaiyo/uBlock-filter-lists/issues
// @updateURL    https://raw.githubusercontent.com/monokaiyo/uBlock-filter-lists/main/tampermonkey/faptap-backup-source.user.js
// @downloadURL  https://raw.githubusercontent.com/monokaiyo/uBlock-filter-lists/main/tampermonkey/faptap-backup-source.user.js
// @match        https://faptap.net/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

const nativeFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  if (typeof input !== 'string') return nativeFetch(input, init);
  const url = new URL(input, location.href);
  if (url.origin !== location.origin ||
      !/^\/api\/videos\/[^/]+\/sources$/.test(url.pathname) ||
      (init?.method || 'GET').toUpperCase() !== 'GET') {
    return nativeFetch(input, init);
  }
  url.pathname = url.pathname.replace(/\/sources$/, '/bunny-sources');
  try {
    const response = await nativeFetch(url.href, {
      ...init,
      signal: AbortSignal.any([
        AbortSignal.timeout(3000),
        ...(init?.signal ? [init.signal] : []),
      ]),
    });
    if (response.ok) {
      const body = await response.clone().json();
      if (!body.error && Array.isArray(body.data) && body.data.length &&
          body.data.every(source => typeof source?.url === 'string' && source.url.length)) {
        return response;
      }
    }
  } catch (error) {
    if (init?.signal?.aborted) throw error;
  }
  return nativeFetch(input, init);
};
