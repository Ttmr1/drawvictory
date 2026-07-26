// ==========================================================
// 🎵 BGM再生システム
// ==========================================================
// ↓ music フォルダに入れたmp3ファイル名をここに追記してください
const BGM_TRACKS = [
    "music/404 フリーズコード.mp3",
    "music/Alone.mp3",
    "music/Combat March.mp3",
    "music/Crystal brilliance.mp3",
    "music/Glacial brilliance.mp3",
    "music/water's pride.mp3",
    "music/メランコリックシンドローム.mp3",
    "music/絶望から見いだした希望.mp3",
    "music/嘆きのダークローズ.mp3",
    "music/不思議の国のアリス症候群.mp3"
];

let bgmAudio = new Audio();
bgmAudio.preload = 'auto'; // 早めにバッファリングを始めておく
let bgmLastIndex = -1;
let bgmPool = []; // まだ今回のサイクルで流していない曲のインデックス一覧

// 音量はlocalStorageに保存（設定画面のスライダーと連動）
function getSavedBgmVolume() {
    const saved = localStorage.getItem('bgm_volume');
    return saved !== null ? parseFloat(saved) / 100 : 0.5; // デフォルト50%
}

function setBgmVolume(percent) {
    const vol = Math.max(0, Math.min(100, percent)) / 100;
    bgmAudio.volume = vol;
    localStorage.setItem('bgm_volume', percent);
}

// 抽選プールを全曲分に補充する（1周し終わった時に呼ばれる）
function refillBgmPool() {
    bgmPool = BGM_TRACKS.map((_, i) => i);
}

// 抽選プールから1曲選んで取り除く（プールが空なら補充してから選ぶ）
// 例: 10曲→9曲→8曲…→1曲→(全て流し終わったら)10曲に戻る
function pickNextTrackIndex() {
    if (BGM_TRACKS.length <= 1) return 0;

    if (bgmPool.length === 0) {
        refillBgmPool();
    }

    // プールを補充した直後は、直前の曲が連続で選ばれないよう一時的に除外する
    let candidates = bgmPool;
    if (bgmPool.length > 1 && bgmPool.includes(bgmLastIndex)) {
        candidates = bgmPool.filter(i => i !== bgmLastIndex);
    }

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    bgmPool = bgmPool.filter(i => i !== pick);
    return pick;
}

// 曲を選んで読み込む（バッファリング開始のみ、再生はしない）
function loadNextTrack() {
    if (!BGM_TRACKS || BGM_TRACKS.length === 0) return;
    const idx = pickNextTrackIndex();
    bgmLastIndex = idx;
    bgmAudio.src = BGM_TRACKS[idx];
    bgmAudio.load();
}

function playRandomBgm() {
    if (!BGM_TRACKS || BGM_TRACKS.length === 0) return;
    loadNextTrack();
    bgmAudio.play().then(() => {
        showBgmTrackName(bgmAudio.src);
    }).catch((err) => {
        // 自動再生ブロック、またはファイルが見つからない等の理由で失敗
        console.warn('BGM再生に失敗しました:', bgmAudio.src, err);
    });
}

// 画面右上に再生中の曲名を表示する
function showBgmTrackName(srcUrl) {
    let fileName = decodeURIComponent(srcUrl.split('/').pop());
    fileName = fileName.replace(/\.mp3$/i, '');

    let box = document.getElementById('bgmNowPlaying');
    if (!box) {
        box = document.createElement('div');
        box.id = 'bgmNowPlaying';
        box.style.cssText = `
            position: fixed;
            top: 12px;
            right: 16px;
            z-index: 100000;
            background: rgba(0,0,0,0.65);
            color: #fff;
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 13px;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            max-width: 260px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            pointer-events: none;
            transition: opacity 0.6s ease;
        `;
        document.body.appendChild(box);
    }

    box.innerText = `🎵 ${fileName}`;
    box.style.opacity = '1';

//20秒
    clearTimeout(box._hideTimer);
    box._hideTimer = setTimeout(() => {
        box.style.opacity = '0';
    }, 20000);
}

// 曲が終わったら次のランダムな曲を再生
bgmAudio.addEventListener('ended', () => {
    playRandomBgm();
});

function initBgm() {
    bgmAudio.volume = getSavedBgmVolume();

    // 設定モーダルのスライダー表示を、保存済みの音量に合わせる
    const savedPercent = Math.round(getSavedBgmVolume() * 100);
    const rangeEl = document.getElementById('bgmVolumeRange');
    const valEl = document.getElementById('bgmVolumeVal');
    if (rangeEl) rangeEl.value = savedPercent;
    if (valEl) valEl.innerText = savedPercent;

    // ページを開いた瞬間に1曲選んで先読み（バッファリング）だけ始めておく
    loadNextTrack();

    bgmAudio.play().then(() => {
        // 自動再生に成功
        showBgmTrackName(bgmAudio.src);
    }).catch(() => {
        // ブラウザの自動再生ポリシーでブロックされた場合、
        // ユーザーが最初にクリック/キー操作した瞬間に、先読み済みの曲を再生する
        const startOnFirstInteraction = () => {
            bgmAudio.play().then(() => {
                showBgmTrackName(bgmAudio.src);
            }).catch(() => {});
            document.removeEventListener('click', startOnFirstInteraction);
            document.removeEventListener('keydown', startOnFirstInteraction);
            document.removeEventListener('touchstart', startOnFirstInteraction);
        };
        document.addEventListener('click', startOnFirstInteraction);
        document.addEventListener('keydown', startOnFirstInteraction);
        document.addEventListener('touchstart', startOnFirstInteraction);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initBgm();
});

// ==========================================================
// ⌨️ キーボード操作（m: ミュート切替 / n: 次の曲へスキップ）
// ==========================================================
let bgmMutedVolume = null; // ミュート前の音量を保持（nullならミュートしていない）

function toggleBgmMute() {
    if (bgmMutedVolume === null) {
        // ミュートにする（現在の音量を退避してから0に）
        bgmMutedVolume = bgmAudio.volume;
        bgmAudio.volume = 0;
    } else {
        // 退避しておいた元の音量に戻す
        bgmAudio.volume = bgmMutedVolume;
        bgmMutedVolume = null;
    }

    // 設定モーダルのスライダー表示も同期（保存はしない＝ミュートは一時的な操作のため）
    const percent = Math.round(bgmAudio.volume * 100);
    const rangeEl = document.getElementById('bgmVolumeRange');
    const valEl = document.getElementById('bgmVolumeVal');
    if (rangeEl) rangeEl.value = percent;
    if (valEl) valEl.innerText = percent;
}

function skipToNextBgm() {
    bgmAudio.pause();
    playRandomBgm();
}

document.addEventListener('keydown', (e) => {
    // 入力欄にフォーカス中は誤発火しないようにする
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'm' || e.key === 'M') {
        toggleBgmMute();
    } else if (e.key === 'n' || e.key === 'N') {
        skipToNextBgm();
    }
});