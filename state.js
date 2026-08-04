// state.js
// =========================================================================
// 🧙 Mini Spire Ultimate - プレイヤー・敵ステータス ＆ グローバル管理
// =========================================================================

// --- プレイヤーと敵の共通ステータス管理 ---
window.difficulty = "normal"; // 追加: 難易度管理用 ("easy", "normal", "hard", "lunatic")
window.boss20 = null;// 20階のボスIDまたは名前
window.boss40 = null;// 40階のボスIDまたは名前
window.currentSlot = 0;
window.savedDecks = [{}, {}, {}, {}, {}]; 
window.lastPlayedCard = {
    cat: null,
    cost: null
};
window.comboActive = false; // 現在のカードがコンボ条件を満たしているか

if (localStorage.getItem("mini_spire_area_effect") === null) {
    window.isAreaEffectEnabled = false; // 初回（データがない時）はデフォルトOFF
} else {
    // 文字列として保存されている "true" / "false" をブール値に変換して代入
    window.isAreaEffectEnabled = localStorage.getItem("mini_spire_area_effect") === "true";
}

// 👹 敵の説明 ON/OFF（初回はデフォルトON）
if (localStorage.getItem("mini_spire_enemy_explanation") === null) {
    window.isEnemyExplanationEnabled = true;
} else {
    window.isEnemyExplanationEnabled = localStorage.getItem("mini_spire_enemy_explanation") === "true";
}


// 💡 ページ読み込みが完了した瞬間に、見た目を保存された状態に強制同期する
window.addEventListener("DOMContentLoaded", () => {
    // 1. 難易度ボタンの選択状態を復元
    if (typeof selectDifficulty === "function") {
        selectDifficulty(window.difficulty);
    }
    
    // 2. 🗺️ 特殊エリア効果のラベル表示（ON/OFF）を保存された状態に合わせて書き換える
    if (typeof updateAreaConfigLabel === "function") {
        updateAreaConfigLabel();
    }

    // 3. 👹 敵の説明ON/OFFのラベル表示を保存された状態に合わせて書き換える
    if (typeof updateEnemyExplanationConfigLabel === "function") {
        updateEnemyExplanationConfigLabel();
    }
});

window.player = {
    hp: 70, maxHp: 70, block: 0, energy: 3, maxEnergy: 3,
    gold: 500, darkMarketCount: 0,
    status: { heal: 0, healTurns: 0, counterTurns: 0 , amnesia: 0,comboPlusTurn:0,comboPlusBonus: 0,adrenaline:{adrenalineAtk: 0,adrenalineTurn:0},nkaiCount:0,leakBlockTurns:0,immaturity: 0,timeLoop:0},
    fields: { atk_up: 0, def_up: 0, draw_up: 0, heavy_burn:0,boss_scout:0 } 
};

window.enemy = { hp: 40, maxHp: 40, attack: 6, block: 0, data: null, status: { poisonList: [], burn: 0, freeze: 0, stun: 0,camouflageTurns: 0 ,
	        // 👽 Trait専用
        	traits: [],physicalImmune: false,statusImmune: false
		} };

window.floor = 1;
window.inBattle = false;

// 📊 デッキビルダーのカテゴリ定義（cards.jsの制限に同期）
window.builderCategories = [
    { key: "atk", name: "⚔️ 攻撃系カード", limit: 15 },
    { key: "blk", name: "🛡️ ブロック系カード", limit: 15 },
    { key: "rec", name: "💖 回復系カード", limit: 10 },
    { key: "abn", name: "☠️ 状態異常系カード", limit: 12 },
    { key: "oth", name: "🃏 その他特殊カード", limit: 99 }
];

// 標準のalertを独自カスタムアラートに置き換える
window.alert = function(message) {
    const container = document.getElementById("customAlertContainer");
    if (!container) {
        console.warn("customAlertContainer が見つかりません: ", message);
        return;
    }

    // アラート要素の作成
    const alertDiv = document.createElement("div");
    alertDiv.className = "custom-alert";
    alertDiv.textContent = message; // innerTextはDOM未接続の要素では反映されないことがあるためtextContentを使用

    // クリックされたらすぐ消せるようにする
    alertDiv.onclick = function() {
        alertDiv.remove();
    };

    container.appendChild(alertDiv);

    // アニメーション時間（合計30秒）が経過したら自動削除
    setTimeout(() => {
        alertDiv.remove();
    }, 30000);
};



