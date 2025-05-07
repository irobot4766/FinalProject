
let canvas = document.getElementById("gameWindow");
let ctx = canvas.getContext("2d", {antialias: false});
ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated"; // For modern browsers
let menu = document.getElementById("playAgainMenu");

const createImage = function(src, x, y, w, h, health, stamina, damage, defense, speed, stance) {
    const img = new Image();
    img.src = src
    img.xloc = x
    img.yloc = y
    img.width = w;
    img.height = h;
    img.health = health
    img.stamina = stamina
    img.damage = damage
    img.defense = defense
    img.speed = speed
    img.stance = stance

    img.idleImage = new Image()
    img.rightWalkImage = new Image()
    img.leftWalkImage = new Image()
    img.jabImage = new Image()
    img.crossImage = new Image()
    img.dodgeImage = new Image()
    img.blockImage = new Image()
    img.blockRImage = new Image()
    img.blockLImage = new Image()
    img.image = img.idleImage

    img.totalAnimationFrames = 2
    img.animationFrame = 0
    img.frame = 0

    img.canPunch = true
    img.isPunching = false
    img.punchHold = 0
    img.punchFrames = 0
    img.punchHit = 0
    img.punchCooldown = 0
    img.damageMultiplier = 1
    img.punchDistance = 60

    img.keys = {
        a: false,
        d: false,
        blocking: false
    }


    img.dodgeHold = 0
    img.isDodging = false
    img.canDodge = true
    img.dodgeCooldown = 0

    img.canBlock = true
    img.isBlocking = false

    img.firstFrame = true

    return img;
}

player = createImage("Resources/Player/player.png", 100, 240, 200, 200, 100, 100, 10, 0, 2, "idle")

player.idleImage.src = 'Resources/Player/PlayerIdle.png'
player.rightWalkImage.src = 'Resources/Player/PlayerRWalk.png'
player.leftWalkImage.src = 'Resources/Player/PlayerLWalk.png'
player.jabImage.src = 'Resources/Player/PlayerJab.png'
player.crossImage.src = 'Resources/Player/playerCross.png'
player.dodgeImage.src = 'Resources/Player/playerDodge.png'
player.blockImage.src = 'Resources/Player/playerBlock.png'
player.blockRImage.src = 'Resources/Player/blockRight.png'
player.blockLImage.src = 'Resources/Player/blockLeft.png'

enemy = createImage("Resources/Enemy/enemy.png", 700, 240, 200, 200, 100, 100, 10, 0, 2, "idle")

enemy.idleImage.src = 'Resources/Enemy/enemyIdle.png'
enemy.leftWalkImage.src = 'Resources/Enemy/enemyWalkLeft.png'
enemy.rightWalkImage.src = 'Resources/enemy/enemyWalkRight.png'
enemy.jabImage.src = 'Resources/enemy/enemyJab.png'
enemy.crossImage.src = 'Resources/enemy/enemyCross.png'
enemy.dodgeImage.src = 'Resources/enemy/enemyDodge.png'
enemy.blockImage.src = 'Resources/enemy/enemyBlock.png'
enemy.blockRImage.src = 'Resources/enemy/EBlockRight.png'
enemy.blockLImage.src = 'Resources/enemy/EBlockLeft.png'

let enemyStyles = {
    moveStyle: "neutral", // either maintaining distance, closing distance, or neutral
    idleStyle: "neutral", // either defensive w/ guard, neutral, or counter-ready
    counterStyle: "counter", // either dodging to escape, or dodging to counter
    attackStyle: "poke", //poke, burst, counter, pressure
    timingStyle: "instant" //slow, or instant
}

function initialize() {
    ctx.drawImage(player, player.xloc, player.yloc, player.width, player.height)
    ctx.drawImage(enemy, enemy.xloc, enemy.yloc, enemy.width, enemy.height)
    clear()
    player.health = 100
    player.stamina = 100
    enemy.health = 100
    enemy.stamina = 100
    game = true
    gameOverYloc = 300
    resultsYloc = 300
    playAgainYloc = 300
    time = 180
    player.xloc = 100
    enemy.xloc = 700
    resultsDisplayed = false
    animateGame()
}

function playAgainF() {
    cancelAnimationFrame(animateLoop)
    document.getElementById("playAgainMenu").style.display = 'none'
    initialize()
}

