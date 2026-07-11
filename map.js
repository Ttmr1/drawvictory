// =========================================================================
// 🗺️ マップ画面表示・生成処理
// =========================================================================
// 休憩所でカード削除を実行中かどうかを管理するフラグ
window.isRestRoomDeletionMode = false;
// 鍛冶屋でのアップグレード回数を管理する変数（最大7回まで）
window.upgradeCount = window.upgradeCount || 0;
function openMap(){
    const rewardScreen = document.getElementById("rewardScreen");
    const rewardTitle = document.getElementById("rewardTitle");
    
    // もし現在「デッキ確認画面」が開いているなら、何もしない（あるいは手前に維持する）
    const isViewingDeck = rewardScreen && rewardScreen.style.display === "flex" && rewardTitle && rewardTitle.innerText.includes("デッキ");

    if(rewardScreen && !isViewingDeck) {
        rewardScreen.style.display = "none";
    }

    const mapScreen = document.getElementById("mapScreen");
    if(mapScreen) mapScreen.style.display = "flex";


    let mapStatusDisp = document.getElementById("mapStatusDisplay");
    if (!mapStatusDisp) {
        mapStatusDisp = document.createElement("div");
        mapStatusDisp.id = "mapStatusDisplay";
        mapStatusDisp.style.width = "100%";
        mapStatusDisp.style.textAlign = "center";
        mapStatusDisp.style.fontSize = "22px";
        mapStatusDisp.style.fontWeight = "bold";
        mapStatusDisp.style.margin = "10px 0";
        mapStatusDisp.style.padding = "20px 10px";
        mapStatusDisp.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        mapStatusDisp.style.borderRadius = "8px";
        
        // mapScreenの中にあるpanel、あるいはmapScreen自体の上部へと挿入
        const mapPanel = mapScreen.querySelector(".panel");
        if (mapPanel) {
            mapPanel.insertBefore(mapStatusDisp, mapPanel.firstChild);
        } else {
            mapScreen.insertBefore(mapStatusDisp, mapScreen.firstChild);
        }
    }
    const hpPercent = player.maxHp > 0 ? Math.floor((player.hp / player.maxHp) * 100) : 0;
    mapStatusDisp.innerHTML = `🪜 Floor: <span style="color:#54a0ff;">${floor}/40</span> &nbsp;&nbsp;&nbsp;&nbsp; ` +
                              `❤️ 体力: <span style="color:#ff6b6b;">${player.hp} / ${player.maxHp} (${hpPercent}%)</span> &nbsp;&nbsp;&nbsp;&nbsp; ` +
                              `💰 所持金: <span style="color:#feca57;">${player.gold || 0}G</span>`;


    const map = document.getElementById("mapTree");
    if(!map) return;
    map.innerHTML = "";

    let nodeCount;
    let nodes = [];

    // 🔄 【ループ処理】選ばれたルートが全て同じ種類（かつ戦闘以外）なら再抽選する
    let attempt = 0;
    while (attempt < 10) {
        attempt++;
        // 🎲 3つ生成するか4つ生成するかをランダムに決定（50%ずつの確率）
        nodeCount = Math.random() < 0.5 ? 3 : 4;
        if (floor === 19 || floor === 39) {
            nodeCount = 1;
        }
        nodes = [];

        // 指定された数（3つまたは4つ）だけランダムにルートの種類を決定
        for (let i = 0; i < nodeCount; i++) {
            let r = Math.random();
            let type = r < 0.45 ? "battle"    // 0.00 ～ 0.45 (45%)バトル
                     : r < 0.55 ? "shop"      // 0.45 ～ 0.60 (15%)ショップ
                     : r < 0.75 ? "rest"      // 0.60 ～ 0.80 (20%)休憩所
                     : "darkshop";	      // 0.80 ～ 1.00 (20%)闇市

            if (floor === 19 || floor === 39) {
                type = "battle";
            }
            nodes.push(type);
        }

        // ボス戦（nodeCountが1）の場合は再抽選をスキップして抜ける
        if (nodeCount <= 1) {
            break;
        }

        // 全てが同じ種類かどうかを判定
        const firstType = nodes[0];
        const isAllSameType = nodes.every(type => type === firstType);

        if (isAllSameType && firstType !== "battle") {
            continue; // 再抽選へ
        }

        // 条件をクリア（正常なバラけ方、または全て戦闘）したらループを抜ける
        break;
    }  

    if(player.hp<=0){
	gameover();
    }

    map.style.display = "flex";
    map.style.flexDirection = "row";       // 絶対に横並び
    map.style.flexWrap = "nowrap";          // 絶対に折り返さない（下に落とさない）
    map.style.justifyContent = "center";    // 中央寄せ
    map.style.alignItems = "stretch";       // ボタンの高さを統一
    map.style.width = "100%";
    map.style.maxWidth = "900px";           // 横に広がりすぎない制限
    map.style.margin = "20px auto";
    map.style.gap = nodeCount === 4 ? "12px" : "24px"; // ボタン同士の間隔
    map.style.overflow = "hidden";          // マップ自体からのスライドバーを完全に抑止

    nodes.forEach((type, idx) => {
        const branch = document.createElement("div");
        branch.className = "branch";

	branch.style.flex = "1";                // 画面幅に合わせて均等に縮む
        branch.style.minWidth = "0";            // 文字による意図しない広がりを防ぐ
        branch.style.maxWidth = "200px";        // ボタンが大きくなりすぎないように制限
        branch.style.overflow = "visible";      // 【重要】ノードが拡大した時に親枠で切り取られないようにする
        branch.style.margin = "15px 0 0 0";     // 【重要】上側に15pxの余白を作り、拡大しても見切れないようにする

        const line = document.createElement("div");
        line.className = "line";
        const node = document.createElement("div");
        node.className = `mapNode ${type}`;

	node.style.width = "100%";
        node.style.boxSizing = "border-box";
        
        let icon = "⚔️";
        let label = "戦闘";
        if(type==="shop"){ icon="💰"; label="ショップ"; }
        if(type==="rest"){ icon="💤"; label="休憩所"; }
        if(type==="darkshop"){ icon="💴"; label="闇市 ";}	
        if(floor===19 || floor===39){ icon="🐉"; label="ボス戦"; }

        node.innerHTML = `<span style="font-size:48px;">${icon}</span><br><b style="font-size:24px;">${label}</b>`;
        
        node.onclick = () => {
            if(type==="battle"){
                mapScreen.style.display="none";
                floor++;
                startBattle();
            }else if(type==="shop"){
                mapScreen.style.display="none";
                floor++;
                openShopMenu();
            }else if(type==="rest"){
                mapScreen.style.display="none";
		floor++;
                triggerRestRoomChoiceEvent();
            }else if(type==="darkshop"){
                mapScreen.style.display="none";
                floor++;
                triggerDarkMarket();
            }
        };

        branch.appendChild(line);
        branch.appendChild(node);
        map.appendChild(branch);
    });

    let existingBtn = document.getElementById("mapDeckViewBtn");
    if (existingBtn) existingBtn.remove();

    const deckBtn = document.createElement("button");
    deckBtn.id = "mapDeckViewBtn";
    deckBtn.className = "map-deck-btn";
    deckBtn.innerText = "🎴 デッキ確認";
    deckBtn.onclick = function() {
        if (typeof showMapDeckManager === 'function') {
            showMapDeckManager();
        } else {
            alert("デッキ確認機能がまだ準備できていません。");
        }
    };
    const mapPanel = mapScreen.querySelector(".panel");
    if (mapPanel) {
        mapPanel.appendChild(deckBtn);
    } else {
        mapScreen.appendChild(deckBtn);
    }
}