function restartGame() {
    floor = 1;
    player.maxHp = 70; 
    player.hp = 70; 
    player.block = 0;
    player.gold = 500; 
    player.maxEnergy = 3; 
    player.energy = player.maxEnergy;
    player.status = { heal:0, healTurns:0 };
    player.fields = { atk_up: 0, def_up: 0, draw_up: 0, heavy_burn: 0 }; 
    discardPile = [];
    hand = [];
    // cards.js 側で実装される戦闘用デッキ生成関数
    initBattleDeck(); 
    startBattle();
}


function openBattleMenu() {
    const menuScreen = document.getElementById("menuScreen");
    if (!menuScreen) return;

    menuScreen.innerHTML = `
        <div class="battle-menu-container" style="background: #1a1a1a; color: #fff; padding: 25px; border-radius: 8px; width: 280px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); position: relative;">
            <h2 style="margin-top: 0; text-align: center; border-bottom: 2px solid #00adb5; padding-bottom: 10px; font-size: 18px;">☰ メニュー</h2>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                <button onclick="closeBattleMenu(); openMenuPopup();" style="padding: 12px; background: #00adb5; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">📜 説明書</button>
                <button onclick="closeBattleMenu(); toggleConfigModal();" style="padding: 12px; background: #4e5d6c; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">⚙️ ゲーム設定</button>
                <button onclick="closeBattleMenu(); showMapDeckManager(true);" style="padding: 12px; background: #53354a; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">📖 デッキ一覧</button>
                <button onclick="battleMenuReturnToTitle();" style="padding: 12px; background: #e43f5a; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🏠 スタート画面</button>
            </div>

            <button onclick="closeBattleMenu()" style="position: absolute; top: 15px; right: 15px; background: #555; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-weight: bold;">✕ 閉じる</button>
        </div>
    `;

    menuScreen.style.display = "flex";
    menuScreen.style.zIndex = "99999";
}

function closeBattleMenu() {
    const menuScreen = document.getElementById("menuScreen");
    if (menuScreen) menuScreen.style.display = "none";
}

function battleMenuReturnToTitle() {
    // 戦闘中の進行状況が失われるため確認を挟む
    if (confirm("スタート画面に戻ります。現在の進行状況は失われますが、よろしいですか？")) {
        closeBattleMenu();
        returnToTitle();
    }
}

function openMenuPopup() {
    const menuScreen = document.getElementById("menuScreen");
    if (!menuScreen) return;

    // ポップアップ全体のコンテナを構築（タイトルの下にタブボタンを配置）
    menuScreen.innerHTML = `
        <div class="menu-popup-container" style="background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.5); position: relative;">
            <h2 style="margin-top: 0; text-align: center; border-bottom: 2px solid #e43f5a; padding-bottom: 10px;">📖 ゲーム説明書</h2>
            
            <!-- タブボタンエリア -->
            <div class="menu-tabs" style="display: flex; gap: 5px; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px; overflow-x: auto;">
                <button onclick="switchMenuTab('rule')" class="tab-btn" id="tab-rule" style="padding: 8px 12px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap;">🧭 ゲームフロー</button>
                <button onclick="switchMenuTab('enemy')" class="tab-btn" id="tab-enemy" style="padding: 8px 12px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap;">👹 敵について</button>
                <button onclick="switchMenuTab('battle')" class="tab-btn" id="tab-field" style="padding: 8px 12px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap;">⚔️ 戦闘について</button>
                <button onclick="switchMenuTab('map')" class="tab-btn" id="tab-map" style="padding: 8px 12px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap;">🗺️ マップ</button>
                <button onclick="switchMenuTab('cards')" class="tab-btn" id="tab-status" style="padding: 8px 12px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap;">🎴 カード一覧</button>
                <button onclick="switchMenuTab('credit')" class="tab-btn" id="tab-status" style="padding: 8px 12px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap;">♫ クレジット</button>
            </div>

            <!-- 説明文が切り替わるコンテンツエリア -->
            <div id="menuTabContent" style="min-height: 200px;"></div>

            <!-- 閉じるボタン -->
            <button onclick="closeMenuPopup()" style="position: absolute; top: 15px; right: 15px; background: #e43f5a; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-weight: bold;">✕ 閉じる</button>
        </div>
    `;

    menuScreen.style.display = "flex";
    menuScreen.style.zIndex = "99999";
    
    // 初期タブとして「ゲームフロー(rule)」を表示
    switchMenuTab('rule'); 
}

