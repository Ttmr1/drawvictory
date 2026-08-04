function toggleAreaEffect() {
    // 状態を反転 (未定義の安全対策も含める)
    if (typeof window.isAreaEffectEnabled === "undefined") {
        window.isAreaEffectEnabled = true;
    }
    window.isAreaEffectEnabled = !window.isAreaEffectEnabled;
    
    // 💡 切り替わった瞬間の状態（true/false）をローカルストレージへ即時保存
    localStorage.setItem("mini_spire_area_effect", window.isAreaEffectEnabled);
    
    if (window.isAreaEffectEnabled) {
        // ONになった時の処理（必要であれば追加）
    } else {
        // OFFに切り替わった瞬間、進行中のバトル環境があればノーマルにリセット
        window.currentArea = "none";
        if (document.body && document.body.style) {
            document.body.style.setProperty('background', '#1b1b2f', 'important');
        }
    }
    
    // 画面上の見た目を更新
    updateAreaConfigLabel();
}

/**
 * ⚙️ モーダル内のON/OFFラベルの文字と見た目を現在の状態に合わせる関数
 */
function updateAreaConfigLabel() {
    const label = document.getElementById("configAreaStatusLabel");
    if (!label) return;
    
    if (window.isAreaEffectEnabled) {
        // 【ONのとき】テキストをONにし、緑色のスタイルを適用
        label.innerText = "ON";
        label.style.color = "#4caf50";
        label.style.background = "rgba(76, 175, 80, 0.1)";
        label.style.borderColor = "#4caf50";
    } else {
        // 【OFFのとき】テキストをOFFにし、赤色のスタイルを適用
        label.innerText = "OFF";
        label.style.color = "#f44336";
        label.style.background = "rgba(244, 67, 54, 0.1)";
        label.style.borderColor = "#f44336";
    }
}

// 👹 敵の説明 ON/OFF を切り替える関数（エリア効果のトグルと同じ形式）
function toggleEnemyExplanation() {
    if (typeof window.isEnemyExplanationEnabled === "undefined") {
        window.isEnemyExplanationEnabled = false;
    }
    window.isEnemyExplanationEnabled = !window.isEnemyExplanationEnabled;

    // 切り替わった瞬間の状態（true/false）をローカルストレージへ即時保存
    localStorage.setItem("mini_spire_enemy_explanation", window.isEnemyExplanationEnabled);

    // 画面上の見た目（設定モーダルのラベル）を更新
    updateEnemyExplanationConfigLabel();

    // 戦闘中であれば、敵説明欄の表示もすぐに反映する
    if (typeof updateEnemyExplanationDisplay === "function") {
        updateEnemyExplanationDisplay();
    }
}

/**
 * ⚙️ モーダル内の「敵の説明」ON/OFFラベルの文字と見た目を現在の状態に合わせる関数
 */
function updateEnemyExplanationConfigLabel() {
    const label = document.getElementById("configEnemyExplainStatusLabel");
    if (!label) return;

    if (window.isEnemyExplanationEnabled) {
        label.innerText = "ON";
        label.style.color = "#4caf50";
        label.style.background = "rgba(76, 175, 80, 0.1)";
        label.style.borderColor = "#4caf50";
    } else {
        label.innerText = "OFF";
        label.style.color = "#f44336";
        label.style.background = "rgba(244, 67, 54, 0.1)";
        label.style.borderColor = "#f44336";
    }
}

