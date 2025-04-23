
let canvas = document.getElementById("gameWindow");
let ctx = canvas.getContext("2d");

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
    return img;
}

player = createImage("Resources/Player/player.png", 100, 240, 200, 200, 100, 100, 3, 10, 2, "idle")

player.idleImage.src = 'Resources/Player/PlayerIdle.png'
player.rightWalkImage.src = 'Resources/Player/PlayerRWalk.png'
player.leftWalkImage.src = 'Resources/Player/PlayerLWalk.png'
player.jabImage.src = 'Resources/Player/PlayerJab.png'

enemy = createImage("Resources/Enemy/enemy.png", 700, 240, 200, 200, 100, 100, 10, 10, 2, "idle")

enemy.idleImage.src = 'Resources/Enemy/enemyIdle.png'



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
    staminaRegen()
    let a = requestAnimationFrame(animateGame);
}

let background = new Image()
background.src = "Resources/Background.png"
function clear() {
    ctx.drawImage(background, 76, 0, 960, 540, 0, 0, 960, 540)
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
    if (!character.keys.d && !character.keys.a && !character.isPunching) character.stance = "idle"
    if (character.keys.d && !character.keys.a && !character.isPunching) character.stance = "rightWalk"
    if (character.keys.a && !character.keys.d && !character.isPunching) character.stance = "leftWalk"

    if (character.stance === "idle") {
        character.totalAnimationFrames = 2
        character.image = character.idleImage
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
    if (character.stance === "leftWalk") {
        character.totalAnimationFrames = 10
        character.image = character.leftWalkImage

        character.frame += 1
        if (character.frame >= 4) {
            character.animationFrame += 1
            character.frame = 0
        }
    }

    if (character.stance === "jab") {
        character.totalAnimationFrames = 4
        character.image = character.jabImage
        if (firstFrame) {
            character.frame = 0
            character.animationFrame = 0
            firstFrame = false
        }
        if (character.frame >= 4) {
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
    ctx.fillRect(0, 7, 5, 75);
    ctx.fillRect(955, 7, 5, 75);

    ctx.fillStyle = "#9c9c9c" //cutoff

    ctx.beginPath()
    ctx.moveTo(449, 0);
    ctx.lineTo(511, 0);
    ctx.lineTo(561, 50);
    ctx.lineTo(399, 50);
    ctx.closePath();
    ctx.fill()

    ctx.fillStyle = "#000000" //cutoff

    // try text here
    ctx.textAlign = "center";
    ctx.font = "45px Pixelify Sans";
    ctx.fillText("180", canvas.width / 2, 40);
}

function movePlayers() {
    if (!player.isPunching) {
        if (player.keys.a) player.xloc -= player.speed
        if (player.keys.d) {
            player.xloc += player.speed
            if (player.xloc + player.width - 70 > enemy.xloc) {
                player.xloc -= player.speed
            }
        }
    }

}

function checkCollision() {
    if (enemy.xloc < player.xloc + player.width - 70) {
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
            player.canPunch = true
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
        player.canPunch = false
    }
}

function dealDamage(character) {
    if (player.xloc + player.width - player.punchDistance >= enemy.xloc) {
        enemy.health -= player.damage * player.damageMultiplier
    }
}

function checkPunching() {
    if (player.isPunching) {
        player.punchHold -= 1
        if (player.punchHold === 0) {
            player.punchCooldown = 10
            firstFrame = true
            player.isPunching = false
            canDodge = true
            canBlock = true
        }
    }

    if (player.punchFrames - player.punchHit === player.punchHold && player.isPunching) dealDamage(player)

    if (!player.canPunch) {
        player.punchCooldown -= 1
        if (player.punchCooldown === 0) {
            player.canPunch = true
        }
    }
}

let canBlock = true
let isBlocking = false
function checkBlocking() {
    if (!canBlock && isBlocking) {
        player.speed *= 2
        player.width += 20
        player.keys.blocking = false
        isBlocking = false
    }
}

function lPunch() {
    if (player.canPunch && player.stamina > 15) {
        canBlock = false
        firstFrame = true
        player.punchHold = 16
        player.punchFrames = player.punchHold
        player.punchHit = 10
        player.isPunching = true
        player.canPunch = false
        canDodge = false
        player.stance = "jab"
        player.damageMultiplier = 0.75
        player.stamina -= 15
    }
}

function rPunch() {
    if (player.canPunch && player.stamina > 25) {
        console.log("player 1 crossed")
        canBlock = false
        player.punchHold = 24
        player.punchFrames = player.punchHold
        player.punchHit = 10 // change according to actual frame once animated
        player.isPunching = true
        player.canPunch = false
        canDodge = false
        player.damageMultiplier = 1
        player.stamina -= 25
    }
}

function hook() {
    if (player.canPunch && player.stamina > 35) {
        console.log("player 1 hooked")
        canBlock = false
        player.punchHold = 36
        player.punchFrames = player.punchHold
        player.punchHit = 24 // change according to actual frame once animated
        player.isPunching = true
        player.canPunch = false
        canDodge = false
        player.damageMultiplier = 1.5
        player.stamina -= 35
    }
}

let yes = true
let firstFrame = true
document.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() === 'a') {
        player.keys.a = true
        player.keys.d = false

    }
    if (e.key.toLowerCase() === 'd') {
        player.keys.a = false
        player.keys.d = true

    }
    if (e.key === ' ') dodge()
    if (e.key.toLowerCase() === 's' && canBlock) {
        if (!player.keys.blocking) {
            player.speed /= 2
            player.width -= 20
            player.keys.blocking = true
            isBlocking = true
        }
        yes = false
    }
    if (e.key.toLowerCase() === 'k') {
        lPunch()
    }
    if (e.key.toLowerCase() === 'l') rPunch()
    if (e.key.toLowerCase() === 'm') hook()



})

document.addEventListener("keyup", function(e) {
    if (e.key.toLowerCase() === 'a') {
        player.keys.a = false
        if (!player.keys.d && !player.isPunching) firstFrame = true
    }
    if (e.key.toLowerCase() === 'd') {
        player.keys.d = false
        if (!player.keys.a && !player.isPunching) firstFrame = true
    }
    if (e.key.toLowerCase() === 's' && player.keys.blocking) {
        player.speed *= 2
        player.width += 20
        player.keys.blocking = false
        isBlocking = false
    }
})