function closeMenuPopup() {
    const menuScreen = document.getElementById("menuScreen");
    if(menuScreen) menuScreen.style.display = "none";
}

/**
 * 💡 設定を保存し、テストアラートを表示
 */
function saveAndTestAlert() {
    const time = document.getElementById("alertTimeRange").value;
    localStorage.setItem("alert_display_time", time);
    
    // テスト表示
    const testMsg = time == 0 ? "アラートは表示されません" : `表示時間は ${time} 秒です`;
    customAlert(testMsg, time);
}

/**
 * 💡 独自アラート関数
 * @param {string} message - 表示内容
 * @param {number} seconds - 表示する秒数
 */
const CUSTOM_ALERT_MAX_VISIBLE = 3; // 同時に表示できるアラートの最大数
window._customAlertQueue = [];       // 表示待ちのアラート
window._customAlertActiveCount = 0;  // 現在表示中の数

function customAlert(message, seconds) {
    // 秒数が指定されていない場合は設定値（未設定なら4秒）を使用する
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
        const saved = localStorage.getItem("alert_display_time");
        seconds = saved !== null ? Number(saved) : 4;
    }

    if (seconds == 0) return; // 0秒なら何もしない

    window._customAlertQueue.push({ message, seconds });
    processCustomAlertQueue();
}

// キューを確認し、表示枠（最大3つ）に空きがあれば次のアラートを表示する
function processCustomAlertQueue() {
    const modal = document.getElementById("customAlertModal");
    if (!modal) {
        console.warn("customAlertModal が見つかりません");
        return;
    }

    while (window._customAlertActiveCount < CUSTOM_ALERT_MAX_VISIBLE && window._customAlertQueue.length > 0) {
        const { message, seconds } = window._customAlertQueue.shift();

        const item = document.createElement("div");
        item.className = "custom-alert-modal-item";
        item.textContent = message; // innerTextはDOM未接続の要素では反映されないことがあるためtextContentを使用
        item.onclick = () => removeCustomAlertItem(item);

        modal.appendChild(item);
        window._customAlertActiveCount++;

        setTimeout(() => removeCustomAlertItem(item), seconds * 1000);
    }
}

// 表示中のアラート要素を1つ取り除き、キューに待ちがあれば次を表示する
function removeCustomAlertItem(item) {
    if (!item || !item.parentNode) return; // 既に削除済み
    item.remove();
    window._customAlertActiveCount--;
    processCustomAlertQueue();
}



