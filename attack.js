//敵に毒が付与できるかを判定する関数
function canApplyPoisonToEnemy() {
    if (!enemy.data) return true;
    if (enemy.data.immuneStatus) return false;
    if (enemy.data.name === "Golem") return false;
    return true;
}


 //カードの効果を発動する共通処理
 //@param {Object} card - 使用されたカードオブジェクト
 // @param {number} index - 手札の中でのインデックス（handSacrifice用）

function executeCardEffect(card, index) {

// 霧エリアの命中率75%判定
    if (window.currentArea === "fog" && (card.cat === "atk" || card.cat === "abn")) {
        if (Math.random() > 0.75) {
            return; // 効果を発動せずに終了
        }
    }


    const canApplyPoison = canApplyPoisonToEnemy();

//コンボ
    window.comboActive = false;
    if (window.lastPlayedCard.cat === card.cat && window.lastPlayedCard.cost !== null && card.cost === window.lastPlayedCard.cost + 1) {
        window.comboActive = true;
    }
    
    if (card.cat && card.cat !== "none") {
        window.lastPlayedCard.cat = card.cat;
        window.lastPlayedCard.cost = card.cost;
    } else {
        window.lastPlayedCard.cat = null;
        window.lastPlayedCard.cost = null;
    }

    let comboBonus = 0;
    if (window.comboActive) {
        // comboPlusが正しくオブジェクトであり、かつターン数が残っているか厳密にチェック
        if (player.status.comboPlus && typeof player.status.comboPlus === 'object' && player.status.comboPlusTurns > 0) {
            comboBonus = player.status.comboPlusBonus || 1; 
        } else {
            comboBonus = 2;
        }
	if (card.cat === "abn") {
            if (Math.random() < 0.25) { // 1/4 (25%) の確率
                player.energy += 1;
            }
        }
    }

//アドレナリンによる追加ダメージ
const adrenalineBonus = player.status.adrenalineAtk || 0;


    // ----------------
    // 妨害系
    // ----------------
//自分に〇ダメージ

    if (card.type === "curse") {
        player.hp -= card.value;
        if (player.hp <= 0) {
	    gameover();
	}
    }






    // ----------------
    // 攻撃系
    // ----------------

//〇ダメージ
    if (card.type === "attack") {
	card.value=card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        damageEnemy(card.value);
    }

//貫通：敵の防御値を無視して〇ダメージ
    if (card.type === "pierceAttack") {
	card.value=card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        damageEnemy(card.value, true); // ignoreBlock=true で防御を無視

        // 🗿 Golemは防御を無視されると反撃してくる
        if (enemy.data && enemy.data.name === "Golem") {
            const counterDmg = 6;
            player.hp = Math.max(0, player.hp - counterDmg);
            if (typeof createDamagePopup === 'function') createDamagePopup(counterDmg, false);
            customAlert(`🗿 Golemの反撃！防御を無視された怒りでプレイヤーに ${counterDmg} ダメージ！`);
            if (player.hp <= 0) gameover();
        }
    }

//HP〇消費して〇ダメージ
    if (card.type === "hpAttack") {
	card.value=card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        player.hp -= card.hpCost;
        if (player.hp < 1) gameover();
        damageEnemy(card.value);
    }

//残りエネルギー×〇ダメージしてエネルギーを0
    if (card.type === "energyAttack") {
	let plus=(card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        const remain = player.energy;
        damageEnemy(remain * card.value + plus);
        player.energy = 0;
    }

//防御値をダメージして防御を0
    if (card.type === "blockAttackFull") {
	player.block=player.block + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        damageEnemy(player.block);
        player.block = 0;
    }


//〇ダメージ、敵が火傷状態なら+〇ダメージ
    if (card.type === "burnplus") {
	card.value=card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        damageEnemy(card.value);
	if (enemy.status && enemy.status.burn > 0) {
	    damageEnemy(card.status);
	}
    }

//自分のHPが〇%以下なら〇ダメージ
    if (card.type === "hpmindamage") {
	if (player.hp <= player.maxHp * (card.nowhp * 0.01)) {
    	    card.value=card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
	    damageEnemy(card.value);
	}
    }
  
//敵のHPがMAXなら〇ダメージ  
    if (card.type === "enemyhpmaxdamage") {
	if (enemy.hp === enemy.maxHp) { 
	    card.value=card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
	    damageEnemy(card.value);
	}
    }


//card.value+使うたびに+1ダメージ
if (card.type === "nkai") {
    player.status.nkaiCount = (player.status.nkaiCount || 0) + 1;

    let finalDamage = (card.value || 0) + player.status.nkaiCount +  adrenalineBonus;
    damageEnemy(finalDamage);
}

//確率即死or自傷
if (card.type === "gambling") {
        // ボス判定（enemy.data.name や floor、あるいは enemyTypes 側で boss: true などのプロパティがあると想定）
        // ここでは一般的なボス名や階層、または enemy.data.isBoss などのフラグを想定してチェックします
        const isBoss = enemy.data && (enemy.data.isBoss || enemy.data.name === "dragon" || enemy.data.name === "magica" || enemy.data.name === "boost" || floor === 15 || floor === 30);
        
        const rand = Math.random() * 100; // 0.00 〜 99.99...
        
        if (!isBoss && rand < card.value) {
            // 即死成功（ボスの場合はこのルートに入らない）
            enemy.hp = 0;
            customAlert(`🎲敵を即死させました！`);
            if (typeof createDamagePopup === 'function') createDamagePopup("☠️ INSTANT KILL", true);
        } else {
            // 即死失敗、または対象がボスのため自傷ダメージ処理
            // 最大HPの25%を計算（端数切り捨て、最低1ダメージ）
            const selfDamage = Math.max(1, Math.floor(player.maxHp * card.penaltyRate));
            player.hp = Math.max(0, player.hp - selfDamage);
            
            if (isBoss) {
                customAlert(`🎲ボスには効かない、（${selfDamage}ダメージ）を受けた`);
            }
            
            if (typeof createDamagePopup === 'function') createDamagePopup(`💥-${selfDamage}`, false);
	    if(player.hp < 1)gameover();

        }
    }




//手札を全て破壊し枚数×〇ダメージ
    if (card.type === "handSacrifice") {
        const count = hand.length - 1;
	card.plus =(card.cat === "atk" ? comboBonus:0);
        damageEnemy(count * card.value + card.plus + adrenalineBonus);
        discardPile.push(
            ...hand.filter((c, i) => i !== index)
        );
        hand = [card];
    }
	

//相手のHPが〇以下なら〇ダメージ
    if (card.type === "execute") {
	card.value = card.value + (card.cat === "atk" ? comboBonus:0) + adrenalineBonus;
        if (enemy.hp <= card.value) damageEnemy(card.value);
    }

//対ドラゴン (大文字の "Dragon" と小文字の "dragon" 両方に対応)
    if (card.type === "VsDragon" && enemy.data && (enemy.data.name === "Dragon" || enemy.data.name === "dragon")) {
        let finalDamage = card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        damageEnemy(finalDamage);
    }
//対マギカ (大文字の "Magica" と小文字の "magica" 両方に対応)
    if (card.type === "VsMagica" && enemy.data && (enemy.data.name === "Magica" || enemy.data.name === "magica")) {
        let finalDamage = card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        damageEnemy(finalDamage);
    }
//対ブースト (大文字の "Boost" と小文字の "boost" 両方に対応)
    if (card.type === "VsBoost" && enemy.data && (enemy.data.name === "Boost" || enemy.data.name === "boost")) {
        let finalDamage = card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
        damageEnemy(finalDamage);
    }

// 捨て札の枚数分ダメージ
if (card.type === "discardSaber") {
    let currentDiscardPile = window.discardPile || (typeof discardPile !== 'undefined' ? discardPile : null);
    let dmg = currentDiscardPile ? currentDiscardPile.length : 0;
    let finalDamage = dmg + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
    damageEnemy(finalDamage); 
}

//敵が火傷、毒、凍結の3つの状態異常を持っているなら〇ダメージ
if (card.type === "elementalFeast") {
    const hasBurn = enemy.status.burn > 0;
    const hasPoison = enemy.status.poison > 0;
    const hasFreeze = enemy.status.freeze > 0;

    let dmg = 0;
    if (hasBurn && hasPoison && hasFreeze) {
        dmg = card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
    }
    damageEnemy(dmg);
}

// 手札の呪いカードの枚数×〇ダメージ
if (card.type === "curseBurst") {
    // 手札（hand）の中から、カテゴリやタイプが "curse" の枚数をカウント
    let curseCount = window.hand.filter(c => c.cat === "Curse" || c.type === "curse").length;
    let dmg = curseCount * card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;
    damageEnemy(dmg);
}


// 〇ダメージ+〇ブロック
    if (card.type === "shieldBash") {
        let baseDmg = card.value || 5; 
       
        let currentComboBonus = window.comboActive ? (comboBonus || 0) : 0;
        let currentAdrenalineBonus = typeof adrenalineBonus !== 'undefined' ? adrenalineBonus : 0;
        
        let finalDamage = baseDmg + currentComboBonus + currentAdrenalineBonus;
        
        damageEnemy(finalDamage);

        let blockAmount = card.blockValue || 5;
        
        player.block += blockAmount;
        
    }


//フィールドの枚数〇倍
    if(card.type==="fieldAttack") {
	let fieldCount = 0;

	for (const key in player.fields) {
    	    fieldCount += player.fields[key];
	}

	const damage = fieldCount * card.value;
	damageEnemy(damage);
    }

//複数回ダメージ
	if(card.type==="straight"){
	    let finalDamage = card.value + (card.cat === "atk" ? comboBonus : 0) + adrenalineBonus;


// 準備：ループ用の変数
let isHitting = true; // 攻撃を継続するかどうかのフラグ
let count = 0;        // 現在の攻撃回数

// 条件式：継続フラグがtrue、かつ回数が10未満ならループする
while (isHitting && count < 10) {
    // 確率判定：card.p の確率で「外れる」＝「継続フラグをfalseにする」
    if (Math.random() < card.p) {
        isHitting = false;
    } else {
        // 攻撃成功！
        damageEnemy(finalDamage);
        count++; // 回数を増やす
    }
}
	}







    // ----------------
    // 状態異常
    // ----------------

//〇ダメージ＋毒〇
    if (card.type === "poisonAttack") {
        damageEnemy(card.value);
        if (canApplyPoison) {
            enemy.status.poisonList.push({
                value: card.status,
                duration: 3,
                isNew: true
            });
        }
    }

//毒〇
    if (card.type === "poisonOnly") {
        if (canApplyPoison) {
            enemy.status.poisonList.push({
                value: card.status,
                duration: 3,
                isNew: true
            });
        }
    }

//毒〇＋火傷
    if (card.type === "poisonBurn") {
        if (canApplyPoison) {
            enemy.status.poisonList.push({
                value: card.status,
                duration: 3,
                isNew: true
            });
        }
        if (!enemy.data.immuneStatus) {
            enemy.status.burn = 1;
            enemy.block = Math.floor(enemy.block / 2);
        }
    }

//〇ダメージ＋火傷
    if (card.type === "burnAttack") {
        damageEnemy(card.value);
        if (!enemy.data.immuneStatus) {
            enemy.status.burn = 1;
            enemy.block = Math.floor(enemy.block / 2);
        }
    }


//凍結〇+〇ダメージ
    if (card.type === "freezeAttack") {
        if (!enemy.data.immuneStatus) {
            enemy.status.freeze = card.status;
	    damageEnemy(card.value);
        }
    }

//〇ダメージ+スタン
    if (card.type === "stunAttack") {
        damageEnemy(card.value);
        if (!enemy.data.immuneStatus) {
            enemy.status.stun = 1;
        }
    }

//毒の合計値を〇倍にして〇ターンにする。
    if (card.type === "poisonpoison") {
        if (enemy.status.poisonList && enemy.status.poisonList.length > 0) {
                        let totalPoisonValue = 0; 
            enemy.status.poisonList.forEach(p => {
                totalPoisonValue += p.value;
            });
            let newPoisonValue = Math.floor(totalPoisonValue * card.value);
            enemy.status.poisonList = [{
                value: newPoisonValue,duration: card.turn,isNew: false
            }];
        }
    }

//カウンター付与
    if (card.type === "counterSetup") {
        player.status.counterTurns = card.value;
    }


//各攻撃+〇（ターン数も付与）
    if (card.type === "adrenaline") {
        const currentAdrenaline = Number(player.status.adrenalineAtk) || 0;
        player.status.adrenalineAtk = currentAdrenaline + Number(card.value);
        // カードデータに設定されているターン数（例: card.duration や card.turn）を代入
        player.status.adrenalineTurn = card.duration || card.turn || 3; 
    
        if (typeof updateUI === 'function') updateUI();
    }


//超攻撃型・攻撃型・防御型・超防御型をバランス型へ
if (card.type === "camouflage") {
        enemy.status.camouflageTurns = card.duration;
        // どの行動スタイルを対象にするか（未指定の場合は従来通り「超攻撃特化」）
        const targetStyle = card.target || "super_attack";
        enemy.status.camouflageTarget = targetStyle;

        // もし現在、敵の次のスタイルがすでに対象スタイルなら即座に「バランス型」に書き換える
        if (enemy.nextStyleKey === targetStyle) {
            enemy.nextStyleKey = 'balance';
            // ───【追加】行動制御フラグを立てる ───
            enemy.status.behaviorControlled = true;
        } else {
            enemy.status.behaviorControlled = false;
        }
    }


//攻撃予知：敵の次の行動タイプを見破り、裏をかかれなくなる
if (card.type === "predictEnemy") {
        enemy.status.predictTurns = card.turn || 1;

        // Clownは通常の行動スタイル（超攻撃特化など）を使わないため、予知結果は表示しない
        const isClown = enemy.data && enemy.data.name === "Clown";

        if (!isClown) {
            const predictedKey = enemy.nextStyleKey || "balance";
            const predictedInfo = window.aiStyles ? window.aiStyles[predictedKey] : null;
            const predictedName = predictedInfo ? predictedInfo.name : "バランスを重視している";

            customAlert(`🔮 攻撃予知！敵は「${predictedName}」`);
        }

        if (typeof updateUI === 'function') updateUI();
    }


//絶対零度：敵が凍結中なら凍結を解除し攻撃力を50%にする。凍結中でなければ不発
if (card.type === "absoluteZero") {
        if (enemy.status.freeze > 0) {
            enemy.status.freeze = 0;
            enemy.status.absoluteZeroTurns = (enemy.status.absoluteZeroTurns || 0) + (card.turn || 1);
            customAlert("❄️ 絶対零度！敵の凍結を解除し、攻撃力を50%に低下させた！");
        } else {
            customAlert("❄️ 絶対零度は敵が凍結状態ではないため不発に終わった…");
        }
        if (typeof updateUI === 'function') updateUI();
    }


//瞑想状態を付与する
if (card.type === "buffMeditation") {
        player.status.meditation = (player.status.meditation || 0) + (card.turn || 2);
        if (typeof updateUI === 'function') updateUI();
    }


//絶対零度状態を（凍結の有無に関わらず）直接付与する。一定確率で持続ターンが伸びる
if (card.type === "grantAbsoluteZero") {
        if (!enemy.data.immuneStatus) {
            let turns = card.turn || 1;
            if (card.bonusChance && Math.random() < card.bonusChance) {
                turns = card.bonusTurn || turns;
            }
            enemy.status.absoluteZeroTurns = (enemy.status.absoluteZeroTurns || 0) + turns;
        } else {
            customAlert("敵は状態異常無効のため、絶対零度は効果がなかった…");
        }
        if (typeof updateUI === 'function') updateUI();
    }


//敵を凍結状態にしてから絶対零度状態を付与する。一定確率で絶対零度の持続ターンが伸びる
if (card.type === "freezeThenAbsoluteZero") {
        if (!enemy.data.immuneStatus) {
            enemy.status.freeze = card.freezeTurn || 1;

            let turns = card.turn || 1;
            if (card.bonusChance && Math.random() < card.bonusChance) {
                turns = card.bonusTurn || turns;
            }
            enemy.status.absoluteZeroTurns = (enemy.status.absoluteZeroTurns || 0) + turns;
            customAlert(`❄️ 敵を凍結させ、絶対零度状態を付与した！(${turns}T)`);
        } else {
            customAlert("敵は状態異常無効のため、凍結・絶対零度は効果がなかった…");
        }
        if (typeof updateUI === 'function') updateUI();
    }


//次ターンにエネルギー+2を予約する
if (card.type === "nextTurnEnergy") {
	if(card.plusValue > 0 && Math.random() < 0.5){
	    card.value = card.value + card.plusValue;
	}
        player.status.nextTurnEnergyBonus = (player.status.nextTurnEnergyBonus || 0) + (card.value || 2);
        customAlert(`⚡ 次のターン、エネルギーが+${card.value || 2}される！`);
        if (typeof updateUI === 'function') updateUI();
    }


//1ターン目かつこのカードが最初に使用されたカードなら3枚ドローする
if (card.type === "firstCardDraw") {
        if (window.battleTurnCount === 1 && window.cardsPlayedThisTurn === 1) {
            for (let i = 0; i < (card.value || 3); i++) {
                if (typeof drawOneCard === 'function') drawOneCard();
            }
            customAlert(`🃏 幸先の良いスタート！カードを${card.value || 3}枚引いた！`);
            if (typeof renderHand === 'function') renderHand();
        } else {
            customAlert("🃏 1ターン目の最初のカードではないため、効果は発動しなかった…");
        }
        if (typeof updateUI === 'function') updateUI();
    }



    // ----------------
    // 防御・回復
    // ----------------

//防御〇
    if (card.type === "block") {
	card.value = card.value + (card.cat === "blk" ? comboBonus:0);
        let blockGain = card.value;
        // 🧘 瞑想：blkカテゴリのカードで得る防御が1.25倍になる
        if (card.cat === "blk" && player.status && player.status.meditation > 0) {
            blockGain = Math.round(blockGain * 1.25);
        }
        player.block += blockGain;
    }

//回復〇
    if (card.type === "heal") {
	card.value = card.value + (card.cat === "rec" ? comboBonus:0);
        player.hp = Math.min(player.maxHp, player.hp + card.value);
    }

//回復〇＋防御〇
    if (card.type === "healBlock") {
	card.value = card.value + (card.cat === "rec" ? comboBonus:0);
        player.hp = Math.min(player.maxHp, player.hp + card.value);
        player.block += card.valueblock;
    }

//ヒール〇(〇ターン)
    if (card.type === "buffHeal") {
	card.status = card.status + (card.cat === "rec" ? comboBonus:0);
        player.status.heal = card.status;
        player.status.healTurns = card.turn;
    }

//1/3で〇回復、〇で10回復
    if (card.type === "randomHeal") {
        if (Math.random() < (1 / 3)) {
	    card.value = card.value + (card.cat === "rec" ? comboBonus:0);
            player.hp = Math.min(player.maxHp, player.hp + card.value);
        } else {
	    card.value = card.value + (card.cat === "rec" ? comboBonus:0);
            player.hp = Math.min(player.maxHp, player.hp + card.value1);
        }
    }

//自分のHPが〇%以下なら〇回復
    if (card.type === "hpminheal") {
	if (player.hp <= player.maxHp * (card.nowhp * 0.01)) {
	    	card.value = card.value + (card.cat === "rec" ? comboBonus:0);
	    player.hp = Math.min(player.maxHp, player.hp + card.value);
	}
    }

//手札の呪いカードの枚数×5のブロック
if (card.type === "curseWall") {
    let curseCount = window.hand.filter(c => c.cat === "Curse" || c.type === "curse").length;
    let blk = curseCount * 5;
    // 🧘 瞑想：blkカテゴリのカードで得る防御が1.25倍になる
    if (card.cat === "blk" && player.status && player.status.meditation > 0) {
        blk = Math.round(blk * 1.25);
    }
    player.block += blk;
}



    // ----------------
    // 特殊
    // ----------------



// コピー
if (card.type === "nextCopy") {
    window.nextCardCopyActive = true;
    customAlert("次に使用するカードがコピーされます！");
}

//タイムループ(処理はfunction playcard)
    if(card.type==="timeLoop"){
	player.status.timeLoop = 1;
    }

    // ----------------
    // ドロー・エネルギー
    // ----------------

//エネルギーを+〇
    if (card.type === "energy") {
        player.energy += card.value;
    }

// 手札からa枚選択して外し、b枚引く
if (card.type === "DiscardDraw") {

    // 捨てる枚数が0なら、そのままドロー
    if (card.value === 0) {
        drawCards(card.draw);
        if (typeof renderHand === "function") renderHand();
        return;
    }

    if (hand.length <= 1) {
        customAlert("選択できる他の手札がありません。効果をスキップします。");
        return;
    }

    window.discardSelectMode = {
        active: true,
        requiredCount: card.value,
        drawCount: card.draw,
        selectedIndices: [],
        usedCardIndex: index
    };

    customAlert(`手札から外すカードを ${Math.min(card.value, hand.length - 1)} 枚、クリックして選んでください。`);

    if (typeof renderHand === "function") renderHand();
}


//手札が〇枚になるよう引く
    if (card.type === "resetHand") {
        while (hand.length < card.value +1) {
            if (typeof drawOneCard === 'function') drawOneCard();
            if (deck.length === 0 && discardPile.length === 0) break;
        }
    }

//コンボ状態付与
    if (card.type === "comboPlus") {
        player.status.comboPlusTurn = card.duration || card.turn || 2; // 例: 2ターン
        player.status.comboPlusBonus = card.value || 3;    // 例: +3
    }

    // 引き直しの効果
    if (card.type === "redrawAll") {
        // 使用したカード自身（手札に残っている場合）を除く、他の手札の枚数をカウント
        // ※通常、カード使用時はまだ hand 配列に残っているか、直前に除外されているかによりますが
        // 既存の discardSelectMode や handSacrifice 周辺の挙動に合わせ、
        // 「現在の全ての手札（自身を含む）」を捨てて計算する場合は以下のように処理します。
	
        let discardCount = hand.length; 
        
        // 全手札を捨て札に送る
        while(hand.length > 0) {
            let poppedCard = hand.pop();
            discardPile.push(poppedCard);
        }

        // 捨てた枚数 + 1 枚をドローする（山札が足りない場合のシャッフル処理等は既存の drawCard 側が担保）
        let drawCount = discardCount + 1;
        for (let i = 0; i < drawCount; i++) {
            if (typeof drawCard === 'function') {
                drawOneCard();
            }
        }
        customAlert(`手札を ${discardCount} 枚捨て、${drawCount} 枚引き直しました。`);
        
        // 手札のUIを更新する（バトル画面の再描画関数があれば呼び出す）
        if (typeof updateUI === 'function') updateUI();
    }

    // 浄化：デッキ・手札・捨て札から呪いカードを全て除去する（このカード自身は捨て札に送らず除去される）
    if (card.type === "purifyCurse") {
        let removedCount = 0;

        if (typeof deck !== 'undefined') {
            const beforeDeck = deck.length;
            deck = deck.filter(c => c.type !== "curse");
            removedCount += beforeDeck - deck.length;
        }

        const beforeHand = hand.length;
        hand = hand.filter(c => c.type !== "curse");
        removedCount += beforeHand - hand.length;

        if (typeof discardPile !== 'undefined') {
            const beforeDiscard = discardPile.length;
            discardPile = discardPile.filter(c => c.type !== "curse");
            removedCount += beforeDiscard - discardPile.length;
        }

        customAlert(`✨ 浄化！呪いカードを ${removedCount} 枚デッキから除去した！`);

        if (typeof updateUI === 'function') updateUI();
    }



  
renderHand();
}//function 終わり