import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async"; // ← ADD THIS
import ck from "./assets/ck.png";
import "./App.css";

const tickerItems = [
  "React.js","Node.js","MongoDB","Express.js","Next.js","Tailwind CSS","REST API",
  "JWT Auth","Git & GitHub","Vercel","Netlify","Gemini API","MERN Stack","JavaScript ES6+"
];

function App() {
  const canvasRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  // Three.js Background
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE = window.THREE;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 80;
      const count = 1800, geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i*3]=(Math.random()-.5)*200; pos[i*3+1]=(Math.random()-.5)*200; pos[i*3+2]=(Math.random()-.5)*200;
        const t = Math.random();
        if (t>.6){col[i*3]=0;col[i*3+1]=1;col[i*3+2]=.94;}
        else if(t>.3){col[i*3]=.48;col[i*3+1]=.18;col[i*3+2]=1;}
        else{col[i*3]=.2;col[i*3+1]=.15;col[i*3+2]=.35;}
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size:.5, vertexColors:true, transparent:true, opacity:.7, sizeAttenuation:true }));
      scene.add(pts);
      const s1 = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(30,2)), new THREE.LineBasicMaterial({ color:0x7b2fff, opacity:.08, transparent:true }));
      s1.position.set(60,-20,0); scene.add(s1);
      const s2 = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(20,1)), new THREE.LineBasicMaterial({ color:0x00fff0, opacity:.06, transparent:true }));
      s2.position.set(-70,30,-20); scene.add(s2);
      let mx=0, my=0;
      const onMove = (e) => { mx=(e.clientX/window.innerWidth-.5)*.3; my=(e.clientY/window.innerHeight-.5)*.3; };
      document.addEventListener('mousemove', onMove);
      let t=0, animId;
      const loop = () => {
        animId = requestAnimationFrame(loop);
        t+=.003;
        pts.rotation.y=t*.1+mx*.5; pts.rotation.x=t*.05+my*.3;
        s1.rotation.x=t*.3; s1.rotation.y=t*.2;
        s2.rotation.x=-t*.2; s2.rotation.y=t*.3;
        renderer.render(scene, camera);
      };
      loop();
      const onResize = () => {
        camera.aspect=window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);
      return () => {
        cancelAnimationFrame(animId);
        document.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
      };
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  // Custom cursor
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', onMove);
    let animId;
    const animC = () => {
      animId = requestAnimationFrame(animC);
      mouseRef.current.rx += (mouseRef.current.x - mouseRef.current.rx) * .1;
      mouseRef.current.ry += (mouseRef.current.y - mouseRef.current.ry) * .1;
      if (ringRef.current) {
        ringRef.current.style.left = mouseRef.current.rx + 'px';
        ringRef.current.style.top = mouseRef.current.ry + 'px';
      }
    };
    animC();
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Scroll nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);



  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: .1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Tilt effect
  useEffect(() => {
    const handlers = [];
    document.querySelectorAll('.skill-card,.svc-card').forEach(c => {
      const onMove = (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `translateY(-6px) rotateX(${-y*10}deg) rotateY(${x*10}deg)`;
      };
      const onLeave = () => c.style.transform = '';
      c.addEventListener('mousemove', onMove);
      c.addEventListener('mouseleave', onLeave);
      handlers.push({ c, onMove, onLeave });
    });
    document.querySelectorAll('.proj-card').forEach(c => {
      const onMove = (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `rotateX(${-y*3}deg) rotateY(${x*3}deg)`;
      };
      const onLeave = () => c.style.transform = '';
      c.addEventListener('mousemove', onMove);
      c.addEventListener('mouseleave', onLeave);
      handlers.push({ c, onMove, onLeave });
    });
    return () => handlers.forEach(({ c, onMove, onLeave }) => {
      c.removeEventListener('mousemove', onMove);
      c.removeEventListener('mouseleave', onLeave);
    });
  }, []);

  // Prevent iframe auto-scroll on load
  useEffect(() => {
    const iframes = document.querySelectorAll('iframe');
    
    const handleIframeLoad = () => {
      const currentScroll = window.scrollY;
      setTimeout(() => {
        window.scrollTo(0, currentScroll);
      }, 50);
    };
    
    iframes.forEach((iframe) => {
      iframe.addEventListener('load', handleIframeLoad);
    });
    
    return () => {
      iframes.forEach((iframe) => {
        iframe.removeEventListener('load', handleIframeLoad);
      });
    };
  }, []);

  return (
    <>
      {/* ✅ SEO — HELMET FOR META TAGS */}
      <Helmet>
        <html lang="en" />
        <title>Code with CK | Chandan Chaurasiya - Full Stack Developer | MERN Stack Expert</title>
        <meta name="description" content="Chandan Chaurasiya - Full Stack MERN Developer. Specializing in React, Node.js, MongoDB. Custom web apps, e-commerce, AI integration. Available for freelance & full-time work." />
        <meta name="keywords" content="full stack developer, MERN stack, React developer, Node.js, MongoDB, web development, e-commerce solution, freelance developer, India" />
        <meta name="author" content="Chandan Chaurasiya - Code with CK" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="English" />
        <meta name="copyright" content="© 2025 Chandan Chaurasiya" />
        <link rel="canonical" href="https://codewithck.me/" />
        <link rel="icon" href="/ck.png" type="image/png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codewithck.me/" />
        <meta property="og:title" content="Code with CK | Chandan Chaurasiya - Full Stack MERN Developer" />
        <meta property="og:description" content="Building fast, scalable web applications. Full-stack MERN developer specializing in React, Node.js, MongoDB, and modern web technologies." />
        <meta property="og:image" content="https://codewithck.me/og-image.png" />
        <meta property="og:site_name" content="Code with CK Portfolio" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CodeWithCK" />
        <meta name="twitter:creator" content="@Chandan_Dev" />
        <meta name="twitter:title" content="Code with CK | Full Stack Developer" />
        <meta name="twitter:description" content="Full-stack MERN developer building modern web solutions. Available for freelance projects." />
        <meta name="twitter:image" content="https://codewithck.me/og-image.png" />

        {/* Additional SEO */}
        <meta name="theme-color" content="#02000a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Code with CK" />
        <link rel="icon" href="/ck.png" type="image/png" />
        <link rel="apple-touch-icon" href="/ck.png" />

        {/* Schema */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "https://codewithck.me/#person",
                "name": "Chandan Chaurasiya",
                "additionalName": "Chandan Kumar",
                "givenName": "Chandan",
                "familyName": "Chaurasiya",
                "alternateName": ["CK", "Code with CK", "CodeWithCK", "Chandan.DEV", "Chandan Kumar"],
                "jobTitle": "Full Stack Developer | MERN Stack Expert | Web Developer",
                "url": "https://codewithck.me/",
                "email": "Chandankumar8454230@gmail.com",
                "image": "https://codewithck.me/og-image.png",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Bihar",
                  "addressCountry": "INDIA",
                  "addressRegion": "Bihar"
                },
                "sameAs": [
                  "https://github.com/Chandanchaurasiya55",
                  "https://www.linkedin.com/in/chandanchaurasiya-dev",
                  "https://twitter.com/codewithck",
                  "https://www.instagram.com/codewithck"
                ],
                "knowsAbout": ["React", "React.js", "Node.js", "Express.js", "MongoDB", "MERN Stack", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "REST API", "JWT Authentication", "Gemini API", "Google Gemini", "E-commerce Development", "Web Development", "Full Stack Development", "Freelance Development", "Web Design", "UI/UX"],
                "workLocation": {
                  "@type": "City",
                  "name": "Bihar"
                },
                "nationality": {
                  "@type": "Country",
                  "name": "India"
                },
                "areaServed": [
                  {
                    "@type": "Country",
                    "name": "India"
                  },
                  {
                    "@type": "Country",
                    "name": "United States"
                  },
                  {
                    "@type": "Country",
                    "name": "United Kingdom"
                  }
                ],
                "makesOffer": [
                  {
                    "@type": "Offer",
                    "businessFunction": "Buy",
                    "itemOffered": "Full Stack Web Development Services"
                  },
                  {
                    "@type": "Offer",
                    "businessFunction": "Buy",
                    "itemOffered": "MERN Stack Development"
                  },
                  {
                    "@type": "Offer",
                    "businessFunction": "Buy",
                    "itemOffered": "REST API Development"
                  },
                  {
                    "@type": "Offer",
                    "businessFunction": "Buy",
                    "itemOffered": "E-commerce Solutions"
                  }
                ],
                "awards": [
                  {
                    "@type": "Award",
                    "name": "Full Stack Developer",
                    "description": "Specialized in MERN Stack with 3+ years of experience"
                  },
                  {
                    "@type": "Award",
                    "name": "Google Certified Developer",
                    "description": "Expertise in Gemini API and Google integrations"
                  }
                ]
              },
              {
                "@type": "Organization",
                "@id": "https://codewithck.me/#organization",
                "name": "Code with CK",
                "alternateName": "CodeWithCK",
                "description": "Full Stack Web Development Services - MERN Stack Expert",
                "url": "https://codewithck.me/",
                "email": "Chandankumar8454230@gmail.com",
                "founder": {
                  "@id": "https://codewithck.me/#person"
                },
                "foundingDate": "2021",
                "areaServed": "India",
                "sameAs": [
                  "https://github.com/Chandanchaurasiya55",
                  "https://www.linkedin.com/in/chandanchaurasiya-dev"
                ]
              },
              {
                "@type": "WebSite",
                "@id": "https://codewithck.me/#website",
                "url": "https://codewithck.me/",
                "name": "Code with CK",
                "alternateName": "CodeWithCK Portfolio",
                "description": "Full Stack MERN Developer Portfolio - React, Node.js, MongoDB, Web Development",
                "language": "en-US",
                "inLanguage": "en",
                "publisher": { "@id": "https://codewithck.me/#person" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://codewithck.me/?s={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://codewithck.me/#home"},
                  {"@type": "ListItem", "position": 2, "name": "About", "item": "https://codewithck.me/#about"},
                  {"@type": "ListItem", "position": 3, "name": "Skills", "item": "https://codewithck.me/#skills"},
                  {"@type": "ListItem", "position": 4, "name": "Projects", "item": "https://codewithck.me/#projects"},
                  {"@type": "ListItem", "position": 5, "name": "Services", "item": "https://codewithck.me/#services"},
                  {"@type": "ListItem", "position": 6, "name": "Contact", "item": "https://codewithck.me/#contact"}
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is MERN Stack?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "MERN Stack is a JavaScript full-stack development framework consisting of MongoDB (database), Express.js (server), React.js (frontend), and Node.js (runtime). It enables building fast, scalable web applications with a single programming language."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are you available for freelance work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, I am available for freelance projects. I specialize in full-stack web development, e-commerce solutions, REST API development, and AI-powered applications. Contact me at Chandankumar8454230@gmail.com for project inquiries."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What technologies do you use?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "I work with React.js, Node.js, MongoDB, Express.js, Next.js, Tailwind CSS, REST APIs, JWT Authentication, Stripe payment integration, Gemini API, and deployment platforms like Vercel, Netlify, and Render."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How long does a typical project take?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Project timeline depends on complexity and scope. Simple landing pages take 1-2 weeks, full-stack apps typically take 3-8 weeks, and complex e-commerce platforms may take 2-3 months. Contact me for a detailed quote."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do you provide post-launch support?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, I provide post-launch support including bug fixes, performance optimization, feature additions, and maintenance. Custom support packages are available based on your needs."
                    }
                  }
                ]
              },
              {
                "@type": "HowTo",
                "name": "How to Hire a Full Stack Developer for Your Project",
                "description": "A step-by-step guide to finding and hiring the right full stack developer for your web development project",
                "step": [
                  {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Define Your Project Requirements",
                    "text": "Clearly outline your project scope, features, timeline, and budget. Know whether you need a full-stack solution or specific components."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "Review Portfolio and Experience",
                    "text": "Check the developer's portfolio for relevant projects, code quality, and past client testimonials. Look for experience with your required tech stack."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Discuss Technical Architecture",
                    "text": "Have a detailed conversation about scalability, security, database design, and deployment strategy for your project."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 4,
                    "name": "Agree on Project Timeline and Support",
                    "text": "Establish clear milestones, delivery dates, revision rounds, and post-launch support terms before starting the project."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 5,
                    "name": "Start Project and Maintain Communication",
                    "text": "Begin development while maintaining regular communication through updates, progress reports, and feedback cycles."
                  }
                ]
              },
              {
                "@type": "LocalBusiness",
                "@id": "https://codewithck.me/#localbusiness",
                "name": "Code with CK",
                "description": "Full Stack Web Development Services - MERN Stack Expert",
                "url": "https://codewithck.me/",
                "areaServed": {
                  "@type": "Country",
                  "name": "IN"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "Customer Service",
                  "email": "Chandankumar8454230@gmail.com"
                }
              },
              {
                "@type": "EducationalOccupationalCredential",
                "name": "Bachelor of Technology in Computer Science",
                "description": "Pursuing B.Tech in Computer Science from Amrapali University. Focus on full-stack web development, data structures, and algorithms.",
                "credentialCategory": "Degree",
                "recognizedBy": {
                  "@type": "EducationalOrganization",
                  "name": "Amrapali University"
                },
                "validFrom": "2022-06-01",
                "validUntil": "2026-05-31"
              },
              {
                "@type": "WorkExperience",
                "jobTitle": "Web Development Intern",
                "hiringOrganization": {
                  "@type": "Organization",
                  "name": "Buimb Digital",
                  "url": "https://buimbdigital.com"
                },
                "startDate": "2025-06",
                "endDate": "2025-12",
                "description": "Developed responsive web solutions on deadline-driven projects. Worked with modern JavaScript frameworks, building scalable frontend and backend solutions. Enhanced teamwork and full-stack development skills through collaborative project delivery.",
                "skills": ["React.js", "Node.js", "MongoDB", "Responsive Design", "Git", "Agile Development"]
              },
              {
                "@type": "SoftwareSourceCode",
                "name": "Code with CK Portfolio",
                "codeRepository": "https://github.com/Chandanchaurasiya55",
                "description": "Professional Full Stack Developer Portfolio showcasing MERN Stack projects, skills, and services",
                "programmingLanguage": ["JavaScript", "React", "Node.js", "MongoDB"],
                "author": {
                  "@id": "https://codewithck.me/#person"
                }
              },
              {
                "@type": "Thing",
                "@id": "https://codewithck.me/#skills",
                "name": "Chandan Chaurasiya Skills",
                "description": "Expertise in MERN Stack (MongoDB, Express.js, React.js, Node.js), JavaScript, TypeScript, REST API development, JWT authentication, Gemini API integration, and full-stack web application development. Skilled in responsive design with Tailwind CSS, database design with Mongoose, and deployment on Vercel, Netlify, and Render."
              }
            ]
          }
        `}</script>
      </Helmet>

      <div id="cursor-ring" ref={ringRef}></div>
      <div id="cursor-dot" ref={dotRef}></div>
      <canvas id="bg-canvas" ref={canvasRef}></canvas>

      <div className="wrap">

        {/* NAV */}
        <nav id="nav" className={scrolled ? 'scrolled' : ''}>
          <div className="logo">Codewithck.me</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Work</a>
            <a href="#services">Services</a>
            <a href="#contact" className="nav-cta">[ Hire Me ]</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-glow"></div>
          <div className="hero-glow2"></div>
          <div className="hero-left">
            <div className="hero-tag">
              <span className="tag-dot"></span>Available for Freelance Work
            </div>
            <h1 className="hero-name">
              {/* ✅ h1 mein "Code with CK" add kiya — Google ke liye important */}
              <span className="line1">CHANDAN</span>
              <span className="line2">CHAURASIYA</span>
            </h1>
            <div className="hero-role">
              <span>&lt;</span> <b>Full Stack Developer</b> <span>/&gt;</span>
              &nbsp;·&nbsp; MERN Stack &nbsp;·&nbsp; REST API &nbsp;·&nbsp; AI Apps
            </div>
            <p className="hero-desc">
              I build <b>fast, scalable, production-ready</b> web applications.<br />
              From pixel-perfect frontends to robust backends —<br />
              complete solutions that grow with your business.
            </p>
            <div className="hero-btns">
              <a href="#projects" className="btn3d btn3d-primary">
                <span>View My Work</span><span>→</span>
              </a>
              <a href="mailto:Chandankumar8454230@gmail.com" className="btn3d btn3d-ghost">
                Let's Talk
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="photo-frame">
              <div className="photo-topbar">
                <div className="ptb-dot" style={{background:'#ff5f57'}}></div>
                <div className="ptb-dot" style={{background:'#ffbd2e'}}></div>
                <div className="ptb-dot" style={{background:'#28ca41'}}></div>
                <div className="ptb-title">chandan.jpg</div>
              </div>
              <div className="photo-box">
                <img
                  src={ck}
                  alt="Chandan Chaurasiya - Code with CK Full Stack Developer India"
                  title="Chandan Chaurasiya"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=CC&size=800&background=0d0b28&color=00fff0&bold=true&length=2&font-size=0.4';
                    e.target.alt = "Chandan Chaurasiya Avatar";
                  }}
                />
                <div className="photo-scan"></div>
                <div className="photo-corner tl"></div>
                <div className="photo-corner tr"></div>
                <div className="photo-corner bl"></div>
                <div className="photo-corner br"></div>
                <div className="photo-glow-ring"></div>
              </div>
              <div className="photo-statusbar">
                <div className="ps-dot"></div>
                <div className="ps-txt">AVAILABLE FOR HIRE</div>
              </div>
            </div>
            <div className="hero-photo-stats">
              <div className="hps"><div className="hps-num">9+</div><div className="hps-lbl">Projects</div></div>
              <div className="hps"><div className="hps-num">30</div><div className="hps-lbl">Repos</div></div>
              <div className="hps"><div className="hps-num">1yr+</div><div className="hps-lbl">Exp</div></div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span className="tick-item" key={i}>{item}</span>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <h2 className="sec-eyebrow">About Me</h2>
          <h3 className="sec-title">THE <span className="accent">DEV</span><br />BEHIND THE CODE</h3>
          <div className="about-grid">
            <div className="reveal">
              <div className="about-code-block">
                <div className="code-header">
                  <div className="code-dot" style={{background:'#ff5f57'}}></div>
                  <div className="code-dot" style={{background:'#ffbd2e'}}></div>
                  <div className="code-dot" style={{background:'#28ca41'}}></div>
                  <div className="code-title">chandan.json</div>
                </div>
                <div className="code-body">
                  <div><span className="cl-comment">// Who I am</span></div>
                  <div>{"{"}</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"name"</span>: <span className="cl-str">"Chandan Chaurasiya"</span>,</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"alias"</span>: <span className="cl-str">"Code with CK"</span>,</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"role"</span>: <span className="cl-str">"Full Stack Developer"</span>,</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"stack"</span>: <span className="cl-str">"MERN"</span>,</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"location"</span>: <span className="cl-str">"Bihar, India"</span>,</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"education"</span>: {"{"}</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="cl-prop">"degree"</span>: <span className="cl-str">"B.Tech CSE"</span>,</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="cl-prop">"university"</span>: <span className="cl-str">"Amrapali University"</span>,</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="cl-prop">"year"</span>: <span className="cl-str">"2022 – 2026"</span></div>
                  <div>&nbsp;&nbsp;{"}"},</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"experience"</span>: [<span className="cl-str">Buimb Digital Intern</span>],</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"freelance"</span>: <span className="cl-bool">true</span>,</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"openToWork"</span>: <span className="cl-bool">true</span>,</div>
                  <div>&nbsp;&nbsp;<span className="cl-prop">"Connect Me Through"</span>: <span className="cl-str">"Chandankumar8454230@gmail.com"</span></div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
            <div className="reveal reveal-d2">
              <p className="about-p">I'm a passionate <b>Full Stack Developer</b> known as <b>Chandan Kumar</b>, specializing in the <b>MERN Stack</b>. I build everything from sleek React frontends to powerful Node.js backends.</p>
              <p className="about-p">I care deeply about <b>clean code, performance, and user experience</b>. Every project I ship is production-ready, scalable, and built to last.</p>
              <p className="about-p">Currently pursuing <b>B.Tech in CSE</b> at Amrapali University while taking on freelance projects. Open to full-time roles too.</p>
              <div className="exp-block">
                <div className="exp-date">Jun 2025 — Dec 2025</div>
                <div className="exp-role">Web Development Intern</div>
                <div className="exp-co">Buimb Digital</div>
                <div className="exp-txt">Built responsive web solutions. Worked on deadline-driven projects — sharpened teamwork and full-stack development skills.</div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="skills-bg" id="skills">
          <h2 className="sec-eyebrow">Tech Stack</h2>
          <h3 className="sec-title">TOOLS I <span className="accent">MASTER</span></h3>
          <div className="skills-grid">
            {[
              { num:'01', icon:'⚛️', name:'Frontend', glow:'rgba(0,255,240,0.35)', tags:['React.js','Next.js','JavaScript ES6+','Tailwind CSS','HTML5','CSS3'] },
              { num:'02', icon:'⚙️', name:'Backend', glow:'rgba(123,47,255,0.35)', tags:['Node.js','Express.js','REST API','JWT Auth','Java'], delay:'reveal-d1' },
              { num:'03', icon:'🗄️', name:'Database', glow:'rgba(0,255,240,0.25)', tags:['MongoDB','Mongoose','NoSQL Design'], delay:'reveal-d2' },
              { num:'04', icon:'🚀', name:'DevOps & Deploy', glow:'rgba(246,173,85,0.25)', tags:['Git & GitHub','Netlify','Vercel','Render','Postman'], delay:'reveal-d3' },
              { num:'05', icon:'🤖', name:'AI & APIs', glow:'rgba(123,47,255,0.25)', tags:['Gemini API','OpenAI','REST APIs','Stripe'], delay:'reveal-d1' },
              { num:'06', icon:'🧠', name:'Soft Skills', glow:'rgba(0,255,240,0.18)', tags:['Problem Solving','Team Work','Clean Code','Communication'], delay:'reveal-d2' },
            ].map((s, i) => (
              <div className={`skill-card reveal ${s.delay || ''}`} key={i}>
                <div className="sk-glow" style={{background: s.glow}}></div>
                <div className="sk-num">{s.num}</div>
                <span className="sk-icon">{s.icon}</span>
                <div className="sk-name">{s.name}</div>
                <div className="sk-tags">
                  {s.tags.map((t, j) => <span className="sk-tag" key={j}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <h2 className="sec-eyebrow">Selected Work</h2>
          <h3 className="sec-title">PROJECTS THAT<br /><span className="accent">SPEAK FOR ME</span></h3>

          <div className="proj-card reveal">
            <div className="proj-vis">
              <div className="proj-vis-num">01</div>
              <div className="proj-scan"></div>
              <div className="proj-badge">E-Commerce · 2025</div>
              <div className="browser-mockup">
                <div className="browser-bar">
                  <div className="browser-dots">
                    <div className="b-dot" style={{background:'#ff5f57'}}></div>
                    <div className="b-dot" style={{background:'#ffbd2e'}}></div>
                    <div className="b-dot" style={{background:'#28ca41'}}></div>
                  </div>
                  <div className="browser-url">
                    <span className="url-lock">🔒</span>
                    <span className="url-text">tubisshop.com</span>
                  </div>
                  <div className="browser-menu">⋯</div>
                </div>
                <div className="browser-screen">
                  <iframe
                    src="https://tubisshop.com"
                    title="TubisShop E-Commerce - Modern E-commerce Platform built with MERN Stack"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    scrolling="no"
                    loading="lazy"
                    width="100%"
                    height="100%"
                    onLoad={(e) => { e.target.scrolling = 'no'; window.scrollTo(0, 0); }}
                  ></iframe>
                  <div className="iframe-overlay"></div>
                </div>
              </div>
            </div>
            <div className="proj-info">
              <span className="proj-idx">01</span>
              <div className="proj-cat">Full-Stack · E-Commerce · MERN</div>
              <h3 className="proj-name"><span>Modern E-commerce Platform</span></h3>
              <p className="proj-desc">High-performance online marketplace with Stripe payment integration, real-time inventory management, and a custom CMS. Built to handle scale with a full MERN stack architecture.</p>
              <div className="proj-tech">
                {['React','Node.js','MongoDB','Stripe API','REST API'].map((t, i) => <span className="pt" key={i}>{t}</span>)}
              </div>
              <div className="proj-actions">
                 <a href="https://tubisshop.com" target="_blank" rel="noreferrer" className="pa pa-live">Live Demo ↗</a>
                <a href="https://github.com/Chandanchaurasiya55/E-Commerce-MERN-Stack-Project" target="_blank" rel="noreferrer" className="pa pa-code">View Code ↗</a>
              </div>
            </div>
          </div>

          <div className="proj-card flip reveal">
            <div className="proj-info">
              <span className="proj-idx">02</span>
              <div className="proj-cat">Food App · Full-Stack · React</div>
              <h3 className="proj-name"><span>Reel to Meal</span></h3>
              <p className="proj-desc">Interactive food ordering platform where users browse dishes through short reels. Combines the viral scroll experience with seamless real-world ordering — built with React + Express.</p>
              <div className="proj-tech">
                {['React','Express.js','REST API','Vercel'].map((t, i) => <span className="pt" key={i}>{t}</span>)}
              </div>
              <div className="proj-actions">
                <a href="https://reeltomeal.vercel.app" target="_blank" rel="noreferrer" className="pa pa-live">Live Demo ↗</a>
                <a href="https://github.com/Chandanchaurasiya55/Food-View-Mern-Stack" target="_blank" rel="noreferrer" className="pa pa-code">View Code ↗</a>
              </div>
            </div>
            <div className="proj-vis">
              <div className="proj-vis-num">02</div>
              <div className="proj-scan" style={{animationDelay:'1s'}}></div>
              <div className="proj-badge">Food App · 2025</div>
              <div className="browser-mockup">
                <div className="browser-bar">
                  <div className="browser-dots">
                    <div className="b-dot" style={{background:'#ff5f57'}}></div>
                    <div className="b-dot" style={{background:'#ffbd2e'}}></div>
                    <div className="b-dot" style={{background:'#28ca41'}}></div>
                  </div>
                  <div className="browser-url">
                    <span className="url-lock">🔒</span>
                    <span className="url-text">reeltomeal.vercel.app</span>
                  </div>
                  <div className="browser-menu">⋯</div>
                </div>
                <div className="browser-screen">
                  <iframe
                    src="https://reeltomeal.vercel.app"
                    title="Reel to Meal - Interactive Food Ordering Platform with React and API"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                    scrolling="no"
                    width="100%"
                    height="100%"
                    onLoad={(e) => { e.target.scrolling = 'no'; window.scrollTo(0, 0); }}
                  ></iframe>
                  <div className="iframe-overlay"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="proj-card reveal">
            <div className="proj-vis">
              <div className="proj-vis-num">03</div>
              <div className="proj-scan" style={{animationDelay:'2s'}}></div>
              <div className="proj-badge">AI App · 2025</div>
              <div className="browser-mockup">
                <div className="browser-bar">
                  <div className="browser-dots">
                    <div className="b-dot" style={{background:'#ff5f57'}}></div>
                    <div className="b-dot" style={{background:'#ffbd2e'}}></div>
                    <div className="b-dot" style={{background:'#28ca41'}}></div>
                  </div>
                  <div className="browser-url">
                    <span className="url-lock">🔒</span>
                    <span className="url-text">devdoseai.netlify.app</span>
                  </div>
                  <div className="browser-menu">⋯</div>
                </div>
                <div className="browser-screen">
                  <iframe
                    src="https://devdoseai.netlify.app"
                    title="DevDose AI ChatBot - AI-Powered AI Web Assistant"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    scrolling="no"
                    loading="lazy"
                    width="100%"
                    height="100%"
                    onLoad={(e) => { e.target.scrolling = 'no'; window.scrollTo(0, 0); }}
                  ></iframe>
                  <div className="iframe-overlay"></div>
                </div>
              </div>
            </div>
            <div className="proj-info">
              <span className="proj-idx">03</span>
              <div className="proj-cat">DevDose Ai. AI Application · React</div>
              <h3 className="proj-name"><span>DevDose AI ChatBot</span></h3>
              <p className="proj-desc">Intelligent web assistant powered by AI. Real-time natural language responses, data stream tracking, and beautiful UI. Shows deep integration of AI into modern web apps.</p>
              <div className="proj-tech">
                {['React','Tailwind CSS','Gemini API','Netlify'].map((t, i) => <span className="pt" key={i}>{t}</span>)}
              </div>
              <div className="proj-actions">
                <a href="https://devdoseai.netlify.app" target="_blank" rel="noreferrer" className="pa pa-live">Live Demo ↗</a>
                <a href="https://github.com/Chandanchaurasiya55/DevDose-AI" target="_blank" rel="noreferrer" className="pa pa-code">View Code ↗</a>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services-bg" id="services">
          <h2 className="sec-eyebrow">What I Offer</h2>
          <h3 className="sec-title">SERVICES FOR<br /><span className="accent">FREELANCE CLIENTS</span></h3>
          <div className="svc-grid">
            {[
              { num:'01', icon:'🌐', title:'Full Stack Web Apps', desc:'End-to-end MERN applications — responsive UI, scalable API, production deployment.', feats:['React / Next.js Frontend','Node.js + Express Backend','MongoDB Database Design','Deploy on Vercel / Render'] },
              { num:'02', icon:'🛒', title:'E-Commerce Solutions', desc:'Custom online stores with payments, inventory management, and admin dashboards.', feats:['Stripe / Razorpay Integration','Product & Order Management','Custom Admin CMS','Cart & Wishlist Features'], delay:'reveal-d1' },
              { num:'03', icon:'⚡', title:'REST API Development', desc:'Clean, documented APIs with auth, rate limiting, and scalable architecture.', feats:['JWT Authentication','CRUD Operations','API Documentation','Third-party Integrations'], delay:'reveal-d2' },
              { num:'04', icon:'🎨', title:'Landing Pages & UI', desc:'High-converting pages with pixel-perfect responsive design and smooth animations.', feats:['Mobile-First Design','Tailwind CSS Styling','Smooth Animations','Fast Load Performance'] },
              { num:'05', icon:'🤖', title:'AI-Powered Apps', desc:'Applications with Gemini / OpenAI — chatbots, content tools, and smart features.', feats:['Gemini / OpenAI Integration','Real-time AI Chat','AI-Enhanced UX','Prompt Engineering'], delay:'reveal-d1' },
              { num:'06', icon:'🔧', title:'Maintenance & Support', desc:'Bug fixes, performance optimization, feature additions for existing projects.', feats:['Bug Fixing & Debugging','Performance Optimization','Code Review & Refactor','Feature Development'], delay:'reveal-d2' },
            ].map((s, i) => (
              <div className={`svc-card reveal ${s.delay || ''}`} key={i}>
                <div className="svc-idx">{s.num}</div>
                <div className="svc-icon">{s.icon}</div>
                <div className="svc-title">{s.title}</div>
                <p className="svc-desc">{s.desc}</p>
                <div className="svc-feats">
                  {s.feats.map((f, j) => <span className="svc-feat" key={j}>{f}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="contact-wrap">
            <h2 className="sec-eyebrow" style={{justifyContent:'center'}}>Get In Touch</h2>
            <h3 className="contact-big">
              LET'S BUILD<br /><span className="glitch">SOMETHING</span><br />GREAT Together
            </h3>
            <p className="contact-sub">
              Looking for a reliable full-stack developer for your next project? I'm open to freelance, collaborations, and full-time opportunities.
            </p>
            <div className="contact-cards">
              <a href="mailto:Chandankumar8454230@gmail.com" className="cc reveal">
                <div className="cc-icon">✉️</div>
                <div className="cc-label">Email</div>
                <div className="cc-val">Chandankumar8454230@gmail.com</div>
              </a>
              <a href="https://github.com/Chandanchaurasiya55" target="_blank" rel="noreferrer" className="cc reveal reveal-d1">
                <div className="cc-icon">⌨️</div>
                <div className="cc-label">GitHub</div>
                <div className="cc-val">@Chandanchaurasiya55</div>
              </a>
              <a href="https://www.linkedin.com/in/chandanchaurasiya-dev" target="_blank" rel="noreferrer" className="cc reveal reveal-d2">
                <div className="cc-icon">💼</div>
                <div className="cc-label">LinkedIn</div>
                <div className="cc-val">chandanchaurasiya-dev</div>
              </a>
            </div>
            <div className="hero-btns" style={{justifyContent:'center', gap:'16px'}}>
              <a href="mailto:Chandankumar8454230@gmail.com" className="btn3d btn3d-primary">
                <span>Send Me a Message</span><span>→</span>
              </a>
              <a href="/chandan_cv.pdf" download="Chandan_Kumar_CV.pdf" className="btn3d btn3d-ghost">
                Download CV
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          {/* ✅ Footer mein "Code with CK" add kiya */}
          <div className="foot-logo">Code with CK</div>
          <div className="foot-txt">© 2025 · Chandan Chaurasiya · Code with CK · Built with passion</div>
          <div className="foot-links">
            <a href="#home">Top</a>
            <a href="#projects">Work</a>
            <a href="#contact">Contact</a>
          </div>
        </footer>

      </div>
    </>
  );
}

export default App;