// 🔄 タブを切り替えて対応する説明文を表示する
function switchMenuTab(tabName) {
    // 全てのタブボタンからアクティブクラス（装飾用）を削除し、背景を初期化
    const tabs = document.querySelectorAll('.menu-tabs .tab-btn');
    tabs.forEach(btn => {
        btn.style.background = "#333";
        btn.style.color = "#ccc";
    });

    // 選択されたタブボタンをハイライト
    const activeTab = document.getElementById(`tab-${tabName}`);
    if (activeTab) {
        activeTab.style.background = "#e43f5a";
        activeTab.style.color = "#fff";
    }

    const contentDiv = document.getElementById("menuTabContent");
    if(!contentDiv) return;
    
    let html = "";

    if (tabName === 'rule') {
        html = `
        <h3>🧭 ゲームフローと基本ルール</h3>
        <p style="color: #aaa; font-size: 12px; margin-bottom: 15px;">※ 項目をクリックすると、詳細な解説が開閉します。</p>
        
        <div class="rule-accordion">
            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>🃏 初期デッキ構築</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    ゲーム開始前に、<span style="color: red;">任意のカードを30枚</span>選択し、攻略へ挑みます。
                </div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>💀 勝敗とクリア条件</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    ・<span style="color: red;">敗北条件</span>: プレイヤーの<span style="color: red;">体力が0</span>になると<span style="color: red;">ゲームオーバー</span>となります。<br>
                    ・<span style="color: red;">勝利条件</span>: 階層を進み、20階と40階に待ち受ける<span style="color: red;">ボスを撃破</span>することができればゲームクリアとなります！
                </div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>⚔️ バトルとターン制の攻防</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    毎ターン配られる手札からカードを自由に選択し、エネルギーを消費して敵へ攻撃を仕掛けたり、身を守ったりします。<br>
                    獲得したブロック（防御値）は<span style="color: red;">次の自分のターン開始時に0にリセット</span>されるため、敵の出方に合わせて使い切るのが基本戦略です。
		    <span style="color: red;">スペースキー</span>でもターン終了できます。
                </div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>🛒 報酬とデッキの強化</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    敵を討伐すると戦利品として<span style="color: red;">ゴールド（G）</span>が手に入ります。獲得したゴールドを使い、マップ上の「ショップ」や「闇市」などで強力なカード、永続するフィールド効果、一発逆転のポーション等を購入してデッキをどんどん強化していきましょう。休憩所でカードを削除してデッキを圧縮したり、休憩所の鍛冶屋でアップグレードしたりすることで強化もできます。
                </div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>👹 敵の能力に応じた戦術</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    敵は、物理攻撃を無効化や状態異常を無効化など、それぞれが凶悪な<span style="color: red;">固有能力（特徴）</span>を持っています。<br>
                    一筋縄ではいかないため、対峙する敵の個性に合わせた臨機応変な戦術・カード回しが要求されます（詳細は「敵の種類」タブを参照）。
                </div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>⏱️ ショートカットキー一覧</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    戦闘のとき<span style="color: red;">spaceキー</span>を押すことでターンを終了することができる。<br>
		    <span style="color: red;">nキー</span>を押すことで現在流れているBGMの曲を次の曲に飛ばすことができる。<br>
		    <span style="color: red;">mキー</span>を押すことであらゆる音量を0にします。もう一度押すと、元の音量に戻ります。
                </div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>🅿 スコアの上げ方</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    スコアはゲームオーバーまたはゲームクリアのときにスコアが表示されます。<br>
		    階層をできる限り登る、敵と戦う、デッキのカード枚数を増やす、所持金を増やす、体力を多く残したままクリアすることでスコアが上がります。
                </div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>⚡ 連鎖するコンボシステム</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    直前にプレイしたカードと<span style="color: red;">「同じカテゴリ」</span>であり、かつ<span style="color: red;">コストがちょうど「+1」</span>されているカードを連続で出すと「コンボボーナス」が発動し、カードの追加効果や威力がわずかに上昇します！</p>
		<p>攻撃系:与えるダメージを+2</p>
		<p>防御系:ブロック+2</p>
		<p>回復系:回復+2</p>
		<p>状態異常系:1/4でエネルギーを+1</p>
		</div>
            </div>

            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>🎴カードの圧縮/強化</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    カードを削除して圧縮することで、デッキの回転が良くなります。カードの削除は休憩所のカード削除から行えます。カード削除はデッキの枚数が20枚になるまで行えます。</p>
		<p>カードの強化をすることで、より大きなダメージを与えたり、防いだりできます。カードの強化は休憩所の鍛冶屋から行えます。</p>
	        <p>カードの削除と強化のバランスがデッキの強化につながります。</p>
		</div>
            </div>


            <div class="rule-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <div class="enemy-header" onclick="const detail = this.nextElementSibling; const isOpen = detail.style.display === 'block'; detail.style.display = isOpen ? 'none' : 'block'; this.classList.toggle('active'); if(!isOpen) { setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }" style="cursor: pointer; padding: 5px; font-weight: bold; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <span>🎴カードのレアリティ</span>
                </div>
                <div class="rule-detail" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); font-size: 20px; color: #ccc; line-height: 1.5;">
                    レアリテはcommon、uncommon、<span style="color: lightblue;">rare</span>、<span style="color: yellow;">legend</span>、<span style="color: pink;">space</span>があります。</p>
		<p>カードを強化することでレアリティを1段階挙げることが出来ます。</p>
		<p>commonまたはuncommonは<span style="color: lightblue;">rare</span>に、<span style="color: lightblue;">rare</span>は<span style="color: yellow;">legend</span>に、<span style="color: yellow;">legend</span>は<span style="color: pink;">space</span>に強化できますが、すべてのカードが<span style="color: pink;">space</span>まで強化できるとは限りません。</p>
		</div>
            </div>



        </div>
        `;
    }

    if (tabName === 'enemy') {
        html = `
        <h2>👹 登場する敵キャラクターの特徴</h2>
        <h3 style="color: #aaa; font-size: 12px; margin-bottom: 25px;">※ 敵の名前やアイコンをクリックすると、詳細な解説が開閉します。</h3>
        
        ${renderEnemyManualHtml()}

        <br>
        <h2>👹 敵の行動パターン</h2>
        <h3>敵は毎ターン開始時に以下のいずれかのスタイルにランダムに変形し、攻撃と防御のステータスが倍増します。</h3>
            <p>・<strong style="color:#ff4a4a;">超攻撃型</strong> : 攻撃 1.50倍 / 防御 0.00倍</p>
            <p>・<strong style="color:#ff9f43;">攻撃特化</strong> : 攻撃 1.25倍 / 防御 0.50倍</p>
            <p>・<strong style="color:#4caf50;">バランス</strong> : 攻撃 1.00倍 / 防御 1.00倍</p>
            <p>・<strong style="color:#00adb5;">防御特化</strong> : 攻撃 0.75倍 / 防御 2.00倍</p>
            <p>・<strong>超防御型</strong> : 攻撃 0.50倍 / 防御 4.00倍</p>`;
    }

    if (tabName === 'cards') {
        html += `<h2>カードの種類</h2>
        <p>・攻撃系   :物理攻撃。   赤色のカード。</p>
        <p>・防御系   :敵の攻撃を防ぐ。青色のカード。</p>
        <p>・回復系   :体力を回復する。緑色のカード。</p>
        <p>・状態異常系 :状態攻撃。   紫色のカード。</p>
        <p>・特殊系   :サポート。   灰色のカード。</p>
        <br>
	<h2>🃏 カード一覧</h2>
        ` + renderCardDatabase();
    } 
    
    if (tabName === 'battle') {
	html = `<h2>🃏 カードについて</h2>
        <p>最初に手札が5枚配られます。手札のカードをクリックすることでカードが使用できます。カードに書いてあるコストはプレイヤーのステータス画面にあるエネルギーと同じです。エネルギーが残った状態で次のターンに行くと手札のカードが5枚から最大10枚まで増ることがあります。</p>
	<br>
	<br>
	<h2>✅ 戦闘画面について</h2>
	<p>左側のステータス画面がプレイヤーで、現在の体力、ブロック値、状態異常、エネルギー、ポーションが確認できます。<p>
	<p>右側が敵のステータス画面で、現在の体力、攻撃力、ブロック値、状態異常を確認できます。<p>
	<p>画面下には、自分の手札が表示され、クリックすることでカードを使用します。<p>
        <p>画面上部にターン終了ボタン、手札のON/OFFボタン、メニューボタン、階層、所持金、デッキ枚数、捨て札の枚数が表示されています。ショートカットキーとしてスペースキーでターン終了することが可能です。手札のON/OFFを使用することで敵のステータス画面を見やすくしています。ターンを終了することで敵が攻撃してきます。</p>
	<br>
	<br>
	<h2>👹 敵の行動パターン</h2>
        <h3>敵は毎ターン開始時に以下のいずれかのスタイルにランダムに変形し、攻撃と防御のステータスが倍増します。</h3>
        <p>・<strong style="color:#ff4a4a;">超攻撃型</strong> : 攻撃 1.50倍 / 防御 0.00倍</p>
        <p>・<strong style="color:#ff9f43;">攻撃特化</strong> : 攻撃 1.25倍 / 防御 0.50倍</p>
        <p>・<strong style="color:#4caf50;">バランス</strong> : 攻撃 1.00倍 / 防御 1.00倍</p>
        <p>・<strong style="color:#00adb5;">防御特化</strong> : 攻撃 0.75倍 / 防御 2.00倍</p>
        <p>・<strong>超防御型</strong> : 攻撃 0.50倍 / 防御 4.00倍</p>
	<br>
	<br>
        <h2>⚡ フィールド効果</h2>
        <h3>永続的に効果を発揮する。ショップや闇市で購入可能。</h3>
        <p>・ダメージ強化: 物理ダメージ常時 +1 (重複可)</p>
        <p>・防御強化　　: ターン開始時、ブロックを+2 (重複可)</p>
        <p>・ドロー強化　: 毎ターン開始時、1/3の確率で手札+1枚</p>
        <p>・大火傷　　　: 火傷によるダメージが5→10に増加</p>
        <p>・ボス偵察　　: 20階と40階のボスの名前が事前にわかる。プレイヤーのステータス画面に表示される。</p>
        <br>
	<br>
        <h2>🧪 ポーション効果</h2>
        <h3>1枠しか所持できない。ショップや闇市で購入可能。</h3>
        <p>・回復ポーション　　　❤️‍🩹: プレイヤーの HPを 15 回復 する。</p>
        <p>・エネルギーポーション⚡: エネルギーを 2 加算 する。</p>
        <p>・防御ポーション　　　🛡️: プレイヤーの防御値を 20 増加 させる。</p>
        <p>・ドローポーション　　🎴: 山札から カードを 3 枚引く。</p>
        <p>・強酸ポーション　　　🧪: 敵のブロックを0にして、毒5(5T)を付与する。</p>
        <p>・器のポーション　　　🏺: 2回飲むとポーションスロットが1つ増える。</p>
	<br>
	<br>
        <h2>☠️ 状態異常の種類</h2>
        <h3>状態異常によりダメージを与えるとき<strong>敵の防御を無視して直接HPを減らせます。</strong></h3>
	<h3>状態異常には重複するもの、上書きするものがあります。重複するものは毒のみです。<h3>
	<br>
	<h3>敵に付与する状態異常</h3>
        <p>・毒　　　　☠️: ターン終了時にダメージを与え、毒の値を1減らす（3Tで消滅）。</p>
        <p>・火傷　　　🔥: 相手の防御（ブロック）が半分になり、ターン終了時に固定5ダメージ。</p>
        <p>・凍結　　　❄️: 敵の攻撃力を66%にする。絶対零度状態ならば凍結状態にならない。</p>
	<p>・絶対零度　🧊: 凍結状態なら絶対零度状態になる。敵の攻撃力を50%にする。</p>
        <p>・スタン　　💫: 敵のターン開始時、1/4の確率で行動不能になる。</p>
	<br>
	<br>
	<h3>プレイヤーに付与する状態異常</h3>
        <p>・未熟　　　🔰: 使用コストを+1する。</p>
        <p>・過労　　　📉: カードを使用するたびに2ダメージを受ける。</p>
        <p>・忘却　　　❓: カードの効果がわからなくなる。</p>
        <p>・漏電　　　🔋: プレイヤーのエネルギーが余った数×2ダメージ受ける。</p>
	<p>・耐電　　　🧤: 漏電状態によるダメージを半分にする。</p>
        <p>・ヒール　　💖: ターンの終了時に回復する。</p>
        <p>・ループ　　🔄: カードを使用しても手札に残り続ける。"ループ"カードまたは"コスト 0 "カードは効果なし。</p>
        <p>・カウンター👊: プレイヤーが受けたダメージを敵にも1.5倍にしてダーメジ与える。</p>
	<p>・瞑想　　　🧘: 「防御系」のカードで得る防御が1.25倍になる。</p>
	<br>
	<br>
	<h2>⛅エリアの種類</h2>
	<h3>低確率で以下のエリアが出てくる。ボスと戦闘の時はエリアは出てこない。</h3>
	<p>・雨エリア🌧️　　:プレイヤーのHPを2回復する。火傷のダメージを無効化する。</p>
	<p>・日照りエリア☀️:プレイヤーは2ダメージ受ける。火傷のダメージを2倍にする。</p>
	<p>・霧エリア🌫️　　:プレイヤーの攻撃(毒や火傷を含む)が25%で外れてしまう。最大エネルギーが1.2倍になる。</p>` ;
    } 
    
    if (tabName === 'map') {
        html = `<h2>🗺️ マップ解説</h2>` +
               `<h3>マップはランダムに3から５つの分岐が生成され、プレイヤーは進路を自分で選択して進む。</h3>` +
               `<hr style='border:1px solid rgba(255,255,255,0.1); margin:10px 0;'>` +
               `<p><strong>⚔️ 戦闘 (Battle)</strong>:<br>` +
               `通常の敵、または階層に応じた強敵と戦います。勝利するとゴールドを獲得し、新しいカードをデッキに加えることができます。</p>` +

               `<p><strong>💀 エリート (Elite)</strong>:<br>` +
               `体力や攻撃力が通常より高い敵が出てくる。報酬のゴールドは約1.5倍である。なお、出てくる敵の種類は⚔️ 戦闘 (Battle)と同じである。</p>` +

               `<p><strong>🛒 ショップ (Shop)</strong>:<br>` +
               `所持金（ゴールド）を消費して、ランダムに並んだカード、フィールド効果、ポーションを購入できます。最大2つまで購入可能です。低確率でセールがあり、100G 引きで購入可能。</p>` +
               `<p><strong>🌌 闇市 (Dark Market)</strong>:<br>` +
               `危険なショップです。【最大HPが10減少】しますが、購入制限なしかつ少し割引で10枚の強力なカード、フィールド効果、ポーションを買えます。</p>` +

               `<p><strong>⛺ 休憩所 (Rest)</strong>:<br>` +
               `安全に体力を10%回復します。また、以下の選択肢から1つ選びます。<br>`+
	       `・カードの削除　　:デッキからカードの削除ができます。1枚削除するのに25Gかかります。</p>`+
	       `・鍛冶屋　　　　　:カードのアップグレードを7回までできます。1回アップグレードするのに100Gかかります。</p>`+
	       `・体力回復　　　　:体力をさらに30%回復させます。</p>`+
	       `・ゴールドを得る　:ゴールドが100G、125G、150Gのどれかが貰えます。</p>`+
               `<p><strong>🧑‍💼 行商人 (Merchant)</strong>:<br>` +
               `カードの取引を行います。5枚カードが提示され、そのカードを行商人に渡すと600Gが貰えるが、渡さないと50G取られます。<br>なお、階層は変わらなく、マップ分岐を再抽選するのに使うのも有効です。`;
    }

    if (tabName === 'credit') {
        html = `<h2>♫ 使用した音楽</h2>
               <a href="https://youtu.be/NrNGkKSOQ50?si=hw1GZrkc3SIxuKpQ" target="_blank" rel="noopener noreferrer" style="color: white;">404:フリーズ・コード / Tak_mfk</a><br>
               <a href="https://youtu.be/QomI2uLN1ek?si=wmria1JFiTMQYPcI" target="_blank" rel="noopener noreferrer" style="color: white;">water's pride / EigHt</a><br>
               <a href="https://youtu.be/u6RutQOpKo4?si=S81RYy1GItTGXTPZ" target="_blank" rel="noopener noreferrer" style="color: white;">Alone / nons works</a><br>
               <a href="https://youtu.be/G1m8oiD4QIQ?si=xHYezZqrecTdSzMu" target="_blank" rel="noopener noreferrer" style="color: white;">Combat March / nons works</a><br>
               <a href="https://youtu.be/43RngsPIUuU?si=LvBUCqxv2gKG0Vwz" target="_blank" rel="noopener noreferrer" style="color: white;">Crystal brilliance / Tak_mfk</a><br>
               <a href="https://youtu.be/rSlyxTcpH2I?si=NFmcnxV5ObBPyDcB" target="_blank" rel="noopener noreferrer" style="color: white;">Glacial brilliance / Tak_mfk</a><br>
               <a href="https://youtu.be/GN9uXvp4fKg?si=eZ0Nwi8ZRS_pLwjB" target="_blank" rel="noopener noreferrer" style="color: white;">メランコリックシンドローム / EigHt</a><br>
               <a href="https://youtu.be/sa7XKGc0H_I?si=16iQVOD2g9tzmF7Z" target="_blank" rel="noopener noreferrer" style="color: white;">絶望から見いだした希望 / non works</a><br>
               <a href="https://youtu.be/VprPkuTwCGM?si=wU5zqzt9PsoiOucu" target="_blank" rel="noopener noreferrer" style="color: white;">嘆きのダークローズ / EigHt</a><br>
               <a href="https://youtu.be/OvyjabhA38s?si=MDJqvWAqfWALbiDu" target="_blank" rel="noopener noreferrer" style="color: white;">不思議の国のアリス症候群 / EigHt</a>
<br>
<br>
<h2>♫ 使用したサウンドエフェクト</h2>
<a href="https://soundeffect-lab.info/" target="_blank" rel="noopener noreferrer" style="color: white;">効果音ラボ</a><br>


`;



    }



    contentDiv.innerHTML = html;
}

