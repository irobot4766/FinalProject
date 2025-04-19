
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

    return img;
}

player = createImage("Resources/Player/player.png", 100, 340, 200, 200, 100, 100, 3, 10, 2, "idle")

player.idleImage.src = 'Resources/Player/PlayerIdle.png'
player.rightWalkImage.src = 'Resources/Player/PlayerRWalk.png'
player.leftWalkImage.src = 'Resources/Player/PlayerLWalk.png'
player.jabImage.src = 'Resources/Player/PlayerJab.png'

enemy = createImage("Resources/Player/player.png", 700, 340, 200, 200, 100, 100, 10, 10, 2, "idle")

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
    let a = requestAnimationFrame(animateGame);
}

function clear() {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawPlayers() {
    checkPlayerFrame(enemy)

    checkPlayerFrame(player)
    // player src / src x / src y / src width / src height / player x / player y / player width / player height
    ctx.drawImage(player.image, 200 * (player.animationFrame%player.totalAnimationFrames), 0, 200, 200, player.xloc, player.yloc, player.width, player.height)
    ctx.drawImage(enemy.image, 200 * (enemy.animationFrame%enemy.totalAnimationFrames), 0, 200, 200, enemy.xloc, enemy.yloc, enemy.width, enemy.height)
}

function checkPlayerFrame(character) {
    if (!keys.d && !keys.a && !isPunching) character.stance = "idle"

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
    if (!isPunching) {
        if (keys.a) player.xloc -= player.speed
        if (keys.d) {
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
            firstFrame = true
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
        console.log("player 1 jabbed")
        canBlock = false
        firstFrame = true
        punchHold = 24
        isPunching = true
        canPunch = false
        canDodge = false
        player.stance = "jab"
        if (player.xloc + player.width - 60 >= enemy.xloc) {
            enemy.health -= player.damage * 0.75
        }
    }
}

function rPunch() {
    if (canPunch) {
        console.log("player 1 crossed")
        canBlock = false
        punchHold = 10
        isPunching = true
        canPunch = false
        canDodge = false

        if (player.xloc + player.width >= enemy.xloc - 85) {
            enemy.health -= player.damage
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

let yes = true
let firstFrame = true
document.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() === 'a') {
        if (!isPunching) {
            keys.a = true
            keys.d = false
            player.stance = "leftWalk"
        }

    }
    if (e.key.toLowerCase() === 'd') {
        if (!isPunching) {
            keys.a = false
            keys.d = true
            player.stance = "rightWalk"
        }


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
    if (e.key.toLowerCase() === 'k') {
        keys.a = false
        keys.d = false
        lPunch()
    }
    if (e.key.toLowerCase() === 'l') rPunch()
    if (e.key.toLowerCase() === 'm') hook()



})

document.addEventListener("keyup", function(e) {
    if (e.key.toLowerCase() === 'a') {
        keys.a = false
        if (!keys.d && !isPunching) firstFrame = true
    }
    if (e.key.toLowerCase() === 'd') {
        keys.d = false
        if (!keys.a && !isPunching) firstFrame = true
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
