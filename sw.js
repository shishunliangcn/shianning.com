/*
 * Service Worker：只为满足「安装到主屏幕」的条件，不做任何缓存。
 *
 * 刻意保持 network-only：
 * 知识库内容更新频繁，缓存策略一旦出错，用户会看到过期页面。
 * 这里只登记一个 fetch 事件处理器，请求照常走网络。
 */
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {
  // 不拦截、不缓存，交由浏览器默认处理
})