// 👹 敵の説明欄（戦闘/エリート戦中）の表示・非表示と内容更新を行う関数
function updateEnemyExplanationDisplay() {
    const box = document.getElementById("enemyExplainArea");
    const textEl = document.getElementById("enemyExplainText");
    if (!box || !textEl) return;

    const desc = (typeof getEnemyDescription === "function" && enemy && enemy.data)
        ? getEnemyDescription(enemy.data)
        : "";

    if (window.isEnemyExplanationEnabled && window.inBattle && desc) {
        textEl.innerHTML = desc;
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

/**
 * ⚙️ 設定モーダルの開閉を管理する関数
 * HTMLの「ゲーム設定」ボタンから呼び出されます
 */
function toggleConfigModal() {
    // 💡 プロジェクト内にモーダル要素（例: id="configModal" など）があれば、
    // その表示/非表示（display = "flex" や "none"）を切り替える処理をここに記述します。
    // 例:
    const configModal = document.getElementById("configModal"); // HTML側の実際のIDに合わせてください
    if (configModal) {
        if (configModal.style.display === "flex") {
            configModal.style.display = "none";
        } else {
            configModal.style.display = "flex";
            // モーダルを開いたタイミングで現在のON/OFFラベルの状態を同期
            updateAreaConfigLabel();
            updateEnemyExplanationConfigLabel();
        }
    }
}

// 💀 敵の表示名を返す（エリートなら "Goblin_Elite" のような接尾辞付きにする）
function getEnemyDisplayName() {
    if (!enemy || !enemy.data) return "";
    return enemy.data.isElite ? `${enemy.data.name}_Elite` : enemy.data.name;
}

function startBattle(){
    player.maxEnergy = 5 + Math.floor(floor / 2); 
    player.energy = player.maxEnergy;
    player.block = 0;

    window.inBattle = true;

    // 使用禁止カテゴリ・禁止解除の効果を新しい戦闘のためにリセット
    window.witchBannedCategory = null;
    window.banImmunityTurns = 0;

    // 💡 霧エリア等の計算用に、元の最大エネルギーをここで一時保存しておく
    window.originalMaxEnergy = player.maxEnergy;

    // 背景色をデフォルト（元の色）にリセット
    document.body.style.setProperty('background', '#1b1b2f', 'important');
    const mainBattleScreen = document.getElementById("game"); 
    if (mainBattleScreen) mainBattleScreen.style.background = "#1a1a1a"; 

    // 初期値は「エリアなし」
    window.currentArea = "none";

    // 💡 BOSS以外の判定 ＆ エリア効果設定が「ON」のときだけ抽選する
    const isBoss = enemy.data && (enemy.data.isBoss || enemy.data.name === "dragon" || enemy.data.name === "magica" || enemy.data.name === "boost" || floor === 15 || floor === 30);

    if (window.isAreaEffectEnabled && !isBoss && floor !== 1) {
        const areaRoll = Math.random() * 100; // 0〜100の抽選
        
        if (areaRoll < 70) {
            window.currentArea = "none"; // なし (70%)
            // 通常エリアの時は、元の背景色（#1b1b2f）
            document.body.style.setProperty('background', '#1b1b2f', 'important');
        } else if (areaRoll < 80) {
            window.currentArea = "rain"; // 雨エリア (10%)
            document.body.style.setProperty('background', '#1c2331', 'important');
            customAlert("🌧️ 雨エリアに突入！火傷が無効化され、毎ターンHPが2回復します。");
        } else if (areaRoll < 90) {
            window.currentArea = "sunny"; // 日照りエリア (10%)
            document.body.style.setProperty('background', '#3a1c1c', 'important');
            customAlert("☀️ 日照りエリアに突入！火傷ダメージが2倍になり、毎ターン2ダメージ受けます。");
        } else {
            window.currentArea = "fog"; // 霧エリア(10%)
            document.body.style.setProperty('background', '#4a4a4a', 'important');
            // 最大エネルギーを元の1.2倍にする（端数切り捨て、最低+1）
            player.maxEnergy = Math.floor(window.originalMaxEnergy * 1.2);
            player.energy = player.maxEnergy; // 現在のエネルギーも同期
            customAlert("🌫️ 霧エリアに突入！プレイヤーの命中率が75%に低下、最大エネルギーが1.2倍になります。");
        }
    } else {
        // 設定がOFF、またはボス戦・1階の場合は強制的に「なし」
        window.currentArea = "none";
    }

    // --- 以下、元のステータス初期化処理 ---
    if (player.status.counterTurns > 0) {
        player.status.counterTurns--;
        if (player.status.counterTurns === 0) {
        }
    }
    
    const marketPenalty = (player.darkMarketCount || 0) * 10;

    player.maxHp = Math.floor((80 + (floor - 1) * 5 - marketPenalty)*0.75);
    if (player.maxHp < 1) player.maxHp = 1; 

    player.hp = Math.min(player.maxHp, player.hp + 5);

    const enemyStatus = initEnemyStatus();
    enemy.data = enemyStatus.data;
    enemy.hp = enemyStatus.hp;
    enemy.maxHp = enemyStatus.maxHp;
    enemy.attack = enemyStatus.attack;
    enemy.block = enemyStatus.block;
    enemy.status = enemyStatus.status;


// 👽 Traitの特性をここで決める
if (enemy.data.name === "Trait") {
    generateTraitTraits();
}
    
    window.phoenixReviveChance = 1;
    window.beastDamagedThisTurn = false;
    window.delayedQueue = [];
    window.zombieDamageTakenThisTurn = 0; 
    window.battleTurnCount = 1;          
    window.thiefStolenGold = 0;          
    window.isFirstTurn = true;           
    window.witchBannedCategory = null;
    window.shadowCardCountThisTurn = 0;
    window.cardsPlayedThisTurn = 0;
    player.status = player.status || {};
    player.status.immaturity = 0; 
    player.status.leak = 0;       
    player.status.fatigue = 0;    
    player.status.meditation = 0;
    player.status.counterTurns = player.status.counterTurns || 0; 

    // 🧪 ポーションスロット（器のポーションでmaxPotionSlotsが増加する）
    window.playerPotions = window.playerPotions || [];
    window.maxPotionSlots = window.maxPotionSlots || 1;
    window.vesselDrinkCount = window.vesselDrinkCount || 0;
    // 旧バージョンの単一スロット(window.playerPotion)からの引き継ぎ
    if (window.playerPotion && window.playerPotions.length === 0) {
        window.playerPotions.push(window.playerPotion);
    }
    window.playerPotion = null;

    const enemyNameEl = document.getElementById("enemyName");
    const enemyIconEl = document.getElementById("enemyIcon");
    if(enemyNameEl) enemyNameEl.innerText = getEnemyDisplayName();
    if(enemyIconEl) enemyIconEl.innerText = enemy.data.icon;

    // 👹 敵の説明ON時、戦闘/エリート戦開始時に敵の特徴を表示する
    if (typeof updateEnemyExplanationDisplay === "function") {
        updateEnemyExplanationDisplay();
    }

    player.block = 0;
    inBattle = true;
    if((player.fields.def_up || 0) > 0) {
        player.block = player.fields.def_up * 2 ;
    }

    applyEnemyTurnStartTraits();

    if (typeof decideEnemyNextStyle === 'function') {
        decideEnemyNextStyle();
    }

    discardPile.push(...hand);
    hand = [];
console.log(enemy.status);
console.log(enemy.status.traits);



    if (enemy.data && enemy.data.name === "Undoll") {
        const slot = window.currentSlot || 0;
        if (!window.savedDecks[slot]) window.savedDecks[slot] = {};
        window.savedDecks[slot][0] = (window.savedDecks[slot][0] || 0) + 15;
    }

    if (enemy.data && enemy.data.name === "Reaper") {
        const slot = window.currentSlot || 0;
        if (!window.savedDecks[slot]) window.savedDecks[slot] = {};
        window.savedDecks[slot][0] = (window.savedDecks[slot][0] || 0) + 5;
    }

    // 👁️‍🗨️ Sight: 呪いカードを5枚デッキに追加する（Reaper/Undollと違い、倒しても削除されず残り続ける）
    if (enemy.data && enemy.data.name === "Sight") {
        const slot = window.currentSlot || 0;
        if (!window.savedDecks[slot]) window.savedDecks[slot] = {};
        window.savedDecks[slot][0] = (window.savedDecks[slot][0] || 0) + 5;
    }

    // 🌕 Luna: 呪いカードを5枚デッキに追加する（倒した時に5枚だけ削除される）
    if (enemy.data && enemy.data.name === "Luna") {
        const slot = window.currentSlot || 0;
        if (!window.savedDecks[slot]) window.savedDecks[slot] = {};
        window.savedDecks[slot][0] = (window.savedDecks[slot][0] || 0) + 5;
    }

    if (typeof initBattleDeck === 'function') {
        initBattleDeck();
    }
    
    if(typeof drawHand === 'function') drawHand();

    // 🦇 Bat: 1ターン目から過労を付与し、手札からランダムに2枚捨て札へ送る
    if (typeof applyBatTurnEffect === 'function') applyBatTurnEffect();

    // 👁️‍🗨️ Sight: 1ターン目から過労を付与する
    if (typeof applySightTurnEffect === 'function') applySightTurnEffect();

    // 🌕 Luna: 1ターン目から自己回復（または忘却判定）を行う
    if (typeof applyLunaTurnEffect === 'function') applyLunaTurnEffect();

    // 🎭 Puppeteer: 戦闘開始時に手札の1枚を「操られ」状態にする
    if (typeof applyPuppeteerBattleStart === 'function') applyPuppeteerBattleStart();

    if(typeof renderHand === 'function') renderHand();
    if(typeof updateUI === 'function') updateUI();
}


function playCard(index){
    if(!inBattle) return;

    if (window.discardSelectMode && window.discardSelectMode.active) {
        const mode = window.discardSelectMode;

        // 初回選択時に「選択可能な上限枚数」を確定させておく（以後の手札減少で変動させない）
        if (mode.maxSelectable === undefined) {
            mode.maxSelectable = Math.min(mode.requiredCount, hand.length - 1);
        }

        // ★クリックした瞬間にそのカードを手札から取り除く
        const discardedCard = hand[index];

        if (mode.exile) {
            // 🗑️ カード削除：捨て札に送らず、セーブデータのデッキから永久に1枚減らす
            hand.splice(index, 1);
            const slot = window.currentSlot || 0;
            if (window.savedDecks[slot] && window.savedDecks[slot][discardedCard.id] > 0) {
                window.savedDecks[slot][discardedCard.id]--;
                if (window.savedDecks[slot][discardedCard.id] <= 0) {
                    delete window.savedDecks[slot][discardedCard.id];
                }
                localStorage.setItem("mini_spire_saved_decks", JSON.stringify(window.savedDecks));
            }
        } else {
            if (typeof discardPile !== 'undefined') discardPile.push(discardedCard);
            hand.splice(index, 1);
        }
        mode.selectedIndices.push(index);

        // ★即座に手札表示を更新（選んだカードがその場で消える）
        if (typeof renderHand === 'function') renderHand();

        // 必要枚数（選択可能な上限）に達したら処理を実行
        if (mode.selectedIndices.length >= mode.maxSelectable) {
            // その後、b枚引く
            for (let i = 0; i < mode.drawCount; i++) {
                if (typeof drawOneCard === 'function') drawOneCard();
            }

            // 💖 手札を捨てて回復するカード用：回復を適用
            if (mode.healAmount) {
                player.hp = Math.min(player.maxHp, player.hp + mode.healAmount);
                customAlert(`💖 ${mode.healAmount} 回復した！`);
            }

            // 🗑️ カード削除用の完了メッセージ
            if (mode.exile) {
                customAlert(`🗑️ カードをデッキから削除した！`);
            }

            // 選択モードを終了（初期化）
            window.discardSelectMode = { active: false };

            // UIを更新して戦闘を通常に戻す
            if (typeof renderHand === 'function') renderHand();
            if (typeof updateUI === 'function') updateUI();
        } else {
            customAlert(`選択しました。あと ${mode.maxSelectable - mode.selectedIndices.length} 枚選んでください。`);
        }
        return; // 選択モード中の時は、通常の「カード使用処理」を走らせずにここで終了する
    }

    const card = hand[index];

    // 💡【追加】状態異常「未熟」のコスト計算処理
    // 未熟状態（プレイヤーのstatus.immaturityが0より大きい場合）はカード本来のコストに+1する
    let actualCost = card.cost;
    if (player.status && player.status.immaturity > 0) {
        actualCost += 1;
    }

    //マギカ
    if (enemy.data && enemy.data.name === "Magica") {
        const currentCardCat = card.cat || card.category; 

        if (window.witchBannedCategory && currentCardCat === window.witchBannedCategory) {
            const catNames = { atk: "攻撃", blk: "ブロック", rec: "回復", abn: "状態異常" };
            const displayName = catNames[currentCardCat] || currentCardCat;
            
            customAlert(`🔮 マギカの呪い！【${displayName}】系のカードは使用できません！`);
            if (typeof renderHand === 'function') renderHand();
            return; 
        }
    }

    // フェンリル特性 (未熟の加算前・加算後のどちらのコストで判定するかにより actualCost か card.cost を選べます。ここでは元のコストで判定)
    if(enemy.data && enemy.data.name === "Fenrir"){
        if(card.cost % 2 === 0){
            customAlert("🐺 フェンリルの特性：コストが偶数のカードは使えない！");
            if(typeof renderHand === 'function') renderHand();
            return;
        }
    }

    //魔女
    if (enemy.data && enemy.data.name === "Witch") {
        const currentCardCat = card.cat || card.category; 

        if (window.witchBannedCategory && currentCardCat === window.witchBannedCategory) {
            const catNames = { atk: "攻撃", blk: "ブロック", rec: "回復", abn: "状態異常" };
            const displayName = catNames[currentCardCat] || currentCardCat;
            
            customAlert(`🧙‍♂️ 魔女の呪い！【${displayName}】系のカードは使用できません！`);
            if (typeof renderHand === 'function') renderHand();
            return; 
        }
    }

    // 💡【修正】カード本来のコスト(card.cost)ではなく、計算された実際のコスト(actualCost)でエネルギーチェック
    if(player.energy < actualCost) return;

    //シャドウの使用カード枚数の確認
    if (enemy.data && enemy.data.name === "Shadow") {
        window.shadowCardCountThisTurn = (window.shadowCardCountThisTurn || 0) + 1;
        if (window.shadowCardCountThisTurn % 5 === 0) {
            enemy.attack += 3;
        }
    }

    //ブーストの使用カード枚数の確認
    if (enemy.data && enemy.data.name === "Boost") {
        window.shadowCardCountThisTurn = (window.shadowCardCountThisTurn || 0) + 1;
        if (window.shadowCardCountThisTurn % 1 === 0) {
            enemy.attack += 1;
        }
    }

    // 💡【修正】減算するエネルギーも実際のコスト(actualCost)に変更
    player.energy -= actualCost;

    // 🔊 カード使用SE
    if (typeof playSE === 'function') playSE('click');

    // 🃏 このターンに使用したカード枚数（id:1515「1ターン目の初手なら3枚ドロー」等で使用）
    window.cardsPlayedThisTurn = (window.cardsPlayedThisTurn || 0) + 1;
    
    let shouldCopy = false;
    
    // コピーの条件判定（type が nextCopy 以外の通常カードならコピーを実行）
    if (window.nextCardCopyActive) {
        if (card.type !== "nextCopy") {
            shouldCopy = true;
            window.nextCardCopyActive = false; // ここでフラグを消費
        }
    }

    // 🎭 Puppeteer：操られたカードを使うと、カードの効果に加えて敵が回復する
    if (card.puppeted && enemy.data && enemy.data.name === "Puppeteer") {
        const healAmount = Math.floor(enemy.maxHp * 0.15);
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
        if (typeof truncateToOneDecimal === 'function') enemy.hp = truncateToOneDecimal(enemy.hp);
        card.puppeted = false;
        customAlert(`🎭 操られたカードだ…！敵が ${healAmount} 回復した！`);
    }

        // 効果発動
        executeCardEffect(card, index);
    

    // 📉 過労：状態が有効な間、カードを1枚使うたびに2ダメージを受ける
    if (player.status.fatigue > 0 && inBattle) {
        player.hp -= 2;
        if (typeof createDamagePopup === 'function') createDamagePopup(2, false);
        if (player.hp <= 0) {
            player.hp = 0;
            if(typeof renderHand === 'function') renderHand();
            if(typeof updateUI === 'function') updateUI();
            gameover();
            return;
        }
    }

    // コピー処理（手札の末尾に追加）
    if (shouldCopy && inBattle) {
        if (typeof copyCard === 'function') {
            const duplicatedCard = copyCard(card);
            hand.push(duplicatedCard);
        } else {
            const duplicatedCard = Object.assign({}, card);
            hand.push(duplicatedCard);
        }
    }

    // 手札から削除
    if (card.type === "handSacrifice") {
        discardPile.push(card);
        hand = [];
    } else if (card.type === "purifyCurse") {
        // 浄化：効果内で手札の呪いカードを除去し配列が再構築されているため、
        // 参照でこのカード自身の位置を探して除去する（捨て札には送らず完全に除去）
        const selfIndex = hand.indexOf(card);
        if (selfIndex !== -1) hand.splice(selfIndex, 1);
    } else {
        // タイムループ中なら捨て札へ送らない
        if (player.status.timeLoop > 0 && card.type !== "timeLoop" && card.cost !==0 ) {
            // 何もしない（手札に残す）
        } else {
            discardPile.push(card);
            // 💡 index はexecuteCardEffect呼び出し前の位置。効果内で手札配列が
            // 変化する場合（Tempestの手札シャッフル等）があるため、参照で位置を再検索する
            const selfIndex = hand.indexOf(card);
            if (selfIndex !== -1) {
                hand.splice(selfIndex, 1);
            } else if (hand[index] === card) {
                hand.splice(index, 1);
            }
        }

    }

    if(typeof renderHand === 'function') renderHand();
    if(typeof updateUI === 'function') updateUI();

    if(enemy.hp <= 0){
        if (!tryPhoenixRevive()) {
            victory();
        }
    }
}


function endTurn(){
    if(!inBattle) return;

    window.nextCardCopyActive = false;


// エリアによる毎ターンのプレイヤーへの影響 ---
    if (window.currentArea === "rain") {
        player.hp = Math.min(player.maxHp, player.hp + 2);
    } else if (window.currentArea === "sunny") {
        player.hp -= 2;
        if (player.hp < 1) {
            gameover();
            return;
        }
    }



    if (enemy.data && enemy.data.name === "Shadow") {
        window.shadowCardCountThisTurn = 0;
    }

    const endTurnBtn = document.getElementById("endTurnBtn");
    if(endTurnBtn) endTurnBtn.disabled = true;

    let extraDrawCount = 0;
    const surplusEnergy = player.energy;
    if (surplusEnergy > 0) {
        for (let i = 0; i < surplusEnergy; i++) { if (Math.random() < 0.5) extraDrawCount++; }
    }






//トレイト
if(enemy.data.name==="Trait"){

    enemy.status.traits.forEach(trait=>{

        switch(trait){

            case "atkUp":
                enemy.attack= enemy.attack*1.1;
                break;

            case "heal":
                enemy.hp=Math.min(enemy.maxHp,enemy.hp+5);
                break;

            case "leak":
                player.status.leak=2;
                customAlert("漏電を受けた！");
                break;

            case "amnesia":
                player.status.amnesia=2;
                customAlert("忘却を受けた！");
                break;

            case "immaturity":
                player.status.immaturity=2;
                customAlert("未熟を受けた！");
                break;

            case "fixedDamage":
                const dmg=Math.ceil(player.maxHp*0.02);
                player.hp=Math.max(0,player.hp-dmg);
                customAlert(`固定ダメージ ${dmg}`);
                break;
        }

    });

}





    if (player.status && player.status.leak > 0) {
        if (surplusEnergy > 0) {
            let leakDamage = surplusEnergy * 2 * player.status.leak;
            
            // 🧤 耐電状態ならダメージを半分にする
            if (player.status.leakBlockTurns > 0) {
                leakDamage = Math.floor(leakDamage / 2);
                customAlert(`🧤 耐電効果！ 漏電ダメージが半減します。`);
            }
            
            player.hp -= leakDamage;
            if (player.hp < 0) player.hp = 0;
            
            customAlert(`🔋 漏電により${leakDamage} ダメージを受けた！`);
        }
        player.status.leak--;
    }

    // 耐電の持続ターンを減少させる
    if (player.status.leakBlockTurns > 0) {
        player.status.leakBlockTurns--;
    }

    //タイムループ(処理はfunction playcard)
    player.status.timeLoop = 0;


    //忘却
    if (player.status.amnesia > 0) {
        player.status.amnesia--;
    }

    //コンボ増加
    if (player.status.comboPlusTurns > 0) {
        player.status.comboPlusTurns--;
        
        if (player.status.comboPlusTurns === 0) {
            player.status.comboPlusBonus = 0;
        }
    }

    // アドレナリン(各攻撃+n)は1ターン限りのため
    player.status.adrenalineAtk = 0;

    // 敵のカモフラージュ(行動変動)の持続ターンを1減らす
    if (enemy.status.camouflageTurns > 0) {
        enemy.status.camouflageTurns--;
        if (enemy.status.camouflageTurns === 0) {
            customAlert("🍃 行動変動の効果が切れた！");
        }
    }

    discardPile.push(...hand);
    hand = [];

    // 毒の処理
    if (!(typeof isEnemyImmuneToStatusEffects === 'function' && isEnemyImmuneToStatusEffects()) && enemy.status.poisonList && enemy.status.poisonList.length > 0) {
        let newPoisonTotal = 0;
        let oldPoisons = enemy.status.poisonList.filter(p => !p.isNew);
        let newPoisons = enemy.status.poisonList.filter(p => p.isNew);
        
        if (newPoisons.length > 0) {
            newPoisons.forEach(p => newPoisonTotal += p.value);
            oldPoisons.push({ value: newPoisonTotal, duration: 3, isNew: false });
        }

        let totalPoisonDmg = 0;
        oldPoisons.forEach(p => { totalPoisonDmg += p.value; });
        if (totalPoisonDmg > 0) { damageEnemy(totalPoisonDmg, true); }

        oldPoisons.forEach(p => {
            p.value--;
            p.duration--;
        });

        enemy.status.poisonList = oldPoisons.filter(p => p.value > 0 && p.duration > 0);
        enemy.status.poisonList.forEach(p => p.isNew = false);
    }

// 火傷の処理
    if (enemy.status.burn > 0) { 
        if (window.currentArea === "rain") {
            enemy.status.burn = 0; // 雨で火傷が消える
        } 
        else {
            // 大火傷フィールドを持っていれば10ダメージ、なければ5ダメージ
            let burnDamage = (player.fields.heavy_burn || 0) > 0 ? 10 : 5;
            let isSunny = (window.currentArea === "sunny");
            
            if (isSunny) {
                burnDamage *= 2; // 日照りならダメージ2倍
            }
            
            damageEnemy(burnDamage, true); 

            // 🦎 Salamander：火傷ダメージを受けるたびに攻撃力が1.25倍になる（上限はBull等と同様の式）
            if (enemy.data && enemy.data.name === "Salamander") {
                enemy.attack = Math.min(Math.floor(enemy.attack * 1.25), Math.floor((5 + floor * 2.25) * 2));
            }

            enemy.status.burn--; 
        }
    }

    // プレイヤーのその他状態異常の残りターン減少
    if (player.status.immaturity > 0) player.status.immaturity--;
    if (player.status.fatigue > 0) player.status.fatigue--;
    if (player.status.meditation > 0) player.status.meditation--;

    if(player.status.healTurns > 0){
        player.status.healTurns--;
        if(player.status.healTurns === 0) player.status.heal = 0;
    }

    // 敵の死亡チェック（スリップダメージ等によるもの）
    if(enemy.hp <= 0){
        if (!tryPhoenixRevive()) {
            if(endTurnBtn) endTurnBtn.disabled = false;
            victory();
            return;
        }
    }

    // ドラゴンの特殊能力
    if (enemy.data && enemy.data.name === "Dragon") {
        if (Math.random() < (1 / 4)) {
            enemy.status.poisonList = []; 
            enemy.status.burn = 0;
            enemy.status.freeze = 0;
            enemy.status.stun = 0;
        }
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + 10);

        if (Math.random() < (1 / 3)) {
            enemy.hp = Math.min(enemy.maxHp, enemy.hp + 10);
        }
	if(Math.random() < 0.33){
        // 未熟の持続ターン数を設定（例として1ターン付与、あるいは仕様に合わせたターン数）
        player.status.immaturity = (player.status.immaturity || 0) + 1;
	}
    }

    // ▼ ゾンビの特殊能力（ターン終了時に回復）
    if (enemy.data && enemy.data.name === "Zombie") {
        let healAmount = Math.floor(window.zombieDamageTakenThisTurn / 3) + Math.floor(enemy.maxHp / 20);
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
        window.zombieDamageTakenThisTurn = 0; // カウンタをリセット
        if(typeof updateUI === 'function') updateUI();
    }

    // ▼ 盗賊の逃走判定（最初のターン以外で8%の確率）
    if (enemy.data && enemy.data.name === "Thief") {
        if (!window.isFirstTurn && Math.random() < 0.08) {
            customAlert("🏴‍☠️ 盗賊は素早く逃げ出した！戦闘が強制終了します。");
            inBattle = false;
            if(endTurnBtn) endTurnBtn.disabled = false;
            if(typeof openMap === 'function') openMap(); // マップに戻る
            return;
        }
        window.isFirstTurn = false; // 初ターン終了したのでフラグを折る
    }

        // ロボットの特殊能力：漏電を付与
    if (enemy.data && enemy.data.name === "Robot" && enemy.hp > 0) {
        player.status.leak = 1;
    }

    // アンドールの特殊能力：1/3の確率でターンの終わりに状態異常の「未熟」を付与
    if (enemy.data && enemy.data.name === "Undoll" && enemy.hp > 0) {
	    if(Math.random() < 0.33)
        // 未熟の持続ターン数を設定（例として1ターン付与、あるいは仕様に合わせたターン数）
        player.status.immaturity = (player.status.immaturity || 0) + 1;
    }

        //グリーディ10%でデッキからランダムにカードを奪う
if (enemy.data && enemy.data.name === "Greedy") {
    if (Math.random() < 0.15) {

        const currentDeck = savedDecks[currentSlot] || {};

        // デッキに存在するカードIDだけ取得
        const cardIds = Object.keys(currentDeck).filter(id => currentDeck[id] > 0);

        if (cardIds.length > 0) {

            // ランダムなカードIDを選択
            const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];

            // カード情報取得
            const stolenCard = allCardsMaster.find(c => c.id == randomId);

            // 万一マスターデータに存在しないIDだった場合は、
            // エラーで処理が止まらないよう安全に諦める（ターン進行を優先）
            if (!stolenCard) {
                console.warn('Greedy: allCardsMasterに存在しないカードIDが選ばれたためスキップしました:', randomId);
            } else {
                // 1枚減らす
                currentDeck[randomId]--;

                // 0枚になったら削除
                if (currentDeck[randomId] <= 0) {
                    delete currentDeck[randomId];
                }
                // セーブ
                localStorage.setItem(
                    "mini_spire_saved_decks",
                    JSON.stringify(savedDecks)
                );

                if (typeof customAlert === 'function') {
                    customAlert(`🦹 Greedyに\n「${stolenCard.name}\n${stolenCard.desc}」\nを奪われた！`);
                } else {
                    alert(`Greedyに\n「${stolenCard.name}\n${stolenCard.desc}」\nを奪われた！`);
                }
            }
        }
    }
}


    // 魔女
    if (enemy.data && enemy.data.name === "Witch" && enemy.hp > 0) {
        if (Math.random() < (1 / 2)) {
            player.status.amnesia = 1;
            if (typeof renderHand === 'function') renderHand(); // 手札を即座に「？」に更新
        }

        if (window.banImmunityTurns > 0) {
            // 禁止解除カードの効果中は再禁止されない
            window.witchBannedCategory = null;
            window.banImmunityTurns--;
            customAlert(`✨ 禁止解除の効果で、魔女の呪いを無効化した！（残り${window.banImmunityTurns}ターン）`);
        } else {
            const categories = ["atk", "blk", "rec", "abn"];
            window.witchBannedCategory = categories[Math.floor(Math.random() * categories.length)];

            const catNames = { atk: "攻撃", blk: "ブロック", rec: "回復", abn: "状態異常" };
            customAlert(`🧙‍♂️次ターンは【${catNames[window.witchBannedCategory] }】系のカードが使用禁止！`);
        }
    } else if (!enemy.data || (enemy.data.name !== "Witch" && enemy.data.name !== "Magica") || enemy.hp <= 0) {
        // 魔女がいない、または倒された時は禁止を解除
        window.witchBannedCategory = null;
    }

    //マギカ
    if (enemy.data && enemy.data.name === "Magica" && enemy.hp > 0) {
	if(Math.random() < 0.33){
        // 未熟の持続ターン数を設定（例として1ターン付与、あるいは仕様に合わせたターン数）
        player.status.immaturity = (player.status.immaturity || 0) + 1;
	}
        player.status.leak = 1;

        if (window.banImmunityTurns > 0) {
            // 禁止解除カードの効果中は再禁止されない
            window.witchBannedCategory = null;
            window.banImmunityTurns--;
            customAlert(`✨ 禁止解除の効果で、マギカの呪いを無効化した！（残り${window.banImmunityTurns}ターン）`);
        } else {
            const categories = ["atk", "blk", "rec", "abn"];
            window.witchBannedCategory = categories[Math.floor(Math.random() * categories.length)];

            const catNames = { atk: "攻撃", blk: "ブロック", rec: "回復", abn: "状態異常" };
            customAlert(`🔮次ターンは【${catNames[window.witchBannedCategory] }】系のカードが使用禁止！`);
        }
    } else if (!enemy.data || (enemy.data.name !== "Witch" && enemy.data.name !== "Magica") || enemy.hp <= 0) {
        window.witchBannedCategory = null;
    }

    //ブースト
    if (enemy.data && enemy.data.name === "Magica" && enemy.hp > 0) {
	if(Math.random() < 0.33){
        // 未熟の持続ターン数を設定（例として1ターン付与、あるいは仕様に合わせたターン数）
        player.status.immaturity = (player.status.immaturity || 0) + 1;
	}
    }


    // スタンの判定
    let isStunned = false;
    if (enemy.status.stun > 0 && enemy.data.name !== "Dragon") {
        enemy.status.stun--; 
        if (Math.random() < (1 / 4)) {
            customAlert("敵がスタンした!");
            isStunned = true;
        }
    }

    // 【修正】スタンしていない場合のみ敵が行動する
    if (!isStunned) {
        const logArea = document.getElementById("centerBattleLog");
        let logText = "";
        
        // ▼ ピエロのランダム2回行動
        if (enemy.data && enemy.data.name === "Clown") {
            for (let act = 1; act <= 2; act++) {
                let rng = Math.random();
                
                if (rng < 1/20) { // 5%
                    const healAmount = Math.floor(player.maxHp * 0.20);
                    player.hp = Math.min(player.maxHp, player.hp + healAmount);
                    customAlert(`🤡 ピエロの行動 ${act}:プレイヤーのHPが ${healAmount} 回復！`);
                } else if (rng < 2/20) { // 5%
                    const dmgAmount = Math.floor(player.maxHp * 0.20);
                    player.hp = Math.max(0, player.hp - dmgAmount);
                    customAlert(`🤡 ピエロの行動 ${act}:大惨事！プレイヤーに ${dmgAmount} ダメージ！`);
                } else if (rng < 8/20) { // 30%
                    const dmgAmount = Math.floor(player.maxHp * 0.10);
                    player.hp = Math.max(0, player.hp - dmgAmount);
                    customAlert(`🤡 ピエロの行動 ${act}:プレイヤーに ${dmgAmount} ダメージ！`);
                } else if (rng < 11/20) { // 15%
                    customAlert(`🤡 ピエロの行動 ${act}:ピエロはお手玉をしている。何も起こらない。`);
                } else if (rng < 16/20) { // 25%
                    window.clownEnergyDebuff = true; 
                    //customAlert(`🤡 ピエロの行動 ${act}:次のターンの魔力が吸い取られる予感がする…`);
                } else if (rng < 17/20) { // 5%
                    const clownDmg = Math.floor(enemy.maxHp * 0.20);
                    enemy.hp = Math.max(0, enemy.hp - clownDmg);
                    customAlert(`🤡 ピエロの行動 ${act}: ピエロは自分でずっこけた！ピエロに ${clownDmg} ダメージ！`);
                } else { // 15%
                    enemy.status.poisonList = [];
                    enemy.status.burn = 0;
                    enemy.status.freeze = 0;
                    enemy.status.stun = 0;
                    customAlert(`🤡 ピエロの行動 ${act}: ピエロのすべての状態異常が回復した！`);
                }

                if(typeof updateUI === 'function') updateUI();
                
                if(enemy.hp <= 0) { 
                    enemy.hp = 0; 
                    if (!tryPhoenixRevive()) {
                        if(endTurnBtn) endTurnBtn.disabled = false; 
                        victory(); 
                        return; 
                    }
                }
                if(player.hp <= 0) { player.hp = 0; break; }
            }

            if (logArea) logArea.innerHTML = logText;

            if(typeof updateUI === 'function') updateUI();
        } else {
            // 通常の敵の行動（行動スタイルの反映 ＆ 10%裏切り）
            let finalStyleKey = enemy.nextStyleKey || "balance";
            // 🔮 攻撃予知が有効な間は、敵が型を偽ること（裏切り）ができない
            const isBetray = (enemy.status.predictTurns > 0) ? false : Math.random() < 0.10;

            if (isBetray && window.aiStyles) {
                const alternativeKeys = Object.keys(window.aiStyles).filter(k => k !== finalStyleKey);
                finalStyleKey = alternativeKeys[Math.floor(Math.random() * alternativeKeys.length)];
                logText += `<div style="color:#ff4141; font-weight:bold; font-size:16px;">⚠️ 敵が裏をかいてきた！</div>`;
            }

            const styleInfo = window.aiStyles ? window.aiStyles[finalStyleKey] : { name: "バランスを重視している", atkRate: 1.0, blkRate: 1.0 };
            logText += `<div style="color:#fff; font-weight:bold;">敵の行動: ${styleInfo.name}</div>`;

            // 🔮 攻撃予知の効果はここで消費する（1ターンのみ有効）
            if (enemy.status.predictTurns > 0) {
                enemy.status.predictTurns--;
            }


            // 防御値（ブロック）計算
            let baseBlock = Math.floor(Math.random() * 5) + 3;
            let gainBlock = Math.floor(baseBlock * styleInfo.blkRate * (enemy.data ? enemy.data.blockRate : 1.0));
            
            // 攻撃値（ダメージ）計算
            let damage = enemy.attack;

            // ❄️ 絶対零度と凍結は重ね掛けしない（絶対零度が優先。元の攻撃力から直接50%にする）
            if (enemy.status.absoluteZeroTurns > 0) {
                damage = Math.floor(damage * 0.5);
                enemy.status.absoluteZeroTurns--;
                if (enemy.status.freeze > 0) enemy.status.freeze--; // 凍結ターンは消費するが倍率には重ねない
                logText += `<div style="color:#66d9ff; font-weight:bold;">❄️ 絶対零度の効果で攻撃力が半減している！</div>`;
            } else if(enemy.status.freeze > 0){ 
                damage = Math.floor(damage * 2 / 3); 
                enemy.status.freeze--;
            }
            damage = Math.floor(damage * styleInfo.atkRate);

            if(enemy.data && enemy.data.name === "Beast"){
                if(!window.beastDamagedThisTurn){ damage *= 2; logText += `<div style="color:#ff4141;">🦁 獣が怒り狂って攻撃力2倍！</div>`; }
                window.beastDamagedThisTurn = false;
            }

            // 🐗 オークのピンチ時特殊能力（HP50%以下で攻撃・防御2倍）
            if (enemy.data && enemy.data.name === "Ork" && enemy.hp <= (enemy.maxHp * 0.5)) {
                gainBlock = Math.floor(gainBlock * 2);
                damage = Math.floor(damage * 2);
                logText += `<div style="color:#ff9f43; font-weight:bold;">🐗 逆境補正で攻撃・防御2倍！</div>`;
            }

	    //アサシン 2ターンに1回攻撃
	    if (enemy.data && enemy.data.name === "Assassin" && window.battleTurnCount % 2 == 1) {
		damage = 0
            }

            // 防御（ブロック）の適用
            if (gainBlock > 0) {
                if (enemy.status && enemy.status.burn > 0) { gainBlock = Math.floor(gainBlock / 2); }
                enemy.block += gainBlock;
                logText += `<div style="color:#4caf50;">敵の防御: 🛡️ ${gainBlock} ブロック獲得</div>`;
            }

            logText += `<div style="color:#e43f5a;">敵の攻撃: ⚔️ ${damage} ダメージ</div>`;

            // プレイヤーへのダメージ適用
            let hpBeforeHit = player.hp;
            if (damage > 0) {
                let finalDamage = damage; 
                const isGunner = enemy.data && enemy.data.name === "Gunner";

                if (isGunner && player.block >= finalDamage) {
                    // 🔫 Gunner：防御で完全に防がれた時、ダメージを1.5倍にしてから防御を差し引く
                    const boostedDamage = Math.floor(finalDamage * 1.5);
                    const blocked = Math.min(player.block, boostedDamage);
                    finalDamage = Math.max(0, boostedDamage - blocked);
                    player.block -= blocked;
                    if (finalDamage > 0) {
                        logText += `<div style="color:#ff4141; font-weight:bold;">🔫 Gunnerが防御の隙を撃ち抜いた！ダメージ1.5倍！</div>`;
                    }
                } else if (player.block > 0) {
                    const blocked = Math.min(player.block, finalDamage);
                    finalDamage -= blocked; 
                    player.block -= blocked;
                }
                player.hp -= finalDamage;

                if (player.status.counterTurns > 0 && finalDamage > 0) {
                    let reflectDamage = Math.floor(finalDamage);
                    if (reflectDamage > 0) {
                        enemy.hp -= reflectDamage * 1.5;
                        if (enemy.hp < 0) enemy.hp = 0;
                        if (typeof truncateToOneDecimal === 'function') enemy.hp = truncateToOneDecimal(enemy.hp);
                        customAlert(`👊 カウンター発動！ 敵に ${reflectDamage} の反射ダメージ！`);
                        if (typeof createDamagePopup === 'function') createDamagePopup(reflectDamage, true);
                
                        if (enemy.hp <= 0) {
                            if (!tryPhoenixRevive()) {
                                const endTurnBtn = document.getElementById("endTurnBtn");
                                if (endTurnBtn) endTurnBtn.disabled = false;
                                victory();
                                return; 
                            }
                        }
                    }
                }
                if(player.status.counterTurns > 0){
                    player.status.counterTurns -= 1;
                }
            }

            //死神の特殊能力
            if(enemy.data && enemy.data.name === "Reaper"){
                if (player.hp <= player.maxHp * 0.2) {
                    player.hp = 0;
                    customAlert("🩻死神の鎌によって魂を刈り取られた…");
                    gameover();
                    return;
                }
            }

            //ブーストの特殊能力
            if(enemy.data && enemy.data.name === "Boost"){
                enemy.attack = Math.min(Math.floor(enemy.attack * 1.1), Math.floor((5 + floor * 2) * 2));
            }

            //ブルの特殊能力
            if(enemy.data && enemy.data.name === "Bull"){
                enemy.attack = Math.min(Math.floor(enemy.attack * 1.1), Math.floor((5 + floor * 2.25) * 2));
            }
            if(player.hp < 0) player.hp = 0;
            
            //盗賊の特殊能力
            if (enemy.data && enemy.data.name === "Thief" && player.hp < hpBeforeHit) {
                let stealAmount = Math.min(player.gold, 50);
                player.gold -= stealAmount; 
                window.thiefStolenGold += stealAmount;
                if (stealAmount > 0) { logText += `<div style="color:#ffb423;">🏴‍☠️ 盗賊に ${stealAmount}G 奪われた！</div>`; }
            }

            if (logArea) logArea.innerHTML = logText;
        }

        // プレイヤーの死亡判定
        if(player.hp <= 0){
            gameover();
            return;
        }
    } else {
        // スタンしていた場合、フリーズのカウントだけを進める処理
        if(enemy.status.freeze > 0) enemy.status.freeze--;
    }

    // ─── ターン終了後の次ターン開始準備 ───
    player.block = 0;
    
    if (window.clownEnergyDebuff) {
        // 🤡 常に「元々の（クラウン効果を受ける前の）最大エネルギー」の半分にする。
        //    既に半分になっている値をさらに半分にしてしまうと連続でどんどん下がってしまうため、
        //    毎回 window.originalMaxEnergy（戦闘開始時点の基準値）を基準に計算し直す。
        const baseMaxEnergyForClown = (typeof window.originalMaxEnergy === 'number' && window.originalMaxEnergy > 0)
            ? window.originalMaxEnergy
            : player.maxEnergy;
        player.maxEnergy = Math.max(1, Math.floor(baseMaxEnergyForClown / 2));
        window.clownEnergyDebuff = false; 
        customAlert(`🤡 ピエロの魔力により、このターンの最大エネルギーが【${player.maxEnergy}】に制限された！`);
    } else {
        player.maxEnergy = 5 + Math.floor(floor / 2); 
	//霧エリアならエネルギー1.2倍
	if (window.currentArea === "fog") {
            player.maxEnergy = Math.floor(player.maxEnergy * 1.2);
        }
    }
    player.energy = player.maxEnergy;

    // ⚡ id:1514「次ターンにエネルギー+2」の予約分を消費
    if (player.status.nextTurnEnergyBonus > 0) {
        player.energy += player.status.nextTurnEnergyBonus;
        player.status.nextTurnEnergyBonus = 0;
    }

    // 🃏 このターンに使用したカード枚数をリセット
    window.cardsPlayedThisTurn = 0;
    
    if(player.status.healTurns > 0) player.hp = Math.min(player.maxHp, player.hp + player.status.heal);

    // 🛡️ ブロック持ち越し：前ターンに「〇ブロック持ち越し」カードを使っていれば、そのぶんのブロックを新たに付与
    if (player.status.carryBlockNext > 0) {
        player.block += player.status.carryBlockNext;
        player.status.carryBlockNext = 0;
    }

    if ((player.fields.def_up || 0) > 0 && player.block === 0) {
        player.block = player.fields.def_up * 2;
    }


    window.battleTurnCount++;
    applyEnemyTurnStartTraits();

    if (typeof decideEnemyNextStyle === 'function') {
        decideEnemyNextStyle();
    }

    let drawCount = 5; 
    if(player.fields.draw_up && Math.random() < (1 / 3)) drawCount = 6;
    drawCount += extraDrawCount; 
    if (drawCount > 10) drawCount = 10;

    for(let i = 0; i < drawCount; i++){ 
        if(typeof drawOneCard === 'function') drawOneCard(); 
    }

    // 🦇 Bat: 毎ターン過労を付与し、手札からランダムに2枚捨て札へ送る
    if (typeof applyBatTurnEffect === 'function') applyBatTurnEffect();

    // 👁️‍🗨️ Sight: 毎ターン過労を付与する
    if (typeof applySightTurnEffect === 'function') applySightTurnEffect();

    // 🌕 Luna: 毎ターン自己回復（または忘却判定）を行う
    if (typeof applyLunaTurnEffect === 'function') applyLunaTurnEffect();

    if(typeof renderHand === 'function') renderHand();
    if(typeof updateUI === 'function') updateUI();

    if(endTurnBtn) endTurnBtn.disabled = false;
}

