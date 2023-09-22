
import Bullet from './Bullet.js';

export default class Cannon {
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
