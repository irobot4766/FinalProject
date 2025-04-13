
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


let dodgeInfo = [0, false, true, 0]
// dodgeHold, isDodging, canDodge, dodgeCooldown
function checkDodge() {
    if (dodgeInfo[1]) {
        dodgeInfo[0] -= 1
        if (dodgeInfo[0] === 0) {
            player.height += 100
            player.yloc -= 100
            dodgeInfo[1] = false
            canPunch = true
        }
    }

    if (!dodgeInfo[2]) {
        dodgeInfo[3] -= 1
        if (dodgeInfo[3] === 0) {
            dodgeInfo[2] = true
        }
    }
}

function dodge() {
    if (dodgeInfo[2]) {
        console.log("player 1 dodge")
        player.height -= 100
        player.yloc += 100
        dodgeInfo = [15, true, false, 60]
        canPunch = false
    }
}

let canPunch = true
let isPunching = false
let punchHold = 0
let punchCooldown = 0

function checkPunch() {

}

function lPunch() {
    if (canPunch) {
        console.log("player 1 punched")
        dodgeInfo = [5, true, false, 60]
        canPunch = false
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