function victory(){
    inBattle = false;
    window.witchBannedCategory = null;

    // スコア計算用：撃破した敵の数をカウント（エリートは+1.5、通常は+1）
    window.enemiesDefeatedCount = (window.enemiesDefeatedCount || 0) + (enemy.data && enemy.data.isElite ? 1.5 : 1);


    if (player.status) {
        player.status.immaturity = 0;      // 未熟 🔰
        player.status.leak = 0;            // 漏電 🔋
        player.status.leakBlockTurns = 0;  // 耐電🧤
        player.status.amnesia = 0;         // 忘却 ❓
        player.status.counterTurns = 0;    // カウンター 👊
        player.status.fatigue = 0;         // 過労 📉
        player.status.meditation = 0;      // 瞑想 🧘
        player.status.healTurns = 0;       // ヒール持続ターン 💖
	player.status.comboPlusTurns=0;   // コンボ増加
    }

    // 死神戦だった場合、勝利時に savedDecks から呪いを5枚削除する
    if (enemy.data && enemy.data.name === "Reaper") {
        removeReaperCursesFromSavedDecks();
    }

    //アンドール戦だった場合、勝利時に savedDecks から呪いを15枚削除する
    if (enemy.data && enemy.data.name === "Undoll") {
        removeReaperCursesFromSavedDecks();
    }

    // 🌕 Luna戦だった場合、勝利時に savedDecks から呪いを5枚だけ削除する（残り5枚は永続的に残る）
    if (enemy.data && enemy.data.name === "Luna") {
        removeReaperCursesFromSavedDecks();
    }

    let gainGold = getEnemyKillRewardGold();
    player.gold = (player.gold || 0) + gainGold;

    if (floor === 20) {
            resetDeckBattle();
            gameSave();
            return;
    
    }
    if (floor >= 40) {
        customAlert(`🎉 40階ボスを撃破！ゲームクリアです！\n最終所持金: ${player.gold}G`);
        resetDeckBattle();

    gameclear();

        return;
    }

    customAlert(`戦闘勝利！ 🎉\n💰 ${gainGold}G を獲得しました！（現在：${player.gold}G）`);

    const rewardTitle = document.getElementById("rewardTitle");
    if(rewardTitle) rewardTitle.innerText = "カードを1枚選択";

    const rewardScreen = document.getElementById("rewardScreen");
    if(rewardScreen) rewardScreen.style.display = "flex";

    const skipBtn = rewardScreen.querySelector("button[onclick*='skip']");
    if(skipBtn) {
        skipBtn.style.display = "block";
        skipBtn.innerText = "スキップ";
        skipBtn.onclick = function() {
            rewardScreen.style.display = "none";
            
            const currentDeck = savedDecks[currentSlot];
            let total = 0;
            for (let id in currentDeck) { total += currentDeck[id]; }

            if (total > 30 && typeof checkDeckOverflowAndManage === 'function') {
                checkDeckOverflowAndManage();
            } else {
                if(typeof openMap === 'function') openMap();
            }
        };
    }

    const rewardArea = document.getElementById("rewardCards");
    if(!rewardArea) return;

    rewardArea.innerHTML = "";
    const rewards = [randomCard(), randomCard(), randomCard(), randomCard(), randomCard()];

    rewards.forEach(card=>{
        const div = document.createElement("div");
        div.className = `card rewardCard ${card.rarity}`;
        div.innerHTML = `<h3>${card.name}</h3><p>Cost:${card.cost}</p><p>${card.desc}</p>`;
        div.onclick = () => takeReward(card);
        rewardArea.appendChild(div);
    });
}



