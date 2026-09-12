/* =====================================================
 * app.js · 公共库
 *  - SVG 图元（Chrome Hearts 克罗心荆棘十字架 / 蓝色宝石）
 *  - localStorage 数据层（字卡库 / 人设 / API / 动态 / 信件 / 聊天记录）
 *  - AI 接口调用（默认按 DeepSeek 的接口格式，同格式的服务都能直接用）
 *  - 页面通用初始化（配色、标题、漂浮装饰）
 * 全部改动保存在浏览器本地（localStorage），刷新不丢失。
 * ===================================================== */
(function (window, document) {
  'use strict';

  var LN = {};

  /* ---------------------------------------------------
   * 1. SVG 图元
   * 克罗心十字架：拉丁十字（竖长横短）+ 四端卷曲荆棘藤蔓 +
   * 卷草雕花，严格左右对称（用 <use> 镜像保证），做旧 925 银质感。
   * --------------------------------------------------- */
  var SPRITE = [
    '<svg id="ln-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none">',
    '<defs>',
    /* 银饰渐层：模拟 925 银浮雕的凹凸明暗 */
    '<linearGradient id="lnSilver" x1="0" y1="0" x2="0.35" y2="1">',
    '<stop offset="0" stop-color="#ffffff"/>',
    '<stop offset=".28" stop-color="#eef4fb"/>',
    '<stop offset=".5" stop-color="#b9c8dd"/>',
    '<stop offset=".72" stop-color="#f6faff"/>',
    '<stop offset="1" stop-color="#93a5bf"/>',
    '</linearGradient>',
    /* 蓝色宝石 */
    '<linearGradient id="lnGem" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0" stop-color="#d9f0ff"/>',
    '<stop offset=".42" stop-color="#4fa0e0"/>',
    '<stop offset="1" stop-color="#0f3f70"/>',
    '</linearGradient>',
    '<linearGradient id="lnGem2" x1="0" y1="1" x2="1" y2="0">',
    '<stop offset="0" stop-color="#f2fbff"/>',
    '<stop offset="1" stop-color="#2b7fc4"/>',
    '</linearGradient>',

    /* ---- 十字架：主体（自对称） ---- */
    '<g id="lnCrossBody">',
    '<path d="M42 12 H58 V44 H86 V60 H58 V128 H42 V60 H14 V44 H42 Z" ',
    'fill="url(#lnSilver)" stroke="#6b7c94" stroke-width="1.7" stroke-linejoin="round"/>',
    '</g>',

    /* ---- 十字架：右半边的荆棘藤蔓（描边式，卷曲缠绕） ---- */
    '<g id="lnCrossVine" fill="none" stroke="url(#lnSilver)" stroke-width="4.6" ',
    'stroke-linecap="round" stroke-linejoin="round">',
    '<path d="M58 12 C60 4 69 1 73 8 C76 14 71 19 67 15 C64 12 66 8 69.5 9"/>',
    '<path d="M86 50 C94 46 99 37 94 32 C90 27.5 85 31 87 35.5 C89 39 93 37 92 33.5"/>',
    '<path d="M58 128 C61 136 70 137.5 74 131.5 C77 127 72 123.5 68 126.5"/>',
    '<path d="M58 62 C66 64.5 68 72.5 61.5 75.5 C57.5 77.6 56 74.2 58.4 72"/>',
    '</g>',

    /* ---- 十字架：右半边的尖刺荆棘 + 卷草雕花 ---- */
    '<g id="lnCrossThorn" fill="url(#lnSilver)" stroke="#6b7c94" stroke-width="1.1" stroke-linejoin="round">',
    '<path d="M62 44 L65.5 34.5 L69 44 Z"/>',
    '<path d="M73 44 L76.5 34.5 L80 44 Z"/>',
    '<path d="M62 60 L65.5 69.5 L69 60 Z"/>',
    '<path d="M73 60 L76.5 69.5 L80 60 Z"/>',
    '<path d="M58 72 L66.5 75.5 L58 79 Z"/>',
    '<path d="M58 96 L66.5 99.5 L58 103 Z"/>',
    '<path d="M74 44 C80 40 84 46 79 49 C76 50.5 75 48 77 47 Z"/>',
    '<path d="M74 60 C80 64 84 58 79 55 C76 53.5 75 56 77 57 Z"/>',
    '</g>',
    '</defs>',

    /* ---- 对外使用的 icon：白底圆形 + 居中克罗心荆棘十字架 ---- */
    '<symbol id="ln-cross" viewBox="0 0 100 140">',
    '<use href="#lnCrossBody"/>',
    '<use href="#lnCrossVine"/>',
    '<use href="#lnCrossVine" transform="translate(100,0) scale(-1,1)"/>',
    '<use href="#lnCrossThorn"/>',
    '<use href="#lnCrossThorn" transform="translate(100,0) scale(-1,1)"/>',
    '</symbol>',

    /* ---- 蓝色宝石 ---- */
    '<symbol id="ln-gem" viewBox="0 0 100 100">',
    '<polygon points="50,3 89,34 50,97 11,34" fill="url(#lnGem)"/>',
    '<polygon points="50,3 50,97 11,34" fill="url(#lnGem2)" opacity=".5"/>',
    '<polygon points="11,34 89,34 50,3" fill="#ffffff" opacity=".32"/>',
    '<path d="M11 34 H89" stroke="#ffffff" stroke-width="1.6" opacity=".6"/>',
    '<path d="M50 3 V97" stroke="#ffffff" stroke-width="1.2" opacity=".35"/>',
    '<path d="M11 34 L89 34 L50 97 Z" fill="none" stroke="#ffffff" stroke-width="1" opacity=".28"/>',
    '</symbol>',
    '</svg>'
  ].join('');

  LN.sprite = function () {
    if (document.getElementById('ln-sprite')) return;
    var box = document.createElement('div');
    box.innerHTML = SPRITE;
    document.body.insertBefore(box.firstChild, document.body.firstChild);
  };

  /* 生成一个克罗心标记 / 宝石标记 */
  LN.crossMark = function (className) {
    return '<span class="ch-mark ' + (className || '') + '"><svg viewBox="0 0 100 140" aria-hidden="true"><use href="#ln-cross"/></svg></span>';
  };
  LN.gemMark = function (className) {
    return '<span class="gem-mark ' + (className || '') + '"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#ln-gem"/></svg></span>';
  };

  /* ---------------------------------------------------
   * 2. 基础工具
   * --------------------------------------------------- */
  LN.$ = function (sel, root) { return (root || document).querySelector(sel); };
  LN.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  LN.esc = function (str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  LN.uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  LN.safeSet = function (el, key, val) {
    if (el) el.style.setProperty(key, val);
  };

  /* 相对时间：刚刚 / x 分钟前 / 今天 HH:MM / MM-DD HH:MM */
  LN.timeAgo = function (ts) {
    var d = new Date(ts);
    var diff = Date.now() - ts;
    if (diff < 60 * 1000) return '刚刚';
    if (diff < 60 * 60 * 1000) return Math.floor(diff / 60000) + '分钟前';
    var now = new Date();
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
    if (d.toDateString() === now.toDateString()) return '今天 ' + hm;
    var y = new Date(now.getTime() - 86400000);
    if (d.toDateString() === y.toDateString()) return '昨天 ' + hm;
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
  };

  LN.fmtFull = function (ts) {
    var d = new Date(ts);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes());
  };

  /* ---------------------------------------------------
   * 3. 本地存储数据层
   * --------------------------------------------------- */
  var KEYS = {
    cards: 'lovenote.cards.v1',
    persona: 'lovenote.persona.v1',
    api: 'lovenote.api.v1',
    mode: 'lovenote.chatMode.v1',
    moments: 'lovenote.moments.v1',
    avatarHim: 'lovenote.avatar.him.v1',
    avatarMe: 'lovenote.avatar.me.v1',
    homePhoto: 'lovenote.homePhoto.v1',
    letters: 'lovenote.letters.v1',
    letterCount: 'lovenote.letterCount.v1',
    letterNext: 'lovenote.letterNext.v1',
    chatLog: 'lovenote.chatLog.v1'
  };
  LN.KEYS = KEYS;

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      var val = JSON.parse(raw);
      return (val === null || val === undefined) ? fallback : val;
    } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { window.localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { return false; }
  }
  LN.read = read;
  LN.write = write;

  /* config.js 里是 const SITE_CONFIG，声明在全局词法作用域，
   * 不会成为 window 的属性；这里两种写法都兜住。 */
  function cfg() {
    if (window.SITE_CONFIG) return window.SITE_CONFIG;
    try {
      return (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG) ? SITE_CONFIG : {};
    } catch (e) { return {}; }
  }

  /* ---- 字卡库 ---- */
  function defaultCards() {
    var list = (cfg().chat && cfg().chat.randomReplies) || [];
    return list.map(function (t) { return { id: LN.uid(), text: String(t) }; });
  }
  LN.getCards = function () {
    var stored = read(KEYS.cards, null);
    if (Array.isArray(stored)) {
      return stored.filter(function (c) { return c && c.text; })
        .map(function (c) { return { id: c.id || LN.uid(), text: String(c.text) }; });
    }
    return defaultCards();
  };
  LN.setCards = function (arr) { return write(KEYS.cards, arr); };
  LN.resetCards = function () {
    try { window.localStorage.removeItem(KEYS.cards); } catch (e) {}
  };

  /* ---- 人设 ---- */
  function defaultPersona() {
    var c = cfg().chat || {};
    var p = cfg().persona || {};
    var name = p.name || c.partnerName || '小悟';
    var userName = p.userName || c.userName || '玉子';
    return {
      name: name,
      avatarText: p.avatarText || c.partnerAvatarText || '悟',
      userName: userName,
      /* config 里没写人设时给一个通用兜底，保证 AI 不会"没有性格" */
      systemPrompt: p.systemPrompt ||
        ('你是' + name + '，是' + userName + '的恋人。说话自然、口语化、有点自己的脾气，' +
          '回答以 1~3 句为主，不要长篇大论，不要分点列举，不要提到自己是 AI 或语言模型。')
    };
  }
  LN.getPersona = function () {
    var d = defaultPersona();
    var s = read(KEYS.persona, {});
    return {
      name: s.name || d.name,
      avatarText: s.avatarText || d.avatarText,
      userName: s.userName || d.userName,
      systemPrompt: (s.systemPrompt === undefined || s.systemPrompt === '') ? d.systemPrompt : s.systemPrompt
    };
  };
  LN.setPersona = function (o) { return write(KEYS.persona, o); };

  /* ---- API（默认按 DeepSeek 填，换 Key 直接覆盖保存即可） ---- */
  var API_DEFAULT = { baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' };
  LN.API_DEFAULT = API_DEFAULT;

  function defaultApi() {
    var a = cfg().api || {};
    return {
      apiKey: a.apiKey || '',
      baseUrl: a.baseUrl || API_DEFAULT.baseUrl,
      model: a.model || API_DEFAULT.model
    };
  }
  /* 只在"从没存过"时用默认值；存过空字符串按"用户主动清空了 Key"处理 */
  function pick(v, fallback) {
    return (v === undefined || v === null) ? fallback : String(v);
  }
  LN.getApi = function () {
    var d = defaultApi(), s = read(KEYS.api, {});
    if (!s || typeof s !== 'object') s = {};
    return {
      apiKey: pick(s.apiKey, d.apiKey),
      baseUrl: pick(s.baseUrl, d.baseUrl),
      model: pick(s.model, d.model)
    };
  };
  LN.setApi = function (o) {
    var cur = LN.getApi();
    return write(KEYS.api, {
      apiKey: pick(o && o.apiKey, cur.apiKey),
      /* 地址和模型留空时回落到默认值，避免存成空串 */
      baseUrl: pick(o && o.baseUrl, cur.baseUrl) || API_DEFAULT.baseUrl,
      model: pick(o && o.model, cur.model) || API_DEFAULT.model
    });
  };
  /* 清空 Key（保留地址和模型），用于换号 / 撤掉密钥 */
  LN.clearApiKey = function () {
    var cur = LN.getApi();
    return write(KEYS.api, { apiKey: '', baseUrl: cur.baseUrl, model: cur.model });
  };
  LN.hasApi = function () { return !!LN.getApi().apiKey; };
  /* 把 Key 打码显示，方便确认"现在用的是哪一把" */
  LN.maskKey = function (k) {
    k = String(k || '');
    if (!k) return '';
    if (k.length <= 10) return k.slice(0, 2) + '****';
    return k.slice(0, 6) + '****' + k.slice(-4);
  };

  /* ---------------------------------------------------
   * 4.5 接口设置弹窗（所有页面共用）
   * 自己拼 DOM，不依赖页面里的 HTML，所以每个页面都能随时
   * 调起来：换 Key / 删 Key / 改地址模型 / 测连接。
   *   LN.openApiDialog({ onSaved: fn, onClose: fn })
   * --------------------------------------------------- */
  LN.openApiDialog = function (opts) {
    opts = opts || {};

    var mask = document.createElement('div');
    mask.className = 'mask';

    var box = document.createElement('div');
    box.className = 'dialog';
    box.innerHTML =
      '<div class="panel-head">' +
        '<span class="panel-title">接口设置</span>' +
        '<button class="icon-btn" type="button" data-act="close">✕</button>' +
      '</div>' +
      '<div class="panel-body">' +
        '<p class="muted" data-el="state"></p>' +
        '<div class="field mt14">' +
          '<label>API Key</label>' +
          '<input type="password" data-el="key" placeholder="sk-…" autocomplete="off" spellcheck="false">' +
          '<div class="tip">换 Key：把新的粘进来点保存，立刻生效。删 Key：清空后保存即可。</div>' +
        '</div>' +
        '<div class="field">' +
          '<label>接口地址 Base URL</label>' +
          '<input type="text" data-el="base" placeholder="https://api.deepseek.com/v1" spellcheck="false">' +
        '</div>' +
        '<div class="field">' +
          '<label>模型</label>' +
          '<input type="text" data-el="model" placeholder="deepseek-chat" spellcheck="false">' +
        '</div>' +
        '<button class="btn block" type="button" data-act="save">保存</button>' +
        '<div class="row mt8" style="gap:10px">' +
          '<button class="btn ghost" type="button" data-act="test" style="flex:1">测试连接</button>' +
          '<button class="btn danger" type="button" data-act="clear" style="flex:1">删除 Key</button>' +
        '</div>' +
        '<p class="muted mt8" data-el="msg"></p>' +
        '<p class="muted mt8">Key 只保存在这台设备的浏览器里，不会上传到任何服务器。</p>' +
      '</div>';

    function q(name) { return box.querySelector('[data-el="' + name + '"]'); }
    var keyInput = q('key');
    var baseInput = q('base');
    var modelInput = q('model');
    var stateEl = q('state');
    var msgEl = q('msg');

    function say(msg, isErr) {
      msgEl.textContent = msg || '';
      msgEl.style.color = isErr ? '#d0476c' : '';
    }

    function renderState() {
      var cur = LN.getApi();
      stateEl.textContent = cur.apiKey
        ? ('当前 Key：' + LN.maskKey(cur.apiKey) + ' · 模型 ' + cur.model)
        : '现在还没有保存 Key，AI 相关功能都用不了。';
      keyInput.value = cur.apiKey;
      baseInput.value = cur.baseUrl;
      modelInput.value = cur.model;
    }
    renderState();

    function saved() {
      renderState();
      if (typeof opts.onSaved === 'function') opts.onSaved();
    }

    function close() {
      mask.classList.remove('show');
      box.classList.remove('show');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () {
        if (mask.parentNode) mask.parentNode.removeChild(mask);
        if (box.parentNode) box.parentNode.removeChild(box);
      }, 260);
      if (typeof opts.onClose === 'function') opts.onClose();
    }

    function onKey(e) { if (e.key === 'Escape') close(); }

    box.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!btn) return;
      var act = btn.getAttribute('data-act');

      if (act === 'close') { close(); return; }

      if (act === 'save') {
        var k = keyInput.value.trim();
        if (!k && LN.hasApi() && !window.confirm('Key 留空 = 删掉现在保存的 Key，确定吗？')) return;
        LN.setApi({
          apiKey: k,
          baseUrl: baseInput.value.trim(),
          model: modelInput.value.trim()
        });
        saved();
        say(k ? '已保存 ✓ 现在用的是新 Key。' : '已删掉 Key，AI 暂时不能用了。');
        return;
      }

      if (act === 'clear') {
        if (!LN.hasApi()) { say('现在本来就没有 Key。', true); return; }
        if (!window.confirm('删除这台设备上保存的 API Key？')) return;
        LN.clearApiKey();
        saved();
        say('Key 已删除。想恢复随时把新的粘进来保存。');
        return;
      }

      if (act === 'test') {
        var t = {
          apiKey: keyInput.value.trim(),
          baseUrl: baseInput.value.trim(),
          model: modelInput.value.trim()
        };
        if (!t.apiKey) { say('先把 API Key 填上再测哦。', true); keyInput.focus(); return; }
        LN.setApi(t);
        saved();
        btn.disabled = true;
        btn.textContent = '测试中…';
        say('正在连接…');
        LN.chatApi([
          { role: 'system', content: '你是一个测试助手。' },
          { role: 'user', content: '只回复 ok 这两个字母，不要别的内容。' }
        ], { temperature: 0, maxTokens: 8 })
          .then(function (r) { say('连接成功 ✓ 已保存（模型回复：' + r + '）'); })
          .catch(function (e) { say('连接失败：' + (e && e.message ? e.message : '未知错误'), true); })
          .then(function () { btn.disabled = false; btn.textContent = '测试连接'; });
      }
    });

    mask.addEventListener('click', close);
    document.addEventListener('keydown', onKey);

    document.body.appendChild(mask);
    document.body.appendChild(box);
    requestAnimationFrame(function () {
      mask.classList.add('show');
      box.classList.add('show');
    });
    setTimeout(function () { try { keyInput.focus(); } catch (e) {} }, 120);
  };

  /* ---- 头像（朋友圈用：他 / 我，存压缩后的 dataURL） ---- */
