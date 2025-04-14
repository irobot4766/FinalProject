
let canvas = document.getElementById("gameWindow");
let ctx = canvas.getContext("2d");

const createImage = function(src, x, y, w, h, health, damage, defense, speed, stamina) {
    const img = new Image();
    img.src = src
    img.xloc = x
    img.yloc = y
    img.width = w;
    img.height = h;
    img.health = health
    img.damage = damage
    img.defense = defense
    img.speed = speed
    img.stamina = stamina
    return img;
}

player = createImage("Resources/Player/main.png", 100, 340, 140, 200, 100, 10, 10, 2, 100)

function initialize() {
    ctx.drawImage(player, player.xloc, player.yloc, player.width, player.height)
    clear()
    animateGame()
}


function animateGame() {
    clear()
    drawPlayers()
    drawBars()
    movePlayers()
    checkDodge()
    checkPunching()
    checkBlocking()
    a = requestAnimationFrame(animateGame);
}

function clear() {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawPlayers() {
    ctx.drawImage(player, player.xloc, player.yloc, player.width, player.height);
}

function drawBars() {
    ctx.fillStyle = "red"

    ctx.beginPath(); // health bar player
    ctx.moveTo(0, 2);
    ctx.lineTo(450, 2);
    ctx.lineTo(400, 52);
    ctx.lineTo(0, 52);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); //health bar enemy
    ctx.moveTo(960, 2);
    ctx.lineTo(510, 2);
    ctx.lineTo(560, 52);
    ctx.lineTo(960, 52);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#49ff2f"

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(0, 54);
    ctx.lineTo(350, 54);
    ctx.lineTo(325, 79);
    ctx.lineTo(0, 79);
    ctx.closePath();
    ctx.fill()

    ctx.beginPath(); // stamina bar player
    ctx.moveTo(960, 54);
    ctx.lineTo(610, 54);
    ctx.lineTo(635, 79);
    ctx.lineTo(960, 79);
    ctx.closePath();
    ctx.fill()
}

function movePlayers() {
    if (keys.a) player.xloc -= player.speed
    if (keys.d) player.xloc += player.speed
}

let dodgeHold = 0
let isDodging = false
let canDodge = true
let dodgeCooldown = 0
// dodgeHold, isDodging, canDodge, dodgeCooldown
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
    }
}


document.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() === 'a') {
        keys.a = true
        keys.d = false
    }
    if (e.key.toLowerCase() === 'd') {
        keys.a = false
        keys.d = true
    }
    if (e.key === ' ') dodge()
    if (e.key.toLowerCase() === 's' && canBlock) {
        if (!keys.blocking) {
            player.speed /= 2
            player.width -= 20
            keys.blocking = true
            isBlocking = true
        }
    }
    if (e.key.toLowerCase() === 'k') lPunch()
    if (e.key.toLowerCase() === 'l') rPunch()
    if (e.key.toLowerCase() === 'm') hook()



})

document.addEventListener("keyup", function(e) {
    if (e.key.toLowerCase() === 'a') keys.a = false
    if (e.key.toLowerCase() === 'd') keys.d = false
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
