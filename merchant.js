// =========================================================================
// 🧑‍💼 行商人（Merchant）イベント
// =========================================================================
// マップ上の「行商人」マスに入ると発生する。
// ・すべてのカードの中からランダムで5枚提示する
// ・提示されたカードのうちデッキに1枚以上持っているものを行商人に譲る（デッキから削除）と
//   💰+500G もらえ、さらにランダムなカード10枚から1枚を選べる（選ばなくても良い）
// ・何も譲らずに立ち去ると 💰-50G になる
//   （提示されたカードを1枚もデッキに持っていない場合も、持っているのに譲らなかった場合も同様）
// ・floorは変化しないため、イベント終了後は同じ階層のままマップ分岐を再度選び直す

let isMerchantActive = false;
window.merchantOfferCards = window.merchantOfferCards || null;
window.merchantGaveCardThisVisit = false;

// 行商人のマスに入った時の入り口処理
function triggerMerchant() {
    isMerchantActive = true;
    window.merchantGaveCardThisVisit = false;

    // 呪い（cat:"none" / rarity:"none"）を除いた、全カードマスターからランダムに5枚（重複無し）を提示する
    const pool = allCardsMaster.filter(c => c.cat !== "none" && c.rarity !== "none");
    const offerCards = [];
    const usedIds = new Set();
    let guard = 0;
    while (offerCards.length < 5 && guard < 300 && usedIds.size < pool.length) {
        guard++;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        if (!pick || usedIds.has(pick.id)) continue;
        usedIds.add(pick.id);
        offerCards.push(pick);
    }
    window.merchantOfferCards = offerCards;

    renderMerchantOfferScreen();
}

// 行商人が5枚のカードを提示している画面を表示する
function renderMerchantOfferScreen() {
    const rewardTitle = document.getElementById("rewardTitle");
    const rewardScreen = document.getElementById("rewardScreen");
    const rewardArea = document.getElementById("rewardCards");
    if (!rewardScreen || !rewardArea) return;

    rewardScreen.style.display = "flex";

    if (rewardTitle) {
        rewardTitle.innerHTML =
            `🧑‍💼 行商人「このカード達を探しておる…同じカードを持っておらぬか？」<br>` +
            `<span style="font-size:14px; color:#ccc; font-weight:normal;">` +
            `持っているカードを譲ると💰500G＋お礼のカード選択、何も譲らず立ち去ると💰-50G` +
            `</span> | 💰所持: ${player.gold || 0}G`;
    }

    rewardArea.innerHTML = "";

    const currentSlot = window.currentSlot || 0;
    const currentDeck = savedDecks[currentSlot] || {};

    (window.merchantOfferCards || []).forEach(card => {
        const owned = (currentDeck[card.id] || 0) > 0;
        const div = document.createElement("div");
        const costClass = card.cost >= 3 ? "cost-3" : `cost-${card.cost}`;
        div.className = `card rewardCard ${card.rarity} cat-${card.cat} ${costClass}`;

        if (owned) {
            div.style.cursor = "pointer";
            div.style.border = "2px solid #feca57";
            div.innerHTML = `
                <h3>${card.name}</h3>
                <p>Cost:${card.cost}</p>
                <p>${card.desc || ""}</p>
                <p style="font-size:12px; color:#aaa; margin:2px 0;">所持数: ${currentDeck[card.id]}枚</p>
                <p style="color:#feca57; font-weight:bold; font-size:15px; margin-top:5px;">🪙 行商人に譲る (+500G)</p>
            `;
            div.onclick = () => giveCardToMerchant(card);
        } else {
            div.style.opacity = "0.45";
            div.style.cursor = "not-allowed";
            div.innerHTML = `
                <h3>${card.name}</h3>
                <p>Cost:${card.cost}</p>
                <p>${card.desc || ""}</p>
                <p style="color:#888; font-weight:bold; margin-top:5px;">所持していません</p>
            `;
        }
        rewardArea.appendChild(div);
    });

    const skipBtn = rewardScreen.querySelector("button[onclick*='skip']");
    if (skipBtn) {
        skipBtn.style.display = "block";
        skipBtn.innerText = "何も渡さず立ち去る";
        skipBtn.onclick = leaveMerchant;
    }
}

