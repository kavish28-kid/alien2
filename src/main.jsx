import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Sparkles as DreiSparkles, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import {
  AudioLines,
  ChevronDown,
  Heart,
  MailOpen,
  MoonStar,
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react";
import "./styles.css";

const name = "Alien";

const portals = [
  { id: "meant", title: "What I Really Meant", tone: "broken words becoming truth" },
  { id: "universe", title: "Our Universe", tone: "memories, stars, and the quiet good" },
  { id: "future", title: "The Future I Want", tone: "a city of promises I want to keep" },
  { id: "letters", title: "Letters I Couldn't Say", tone: "the softer things I should have said" },
  { id: "memory", title: "Memory Dimension", tone: "storm water turning into sunrise" },
  { id: "promise", title: "Final Promise", tone: "where every orbit comes back to you" }
];

const wordFragments = [
  ["sacrifice", "I would never ask you to give up your dreams."],
  ["dreams", "Your dreams are not something I joke about losing."],
  ["joking", "I was careless, stupidly trying to be funny."],
  ["fear", "The truth is I am scared of hurting what matters most."],
  ["regret", "I never want my words to become your pain."]
];

const memoryStars = [
  "the way your voice changes my whole day",
  "late night talks that feel like home",
  "small jokes that become our language",
  "the future I imagine with your hand in mine",
  "your dreams, bright enough to guide both of us"
];

function LoadingScene({ onDone }) {
  const [line, setLine] = useState("");
  const [phase, setPhase] = useState(0);
  const full = "There are jokes...\nthat should never have been said.";

  useEffect(() => {
    let i = 0;
    const typing = window.setInterval(() => {
      setLine(full.slice(0, i));
      i += 1;
      if (i > full.length) {
        window.clearInterval(typing);
        setTimeout(() => setPhase(1), 900);
        setTimeout(onDone, 2600);
      }
    }, 54);
    return () => window.clearInterval(typing);
  }, [onDone]);

  return (
    <motion.div className="loader" exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 1.2, ease: "easeInOut" }}>
      <div className={`loader-stars phase-${phase}`} />
      <motion.div
        className="heartbeat"
        animate={{ scale: [1, 1.08, 1, 1.18, 1], opacity: [0.45, 1, 0.5, 1, 0.55] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
      />
      <pre className="type-text">{line}</pre>
      <div className="portal-ring" />
    </motion.div>
  );
}

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9, touchMultiplier: 1.2 });
    let raf;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

