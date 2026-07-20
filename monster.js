// =========================================================================
// 👹 敵データ定義
// =========================================================================
const enemyTypes = {

//通常敵
    goblin:   { name:"Goblin",    icon:"👺", hpRate:1.00, atkRate:1.00, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 125 },
    knight:   { name:"Knight",    icon:"🛡️", hpRate:0.60, atkRate:1.25, blockRate:0.50, immuneNormal:false, immuneStatus:true , statusDouble:false, rewardGold: 175 },
    slime:    { name:"Slime",     icon:"🟢", hpRate:1.00, atkRate:1.00, blockRate:0.00, immuneNormal:true , immuneStatus:false, statusDouble:true , rewardGold: 150 },
    fenrir:   { name:"Fenrir",    icon:"🐺", hpRate:0.75, atkRate:0.80, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    zombie:   { name:"Zombie",    icon:"🧟", hpRate:0.75, atkRate:1.00, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    golem:    { name:"Golem",     icon:"🗿", hpRate:0.75, atkRate:0.90, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    spirit:   { name:"Spirit",    icon:"👻", hpRate:0.60, atkRate:1.00, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    thief:    { name:"Thief",     icon:"🏴‍☠️", hpRate:0.75, atkRate:1.00, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 125 },
    clown:    { name:"Clown",     icon:"🤡", hpRate:1.25, atkRate:0.00, blockRate:0.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    phoenix:  { name:"Phoenix",   icon:"🐦‍🔥", hpRate:1.25, atkRate:1.00, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    beast:    { name:"Beast",     icon:"🦁", hpRate:1.50, atkRate:0.90, blockRate:1.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    bull:     { name:"Bull",      icon:"🐂", hpRate:1.25, atkRate:0.75, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    shadow:   { name:"Shadow",    icon:"👥", hpRate:1.00, atkRate:1.00, blockRate:1.25, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    robot:    { name:"Robot",     icon:"🤖", hpRate:1.00, atkRate:1.00, blockRate:1.25, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 150 },
    witch:    { name:"Witch",     icon:"🧙‍♂️", hpRate:1.25, atkRate:0.75, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    reaper:   { name:"Reaper",    icon:"🩻", hpRate:0.75, atkRate:1.25, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    ork:      { name:"Ork",       icon:"🐗", hpRate:0.80, atkRate:0.75, blockRate:0.80, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    bee:      { name:"Bee",       icon:"🐝", hpRate:0.50, atkRate:1.25, blockRate:0.25, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    undoll:   { name:"Undoll",    icon:"🪆", hpRate:0.80, atkRate:0.75, blockRate:0.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    assassin: { name:"Assassin",  icon:"🥷", hpRate:0.75, atkRate:1.90, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    greedy:   { name:"Greedy",    icon:"🦹", hpRate:0.75, atkRate:1.00, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    trait:    { name:"Trait",     icon:"👽", hpRate:0.80, atkRate:0.80, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    bastion:  { name:"Bastion",   icon:"💠", hpRate:1.00, atkRate:0.85, blockRate:1.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    gunner:   { name:"Gunner",    icon:"🔫", hpRate:0.90, atkRate:1.00, blockRate:0.90, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    void:     { name:"Void",      icon:"🌑", hpRate:0.95, atkRate:0.85, blockRate:0.85, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },


//ボス
    dragon: { name:"Dragon",  icon:"🐉", hpRate:2.00, atkRate:1.25, blockRate:1.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 600 },
    magica: { name:"Magica",  icon:"🔮", hpRate:1.50, atkRate:0.85, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 600 },
    boost:  { name:"Boost",   icon:"🪓", hpRate:1.00, atkRate:1.65, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 600 },

};
    

// =========================================================================
// 🧪 敵の生成とステータス初期化
// =========================================================================
/**
 * 現在の階層に応じた敵をランダム（または固定）で選定し、ステータスを初期化して返す
 */
function initEnemyStatus() {

    //const pool = ["robot"]
    const pool = ["goblin","knight","slime", "fenrir", "zombie", "golem", "spirit", "thief", "clown","phoenix","beast","bull","shadow","robot","witch","reaper", "ork", "bee","undoll","assassin","greedy","trait","bastion","gunner","void"];

// ─── 敵の種類の選定 ───

    if (floor === 20) {
        // ゲーム開始時に固定した20階のボス
        type = window.boss20; 
    } 
    else if (floor === 40) {
        // ゲーム開始時に固定した40階のボス
        type = window.boss40; 
    } 
    else if (floor === 1) {
        // 1階はゴブリン固定
        player.darkMarketCount = 0;
        //type = "void";
	type = pool[Math.floor(Math.random() * pool.length)];
	//1階はエリアなし
	window.currentArea = "none";

    }
    else {
        // 通常プールからランダムに1つ選ぶ
        type = pool[Math.floor(Math.random() * pool.length)];
    }

    
    const baseHp  = 20 + floor * 7.31; 
    const baseAtk =  3 + floor * 1.11;  
    
    let diffRateHp  = 1.0;
    let diffRateAtk = 1.0;

    if (window.difficulty === "easy")    diffRateHp  = 0.75; //easy    0.75倍
    if (window.difficulty === "easy")    diffRateAtk = 0.75; //easy    0.75倍

    if (window.difficulty === "normal")   diffRateHp  = 1.00; //nomal   1.00倍
    if (window.difficulty === "normal")   diffRateAtk = 1.00; //nomal   1.00倍

    if (window.difficulty === "hard")    diffRateHp  = 1.25; //hard    1.25倍
    if (window.difficulty === "hard")    diffRateAtk = 1.25; //hard    1.25倍

    if (window.difficulty === "lunatic") diffRateHp  = 1.50; //lunatic 1.50倍
    if (window.difficulty === "lunatic") diffRateAtk = 1.50; //lunatic 1.50倍

    const data = enemyTypes[type];

    setTimeout(() => {
        decideEnemyNextStyle();
    }, 50);

    // 敵の初期ステータスオブジェクトを作成して返す
    return {
        data: data,
        hp: Math.floor(baseHp * data.hpRate * diffRateHp),
        maxHp: Math.floor(baseHp * data.hpRate * diffRateHp),
        attack: Math.floor(baseAtk * data.atkRate * diffRateAtk),
        block: 0,
        status: { 
            poisonList: [], 
            burn: 0, 
            freeze: 0,
            stun: 0
        }
    };
}


function applyEnemyTurnStartTraits() {
    if (!enemy.data) return;

    // スピリットの特性（ターンごとに無効属性を入れ替え）
    if (enemy.data.name === "Spirit") {
        if (window.battleTurnCount % 2 !== 0) {
            // 奇数ターン：物理攻撃無効
            enemy.data.immuneNormal = true;
            enemy.data.immuneStatus = false;
        } else {
            // 偶数ターン：状態異常無効
            enemy.data.immuneNormal = false;
            enemy.data.immuneStatus = true;
        }
    }
}

// 🌑 Void：毎ターン、プレイヤーに過労を付与し、手札からランダムに2枚捨て札へ送る
function applyVoidTurnEffect() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Void")) return;

    player.status.fatigue = 1;

    let discarded = 0;
    for (let i = 0; i < 2 && window.hand && hand.length > 0; i++) {
        const randIndex = Math.floor(Math.random() * hand.length);
        const [discardedCard] = hand.splice(randIndex, 1);
        discardPile.push(discardedCard);
        discarded++;
    }

    if (discarded > 0) {
        customAlert(`🌑 Voidの侵食！過労が付与され、手札が${discarded}枚捨て札に送られた！`);
    } else {
        customAlert(`🌑 Voidの侵食！過労が付与された！`);
    }
}

// =========================================================================
// 💰 撃破時ゴールド（報酬金）の計算
// =========================================================================
function getEnemyKillRewardGold() {
    if (!enemy.data) return 0;
    
    // シーフ（Thief）だけは「奪われた金」を加算する特殊な処理を行う
    if (enemy.data.name === "Thief") {
        return (window.thiefStolenGold || 0) + enemy.data.rewardGold;
    }

    // それ以外の敵は、enemyTypes で定義した rewardGold をそのまま返す（見つからない場合は0）
    return enemy.data.rewardGold || 0;
}

// =========================================================================
// 🎯 敵にダメージを与える関数（Phoenix復活 ＆ Spiritターン完全対応版）
// =========================================================================
function damageEnemy(amount, ignoreBlock = false) {
    if (!inBattle) return;

    // 🐝Bee（蜂）の特性判定：33%の確率で攻撃や状態異常（スリップダメージ等含む）を完全無効化
    if (enemy.data && enemy.data.name === "Bee") {
        if (Math.random() < 0.33) {
            // 無効化ポップアップを表示
            if (typeof createDamagePopup === 'function') {
                createDamagePopup("🛡️ INVALID", true);
            }
            // 戦闘ログに表示（グローバル変数がある場合）
            if (typeof logText !== 'undefined' && typeof logArea !== 'undefined') {
                logText += `<div style="color:#ffcc00; font-weight:bold;">🐝 Bee：攻撃や異常状態を無効化した！</div>`;
                logArea.innerHTML = logText;
            }
            if (typeof updateUI === 'function') updateUI();
            return; // ここで処理を終了し、一切のダメージ・変動を発生させない
        }
    }

    let finalDamage = amount;

    // 💠 Bastion（バスティオン）の特性：防御値が0になるまでは、毒・火傷などブロック無視のダメージも防御で受け止める
    if (enemy.data && enemy.data.name === "Bastion") {
        ignoreBlock = false;
    }

    if (!ignoreBlock && finalDamage > 0) {
        if (window.player && window.player.fields && window.player.fields.atk_up) {
            finalDamage += window.player.fields.atk_up;
        }
    }

    // 👻【特性判定】敵の特性（SpiritやSlime）によるダメージの無効・倍率化を最初に行う
    if (enemy.data && finalDamage > 0) {
        
        // ① スピリット（Spirit）の特性
        if (enemy.data.name === "Spirit") {
            const isOddTurn = (window.battleTurnCount % 2 !== 0);

            if (isOddTurn) {
                // 奇数ターンは【物理無効】。物理攻撃（!ignoreBlock）ならダメージを0にする
                if (!ignoreBlock) {
                    finalDamage = 0;
                }
            } else {
                // 偶数ターンは【状態異常無効】。状態異常ダメージ（ignoreBlock=true）ならダメージを0にする
                if (ignoreBlock) {
                    finalDamage = 0;
                }
            }
        }
        
        // ② スライム（Slime）の特性
        if (enemy.data.name === "Slime") {
            if (!ignoreBlock) {
                finalDamage = 0;
            } else {
                finalDamage = finalDamage * 2;
            }
        }

	        // ③ アサシンの特性
        if (enemy.data.name === "Assassin") {
            const isOddTurn = (window.battleTurnCount % 2 !== 0);

            if (isOddTurn) {
                // 奇数ターンは攻撃しない
                enemy.atkRate=0;
            }
        }


    }

    // 🛡️【ブロック計算】無効化されずに残った物理ダメージに対して、ブロック（盾）の計算を行う
    if (!ignoreBlock && enemy.block > 0 && finalDamage > 0) {
        const blocked = Math.min(enemy.block, finalDamage);
        finalDamage -= blocked;
        enemy.block -= blocked;

        // ✨ 追加ポイント1: ブロックで防いだ数値をポップアップ
        if (typeof createDamagePopup === 'function' && blocked > 0) {
            createDamagePopup(`🛡️ ${blocked}`, true);
        }
    }

    // 💥【HP減少処理】実際にブロックを突き破ってダメージが残った場合
    if (finalDamage > 0) {
        // 残ったダメージを敵のHPから差し引く
        enemy.hp -= finalDamage;
        if (enemy.hp < 0) enemy.hp = 0;

        // ✨ 追加ポイント2: 実際に敵のHPが減ったタイミングでダメージ音頭数値を表示！
        if (typeof createDamagePopup === 'function') {
            createDamagePopup(finalDamage, true); 
        }

        // 🗿 ゴーレム（Golem）の反射特性
        if (enemy.data && enemy.data.name === "Golem" && !ignoreBlock) {
            player.hp = Math.max(0, player.hp - 3);
        }

        // 🧟 ゾンビの特性用（そのターンに受けた物理ダメージを蓄積）
        if (enemy.data && enemy.data.name === "Zombie") {
            window.zombieDamageTakenThisTurn = (window.zombieDamageTakenThisTurn || 0) + finalDamage;
        }

        // 🦁 獣（Beast）の特性用（ダメージを受けたらフラグを立てる）
        if (enemy.data && enemy.data.name === "Beast") {
            window.beastDamagedThisTurn = true;
        }
    }

    // 敵のHPが0になった瞬間に、monster.js にある復活関数を実行する
    if (enemy.hp === 0 && enemy.data && enemy.data.name === "Phoenix") {
        if (typeof tryPhoenixRevive === 'function') {
            const revived = tryPhoenixRevive();
            if (revived) {
                if (typeof updateUI === 'function') updateUI();
                return;
            }
        }
    }

    // HPやブロックが変動したのでUI（画面表示）を更新
    if (typeof updateUI === 'function') updateUI();
}


// =========================================================================
// 🩻 呪いカード削除ロジック(死神、アンドール)
// =========================================================================
function removeReaperCursesFromSavedDecks() {
    const slot = window.currentSlot || 0;
    if(enemy.data && enemy.data.name === "Reaper"){
        if (window.savedDecks && window.savedDecks[slot] && window.savedDecks[slot][0] !== undefined) {
        // 呪いカード(id=0)の枚数を5枚減らす
            window.savedDecks[slot][0] -= 5;
        
        // 0枚以下になった場合はオブジェクトからキーごと削除する
            if (window.savedDecks[slot][0] <= 0) {
                delete window.savedDecks[slot][0];
            }
            console.log("🧹 死神戦が終了したため、呪いカードを5枚削除しました。");
        }
    }
    if(enemy.data && enemy.data.name === "Undoll"){
        if (window.savedDecks && window.savedDecks[slot] && window.savedDecks[slot][0] !== undefined) {
        // 呪いカード(id=0)の枚数を15枚減らす
            window.savedDecks[slot][0] -= 15;
        
        // 0枚以下になった場合はオブジェクトからキーごと削除する
            if (window.savedDecks[slot][0] <= 0) {
                delete window.savedDecks[slot][0];
            }
            console.log("🧹 アンドール戦が終了したため、呪いカードを15枚削除しました。");
        }


    }

}




// =========================================================================
// 🐦‍🔥 不死鳥の復活ロジック
// =========================================================================
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


// 敵の行動スタイル定義と倍率
window.aiStyles = {
    super_attack: { name: "超攻撃特化のようだ！", atkRate: 1.5, blkRate: 0 },
    attack:       { name: "攻撃特化のようだ！",   atkRate: 1.25, blkRate: 0.5 },
    balance:      { name: "バランスを重視している", atkRate: 1.0, blkRate: 1.0 },
    defense:      { name: "防御特化のようだ！",   atkRate: 0.75, blkRate: 2 },
    super_defense:{ name: "超防御特化のようだ！", atkRate: 0.5, blkRate: 4 }
};

// ランダムにスタイルを1つ決定してUIを更新する関数
function decideEnemyNextStyle() {
    const keys = Object.keys(window.aiStyles);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    // ★カモフラージュ状態かつ、抽選結果が対象スタイルと一致する場合、強制的に「バランス型」にする
if (enemy.status.camouflageTurns > 0) {
        const targetStyle = enemy.status.camouflageTarget || 'super_attack';
        if (randomKey === targetStyle) {
            randomKey = 'balance';
            enemy.status.behaviorControlled = true; // 制御が継続している場合
            console.log(`カモフラージュ効果により${targetStyle}をバランス型に変更しました。`);
        }
    } else {
        // ───効果が切れたら表示フラグを完全にオフにする ───
        enemy.status.behaviorControlled = false;
    }
    window.enemy.nextStyleKey = randomKey;
    
    if (typeof updateUI === 'function') updateUI();
}

//ボスの候補(ゲーム開始時に決定)
function determineBossesForRun() {
    const bossPool20 = ["dragon", "magica","boost"]; 
    const chosenBoss20 = bossPool20[Math.floor(Math.random() * bossPool20.length)];
    window.boss20 = chosenBoss20;

    
    const bossPool40 = ["dragon", "magica","boost"]; 
    const chosenBoss40 = bossPool40[Math.floor(Math.random() * bossPool40.length)];
    window.boss40 = chosenBoss40;
}