function generateTraitTraits() {

    const firstPool = [
        "immuneNormal",
        "immuneStatus",
        "atkUp",
        "heal",
        "leak",
        "amnesia",
        "immaturity",
        "fixedDamage"
    ];

    const secondPool = [
        "atkUp",
        "heal",
        "leak",
        "amnesia",
        "immaturity",
        "fixedDamage"
    ];

    enemy.status.traits = [];
    enemy.status.immuneNormal = false;
    enemy.status.immuneStatus = false;

    // 1個目
    const first = firstPool[Math.floor(Math.random()*firstPool.length)];

    enemy.status.traits.push(first);

    if(first==="immuneNormal"){
        enemy.status.immuneNormal=true;
        return;
    }

    if(first==="immuneStatus"){
        enemy.status.immuneStatus=true;
        return;
    }

    // 2個目
    const remain = secondPool.filter(x=>x!==first);

    enemy.status.traits.push(
        remain[Math.floor(Math.random()*remain.length)]
    );
}







function takeReward(card){
    deck.push(copyCard(card));
    const currentDeck = savedDecks[currentSlot];
    currentDeck[card.id] = (currentDeck[card.id] || 0) + 1;

    const rewardScreen = document.getElementById("rewardScreen");
    if(rewardScreen) rewardScreen.style.display = "none";

    let total = 0;
    for (let id in currentDeck) { total += currentDeck[id]; }

    if (total > 30) {
        if(typeof checkDeckOverflowAndManage === 'function') {
            checkDeckOverflowAndManage();
        }
    } else {
        if(typeof openMap === 'function') openMap();
    }
}

