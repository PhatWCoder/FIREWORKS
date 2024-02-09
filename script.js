const WIDTH = 1400;
const HEIGHT = 800;
const PARTICLE_SIZE = 4;
const CHANGE_SPEED = 0.1;
const SPEED_ACT = 0.5;
const ACCELERATION = 0.15;
const DOT_CHANGE_SIZE_SPEED = 0.05;
const DOT_CHANGE_ALPHA_SPEED = 0.05;
const PARTICLE_MIN_SPEED = 14;
const PARTICLE_PER_BULLET = 20;


class particle {
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.context = this.bullet.context;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 2 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = []
               // x : 10 , y : 10 , alpha : 1 , size : 10
        
        
    }

    update() {

        this.speed -= SPEED_ACT;

        if (this.speed <= 0) {
            this.speed = 0
        }

        this.fallSpeed += ACCELERATION;
        
        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;
        
        // Calculate
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > CHANGE_SPEED) {
            this.size -= CHANGE_SPEED
        }

        if (this.size > 0) {
            this.dots.push( { x : this.x , y : this.y , alpha : 1 , size : this.size } )
        }

        this.dots.forEach( dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        })

        this.dots = this.dots.filter( dot => {
            return dot.size > 0;
        })

        if (this.dots.length == 0) {
            this.remove();
        }
    }

    remove() {
        this.bullet.particles.splice(this.bullet.particles.indexOf(this) , 1)
    }

    draw() {
        this.dots.forEach( dot => { 
            this.context.fillStyle = 'rgba(' + this.color + ',' + dot.alpha + ')';
            this.context.beginPath();
            this.context.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.context.fill();
        })
        
    }
}

class bullet {
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.context = fireworks.context;
        
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT / 2;
        this.color = Math.floor(Math.random() * 255) + ',' +
                     Math.floor(Math.random() * 255) + ',' +
                     Math.floor(Math.random() * 255);

        this.particles = []

        let bulletDeg = 2 * Math.PI / PARTICLE_PER_BULLET;

        for (let i = 0; i < PARTICLE_PER_BULLET; i++) {
            let newParticle = new particle(this , i * bulletDeg);
            this.particles.push(newParticle);
        }
        
    }

    remove() {
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1)
    }

    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach( particle => particle.update() );
    }

    draw() {
        this.particles.forEach( particle => particle.draw() );
    }
}
class fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);

        this.bullets = [];

        setInterval( () => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, 600)
        
        this.loop()
    }

    loop() {
        this.bullets.forEach( bullet => bullet.update());
        this.draw()
        setTimeout( () => this.loop(), 20);
    }

    clearScreen() {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0 , 0 , WIDTH, HEIGHT);
    }

    draw() {
        this.clearScreen();
        this.bullets.forEach( bullet => bullet.draw())
    }
}

var f = new fireworks()