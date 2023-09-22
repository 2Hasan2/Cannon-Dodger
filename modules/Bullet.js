export default class Bullet {
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
