
let canvas = document.getElementById("gameWindow");
let ctx = canvas.getContext("2d", {antialias: false});
ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated"; // For modern browsers


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


    img.dodgeHold = 0
    img.isDodging = false
    img.canDodge = true
    img.dodgeCooldown = 0

    img.canBlock = true
    img.isBlocking = false

    img.firstFrame = true

    return img;
}

player = createImage("Resources/Player/player.png", 100, 240, 200, 200, 100, 100, 10, 10, 2, "idle")

player.idleImage.src = 'Resources/Player/PlayerIdle.png'
player.rightWalkImage.src = 'Resources/Player/PlayerRWalk.png'
player.leftWalkImage.src = 'Resources/Player/PlayerLWalk.png'
player.jabImage.src = 'Resources/Player/PlayerJab.png'

enemy = createImage("Resources/Enemy/enemy.png", 700, 240, 200, 200, 100, 100, 10, 10, 2, "idle")

enemy.idleImage.src = 'Resources/Enemy/enemyIdle.png'
enemy.leftWalkImage.src = 'Resources/Enemy/enemyWalkLeft.png'
enemy.rightWalkImage.src = 'Resources/enemy/enemyWalkRight.png'
enemy.jabImage.src = 'Resources/enemy/enemyJab.png'

let enemyStyles = {
    moveStyle: "neutral", // either maintaining distance, closing distance, or neutral
    idleStyle: "neutral", // either defensive w/ guard, neutral, or counter-ready
    counterStyle: "counter", // either dodging to escape, or dodging to counter
    attackStyle: "poke", //poke, burst, counter, pressure
    timingStyle: "instant" //slow, pause, or instant
}



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
    movePlayers(player)
    movePlayers(enemy)
    checkCollision()
    checkDodge(player)
    checkPunching(player)
    checkPunching(enemy)
    checkBlocking(player)
    checkBlocking(enemy)
    animateHealth()
    animateStamina()
    staminaRegen()
    reduceTime()
    let a = requestAnimationFrame(animateGame);
}

let time = 180
let timeFrame = 0
let seconds = 0
function reduceTime() {
    timeFrame++
    if (timeFrame === 60) time--,  timeFrame = 0
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
    if (!character.isPunching) {
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
            character.height += 100
            character.yloc -= 100
            character.isDodging = false
            character.dodgeCooldown = 60
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
    if (character.canDodge) {
        console.log("player 1 dodge")
        character.canBlock = false
        character.height -= 100
        character.yloc += 100
        character.dodgeHold = 15
        character.isDodging = true
        character.canDodge = false
        character.canPunch = false
    }
}

function dealDamage(character) {
    if (player.xloc + player.width - player.punchDistance >= enemy.xloc && character === player) {
        enemy.health -= player.damage * player.damageMultiplier
    }
    if (enemy.xloc - player.punchDistance <= player.xloc + player.width && character === enemy) {
        player.health -= enemy.damage * enemy.damageMultiplier
    }
}

function checkPunching(character) {
    if (character.isPunching) {
        character.punchHold -= 1
        if (character.punchHold === 0) {
            character.punchCooldown = 10
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
    if (!character.canBlock && character.isBlocking) {
        character.speed *= 2
        character.width += 20
        character.keys.blocking = false
        character.isBlocking = false
    }
}

function lPunch(character) {
    if (character.canPunch && character.stamina > 15) {
        character.canBlock = false
        character.firstFrame = true
        character.punchHold = 16
        character.punchFrames = character.punchHold
        character.punchHit = 10
        character.isPunching = true
        character.canPunch = false
        character.canDodge = false
        character.stance = "jab"
        character.damageMultiplier = 0.75
        character.stamina -= 15
    }
}

function rPunch(character) {
    if (character.canPunch && character.stamina > 25) {
        console.log("player 1 crossed")
        character.canBlock = false
        character.punchHold = 24
        character.punchFrames = player.punchHold
        character.punchHit = 10 // change according to actual frame once animated
        character.isPunching = true
        character.canPunch = false
        character.canDodge = false
        character.damageMultiplier = 1
        character.stamina -= 25
    }
}

function hook(character) {
    if (character.canPunch && character.stamina > 35) {
        console.log("player 1 hooked")
        character.canBlock = false
        character.punchHold = 36
        character.punchFrames = character.punchHold
        character.punchHit = 24 // change according to actual frame once animated
        character.isPunching = true
        character.canPunch = false
        character.canDodge = false
        character.damageMultiplier = 1.5
        character.stamina -= 35
    }
}

document.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() === 'a') {
        player.keys.a = true
        player.keys.d = false
        enemy.keys.a = true
        enemy.keys.d = false
    }
    if (e.key.toLowerCase() === 'd') {
        player.keys.a = false
        player.keys.d = true
        enemy.keys.a = false
        enemy.keys.d = true

    }
    if (e.key === ' ') dodge(player)
    if (e.key.toLowerCase() === 's' && player.canBlock) {
        if (!player.keys.blocking) {
            player.speed /= 2
            player.width -= 20
            player.keys.blocking = true
            isBlocking = true
        }
        yes = false
    }
    if (e.key.toLowerCase() === 'k') {
        lPunch(player)
        lPunch(enemy)
    }
    if (e.key.toLowerCase() === 'l') rPunch()
    if (e.key.toLowerCase() === 'm') hook()



})

document.addEventListener("keyup", function(e) {
    if (e.key.toLowerCase() === 'a') {
        player.keys.a = false
        enemy.keys.a = false
        if (!player.keys.d && !player.isPunching) firstFrame = true
    }
    if (e.key.toLowerCase() === 'd') {
        player.keys.d = false
        enemy.keys.d = false
        if (!player.keys.a && !player.isPunching) firstFrame = true
    }
    if (e.key.toLowerCase() === 's' && player.keys.blocking) {
        player.speed *= 2
        player.width += 20
        player.keys.blocking = false
        isBlocking = false
    }
})