function skipReward(){
    if(typeof openMap === 'function') openMap();
}

function resetDeckBattle(){ 
    deck.push(...hand);
    deck.push(...discardPile);
    hand = [];
    discardPile = [];
    deck.sort(()=>Math.random()-0.5);
}

function tryPhoenixRevive(){
    if(!enemy.data || enemy.data.name !== "Phoenix") return false;
    if(enemy.hp > 0) return false;

    if(Math.random() < (1 / window.phoenixReviveChance)){
        const healAmount = Math.floor(enemy.maxHp * 0.1);
        enemy.hp = healAmount;
        window.phoenixReviveChance += 0.5;
        customAlert(
            `🐦‍🔥 不死鳥が復活した！\n` +
            `HPを ${healAmount} 回復！\n` +
            `次回復活確率: 1/${window.phoenixReviveChance}`
        );
        if(typeof updateUI === 'function'){
            updateUI();
        }
        return true;
    }
    return false;
}

function toggleHandVisibility() {
    const handEl = document.getElementById("hand");
    if (!handEl) return;

    handEl.classList.toggle("hidden");

    const toggleBtn = document.getElementById("toggleHandBtn");
    if (toggleBtn) {
        if (handEl.classList.contains("hidden")) {
            toggleBtn.innerText = "手札OFF ❌";
            toggleBtn.style.background = "#333"; 
        } else {
            toggleBtn.innerText = "手札ON  👁️";
            toggleBtn.style.background = "#53354a"; 
        }
    }
}

