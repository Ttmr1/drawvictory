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

function playRandomBgm() {
    if (!BGM_TRACKS || BGM_TRACKS.length === 0) return;
    const idx = pickNextTrackIndex();
    bgmLastIndex = idx;
    bgmAudio.src = BGM_TRACKS[idx];
    bgmAudio.play().catch(() => {
        // 自動再生がブロックされた場合はここでは何もしない（下の一時的な待機処理で対応）
    });
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

    bgmAudio.play().then(() => {
        // 通常の自動再生に成功した場合は最初の曲を選ぶ
        playRandomBgm();
    }).catch(() => {
        // ブラウザの自動再生ポリシーでブロックされた場合、
        // ユーザーが最初にクリック/キー操作した瞬間に再生を開始する
        const startOnFirstInteraction = () => {
            playRandomBgm();
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