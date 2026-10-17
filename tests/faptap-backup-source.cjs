const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

async function main() {
  const calls = [];
  let mode = 'ok';
  const context = {
    URL, AbortSignal,
    location: new URL('https://faptap.net/v/2048240127175561217'),
    window: { fetch: async (input, init) => {
      calls.push([input, init]);
      if (!String(input).includes('/bunny-sources')) return new Response('original');
      init?.signal?.throwIfAborted();
      if (mode === 'timeout') {
        return new Promise((resolve, reject) => {
          init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true });
        });
      }
      if (mode === 'network') throw new TypeError('Network failure');
      if (mode === 'http') return new Response('unavailable', { status: 500 });
      if (mode === 'json') return new Response('not JSON');
      if (mode === 'empty') return Response.json({ data: [] });
      if (mode === 'error') return Response.json({ error: 'unavailable' });
      if (mode === 'invalid') return Response.json({ data: [{ url: null }] });
      return Response.json({ data: [{ url: 'https://media.example/playlist.m3u8' }] });
    } },
  };
  vm.runInNewContext(fs.readFileSync(`${__dirname}/../tampermonkey/faptap-backup-source.user.js`, 'utf8'), context);
  const options = { credentials: 'include', headers: { Accept: 'application/json' } };
  for (const input of [
    '/api/videos/2048240127175561217/sources',
    'https://faptap.net/api/videos/123/sources',
    '/api/videos/another-video/sources?test=1',
  ]) {
    calls.length = 0;
    const response = await context.window.fetch(input, options);
    assert.equal(calls.length, 1);
    const [url, forwarded] = calls[0];
    const original = new URL(input, context.location);
    assert.equal(new URL(url).pathname, original.pathname.replace(/\/sources$/, '/bunny-sources'));
    assert.equal(new URL(url).search, original.search);
    assert.equal(forwarded.credentials, options.credentials);
    assert.equal(forwarded.headers, options.headers);
    assert.equal((await response.json()).data.length, 1);
  }
  const original = '/api/videos/123/sources';
  for (mode of ['http', 'json', 'empty', 'error', 'invalid', 'network', 'timeout']) {
    calls.length = 0;
    const keepAlive = setTimeout(() => {}, 4000);
    try { assert.equal(await (await context.window.fetch(original, options)).text(), 'original'); }
    finally { clearTimeout(keepAlive); }
    assert.equal(calls.length, 2, mode);
    assert.equal(calls[1][0], original);
    assert.equal(calls[1][1], options);
  }
  mode = 'ok';
  const cancellation = new AbortController();
  cancellation.abort();
  calls.length = 0;
  await assert.rejects(context.window.fetch(original, { signal: cancellation.signal }), { name: 'AbortError' });
  assert.equal(calls.length, 1);
  for (const [input, init] of [
    ['/api/videos/123/bunny-sources', options],
    ['https://example.com/api/videos/123/sources', options],
    [new Request('https://faptap.net/'), options],
    [new URL('https://faptap.net/api/videos/123/sources'), options],
    ['/api/videos/123/metadata', options],
    [original, { method: 'POST' }],
  ]) {
    calls.length = 0;
    await context.window.fetch(input, init);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], input);
    assert.equal(calls[0][1], init);
  }
  console.log('PASS: all video IDs prefer backup; errors, empty sources and 3s timeout fall back; cancellation and unrelated requests preserved.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