function triggerRestRoomChoiceEvent() {
    const rewardScreen = document.getElementById("rewardScreen");
    const rewardTitle = document.getElementById("rewardTitle");
    const rewardArea = document.getElementById("rewardCards");
    
    if (!rewardScreen || !rewardArea) return;

    // 1. 基本効果：体力を最大HPの10%回復（即時反映）
    const baseHealAmount = Math.floor(player.maxHp * 0.10);
    player.hp = Math.min(player.maxHp, player.hp + baseHealAmount);
    
    // UIを即座に更新して回復を反映
    if (typeof updateUI === 'function') updateUI();

    // タイトル部分に状況を表示
    if (rewardTitle) {
        const hpPercent = player.maxHp > 0 ? Math.floor((player.hp / player.maxHp) * 100) : 0;
        rewardTitle.innerHTML = `
            <div style="margin-bottom: 10px;">🏕️ 休憩所に到着しました（体力が 10% 回復）</div>
            <div style="font-size: 18px; color: #ccc; background: rgba(0,0,0,0.3); padding: 8px 15px; border-radius: 6px; display: inline-block; font-weight: normal;">
                🪜 Floor: <span style="color:#54a0ff; font-weight:bold;">${floor}/40</span> &nbsp;&nbsp;&nbsp;&nbsp;
                ❤️ 体力: <span style="color:#ff6b6b; font-weight:bold;">${player.hp} / ${player.maxHp} (${hpPercent}%)</span> &nbsp;&nbsp;&nbsp;&nbsp;
                💰 所持金: <span style="color:#feca57; font-weight:bold;">${player.gold || 0}G</span>
            </div>
        `;
    }

    rewardArea.innerHTML = "";

    // スキップボタン等を一時的に隠し、必ず1つ選ばせる仕様にする
    const skipBtn = rewardScreen.querySelector("button[onclick*='skip']");
    if (skipBtn) skipBtn.style.display = "none";

    // 現在のデッキの総枚数を計算 (savedDecks[currentSlot] 内の枚数を集計)
    const currentDeck = savedDecks[window.currentSlot || 0] || {};
    let totalCards = 0;
    for (let id in currentDeck) {
        totalCards += currentDeck[id];
    }

    // ─── ① カードを削除する ───
    const deleteOption = document.createElement("div");
    deleteOption.className = "card rewardCard common";
    deleteOption.style.cursor = "pointer";
    deleteOption.style.padding = "15px";
    deleteOption.style.margin = "10px";
    deleteOption.style.border = "2px solid #e43f5a";
    deleteOption.style.borderRadius = "8px";
    deleteOption.style.backgroundColor = "rgba(228, 63, 90, 0.1)";

    if (totalCards <= 20) {
        // デッキが20枚以下の制限ロック
        deleteOption.style.opacity = "0.5";
        deleteOption.style.cursor = "not-allowed";
        deleteOption.innerHTML = `
            <h3 style="color:#ff4a4a; margin-top:0;">🔥 カードを削除する</h3>
            <p style="color:#ff4a4a; font-weight:bold; margin-bottom:4px;">選択不可（デッキが20枚以下になります）</p>
            <p style="font-size:13px; margin:0; color:#aaa;">現在のデッキ枚数: ${totalCards}枚</p>
        `;
    } else if ((player.gold || 0) < 25) {
        // ゴールド不足ロック
        deleteOption.style.opacity = "0.5";
        deleteOption.style.cursor = "not-allowed";
        deleteOption.innerHTML = `
            <h3 style="color:#ff4a4a; margin-top:0;">🔥 カードを削除する</h3>
            <p style="color:#ff4a4a; font-weight:bold; margin-bottom:4px;">ゴールド不足 (25G必要)</p>
            <p style="font-size:13px; margin:0; color:#aaa;">所持金: ${player.gold || 0}G</p>
        `;
    } else {
        // 条件を満たしている場合
        deleteOption.innerHTML = `
            <h3 style="color:#ff6b6b; margin-top:0;">🔥 カードを削除する</h3>
            <p style="font-size:13px; margin:0;">現在: ${totalCards}枚</p>
        `;
        deleteOption.onclick = function() {
            // 削除モードフラグをONにする
            window.isRestRoomDeletionMode = true;
            rewardScreen.style.display = "none"; // 休憩所モーダルを閉じる
            
            if (typeof showMapDeckManager === "function") {
                alert("削除したいカードをクリックしてください。");
                showMapDeckManager(); // デッキ画面を開く
            } else {
                handleSimplePromptDeletion();
            }
        };
    }
    rewardArea.appendChild(deleteOption);


    // ─── ② ⚒️ 鍛冶屋（カードのアップグレード機能） ───
    const upgradeOption = document.createElement("div");
    upgradeOption.className = "card rewardCard common";
    upgradeOption.style.cursor = "pointer";
    upgradeOption.style.padding = "15px";
    upgradeOption.style.margin = "10px";
    upgradeOption.style.border = "2px solid #3498db";
    upgradeOption.style.borderRadius = "8px";
    upgradeOption.style.backgroundColor = "rgba(52, 152, 219, 0.1)";

    if (window.upgradeCount >= 7) {
        // 回数制限ロック（7回まで）
        upgradeOption.style.opacity = "0.5";
        upgradeOption.style.cursor = "not-allowed";
        upgradeOption.innerHTML = `
            <h3 style="color:#7f8c8d; margin-top:0;">⚒️ 鍛冶屋 (カード強化)</h3>
            <p style="color:#ff4a4a; font-weight:bold; margin-bottom:4px;">強化回数の上限に達しました</p>
            <p style="font-size:13px; margin:0; color:#aaa;">回数: ${window.upgradeCount}/7 回</p>
        `;
    } else if ((player.gold || 0) < 100) {
        // ゴールド不足ロック (100G必要)
        upgradeOption.style.opacity = "0.5";
        upgradeOption.style.cursor = "not-allowed";
        upgradeOption.innerHTML = `
            <h3 style="color:#7f8c8d; margin-top:0;">⚒️ 鍛冶屋 (カード強化)</h3>
            <p style="color:#ff4a4a; font-weight:bold; margin-bottom:4px;">ゴールド不足 (100G必要)</p>
            <p style="font-size:13px; margin:0; color:#aaa;">所持金: ${player.gold || 0}G (回数: ${window.upgradeCount}/7)</p>
        `;
    } else {
        // 条件を満たしている場合
        upgradeOption.innerHTML = `
            <h3 style="color:#3498db; margin-top:0;">⚒️ 鍛冶屋 (カード強化)</h3>
	<p>7回までアップグレード可能</p>
        `;
        upgradeOption.onclick = function() {
            handleSimplePromptUpgrade();
        };
    }
    rewardArea.appendChild(upgradeOption);


    // ─── ③ 体力をさらに30%回復 ───
    const healOption = document.createElement("div");
    healOption.className = "card rewardCard common";
    healOption.style.cursor = "pointer";
    healOption.style.padding = "15px";
    healOption.style.margin = "10px";
    healOption.style.border = "2px solid #4caf50";
    healOption.style.borderRadius = "8px";
    healOption.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
    
    const extraHealAmount = Math.floor(player.maxHp * 0.30);
    healOption.innerHTML = `
        <h3 style="color:#4caf50; margin-top:0;">💖 体力回復</h3>
        <p style="color:#4caf50; font-weight:bold; margin-bottom:4px;">さらに30%回復</p>
    `;
    healOption.onclick = function() {
        player.hp = Math.min(player.maxHp, player.hp + extraHealAmount);
        alert(`💖 体力が ${extraHealAmount} 回復しました！`);
        finishRestRoom();
    };
    rewardArea.appendChild(healOption);

    // ─── ④ ゴールドをランダムでもらえる ───
    const goldOption = document.createElement("div");
    goldOption.className = "card rewardCard common";
    goldOption.style.cursor = "pointer";
    goldOption.style.padding = "15px";
    goldOption.style.margin = "10px";
    goldOption.style.border = "2px solid #feca57";
    goldOption.style.borderRadius = "8px";
    goldOption.style.backgroundColor = "rgba(254, 202, 87, 0.1)";
    
    goldOption.innerHTML = `
        <h3 style="color:#feca57; margin-top:0;">🪙 ゴールドを得る</h3>
        <p style="color:#feca57; font-weight:bold; margin-bottom:4px;">100 / 125 / 150 ゴールド (ランダム獲得)</p>
    `;
    goldOption.onclick = function() {
        const goldPool = [100, 125, 150];
        const randomGold = goldPool[Math.floor(Math.random() * goldPool.length)];
        player.gold += randomGold;
        alert(`💰 ${randomGold} ゴールドを見つけました！`);
        finishRestRoom();
    };
    rewardArea.appendChild(goldOption);

    // モーダル表示を起動
    rewardScreen.style.display = "flex";
}


