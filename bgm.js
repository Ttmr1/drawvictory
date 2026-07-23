// ==========================================================
// 🎵 BGM再生システム
// ==========================================================
// ↓ music フォルダに入れたmp3ファイル名をここに追記してください
const BGM_TRACKS = [
    "music/404_フリーズ・コード.mp3"
    "music/Alone.mp3"
    "music/Combat March.mp3"
    "music/Crystal brilliance.mp3"
    "music/Glacial brilliance.mp3"
    "music/water's pride.mp3"
    "music/メランコリックシンドローム.mp3"
    "music/絶望から見いだした希望.mp3"
    "music/嘆きのダークローズ.mp3"
    "music/不思議の国のアリス症候群.mp3"
];

let bgmAudio = new Audio();
let bgmLastIndex = -1;

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

// ランダムに次の曲を選ぶ（直前と同じ曲を避ける。曲が1曲しかない場合はそのまま）
function pickNextTrackIndex() {
    if (BGM_TRACKS.length <= 1) return 0;
    let idx;
    do {
        idx = Math.floor(Math.random() * BGM_TRACKS.length);
    } while (idx === bgmLastIndex);
    return idx;
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