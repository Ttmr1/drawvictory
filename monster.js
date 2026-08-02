// =========================================================================
// 🔢 HP計算用ヘルパー：四捨五入・切り上げではなく、常に小数第一位で「切り捨て」る
// 例: 10.45 → 10.4 / 10.49 → 10.4
// （浮動小数点の誤差対策として、ごく小さいイプシロンを足してから切り捨てる）
// =========================================================================
function truncateToOneDecimal(value) {
    return Math.floor((value + 1e-9) * 10) / 10;
}

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
    golem:    { name:"Golem",     icon:"🗿", hpRate:0.75, atkRate:0.90, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, neverPoison:true, rewardGold: 225 },
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
    ork:      { name:"Ork",       icon:"🐗", hpRate:0.80, atkRate:0.65, blockRate:0.80, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 225 },
    bee:      { name:"Bee",       icon:"🐝", hpRate:0.50, atkRate:1.25, blockRate:0.25, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    undoll:   { name:"Undoll",    icon:"🪆", hpRate:0.80, atkRate:0.75, blockRate:0.50, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    assassin: { name:"Assassin",  icon:"🥷", hpRate:0.75, atkRate:1.85, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    greedy:   { name:"Greedy",    icon:"🦹", hpRate:0.75, atkRate:1.00, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    trait:    { name:"Trait",     icon:"👽", hpRate:0.80, atkRate:0.80, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    bastion:  { name:"Bastion",   icon:"💠", hpRate:0.85, atkRate:0.85, blockRate:1.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 175 },
    gunner:   { name:"Gunner",    icon:"🔫", hpRate:0.90, atkRate:0.90, blockRate:0.90, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    bat:     { name:"Bat",        icon:"🦇", hpRate:0.95, atkRate:0.85, blockRate:0.85, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },
    sight:    { name:"Sight",     icon:"👁️‍🗨️", hpRate:0.75, atkRate:0.60, blockRate:1.00, immuneNormal:false, immuneStatus:false, statusDouble:false, neverFreeze:true, physicalResist:0.5, rewardGold: 200 },
    luna:     { name:"Luna",      icon:"🌕", hpRate:1.00, atkRate:0.75, blockRate:0.50, immuneNormal:false, immuneStatus:false, statusDouble:false, neverFreeze:true, physicalResist:0.5, neverStun:true, rewardGold: 200 },
    tempest:  { name:"Tempest",   icon:"🌪️", hpRate:0.85, atkRate:0.90, blockRate:0.75, immuneNormal:false, immuneStatus:false, statusDouble:false, rewardGold: 200 },


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
    const pool = ["goblin","knight","slime", "fenrir", "zombie", "golem", "spirit", "thief", "clown","phoenix","beast","bull","shadow","robot","witch","reaper", "ork", "bee","undoll","assassin","greedy","trait","bastion","gunner","bat","sight","luna","tempest"];

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

	type = pool[Math.floor(Math.random() * pool.length)];
        //type = "luna";
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

    // 💀 エリート戦：通常の敵から抽選された内容に対して、攻撃・体力・防御を1.25倍、
    //    報酬ゴールドを1.5倍（25の倍数に切り捨て）した専用ステータスを適用する
    const isEliteType = type !== "dragon" && type !== "magica" && type !== "boost";
    const isElite = !!window.isEliteBattle && isEliteType;
    window.isEliteBattle = false; // 使用後は必ずリセットしておく（次の戦闘に持ち越さない）

    const effectiveData = isElite
        ? Object.assign({}, data, {
            hpRate: data.hpRate * 1.25,
            atkRate: data.atkRate * 1.25,
            blockRate: data.blockRate * 1.25,
            rewardGold: Math.floor((data.rewardGold * 1.5) / 25) * 25,
            isElite: true
        })
        : data;

    setTimeout(() => {
        decideEnemyNextStyle();
    }, 50);

    // 敵の初期ステータスオブジェクトを作成して返す
    return {
        data: effectiveData,
        hp: truncateToOneDecimal(baseHp * effectiveData.hpRate * diffRateHp),
        maxHp: truncateToOneDecimal(baseHp * effectiveData.hpRate * diffRateHp),
        attack: Math.floor(baseAtk * effectiveData.atkRate * diffRateAtk),
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

// 🦇 Bat：毎ターン、プレイヤーに過労を付与し、手札からランダムに2枚捨て札へ送る
function applyBatTurnEffect() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Bat")) return;

    player.status.fatigue = 1;

    let discarded = 0;
    for (let i = 0; i < 2 && window.hand && hand.length > 0; i++) {
        const randIndex = Math.floor(Math.random() * hand.length);
        const [discardedCard] = hand.splice(randIndex, 1);
        discardPile.push(discardedCard);
        discarded++;
    }
}

// 👁️‍🗨️ Sight：毎ターン、プレイヤーに過労を付与する（手札破壊はない）
function applySightTurnEffect() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Sight")) return;

    player.status.fatigue = 1;
}

// 🌕/🌑 Luna：体力が半分より多い間は毎ターン自己回復、半分以下になると1/4で忘却を付与する
function applyLunaTurnEffect() {
    if (!(window.inBattle && enemy.data && enemy.data.name === "Luna")) return;

    const isPhase2 = enemy.status.lunaPhase2 || (enemy.hp <= enemy.maxHp / 2);

    if (!isPhase2) {
        // 🌕 体力が半分より多い間：毎ターン自身の最大HPの5%回復
        const healAmount = Math.min(enemy.maxHp/20, enemy.maxHp - enemy.hp);
        if (healAmount > 0) {
            enemy.hp += healAmount;
            enemy.hp = truncateToOneDecimal(enemy.hp);
        }
    } else {
        // 🌑 体力が半分以下：1/4の確率でプレイヤーに忘却(手札を隠す)を付与
        if (Math.random() < (1 / 4)) {
            player.status.amnesia = 1;
            if (typeof renderHand === 'function') renderHand();
        }
    }

    if (typeof updateUI === 'function') updateUI();
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
// 🎯 敵にダメージを与える関数
// =========================================================================
// 凍結・絶対零度への耐性判定
// Sightなどは常時耐性を持つが、Lunaは体力が半分より多い間（フェーズ1）のみ耐性を持ち、
// フェーズ2（体力半分以下）になると凍結・絶対零度が効くようになる
function isFreezeAndAbsoluteZeroImmune() {
    if (!enemy.data || !enemy.data.neverFreeze) return false;
    if (enemy.data.name === "Luna" && enemy.status && enemy.status.lunaPhase2) {
        return false; // Lunaはフェーズ2に入ると耐性を失う
    }
    return true;
}

// 🛡️ 物理攻撃無効かどうか（enemyTypesの恒久フラグ、またはTraitのランダム特性の両方を見る）
function isEnemyImmuneToNormal() {
    if (!enemy || !enemy.data) return false;
    return !!enemy.data.immuneNormal || !!(enemy.status && enemy.status.immuneNormal);
}

// ☠️ 状態異常無効かどうか（enemyTypesの恒久フラグ、またはTraitのランダム特性の両方を見る）
function isEnemyImmuneToStatusEffects() {
    if (!enemy || !enemy.data) return false;
    return !!enemy.data.immuneStatus || !!(enemy.status && enemy.status.immuneStatus);
}

function damageEnemy(amount, ignoreBlock = false, isPierce = false, cardCat = null) {
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

        // 🛡️ 汎用の物理攻撃無効判定（Traitの「物理無効」特性や、今後追加する immuneNormal:true の敵に対応）
        //    物理攻撃（ブロックを参照する通常攻撃、または貫通攻撃）のみを無効化し、毒・火傷などのDoTダメージ(ignoreBlock=true)は対象外
        if (isEnemyImmuneToNormal()) {
            if (!ignoreBlock || isPierce) {
                finalDamage = 0;
            }
        }

        // ① スピリット（Spirit）の特性
        if (enemy.data.name === "Spirit") {
            const isOddTurn = (window.battleTurnCount % 2 !== 0);

            if (isOddTurn) {
                // 奇数ターンは【物理無効】。物理攻撃（!ignoreBlock）、または貫通（isPierce）ならダメージを0にする
                if (!ignoreBlock || isPierce) {
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
            if (isPierce) {
                // 貫通は物理無効の敵には効かない（0ダメージ）
                finalDamage = 0;
            } else if (!ignoreBlock) {
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

        // ④ physicalResist特性：攻撃系(cat:"atk")カードのダメージのみ軽減する
        //    （ブロック系・回復系・状態異常系カードや、毒・火傷などのDoTダメージは対象外）
        if (enemy.data.physicalResist && enemy.data.physicalResist < 1 && enemy.data.name === "sight") {
            if (cardCat === "atk") {
                finalDamage = truncateToOneDecimal(finalDamage * enemy.data.physicalResist);
            }
        }
        if (enemy.data.physicalResist && enemy.data.physicalResist < 1 && enemy.data.name === "Luna" && !(enemy.status && enemy.status.lunaPhase2)) {
            if (cardCat === "atk") {
                finalDamage = truncateToOneDecimal(finalDamage * enemy.data.physicalResist);
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
        enemy.hp = truncateToOneDecimal(enemy.hp); // 浮動小数点の誤差を防ぎ、小数第一位に揃える

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

        // 🌕 Luna：体力が半分以下になった瞬間（1回だけ）に発動する変化
        if (enemy.data && enemy.data.name === "Luna" && enemy.hp > 0 && !enemy.status.lunaPhase2) {
            if (enemy.hp <= enemy.maxHp / 2) {
                enemy.status.lunaPhase2 = true;

                // アイコンを新月に変更（enemy.dataは全Lunaで共有されるテンプレートなので、
                // ここでは直接DOMを書き換える。enemy.dataそのものは書き換えない）
                const enemyIconEl = document.getElementById("enemyIcon");
                if (enemyIconEl) enemyIconEl.innerText = "🌑";

                // 攻撃力を1.33倍に変更
                enemy.attack = Math.floor(enemy.attack * 1.33);

                // 呪いカードをさらに5枚デッキに追加（倒しても削除されない5枚とは別に、こちらも削除対象外）
                const slot = window.currentSlot || 0;
                if (!window.savedDecks[slot]) window.savedDecks[slot] = {};
                window.savedDecks[slot][0] = (window.savedDecks[slot][0] || 0) + 5;

                customAlert("🌑 敵の姿が変わった！");
            }
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

    // 🌕 Luna：倒した時に呪いカードを5枚だけ削除する（戦闘中に追加された合計10枚のうち5枚は残り続ける）
    if(enemy.data && enemy.data.name === "Luna"){
        if (window.savedDecks && window.savedDecks[slot] && window.savedDecks[slot][0] !== undefined) {
            window.savedDecks[slot][0] -= 5;

            if (window.savedDecks[slot][0] <= 0) {
                delete window.savedDecks[slot][0];
            }
            console.log("🧹 Lunaを倒したため、呪いカードを5枚削除しました。");
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