let playerDodge = 0
let playerTextHold = 0
let enemyDodge = 0
let enemyTextHold = 0

function dodgeConfirmAnimation() {
    if (playerDodge > 0) playerDodge -= 2
    if (playerTextHold > 0 || playerDodge > 0) {
        playerTextHold -= 1
    }
    if (enemyDodge > 0) enemyDodge -= 2
    if (enemyTextHold > 0 || enemyDodge > 0) {
        enemyTextHold -= 1
    }

    ctx.fillStyle = "#ff8103"
    ctx.textAlign = "center";
    ctx.strokeStyle = 'black'
    ctx.miterLimit = 2;
    ctx.lineJoin = 'circle';
    ctx.globalAlpha = playerTextHold * 0.02;
    if (playerDodge > 0 || playerTextHold > 0) {
        ctx.lineWidth = 5;
        ctx.font = (45 + playerDodge) + "px 'Press Start 2P'";
        ctx.strokeText("DODGED!", 200, 230);
        ctx.lineWidth = 1;
        ctx.fillText("DODGED!", 200, 230);
    }
    ctx.globalAlpha = enemyTextHold * 0.02;
    if (enemyDodge > 0 || enemyTextHold > 0) {
        ctx.lineWidth = 5;
        ctx.font = (45 + enemyDodge) + "px 'Press Start 2P'";
        ctx.strokeText("DODGED!", 800, 230);
        ctx.lineWidth = 1;
        ctx.fillText("DODGED!", 800, 230);
    }

    ctx.globalAlpha = 1
}

let gameOver = 0
let gameOverHold = 0
let gameOverYloc = 300

function gameOverAnimation() {
    if (gameOver > 0) gameOver -= 2

    if (gameOverHold > 0 || gameOver > 0) {
        gameOverHold -= 1
        gameOverYloc -= 1
    }

    ctx.fillStyle = "#ffffff"
    if (!game) {
        ctx.lineWidth = 5;
        ctx.font = (65 + gameOver) + "px 'Press Start 2P'";
        ctx.strokeText("GAME OVER!", canvas.width/2, gameOverYloc);
        ctx.lineWidth = 1;
        ctx.fillText("GAME OVER!", canvas.width/2, gameOverYloc);
    }
    ctx.globalAlpha = 1;

}


let results = 0
let resultsHold = 0
let resultsYloc = 300
let resultsDisplayed = false

let playAgain = 0
let playAgainHold = 0
let playAgainYloc = 300
let winner
//
//
// function resultsAnimation() {
//     if (results > 0) results -= 2
//
//     if (resultsHold > 0 || results > 0) {
//         resultsHold -= 1
//         resultsYloc -= 1
//     }
//
//     if (player.health > enemy.health) winner = 1
//     else winner = 2
//
//     ctx.fillStyle = "#ff0000"
//     if (gameOverHold === 80) {
//         results = 20
//         resultsHold = 100
//     }
//     if (!game && gameOverHold < 80) {
//         ctx.lineWidth = 5;
//         ctx.font = (30 + results) + "px 'Press Start 2P'";
//         ctx.strokeText("Player " + winner + " Wins!", canvas.width/2, resultsYloc);
//         ctx.lineWidth = 1;
//         ctx.fillText("Player " + winner + " Wins!", canvas.width/2, resultsYloc);
//     }
//     ctx.globalAlpha = 1;
//
// }

function mainMenu() {
    document.getElementById("gameWindow").style.display = 'none'
    document.getElementById("playAgainMenu").style.display = 'none'
    document.getElementById("title-screen").style.display = 'block'
    cancelAnimationFrame(animateLoop)
}