function avatarKey(who) { return who === 'me' ? KEYS.avatarMe : KEYS.avatarHim; }
LN.getAvatar = function (who) {
  var v = read(avatarKey(who), '');
  return typeof v === 'string' ? v : '';
};
LN.setAvatar = function (who, dataUrl) { return write(avatarKey(who), String(dataUrl || '')); };
LN.clearAvatar = function (who) {
  try { window.localStorage.removeItem(avatarKey(who)); return true; }
  catch (e) { return false; }
};

/* ---- 主页照片（圆形徽记：本地传一张图替换十字架） ---- */
/* 本地设过就用本地的；没设过则回落到 config.js 里的 home.photo，
 * 这样想让所有人（包括对面那台设备）都看到同一张图时，把图片放进
 * 网站目录并在 config 里写上文件名即可。 */
LN.getHomePhoto = function () {
  var v = read(KEYS.homePhoto, '');
  if (typeof v === 'string' && v) return v;
  var c = cfg().home || {};
  return typeof c.photo === 'string' ? c.photo : '';
};
LN.setHomePhoto = function (dataUrl) { return write(KEYS.homePhoto, String(dataUrl || '')); };
LN.clearHomePhoto = function () {
  try { window.localStorage.removeItem(KEYS.homePhoto); return true; }
  catch (e) { return false; }
};
/* 本地是否已经有自己传的图（用来判断"恢复默认"是不是有效操作） */
LN.hasOwnHomePhoto = function () {
  var v = read(KEYS.homePhoto, '');
  return !!(typeof v === 'string' && v);
};

