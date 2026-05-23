import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

class Particle {
  x: number;
  y: number;
  col: string;
  vel: { x: number; y: number };
  lifetime: number;

  constructor(x: number, y: number, col: string) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.vel = randomVec(2);
    this.lifetime = 0;
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.vel.y += 0.02;
    this.vel.x *= 0.99;
    this.vel.y *= 0.99;
    this.lifetime++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = Math.max(1 - this.lifetime / 80, 0);
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

class Firework {
  x: number;
  y: number;
  isBlown: boolean;
  col: string;

  constructor(x: number, height: number) {
    this.x = x;
    this.y = height;
    this.isBlown = false;
    this.col = randomCol();
  }

  update(particles: Particle[]) {
    this.y -= 3;
    if (this.y < 350 - Math.sqrt(Math.random() * 500) * 40) {
      this.isBlown = true;
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(this.x, this.y, this.col));
      }
    }
    return this.isBlown;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

function randomCol(): string {
  const letters = '0123456789ABCDEF';
  const nums: number[] = [];
  for (let i = 0; i < 3; i++) {
    nums[i] = Math.floor(Math.random() * 256);
  }
  let brightest = 0;
  for (let i = 0; i < 3; i++) {
    if (brightest < nums[i]) brightest = nums[i];
  }
  brightest /= 255;
  for (let i = 0; i < 3; i++) {
    nums[i] /= brightest;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(nums[i] / 16)];
    color += letters[Math.floor(nums[i] % 16)];
  }
  return color;
}

function randomVec(max: number) {
  const dir = Math.random() * Math.PI * 2;
  const spd = Math.random() * max;
  return { x: Math.cos(dir) * spd, y: Math.sin(dir) * spd };
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    document.title = "HannApp";
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    setSize();

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, width, height);
    fireworks.push(new Firework(Math.random() * (width - 200) + 100, height));

    const onClick = (e: MouseEvent) => {
      fireworks.push(new Firework(e.clientX, height));
    };

    const onResize = () => {
      setSize();
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("click", onClick);

    let animationFrameId: number;
    const loop = () => {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const done = fireworks[i].update(particles);
        fireworks[i].draw(ctx);
        if (done) {
          fireworks.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].lifetime > 80) {
          particles.splice(i, 1);
        }
      }

      if (Math.random() < 1 / 60) {
        fireworks.push(new Firework(Math.random() * (width - 200) + 100, height));
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const handleLogin = async () => {
    // Redirect directly to home page for testing
    navigate('/home');
  };

  return (
    <div className="relative w-screen h-auto min-h-screen bg-smoky-black overflow-y-auto flex flex-col justify-center items-center py-8 px-4 font-poppins lg:h-screen lg:overflow-hidden lg:block lg:py-0 lg:px-0">
      <canvas id="canvas" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <article className="relative top-0 left-0 h-auto w-full max-w-[450px] mb-8 flex flex-col items-center text-center z-10 lg:absolute lg:top-1/2 lg:left-[10%] lg:-translate-y-1/2 lg:h-[58%] lg:w-auto lg:max-w-none lg:mb-0 lg:flex-row lg:items-start lg:text-left">
        <div className="flex flex-col">
          <h1 className="relative overflow-hidden m-0 mx-auto mb-4 text-[3.5rem] text-orange-yellow-crayola max-w-max px-4 py-0 rounded-[5px] left-0 lg:text-[5rem] lg:left-[-1rem] lg:ml-0 lg:mb-0">
            HannApp
          </h1>
          <p className="text-[1.25rem] font-bold text-white lg:text-[2rem]">See what's make you different.</p>
        </div>
        <div className="hidden lg:block lg:absolute lg:bottom-0 lg:left-0 lg:w-[200px]">
          <img src="/assets/images/logo/undraw_testimonials_4c7y.svg" alt="" className="w-full" />
        </div>
      </article>

      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="relative top-0 right-0 transform-none w-full max-w-[450px] h-auto p-8 flex flex-col gap-[1.3rem] shadow-white-shadow rounded-[10px] border-2 border-white z-10 backdrop-blur-[10px] lg:absolute lg:top-1/2 lg:right-[15%] lg:-translate-y-1/2 lg:h-[58%] lg:w-[30%] lg:p-12">
        <h1 className="text-white text-[2rem] font-bold">Login</h1>
        <img src="/assets/images/logo/undraw_new-year-2025_1tmm.svg" alt="" className="hidden lg:block lg:absolute lg:top-[2.85rem] lg:right-8 lg:w-[130px] lg:z-[200]" />
        <div className="flex flex-col gap-4">
          <div className="relative bg-light-gray rounded-[2rem] px-4 py-[0.7rem] flex items-center gap-[0.6rem] overflow-hidden">
            <i className="fa-regular fa-user text-white-shadow" />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              required
              className="bg-transparent flex-1 text-[0.7rem] border-none outline-none text-eerie-black p-[1px]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative bg-light-gray rounded-[2rem] px-4 py-[0.7rem] flex items-center gap-[0.6rem] overflow-hidden">
            <i className="fa-solid fa-key text-white-shadow" />
            <input
              id="pass"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="bg-transparent flex-1 text-[0.7rem] border-none outline-none text-eerie-black p-[1px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button id="loginBtn" type="button" onClick={handleLogin} className="px-[2.3rem] py-[0.6rem] text-[0.7rem] rounded-[25px] border-2 border-gradient-yellow shadow-gradient-yellow-glow bg-transparent text-gradient-yellow transition-all duration-200 ease-in-out cursor-pointer hover:bg-gradient-yellow hover:text-smoky-black active:bg-transparent active:text-gradient-yellow">Log in</button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
            className="text-white bg-jet rounded-[25px] px-[2.3rem] py-[0.7rem] text-[0.7rem] cursor-pointer transition-all duration-200 ease-in-out inline-block text-center hover:bg-white hover:text-jet"
          >
            Create Account
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