function getPotionName(type) {
    if (type === "heal") return "回復ポーション ❤️‍🩹";
    if (type === "energy") return "エネルギーポーション ⚡";
    if (type === "block") return "防御ポーション 🛡️";
    if (type === "draw") return "ドローポーション 🎴";
    if (type === "acid") return "強酸ポーション 🧪";
    if (type === "vessel") return "器のポーション 🏺";
    return "ポーション";
}

function usePotion(slotIndex) {
    if (!inBattle) return;
    if (!window.playerPotions || window.playerPotions.length === 0) {
        customAlert("ポーションを持っていません！");
        return;
    }
    if (slotIndex === undefined || slotIndex === null || slotIndex < 0 || slotIndex >= window.playerPotions.length) {
        slotIndex = 0; // 指定がなければ先頭のポーションを使用
    }

    const type = window.playerPotions[slotIndex];
    window.playerPotions.splice(slotIndex, 1);

    // 🔊 ポーション使用SE
    if (typeof playSE === 'function') playSE('potion');

    if (type === "heal") {
        player.hp = Math.min(player.maxHp, player.hp + 15);
        customAlert("❤️‍🩹 回復ポーションを使用！プレイヤーのHPが 15 回復した。");
    } 
    else if (type === "energy") {
        player.energy += 2;
        customAlert("⚡ エネルギーポーションを使用！エネルギーが +2 された。");
    } 
    else if (type === "block") {
        player.block += 20;
        customAlert("🛡️ 防御ポーションを使用！シールドが 20 増加した。");
    } 
    else if (type === "draw") {
        customAlert("🎴 ドローポーションを使用！カードを 3 枚引く。");
        for (let i = 0; i < 3; i++) {
            if (typeof drawOneCard === 'function') drawOneCard();
        }
    }
    else if (type === "acid") {
        customAlert("🧪 強酸ポーションを使用！敵のブロックを 0 にして、毒5(5T) を付与。");
        enemy.block = 0;
        
        if (typeof canApplyPoisonToEnemy === 'function' ? canApplyPoisonToEnemy() : true) {
            enemy.status = enemy.status || {};
            enemy.status.poisonList = enemy.status.poisonList || [];
            enemy.status.poisonList.push({
                value: 5, // 固定値の毒5を付与
                duration: 5,
                isNew: true
            });
        }
    }
    else if (type === "vessel") {
        // 🏺 器のポーション：2回飲むとポーションスロットが1つ増える
        window.vesselDrinkCount = (window.vesselDrinkCount || 0) + 1;
        if (window.vesselDrinkCount >= 2) {
            window.maxPotionSlots = (window.maxPotionSlots || 1) + 1;
            customAlert(`🏺 器のポーションを2回飲み干した！ポーションスロットが1つ増えた！(現在:${window.maxPotionSlots}個)`);
        } else {
            customAlert(`🏺 器のポーションを飲んだ…あと${2 - window.vesselDrinkCount}回でスロットが増えそうだ。`);
        }
    }

    if (typeof renderHand === 'function') renderHand();
    if (typeof updateUI === 'function') updateUI();
}