function resultsAnimation() {
    if (results > 0) results -= 2
    if (playAgain > 0) playAgain -= 2

    if (resultsHold > 0 || results > 0) {
        resultsHold -= 1
        resultsYloc -= 1
    }

    if (playAgainHold > 0 || playAgain > 0) {
        playAgainHold -= 1
        playAgainYloc -= 1
    }

    if (player.health > enemy.health) winner = 1
    else winner = 2

    ctx.fillStyle = "#ffffff"
    if (gameOverHold === 80) {
        results = 20
        resultsHold = 100
        resultsDisplayed = true
    }

    if (resultsHold === 20) {
        playAgain = 20
        playAgainHold = 20
        menu.style.display = 'block'
    }

    if (!game && gameOverHold < 80) {
        ctx.lineWidth = 5;
        ctx.font = (30 + results) + "px 'Press Start 2P'";
        ctx.strokeText("Player " + winner + " Wins!", canvas.width / 2, resultsYloc);
        if (!game && resultsHold < 20 && resultsDisplayed) {
            ctx.font = (45 + playAgain) + "px 'Press Start 2P'";
            ctx.strokeText("Play Again?", canvas.width / 2, playAgainYloc);
        }
        ctx.lineWidth = 1;
        ctx.font = (30 + results) + "px 'Press Start 2P'";
        ctx.fillText("Player " + winner + " Wins!", canvas.width / 2, resultsYloc);
        if (!game && resultsHold < 20 && resultsDisplayed) {
            ctx.font = (45 + playAgain) + "px 'Press Start 2P'";
            ctx.fillText("Play Again?", canvas.width / 2, playAgainYloc);
        }
    }

    ctx.globalAlpha = 1;

}

function animateGame() {
    clear()
    drawPlayers()
    dodgeConfirmAnimation()
    drawBars()
    if (game) {
        movePlayers(player)
        enemyController()
        movePlayers(enemy)
        checkCollision()
        checkDodge(player)
        checkDodge(enemy)
        checkPunching(player)
        checkPunching(enemy)
        checkBlocking(player)
        checkBlocking(enemy)
        staminaRegen()
        reduceTime()
        determineEnemyStyle()
    } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    gameOverAnimation()
    resultsAnimation()
    animateHealth()
    animateStamina()
    animateLoop = requestAnimationFrame(animateGame);
}

function determineEnemyStyle() {
    if (enemy.health >= player.health) { //movement
        if (timeFrame%60 === 0) {
            if (Math.random() > 0.1) enemyStyles.moveStyle = "aggressive"
            else enemyStyles.moveStyle = "neutral"
            if (time < 45) enemyStyles.moveStyle = "aggressive"
        }
    } else {
        if (time%3 === 0) {
            if (Math.random() > 0.5) enemyStyles.moveStyle = "neutral"
            else if (Math.random() > 0.5) enemyStyles.moveStyle = "passive"
            else enemyStyles.moveStyle = "aggressive"

            if (player.stamina < enemy.stamina - 30) enemyStyles.moveStyle = "aggressive"
        }
    }
    if (Math.random() > 0.5) {
        if (frame%90 === 0 && enemy.health > 50) {
            let rNum = Math.random()
            if (rNum > 0.66) enemyStyles.idleStyle = "guard"
            else if (rNum > 0.33) enemyStyles.idleStyle = "neutral"
            else enemyStyles.idleStyle = "counter"
        } else if (frame%90 === 0) {
            if (Math.random() > 0.33) enemyStyles.idleStyle = "guard"
            else enemyStyles.idleStyle = "neutral"
        }
    } else {
        if (frame%90 === 0) {
            if (enemy.health < player.health) enemyStyles.idleStyle = "counter"
            if (enemy.stamina < 50) enemyStyles.idleStyle = "guard"
            if (player.health < enemy.health) enemyStyles.idleStyle = "neutral"
            if (enemy.xloc + player.punchDistance <= player.xloc + player.width && enemy.stamina < 75) enemyStyles.idleStyle = "guard"
        }
    }

    //counter
    if (enemyStyles.moveStyle === "aggressive") enemyStyles.counterStyle = "counter"
    else enemyStyles.counterStyle = "escape"

    if (enemy.stamina > player.stamina) enemyStyles.attackStyle = "poke"
    else enemyStyles.attackStyle = "pressure"
}

