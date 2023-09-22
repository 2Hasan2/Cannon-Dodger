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