function createDamagePopup(amount, isEnemy = true) {
    const popup = document.createElement("div");
    popup.className = "damage-popup";
    popup.innerText = typeof amount === 'number' ? `-${amount}` : amount; 
    
    const targetEl = isEnemy ? document.getElementById("enemySprite") : document.getElementById("playerSprite");
    
    if (targetEl) {
        const randomX = Math.floor(Math.random() * 60) - 30; 
        const randomY = Math.floor(Math.random() * 40) - 20;
        
        popup.style.position = "absolute";
        popup.style.left = `calc(50% + ${randomX}px)`;
        popup.style.top = `calc(30% + ${randomY}px)`;
        
        targetEl.style.position = "relative";
        targetEl.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 600);
    }
}

// spaceキーを押すことでターンを終了
window.addEventListener("keydown", function(event) {
    if (window.inBattle && event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
        if (event.key === " " || event.code === "Space") {
            event.preventDefault();
            
            const endTurnBtn = document.querySelector("button[onclick*='endTurn']");
            if (endTurnBtn && !endTurnBtn.disabled) {
                endTurnBtn.click();
            }
        }
    }
});

function gameSave(){


    document.getElementById("gameSaveEnemy").innerText = getEnemyDisplayName();
    document.getElementById("gameSaveFloor").innerText = floor;
    document.getElementById("gameSaveGold").innerText = player.gold;

    // 到達記録モーダル表示
    document.getElementById("gameSaveModal").style.display = "flex";


}

function continueFromGameSave(){
    const modal = document.getElementById("gameSaveModal");
    if (modal) modal.style.display = "none";

    // 通常のマップ選択画面へ進み、次の階層へ進めるようにする
    if (typeof openMap === 'function') openMap();
}

//スコア計算
function calculateScore() {
    const deckCount = deck.length;
    const hpPercent = player.maxHp > 0 ? Math.floor((player.hp / player.maxHp) * 100) : 0;
    const gold = player.gold || 0;
    const enemiesDefeated = window.enemiesDefeatedCount || 0;

    let score = (deckCount * 10) + (hpPercent * 2.5) + (gold * 0.25) + (enemiesDefeated * 10);

    if (floor >= 2)  score += 450;
    if (floor >= 20) score += 100;
    if (floor >= 40) score += 200;
    score = score - 805;
//スコアを1.1倍から0.9倍にする。
    score = ((Math.floor(Math.random() * (1100 - 900 + 1)) + 900)/1000) * score

    return Math.max(0, Math.floor(score));
}

function gameover() {

    if (enemy.data && enemy.data.name === "Reaper") {
        removeReaperCursesFromSavedDecks();
    }

    resetDeckBattle();

    inBattle = false;

    const endTurnBtn = document.getElementById("endTurnBtn");
    if (endTurnBtn) endTurnBtn.disabled = false;

    // モーダルへ情報を表示

    document.getElementById("gameOverEnemy").innerText = getEnemyDisplayName();
    document.getElementById("gameOverFloor").innerText = floor;
    document.getElementById("gameOverGold").innerText = player.gold;
    document.getElementById("gameOverScore").innerText = calculateScore();

    // ゲームオーバーモーダル表示
    document.getElementById("gameOverModal").style.display = "flex";
}

function gameclear(){

    document.getElementById("gameClearEnemy").innerText = getEnemyDisplayName();
    document.getElementById("gameClearFloor").innerText = floor;
    document.getElementById("gameClearGold").innerText = player.gold;
    document.getElementById("gameClearScore").innerText = calculateScore();

    // ゲームオーバーモーダル表示
    document.getElementById("gameClearModal").style.display = "flex";


}

function returnToTitle() {

    document.getElementById("gameOverModal").style.display = "none";

    document.getElementById("game").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";

    // 必要ならここで初期化
    location.reload();
}
// =========================================================================
// 🤖 オートバトル（簡易AIプレイ / 周回用）
// =========================================================================
// A + I キーの同時押しでオートバトルを開始し、開始後は何かキーを押すと停止する
window.autoBattleActive = window.autoBattleActive || false;
window.autoBattleTimer = window.autoBattleTimer || null;
window._autoBattleKeysDown = window._autoBattleKeysDown || {};

// 敵に状態異常を「付与」するタイプ一覧（immuneStatusの敵には使わない対象）
// ※buffHeal/adrenaline/counterSetup/leakblk/buffMeditation/timeLoopなど自分向けの効果は含めない
const AUTO_BATTLE_ENEMY_DEBUFF_TYPES = [
    "poisonOnly", "poisonAttack", "burnAttack", "poisonBurn",
    "freezeAttack", "stunAttack", "poisonpoison",
    "grantAbsoluteZero", "freezeThenAbsoluteZero"
];
// 毒・火傷など「status」フィールドが継続ダメージ量の目安になるタイプ（合計ダメージ見積り用）
const AUTO_BATTLE_DAMAGE_STATUS_TYPES = ["poisonOnly", "poisonAttack", "poisonBurn", "burnAttack"];
// 凍結を狙うカード（凍結単体 or 超絶対零度）
const AUTO_BATTLE_FREEZE_TYPES = ["freezeAttack", "freezeThenAbsoluteZero"];
// 毒を付与するタイプ／火傷を付与するタイプ（個別耐性チェック用）
const AUTO_BATTLE_POISON_TYPES = ["poisonOnly", "poisonAttack", "poisonBurn", "poisonpoison"];
const AUTO_BATTLE_BURN_TYPES = ["burnAttack", "poisonBurn"];
// 回復系タイプ（catがrecでないbuffHealも含める）
const AUTO_BATTLE_HEAL_TYPES = ["heal", "healBlock", "hpminheal", "buffHeal"];

// そのカードをオートバトルで使って良いか（呪い・耐性・凍結前提・HP/ブロック状況などのルールチェック）
function isAutoBattleCardAllowed(card) {
    if (!card) return false;

    // 🚫 呪いカードは使わない
    if (card.type === "curse" || card.cat === "Curse") return false;

    const data = (enemy && enemy.data) || {};
    const hpRatio = player.maxHp > 0 ? player.hp / player.maxHp : 1;

    // 🚫 HPが95%以上の時は回復系カードを使わない
    if (hpRatio >= 0.95 && (card.cat === "rec" || AUTO_BATTLE_HEAL_TYPES.includes(card.type))) return false;

    // 🚫 自分のブロックが既に敵の攻撃力を上回っているなら、防御系カードを使わない
    if (card.cat === "blk" && player.block >= (enemy.attack || 0)) return false;

    // 🚫 物理攻撃無効の敵には atk カテゴリを使わない（Traitのランダム特性も含めて判定）
    const isImmuneNormal = typeof isEnemyImmuneToNormal === 'function' ? isEnemyImmuneToNormal() : !!data.immuneNormal;
    if (isImmuneNormal && card.cat === "atk") return false;

    // 🐺 Fenrir戦は、コストが偶数のカードを使えない（本編のplayCard()側の制限と合わせる）
    if (data.name === "Fenrir" && card.cost % 2 === 0) return false;

    // 🚫 状態異常無効の敵には、敵を対象にした状態異常付与カードを使わない（自己回復等は対象外。Traitのランダム特性も含めて判定）
    const isImmuneStatus = typeof isEnemyImmuneToStatusEffects === 'function' ? isEnemyImmuneToStatusEffects() : !!data.immuneStatus;
    if (isImmuneStatus && AUTO_BATTLE_ENEMY_DEBUFF_TYPES.includes(card.type)) return false;

    // 🚫 毒無効の敵には毒付与カードを使わない
    if (data.neverPoison && AUTO_BATTLE_POISON_TYPES.includes(card.type)) return false;

    // 🚫 火傷無効の敵には火傷付与カードを使わない
    if (data.neverBurn && AUTO_BATTLE_BURN_TYPES.includes(card.type)) return false;

    // 🚫 凍結・絶対零度無効の敵には、凍結／絶対零度系カードを使わない（既存のisFreezeAndAbsoluteZeroImmune()を利用）
    const freezeImmune = typeof isFreezeAndAbsoluteZeroImmune === 'function' && isFreezeAndAbsoluteZeroImmune();
    if (freezeImmune && (AUTO_BATTLE_FREEZE_TYPES.includes(card.type) || card.type === "grantAbsoluteZero")) return false;

    // 🚫 絶対零度付与カードは、敵が凍結状態の時だけ使う
    if (card.type === "grantAbsoluteZero" && !(enemy.status && enemy.status.freeze > 0)) return false;

    // 🚫 「敵HP○○以下なら××ダメージ」系（execute）は、実際に条件（敵HPが閾値以下）を満たす時だけ使う
    if (card.type === "execute" && (enemy.hp || 0) > (Number(card.value) || 0)) return false;

    // 🚫 「敵のHPがMAXなら××ダメージ」系（enemyhpmaxdamage）は、敵HPが最大の時だけ使う
    if (card.type === "enemyhpmaxdamage" && !((enemy.hp || 0) >= (enemy.maxHp || 0) && (enemy.maxHp || 0) > 0)) return false;

    // 🚫 「敵がboost/dragon/magicaなら××ダメージ」系（VsBoost/VsDragon/VsMagica）は、
    //    対象の敵タイプと一致する時だけ使う（それ以外の敵には使わない）
    const VS_TYPE_TARGET = { VsBoost: "boost", VsDragon: "dragon", VsMagica: "magica" };
    if (VS_TYPE_TARGET[card.type]) {
        const targetName = VS_TYPE_TARGET[card.type];
        const enemyName = (data.name || "").toLowerCase();
        if (enemyName !== targetName) return false;
    }

    // 🚫 「HP消費してダメージ」系（hpAttack）は、消費後の残りHPが最大HPの1/4以下になってしまう場合は使わない
    if (card.type === "hpAttack") {
        const hpCost = Number(card.hpCost) || 0;
        const remainingHp = player.hp - hpCost;
        if (remainingHp <= player.maxHp / 4) return false;
    }

    return true;
}

