
let canvas = document.getElementById("gameWindow");
let ctx = canvas.getContext("2d");

const createImage = function(src, x, y, w, h, health, stamina, damage, defense, speed, stamina, stance, idle, rWalk, lWalk) {
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
    img.stamina = stamina
    img.stance = stance


    return img;
}

let playerImage = "Resources/Player/player.png"
player = createImage(playerImage, 100, 340, 140, 200, 100, 100, 3, 10, 2, 100, "idle")
enemy = createImage("Resources/Enemy/enemy.png", 700, 340, 140, 200, 100, 100, 10, 10, 2, 100, "idle")

const playerIdleImage = new Image();
playerIdleImage.src = 'Resources/Player/PlayerIdle.png'

const playerRightWalkImage = new Image();
playerRightWalkImage.src = 'Resources/Player/PlayerRWalk.png'

const playerLeftWalkImage = new Image();
playerLeftWalkImage.src = 'Resources/Player/PlayerLWalk.png'


function initialize() {
    ctx.drawImage(player, player.xloc, player.yloc, player.width, player.height)
    ctx.drawImage(enemy, enemy.xloc, enemy.yloc, enemy.width, enemy.height)
    clear()
    animateGame()
}


function animateGame() {
    clear()
    drawPlayers()
    drawBars()
    movePlayers()
    checkCollision()
    checkDodge()
    checkPunching()
    checkBlocking()
    animateHealth()
    animateStamina()
    let a = requestAnimationFrame(animateGame);
}