// 提示されたカードを1枚、行商人に譲る
function giveCardToMerchant(card) {
    if (!isMerchantActive) return;

    const currentSlot = window.currentSlot || 0;
    const currentDeck = savedDecks[currentSlot];
    if (!currentDeck || !(currentDeck[card.id] > 0)) {
        customAlert("そのカードは所持していません。");
        return;
    }

    // デッキから1枚減らす
    currentDeck[card.id]--;
    localStorage.setItem("mini_spire_saved_decks", JSON.stringify(window.savedDecks));

    player.gold = (player.gold || 0) + 500;
    window.merchantGaveCardThisVisit = true;

    customAlert(`🧑‍💼「${card.name}」を行商人に譲った！ 💰+500G（現在：${player.gold}G）`);

    if (typeof updateUI === 'function') updateUI();

    // お礼のカード選択画面へ
    showMerchantBonusPick();
}

// お礼として、ランダムなカード10枚から1枚選べる（選ばなくても良い）画面
function showMerchantBonusPick() {
    const rewardTitle = document.getElementById("rewardTitle");
    const rewardScreen = document.getElementById("rewardScreen");
    const rewardArea = document.getElementById("rewardCards");
    if (!rewardScreen || !rewardArea) return;

    if (rewardTitle) {
        rewardTitle.innerHTML = `🧑‍💼 お礼にカードを1枚選べます（選ばなくても構いません） | 💰所持: ${player.gold || 0}G`;
    }
    rewardArea.innerHTML = "";

    const bonusCards = [];
    let guard = 0;
    while (bonusCards.length < 10 && guard < 100) {
        guard++;
        const c = (typeof randomCard === 'function') ? randomCard() : null;
        if (c) bonusCards.push(c);
    }

    bonusCards.forEach(card => {
        const div = document.createElement("div");
        const costClass = card.cost >= 3 ? "cost-3" : `cost-${card.cost}`;
        div.className = `card rewardCard ${card.rarity} cat-${card.cat} ${costClass}`;
        div.innerHTML = `<h3>${card.name}</h3><p>Cost:${card.cost}</p><p>${card.desc || ""}</p>`;
        div.onclick = () => takeMerchantBonusCard(card);
        rewardArea.appendChild(div);
    });

    const skipBtn = rewardScreen.querySelector("button[onclick*='skip']");
    if (skipBtn) {
        skipBtn.style.display = "block";
        skipBtn.innerText = "選ばずに立ち去る";
        skipBtn.onclick = () => finishMerchantVisit();
    }
}

// お礼のカードを選んでデッキに加える
function takeMerchantBonusCard(card) {
    const currentSlot = window.currentSlot || 0;
    if (!savedDecks[currentSlot]) savedDecks[currentSlot] = {};
    const currentDeck = savedDecks[currentSlot];

    currentDeck[card.id] = (currentDeck[card.id] || 0) + 1;
    localStorage.setItem("mini_spire_saved_decks", JSON.stringify(window.savedDecks));

    customAlert(`「${card.name}」をデッキに加えました！`);

    finishMerchantVisit();
}

// 何も譲らずに立ち去る（ペナルティ判定はここで行う）
function leaveMerchant() {
    if (!window.merchantGaveCardThisVisit) {
        player.gold = Math.max(0, (player.gold || 0) - 50);
        customAlert(`🧑‍💼 何も渡さなかったため、行商人は気分を害した… 💰-50G（現在：${player.gold}G）`);
        if (typeof updateUI === 'function') updateUI();
    }

    finishMerchantVisit();
}

// 行商人イベントを終了し、マップへ戻る（floorは変更しないため、同じ階層で選び直しになる）
function finishMerchantVisit() {
    isMerchantActive = false;
    window.merchantOfferCards = null;

    const rewardScreen = document.getElementById("rewardScreen");
    if (rewardScreen) rewardScreen.style.display = "none";

    localStorage.setItem("mini_spire_current_slot", window.currentSlot);

    const currentSlot = window.currentSlot || 0;
    const currentDeck = savedDecks[currentSlot] || {};
    let total = 0;
    for (let id in currentDeck) { total += currentDeck[id]; }

    if (total > 30 && typeof checkDeckOverflowAndManage === 'function') {
        checkDeckOverflowAndManage();
    } else if (typeof openMap === 'function') {
        openMap();
    }
}