function enemyController() {
    //enemy.xloc + player.punchDistance <= player.xloc + player.width
    console.log(enemyStyles.idleStyle)
    if (ai) {
        if (timeFrame === 10 && enemyStyles.moveStyle === "aggressive") {
            if (enemy.xloc - enemy.punchDistance >= player.xloc + player.width) {
                enemy.keys.a = true
                enemy.keys.d = false
            }
            let test = Math.random()
            if (test > 0.7 && player.stamina >= enemy.stamina - 20) {
                enemy.keys.a = false
                enemy.keys.d = true
            }
        }
        if (timeFrame === 10 && enemyStyles.moveStyle === "passive") {
            enemy.keys.a = false
            enemy.keys.d = true
            if (enemy.xloc + enemy.width - 30 >= canvas.width) {
                enemy.keys.a = false
                enemy.keys.d = false
            }
        }
        if (timeFrame === 10 && enemyStyles.moveStyle === "neutral") {
            if (enemy.xloc + enemy.punchDistance < canvas.width/2) {
                enemy.keys.a = false
                enemy.keys.d = true
            } else {
                enemy.keys.a = true
                enemy.keys.d = false
            }
        }

        if (enemy.xloc + player.punchDistance <= player.xloc + player.width && timeFrame%3 === 0){
            let chance = Math.random()
            let timing = 0.3
            if (enemyStyles.timingStyle === "slow") timing = 0.04
            if (chance < timing && enemyStyles.attackStyle === "poke") {
                if (Math.random() > 0.3) lPunch(enemy)
                else rPunch(enemy)
            }
            if (chance < timing && enemyStyles.attackStyle === "pressure") {
                if (Math.random() > 0.3) rPunch(enemy)
                else lPunch(enemy)
            }
        }

        if (enemyStyles.idleStyle === "neutral") {
            enemy.keys.blocking = false
        }
        else enemy.keys.blocking = (enemyStyles.idleStyle === "guard")

        if (player.isPunching && enemy.xloc + player.punchDistance <= player.xloc + player.width && (player.punchFrames - player.punchHit < player.punchHold)) {
            if (enemyStyles.timingStyle === "slow" && Math.random() < 0.05) {
                dodge(enemy)
            } else if (enemyStyles.timingStyle === "instant" && Math.random() < 0.6) {
                dodge(enemy)
            }
        }
    }




}

let game = true
let time = 180
let timeFrame = 0
let frame = 0
let seconds = 0
function reduceTime() {
    if (game) {
        timeFrame++
        frame++
        if (timeFrame === 60) {
            time--
            timeFrame = 0
        }
    }
    if (time === 0 || player.health <= 0 || enemy.health <= 0) {
        game = false
        player.keys.a = false
        player.keys.d = false
        enemy.keys.a = false
        enemy.keys.d = false
        gameOver = 25
        gameOverHold = 150
        if (!(player.stance === "block")) {
            player.stance = "idle"
        }
        if (!(enemy.stance === "block")) {
            enemy.stance = "idle"
        }
    }

}

let background = new Image()
background.src = "Resources/Background/background.png"

let clock = new Image()
clock.src = "Resources/Background/clock.png"

function clear() {
    ctx.drawImage(background, 76, 0, 960, 540, 0, 0, 960, 540)
    ctx.drawImage(clock, 0, 0, 258, 200, 285, 0, 387, 300)
}

function drawPlayers() {
    checkPlayerFrame(enemy)
    checkPlayerFrame(player)
    // player src / src x / src y / src width / src height / player x / player y / player width / player height
    ctx.drawImage(player.image, 200 * (player.animationFrame%player.totalAnimationFrames), 0, 200, 200, player.xloc, player.yloc, player.width, player.height)
    ctx.drawImage(enemy.image, 200 * (enemy.animationFrame%enemy.totalAnimationFrames), 0, 200, 200, enemy.xloc, enemy.yloc, enemy.width, enemy.height)
}

function staminaRegen() {
    player.stamina += .1
    if (player.stamina > 100) player.stamina = 100
    enemy.stamina += .1
    if (enemy.stamina > 100) enemy.stamina = 100

}