/**
 * 共通のカードUIを生成する関数
 * @param {Object} cardData - カードのマスターデータ
 * @param {Boolean} isUpgraded - 強化済みフラグ
 */
function createCardElement(cardData, isUpgraded = false) {
    const card = document.createElement("div");

    const costClass =
        cardData.cost >= 3 ? "cost-3" : `cost-${cardData.cost}`;

    card.className =
        `card rewardCard ${cardData.rarity} cat-${cardData.cat} ${costClass}`;

    let displayDesc = cardData.desc || cardData.description || "";

    if (cardData.type === "nkai") {
        const currentCount =
            (window.player.status && window.player.status.nkaiCount) || 0;

        const currentDamage =
            (cardData.value || 0) + currentCount;

        displayDesc =
            `${cardData.desc}（現在: ${currentDamage}ダメ）`;
    }

    card.innerHTML = `
        <h3>${cardData.name}</h3>
        <p>Cost:${cardData.cost}</p>
        <p>${displayDesc}</p>
    `;

    return card;
}

// =========================================================================
// ⚒️ 鍛冶屋（アップグレード）専用モーダル UI システム 【完全修正版】
// =========================================================================

function handleSimplePromptUpgrade() {
    // 既存のモーダルがあれば削除
    let upgradeModal = document.getElementById("forgeModal");
    if (upgradeModal) upgradeModal.remove();

    // モーダル生成
    upgradeModal = document.createElement("div");
    upgradeModal.id = "forgeModal";
    
    // 💡 z-indexを大きくし、画面全体を覆うように設定
    upgradeModal.style.cssText = `
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100vw; 
        height: 100vh;
        background: rgba(0, 0, 0, 0.9); 
        display: flex; 
        justify-content: center;
        align-items: center; 
        z-index: 99999; /* 非常に大きな値を設定 */
        font-family: sans-serif; 
        color: #fff;
        pointer-events: auto;
    `;

    upgradeModal.innerHTML = `
        <div style="background: #1a1c23; border: 2px solid #3498db; width: 95%; max-width: 1500px; height: 90vh; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 0 20px rgba(52,152,219,0.3);">
            <div style="background: #222531; padding: 15px 20px; border-bottom: 2px solid #3498db;">

    <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="margin:0;font-size:22px;color:#3498db;display:flex;align-items:center;gap:10px;">
            ⚒️ 鍛冶屋（カード強化）
        </h2>

        <span style="font-size:14px;color:#aaa;background:rgba(0,0,0,0.4);padding:5px 12px;border-radius:20px;">
            費用：
            <span style="color:#2ecc71;font-weight:bold;">100G</span>
            &nbsp;|&nbsp;
            回数：
            <span style="color:#feca57;font-weight:bold;">${window.upgradeCount}/7</span>
        </span>
    </div>

    <div style="
        margin-top:12px;
        text-align:center;
        font-size:17px;
        background:rgba(0,0,0,0.35);
        padding:10px;
        border-radius:8px;
        font-weight:bold;
    ">
        🪜 Floor:
        <span style="color:#54a0ff;">${floor}/40</span>

        &nbsp;&nbsp;&nbsp;&nbsp;

        ❤️ 体力:
        <span style="color:#ff6b6b;">
            ${player.hp} / ${player.maxHp}
            (${Math.floor(player.hp / player.maxHp * 100)}%)
        </span>

        &nbsp;&nbsp;&nbsp;&nbsp;

        💰 所持金:
        <span style="color:#feca57;">
            ${player.gold}G
        </span>
    </div>

</div>

            <div style="display: flex; flex: 1; overflow: hidden;">
                <div style="width: 70%; border-right: 1px solid #2d3247; padding: 15px; display: flex; flex-direction: column;">
                    <div style="font-size: 14px; color: #aaa; margin-bottom: 10px; font-weight: bold;">強化するカードを選択してください：</div>
                    <div id="forgeDeckList" style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(5, 1fr);gap: 10px; padding-right: 5px;">
//ここのrepeatは一行5枚カードを表示する。
                        </div>
                </div>

                <div style="width: 30%; background: #15171e; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
                    <div id="forgePreviewArea" style="width: 100%; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 15px;">
                        <div style="text-align: center; color: #666; font-size: 15px;">
                            左のリストからカードを選ぶと、<br>強化前後の比較が表示されます。
                        </div>
                    </div>

                    <div id="forgeActionArea" style="width: 100%; display: none; gap: 15px; margin-top: 15px;">
                        <button id="btnForgeCancelSelection" style="flex: 1; padding: 12px; background: #3e445b; border: none; color: #fff; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s;">
                            選択を解除
                        </button>
                        <button id="btnForgeExecute" style="flex: 2; padding: 12px; background: #2ecc71; border: none; color: #fff; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; box-shadow: 0 4px 10px rgba(46,204,113,0.3); transition: 0.2s;">
                            🔥 100Gでアップグレード
                        </button>
                    </div>
                </div>
            </div>

            <div style="background: #1a1c23; padding: 12px 20px; border-top: 1px solid #2d3247; display: flex; justify-content: flex-end;">
                <button id="btnForgeClose" style="padding: 8px 20px; background: #e43f5a; border: none; color: #fff; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    鍛冶屋を出る（やめる）
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(upgradeModal);

    // ── データのレンダリング開始 ──
    const currentSlot = window.currentSlot || 0;
    const currentDeck = savedDecks[currentSlot] || {};
    // 鍛冶屋リストのコンテナを取得
const deckListContainer = document.getElementById("forgeDeckList");
deckListContainer.innerHTML = ""; // 一度クリア

const rarityPriority = {
    common: 0,
    uncommon:1,
    rare: 2,
    legend: 3
};

const catPriority = {
    atk: 0,
    blk: 1,
    rec: 2,
    abn: 3,
    oth: 4
};

const sortedCards = Object.keys(currentDeck)
    .filter(cardId => currentDeck[cardId] > 0)
    .map(cardId => {
        const cardData =
            allCardsMaster.find(c => c.id == cardId) ||
            (typeof allCards !== "undefined" ? allCards[cardId] : null);

        return {
            id: cardId,
            data: cardData,
            count: currentDeck[cardId]
        };
    })
    .filter(x => x.data)
.sort((a, b) => {

    // ① カテゴリ
    const aCat = catPriority[a.data.cat] ?? 999;
    const bCat = catPriority[b.data.cat] ?? 999;

    if (aCat !== bCat) {
        return aCat - bCat;
    }

    // ② ID下2桁
    const aId = Number(a.id) % 100;
    const bId = Number(b.id) % 100;

    if (aId !== bId) {
        return aId - bId;
    }

    // ③ レアリティ
    return rarityPriority[a.data.rarity] - rarityPriority[b.data.rarity];
});



// カード生成ループ部分
for (const entry of sortedCards) {

    const cardId = entry.id;
    const cardData = entry.data;

    for (let i = 0; i < entry.count; i++) {
    if (!cardData) continue;

        const cardItem =
    createCardElement(cardData, false);
        
        // ★重要：既存のインラインスタイル（widthなど）を上書きせず、必要なら最低限にする
        cardItem.style.flex = "0 0 auto";
        
        cardItem.onclick = function() {
            // 他の選択リセット
            const allCardsInList = deckListContainer.querySelectorAll('.card');
            allCardsInList.forEach(c => {
                c.style.border = "2px solid #bdc3c7";
                c.style.transform = "scale(1)";
            });

            // 選択強調
            cardItem.style.border = "3px solid #2ecc71";
            cardItem.style.transform = "scale(1.05)";
            
            selectedCardId = cardId;
            updateForgePreview(cardId, cardData);
        };

        deckListContainer.appendChild(cardItem);
    }
}
    // ── プレビューの描画処理 ──
    function updateForgePreview(id, data) {
        const previewArea = document.getElementById("forgePreviewArea");
        const actionArea = document.getElementById("forgeActionArea");
        
const currentName = data.name;
const currentCost = data.cost;

// アップグレード先を探す
const upgradeOffset =
    data.rarity === "common" ? 2000 : 1000;

const upgradedId = Number(id) + upgradeOffset;

const upgradedCardData =
    allCardsMaster.find(c => c.id == upgradedId);

// アップグレード先が存在しないなら最大強化
if (!upgradedCardData) {
    previewArea.innerHTML = `
        <div style="background: rgba(241,196,15,0.1); border:1px solid #f1c40f; padding:15px; border-radius:8px; width:90%; text-align:center;">
            <h4 style="color:#f1c40f; margin:0 0 10px 0;">
                ✨ すでに最大まで強化されています
            </h4>
            <p style="font-size:13px; color:#ccc; margin:0;">
                このカードはこれ以上鍛冶屋でアップグレードすることはできません。
            </p>
        </div>
    `;
    actionArea.style.display = "none";
    return;
}

        previewArea.innerHTML = "";

const wrap = document.createElement("div");
wrap.style.display = "flex";
wrap.style.alignItems = "center";
wrap.style.justifyContent = "space-around";
wrap.style.width = "100%";

const beforeArea = document.createElement("div");
beforeArea.style.textAlign = "center";

const afterArea = document.createElement("div");
afterArea.style.textAlign = "center";

beforeArea.innerHTML =
"<div style='margin-bottom:8px;color:#ff6b6b;font-weight:bold;'>BEFORE</div>";

afterArea.innerHTML =
"<div style='margin-bottom:8px;color:#2ecc71;font-weight:bold;'>AFTER</div>";

const beforeCard =
    createCardElement(data,false);

const afterCard =
    createCardElement(upgradedCardData,true);

beforeArea.appendChild(beforeCard);

const arrow=document.createElement("div");
arrow.innerHTML="➜";
arrow.style.fontSize="42px";
arrow.style.margin="0 20px";
arrow.style.color="#3498db";

afterArea.appendChild(afterCard);

wrap.appendChild(beforeArea);
wrap.appendChild(arrow);
wrap.appendChild(afterArea);

previewArea.appendChild(wrap);


        // ボタンエリアを表示
        actionArea.style.display = "flex";

        // 💡 【バグ修正】IDの不一致（"forgeExecute" -> "btnForgeExecute"）を修正してイベントをバインド
        document.getElementById("btnForgeExecute").onclick = function() {
            if (player.gold < 100) {
                alert("💰 ゴールドが足りません！");
                return;
            }

            // ゴールドの減算とカウント増加
            player.gold -= 100;
            window.upgradeCount = (window.upgradeCount || 0) + 1;

if (currentDeck[id] > 0) {
        // 元のカードをデッキから1枚減らす
        currentDeck[id]--;
        if (currentDeck[id] === 0) delete currentDeck[id];

        const upgradeOffset =
    data.rarity === "common"
        ? 2000
        : 1000;

const upgradedId =
    Number(id) + upgradeOffset;

const upgradedCardData =
    allCardsMaster.find(c => c.id == upgradedId);

if (!upgradedCardData) {
    alert("このカードはアップグレード先がありません。");
    return;
}

        // 3. デッキに新しいIDを追加
        currentDeck[upgradedId] = (currentDeck[upgradedId] || 0) + 1;

        const nextName = upgradedCardData ? upgradedCardData.name : (data.name + "+");
        alert(`⚒️ 「${data.name}」が「${nextName}」に強化されました！`);
    }

            // モーダルを閉じて休憩所イベントを終了する
            // UI更新
if (typeof updateUI === "function") updateUI();

// モーダルを閉じる
upgradeModal.remove();

// まだ7回未満なら鍛冶屋を開き直す
if (window.upgradeCount < 7) {
    handleSimplePromptUpgrade();
} else {
    alert("⚒️ 強化回数が7回に達しました。");
    finishRestRoom();
}
        };
    }

    // 選択解除ボタン
    document.getElementById("btnForgeCancelSelection").onclick = function() {
        selectedCardId = null;
        document.getElementById("forgeActionArea").style.display = "none";
        document.getElementById("forgePreviewArea").innerHTML = `
            <div style="text-align: center; color: #666; font-size: 15px;">
                左のリストからカードを選ぶと、<br>強化前後の比較が表示されます。
            </div>
        `;
        Array.from(deckListContainer.children).forEach(child => {
            child.style.border = "1px solid #444";
            child.style.background = "#252836";
        });
    };

    // やめるボタン（モーダルを閉じるだけで、休憩所に戻る）
    document.getElementById("btnForgeClose").onclick = function() {
    upgradeModal.remove();
    finishRestRoom();
};
}

/**
 * 🏕️ 休憩所の処理を終了してマップへ戻る処理
 */
function finishRestRoom() {
    // 🚩 【修正】フラグを強制解除する
    window.isRestRoomDeletionMode = false;
     window.upgradeCount = 0;
    
    const rewardScreen = document.getElementById("rewardScreen");
    if (rewardScreen) rewardScreen.style.display = "none";
    
    // 鍛冶屋モーダルが開いたままなら閉じる
    const forgeModal = document.getElementById("forgeModal");
    if (forgeModal) forgeModal.remove();
    
    // UIを再更新し、マップをリロード
    if (typeof updateUI === 'function') updateUI();
    openMap();
}

/**
 * プロジェクト内にカード削除専用のUIが無い、または開かなかった場合のテキストベース安全用処理
 */
function handleSimplePromptDeletion() {
    const currentSlot = window.currentSlot || 0;
    const currentDeck = savedDecks[currentSlot];
    let cardListString = "削除したいカードのマスターIDを入力してください：\n\n";
    
    for (let id in currentDeck) {
        if (currentDeck[id] > 0) {
            const master = typeof allCardsMaster !== 'undefined' ? allCardsMaster.find(c => c.id == id) : null;
            const cardName = master ? master.name : `カードID:${id}`;
            cardListString += `【ID: ${id}】 ${cardName} (所持数: ${currentDeck[id]}枚)\n`;
        }
    }
    
    const inputId = prompt(cardListString);
    if (inputId !== null && currentDeck[inputId] && currentDeck[inputId] > 0) {
        currentDeck[inputId]--;
        alert("カードを1枚削除しました。");
        finishRestRoom();
    } else {
        alert("無効なID、または削除をキャンセルしました。ゴールド(25G)を返却して選択し直します。");
        player.gold += 25;
        triggerRestRoomChoiceEvent(); // もう一度選択モーダルをやり直す
    }
}

// =========================================================================
// 📊 ゲームUI総合更新処理（戦闘時・マップ表示共通）
// =========================================================================
function updateUI(){

if (enemy.data.name === "Trait") {
    let traitText = [];

    enemy.status.traits.forEach(trait => {
        switch (trait) {
            case "immuneNormal":
                traitText.push("🛡️物理無効");
                break;
            case "immuneStatus":
                traitText.push("☠️状態異常無効");
                break;
            case "atkUp":
                traitText.push("⚔️攻撃力増加");
                break;
            case "heal":
                traitText.push("💚毎ターン回復");
                break;
            case "leak":
                traitText.push("⚡漏電付与");
                break;
            case "amnesia":
                traitText.push("🧠忘却付与");
                break;
            case "immaturity":
                traitText.push("👶未熟付与");
                break;
            case "fixedDamage":
                traitText.push("💥固定ダメージ");
                break;
        }
    });

    document.getElementById("enemyTrait").innerHTML =
        "特性：" + traitText.join(" / ");
}


const pHpText = document.getElementById("playerHpText");
    if(pHpText) {
        // 現在の最大HPからパーセンテージを計算
        const hpPercent = player.maxHp > 0 ? Math.floor((player.hp / player.maxHp) * 100) : 0;
        pHpText.innerText = `${player.hp} / ${player.maxHp}  (${hpPercent}%)`;
    }

    const pHpBar = document.getElementById("playerHpBar");
    if(pHpBar) pHpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;

    const pEnergy = document.getElementById("playerEnergy");
    if(pEnergy) pEnergy.innerText = `⚡ ${player.energy} / ${player.maxEnergy}`;

    const pBlock = document.getElementById("playerBlock");
    if(pBlock) pBlock.innerText = `🛡️ ${player.block}`;


    const eHpText = document.getElementById("enemyHpText");
    if(eHpText) eHpText.innerText = `${enemy.hp} / ${enemy.maxHp}`;

    const eHpBar = document.getElementById("enemyHpBar");
    if(eHpBar) eHpBar.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;

const uiEnemyAttack = document.getElementById("enemyAttack");
    if (uiEnemyAttack && enemy.attack !== undefined) {
        if (enemy.attack === 0) {
            uiEnemyAttack.innerText = `⚔️ 攻撃: 0`;
            uiEnemyAttack.style.color = ""; // 色をリセット
        } else {

            
	    let displayAtk = enemy.attack;


// オーク（Orc）のHPが半分以下なら攻撃力を2倍に補正
const isOrcBerserk = enemy.data && enemy.data.name === "Orc" && (enemy.hp <= enemy.maxHp / 2);
if (isOrcBerserk) {
    displayAtk = displayAtk * 2;
}

//凍結状態なら2/3にする。
            const isFrozen = enemy.status && enemy.status.freeze > 0;
            if (isFrozen) {
                displayAtk = Math.floor(displayAtk * 2 / 3);
            }

            const minAtk = Math.floor(displayAtk * 0.50);
            const maxAtk = Math.floor(displayAtk * 1.50);

	    if (isFrozen) {
                // 凍結中は一目で分かるように (凍結❄️) の文字を追加し、文字色を青っぽくする
                uiEnemyAttack.innerText = `⚔️ 攻撃: ${minAtk} ～ ${maxAtk}`;
		if(enemy.data && enemy.data.name === "Ork" && enemy.hp <= (enemy.maxHp * 0.5)){
		    uiEnemyAttack.innerText = `⚔️ 攻撃: ${minAtk*2} ～ ${maxAtk*2}`;
}
                uiEnemyAttack.style.color = "#a0c0ff"; 
            } 
            else if (enemy.data && enemy.data.name === "Ork" && enemy.hp <= (enemy.maxHp * 0.5)) {
                // 【オークのピンチ時特性】名前が "Ork" かつ HP50%以下の時
                uiEnemyAttack.innerText = `⚔️ 攻撃: ${minAtk * 2} ～ ${maxAtk * 2}`;
                uiEnemyAttack.style.color = "#ff9f43"; // 強化中と分かるようにオレンジ色等にする（お好みで）
            } 
            else {
                // 通常時（オーク以外の敵、またはオークのHPが半分より多い時）
                uiEnemyAttack.innerText = `⚔️ 攻撃: ${minAtk} ～ ${maxAtk}`;
                uiEnemyAttack.style.color = ""; // 元の色（白など）に戻す
            }
	
        }
    }

    const eBlock = document.getElementById("enemyBlock");
    if(eBlock) eBlock.innerHTML = `🛡️ ${enemy.block}`;
    
    // 戦闘画面のFloor表示部分にゴールド表示
    const floorDisp = document.getElementById("floorDisplay");
    if(floorDisp) floorDisp.innerHTML = `Floor ${floor}/40 <span style="color:gold; margin-left:15px; font-weight:bold;">💰 ${player.gold || 0}G</span>`;
    
    const dCount = document.getElementById("deckCount");
    if(dCount) dCount.innerText = `Deck ${deck.length}`;
    const discCount = document.getElementById("discardCount");
    if(discCount) discCount.innerText = `Discard ${discardPile.length}`;


    let statusText = "";
    if(enemy.status.poisonList && enemy.status.poisonList.length > 0) {
        enemy.status.poisonList.forEach(p => {
            statusText += `☠️毒:${p.value} (${p.duration}T)<br>`;
        });
    }
    if(enemy.status.burn > 0) statusText += `🔥火傷:${enemy.status.burn}<br>`;
    if(enemy.status.freeze > 0) statusText += `❄️凍結:${enemy.status.freeze}T<br>`;
    if(enemy.status.stun > 0 && enemy.data.name !== "Dragon") statusText += `💫スタン状態<br>`; 
    if(enemy.status.behaviorControlled && enemy.status.camouflageTurns > 0) statusText += `行動制御:超攻撃→バランス(${enemy.status.camouflageTurns}T)<br>`;


    if(enemy.data){

	if (enemy.data && enemy.data.name === "Trait" && Array.isArray(enemy.status.traits)) {

    	    const traitNames = {
        	immuneNormal: "🛡️物理無効",
        	immuneStatus: "☠️状態異常無効",
        	atkUp: "⚔️攻撃力増加",
        	heal: "💚毎ターン回復",
	        leak: "⚡漏電付与",
        	amnesia: "❓忘却付与",
        	immaturity: "🔰未熟付与",
       	 	fixedDamage: "💥固定ダメージ"
    	    };
   	 statusText += `${enemy.status.traits
        	.map(trait => traitNames[trait] || trait)
        	.join(" / ")}<br>`;
	}


        if(enemy.data.immuneNormal){
            statusText += `🛡️物理無効<br>`;
        }
        if(enemy.data.immuneStatus){
            statusText += `☠️状態異常無効<br>`;
        }
        if(enemy.data.name === "Golem"){
            statusText += `✊反撃 +3ダメージ<br>`;
	    statusText += `☠️毒無効<br>`;

        }
        if(enemy.data.name === "Bee"){
            statusText += `💨回避率 33%<br>`;
        }



        if(enemy.data.name === "Slime"){
            statusText += `☠️状態ダメージ2倍<br>`;
        }


    }

    if(statusText === "") statusText = "なし";
    const eStatus = document.getElementById("enemyStatus");
    if(eStatus) eStatus.innerHTML = statusText;


    // ─── プレイヤーステータスの更新 ───
let pStatusText = "";

    if (player.fields.boss_scout > 0) pStatusText += `👁️20階ボス: ${window.boss20}<br>`;

    if (player.fields.boss_scout > 0) pStatusText += `👁️40階ボス: ${window.boss40}<br>`;

    if(player.status.healTurns > 0) pStatusText += `💖ヒール:${player.status.heal} (${player.status.healTurns}T)<br>`;
    
    if(player.status.leak > 0) pStatusText += `🔋漏電:${player.status.leak}T<br>`;

    if(player.status.leakBlockTurns > 0) pStatusText += `🧤耐電:${player.status.leakBlockTurns}T<br>`;

    if(player.status.counterTurns > 0) pStatusText += `👊カウンター:${player.status.counterTurns}T<br>`;

    if(player.status.amnesia > 0) pStatusText += `❓ 忘却: ${player.status.amnesia}T<br>`;

    if(player.status.adrenalineAtk > 0) pStatusText += `🗡️ 攻撃UP: 攻撃力+${player.status.adrenalineAtk}<br>`;

    if(player.status.immaturity > 0) pStatusText += `🔰 未熟<br>`;

    if(player.status.timeLoop > 0) pStatusText += `🔄 ループ<br>`;



    if(pStatusText === "") pStatusText = "なし";
    
    const pStatus = document.getElementById("playerStatus");
    if(pStatus) pStatus.innerHTML = pStatusText;


    // =========================================================================
    // 🧪 【表示バグ完全修正】CSSデザインクラスと連動するポーション更新処理
    // =========================================================================
    const potionArea = document.getElementById("uiPotionArea");
    if (potionArea) {
        // ポーションの種類に応じたアイコンとホバー説明の定義
        let potionIcon = "🎒";
        let potionDesc = "ポーションを所持していません。";

        if (window.playerPotion === "heal") {
            potionIcon = "❤️‍🩹";
            potionDesc = "【回復ポーション】\n戦闘中に使用可能。プレイヤーのHPを 15 回復する。";
        } else if (window.playerPotion === "energy") {
            potionIcon = "⚡";
            potionDesc = "【エネルギーポーション】\n戦闘中に使用可能。このターンのみエネルギーを +2 する。";
        } else if (window.playerPotion === "block") {
            potionIcon = "🛡️";
            potionDesc = "【防御ポーション】\n戦闘中に使用可能。即座にブロックを 20 獲得する。";
        } else if (window.playerPotion === "draw") {
            potionIcon = "🎴";
            potionDesc = "【ドローポーション】\n戦闘中に使用可能。山札からカードを 3 枚多く引く。";
        } else if (window.playerPotion === "acid") {
            potionIcon = "🧪";
            potionDesc = "【強酸ポーション】\n戦闘中に使用可能。敵のブロックを 0 にして、毒5 を付与する。";
        }


        // ポーションの所持状態に合わせて、HTMLの固定領域の中身を完全に書き換える
        if (window.playerPotion) {
            // ① ポーション所持時：CSSの「potion-active-btn」を使い正円(〇)ボタンにする
            potionArea.title = potionDesc; // マウスホバーで説明表示
            potionArea.innerHTML = `
                <button id="uiPotionBtn" class="potion-active-btn" onclick="usePotion();">
                    ${potionIcon}
                </button>
            `;
            
            // ⚠️ 戦闘中でない場合（マップなど）は誤クリック防止のためにボタンを半透明にし、無効化する
            const btn = document.getElementById("uiPotionBtn");
            if (btn && !window.inBattle) {
                btn.disabled = true;
                btn.style.pointerEvents = "none"; 
                btn.style.opacity = "0.5";
            }
        } else {
            // ② 未所持時：CSSの「potion-empty-slot」を使い、灰色の丸枠(〇)の中に「なし」を表示
            potionArea.title = potionDesc;
            potionArea.innerHTML = `<div class="potion-empty-slot">なし</div>`;
        }
    }
    // =========================================================================


    // ─── フィールド効果の更新 ───
    let fieldTexts = [];
    if(player.fields.atk_up > 0) fieldTexts.push(`⚔️攻撃+${player.fields.atk_up}`);
    if(player.fields.def_up) fieldTexts.push(`🛡️防御+${player.fields.def_up}`);
    if(player.fields.draw_up) fieldTexts.push(`🃏確率ドロー`);
    if(player.fields.heavy_burn) fieldTexts.push(`🔥火傷増加`);

    const fDisplay = document.getElementById("fieldsDisplay");
    if(fDisplay) fDisplay.innerText = "フィールド効果: " + (fieldTexts.length > 0 ? fieldTexts.join(", ") : "なし");
}