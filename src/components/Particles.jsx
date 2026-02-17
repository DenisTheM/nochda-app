import { useRef, useEffect, useCallback } from "react";

const S = {
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 },
};

class Particle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2;
    this.life = 1;
    this.decay = 0.008 + Math.random() * 0.012;
    this.size = 2 + Math.random() * 4;
    this.gravity = 0.04;
    this.wobble = Math.random() * 0.3;
    this.wobbleSpeed = 0.02 + Math.random() * 0.04;
    this.t = Math.random() * 100;
  }
  update() {
    this.t++; this.vy += this.gravity;
    this.vx += Math.sin(this.t * this.wobbleSpeed) * this.wobble;
    this.x += this.vx; this.y += this.vy;
    this.life -= this.decay;
    this.vx *= 0.99; this.vy *= 0.99;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life * 0.8;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = this.life * 0.2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default function Particles({ emitRef }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => { p.update(); p.draw(ctx); });
    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const emit = useCallback((x, y, count = 50, colors) => {
    const defaultColors = ["#f9c97c", "#fbbf24", "#6ee7a0", "#f0ece6", "#fde68a", "#fdba74"];
    const c = colors || defaultColors;
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(x, y, c[Math.floor(Math.random() * c.length)]));
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    if (emitRef) emitRef.current = emit;
  }, [emit, emitRef]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return <canvas ref={canvasRef} style={S.canvas} />;
}
