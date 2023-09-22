class Player {
    constructor(ctx, r, x, y) {
        this.x = x;
        this.y = y;
        this.radius = r;
        // hsl(${ Math.random() * 360 }, 100 %, 40 %)
        this.color = 'white';
        this.ctx = ctx;
    }

    draw(ctx = this.ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    move(dir, speed) {
        if (dir === 'up') {
            this.y -= speed;
        } else if (dir === 'down') {
            this.y += speed;
        } else if (dir === 'left') {
            this.x -= speed;
        } else if (dir === 'right') {
            this.x += speed;
        }
    }
}

class Bullet {
    constructor(x, y, r, ctx, angle) {
        this.x = x;
        this.y = y;
        this.radius = r / 5; // Adjust the bullet radius as needed
        this.ctx = ctx;
        this.speed = 5; // Adjust the bullet speed as needed
        this.angle = angle;
        this.color = "red"; // Adjust the bullet color as needed
    }

    move() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
    }

    draw(ctx = this.ctx) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Cannon {
    constructor(x, y, ctx, r, angle, shootingInterval) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.angle = angle;
        this.ctx = ctx;
        this.cannonColor = "white";
        this.shootingInterval = shootingInterval;
        this.minShootingInterval = 500;
        this.maxShootingInterval = 2000;
        this.randomizeShootingTime()
        this.lastShotTime = Date.now();
        this.bullets = [];
    }
    randomizeShootingTime() {
        this.shootingInterval = Math.random() * (this.maxShootingInterval - this.minShootingInterval) + this.minShootingInterval;
    }

    draw(ctx = this.ctx) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.cannonColor;
        ctx.fillStyle = this.cannonColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.shadowColor = this.cannonColor;
        ctx.arc(this.x, this.y, this.radius / 1.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = this.cannonColor;
        ctx.shadowColor = this.cannonColor;
        // cannon barrel with angle
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillRect(this.radius / 1.2, -this.radius / 4, this.radius * 1.2, this.radius / 2);
        ctx.rotate(-this.angle);
        ctx.translate(-this.x, -this.y);
        ctx.shadowBlur = 0;
    }

    shoot(playerX, playerY) {
        if (Date.now() - this.lastShotTime > this.shootingInterval) {
            const angle = Math.atan2(playerY - this.y, playerX - this.x);
            const bullet = new Bullet(this.x, this.y, this.radius, this.ctx, angle);
            this.bullets.push(bullet);
            this.lastShotTime = Date.now();
            this.randomizeShootingTime();
        }
    }

    updateBullets() {
        this.bullets.forEach(bullet => {
            bullet.move();
            bullet.draw();
        });
    }
}