function checkPlayerFrame(character) {
    if (!character.keys.d && !character.keys.a && !character.isPunching && !character.isDodging && !character.isBlocking) character.stance = "idle"
    if (character.keys.d && !character.keys.a && !character.isPunching && !character.isDodging && !character.isBlocking) character.stance = "rightWalk"
    if (character.keys.a && !character.keys.d && !character.isPunching && !character.isDodging && !character.isBlocking) character.stance = "leftWalk"
    if (character.isBlocking && !character.keys.a && !character.keys.d) character.stance = "block"
    if (character.isBlocking && !character.keys.a && character.keys.d) character.stance = "blockRight"
    if (character.isBlocking && character.keys.a && !character.keys.d) character.stance = "blockLeft"

    if (character.stance === "idle") {
        character.totalAnimationFrames = 2
        character.image = character.idleImage
        character.frame += 1
        if (character.frame > 25) {
            character.animationFrame += 1
            character.frame = 0
        }
    }
    if (character.stance === "block") {
        character.totalAnimationFrames = 2
        character.image = character.blockImage
        character.frame += 1
        if (character.frame > 25) {
            character.animationFrame += 1
            character.frame = 0
        }
    }
    if (character.stance === "rightWalk") {
        character.totalAnimationFrames = 10
        character.image = character.rightWalkImage
        if (character.frame >= 4) {
            character.animationFrame += 1
            character.frame = 0
        }
        character.frame += 1
    }
    if (character.stance === "blockRight") {
        character.totalAnimationFrames = 10
        character.image = character.blockRImage
        if (character.frame >= 4) {
            character.animationFrame += 1
            character.frame = 0
        }
        character.frame += 1
    }
    if (character.stance === "leftWalk") {
        character.totalAnimationFrames = 10
        character.image = character.leftWalkImage

        character.frame += 1
        if (character.frame >= 4) {
            character.animationFrame += 1
            character.frame = 0
        }
    }
    if (character.stance === "blockLeft") {
        character.totalAnimationFrames = 10
        character.image = character.blockLImage

        character.frame += 1
        if (character.frame >= 4) {
            character.animationFrame += 1
            character.frame = 0
        }
    }
    if (character.stance === "jab") {
        character.totalAnimationFrames = 4
        character.image = character.jabImage
        if (character.firstFrame) {
            character.frame = 0
            character.animationFrame = 0
            character.firstFrame = false
        }
        if (character.frame >= 4) {
            character.animationFrame += 1
            character.frame = 0
        }
        character.frame += 1
    }

    if (character.stance === "cross") {
        character.totalAnimationFrames = 6
        character.image = character.crossImage
        if (character.firstFrame) {
            character.frame = 0
            character.animationFrame = 0
            character.firstFrame = false
        }
        if (character.frame >= 4) {
            character.animationFrame += 1
            character.frame = 0
        }
        character.frame += 1
    }

    if (character.stance === "dodge") {
        character.totalAnimationFrames = 4
        character.image = character.dodgeImage
        if (character.firstFrame) {
            character.frame = 0
            character.animationFrame = 0
            character.firstFrame = false
        }
        if (character.frame >= 6) {
            character.animationFrame += 1
            character.frame = 0
        }
        character.frame += 1
    }


}

let playerHealthTX = 435
let playerHealthBX = 395

let playerStaminaTX = 355
let playerStaminaBX = 330

let enemyHealthTX = 525
let enemyHealthBX = 565

let enemyStaminaTX = 605
let enemyStaminaBX = 630

let playerHurtIndicatorTX = 435
let playerHurtIndicatorBX = 395

let playerStaminaIndicatorTX = 355
let playerStaminaIndicatorBX = 330

let enemyHurtIndicatorTX = 525
let enemyHurtIndicatorBX = 565

let enemyStaminaIndicatorTX = 605
let enemyStaminaIndicatorBX = 630

function animateHealth() {
    if (player.health > 100) player.health = 100
    if (enemy.health > 100) enemy.health = 100

    //ratio for player is 100 to 435
    playerHealthTX += (5 + (player.health * 4.3) - playerHealthTX) * 0.1
    playerHealthBX = playerHealthTX - 40

    enemyHealthTX += ((955 - (enemy.health * 4.3)) - enemyHealthTX) * 0.1
    enemyHealthBX = enemyHealthTX + 40

    playerHurtIndicatorTX += (5 + (player.health * 4.3) - playerHurtIndicatorTX) * 0.025
    playerHurtIndicatorBX = playerHurtIndicatorTX - 40

    enemyHurtIndicatorTX += ((955 - (enemy.health * 4.3)) - enemyHurtIndicatorTX) * 0.025
    enemyHurtIndicatorBX = enemyHurtIndicatorTX + 40
}

function animateStamina() {
    playerStaminaTX += (5 + (player.stamina * 3.5) - playerStaminaTX) * 0.1
    playerStaminaBX = playerStaminaTX - 25

    enemyStaminaTX += ((955 - (enemy.stamina * 3.5)) - enemyStaminaTX) * 0.1
    enemyStaminaBX = enemyStaminaTX + 25

    playerStaminaIndicatorTX += (5 + (player.stamina * 3.5) - playerStaminaIndicatorTX) * 0.025
    playerStaminaIndicatorBX = playerStaminaIndicatorTX - 25

    enemyStaminaIndicatorTX += ((955 - (enemy.stamina * 3.5)) - enemyStaminaIndicatorTX) * 0.025
    enemyStaminaIndicatorBX = enemyStaminaIndicatorTX + 25
}