function CameraRig({ progress }) {
  const { camera, mouse } = useThree();
  useFrame((state) => {
    const p = progress.current;
    camera.position.x = gsap.utils.interpolate(camera.position.x, mouse.x * 0.9 + Math.sin(p * 6) * 1.1, 0.035);
    camera.position.y = gsap.utils.interpolate(camera.position.y, mouse.y * 0.55 + 0.2, 0.035);
    camera.position.z = gsap.utils.interpolate(camera.position.z, 8 - p * 3.4, 0.03);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function HeartPlanet() {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y += 0.004;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.7}>
      <group ref={group}>
        <mesh scale={[1.55, 1.38, 1.55]}>
          <sphereGeometry args={[1, 96, 96]} />
          <MeshDistortMaterial
            color="#ff7cbf"
            emissive="#5d173f"
            emissiveIntensity={0.85}
            roughness={0.18}
            metalness={0.22}
            distort={0.25}
            speed={1.7}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.15, 0.015, 16, 180]} />
          <meshBasicMaterial color="#74d6ff" transparent opacity={0.62} />
        </mesh>
        <mesh rotation={[1.15, 0.45, 0.2]}>
          <torusGeometry args={[2.55, 0.01, 16, 180]} />
          <meshBasicMaterial color="#b8a5ff" transparent opacity={0.42} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const points = useRef();
  const particles = useMemo(() => {
    const positions = new Float32Array(1300 * 3);
    for (let i = 0; i < 1300; i += 1) {
      const radius = 5 + Math.random() * 22;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 8;
    }
    return positions;
  }, []);
  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.015;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#d9c2ff" transparent opacity={0.78} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function AnimeSky() {
  const comet = useRef();
  const petals = useMemo(() => {
    return Array.from({ length: 38 }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 7,
      z: -2 - Math.random() * 10,
      s: 0.035 + Math.random() * 0.05,
      r: Math.random() * Math.PI
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    comet.current.position.x = Math.sin(t * 0.32) * 6;
    comet.current.position.y = 2.6 + Math.sin(t * 0.55) * 0.5;
    comet.current.rotation.z = -0.35 + Math.sin(t * 0.2) * 0.08;
  });

  return (
    <group>
      <group ref={comet} position={[-5, 2.4, -7]}>
        <mesh rotation={[0, 0, -0.35]}>
          <coneGeometry args={[0.05, 3.4, 24]} />
          <meshBasicMaterial color="#91e4ff" transparent opacity={0.42} />
        </mesh>
        <mesh position={[1.7, 0, 0]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      {petals.map((petal, index) => (
        <Float key={index} speed={1.4 + index * 0.015} floatIntensity={1.4} rotationIntensity={1.8}>
          <mesh position={[petal.x, petal.y, petal.z]} rotation={[petal.r, petal.r * 0.5, petal.r]} scale={petal.s}>
            <sphereGeometry args={[1, 16, 8]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#ffb4da" : "#d9c2ff"} transparent opacity={0.62} />
          </mesh>
        </Float>
      ))}
      <DreiSparkles count={140} scale={[12, 6, 10]} size={2.6} speed={0.28} color="#fff4fb" opacity={0.42} />
    </group>
  );
}

function LanternPath() {
  return Array.from({ length: 9 }).map((_, index) => {
    const x = -4 + index;
    const y = -2.2 + Math.sin(index) * 0.25;
    const z = -3.5 - index * 0.35;
    return (
      <Float key={index} speed={0.7 + index * 0.04} floatIntensity={0.75}>
        <group position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshBasicMaterial color={index % 2 ? "#ffb4da" : "#ffe6a7"} transparent opacity={0.86} />
          </mesh>
          <pointLight color={index % 2 ? "#ff7cbf" : "#ffd98f"} intensity={3.2} distance={1.4} />
        </group>
      </Float>
    );
  });
}

function SilhouettePromise() {
  return (
    <group position={[0, -2.05, -1.2]}>
      <mesh position={[-0.22, 0.46, 0]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial color="#05050c" />
      </mesh>
      <mesh position={[0.22, 0.46, 0]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial color="#05050c" />
      </mesh>
      <mesh position={[-0.22, 0.15, 0]} scale={[0.11, 0.38, 0.08]}>
        <capsuleGeometry args={[1, 1, 8, 16]} />
        <meshBasicMaterial color="#05050c" />
      </mesh>
      <mesh position={[0.22, 0.15, 0]} scale={[0.11, 0.38, 0.08]}>
        <capsuleGeometry args={[1, 1, 8, 16]} />
        <meshBasicMaterial color="#05050c" />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[0, 0, 1.57]}>
        <capsuleGeometry args={[0.025, 0.34, 8, 12]} />
        <meshBasicMaterial color="#05050c" />
      </mesh>
      <mesh position={[0, -0.3, -0.05]} rotation={[-1.57, 0, 0]}>
        <circleGeometry args={[1.1, 72]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function Portals3D() {
  return portals.map((portal, index) => {
    const angle = (index / portals.length) * Math.PI * 2;
    const x = Math.cos(angle) * 3.8;
    const y = Math.sin(angle) * 1.25;
    const z = Math.sin(angle) * 3.2 - 1.8;
    return (
      <Float key={portal.id} speed={1 + index * 0.08} floatIntensity={0.45}>
        <group position={[x, y, z]} rotation={[0.25, -angle, 0]}>
          <mesh>
            <torusGeometry args={[0.52, 0.018, 18, 96]} />
            <meshBasicMaterial color={index % 2 ? "#74d6ff" : "#ff7cbf"} transparent opacity={0.72} />
          </mesh>
          <Text
            fontSize={0.09}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.72, 0]}
            maxWidth={1.2}
            textAlign="center"
          >
            {portal.title}
          </Text>
        </group>
      </Float>
    );
  });
}

function CosmicCanvas({ progress }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 8], fov: 52 }} dpr={[1, 1.65]} gl={{ antialias: true }}>
      <color attach="background" args={["#04050d"]} />
      <fog attach="fog" args={["#08091a", 8, 28]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 3, 4]} color="#ff7cbf" intensity={48} distance={12} />
      <pointLight position={[-5, -2, 2]} color="#74d6ff" intensity={34} distance={14} />
      <Suspense fallback={null}>
        <Stars radius={80} depth={40} count={3000} factor={4} saturation={0.6} fade speed={0.7} />
        <ParticleField />
        <AnimeSky />
        <LanternPath />
        <HeartPlanet />
        <Portals3D />
        <SilhouettePromise />
      </Suspense>
      <CameraRig progress={progress} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.65} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0008, 0.0012]} />
        <Vignette eskil={false} offset={0.15} darkness={0.72} />
      </EffectComposer>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.25} autoRotate autoRotateSpeed={0.22} />
    </Canvas>
  );
}

