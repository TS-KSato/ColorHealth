// ========================================================
// 企業色相環 - PWA 登録・管理スクリプト
// Service Worker の登録とPWA機能の初期化
// ========================================================

(function() {
  'use strict';

  // PWA サポート状況の確認
  const isPWASupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  };

  // Service Worker の登録
  const registerServiceWorker = async () => {
    if (!isPWASupported()) {
      console.log('[PWA] Service Worker is not supported');
      return;
    }

    try {
      console.log('[PWA] Registering Service Worker...');
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service Worker registered successfully:', registration.scope);

      // 更新チェック
      registration.addEventListener('updatefound', () => {
        console.log('[PWA] New Service Worker found');
        
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New Service Worker installed, showing update notification');
            showUpdateNotification();
          }
        });
      });

      // バックグラウンド同期の登録
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        await registration.sync.register('background-sync-companies');
        console.log('[PWA] Background sync registered');
      }

      return registration;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  };

  // アプリ更新通知の表示
  const showUpdateNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🔄</div>
        <div class="notification-text">
          <strong>アプリが更新されました</strong>
          <p>最新版を利用するには再読み込みしてください</p>
        </div>
        <div class="notification-actions">
          <button class="btn-update" onclick="location.reload()">更新</button>
          <button class="btn-dismiss" onclick="this.parentElement.parentElement.parentElement.remove()">後で</button>
        </div>
      </div>
    `;

    // スタイルを追加
    if (!document.getElementById('pwa-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'pwa-notification-styles';
      styles.textContent = `
        .pwa-update-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          padding: 16px;
          max-width: 360px;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          border: 1px solid #e1e4e8;
        }
        
        .notification-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .notification-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .notification-text {
          flex: 1;
        }
        
        .notification-text strong {
          color: #2c3e50;
          font-size: 14px;
        }
        
        .notification-text p {
          color: #5a6c7d;
          font-size: 13px;
          margin: 4px 0 0 0;
        }
        
        .notification-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        
        .btn-update, .btn-dismiss {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-update {
          background: #4A90E2;
          color: white;
        }
        
        .btn-update:hover {
          background: #3a7bc8;
        }
        
        .btn-dismiss {
          background: #f8f9fa;
          color: #5a6c7d;
        }
        
        .btn-dismiss:hover {
          background: #e9ecef;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 480px) {
          .pwa-update-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // 30秒後に自動削除
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 30000);
  };

  // インストールプロンプトの管理
  let deferredPrompt;
  const installButton = document.getElementById('pwa-install-button');

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Install prompt available');
    
    // デフォルトのプロンプトを防ぐ
    e.preventDefault();
    deferredPrompt = e;

    // インストールボタンを表示
    if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', showInstallPrompt);
    } else {
      // インストールボタンが存在しない場合は自動でバナーを表示
      setTimeout(showInstallBanner, 3000);
    }
  });

  // インストールプロンプトの表示
  const showInstallPrompt = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[PWA] Install prompt result:', outcome);
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      
      deferredPrompt = null;
      
      if (installButton) {
        installButton.style.display = 'none';
      }
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
    }
  };

  // インストールバナーの表示
  const showInstallBanner = () => {
    if (!deferredPrompt) return;

    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">📱</div>
        <div class="banner-text">
          <strong>企業色相環をインストール</strong>
          <p>ホーム画面に追加して素早くアクセス</p>
        </div>
        <div class="banner-actions">
          <button class="btn-install">インストール</button>
          <button class="btn-close">×</button>
        </div>
      </div>
    `;

    // バナースタイルを追加
    if (!document.getElementById('pwa-banner-styles')) {
      const styles = document.createElement('style');
      styles.id = 'pwa-banner-styles';
      styles.textContent = `
        .pwa-install-banner {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: linear-gradient(135deg, #4A90E2, #50E3C2);
          color: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(74, 144, 226, 0.3);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }
        
        .banner-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }
        
        .banner-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .banner-text {
          flex: 1;
        }
        
        .banner-text strong {
          font-size: 14px;
          display: block;
        }
        
        .banner-text p {
          font-size: 12px;
          margin: 2px 0 0 0;
          opacity: 0.9;
        }
        
        .banner-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .btn-install {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-install:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .btn-close {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        
        .btn-close:hover {
          opacity: 1;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 480px) {
          .pwa-install-banner {
            left: 10px;
            right: 10px;
            bottom: 10px;
          }
          
          .banner-content {
            padding: 12px;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    // イベントリスナーを追加
    banner.querySelector('.btn-install').addEventListener('click', () => {
      showInstallPrompt();
      banner.remove();
    });

    banner.querySelector('.btn-close').addEventListener('click', () => {
      banner.remove();
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    });

    // 24時間以内に拒否された場合は表示しない
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const daysPassed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysPassed < 1) {
        return;
      }
    }

    document.body.appendChild(banner);

    // 10秒後に自動削除
    setTimeout(() => {
      if (banner.parentElement) {
        banner.remove();
      }
    }, 10000);
  };

  // アプリインストール完了時の処理
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    
    // インストールボタンを非表示
    if (installButton) {
      installButton.style.display = 'none';
    }
    
    // 分析イベントを送信（実装時）
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install', {
        event_category: 'PWA',
        event_label: 'App Installed'
      });
    }
  });

  // オンライン/オフライン状態の管理
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle('pwa-offline', !isOnline);
    
    console.log('[PWA] Connection status:', isOnline ? 'online' : 'offline');
    
    if (!isOnline) {
      showOfflineNotification();
    }
  };

  // オフライン通知の表示
  const showOfflineNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'pwa-offline-notification';
    notification.innerHTML = `
      <div class="offline-content">
        <div class="offline-icon">📴</div>
        <div class="offline-text">オフラインモードです</div>
      </div>
    `;

    // オフライン通知のスタイル
    if (!document.getElementById('pwa-offline-styles')) {
      const styles = document.createElement('style');
      styles.id = 'pwa-offline-styles';
      styles.textContent = `
        .pwa-offline-notification {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #e74c3c;
          color: white;
          z-index: 1001;
          animation: slideDown 0.3s ease-out;
        }
        
        .offline-content {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .offline-icon {
          font-size: 16px;
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        body.pwa-offline .site-header {
          margin-top: 40px;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // オンラインに戻ったら削除
    const removeOfflineNotification = () => {
      if (navigator.onLine && notification.parentElement) {
        notification.remove();
        window.removeEventListener('online', removeOfflineNotification);
      }
    };

    window.addEventListener('online', removeOfflineNotification);
  };

  // イベントリスナーの設定
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // 初期化
  const initPWA = async () => {
    console.log('[PWA] Initializing...');
    
    // Service Worker の登録
    await registerServiceWorker();
    
    // オンライン状態の初期化
    updateOnlineStatus();
    
    // キャッシュクリーンアップ（1日1回）
    const lastCleanup = localStorage.getItem('pwa-last-cleanup');
    const daysSinceCleanup = lastCleanup ? 
      (Date.now() - parseInt(lastCleanup)) / (1000 * 60 * 60 * 24) : 1;
    
    if (daysSinceCleanup >= 1) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEANUP_CACHE' });
        localStorage.setItem('pwa-last-cleanup', Date.now().toString());
      }
    }
    
    console.log('[PWA] Initialization completed');
  };

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
  } else {
    initPWA();
  }

})();