function drawBars() {
    ctx.fillStyle = "#000000"

    ctx.beginPath(); // health bar border player
    ctx.moveTo(0, 0);
    ctx.lineTo(450, 0);
    ctx.lineTo(400, 50);
    ctx.lineTo(0, 50);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // health bar border enemy
    ctx.moveTo(960, 0);
    ctx.lineTo(510, 0);
    ctx.lineTo(560, 50);
    ctx.lineTo(960, 50);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#474747"

    ctx.beginPath(); // full health bar enemy
    ctx.moveTo(5, 5);
    ctx.lineTo(435, 5);
    ctx.lineTo(395, 45);
    ctx.lineTo(5, 45);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // full health bar enemy
    ctx.moveTo(955, 5);
    ctx.lineTo(525, 5);
    ctx.lineTo(565, 45);
    ctx.lineTo(955, 45);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ff4141"

    ctx.beginPath(); // real health bar player
    ctx.moveTo(5, 5);
    ctx.lineTo(playerHurtIndicatorTX, 5);
    ctx.lineTo(playerHurtIndicatorBX, 45);
    ctx.lineTo(5, 45);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // real health bar enemy
    ctx.moveTo(955, 5);
    ctx.lineTo(enemyHurtIndicatorTX, 5);
    ctx.lineTo(enemyHurtIndicatorBX, 45);
    ctx.lineTo(955, 45);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#cc0000"

    ctx.beginPath(); // real health bar player
    ctx.moveTo(5, 5);
    ctx.lineTo(playerHealthTX, 5);
    ctx.lineTo(playerHealthBX, 45);
    ctx.lineTo(5, 45);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // real health bar enemy
    ctx.moveTo(955, 5);
    ctx.lineTo(enemyHealthTX, 5);
    ctx.lineTo(enemyHealthBX, 45);
    ctx.lineTo(955, 45);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#000000" //cutoff


    ctx.beginPath(); // stamina bar player
    ctx.moveTo(0, 50);
    ctx.lineTo(365, 50);
    ctx.lineTo(333, 83);
    ctx.lineTo(0, 83);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(960, 50);
    ctx.lineTo(595, 50);
    ctx.lineTo(625, 83);
    ctx.lineTo(960, 83);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#474747"

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(5, 52);
    ctx.lineTo(355, 52);
    ctx.lineTo(330, 77);
    ctx.lineTo(5, 77);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar enemy
    ctx.moveTo(955, 52);
    ctx.lineTo(605, 52);
    ctx.lineTo(630, 77);
    ctx.lineTo(955, 77);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#ff4141"

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(5, 52);
    ctx.lineTo(playerStaminaIndicatorTX, 52);
    ctx.lineTo(playerStaminaIndicatorBX, 77);
    ctx.lineTo(5, 77);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar enemy
    ctx.moveTo(955, 52);
    ctx.lineTo(enemyStaminaIndicatorTX, 52);
    ctx.lineTo(enemyStaminaIndicatorBX, 77);
    ctx.lineTo(955, 77);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#49ff2f"

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(5, 52);
    ctx.lineTo(playerStaminaTX, 52);
    ctx.lineTo(playerStaminaBX, 77);
    ctx.lineTo(5, 77);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar enemy
    ctx.moveTo(955, 52);
    ctx.lineTo(enemyStaminaTX, 52);
    ctx.lineTo(enemyStaminaBX, 77);
    ctx.lineTo(955, 77);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#000000" //cutoff
    ctx.fillRect(0, 5, 5, 75);
    ctx.fillRect(955, 5, 5, 75);

    ctx.fillStyle = "#b3b3b3" //cutoff
    ctx.textAlign = "center";
    ctx.font = "50px 'Press Start 2P'";
    seconds =  time%60
    if (seconds < 10) seconds = "0" + seconds;
    ctx.fillText(Math.trunc(time/60) + ":" + seconds, 485, 230);
}