/* 把相册里选的图裁成正方形并压小，避免撑爆 localStorage（默认 220px JPEG） */
LN.pickImage = function (file, size) {
  return new Promise(function (resolve, reject) {
    if (!file) { reject(new Error('没有选择图片')); return; }
    if (file.type && file.type.indexOf('image/') !== 0) { reject(new Error('请选择图片文件')); return; }
    var url = window.URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      try {
        var s = size || 220;
        var min = Math.min(img.width, img.height) || s;
        var cv = document.createElement('canvas');
        cv.width = s;
        cv.height = s;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, s, s);
        ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, s, s);
        window.URL.revokeObjectURL(url);
        resolve(cv.toDataURL('image/jpeg', 0.86));
      } catch (e) {
        window.URL.revokeObjectURL(url);
        reject(new Error('图片处理失败，换一张试试'));
      }
    };
    img.onerror = function () {
      window.URL.revokeObjectURL(url);
      reject(new Error('图片读取失败，换一张试试'));
    };
    img.src = url;
  });
};

/* ---- 聊天模式 ---- */
  LN.getMode = function () { return read(KEYS.mode, 'cards') === 'ai' ? 'ai' : 'cards'; };
  LN.setMode = function (m) { return write(KEYS.mode, m); };

  /* ---- 朋友圈 ---- */
  LN.getMoments = function () { var a = read(KEYS.moments, []); return Array.isArray(a) ? a : []; };
  LN.setMoments = function (a) { return write(KEYS.moments, a); };

  /* ---- 聊天记录（只存真人来回的两类消息，系统提示不存） ---- */
  var CHAT_LOG_MAX = 400;
  LN.getChatLog = function () {
    var a = read(KEYS.chatLog, []);
    if (!Array.isArray(a)) return [];
    return a.filter(function (m) {
      return m && (m.who === 'user' || m.who === 'partner') && typeof m.text === 'string' && m.text;
    }).map(function (m) {
      return { who: m.who, text: m.text, time: m.time || Date.now() };
    });
  };
  LN.setChatLog = function (a) {
    var arr = Array.isArray(a) ? a.slice(-CHAT_LOG_MAX) : [];
    return write(KEYS.chatLog, arr);
  };
  LN.clearChatLog = function () {
    try { window.localStorage.removeItem(KEYS.chatLog); } catch (e) {}
  };

  /* ---- 信件 ---- */
  LN.getLetters = function () { var a = read(KEYS.letters, []); return Array.isArray(a) ? a : []; };
  LN.setLetters = function (a) { return write(KEYS.letters, a); };
  LN.getLetterCount = function () { var n = read(KEYS.letterCount, 0); return typeof n === 'number' ? n : 0; };
  LN.setLetterCount = function (n) { return write(KEYS.letterCount, n); };
  /* 下一次回信需要用户先写几封（3-5 随机，存起来保持稳定） */
  LN.getLetterNext = function () {
    var n = read(KEYS.letterNext, 0);
    if (typeof n !== 'number' || n < 3 || n > 5) {
      n = 3 + Math.floor(Math.random() * 3); // 3 / 4 / 5
      write(KEYS.letterNext, n);
    }
    return n;
  };
  LN.rollLetterNext = function () {
    var n = 3 + Math.floor(Math.random() * 3);
    write(KEYS.letterNext, n);
    return n;
  };

  /* ---------------------------------------------------
   * 4. AI 接口（默认按 DeepSeek 的格式，同格式的服务都能用）
   * --------------------------------------------------- */
  /* 把 HTTP 状态码翻译成看得懂的提示，换 Key 时好定位问题 */
  function friendlyError(status, raw) {
    var tip;
    if (status === 401 || status === 403) tip = 'API Key 不对或已失效，去 ⚙ 里换一把新的。';
    else if (status === 402) tip = '账户余额不足，去服务商那边看下。';
    else if (status === 404) tip = '接口地址不对，检查 Base URL（DeepSeek 是 https://api.deepseek.com/v1）。';
    else if (status === 429) tip = '请求太频繁或额度用完了，等一会儿再试。';
    else if (status >= 500) tip = '服务商那边出问题了，稍后再试。';
    else tip = '请求失败。';
    return new Error(tip + '（HTTP ' + status + '：' + String(raw).slice(0, 160) + '）');
  }

  LN.chatApi = function (messages, opts) {
    opts = opts || {};
    var api = LN.getApi();
    if (!api.apiKey) return Promise.reject(new Error('NOKEY'));
    var base = String(api.baseUrl || '').trim().replace(/\/+$/, '');
    if (!base) base = API_DEFAULT.baseUrl;
    var url = /\/chat\/completions$/.test(base) ? base : base + '/chat/completions';

    var body = {
      model: api.model || API_DEFAULT.model,
      messages: messages,
      temperature: opts.temperature === undefined ? 0.9 : opts.temperature
    };
    if (opts.maxTokens) body.max_tokens = opts.maxTokens;

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + api.apiKey
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw friendlyError(res.status, t);
        });
      }
      return res.json();
    }).then(function (data) {
      var choice = data && data.choices && data.choices[0];
      var text = choice && choice.message && choice.message.content;
      if (!text && choice && choice.text) text = choice.text;
      if (!text) throw new Error('接口未返回内容');
      return String(text).trim();
    });
  };

  /* ---------------------------------------------------
   * 5. 页面通用初始化
   * --------------------------------------------------- */
  LN.boot = function (opts) {
    opts = opts || {};
    LN.sprite();
    var g = cfg().global || {};
    var root = document.documentElement;
    if (g.gradientFrom) root.style.setProperty('--grad-from', g.gradientFrom);
    if (g.gradientTo) root.style.setProperty('--grad-to', g.gradientTo);
    if (g.textColor) root.style.setProperty('--text-color', g.textColor);
    document.title = g.siteTitle ? (g.siteTitle + (opts.title ? ' · ' + opts.title : '')) : (opts.title || 'Love Note');

    var decoBox = document.getElementById('floatDeco');
    if (decoBox && opts.deco !== false) {
      LN.deco(decoBox, opts.decoCount || 12);
    }
    return { g: g, cfg: cfg() };
  };

  /* 漂浮装饰：宝石 + 克罗心 + 星光 */
  var DECO_ITEMS = ['gem', 'gem', 'cross', '✨', 'gem', '💠'];
  LN.deco = function (box, count) {
    if (!box) return;
    var n = count || 12;
    for (var i = 0; i < n; i++) {
      var item = DECO_ITEMS[i % DECO_ITEMS.length];
      var s = document.createElement('span');
      if (item === 'gem') {
        s.className = 'deco-gem';
        s.innerHTML = '<svg viewBox="0 0 100 100"><use href="#ln-gem"/></svg>';
      } else if (item === 'cross') {
        s.className = 'deco-cross';
        s.innerHTML = '<svg viewBox="0 0 100 140"><use href="#ln-cross"/></svg>';
      } else {
        s.textContent = item;
      }
      s.style.left = (Math.random() * 96) + '%';
      s.style.animationDuration = (12 + Math.random() * 14) + 's';
      s.style.animationDelay = (-Math.random() * 20) + 's';
      if (!s.className) {
        s.style.fontSize = (12 + Math.random() * 12) + 'px';
        s.style.opacity = '.4';
      }
      box.appendChild(s);
    }
  };

  /* ---------------------------------------------------
   * 6. 主页入口兜底
   * 后台管理页生成的 config 若只带了老入口，这里自动补齐
   * 新页面（塔罗 / 写信 / 朋友圈），保证页面不会被"藏起来"。
   * --------------------------------------------------- */
  LN.EXTRA_HEARTS = [
    { icon: '🔮', color: '#4fa0e0', label: '抽一张塔罗', subLabel: '', url: 'tarot.html' },
    { icon: '✉️', color: '#79b3e0', label: '给他写信', subLabel: '', url: 'letter.html' },
    { icon: '🌤️', color: '#9ecdf0', label: '他的朋友圈', subLabel: '', url: 'moments.html' }
  ];

  LN.mergeHearts = function (list) {
    var arr = Array.isArray(list) ? list.slice() : [];
    var have = {};
    arr.forEach(function (h) { if (h && h.url) have[h.url] = 1; });
    LN.EXTRA_HEARTS.forEach(function (h) { if (!have[h.url]) arr.push(h); });
    return arr;
  };

  window.LN = LN;
})(window, document);
