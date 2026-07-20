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
        }
    }
}

function startBattle(){
    player.maxEnergy = 5 + Math.floor(floor / 2); 
    player.energy = player.maxEnergy;
    player.block = 0;

    window.inBattle = true;

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
    if(enemyNameEl) enemyNameEl.innerText = enemy.data.name;
    if(enemyIconEl) enemyIconEl.innerText = enemy.data.icon;

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

    if (typeof initBattleDeck === 'function') {
        initBattleDeck();
    }
    
    if(typeof drawHand === 'function') drawHand();

    // 🌑 Void: 1ターン目から過労を付与し、手札からランダムに2枚捨て札へ送る
    if (typeof applyVoidTurnEffect === 'function') applyVoidTurnEffect();

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

        // ★クリックした瞬間にそのカードを手札から取り除き、捨て札へ送る
        const discardedCard = hand[index];
        if (typeof discardPile !== 'undefined') discardPile.push(discardedCard);
        hand.splice(index, 1);
        mode.selectedIndices.push(index);

        // ★即座に手札表示を更新（選んだカードがその場で消える）
        if (typeof renderHand === 'function') renderHand();

        // 必要枚数（選択可能な上限）に達したら処理を実行
        if (mode.selectedIndices.length >= mode.maxSelectable) {
            // その後、b枚引く
            for (let i = 0; i < mode.drawCount; i++) {
                if (typeof drawOneCard === 'function') drawOneCard();
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

    // ⏰ Timer: atk/rec/abn/blkカードの効果を1ターン遅らせる（handSacrificeはhand参照が壊れるため即時実行）
    const timerDelayCats = ["atk", "rec", "abn", "blk"];
    if (enemy.data && enemy.data.name === "Timer" && timerDelayCats.includes(card.cat) && card.type !== "handSacrifice") {
        enemy.status.timerQueue = enemy.status.timerQueue || [];
        enemy.status.timerQueue.push(card);
        customAlert(`⏰ 時が歪み、「${card.name}」の効果は次のターンに持ち越された…`);
    } else {
        // 効果発動
        executeCardEffect(card, index);
    }

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
            hand.splice(index, 1);
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
    if (!enemy.data.immuneStatus && enemy.status.poisonList && enemy.status.poisonList.length > 0) {
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
            
            enemy.status.burn--; 
        }
    }

    // プレイヤーのその他状態異常の残りターン減少
    if (player.status.immaturity > 0) player.status.immaturity--;
    if (player.status.fatigue > 0) player.status.fatigue--;
    if (player.status.meditation > 0) {
        player.status.meditation--;
        if (player.status.meditation === 0) customAlert("🧘 瞑想の効果が切れた。");
    }

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
        if (Math.random() < (1 / 3)) {
            enemy.status.poisonList = []; 
            enemy.status.burn = 0;
            enemy.status.freeze = 0;
            enemy.status.stun = 0;
        }
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + 5);

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

    // ▼ 盗賊の逃走判定（最初のターン以外で4%の確率）
    if (enemy.data && enemy.data.name === "Thief") {
        if (!window.isFirstTurn && Math.random() < 0.04) {
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
    if (Math.random() < 0.1) {

        const currentDeck = savedDecks[currentSlot];

        // デッキに存在するカードIDだけ取得
        const cardIds = Object.keys(currentDeck).filter(id => currentDeck[id] > 0);

        if (cardIds.length > 0) {

            // ランダムなカードIDを選択
            const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];

            // カード情報取得
            const stolenCard = allCardsMaster.find(c => c.id == randomId);

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

            alert(`Greedyに\n「${stolenCard.name}\n${stolenCard.desc}」\nを奪われた！`);
        }
    }
}


    // 魔女
    if (enemy.data && enemy.data.name === "Witch" && enemy.hp > 0) {
        if (Math.random() < (1 / 2)) {
            player.status.amnesia = 1;
            if (typeof renderHand === 'function') renderHand(); // 手札を即座に「？」に更新
        }
        
        const categories = ["atk", "blk", "rec", "abn"];
        window.witchBannedCategory = categories[Math.floor(Math.random() * categories.length)];
        
        const catNames = { atk: "攻撃", blk: "ブロック", rec: "回復", abn: "状態異常" };
        customAlert(`🧙‍♂️次ターンは【${catNames[window.witchBannedCategory] }】系のカードが使用禁止！`);
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


        const categories = ["atk", "blk", "rec", "abn"];
        window.witchBannedCategory = categories[Math.floor(Math.random() * categories.length)];
        
        const catNames = { atk: "攻撃", blk: "ブロック", rec: "回復", abn: "状態異常" };
        customAlert(`🔮次ターンは【${catNames[window.witchBannedCategory] }】系のカードが使用禁止！`);
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

            // ⏰ Timer：持ち越されたカード効果は次のターン（2ターン目以降）にここで発動する
            if (enemy.data && enemy.data.name === "Timer" && window.battleTurnCount > 1 && enemy.status.timerQueue && enemy.status.timerQueue.length > 0) {
                const queue = enemy.status.timerQueue;
                enemy.status.timerQueue = [];
                customAlert(`⏰ 歪んでいた時間が戻り、${queue.length}枚のカード効果が発動した！`);
                queue.forEach(queuedCard => {
                    if (typeof executeCardEffect === 'function') executeCardEffect(queuedCard, -1);
                });
                if (enemy.hp <= 0) {
                    enemy.hp = 0;
                    if (!tryPhoenixRevive()) {
                        if (endTurnBtn) endTurnBtn.disabled = false;
                        victory();
                        return;
                    }
                }
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

            // ⏰ Timer：最初のターンは攻撃してこない
            if (enemy.data && enemy.data.name === "Timer" && window.battleTurnCount === 1) {
                damage = 0;
                logText += `<div style="color:#aaa;">⏰ Timerは様子をうかがい、攻撃してこなかった。</div>`;
            }

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
        player.maxEnergy = Math.max(1, Math.floor(player.maxEnergy / 2));
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
        customAlert(`⚡ 予約されていたエネルギー+${player.status.nextTurnEnergyBonus}が発動！`);
        player.status.nextTurnEnergyBonus = 0;
    }

    // 🃏 このターンに使用したカード枚数をリセット
    window.cardsPlayedThisTurn = 0;
    
    if(player.status.healTurns > 0) player.hp = Math.min(player.maxHp, player.hp + player.status.heal);
    
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

    // 🌑 Void: 毎ターン過労を付与し、手札からランダムに2枚捨て札へ送る
    if (typeof applyVoidTurnEffect === 'function') applyVoidTurnEffect();

    if(typeof renderHand === 'function') renderHand();
    if(typeof updateUI === 'function') updateUI();

    if(endTurnBtn) endTurnBtn.disabled = false;
}

function victory(){
    inBattle = false;
    window.witchBannedCategory = null;


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

    let gainGold = getEnemyKillRewardGold();
    player.gold = (player.gold || 0) + gainGold;

    if (floor === 20) {
        const proceed = confirm(`🎉 20階ボスを撃破！\n所持金: ${player.gold}G\n\nこのまま40階まで挑戦を続けますか？`);
        if (!proceed) {
            customAlert(`ゲームを終了します。\n最終所持金: ${player.gold}G`);
            resetDeckBattle();
            const startScreen = document.getElementById("startScreen");
            if(startScreen) startScreen.style.display = "flex";
            location.reload();
            return;
        }
    } else if (floor >= 40) {
        customAlert(`🎉 40階ボスを撃破！ゲームクリアです！\n最終所持金: ${player.gold}G`);
        resetDeckBattle();

    gameClear();



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

function gameover() {

    if (enemy.data && enemy.data.name === "Reaper") {
        removeReaperCursesFromSavedDecks();
    }

    resetDeckBattle();

    inBattle = false;

    const endTurnBtn = document.getElementById("endTurnBtn");
    if (endTurnBtn) endTurnBtn.disabled = false;

    // モーダルへ情報を表示

    document.getElementById("gameOverEnemy").innerText = enemy.data.name;
    document.getElementById("gameOverFloor").innerText = floor;
    document.getElementById("gameOverGold").innerText = player.gold;

    // ゲームオーバーモーダル表示
    document.getElementById("gameOverModal").style.display = "flex";
}

function gameclear(){

    document.getElementById("gameClearFloor").innerText = floor;
    document.getElementById("gameClearGold").innerText = player.gold;

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