function movePlayers(character) {
    let speedModifier = 1
    if (character.keys.d && character === enemy) speedModifier = 0.75
    if (character.keys.a && character === player) speedModifier = 0.75
    if (!character.isPunching && !character.isDodging) {
        if (character.keys.a) character.xloc -= character.speed * speedModifier
        if (character.keys.d) character.xloc += character.speed * speedModifier
        if (player.xloc + player.width - 50 > enemy.xloc + 50) {
            if (character === player && character.keys.d) player.xloc -= player.speed
            else enemy.xloc += enemy.speed
        }
        if (character.xloc + 30 < 0) character.xloc += character.speed //adding 30 because hitbox is not exact
        if (character.xloc + character.width - 30 > canvas.width) character.xloc -= character.speed
    }
}

function checkCollision() {
    // if (enemy.xloc < player.xloc + player.width - 70) {
    //     enemy.xloc += enemy.speed
    // }
}

function checkDodge(character) {
    if (character.isDodging) {
        character.dodgeHold -= 1
        if (character.dodgeHold === 0) {
            character.isDodging = false
            character.dodgeCooldown = 15
            character.canPunch = true
            character.canBlock = true
        }
    }

    if (!character.canDodge) {
        character.dodgeCooldown -= 1
        if (character.dodgeCooldown === 0) {
            character.canDodge = true
        }
    }
}

function dodge(character) {
    if (character.canDodge && character.canPunch && character.stamina > 15) {
        console.log("player 1 dodge")
        character.canBlock = false
        character.isBlocking = false
        character.firstFrame = true
        character.punchHold = 24
        character.punchFrames = character.punchHold
        character.dodgeHold = 24
        character.isDodging = true
        character.canDodge = false
        character.canPunch = false
        character.stance = "dodge"
        character.stamina -= 15
    }
}

function dealDamage(character) {
    if (player.xloc + player.width - player.punchDistance >= enemy.xloc && character === player) {
        if (!enemy.isDodging) {
            enemy.health -= (player.damage * player.damageMultiplier) - enemy.defense
        } else {
            enemy.health += 3
            enemyDodge = 25
            enemyTextHold = 50
        }

    }
    if (enemy.xloc + player.punchDistance <= player.xloc + player.width && character === enemy) {
        if (!player.isDodging) {
            player.health -= (enemy.damage * enemy.damageMultiplier) - player.defense
        } else {
            player.health += 3
            playerDodge = 25
            playerTextHold = 50
        }
    }

}

function checkPunching(character) {
    if (character.isPunching) {
        character.punchHold -= 1
        if (character.punchHold === 0) {
            character.punchCooldown = 5
            character.firstFrame = true
            character.isPunching = false
            character.canDodge = true
            character.canBlock = true
        }
    }

    if (character.punchFrames - character.punchHit === character.punchHold && character.isPunching) dealDamage(character)

    if (!character.canPunch) {
        character.punchCooldown -= 1
        if (character.punchCooldown === 0) {
            character.canPunch = true
        }
    }
}


function checkBlocking(character) {
    if (character.keys.blocking && character.canBlock) {
        character.keys.blocking = true
        character.isBlocking = true
        character.stance = "block"
    } else if (!character.keys.blocking) {
        character.isBlocking = false
    }
    if (!character.canBlock && character.isBlocking) {
        character.keys.blocking = false
        character.isBlocking = false
        console.log('check')
    }
    if (character.isBlocking) {
        character.speed = 1
        character.defense = 3
    } else {
        character.speed = 2
        character.defense = 0
    }
}

function lPunch(character) {
    if (character.canPunch && character.stamina > 15) {
        character.canBlock = false
        character.isBlocking = false
        character.firstFrame = true
        character.punchHold = 16
        character.punchFrames = character.punchHold
        character.punchHit = 10
        character.isPunching = true
        character.canPunch = false
        character.canDodge = false
        character.stance = "jab"
        character.damageMultiplier = 0.75
        character.stamina -= 20
    }
}

function rPunch(character) {
    if (character.canPunch && character.stamina > 25) {
        character.canBlock = false
        character.isBlocking = false
        character.firstFrame = true
        character.punchHold = 24
        character.punchFrames = character.punchHold
        character.punchHit = 10 // change according to actual frame once animated
        character.isPunching = true
        character.canPunch = false
        character.canDodge = false
        character.stance = "cross"
        character.damageMultiplier = 1
        character.stamina -= 25
    }
}

