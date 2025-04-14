
let canvas = document.getElementById("gameWindow");
let ctx = canvas.getContext("2d");

const createImage = function(src, x, y, w, h, health, damage, defense, speed) {
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
    return img;
}

player = createImage("Resources/Player/main.png", 100, 340, 140, 200, 100, 10, 10, 2)

function initialize() {
    ctx.drawImage(player, player.xloc, player.yloc, player.width, player.height)
    clear()
    animateGame()
}


function animateGame() {
    clear()
    draw()
    move()
    checkDodge()
    checkPunch()
    a = requestAnimationFrame(animateGame);
}

function clear() {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function draw() {
    ctx.drawImage(player, player.xloc, player.yloc, player.width, player.height);
}

function move() {
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

function checkPunch() {
    if (isPunching) {
        punchHold -= 1
        if (punchHold === 0) {
            punchCooldown = 30
            isPunching = false
            canDodge = true
        }
    }

    if (!canPunch) {
        punchCooldown -= 1
        if (punchCooldown === 0) {
            canPunch = true
        }
    }
}

function lPunch() {
    if (canPunch) {
        console.log("player 1 punched")
        punchHold = 10
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
    if (e.key.toLowerCase() === 'l') lPunch()

})

document.addEventListener("keyup", function(e) {
    if (e.key.toLowerCase() === 'a') keys.a = false
    if (e.key.toLowerCase() === 'd') keys.d = false
})

keys = {
    a: false,
    d: false,

}