function AudioToggle() {
  const [on, setOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);
    const oscillators = [110, 220, 329.63].map((freq, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      gain.gain.value = index === 0 ? 0.045 : 0.018;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      return osc;
    });
    audioRef.current = { context, master, oscillators };
    return () => {
      oscillators.forEach((osc) => osc.stop());
      context.close();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    await audio.context.resume();
    setOn((value) => {
      const next = !value;
      audio.master.gain.cancelScheduledValues(audio.context.currentTime);
      audio.master.gain.linearRampToValueAtTime(next ? 0.8 : 0, audio.context.currentTime + 0.8);
      return next;
    });
  };

  return (
    <button className="audio-toggle" onClick={toggle} aria-label="Toggle ambient music">
      {on ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span>{on ? "Ambient on" : "Ambient off"}</span>
    </button>
  );
}

function PortalCard({ portal, index }) {
  return (
    <motion.a
      href={`#${portal.id}`}
      className="portal-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.06 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <span>0{index + 1}</span>
      <strong>{portal.title}</strong>
      <em>{portal.tone}</em>
    </motion.a>
  );
}

function Home() {
  return (
    <section className="hero" id="home">
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 1 }}
      >
        <p className="eyebrow">Beyond My Words</p>
        <h1>Alien, I was careless with a joke, not with us.</h1>
        <p>
          I said, "I sacrificed the dreams," and I hate that those words could make you feel smaller,
          unsupported, or uncertain. I never meant that. I would never sacrifice you, your dreams, or
          the future I hope we build together. This universe is my way of saying the joke was wrong,
          and the love underneath it is serious.
        </p>
        <div className="hero-actions">
          <a href="#meant" className="primary-action">
            Enter the apology <ChevronDown size={18} />
          </a>
          <a href="#promise" className="ghost-action">
            Final promise
          </a>
        </div>
      </motion.div>
      <div className="portal-grid">{portals.map((portal, index) => <PortalCard portal={portal} index={index} key={portal.id} />)}</div>
    </section>
  );
}