// 手札全体のおおよその合計ダメージ見積り（毒・火傷の継続ダメージ、追加ダメージ含む）
function estimateAutoBattleHandDamage() {
    let total = 0;
    for (const card of hand) {
        if (!card || card.type === "curse" || card.cat === "Curse") continue;
        total += Number(card.value) || 0;
        total += Number(card.blkValue) || 0; // ブロック残存時の追加ダメージ系カード
        if (AUTO_BATTLE_DAMAGE_STATUS_TYPES.includes(card.type)) {
            total += Number(card.status) || 0; // 毒・火傷の継続ダメージ量の目安
        }
    }
    return total;
}

// 現在敵にすでに乗っている毒スタックの残り合計ダメージをシミュレーションして見積る
function estimateStockedPoisonDamage() {
    if (!enemy.status || !enemy.status.poisonList || enemy.status.poisonList.length === 0) return 0;

    let newTotal = 0;
    const stacks = [];
    enemy.status.poisonList.forEach(p => {
        if (p.isNew) newTotal += p.value;
        else stacks.push({ value: p.value, duration: p.duration });
    });
    if (newTotal > 0) stacks.push({ value: newTotal, duration: 3 }); // 新規分は次ターンからduration3で合算される

    let total = 0;
    for (let t = 0; t < 50; t++) {
        const active = stacks.filter(p => p.value > 0 && p.duration > 0);
        if (active.length === 0) break;
        total += active.reduce((sum, p) => sum + p.value, 0);
        active.forEach(p => { p.value--; p.duration--; });
    }
    return total;
}

// 現在乗っている火傷の残り合計ダメージを見積る
function estimateStockedBurnDamage() {
    if (!enemy.status || !(enemy.status.burn > 0)) return 0;
    if (window.currentArea === "rain") return 0; // 雨フィールドでは次ターンで消える
    let burnDamage = (player.fields && player.fields.heavy_burn > 0) ? 10 : 5;
    if (window.currentArea === "sunny") burnDamage *= 2;
    return burnDamage * enemy.status.burn;
}

// 手札から使うカードを決める簡易AI
// 優先順位：①呪い/耐性/HP・ブロック状況/凍結前提の除外 → ②凍結・絶対零度が無ければ凍結/超絶対零度優先
//         → ③手札の合計ダメージが敵HP超えなら攻撃優先 → ④HP/ブロック状況に応じた通常優先度
function pickAutoBattleCardIndex() {
    const energy = player.energy;
    const hpRatio = player.maxHp > 0 ? player.hp / player.maxHp : 1;
    const enemyHp = (enemy && enemy.hp) || 0;
    const isFrozenOrAbsoluteZero = !!(enemy.status && (enemy.status.freeze > 0 || enemy.status.absoluteZeroTurns > 0));

    // コストを満たし、かつルール上使用可能なカードのインデックス一覧
    const playableIndices = [];
    for (let i = 0; i < hand.length; i++) {
        const c = hand[i];
        if (c && c.cost <= energy && isAutoBattleCardAllowed(c)) playableIndices.push(i);
    }
    if (playableIndices.length === 0) return -1;

    const findIn = (predicate) => {
        const found = playableIndices.find(i => predicate(hand[i]));
        return found === undefined ? -1 : found;
    };

    // ① 敵が凍結・絶対零度状態でないなら、凍結 or 超絶対零度カードを最優先で使う
    if (!isFrozenOrAbsoluteZero) {
        const freezeIdx = findIn(c => AUTO_BATTLE_FREEZE_TYPES.includes(c.type));
        if (freezeIdx !== -1) return freezeIdx;
    }

    // ①.5 敵が火傷状態でない場合、以下のいずれかに当てはまるなら火傷付与カードを最優先で使う
    //     ・敵のブロック値が0より多い（ブロックが残っているうちに火傷を仕込んでおきたい）
    //     ・手札に burnplus（火傷状態なら追加ダメージ）カードがある（先に火傷にしてから叩きたい）
    const isEnemyBurning = !!(enemy.status && enemy.status.burn > 0);
    if (!isEnemyBurning) {
        const hasBlockToBurnAround = (enemy.block || 0) > 0;
        const hasBurnplusInHand = playableIndices.some(i => hand[i].type === "burnplus");
        if (hasBlockToBurnAround || hasBurnplusInHand) {
            const burnIdx = findIn(c => AUTO_BATTLE_BURN_TYPES.includes(c.type));
            if (burnIdx !== -1) return burnIdx;
        }
    }

    // ② 手札の合計ダメージが敵の残りHPを上回るなら、攻撃カテゴリを最優先にする
    let categoryOrder;
    if (estimateAutoBattleHandDamage() > enemyHp) {
        categoryOrder = ['atk', 'abn', 'blk', 'rec'];
    } else if (hpRatio < 0.35) {
        categoryOrder = ['rec', 'blk', 'atk', 'abn'];
    } else if (player.block < (enemy.attack || 0)) {
        categoryOrder = ['blk', 'atk', 'rec', 'abn'];
    } else {
        categoryOrder = ['atk', 'abn', 'blk', 'rec'];
    }

    for (const cat of categoryOrder) {
        if (cat === 'atk') {
            // 🎯 「敵のHPがMAXなら××ダメージ」系は、条件を満たしている（isAutoBattleCardAllowedで既に確認済み）なら
            //    攻撃カード内で最優先に使う
            const maxHpIdx = findIn(c => c.cat === 'atk' && c.type === 'enemyhpmaxdamage');
            if (maxHpIdx !== -1) return maxHpIdx;

            // 🎯 「○○ダメージ、その後ブロックが残っているなら追加ダメージ」系は、攻撃カード内で優先的に使う
            const blockBonusIdx = findIn(c => c.cat === 'atk' && c.type === 'blockBonusAttack');
            if (blockBonusIdx !== -1) return blockBonusIdx;
        }
        const idx = findIn(c => c.cat === cat);
        if (idx !== -1) return idx;
    }
    // カテゴリで見つからなければ、使用可能な任意のカードを使う
    return playableIndices[0];
}

// 1ティック分のオートバトル処理（カードを1枚使うか、使えるカードが無ければターン終了）
function runAutoBattleStep() {
    if (!window.autoBattleActive) return;
    if (!window.inBattle) return; // 戦闘外（マップ・報酬選択など）は今回は自動化対象外

    if (window.discardSelectMode && window.discardSelectMode.active) return; // 特殊選択中は手を出さない

    // 🩸 現在ストックされている毒・火傷の残りダメージだけで敵を倒せるなら、カードを温存してターン終了する
    const stockedDotDamage = estimateStockedPoisonDamage() + estimateStockedBurnDamage();
    if (enemy && stockedDotDamage >= (enemy.hp || 0) && (enemy.hp || 0) > 0) {
        endTurn();
        return;
    }

    const playIndex = pickAutoBattleCardIndex();
    if (playIndex !== -1) {
        playCard(playIndex);
    } else {
        endTurn();
    }
}

function startAutoBattle() {
    if (window.autoBattleActive) return;
    window.autoBattleActive = true;
    if (window.autoBattleTimer) clearInterval(window.autoBattleTimer);
    window.autoBattleTimer = setInterval(runAutoBattleStep, 800);
    customAlert("🤖 オートバトルを開始しました。");
}

function stopAutoBattle() {
    if (!window.autoBattleActive) return;
    window.autoBattleActive = false;
    if (window.autoBattleTimer) {
        clearInterval(window.autoBattleTimer);
        window.autoBattleTimer = null;
    }
    customAlert("🛑 オートバトルを停止しました。");
}

document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = e.key.toLowerCase();

    // オートバトル中に何かキーを押したら停止する
    if (window.autoBattleActive) {
        stopAutoBattle();
        window._autoBattleKeysDown = {};
        return;
    }

    // A + I の同時押しでオートバトル開始
    window._autoBattleKeysDown[key] = true;
    if (window._autoBattleKeysDown['a'] && window._autoBattleKeysDown['i']) {
        startAutoBattle();
        window._autoBattleKeysDown = {};
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    delete window._autoBattleKeysDown[key];
});