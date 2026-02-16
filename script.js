/* ================= SETUP ================= */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const text = document.getElementById("newYearText");

/* ================= CANVAS ================= */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ================= SKY ================= */
function drawSky() {
    const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height,
        0,
        canvas.width / 2,
        canvas.height,
        canvas.height
    );
    grad.addColorStop(0, "#1b2b4f");
    grad.addColorStop(0.5, "#0b0f2a");
    grad.addColorStop(1, "#05010f");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ================= STARS ================= */
class Star {
    constructor() { this.reset(); }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.5 + 0.3;
        this.speed = Math.random() * 0.25 + 0.05;
        this.alpha = Math.random() * 0.6 + 0.4;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -5;
            this.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
    }
}
const stars = Array.from({ length: 200 }, () => new Star());

/* ================= METEOR ================= */
class Meteor {
    constructor() { this.reset(); }

    reset() {
        this.x = Math.random() * canvas.width * 0.7;
        this.y = Math.random() * canvas.height * 0.3;
        this.vx = 1.2 + Math.random() * 1.5;
        this.vy = 1.2 + Math.random() * 1.5;
        this.len = 160;

        updateTextColor(Math.random() * 360);
    }

    update() {
        const grad = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x - this.vx * this.len,
            this.y - this.vy * this.len
        );
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(1, "transparent");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - this.vx * this.len,
            this.y - this.vy * this.len
        );
        ctx.stroke();

        this.vx *= 1.003;
        this.vy *= 1.003;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > canvas.width || this.y > canvas.height) {
            this.reset();
        }
    }
}
const meteors = Array.from({ length: 4 }, () => new Meteor());

/* ================= TEXT COLOR ================= */
function updateTextColor(hue) {
    if (!text) return;
    text.style.color = `hsl(${hue}, 80%, 75%)`;
    text.style.textShadow = `
        0 0 18px hsla(${hue},100%,80%,0.7),
        0 0 40px hsla(${hue},100%,60%,0.4)
    `;
}

/* ================= FIREWORK (BIGGER 💥) ================= */
class Firework {
    constructor(x, y) {
        this.particles = [];
        const count = 90;              // 🔥 nhiều hạt hơn (trước ~50)

        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 5 + 3; // 🔥 bay xa hơn
            this.particles.push({
                x, y,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s,
                life: 90,               // 🔥 tồn tại lâu hơn
                size: Math.random() * 2 + 2.5, // 🔥 hạt to hơn
                hue: Math.random() * 360
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.025;
            p.life--;

            ctx.fillStyle = `hsla(${p.hue},100%,60%,${p.life / 90})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });

        this.particles = this.particles.filter(p => p.life > 0);
    }
}

const fireworks = [];

/* ================= AUTO FIREWORK ================= */
setInterval(() => {
    fireworks.push(
        new Firework(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.5
        )
    );
}, 1300);

/* ================= LOOP ================= */
function loop() {
    drawSky();
    stars.forEach(s => s.update());
    meteors.forEach(m => m.update());

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        if (fireworks[i].particles.length === 0) {
            fireworks.splice(i, 1);
        }
    }

    requestAnimationFrame(loop);
}
loop();

/* ================= BUTTON ================= */
document.getElementById("lixiBtn").addEventListener("click", () => {
    document.getElementById("troll").classList.add("show");

    const music = document.getElementById("bgMusic");
    if (music) {
        music.volume = 0.6;
        music.currentTime = 0;
        music.play().catch(() => {});
    }
});