function Section({ id, kicker, title, children, icon: Icon = Sparkles }) {
  return (
    <motion.section
      id={id}
      className={`story-section ${id}`}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className="section-heading">
        <span><Icon size={16} /> {kicker}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function WhatIMeant() {
  const [active, setActive] = useState(0);
  return (
    <Section id="meant" kicker="Broken words" title="What I really meant">
      <div className="fragment-stage">
        {wordFragments.map(([word, meaning], index) => (
          <button
            className={`fragment ${active === index ? "active" : ""}`}
            onClick={() => setActive(index)}
            key={word}
            style={{ "--delay": `${index * 0.12}s` }}
          >
            <span>{word}</span>
            <small>{meaning}</small>
          </button>
        ))}
      </div>
      <motion.p className="confession" key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        {wordFragments[active][1]} I was joking in the worst possible direction, and I am sorry for making love sound like a loss.
      </motion.p>
    </Section>
  );
}

function OurUniverse() {
  const [picked, setPicked] = useState(0);
  return (
    <Section id="universe" kicker="Constellation" title={`The universe I see with ${name}`} icon={MoonStar}>
      <div className="constellation">
        <div className="initials">B + A</div>
        {memoryStars.map((memory, index) => (
          <button
            key={memory}
            className={`memory-star star-${index} ${picked === index ? "picked" : ""}`}
            onClick={() => setPicked(index)}
            aria-label={memory}
          />
        ))}
        <motion.div className="memory-message" key={picked} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          {memoryStars[picked]}
        </motion.div>
      </div>
      <div className="soft-row">
        <span>photo portals ready</span>
        <span>voice notes ready</span>
        <span>lanterns and petals live</span>
        <span>anime sky active</span>
      </div>
    </Section>
  );
}

function Future() {
  const signs = ["late night talks", "future trips", "supporting your dreams", "growing together", "peace", "marriage someday"];
  return (
    <Section id="future" kicker="Neon city" title="The future I want" icon={Sparkles}>
      <div className="city-walk">
        {signs.map((sign, index) => <span className="neon-sign" key={sign} style={{ "--i": index }}>{sign}</span>)}
        <div className="bridge">
          <i />
          <strong>rebuilding trust, one honest step at a time</strong>
        </div>
      </div>
    </Section>
  );
}

function Letters() {
  const letters = [
    "I never want my words to become your pain. You deserve a love that feels steady, especially when life already asks enough from you.",
    "You deserve support, not confusion. Your dreams are not in competition with us. They are part of the future I want to protect.",
    "I want to be someone who makes your heart feel lighter. I am sorry that my joke did the opposite, Alien."
  ];
  const [open, setOpen] = useState(0);
  return (
    <Section id="letters" kicker="Unsent letters" title="Letters I couldn't say" icon={MailOpen}>
      <div className="letters-grid">
        {letters.map((letter, index) => (
          <button className={`letter ${open === index ? "open" : ""}`} key={letter} onClick={() => setOpen(index)}>
            <span>Letter {index + 1}</span>
            <p>{letter}</p>
          </button>
        ))}
      </div>
    </Section>
  );
}

function MemoryDimension() {
  return (
    <Section id="memory" kicker="Reflective world" title="A storm becoming sunrise">
      <div className="water-world">
        {[1, 2, 3, 4].map((item) => (
          <div className="memory-cube" key={item}>
            <Heart size={20} />
            <span>memory {item}</span>
          </div>
        ))}
        <p>
          I know apologies are not magic. They are weather. They have to keep arriving gently until the sky feels believable again.
        </p>
      </div>
    </Section>
  );
}

function FinalPromise() {
  return (
    <Section id="promise" kicker="Final promise" title="Every orbit comes back to you" icon={Heart}>
      <div className="cathedral">
        <motion.div
          className="holo-heart"
          animate={{ scale: [1, 1.08, 1], filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(0deg)"] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        >
          <Heart size={86} fill="currentColor" />
        </motion.div>
        <p>I was careless with my words... but never careless with my love for you.</p>
        <h3>I choose you. Your dreams. Our future. Every single time.</h3>
        <div className="final-orbit">
          {[0, 1, 2, 3, 4, 5].map((item) => <i key={item} style={{ "--i": item }} />)}
        </div>
        <strong>I'm Sorry, Alien</strong>
      </div>
    </Section>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll();
  const veilOpacity = useTransform(scrollYProgress, [0, 0.35, 0.8, 1], [0.15, 0, 0.1, 0.34]);

  useSmoothScroll();

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      progress.current = value;
    });
  }, [scrollYProgress]);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScene onDone={() => setLoading(false)} />}</AnimatePresence>
      <main>
        <div className="canvas-shell"><CosmicCanvas progress={progress} /></div>
        <motion.div className="cinema-veil" style={{ opacity: veilOpacity }} />
        <AudioToggle />
        <Home />
        <WhatIMeant />
        <OurUniverse />
        <Future />
        <Letters />
        <MemoryDimension />
        <FinalPromise />
        <footer>
          <AudioLines size={16} />
          <span>Made as an apology, not a performance. For Alien.</span>
        </footer>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