const start_btn = document.getElementById('start_btn');
const Game = {
    canvas: document.getElementById('canvas'),
    ctx: canvas.getContext('2d'),
    width: canvas.width,
    height: canvas.height,
    fps: 100,
    framesCounter: 0,
    playerKeys: {
        TOP_KEY: 38,
        BOTTOM_KEY: 40,
        LEFT_KEY: 37,
        RIGHT_KEY: 39
    },
    init: function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth * .98;
        this.height = window.innerHeight * .98;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

    },
    start: function () {
        this.reset();
        this.interval = setInterval(() => {
            this.clear();
            this.drawAll();
            this.checkCollisions();
            if (this.framesCounter > 0) this.framesCounter = 0;
        }, 1000 / this.fps);

    },
    reset: function () {
        this.player = new Player(this.ctx, this.width / 50, this.canvas.width / 2, this.canvas.height / 2);
        this.cannons = [];
        this.generateCannons();
        this.startTime = Date.now();
    },
    overGame: function () {
        start_btn.parentElement.style.display = 'flex';
        let scoreElement = document.getElementsByClassName('score')[0] || document.createElement('div');
        scoreElement.classList.add('score');
        scoreElement.innerText = `${Math.floor((Date.now() - this.startTime) / 1000)} sec`;
        start_btn.parentElement.append(scoreElement);
        clearInterval(this.interval);
    },

    clear: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawAll: function () {
        this.player.draw();
        this.cannons.forEach(cannon => {
            let angle = Math.atan2(this.player.y - cannon.y, this.player.x - cannon.x);
            cannon.angle = angle;
            cannon.draw();
            cannon.shoot(this.player.x, this.player.y);
        });

        // Update and draw bullets for each cannon
        this.cannons.forEach(cannon => {
            cannon.updateBullets();
        });
    }
    ,
    checkCollisions: function () {
        const player = this.player;
        const playerCenterX = player.x;
        const playerCenterY = player.y;
        const playerRadius = player.radius;

        // Check if bullet collides with player
        this.cannons.forEach(cannon => {
            cannon.bullets.forEach((bullet, i) => {
                const bulletCenterX = bullet.x;
                const bulletCenterY = bullet.y;
                const bulletRadius = bullet.radius;

                const distance = Math.sqrt(
                    (bulletCenterX - playerCenterX) ** 2 +
                    (bulletCenterY - playerCenterY) ** 2
                );

                if (distance < playerRadius + bulletRadius) {
                    cannon.bullets.splice(i, 1);
                    this.overGame();
                    return true;
                }
            });
        });
        // Check if player collides with canvas borders
        if (playerCenterX - playerRadius <= 0 ||
            playerCenterX + playerRadius >= this.width ||
            playerCenterY - playerRadius <= 0 ||
            playerCenterY + playerRadius >= this.height) {
            this.overGame();
            return true;
        }

        return false;
    },
    generateCannons: function () {
        let pos = [
            { y: 100, x: 100 },
            { y: 100, x: this.width - 100 },
            { y: this.height - 100, x: 100 },
            { y: this.height - 100, x: this.width - 100 }

        ]
        for (let i = 0; pos.length > i; i++) {
            // calc angle between player and cannon
            let angle = Math.atan2(this.player.y - pos[i].y, this.player.x - pos[i].x);
            const cannon = new Cannon(pos[i].x, pos[i].y, this.ctx, this.width / 20, angle, this.width);
            this.cannons.push(cannon);
        }
    }
}
Game.init();
keysHandler()
touchHandler()
function keysHandler() {
    const pressedKeys = {};
    let animationFrameId;
    document.addEventListener('keyup', (e) => {
        delete pressedKeys[e.keyCode];
        if (Object.keys(pressedKeys).length === 0) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    });
    document.addEventListener('keydown', (e) => {
        pressedKeys[e.keyCode] = true;
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(movePlayer);
        }
        function movePlayer() {
            const { TOP_KEY, BOTTOM_KEY, LEFT_KEY, RIGHT_KEY } = Game.playerKeys;
            const moveDistance = 5;

            if (pressedKeys[TOP_KEY]) {
                Game.player.move('up', moveDistance);
            }
            if (pressedKeys[BOTTOM_KEY]) {
                Game.player.move('down', moveDistance);
            }
            if (pressedKeys[LEFT_KEY]) {
                Game.player.move('left', moveDistance);
            }
            if (pressedKeys[RIGHT_KEY]) {
                Game.player.move('right', moveDistance);
            }
            if (Object.keys(pressedKeys).length > 0) {
                animationFrameId = requestAnimationFrame(movePlayer);
            }
            // handle Touch events


        }

    });
}
function touchHandler() {
    const touchState = {
        touching: false,
        startX: 0,
        startY: 0,
    };


    document.addEventListener('touchstart', (e) => {
        touchState.touching = true;
        touchState.startX = e.touches[0].clientX;
        touchState.startY = e.touches[0].clientY;
    });


    document.addEventListener('touchmove', (e) => {

        if (touchState.touching) {
            Game.player.x = e.touches[0].clientX;
            Game.player.y = e.touches[0].clientY;

        }
    });

}


document.addEventListener('keydown', ({ code }) => {
    if (code == 'Enter') {
        Game.start();
        start_btn.parentElement.style.display = 'none';
    }
})


start_btn.addEventListener('click', () => {
    Game.start();
    start_btn.parentElement.style.display = 'none';
});