function clear() {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawPlayers() {
    checkPlayerFrame(player)
    // player src / src x / src y / src width / src height / player x / player y / player width / player height
    ctx.drawImage(playerImage, 140 * (playerAnimationFrame%playerTotalAnimationFrames), 0, 140, 200, player.xloc, player.yloc, player.width, player.height)
    ctx.drawImage(enemy, enemy.xloc, enemy.yloc, enemy.width, enemy.height)
}

let playerTotalAnimationFrames = 2
let playerAnimationFrame = 1
let playerFrame = 0
function checkPlayerFrame(character) {
    if (!keys.d && !keys.a) character.stance = "idle"

    if (character.stance === "idle") {
        playerTotalAnimationFrames = 2
        playerImage = playerIdleImage
        playerFrame += 1
        if (playerFrame > 25) {
            playerAnimationFrame += 1
            playerFrame = 0
        }
    }
    if (character.stance === "rightWalk") {
        playerTotalAnimationFrames = 10
        playerImage = playerRightWalkImage
        if (firstFrame) {
            playerFrame = 0
            playerAnimationFrame = 0
            firstFrame = false
        }
        if (playerFrame >= 4) {
            playerAnimationFrame += 1
            playerFrame = 0
        }
        playerFrame += 1
    }
    if (character.stance === "leftWalk") {
        playerTotalAnimationFrames = 10
        playerImage = playerLeftWalkImage

        playerFrame += 1
        if (playerFrame >= 4) {
            playerAnimationFrame += 1
            playerFrame = 0
        }
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
    ctx.moveTo(0, 2);
    ctx.lineTo(450, 2);
    ctx.lineTo(400, 52);
    ctx.lineTo(0, 52);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // health bar border enemy
    ctx.moveTo(960, 2);
    ctx.lineTo(510, 2);
    ctx.lineTo(560, 52);
    ctx.lineTo(960, 52);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#474747"

    ctx.beginPath(); // full health bar enemy
    ctx.moveTo(5, 7);
    ctx.lineTo(435, 7);
    ctx.lineTo(395, 47);
    ctx.lineTo(5, 47);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // full health bar enemy
    ctx.moveTo(955, 7);
    ctx.lineTo(525, 7);
    ctx.lineTo(565, 47);
    ctx.lineTo(955, 47);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ff4141"

    ctx.beginPath(); // real health bar player
    ctx.moveTo(5, 7);
    ctx.lineTo(playerHurtIndicatorTX, 7);
    ctx.lineTo(playerHurtIndicatorBX, 47);
    ctx.lineTo(5, 47);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // real health bar enemy
    ctx.moveTo(955, 7);
    ctx.lineTo(enemyHurtIndicatorTX, 7);
    ctx.lineTo(enemyHurtIndicatorBX, 47);
    ctx.lineTo(955, 47);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#cc0000"

    ctx.beginPath(); // real health bar player
    ctx.moveTo(5, 7);
    ctx.lineTo(playerHealthTX, 7);
    ctx.lineTo(playerHealthBX, 47);
    ctx.lineTo(5, 47);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // real health bar enemy
    ctx.moveTo(955, 7);
    ctx.lineTo(enemyHealthTX, 7);
    ctx.lineTo(enemyHealthBX, 47);
    ctx.lineTo(955, 47);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#000000" //cutoff


    ctx.beginPath(); // stamina bar player
    ctx.moveTo(0, 52);
    ctx.lineTo(365, 52);
    ctx.lineTo(333, 85);
    ctx.lineTo(0, 85);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(960, 52);
    ctx.lineTo(595, 52);
    ctx.lineTo(625, 85);
    ctx.lineTo(960, 85);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#474747"

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(5, 54);
    ctx.lineTo(355, 54);
    ctx.lineTo(330, 79);
    ctx.lineTo(5, 79);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar enemy
    ctx.moveTo(955, 54);
    ctx.lineTo(605, 54);
    ctx.lineTo(630, 79);
    ctx.lineTo(955, 79);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#ff4141"

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(5, 54);
    ctx.lineTo(playerStaminaIndicatorTX, 54);
    ctx.lineTo(playerStaminaIndicatorBX, 79);
    ctx.lineTo(5, 79);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar enemy
    ctx.moveTo(955, 54);
    ctx.lineTo(enemyStaminaIndicatorTX, 54);
    ctx.lineTo(enemyStaminaIndicatorBX, 79);
    ctx.lineTo(955, 79);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#49ff2f"

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(5, 54);
    ctx.lineTo(playerStaminaTX, 54);
    ctx.lineTo(playerStaminaBX, 79);
    ctx.lineTo(5, 79);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar enemy
    ctx.moveTo(955, 54);
    ctx.lineTo(enemyStaminaTX, 54);
    ctx.lineTo(enemyStaminaBX, 79);
    ctx.lineTo(955, 79);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#000000" //cutoff
    ctx.fillRect(0, 7, 5, 77);
    ctx.fillRect(955, 7, 5, 77);
}

function movePlayers() {
    if (keys.a) player.xloc -= player.speed
    if (keys.d) {
        player.xloc += player.speed
        if (player.xloc + player.width > enemy.xloc) {
            player.xloc -= player.speed
        }
    }
}

function checkCollision() {
    if (enemy.xloc < player.xloc + player.width) {
        enemy.xloc += enemy.speed
    }
}

let dodgeHold = 0
let isDodging = false
let canDodge = true
let dodgeCooldown = 0

function checkDodge() {
    if (isDodging) {
        dodgeHold -= 1
        if (dodgeHold === 0) {
            player.height += 100
            player.yloc -= 100
            isDodging = false
            dodgeCooldown = 60
            canPunch = true
            canBlock = true
        }
    }

    if (!canDodge) {
        dodgeCooldown -= 1
        if (dodgeCooldown === 0) {
            canDodge = true
        }
    }
}

function dodge() {
    if (canDodge) {
        console.log("player 1 dodge")
        canBlock = false
        player.height -= 100
        player.yloc += 100
        dodgeHold = 15
        isDodging = true
        canDodge = false
        canPunch = false
    }
}

let canPunch = true
let isPunching = false
let punchHold = 0
let punchCooldown = 0

function checkPunching() {
    if (isPunching) {
        punchHold -= 1
        if (punchHold === 0) {
            punchCooldown = 30
            isPunching = false
            canDodge = true
            canBlock = true
        }
    }

    if (!canPunch) {
        punchCooldown -= 1
        if (punchCooldown === 0) {
            canPunch = true
        }
    }
}

let canBlock = true
let isBlocking = false
function checkBlocking() {
    if (!canBlock && isBlocking) {
        player.speed *= 2
        player.width += 20
        keys.blocking = false
        isBlocking = false
    }
}

function lPunch() {
    if (canPunch) {
        console.log("player 1 crossed")
        canBlock = false
        punchHold = 10
        isPunching = true
        canPunch = false
        canDodge = false

        if (player.xloc + player.width >= enemy.xloc - 75) {
            enemy.health -= player.damage
        }
    }
}

function rPunch() {
    if (canPunch) {
        console.log("player 1 jabbed")
        canBlock = false
        punchHold = 10
        isPunching = true
        canPunch = false
        canDodge = false

        if (player.xloc + player.width >= enemy.xloc - 85) {
            enemy.health -= player.damage * 0.75
        }
    }
}

function hook() {
    if (canPunch) {
        console.log("player 1 hooked")
        canBlock = false
        punchHold = 20
        isPunching = true
        canPunch = false
        canDodge = false

        if (player.xloc + player.width >= enemy.xloc - 40) {
            enemy.health -= player.damage * 2
        }
    }
}


let firstFrame = true
document.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() === 'a') {
        keys.a = true
        keys.d = false
        player.stance = "leftWalk"
        if (firstFrame) {
            playerFrame = 0
            playerAnimationFrame = 0
            firstFrame = false
        }
    }
    if (e.key.toLowerCase() === 'd') {
        keys.a = false
        keys.d = true
        player.stance = "rightWalk"

    }
    if (e.key === ' ') dodge()
    if (e.key.toLowerCase() === 's' && canBlock) {
        if (!keys.blocking) {
            player.speed /= 2
            player.width -= 20
            keys.blocking = true
            isBlocking = true
        }
        yes = false
    }
    if (e.key.toLowerCase() === 'k') lPunch()
    if (e.key.toLowerCase() === 'l') rPunch()
    if (e.key.toLowerCase() === 'm') hook()



})

document.addEventListener("keyup", function(e) {
    if (e.key.toLowerCase() === 'a') {
        keys.a = false
        if (!keys.d) firstFrame = true
    }
    if (e.key.toLowerCase() === 'd') {
        keys.d = false
        if (!keys.a) firstFrame = true
    }
    if (e.key.toLowerCase() === 's' && keys.blocking) {
        player.speed *= 2
        player.width += 20
        keys.blocking = false
        isBlocking = false
    }
})

keys = {
    a: false,
    d: false,
    blocking: false
}