function hook(character) {
    if (character.canPunch && character.stamina > 35) {
        console.log("player 1 hooked")
        character.canBlock = false
        character.isBlocking = false
        character.punchHold = 36
        character.punchFrames = character.punchHold
        character.punchHit = 24 // change according to actual frame once

        // animated
        character.isPunching = true
        character.canPunch = false
        character.canDodge = false
        character.damageMultiplier = 1.5
        character.stamina -= 35
    }
}

document.addEventListener("keydown", function(e) {
    if (game) {
        if (e.key.toLowerCase() === 'a') {
            player.keys.a = true
            player.keys.d = false
        }
        if (e.key.toLowerCase() === 'd') {
            player.keys.a = false
            player.keys.d = true

        }
        if (e.key === ' ') {
            dodge(player)
        }
        if (e.key.toLowerCase() === 's' && player.canBlock) {
            if (!player.keys.blocking) {
                player.keys.blocking = true
                player.isBlocking = true
                player.stance = "block"
            }
            console.log('a')
        }
        if (e.key.toLowerCase() === 'g') {
            lPunch(player)
        }
        if (e.key.toLowerCase() === 'h') {
            rPunch(player)
        }
        if (e.key.toLowerCase() === 'v') hook()

        if (!ai) {
            if (e.key === 'ArrowLeft') {
                enemy.keys.a = true
                enemy.keys.d = false
            }
            if (e.key === 'ArrowRight') {
                enemy.keys.a = false
                enemy.keys.d = true
            }
            if (e.key === '/') {
                dodge(enemy)
            }
            if (e.key=== 'ArrowDown' && enemy.canBlock) {
                if (!enemy.keys.blocking) {
                    enemy.keys.blocking = true
                    enemy.isBlocking = true
                    enemy.stance = "block"
                }
            }
            if (e.key.toLowerCase() === 'k') {
                lPunch(enemy)
            }
            if (e.key.toLowerCase() === 'l') {
                rPunch(enemy)
            }
        }
    }



    if (e.key === "Enter" && !initialized && selected) {
        if (selection === 10) {
            mainMenu()
        } else if (selection === 9) {
            playAgainF()
        } else {
            if (selection === 3) {
                document.getElementById('select1').style.display = 'none'
                document.getElementById('select2').style.display = 'flex'
                document.getElementById('menuText').innerHTML = 'Select Difficulty'
            } else if (selection === 4) {
                //tutorial screen
            } else {
                document.getElementById("gameWindow").style.display = 'block'
                document.getElementById("title-screen").style.display = 'none'
                initialized = true
                initialize()
            }
        }

    }

})

document.addEventListener("keyup", function(e) {
    if (e.key.toLowerCase() === 'a') {
        player.keys.a = false
        if (!player.keys.d && !player.isPunching) player.firstFrame = true
    }
    if (e.key.toLowerCase() === 'd') {
        player.keys.d = false
        if (!player.keys.a && !player.isPunching) player.firstFrame = true
    }
    if (e.key.toLowerCase() === 's' && player.keys.blocking) {
        player.keys.blocking = false
        player.isBlocking = false
    }

    if (!ai) {
        if (e.key === 'ArrowLeft') {
            enemy.keys.a = false
            if (!enemy.keys.d && !enemy.isPunching) enemy.firstFrame = true
        }
        if (e.key === 'ArrowRight') {
            enemy.keys.d = false
            if (!enemy.keys.a && !enemy.isPunching) enemy.firstFrame = true
        }
        if (e.key === 'ArrowDown' && enemy.keys.blocking) {
            enemy.keys.blocking = false
            enemy.isBlocking = false
        }
    }
})

const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'clicked' class from all buttons first
        buttons.forEach(btn => btn.classList.remove('clicked'));
        // Add 'clicked' class to the one you clicked
        button.classList.add('clicked');
    });
});

let selected = false
let selection = 0
let initialized = false
let ai = true

function select(difficulty) {
    selected = true
    if (difficulty < 9) {
        ai = true
        selection = difficulty
        if (difficulty === 0) enemyStyles.timingStyle = "slow"
        else if (difficulty === 1) enemyStyles.timingStyle = "instant"
        else ai = false
    } else {
        initialized = false
    }
    selection = difficulty
}