// 📖 カード図鑑：カテゴリごとに折りたたみ表示し、検索できるカード一覧を生成する
const CARD_DB_CATEGORIES = [
    { key: "atk",  label: "⚔️ 攻撃系",   color: "#ff6b6b" },
    { key: "blk",  label: "🛡️ 防御系",   color: "#4fa8ff" },
    { key: "rec",  label: "💖 回復系",   color: "#5fd97a" },
    { key: "abn",  label: "☠️ 状態異常系", color: "#c86bff" },
    { key: "oth",  label: "✨ 特殊系",   color: "#bbbbbb" },
    { key: "none", label: "👻 呪いカード", color: "#888888" }
];
const CARD_DB_RARITY_LABEL = { common: "コモン", uncommon: "アンコモン", rare: "レア", legend: "レジェンド", space: "スペース", none: "-" };
const CARD_DB_COST_COLOR = { 0:"#ffffff",1:"#ffeb3b",2:"#00e676",3:"#29b6f6",4:"#ff5252",5:"#e040fb",6:"#ff9100",7:"#00e5ff",8:"#ff1744",9:"#aa00ff" };


function renderCardDatabase() {
    let html = `
      <div class="card-db-toolbar">
        <input id="cardDbSearchInput" class="card-db-search" type="text"
               placeholder="🔍 カード名・説明で検索..."
               oninput="filterCardDatabase(this.value)">
        <div class="card-db-legend">
          ${CARD_DB_CATEGORIES.map(c => `<span style="color:${c.color};">${c.label}</span>`).join('')}
        </div>
      </div>
      <div id="cardDbList">`;

    CARD_DB_CATEGORIES.forEach(catDef => {
        const cardsInCat = allCardsMaster
            .filter(c => c.cat === catDef.key)
            .sort((a, b) => {
                const aLast2 = a.id % 100;
                const bLast2 = b.id % 100;
                if (aLast2 !== bLast2) return aLast2 - bLast2;
                const aTier = Math.floor(a.id / 1000); // idの1000の位（0=common,1=uncommon,2=rare,3=legend,4=space）
                const bTier = Math.floor(b.id / 1000);
                return aTier - bTier;
            });

        if (cardsInCat.length === 0) return;

        html += `
          <div class="card-db-section" data-cat="${catDef.key}">
            <div class="card-db-header" style="border-left-color:${catDef.color};"
                 onclick="const g=this.nextElementSibling; const open = g.style.display==='grid'; g.style.display = open ? 'none' : 'grid'; this.querySelector('.arrow').textContent = open ? '▼' : '▲';">
                <span>${catDef.label}（${cardsInCat.length}枚）</span>
                <span class="arrow">▼</span>
            </div>
            <div class="card-db-grid">
              ${cardsInCat.map(c => {
                  const costColor = CARD_DB_COST_COLOR[c.cost] || "#eeeeee";
                  const rarityLabel = CARD_DB_RARITY_LABEL[c.rarity] || c.rarity;
                  const searchKey = (c.name + " " + (c.desc || "")).toLowerCase();
                  return `
                    <div class="manual-card cat-${c.cat} rarity-${c.rarity}" data-search="${searchKey}">
                        <div class="manual-card-top">
                            <span class="manual-card-name">${c.name}</span>
                            <span class="manual-card-cost" style="color:${costColor}; border:1px solid ${costColor};">⚡${c.cost}</span>
                        </div>
                        <div class="manual-card-desc">${c.desc || "（説明なし）"}</div>
                        <div class="manual-card-rarity">${rarityLabel}</div>
                    </div>`;
              }).join('')}
            </div>
          </div>`;
    });

    html += `</div><p id="cardDbEmptyMsg" class="card-db-empty" style="display:none;">該当するカードが見つかりません。</p>`;
    return html;
}

// カード図鑑の検索フィルタ：一致するカードだけ表示し、該当があるカテゴリは自動で展開する
function filterCardDatabase(value) {
    const q = (value || "").trim().toLowerCase();
    const sections = document.querySelectorAll('.card-db-section');
    let totalVisible = 0;

    sections.forEach(section => {
        const grid = section.querySelector('.card-db-grid');
        const header = section.querySelector('.card-db-header');
        let visibleInSection = 0;

        section.querySelectorAll('.manual-card').forEach(card => {
            const match = !q || card.dataset.search.includes(q);
            card.style.display = match ? "" : "none";
            if (match) visibleInSection++;
        });

        totalVisible += visibleInSection;
        section.style.display = visibleInSection > 0 ? "" : "none";

        if (grid && header) {
            if (q) {
                // 検索中はヒットしたカテゴリを自動で開く
                grid.style.display = visibleInSection > 0 ? "grid" : "none";
                header.querySelector('.arrow').textContent = visibleInSection > 0 ? "▲" : "▼";
            }
        }
    });

    const emptyMsg = document.getElementById("cardDbEmptyMsg");
    if (emptyMsg) emptyMsg.style.display = (q && totalVisible === 0) ? "block" : "none";
}	