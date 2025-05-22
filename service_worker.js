// ========================================================
// 企業色相環 - Service Worker
// PWA機能（オフライン対応、キャッシング）を提供
// ========================================================

const CACHE_NAME = 'corporate-color-health-v1.0.0';
const STATIC_CACHE_NAME = 'corporate-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'corporate-dynamic-v1.0.0';

// キャッシュするリソース
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/methodology.html',
  '/companies.html',
  '/company.html',
  '/manifest.json',
  
  // CSS
  '/css/styles.css',
  '/css/index.css',
  '/css/about.css',
  '/css/methodology.css',
  '/css/companies.css',
  '/css/company.css',
  
  // JavaScript
  '/js/utils.js',
  '/js/search.js',
  '/js/companies.js',
  '/js/company.js',
  
  // フォント
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap',
  
  // アイコン・画像
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/images/color-wheel-logo.svg',
  '/favicon.ico',
  '/apple-touch-icon.png'
];

// 動的にキャッシュするリソースのパターン
const DYNAMIC_CACHE_PATTERNS = [
  '/api/',
  '/data/',
  'https://fonts.gstatic.com/'
];

// ネットワーク優先でキャッシュするリソース
const NETWORK_FIRST_PATTERNS = [
  '/api/companies',
  '/api/company',
  '/data/companies.json'
];

// Service Worker インストール
self.addEventListener('install', event => {
  console.log('[SW] Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Service Worker アクティベート
self.addEventListener('activate', event => {
  console.log('[SW] Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // 古いキャッシュを削除
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName.startsWith('corporate-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated successfully');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[SW] Failed to activate Service Worker:', error);
      })
  );
});

// リクエスト処理
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin && !DYNAMIC_CACHE_PATTERNS.some(pattern => 
    url.href.includes(pattern))) {
    return;
  }
  
  // ネットワーク優先のリソース
  if (NETWORK_FIRST_PATTERNS.some(pattern => url.pathname.includes(pattern))) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // 静的リソース（キャッシュ優先）
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js') || url.pathname.endsWith('.png') || 
      url.pathname.endsWith('.svg') || url.pathname.endsWith('.ico')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // HTMLページ（stale-while-revalidate）
  if (request.mode === 'navigate' || 
      (request.method === 'GET' && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // その他のリソース（ネットワーク優先）
  event.respondWith(networkFirst(request));
});

// キャッシュ優先戦略
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // 成功した場合のみキャッシュに保存
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    
    // オフライン時のフォールバック
    if (request.mode === 'navigate') {
      const fallbackResponse = await caches.match('/offline.html');
      return fallbackResponse || new Response('オフラインです', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    throw error;
  }
}

// ネットワーク優先戦略
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // 成功した場合のみキャッシュに保存
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network first failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // オフライン時のフォールバック
    if (request.mode === 'navigate') {
      const fallbackResponse = await caches.match('/offline.html');
      return fallbackResponse || new Response('オフラインです', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    throw error;
  }
}

// Stale-While-Revalidate戦略
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.error('[SW] Stale while revalidate network failed:', error);
    return null;
  });
  
  // キャッシュがある場合はキャッシュを返し、バックグラウンドで更新
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // キャッシュがない場合はネットワークを待つ
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // すべて失敗した場合のフォールバック
  return new Response('コンテンツを読み込めませんでした', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

// バックグラウンド同期
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-companies') {
    event.waitUntil(syncCompaniesData());
  }
});

// 企業データの同期
async function syncCompaniesData() {
  try {
    console.log('[SW] Syncing companies data...');
    
    const response = await fetch('/api/companies');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      await cache.put('/api/companies', response.clone());
      console.log('[SW] Companies data synced successfully');
    }
  } catch (error) {
    console.error('[SW] Failed to sync companies data:', error);
  }
}

// プッシュ通知
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : '新しい企業データが利用可能です',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    tag: 'corporate-update',
    renotify: true,
    actions: [
      {
        action: 'view',
        title: '確認する',
        icon: '/assets/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: '閉じる',
        icon: '/assets/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('企業色相環', options)
  );
});

// 通知クリック処理
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/companies.html')
    );
  }
});

// エラーハンドリング
self.addEventListener('error', event => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

// 定期的なキャッシュクリーンアップ
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEANUP_CACHE') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    
    // 1週間以上古いキャッシュを削除
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const deletePromises = requests.map(async request => {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (responseDate < oneWeekAgo) {
            return cache.delete(request);
          }
        }
      }
    });
    
    await Promise.all(deletePromises);
    console.log('[SW] Cache cleanup completed');
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}