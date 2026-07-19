/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from './auth/context/AuthContext';
import logoImg from '../picss/iet logo.png';
import whoWeAreImg from './assets/about_who_we_are.jpg';
import iit1Img from '../picss/iit1.png';
import iit2Img from '../picss/iit2.jpeg';
import iit3Img from '../picss/iit3.jpeg';
import veeraImg from '../picss/veera.jpeg';
import hariniImg from '../picss/harini.jpeg';
import rajuImg from '../picss/raju.jpeg';
import raziaImg from '../picss/razia.jpeg';
import divyaImg from '../picss/divya.jpeg';
import varunImg from '../picss/varun.jpeg';
import naziaImg from '../picss/nazia.jpeg';
import chandraImg from '../picss/chandra.jpeg';
import iasClassesImg from '../picss/IAS_classes.jpeg';
import rtihAmaravatiImg from '../picss/rtih_amaravati.jpeg';
import policehackImg from '../picss/policehack.png';
import aiFirImg from '../picss/AI_FIR.jpeg';

// About section images
import ourMissionImg from '../picss/ourmission.jpeg';
import ourVisionImg from '../picss/ourvision.jpeg';
import ourValuesImg from '../picss/ourvalues.jpeg';
import ourJourneyImg from '../picss/iit4.jpeg';
import indianHrCoverImg from '../picss/indian_hr_cover.png';

// Incux Logo
import incuxLogoImg from '../picss/iet logo.png';

// Partner Logos
import jvvLogo from './assets/JVV.jpeg';
import sunLogo from './assets/SUN.jpeg';
import covidfightersLogo from './assets/covidfighters.jpeg';
import elivatxLogo from './assets/elivatx.jpeg';
import hcetLogo from './assets/hcet.jpeg';
import jobreciepeLogo from './assets/jobreciepe.jpeg';

// Slides details (Futuristic city, AI students, robotics, technology, smart agritech)
const slideImages = [
  ourJourneyImg,
  iit2Img,
  iit1Img,
  ourJourneyImg,
  iit2Img,
  iit1Img
];

const taglines = [
  "AI for Smart Cities",
  "AI for Education",
  "AI for Health",
  "AI for Our Planet"
];

// AI Course Categories Metadata
const aiCategories: any[] = [
  {
    id: 'hr',
    icon: '👤',
    label: 'AI for HR',
    color: 'ai-hr',
    image: indianHrCoverImg,
    brief: 'Automate recruitment, analyze employee sentiment, write JD with AI.',
    desc: 'Exclusively for HR professionals. Verify official credentials to access.',
    tips: [],
    quiz: { q: 'Which tool can assist in screening candidate resumes?', opts: ['ChatGPT', 'Microsoft Paint', 'Google Maps', 'Spotify'], ans: 0 },
    ytId: 'a0_lo_GDcFw',
    progress: 0,
    topics: [],
    comingSoon: false
  },
  {
    id: 'teachers',
    icon: '🧑‍🏫',
    label: 'AI for Teachers',
    color: 'ai-teachers',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop',
    brief: 'Automate grading, create lesson plans, generate quizzes with AI.',
    desc: 'Coming Soon — Automate grading, create personalized lesson plans, and generate quizzes.',
    tips: [],
    quiz: { q: '', opts: [], ans: 0 },
    ytId: '',
    progress: 0,
    topics: [],
    comingSoon: true
  },
  {
    id: 'police',
    icon: '👮',
    label: 'AI for Police',
    color: 'ai-police',
    image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=600&auto=format&fit=crop',
    brief: 'AI-powered FIR analysis, crime pattern detection, evidence management.',
    desc: 'Coming Soon — AI tools for law enforcement, crime analytics, and evidence processing.',
    tips: [],
    quiz: { q: '', opts: [], ans: 0 },
    ytId: '',
    progress: 0,
    topics: [],
    comingSoon: true
  }
];

const hrCurriculum = [
  {
    section: "Section 1: AI in Talent Acquisition & Recruitment",
    videos: [
      {
        title: "1.1 Automated Resume Screening with GPT-4",
        duration: "12m",
        description: "Learn how to parse resumes, rank applicants, and extract candidate skills using structured prompt patterns.",
        videoUrl: "https://www.youtube.com/embed/a0_lo_GDcFw"
      },
      {
        title: "1.2 Designing Interactive Screening Chatbots",
        duration: "15m",
        description: "Build custom chatbots that conduct initial behavioral screenings and answer applicant questions automatically.",
        videoUrl: "https://www.youtube.com/embed/0yCJMt9Mx9c"
      }
    ]
  },
  {
    section: "Section 2: Employee Retention & Sentiment Analytics",
    videos: [
      {
        title: "2.1 Sentiment Analysis of Annual Surveys",
        duration: "18m",
        description: "Leverage natural language processing to gauge team satisfaction, identify burnout hotspots, and summarize feedback.",
        videoUrl: "https://www.youtube.com/embed/qYNweeDHiyU"
      },
      {
        title: "2.2 Predictive Attrition Models with LLMs",
        duration: "20m",
        description: "Use case studies to analyze risk factors and preemptively flag high-performing employee turnover trends.",
        videoUrl: "https://www.youtube.com/embed/a0_lo_GDcFw"
      }
    ]
  },
  {
    section: "Section 3: AI Policies, Ethics & Governance",
    videos: [
      {
        title: "3.1 Data Privacy & GDPR in HR Tech",
        duration: "14m",
        description: "Understand legal guidelines when processing candidate and employee data using public and private LLM APIs.",
        videoUrl: "https://www.youtube.com/embed/0yCJMt9Mx9c"
      },
      {
        title: "3.2 Eliminating Bias in AI Hiring Algorithms",
        duration: "22m",
        description: "Implement fairness constraints and verify model outputs to prevent bias against gender, race, or age.",
        videoUrl: "https://www.youtube.com/embed/qYNweeDHiyU"
      }
    ]
  }
];

// Standalone Quiz Questions for Student Portal
const quizBank = [
  { q: 'What does AI stand for?', opts: ['Automatic Internet', 'Artificial Intelligence', 'Advanced Information', 'Automated Interface'], ans: 1 },
  { q: 'Which company made ChatGPT?', opts: ['Google', 'Meta', 'OpenAI', 'Microsoft'], ans: 2 },
  { q: 'What is machine learning?', opts: ['Teaching humans machines', 'AI learning from data', 'Learning to type fast', 'Fixing computers'], ans: 1 },
  { q: 'Which of these is an AI image generator?', opts: ['Excel', 'Photoshop', 'Midjourney', 'Notepad'], ans: 2 },
  { q: 'What is a neural network inspired by?', opts: ['Computer chips', 'Human brain', 'Internet cables', 'Solar panels'], ans: 1 }
];

export default function App() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout: authLogout } = useAuth();
  const [isIitPaymentFlow, setIsIitPaymentFlow] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // --- CORPORATE COURSE SYSTEM STATES ---
  const [showHrPopup, setShowHrPopup] = useState(false);
  const [corpExpandedModule, setCorpExpandedModule] = useState<number | null>(null);
  const [corpIsRegistered, setCorpIsRegistered] = useState<boolean>(() => {
    return localStorage.getItem('corp_otp_verified') === 'true';
  });
  const [corpShowRegModal, setCorpShowRegModal] = useState(false);
  const [corpShowOtpModal, setCorpShowOtpModal] = useState(false);
  const [corpRegForm, setCorpRegForm] = useState({
    fullName: '',
    personalEmail: '',
    phone: '',
    workEmail: '',
    companyName: '',
    location: '',
    role: ''
  });
  const [corpFormErrors, setCorpFormErrors] = useState<Record<string, string>>({});
  const [corpGeneratedOtp, setCorpGeneratedOtp] = useState<string>('');
  const [corpEnteredOtp, setCorpEnteredOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [corpOtpAttempts, setCorpOtpAttempts] = useState(0);
  const [corpOtpTimer, setCorpOtpTimer] = useState(600); // 10 minutes (600s)
  const [corpResendTimer, setCorpResendTimer] = useState(60); // 60 seconds
  const [corpVerificationLoading, setCorpVerificationLoading] = useState(false);
  const [corpSuccessAnimation, setCorpSuccessAnimation] = useState(false);
  const [corpActiveTab, setCorpActiveTab] = useState<'lessons' | 'resources'>('lessons');
  const [corpActiveSectionIdx, setCorpActiveSectionIdx] = useState(0);
  const [corpActiveVideoIdx, setCorpActiveVideoIdx] = useState(0);
  const [corpToastMessage, setCorpToastMessage] = useState<string | null>(null);

  // Show AI for HR popup after 1.5 seconds when the website is opened
  useEffect(() => {
    const timer = setTimeout(() => {
      const isVerified = localStorage.getItem('corp_otp_verified') === 'true';
      if (!isVerified) {
        setShowHrPopup(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const validateCorpForm = () => {
    const errors: Record<string, string> = {};
    if (!corpRegForm.fullName.trim()) errors.fullName = "Full Name is required.";
    if (!corpRegForm.personalEmail.trim()) {
      errors.personalEmail = "Personal Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(corpRegForm.personalEmail)) {
      errors.personalEmail = "Invalid email format.";
    }
    if (!corpRegForm.phone.trim()) {
      errors.phone = "Phone Number is required.";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(corpRegForm.phone)) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (!corpRegForm.companyName.trim()) errors.companyName = "Company Name is required.";
    if (!corpRegForm.location.trim()) errors.location = "Location is required.";
    if (!corpRegForm.role) errors.role = "Please select a Role.";
    
    setCorpFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCorpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCorpForm()) {
      // Save registration data temporarily (without work email — verified on next page)
      const registrationData = {
        fullName: corpRegForm.fullName,
        personalEmail: corpRegForm.personalEmail,
        phone: corpRegForm.phone,
        companyName: corpRegForm.companyName,
        location: corpRegForm.location,
        role: corpRegForm.role,
      };
      localStorage.setItem('pending_corp_registration', JSON.stringify(registrationData));
      setCorpShowRegModal(false);
      navigate('/verify-work-email');
    }
  };

  // --- INCUXAI IIT VISIT PAYMENT INJECTION ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regCode = params.get('reg_code');
    const amountPaise = params.get('amount_paise'); // pre-calculated by incuxai-web PHP (coupon already applied)
    const token = params.get('token');

    // 1. New Secure JWT Payment Flow
    if (token) {
      setIsIitPaymentFlow(true);
      const apiBase = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001';
      
      // Step A: Verify checkout token
      fetch(`${apiBase}/api/verify-checkout-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(verifyTokenData => {
        if (verifyTokenData.error || !verifyTokenData.payload) {
          setPaymentError(verifyTokenData.error || 'Invalid checkout session.');
          return;
        }

        const payload = verifyTokenData.payload;

        // Step B: Create trust order
        fetch(`${apiBase}/api/create-trust-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })
        .then(res => res.json())
        .then(orderData => {
          if (orderData.error) {
            setPaymentError(orderData.error);
            return;
          }

          // Step C: Initialize Razorpay
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T89U7UEA6mDKNX',
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'IncuXai Education Trust',
            description: payload.course_id === 'plan_a' ? 'IncuX Academy Plan 1 (₹499)' : (payload.course_id === 'plan_b' ? 'IncuX Academy Plan 2 (₹899)' : 'IncuX Academy Course Payment'),
            order_id: orderData.order_id,
            prefill: {
              name: payload.name || '',
              email: payload.email || '',
              contact: payload.phone || '',
            },
            notes: {
              transaction_id: payload.transaction_id,
              user_id: payload.user_id,
            },
            handler: function (response: any) {
              // Step D: Verify payment signature on Trust Backend
              fetch(`${apiBase}/api/verify-trust-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  token: token
                }),
              })
              .then(res => res.json())
              .then(verifyData => {
                if (verifyData.status === 'success') {
                  // Step E: Redirect back to Academy with success reference token
                  window.location.href = `${payload.callback_url}?reference=${verifyData.success_token}`;
                } else {
                  setPaymentError('Payment verification failed. Please contact support.');
                }
              })
              .catch(() => {
                setPaymentError('Internal verification error. Please contact support.');
              });
            },
            theme: { color: '#9B7A3E' },
            modal: {
              ondismiss: function() {
                // Redirect back to Academy with cancellation status
                window.location.href = `${payload.callback_url}?error=cancelled`;
              }
            }
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        })
        .catch(() => {
          setPaymentError('Unable to generate payment order. Please try again.');
        });
      })
      .catch(() => {
        setPaymentError('Secure payment session could not be established. Please try again.');
      });
      return;
    }

    // 2. Legacy IIT Payment Flow
    if (regCode) {
      setIsIitPaymentFlow(true);
      let apiUrl = (import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001') + '/api/get-registration/' + regCode;
      if (amountPaise) {
        apiUrl += '?amount_paise=' + amountPaise;
      }
      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setPaymentError(data.error);
            window.location.href = (import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5173') + '/payment.php';
            return;
          }
          
          fetch((import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001') + '/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: data.amount, currency: 'INR', receipt: 'iit_' + regCode }),
          })
          .then(res => res.json())
          .then(orderData => {
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T89U7UEA6mDKNX',
              amount: orderData.amount,
              currency: orderData.currency,
              name: 'IncuXai Education Trust',
              description: 'IIT Visit Program Payment',
              order_id: orderData.order_id,
              prefill: {
                name: data.name || '',
                email: data.email || '',
                contact: data.phone || '',
              },
              notes: {
                registration_code: regCode,
              },
              handler: function (response: any) {
                fetch((import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001') + '/api/verify-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    reg_code: regCode,
                    amount_paid: orderData.amount
                  }),
                })
                .then(res => res.json())
                .then(verifyData => {
                  if (verifyData.status === 'success') {
                    window.location.href = (import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5173') + '/payment-confirm.php?t=' + verifyData.success_token;
                  } else {
                    setPaymentError('Verification failed. Please contact support.');
                  }
                });
              },
              theme: { color: '#9B7A3E' },
              modal: {
                ondismiss: function() {
                  window.location.href = (import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5173') + '/payment.php';
                }
              }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          });
        })
        .catch(err => {
          console.error(err);
          setPaymentError('Failed to securely initialize payment. Please try again.');
        });
    }
  }, []);
  // --- END INCUXAI IIT VISIT PAYMENT INJECTION ---



  useEffect(() => {
    // ===== BIND GLOBALS ON WINDOW TO KEEPS INLINE RE-DIRECTS WORKING EXACTLY SAME =====
    const w = window as any;

    const getSafeArray = (key: string): any[] => {
      try {
        const val = localStorage.getItem(key);
        if (!val) return [];
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    };

    let currentUser: any = null;
    let currentSlide = 0;
    const totalSlides = slideImages.length;
    const videoLinks: Record<string, string> = {};
    aiCategories.forEach(c => {
      videoLinks[c.id] = 'https://www.youtube.com/embed/' + c.ytId;
    });

    // Robust Spline Robot Scene Loader (Native Vite import compilation)
    const loadSpline = async () => {
      const canvas = document.getElementById('canvas3d') as HTMLCanvasElement;
      if (!canvas) return;
      if (canvas.getAttribute('data-spline-initialized') === 'true') return;
      canvas.setAttribute('data-spline-initialized', 'true');
      
      try {
        const { Application } = await import('@splinetool/runtime');
        const appInstance = new Application(canvas);
        appInstance.load('https://prod.spline.design/cfZFmmr0Xya02asA/scene.splinecode')
            .then(() => {
              // Hide any watermarks safely
              setTimeout(() => {
                const wm = document.querySelectorAll('[class*="logo"],[id*="logo"],[data-spline]');
                wm.forEach(el => {
                  if (el.tagName !== 'CANVAS' && el instanceof HTMLElement) {
                    // Do NOT hide our header/footer logo of the educational trust
                    if (!el.closest('header') && !el.closest('footer')) {
                      el.style.display = 'none';
                    }
                  }
                });
                
                const c = document.getElementById('canvas3d');
                if (c && c.parentElement) {
                  Array.from(c.parentElement.children).forEach(ch => {
                    if (ch.id !== 'canvas3d' && ch.tagName !== 'CANVAS' && ch instanceof HTMLElement) {
                      ch.style.display = 'none';
                    }
                  });
                }
              }, 3000);
            })
            .catch(err => {
              console.warn("Spline load promise error", err);
            });
        } catch (err) {
          console.warn("Spline application load caught error", err);
        }
    };

    loadSpline();
    w.reinitSplineRobotOnDemand = loadSpline;

    let checkAttempts = 0;
    const checkInterval = setInterval(() => {
      const canvas = document.getElementById('canvas3d');
      if (canvas && canvas.getAttribute('data-spline-initialized') !== 'true') {
        loadSpline();
        clearInterval(checkInterval);
      }
      if (++checkAttempts > 30) {
        clearInterval(checkInterval);
      }
    }, 500);

    // Floating Particles Setup (Disabled per user request)
    const container = document.getElementById('particles');
    if (container) {
      container.innerHTML = '';
    }

    // Type tagline animation
    const typeTagline = (text: string) => {
      const taglineEl = document.getElementById('tagline-text');
      if (!taglineEl) return;
      taglineEl.textContent = text;
    };

    w.goToSlide = (n: number) => {
      const activeSlides = document.querySelectorAll('.slide');
      const activeDots = document.querySelectorAll('.slider-dots .dot');
      if (activeSlides.length > 0) {
        activeSlides[currentSlide]?.classList.remove('active');
        if (activeDots && activeDots[currentSlide]) {
          activeDots[currentSlide].classList.remove('active');
        }
        currentSlide = n;
        activeSlides[currentSlide]?.classList.add('active');
        if (activeDots && activeDots[currentSlide]) {
          activeDots[currentSlide].classList.add('active');
        }
        typeTagline(taglines[currentSlide % taglines.length]);
      }
    };

    // Auto rotate slides
    const sliderInterval = setInterval(() => {
      w.goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
    const initTimeout = setTimeout(() => typeTagline(taglines[0]), 500);

    // Dynamic numeric animations
    const animateCounter = (el: HTMLElement | null, target: number, suffix = '') => {
      if (!el) return;
      let current = 0;
      const step = target / 60;
      const t = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(t);
        }
        el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
      }, 30);
    };



    // 3D Cube Rotation Logic (mission/vision/values/journey)
    let lastManualCubeClick = 0;
    let currentActiveCubeIndex = 0;
    w.rotateCubeToIndex = (index: number, isManualClick = false) => {
      const cube = document.getElementById('about-cube');
      if (!cube) return;

      if (isManualClick) {
        lastManualCubeClick = Date.now();
        currentActiveCubeIndex = index;
      }

      // Rotate Y coordinate (index 0 is 0deg, 1 is -90deg, 2 is -180deg, 3 is -270deg)
      const angleY = index * -90;
      cube.style.transform = `rotateY(${angleY}deg)`;

      // Update button active state
      const buttons = document.querySelectorAll('.about-pill-btn');
      buttons.forEach((btn, idx) => {
        if (idx === index) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    };

    // Toggle compact values
    w.toggleValues = () => {
      const list = document.getElementById('values-list');
      const arrow = document.getElementById('values-arrow');
      if (list) {
        const hidden = list.style.display === 'none';
        list.style.display = hidden ? 'flex' : 'none';
        if (arrow) arrow.textContent = hidden ? '▲' : '▼';
      }
    };

    // Nav Switcher
    w.showPage = (id: string) => {
      const header = document.querySelector('header');
      if (id === 'home') {
        if (header) header.classList.remove('page-active');
      } else {
        if (header) header.classList.add('page-active');
      }
      const portalPages = ['vol-portal', 'admin-portal', 'teacher-portal'];
      if (portalPages.includes(id)) {
        if (header) header.classList.add('portal-mode');
      } else {
        if (header) header.classList.remove('portal-mode');
      }
      if (id === 'about') {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const homePage = document.getElementById('home');
        if (homePage) homePage.classList.add('active');
        document.querySelectorAll('nav > a, nav > .nav-item > a').forEach(a => a.classList.remove('active'));
        const navItems = document.querySelectorAll('nav > a, nav > .nav-item > a');
        if (navItems[1]) navItems[1].classList.add('active');
        document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const footerHide = ['vol-portal', 'admin-portal', 'teacher-portal'];
      const targetPage = document.getElementById(id);
      if (targetPage) {
        targetPage.classList.add('active');
      }
      document.querySelectorAll('nav > a, nav > .nav-item > a').forEach(a => a.classList.remove('active'));
      const navItems = document.querySelectorAll('nav > a, nav > .nav-item > a');
      const navMap: Record<string, number> = { home: 0, about: 1, ai4all: 2, programs: 3, volunteer: 4, teachxai: 5, gallery: 6, contact: 7, donate: 8, 'corporate-course': 2 };
      if (navMap[id] !== undefined && navItems[navMap[id]]) {
        navItems[navMap[id]].classList.add('active');
      }
      const footer = document.getElementById('main-footer');
      if (footer) {
        footer.style.display = footerHide.includes(id) ? 'none' : 'block';
      }
      if (id === 'home') {
        setTimeout(() => {
          loadSpline();
        }, 100);
      }
      window.scrollTo(0, 0);
    };

    // Logins
    w.handleLoginBtn = () => {
      if (currentUser) {
        currentUser = null;
        w.currentUserEmail = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserEmail');
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.textContent = 'Login';
        const loggedUserEl = document.getElementById('logged-user');
        if (loggedUserEl) loggedUserEl.style.display = 'none';
        w.showPage('home');
      } else {
        w.openModal();
      }
    };

    w.openModal = () => {
      const modal = document.getElementById('login-modal');
      if (modal) modal.classList.add('active');
    };

    w.closeModal = () => {
      const modal = document.getElementById('login-modal');
      if (modal) modal.classList.remove('active');
      const success = document.getElementById('modal-success');
      if (success) success.style.display = 'none';
      document.querySelectorAll('#login-modal .modal-form').forEach(f => {
        (f as HTMLElement).style.display = '';
        f.classList.remove('active');
      });
      const volTab = document.getElementById('volunteer-tab');
      if (volTab) volTab.classList.add('active');
      const tabElements = document.querySelectorAll('.modal-tab');
      tabElements.forEach((t, i) => {
        if (i === 0) t.classList.add('active');
        else t.classList.remove('active');
      });
    };

    w.openSignUpModal = () => {
      const modal = document.getElementById('signup-modal');
      if (modal) modal.classList.add('active');
    };

    w.closeSignUpModal = () => {
      const modal = document.getElementById('signup-modal');
      if (modal) modal.classList.remove('active');
    };

    w.switchTab = (id: string, e: Event) => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      if (e && e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('active');
      }
      document.querySelectorAll('#login-modal .modal-form').forEach(f => f.classList.remove('active'));
      const targetForm = document.getElementById(id);
      if (targetForm) targetForm.classList.add('active');
    };

    w.loginUser = (role: string) => {
      const success = document.getElementById('modal-success');
      document.querySelectorAll('#login-modal .modal-form').forEach(f => {
        (f as HTMLElement).style.display = 'none';
      });
      if (success) success.style.display = 'block';

      let name = 'User';
      if (role === 'volunteer') {
        const email = (document.getElementById('vol-login-email') as HTMLInputElement)?.value;
        const pass = (document.getElementById('vol-login-pass') as HTMLInputElement)?.value;
        const volCreds = getSafeArray('volunteer_pass');
        const found = volCreds.find((v: any) => v && v.email === email && v.password === pass);
        if (!found) {
          w.showToast('Invalid email or password');
          document.querySelectorAll('#login-modal .modal-form').forEach(f => { (f as HTMLElement).style.display = ''; });
          if (success) success.style.display = 'none';
          return;
        }
        name = found.name || email.split('@')[0];
        w.currentUserEmail = email;
      } else if (role === 'teacher') {
        const email = (document.getElementById('tch-login-email') as HTMLInputElement)?.value;
        const pass = (document.getElementById('tch-login-pass') as HTMLInputElement)?.value;
        const teacherCreds = getSafeArray('teachxai_teachers_pass');
        const found = teacherCreds.find((t: any) => t && t.email === email && t.password === pass);
        if (!found) {
          w.showToast('Invalid teacher credentials');
          document.querySelectorAll('#login-modal .modal-form').forEach(f => { (f as HTMLElement).style.display = ''; });
          if (success) success.style.display = 'none';
          return;
        }
        name = found.name || email.split('@')[0];
        w.currentUserEmail = email;
      } else {
        const email = (document.getElementById('ad-login-email') as HTMLInputElement)?.value;
        const pass = (document.getElementById('ad-login-pass') as HTMLInputElement)?.value;
        if (email !== 'sravanpasam74@gmail.com' || pass !== 'admin123') {
          w.showToast('Invalid admin credentials');
          document.querySelectorAll('#login-modal .modal-form').forEach(f => { (f as HTMLElement).style.display = ''; });
          if (success) success.style.display = 'none';
          return;
        }
        name = 'Admin';
      }

      const successMsg = document.getElementById('success-msg');
      if (successMsg) successMsg.textContent = `Welcome ${name}! Redirecting to your portal...`;

      currentUser = { role, name };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      if (w.currentUserEmail) localStorage.setItem('currentUserEmail', w.currentUserEmail);
      const loginBtn = document.getElementById('login-btn');
      if (loginBtn) loginBtn.textContent = 'Logout';
      const loggedUserEl = document.getElementById('logged-user');
      if (loggedUserEl) {
        loggedUserEl.textContent = name;
        loggedUserEl.style.display = 'inline';
      }

      setTimeout(() => {
        w.closeModal();
        if (role === 'volunteer') {
          const pName = document.getElementById('portal-name');
          const pFullName = document.getElementById('portal-fullname');
          const pAvatar = document.getElementById('portal-avatar');
          if (pName) pName.textContent = name;
          if (pFullName) pFullName.textContent = name;
          if (pAvatar) pAvatar.textContent = name[0].toUpperCase();
          
          // Re-render portal panels on dynamic login
          w.renderEvents();
          w.renderTasks();
          w.renderVolunteersAndLeaderboard();
          // Populate profile fields
          w.populateVolunteerProfile();
          w.showPage('vol-portal');
        } else if (role === 'teacher') {
          const tpName = document.getElementById('tportal-name');
          const tpFullName = document.getElementById('tportal-fullname');
          const tpAvatar = document.getElementById('tportal-avatar');
          if (tpName) tpName.textContent = name;
          if (tpFullName) tpFullName.textContent = name;
          if (tpAvatar) tpAvatar.textContent = name[0].toUpperCase();
          w.renderTeacherPortal();
          w.showPage('teacher-portal');
        } else {
          w.renderEvents();
          w.renderTasks();
          w.renderVolunteersAndLeaderboard();
          w.loadEventRegistrations();
          w.showPage('admin-portal');
        }
      }, 1500);
    };

    // ===== PERSISTENT DATA LAYER & UI SYNC SYSTEM =====
    w.initData = async () => {
      // Force clear stale mock data from localStorage for returning users
      try {
        const cachedVols = JSON.parse(localStorage.getItem('volunteers') || '[]');
        const hasMock = cachedVols.some((v: any) => v && (v.email === 'ravi@gmail.com' || v.email === 'priya@gmail.com' || v.email === 'arun@gmail.com' || v.email === 'neha@gmail.com'));
        if (hasMock) {
          localStorage.removeItem('volunteers');
          localStorage.removeItem('volunteer_pass');
          localStorage.removeItem('assignedTasks');
          localStorage.removeItem('eventRegistrations');
          localStorage.removeItem('volunteer_applications');
        }
      } catch (e) {
        console.warn('Failed to parse cache:', e);
      }
      if (!localStorage.getItem('events')) {
        const defaultEvents = [
          { id: 'ev1', title: 'AI for Farmers Workshop', date: '2025-06-15', location: 'Vijayawada', slots: 50, registeredCount: 42, dept: 'AI Training & Education', desc: 'Help Guntur district farmers leverage Plantix and agricultural chatbots to detect crop disease and boost yield.' },
          { id: 'ev2', title: 'School AI Literacy Drive', date: '2025-06-22', location: 'Guntur', slots: 60, registeredCount: 35, dept: 'Field Outreach', desc: 'Teach foundational AI skills and prompt engineering to government school students.' },
          { id: 'ev3', title: 'MSME Digital AI Workshop', date: '2025-07-01', location: 'Hyderabad', slots: 30, registeredCount: 25, dept: 'Content Creation', desc: 'Educate small business owners on using ChatGPT and Meta AI ads to expand customer reach.' }
        ];
        localStorage.setItem('events', JSON.stringify(defaultEvents));
      }

      if (!localStorage.getItem('assignedTasks')) {
        localStorage.setItem('assignedTasks', JSON.stringify([]));
      }

      if (!localStorage.getItem('eventRegistrations')) {
        localStorage.setItem('eventRegistrations', JSON.stringify([]));
      }

      // Volunteer data syncs from localStorage (no payment server dependency)

      if (!localStorage.getItem('volunteers')) {
        localStorage.setItem('volunteers', JSON.stringify([]));
      }
      // Ensure volunteer_pass has entries for default volunteers
      if (!localStorage.getItem('volunteer_pass')) {
        localStorage.setItem('volunteer_pass', JSON.stringify([]));
      }
      // Restore session
      const savedUser = localStorage.getItem('currentUser');
      const savedEmail = localStorage.getItem('currentUserEmail');
      if (savedUser && savedEmail) {
        try {
          currentUser = JSON.parse(savedUser);
          w.currentUserEmail = savedEmail;
          const loginBtn = document.getElementById('login-btn');
          if (loginBtn) loginBtn.textContent = 'Logout';
          const loggedUserEl = document.getElementById('logged-user');
          if (loggedUserEl) {
            loggedUserEl.textContent = currentUser.name;
            loggedUserEl.style.display = 'inline';
          }
        } catch (e) {
          // corrupted session data, ignore
        }
      }

      // Re-trigger UI renders once sync data is in place
      w.renderVolunteerApplications();
      w.renderVolunteersAndLeaderboard();
    };

    w.renderEvents = () => {
      const events = getSafeArray('events');
      const registrations = getSafeArray('eventRegistrations');
      const volEmail = w.currentUserEmail || 'unknown@email.com';

      // 1. Render in Volunteer Portal Upcoming list (#vol-events-list)
      const volEventsList = document.getElementById('vol-events-list');
      if (volEventsList) {
        volEventsList.innerHTML = events.map((ev: any) => {
          if (!ev) return '';
          const isRegistered = registrations.some((r: any) => r && (r.event || '').toLowerCase() === (ev.title || '').toLowerCase() && (r.email || '').toLowerCase() === (volEmail || '').toLowerCase());
          const slotsLeft = Math.max(0, (ev.slots || 0) - (ev.registeredCount || 0));
          return `
            <div class="event-card">
              <div class="event-date-bar">
                <span>${ev.date || 'TBD'}</span>
                <span>${ev.location || 'TBD'}</span>
              </div>
              <div class="event-body">
                <div class="event-title">${ev.title || 'Untitled Event'}</div>
                <div class="event-dept">Department: <span>${ev.dept || 'All Departments'}</span></div>
                <div class="event-slots">${isRegistered ? 'Registered' : `${slotsLeft} slots remaining`}</div>
                <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.4rem;line-height:1.3;">${ev.desc || ''}</p>
                <button class="btn-register-event ${isRegistered ? 'registered' : ''}" style="margin-top:0.8rem;width:100%;" onclick="window.registerEvent(this)" ${isRegistered ? 'disabled' : ''}>
                  ${isRegistered ? 'Registered!' : 'Register for This Event'}
                </button>
              </div>
            </div>
          `;
        }).join('');
      }

      // 2. Render in Public Volunteer Page Upcoming Events!
      const publicEventsContainer = document.getElementById('public-events-list');
      if (publicEventsContainer) {
        publicEventsContainer.innerHTML = events.map((ev: any) => {
          if (!ev) return '';
          const slotsLeft = Math.max(0, (ev.slots || 0) - (ev.registeredCount || 0));
          return `
            <div class="vol-work-item" style="border: 1px solid var(--glass-border); background: var(--glass); padding: 1.2rem; border-radius: 16px; box-shadow: 0 4px 12px rgba(168,85,247,0.03);">
              <div class="vol-work-info">
                <span style="font-size:0.75rem;color:var(--primary);font-weight:700;letter-spacing:1px;text-transform:uppercase;">${ev.date || 'TBD'} — ${ev.location || 'TBD'}</span>
                <h4 style="margin-top:0.2rem;font-family:var(--font-display);color:var(--text);font-size:1.05rem;">${ev.title || 'Untitled Event'}</h4>
                <p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.3rem;">${ev.desc || ''}</p>
              </div>
              <span class="vol-work-badge" style="background:rgba(168,85,247,0.1);color:var(--primary);border-color:rgba(168,85,247,0.3);height:fit-content;padding:0.4rem 1rem;font-size:0.75rem;border-radius:99px;font-weight:700;">
                ${slotsLeft} Slots Left
              </span>
            </div>
          `;
        }).join('');
      }

      // 3. Render in Admin Portal Events Table
      const adminTableBody = document.getElementById('admin-events-table')?.querySelector('tbody');
      if (adminTableBody) {
        adminTableBody.innerHTML = events.map((ev: any) => {
          if (!ev) return '';
          return `
            <tr>
              <td>${ev.title || 'Untitled Event'}</td>
              <td>${ev.date || 'TBD'}</td>
              <td>${ev.location || 'TBD'}</td>
              <td>${ev.registeredCount || 0}/${ev.slots || 0}</td>
              <td><span class="badge badge-blue">Open</span></td>
              <td><button class="btn-small btn-danger-small" onclick="window.deleteEventRow(this)">Delete</button></td>
            </tr>
          `;
        }).join('');
      }
    };

    w.renderTasks = () => {
      const tasks = getSafeArray('assignedTasks');
      const volName = document.getElementById('portal-fullname')?.textContent || 'Volunteer';

      // 1. Render in Volunteer Portal's My Tasks
      const volTasksList = document.getElementById('vol-tasks-list');
      if (volTasksList) {
        const myTasks = tasks.filter((t: any) => t && (t.volName || '').toLowerCase() === (volName || '').toLowerCase());
        if (myTasks.length === 0) {
          volTasksList.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:2rem;font-size:0.85rem;">No tasks assigned to you yet. You're all caught up!</div>`;
        } else {
          volTasksList.innerHTML = myTasks.map((t: any) => {
            if (!t) return '';
            const isCompleted = t.status === 'Completed';
            return `
              <div class="task-card" style="opacity: ${isCompleted ? 0.6 : 1};">
                <div class="task-title">${t.title || 'Untitled Task'}</div>
                <div class="task-desc">${t.desc || ''}</div>
                <div class="task-footer">
                  <span class="task-due">Due: ${t.due || 'TBD'}</span>
                  <button class="btn-task-done" onclick="window.markTaskDone(this)" data-id="${t.id}" ${isCompleted ? 'disabled' : ''}>
                    ${isCompleted ? 'Done!' : 'Mark Done'}
                  </button>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 2. Render in Admin Portal's Assigned Tasks Tracker
      const adminTasksList = document.getElementById('assigned-tasks-list');
      if (adminTasksList) {
        adminTasksList.innerHTML = tasks.map((t: any) => {
          if (!t) return '';
          const isCompleted = t.status === 'Completed';
          return `
            <div class="task-card" style="border-left:4px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'};">
              <div class="task-title"><b>${t.volName || ''}</b> → ${t.title || 'Untitled Task'}</div>
              <div class="task-desc">${t.desc || ''}</div>
              <div class="task-footer">
                <span class="task-due">Due: ${t.due || 'TBD'}</span>
                <span class="badge ${isCompleted ? 'badge-green' : 'badge-orange'}">${t.status || 'Pending'}</span>
                ${!isCompleted ? '<button class="btn-task-done" onclick="window.markTaskDone(this)" data-id="' + (t.id || '') + '" style="margin-left:auto;padding:0.3rem 0.8rem;background:var(--secondary);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:600;">Mark Done</button>' : ''}
              </div>
            </div>
          `;
        }).join('');
      }
    };

    w.renderVolunteersAndLeaderboard = () => {
      const volunteers = getSafeArray('volunteers');
      const tasks = getSafeArray('assignedTasks');
      const registrations = getSafeArray('eventRegistrations');

      // Calculate dynamic hours
      const calculatedVols = volunteers.map((vol: any) => {
        if (!vol) return null;
        const completedTasksCount = tasks.filter((t: any) => t && (t.volName || '').toLowerCase() === (vol.name || '').toLowerCase() && t.status === 'Completed').length;
        const regEventsCount = registrations.filter((r: any) => r && (r.name || '').toLowerCase() === (vol.name || '').toLowerCase()).length;
        
        const baseHours = vol.hours || 10;
        const dynamicHours = baseHours + (completedTasksCount * 8) + (regEventsCount * 6);
        return { ...vol, hours: dynamicHours };
      }).filter(Boolean);

      // Sort for Leaderboard
      const rankedVols = [...calculatedVols].sort((a: any, b: any) => (b.hours || 0) - (a.hours || 0));

      // Populate admin dashboard metrics
      const events = getSafeArray('events');
      const totalVolsEl = document.getElementById('total-vols-count');
      const totalEventsEl = document.getElementById('total-events-count');
      const totalHoursEl = document.getElementById('total-hours-count');
      if (totalVolsEl) totalVolsEl.textContent = volunteers.length.toString();
      if (totalEventsEl) totalEventsEl.textContent = events.length.toString();
      if (totalHoursEl) {
        const totalH = calculatedVols.reduce((sum: number, v: any) => sum + (v.hours || 0), 0);
        totalHoursEl.textContent = totalH + '';
      }

      // Populate admin recent registrations
      const recentVolsBody = document.getElementById('admin-recent-vols');
      if (recentVolsBody) {
        const sortedByDate = [...volunteers].sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 5);
        recentVolsBody.innerHTML = sortedByDate.map((v: any) => `
          <tr>
            <td>${v.name || ''}</td>
            <td>${v.email || ''}</td>
            <td>${v.state || 'India'}</td>
            <td>AI Outreach</td>
            <td>${v.date || 'Today'}</td>
          </tr>
        `).join('');
      }

      // 1. Populate the Volunteer dropdown inside Admin Assign Task selector
      const selectVol = document.getElementById('assign-vol');
      if (selectVol) {
        if (volunteers.length === 0) {
          selectVol.innerHTML = '<option value="">No volunteers available</option>';
        } else {
          selectVol.innerHTML = volunteers.map((v: any) => {
            if (!v) return '';
            return `<option value="${v.name || ''}">${v.name || ''}</option>`;
          }).join('');
        }
      }

      // 2. Render all volunteers table in Admin Volunteers Tab
      const adminVolsTable = document.getElementById('admin-volunteers')?.querySelector('table tbody');
      if (adminVolsTable) {
        adminVolsTable.innerHTML = rankedVols.map((v: any) => `
          <tr>
            <td>${v.name || ''}</td>
            <td>${v.email || ''}</td>
            <td>${v.state || 'India'}</td>
            <td>AI Outreach</td>
            <td>${v.hours || 0} hrs</td>
            <td><span class="badge badge-green">Active</span></td>
          </tr>
        `).join('');
      }

      // 3. Render Leaderboard in Volunteer Portal (Leaderboard Tab)
      const leaderboardEl = document.getElementById('st-leaderboard')?.querySelector('.leaderboard');
      if (leaderboardEl) {
        const maxHours = rankedVols.length > 0 ? Math.max(...rankedVols.map((v: any) => v.hours || 0), 1) : 1;
        const medals = ['🥇', '🥈', '🥉'];
        leaderboardEl.innerHTML = `
          <div style="display:flex;align-items:flex-end;gap:0.8rem;padding:1.5rem 0;min-height:220px;justify-content:center;border-bottom:2px solid var(--glass-border);margin-bottom:1rem;">
            ${rankedVols.slice(0, 5).map((v: any, i: number) => {
              const pct = ((v.hours || 0) / maxHours) * 100;
              const colors = ['linear-gradient(180deg,#f59e0b,#d97706)', 'linear-gradient(180deg,#94a3b8,#64748b)', 'linear-gradient(180deg,#d97706,#92400e)', 'linear-gradient(180deg,var(--secondary),var(--warning))', 'linear-gradient(180deg,var(--accent),var(--primary))'];
              return `
                <div style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;flex:1;max-width:100px;">
                  <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);">${(v.hours || 0) * 20}XP</div>
                  <div style="width:100%;background:rgba(155,122,62,0.08);border-radius:8px 8px 0 0;position:relative;height:160px;display:flex;align-items:flex-end;">
                    <div style="width:100%;background:${colors[i]};border-radius:6px 6px 0 0;height:${Math.max(pct, 5)}%;transition:height 0.8s ease;box-shadow:0 2px 8px rgba(155,122,62,0.2);"></div>
                  </div>
                  <div style="font-size:0.75rem;font-weight:700;text-align:center;color:var(--primary);">${medals[i] || ''} ${v.name || ''}</div>
                  <div style="font-size:0.65rem;color:var(--text-muted);">${v.hours || 0} hrs</div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:0.4rem;">
            ${rankedVols.slice(0, 10).map((v: any, index: number) => {
              const pct = ((v.hours || 0) / maxHours) * 100;
              const isTop = index < 3;
              return `
                <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0.75rem;background:${isTop ? 'rgba(155,122,62,0.06)' : 'transparent'};border-radius:10px;">
                  <div style="font-size:1rem;width:28px;text-align:center;font-weight:700;color:${isTop ? 'var(--secondary)' : 'var(--text-muted)'};">${index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : (index + 1)))}</div>
                  <div style="flex:1;display:flex;flex-direction:column;gap:0.2rem;">
                    <div style="display:flex;justify-content:space-between;">
                      <span style="font-weight:600;font-size:0.85rem;">${v.name || ''}</span>
                      <span style="font-size:0.78rem;font-weight:600;color:var(--secondary);">${(v.hours || 0) * 20} XP</span>
                    </div>
                    <div style="width:100%;height:6px;background:rgba(155,122,62,0.1);border-radius:99px;overflow:hidden;">
                      <div style="height:100%;width:${Math.max(pct, 2)}%;background:${isTop ? 'linear-gradient(90deg,var(--secondary),var(--warning))' : 'rgba(155,122,62,0.3)'};border-radius:99px;transition:width 0.6s ease;"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      // 4. Render Leaderboard in Admin Portal (Leaderboard Tab)
      const adminLeaderboardEl = document.getElementById('admin-leaderboard')?.querySelector('.leaderboard');
      if (adminLeaderboardEl) {
        const maxHours = rankedVols.length > 0 ? Math.max(...rankedVols.map((v: any) => v.hours || 0), 1) : 1;
        const medals = ['🥇', '🥈', '🥉'];
        adminLeaderboardEl.innerHTML = `
          <div style="display:flex;align-items:flex-end;gap:1rem;padding:1.5rem 0;min-height:260px;justify-content:center;border-bottom:2px solid var(--glass-border);margin-bottom:1.5rem;">
            ${rankedVols.slice(0, 5).map((v: any, i: number) => {
              const pct = ((v.hours || 0) / maxHours) * 100;
              const colors = ['linear-gradient(180deg,#f59e0b,#d97706)', 'linear-gradient(180deg,#94a3b8,#64748b)', 'linear-gradient(180deg,#d97706,#92400e)', 'linear-gradient(180deg,var(--secondary),var(--warning))', 'linear-gradient(180deg,var(--accent),var(--primary))'];
              return `
                <div style="display:flex;flex-direction:column;align-items:center;gap:0.4rem;flex:1;max-width:120px;">
                  <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);">${(v.hours || 0) * 20}XP</div>
                  <div style="width:100%;background:rgba(155,122,62,0.06);border-radius:10px 10px 0 0;position:relative;height:200px;display:flex;align-items:flex-end;">
                    <div style="width:100%;background:${colors[i]};border-radius:8px 8px 0 0;height:${Math.max(pct, 5)}%;transition:height 0.8s ease;box-shadow:0 2px 12px rgba(155,122,62,0.25);"></div>
                  </div>
                  <div style="font-size:0.8rem;font-weight:700;text-align:center;color:var(--primary);">${medals[i] || ''} ${v.name || ''}</div>
                  <div style="font-size:0.7rem;color:var(--text-muted);">${v.hours || 0} hrs</div>
                </div>
              `;
            }).join('')}
          </div>
          <h4 style="font-size:0.9rem;color:var(--text-muted);margin-bottom:0.75rem;">All Participants</h4>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            ${rankedVols.slice(0, 15).map((v: any, index: number) => {
              const pct = ((v.hours || 0) / maxHours) * 100;
              const isTop = index < 3;
              return `
                <div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 1rem;background:${isTop ? 'linear-gradient(135deg,rgba(155,122,62,0.08),rgba(155,122,62,0.02))' : 'var(--glass)'};border:1px solid ${isTop ? 'rgba(155,122,62,0.2)' : 'var(--glass-border)'};border-radius:12px;">
                  <div style="font-size:1.2rem;width:32px;text-align:center;font-weight:700;color:${isTop ? 'var(--secondary)' : 'var(--text-muted)'};">${index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : (index + 1)))}</div>
                  <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
                      <div>
                        <span style="font-weight:700;font-size:0.88rem;">${v.name || ''}</span>
                        <span style="font-size:0.72rem;color:var(--text-muted);margin-left:0.5rem;">${v.email || ''}</span>
                      </div>
                      <span style="font-size:0.82rem;font-weight:700;color:var(--secondary);">${(v.hours || 0) * 20} XP</span>
                    </div>
                    <div style="width:100%;height:8px;background:rgba(155,122,62,0.08);border-radius:99px;overflow:hidden;">
                      <div style="height:100%;width:${Math.max(pct, 2)}%;background:${isTop ? 'linear-gradient(90deg,var(--secondary),var(--warning))' : 'rgba(155,122,62,0.25)'};border-radius:99px;transition:width 0.6s ease;"></div>
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem;">${v.hours || 0} hours logged | ${v.state || 'India'}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    };

    w.submitVolunteerApplication = async () => {
      const fname = (document.getElementById('vol-app-fname') as HTMLInputElement)?.value;
      const phone = (document.getElementById('vol-app-phone') as HTMLInputElement)?.value;
      const email = (document.getElementById('vol-app-email') as HTMLInputElement)?.value;
      const education = (document.getElementById('vol-app-education') as HTMLSelectElement)?.value;
      const why = (document.getElementById('vol-app-why') as HTMLTextAreaElement)?.value;
      if (!fname || !phone || !email || !education || !why) {
        w.showToast('Please fill in all required fields');
        return;
      }

      try {
        const res = await fetch('/api/volunteer-applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fname, phone, email, education, why })
        });
        const data = await res.json();
        if (!res.ok) {
          w.showToast(data.error || 'Failed to submit application');
          return;
        }

        const apps = getSafeArray('volunteer_applications');
        apps.push({ name: fname, phone, email, education, why, date: new Date().toLocaleDateString('en-IN') });
        localStorage.setItem('volunteer_applications', JSON.stringify(apps));
        w.closeSignUpModal();
        w.showToast('Application submitted! Admin will review and approve it shortly.');
        w.renderVolunteerApplications();
      } catch (err) {
        console.error('Submit application failed:', err);
        w.showToast('Server connection failed. Please try again.');
      }
    };

    // TeachXai form submission
    w.submitTeachXai = () => {
      const name = (document.getElementById('tx-name') as HTMLInputElement)?.value;
      const email = (document.getElementById('tx-email') as HTMLInputElement)?.value;
      const phone = (document.getElementById('tx-phone') as HTMLInputElement)?.value;
      const education = (document.getElementById('tx-education') as HTMLSelectElement)?.value;
      const institution = (document.getElementById('tx-institution') as HTMLInputElement)?.value || '';
      const experience = (document.getElementById('tx-experience') as HTMLSelectElement)?.value;
      const certifications = (document.getElementById('tx-certifications') as HTMLInputElement)?.value || '';
      const why = (document.getElementById('tx-why') as HTMLTextAreaElement)?.value;
      const availability = (document.getElementById('tx-availability') as HTMLSelectElement)?.value;
      const subjects = Array.from(document.querySelectorAll('#teachxai .dept-checkbox-grid:first-of-type input[type="checkbox"]:checked')).map((cb: any) => cb.value);
      const languages = Array.from(document.querySelectorAll('#teachxai .dept-checkbox-grid:last-of-type input[type="checkbox"]:checked')).map((cb: any) => cb.value);

      if (!name || !email || !phone || !education || !why || !availability || subjects.length === 0 || languages.length === 0) {
        w.showToast('Please fill in all required fields');
        return;
      }

      const educators = getSafeArray('teachxai_educators');
      educators.push({ name, email, phone, education, institution, experience, certifications, why, availability, subjects, languages, date: new Date().toLocaleDateString('en-IN') });
      localStorage.setItem('teachxai_educators', JSON.stringify(educators));

      // Reset form
      const form = document.querySelector('.teachxai-form') as HTMLFormElement;
      if (form) form.reset();

      w.showToast('Application submitted successfully! We will contact you soon.');
    };

    // ===== VOLUNTEER APPLICATION ADMIN FUNCTIONS =====
    w.renderVolunteerApplications = () => {
      const apps = getSafeArray('volunteer_applications');
      const volCreds = getSafeArray('volunteer_pass');
      const body = document.getElementById('admin-vol-apps-body');
      if (!body) return;
      if (apps.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem">No pending applications</td></tr>';
      } else {
        body.innerHTML = apps.map((a: any, i: number) => `
          <tr>
            <td>${a.name || ''}</td>
            <td>${a.email || ''}</td>
            <td>${a.phone || ''}</td>
            <td>${a.education || ''}</td>
            <td>
              <button class="btn-small btn-success-small" onclick="window.approveVolunteerApp(${i})">Approve</button>
              <button class="btn-small btn-danger-small" onclick="window.rejectVolunteerApp(${i})">Reject</button>
            </td>
          </tr>
        `).join('');
      }
      document.getElementById('admin-vol-apps-count')!.textContent = apps.length.toString();
    };

    w.approveVolunteerApp = async (index: number) => {
      const apps = getSafeArray('volunteer_applications');
      const volunteers = getSafeArray('volunteers');
      const volCreds = getSafeArray('volunteer_pass');
      if (index >= 0 && index < apps.length) {
        const app = apps[index];

        try {
          const res = await fetch('/api/approve-volunteer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: app.email })
          });
          const data = await res.json();
          if (!res.ok) {
            w.showToast(data.error || 'Approval failed');
            return;
          }

          const volEntry = { name: app.name, email: app.email, phone: app.phone, education: app.education, why: app.why, date: app.date, hours: 0, state: '', city: '', depts: [] };
          volunteers.push(volEntry);
          apps.splice(index, 1);
          localStorage.setItem('volunteers', JSON.stringify(volunteers));
          localStorage.setItem('volunteer_applications', JSON.stringify(apps));
          if (!volCreds.some((v: any) => v && v.email === app.email)) {
            volCreds.push({ email: app.email, password: 'volunteer123', name: app.name });
            localStorage.setItem('volunteer_pass', JSON.stringify(volCreds));
          }
          w.renderVolunteerApplications();
          w.renderVolunteersAndLeaderboard();
          w.showToast(`Approved! ${app.name} can login with email and password "volunteer123"`);
        } catch (err) {
          console.error('Approve failed:', err);
          w.showToast('Server connection failed. Please try again.');
        }
      }
    };

    w.rejectVolunteerApp = async (index: number) => {
      const apps = getSafeArray('volunteer_applications');
      if (index >= 0 && index < apps.length) {
        const app = apps[index];

        try {
          const res = await fetch('/api/reject-volunteer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: app.email })
          });
          const data = await res.json();
          if (!res.ok) {
            w.showToast(data.error || 'Rejection failed');
            return;
          }

          apps.splice(index, 1);
          localStorage.setItem('volunteer_applications', JSON.stringify(apps));
          w.renderVolunteerApplications();
          w.showToast('Application rejected');
        } catch (err) {
          console.error('Reject failed:', err);
          w.showToast('Server connection failed. Please try again.');
        }
      }
    };

    w.populateVolunteerProfile = () => {
      const email = w.currentUserEmail;
      const vols = getSafeArray('volunteers');
      const vol = vols.find((v: any) => v && v.email === email);
      const nameEl = document.getElementById('vol-profile-name') as HTMLInputElement;
      const emailEl = document.getElementById('vol-profile-email') as HTMLInputElement;
      const phoneEl = document.getElementById('vol-profile-phone') as HTMLInputElement;
      const eduEl = document.getElementById('vol-profile-education') as HTMLInputElement;
      const aboutEl = document.getElementById('vol-profile-about') as HTMLTextAreaElement;
      if (vol) {
        if (nameEl) nameEl.value = vol.name || '';
        if (emailEl) emailEl.value = vol.email || '';
        if (phoneEl) phoneEl.value = vol.phone || '';
        if (eduEl) eduEl.value = vol.education || '';
        if (aboutEl) aboutEl.value = vol.why || '';
      } else if (email) {
        if (emailEl) emailEl.value = email;
      }
      // Restore profile photo
      const savedPhoto = localStorage.getItem('vol_profile_photo_' + email);
      if (savedPhoto) {
        const img = document.getElementById('vol-profile-photo-img') as HTMLImageElement;
        const txt = document.getElementById('vol-profile-photo-text');
        if (img && txt) { img.src = savedPhoto; img.style.display = 'block'; txt.style.display = 'none'; }
      }
    };

    w.saveVolunteerProfile = () => {
      const name = (document.getElementById('vol-profile-name') as HTMLInputElement)?.value;
      const phone = (document.getElementById('vol-profile-phone') as HTMLInputElement)?.value;
      const education = (document.getElementById('vol-profile-education') as HTMLInputElement)?.value;
      const about = (document.getElementById('vol-profile-about') as HTMLTextAreaElement)?.value;
      if (!name) { w.showToast('Name is required'); return; }
      const email = w.currentUserEmail;
      const vols = getSafeArray('volunteers');
      const vol = vols.find((v: any) => v && v.email === email);
      if (vol) {
        vol.name = name;
        vol.phone = phone;
        vol.education = education;
        vol.why = about;
        localStorage.setItem('volunteers', JSON.stringify(vols));
        fetch('/api/update-volunteers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ volunteers: vols })
        }).catch(err => console.error('Failed to sync updated volunteers:', err));
      }
      // Update display
      const pName = document.getElementById('portal-name');
      const pFullName = document.getElementById('portal-fullname');
      const pAvatar = document.getElementById('portal-avatar');
      if (pName) pName.textContent = name;
      if (pFullName) pFullName.textContent = name;
      if (pAvatar) pAvatar.textContent = name[0].toUpperCase();
      w.showToast('Profile updated!');
    };

    w.saveTeacherProfile = () => {
      const name = (document.getElementById('tch-profile-name') as HTMLInputElement)?.value;
      const phone = (document.getElementById('tch-profile-phone') as HTMLInputElement)?.value;
      const education = (document.getElementById('tch-profile-education') as HTMLInputElement)?.value;
      const subjectsStr = (document.getElementById('tch-profile-subjects') as HTMLInputElement)?.value;
      const languagesStr = (document.getElementById('tch-profile-languages') as HTMLInputElement)?.value;
      if (!name) { w.showToast('Name is required'); return; }
      const email = w.currentUserEmail;
      const approved = getSafeArray('teachxai_approved');
      const teacher = approved.find((t: any) => t && t.email === email);
      if (teacher) {
        teacher.name = name;
        teacher.phone = phone;
        teacher.education = education;
        teacher.subjects = subjectsStr ? subjectsStr.split(',').map((s: string) => s.trim()) : [];
        teacher.languages = languagesStr ? languagesStr.split(',').map((l: string) => l.trim()) : [];
        localStorage.setItem('teachxai_approved', JSON.stringify(approved));
      }
      const tpName = document.getElementById('tportal-name');
      const tpFullName = document.getElementById('tportal-fullname');
      const tpAvatar = document.getElementById('tportal-avatar');
      if (tpName) tpName.textContent = name;
      if (tpFullName) tpFullName.textContent = name;
      if (tpAvatar) tpAvatar.textContent = name[0].toUpperCase();
      // Also update password entry name
      const creds = getSafeArray('teachxai_teachers_pass');
      const entry = creds.find((c: any) => c && c.email === email);
      if (entry) { entry.name = name; localStorage.setItem('teachxai_teachers_pass', JSON.stringify(creds)); }
      w.showToast('Profile updated!');
    };

    w.changeVolunteerPassword = () => {
      const currentPass = (document.getElementById('vol-current-pass') as HTMLInputElement)?.value;
      const newPass = (document.getElementById('vol-new-pass') as HTMLInputElement)?.value;
      if (!currentPass || !newPass) {
        w.showToast('Please fill in both password fields');
        return;
      }
      if (newPass.length < 6) {
        w.showToast('New password must be at least 6 characters');
        return;
      }
      const email = w.currentUserEmail;
      const creds = getSafeArray('volunteer_pass');
      const entry = creds.find((c: any) => c && c.email === email);
      if (!entry) {
        w.showToast('Account not found');
        return;
      }
      if (entry.password !== currentPass) {
        w.showToast('Current password is incorrect');
        return;
      }
      entry.password = newPass;
      localStorage.setItem('volunteer_pass', JSON.stringify(creds));
      fetch('/api/update-volunteer-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_pass: creds })
      }).catch(err => console.error('Failed to sync updated credentials:', err));
      (document.getElementById('vol-current-pass') as HTMLInputElement)!.value = '';
      (document.getElementById('vol-new-pass') as HTMLInputElement)!.value = '';
      w.showToast('Password updated successfully!');
    };

    w.changeTeacherPassword = () => {
      const currentPass = (document.getElementById('tch-current-pass') as HTMLInputElement)?.value;
      const newPass = (document.getElementById('tch-new-pass') as HTMLInputElement)?.value;
      if (!currentPass || !newPass) {
        w.showToast('Please fill in both password fields');
        return;
      }
      if (newPass.length < 6) {
        w.showToast('New password must be at least 6 characters');
        return;
      }
      const email = w.currentUserEmail;
      const creds = getSafeArray('teachxai_teachers_pass');
      const entry = creds.find((c: any) => c && c.email === email);
      if (!entry) {
        w.showToast('Account not found');
        return;
      }
      if (entry.password !== currentPass) {
        w.showToast('Current password is incorrect');
        return;
      }
      entry.password = newPass;
      localStorage.setItem('teachxai_teachers_pass', JSON.stringify(creds));
      (document.getElementById('tch-current-pass') as HTMLInputElement)!.value = '';
      (document.getElementById('tch-new-pass') as HTMLInputElement)!.value = '';
      w.showToast('Password updated successfully!');
    };

    // Portal navigations
    w.showPortalSection = (id: string, e: Event) => {
      document.querySelectorAll('#vol-portal .portal-section').forEach(s => s.classList.remove('active'));
      const sect = document.getElementById(id);
      if (sect) sect.classList.add('active');
      document.querySelectorAll('#vol-portal .portal-nav-btn').forEach(b => b.classList.remove('active'));
      if (e && e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('active');
      }
      if (id === 'st-quiz') w.buildStudentQuiz();
      if (id === 'vol-events' || id === 'vol-tasks' || id === 'st-leaderboard') {
        w.renderEvents();
        w.renderTasks();
        w.renderVolunteersAndLeaderboard();
      }
    };

    w.showAdminSection = (id: string, e: Event) => {
      document.querySelectorAll('#admin-portal .portal-section').forEach(s => s.classList.remove('active'));
      const sect = document.getElementById(id);
      if (sect) sect.classList.add('active');
      document.querySelectorAll('#admin-portal .portal-nav-btn').forEach(b => b.classList.remove('active'));
      if (e && e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('active');
      }
      if (id === 'admin-content') w.buildContentEditor();
      if (id === 'admin-analytics') w.buildAnalytics();
      if (id === 'admin-registrations') w.loadEventRegistrations();
      if (id === 'admin-attendance') w.loadAttendanceEvents();
      if (id === 'admin-vol-apps') w.renderVolunteerApplications();
      if (id === 'admin-teachxai') w.renderTeachXaiAdmin();
      if (id === 'admin-overview' || id === 'admin-events' || id === 'admin-volunteers' || id === 'admin-tasks' || id === 'admin-leaderboard') {
        w.renderEvents();
        w.renderTasks();
        w.renderVolunteersAndLeaderboard();
      }
    };

    w.renderTeachXaiAdmin = () => {
      const educators = getSafeArray('teachxai_educators');
      const approved = getSafeArray('teachxai_approved');
      const lessons = getSafeArray('teachxai_lessons');

      document.getElementById('tx-pending-count')!.textContent = educators.length.toString();
      document.getElementById('tx-approved-count')!.textContent = approved.length.toString();
      document.getElementById('tx-lessons-count')!.textContent = lessons.length.toString();

      // Pending table
      const pendingBody = document.getElementById('tx-pending-table');
      if (pendingBody) {
        if (educators.length === 0) {
          pendingBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">No pending applications</td></tr>';
        } else {
          pendingBody.innerHTML = educators.map((e: any, i: number) => `
            <tr>
              <td>${e.name || ''}</td>
              <td>${e.email || ''}</td>
              <td>${e.phone || ''}</td>
              <td>${e.education || ''}</td>
              <td>${(e.subjects || []).join(', ')}</td>
              <td>${e.experience || '0'}</td>
              <td>
                <button class="btn-small btn-success-small" onclick="window.approveTxEducator(${i})">Approve</button>
                <button class="btn-small btn-danger-small" onclick="window.rejectTxEducator(${i})">Reject</button>
              </td>
            </tr>
          `).join('');
        }
      }

      // Approved table
      const approvedBody = document.getElementById('tx-approved-table');
      if (approvedBody) {
        if (approved.length === 0) {
          approvedBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem">No approved educators</td></tr>';
        } else {
          approvedBody.innerHTML = approved.map((a: any, i: number) => {
            const taughtCount = lessons.filter((l: any) => l.educator === a.name).length;
            return `
              <tr>
                <td>${a.name || ''}</td>
                <td>${a.email || ''}</td>
                <td>${(a.subjects || []).join(', ')}</td>
                <td>${(a.languages || []).join(', ')}</td>
                <td>${taughtCount}</td>
                <td><button class="btn-small btn-danger-small" onclick="window.removeTxEducator(${i})">Remove</button></td>
              </tr>
            `;
          }).join('');
        }
      }

      // Lessons table
      const lessonsBody = document.getElementById('tx-lessons-table');
      if (lessonsBody) {
        if (lessons.length === 0) {
          lessonsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem">No lessons recorded</td></tr>';
        } else {
          lessonsBody.innerHTML = lessons.map((l: any) => `
            <tr>
              <td>${l.educator || ''}</td>
              <td>${l.title || ''}</td>
              <td>${l.subject || ''}</td>
              <td>${l.date || ''}</td>
              <td><span class="badge badge-green">Completed</span></td>
            </tr>
          `).join('');
        }
      }

      // Fill educator dropdown for lesson assignment
      const eduSelect = document.getElementById('tx-lesson-educator') as HTMLSelectElement;
      if (eduSelect) {
        eduSelect.innerHTML = '<option value="">-- Select --</option>' + approved.map((a: any) => `<option value="${a.name}">${a.name}</option>`).join('');
      }
      // Fill educator dropdown for attendance
      const attEduSelect = document.getElementById('tx-att-educator') as HTMLSelectElement;
      if (attEduSelect) {
        attEduSelect.innerHTML = '<option value="">-- Select --</option>' + approved.map((a: any) => `<option value="${a.name}">${a.name}</option>`).join('');
      }
    };

    w.showTxTab = (tab: string, e: Event) => {
      ['pending', 'approved', 'lessons', 'attendance', 'stats'].forEach(t => {
        const el = document.getElementById(`tx-${t}-panel`);
        if (el) el.style.display = t === tab ? 'block' : 'none';
      });
      if (tab === 'attendance') {
        const approved = getSafeArray('teachxai_approved');
        const attSelect = document.getElementById('tx-att-educator') as HTMLSelectElement;
        if (attSelect) {
          attSelect.innerHTML = '<option value="">-- Select --</option>' + approved.map((a: any) => `<option value="${a.name}">${a.name}</option>`).join('');
        }
        const att = getSafeArray('teachxai_attendance');
        const attBody = document.getElementById('tx-attendance-table');
        if (attBody) {
          if (att.length === 0) {
            attBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem">No attendance records</td></tr>';
          } else {
            attBody.innerHTML = att.map((a: any) => `
              <tr><td>${a.educator || ''}</td><td>${a.date || ''}</td><td><span class="badge ${a.status === 'Present' ? 'badge-green' : a.status === 'Absent' ? 'badge-red' : 'badge-blue'}">${a.status || ''}</span></td></tr>
            `).join('');
          }
        }
      }
      if (tab === 'stats') {
        w.renderTxStats();
      }
    };

    w.approveTxEducator = (index: number) => {
      const educators = getSafeArray('teachxai_educators');
      const approved = getSafeArray('teachxai_approved');
      if (index >= 0 && index < educators.length) {
        const educator = educators[index];
        approved.push(educator);
        educators.splice(index, 1);
        localStorage.setItem('teachxai_educators', JSON.stringify(educators));
        localStorage.setItem('teachxai_approved', JSON.stringify(approved));
        // Auto-create teacher login credentials with default password
        const teacherCreds = getSafeArray('teachxai_teachers_pass');
        if (!teacherCreds.some((t: any) => t && t.email === educator.email)) {
          teacherCreds.push({ email: educator.email, password: 'teacher123', name: educator.name });
          localStorage.setItem('teachxai_teachers_pass', JSON.stringify(teacherCreds));
          w.showToast(`Approved! ${educator.name} can login with password "teacher123"`);
        } else {
          w.showToast('Educator approved successfully!');
        }
        w.renderTeachXaiAdmin();
      }
    };

    w.rejectTxEducator = (index: number) => {
      const educators = getSafeArray('teachxai_educators');
      if (index >= 0 && index < educators.length) {
        educators.splice(index, 1);
        localStorage.setItem('teachxai_educators', JSON.stringify(educators));
        w.renderTeachXaiAdmin();
      }
    };

    w.removeTxEducator = (index: number) => {
      const approved = getSafeArray('teachxai_approved');
      if (index >= 0 && index < approved.length) {
        const removed = approved[index];
        approved.splice(index, 1);
        localStorage.setItem('teachxai_approved', JSON.stringify(approved));
        // Also remove their login credentials
        const creds = getSafeArray('teachxai_teachers_pass');
        const filtered = creds.filter((c: any) => c && c.email !== removed.email);
        localStorage.setItem('teachxai_teachers_pass', JSON.stringify(filtered));
        w.renderTeachXaiAdmin();
      }
    };

    w.markTxAttendance = () => {
      const educator = (document.getElementById('tx-att-educator') as HTMLSelectElement)?.value;
      const date = (document.getElementById('tx-att-date') as HTMLInputElement)?.value;
      const status = (document.getElementById('tx-att-status') as HTMLSelectElement)?.value;
      if (!educator || !date) {
        w.showToast('Please select educator and date');
        return;
      }
      const attendance = getSafeArray('teachxai_attendance');
      attendance.push({ educator, date, status });
      localStorage.setItem('teachxai_attendance', JSON.stringify(attendance));
      (document.getElementById('tx-att-date') as HTMLInputElement)!.value = '';
      // Refresh the attendance tab if active
      const attPanel = document.getElementById('tx-attendance-panel');
      if (attPanel && attPanel.style.display !== 'none') {
        const attBody = document.getElementById('tx-attendance-table');
        if (attBody) {
          const allAtt = getSafeArray('teachxai_attendance');
          attBody.innerHTML = allAtt.map((a: any) => `
            <tr><td>${a.educator || ''}</td><td>${a.date || ''}</td><td><span class="badge ${a.status === 'Present' ? 'badge-green' : a.status === 'Absent' ? 'badge-red' : 'badge-blue'}">${a.status || ''}</span></td></tr>
          `).join('');
        }
      }
      w.renderTeachXaiAdmin();
      w.showToast('Attendance marked!');
    };

    w.renderTxStats = () => {
      const approved = getSafeArray('teachxai_approved');
      const lessons = getSafeArray('teachxai_lessons');
      const attendance = getSafeArray('teachxai_attendance');
      document.getElementById('tx-stats-total')!.textContent = approved.length.toString();
      const activeTeachers = approved.filter((a: any) => lessons.some((l: any) => l.educator === a.name)).length;
      document.getElementById('tx-stats-active')!.textContent = activeTeachers.toString();
      const totalAtt = attendance.length;
      const presentAtt = attendance.filter((a: any) => a.status === 'Present').length;
      document.getElementById('tx-stats-att-rate')!.textContent = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) + '%' : '0%';
      document.getElementById('tx-stats-total-lessons')!.textContent = lessons.length.toString();
      const statsBody = document.getElementById('tx-stats-table');
      if (statsBody) {
        if (approved.length === 0) {
          statsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem">No teachers</td></tr>';
        } else {
          statsBody.innerHTML = approved.map((a: any) => {
            const tLessons = lessons.filter((l: any) => l.educator === a.name).length;
            const tAtt = attendance.filter((at: any) => at.educator === a.name);
            const tPresent = tAtt.filter((at: any) => at.status === 'Present').length;
            const tAbsent = tAtt.filter((at: any) => at.status === 'Absent').length;
            const tPct = tAtt.length > 0 ? Math.round((tPresent / tAtt.length) * 100) : 0;
            return `
              <tr>
                <td>${a.name || ''}</td>
                <td>${a.email || ''}</td>
                <td>${tLessons}</td>
                <td>${tPresent}</td>
                <td>${tAbsent}</td>
                <td>${tPct}%</td>
              </tr>
            `;
          }).join('');
        }
      }
    };

    w.assignTxLesson = () => {
      const educator = (document.getElementById('tx-lesson-educator') as HTMLSelectElement)?.value;
      const title = (document.getElementById('tx-lesson-title') as HTMLInputElement)?.value;
      const subject = (document.getElementById('tx-lesson-subject') as HTMLInputElement)?.value;
      const date = (document.getElementById('tx-lesson-date') as HTMLInputElement)?.value;
      if (!educator || !title || !subject) {
        w.showToast('Please fill in educator, lesson title, and subject');
        return;
      }
      const lessons = getSafeArray('teachxai_lessons');
      lessons.push({ educator, title, subject, date: date || new Date().toLocaleDateString('en-IN') });
      localStorage.setItem('teachxai_lessons', JSON.stringify(lessons));
      (document.getElementById('tx-lesson-title') as HTMLInputElement)!.value = '';
      (document.getElementById('tx-lesson-subject') as HTMLInputElement)!.value = '';
      (document.getElementById('tx-lesson-date') as HTMLInputElement)!.value = '';
      w.renderTeachXaiAdmin();
      w.showToast('Lesson assigned successfully!');
    };

    // ===== TEACHER PORTAL =====
    w.showTportalSection = (id: string, e: Event) => {
      document.querySelectorAll('#teacher-portal .portal-section').forEach(s => s.classList.remove('active'));
      const sect = document.getElementById(id);
      if (sect) sect.classList.add('active');
      document.querySelectorAll('#teacher-portal .portal-nav-btn').forEach(b => b.classList.remove('active'));
      if (e && e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('active');
      }
    };

    w.renderTeacherPortal = () => {
      const email = w.currentUserEmail || '';
      const approved = getSafeArray('teachxai_approved');
      const teacher = approved.find((a: any) => a && a.email === email);
      const lessons = getSafeArray('teachxai_lessons');
      const attendance = getSafeArray('teachxai_attendance');
      const teacherLessons = lessons.filter((l: any) => l.educator === (teacher?.name || ''));
      const teacherAttendance = attendance.filter((a: any) => a.educator === (teacher?.name || ''));

      const totalHours = teacherLessons.length * 2; // assume 2 hrs per lesson
      const upcomingCount = teacherLessons.filter((l: any) => l.date && new Date(l.date) > new Date()).length;
      const assignedCount = teacherLessons.length;
      const presentCount = teacherAttendance.filter((a: any) => a.status === 'Present').length;
      const attPct = teacherAttendance.length > 0 ? Math.round((presentCount / teacherAttendance.length) * 100) : 0;

      document.getElementById('tportal-hours')!.textContent = totalHours.toString();
      document.getElementById('tportal-upcoming')!.textContent = upcomingCount.toString();
      document.getElementById('tportal-assigned')!.textContent = assignedCount.toString();
      document.getElementById('tportal-att-pct')!.textContent = attPct + '%';

      // Recent activity
      const activityEl = document.getElementById('tportal-recent-activity');
      if (activityEl) {
        if (teacherLessons.length === 0) {
          activityEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">No recent activity yet.</p>';
        } else {
          activityEl.innerHTML = teacherLessons.slice(-3).reverse().map((l: any) => `
            <div class="task-card"><div class="task-title">${l.title || 'Lesson'}</div><div class="task-desc">${l.subject || ''} — ${l.date || ''}</div><div class="task-footer"><span class="badge badge-green">Completed</span></div></div>
          `).join('');
        }
      }

      // Classes list
      const classesEl = document.getElementById('tportal-classes-list');
      if (classesEl) {
        if (teacherLessons.length === 0) {
          classesEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">No classes yet.</p>';
        } else {
          classesEl.innerHTML = teacherLessons.map((l: any) => `
            <div class="task-card"><div class="task-title">${l.title || 'Lesson'}</div><div class="task-desc">Subject: ${l.subject || ''} | Date: ${l.date || ''}</div><div class="task-footer"><span class="badge badge-green">Completed</span></div></div>
          `).join('');
        }
      }

      // Assigned lessons
      const tasksEl = document.getElementById('tportal-tasks-list');
      if (tasksEl) {
        if (teacherLessons.length === 0) {
          tasksEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">No assignments yet.</p>';
        } else {
          tasksEl.innerHTML = teacherLessons.map((l: any) => `
            <div class="task-card"><div class="task-title">${l.title || 'Lesson'}</div><div class="task-desc">${l.subject || ''} — Due: ${l.date || 'N/A'}</div><div class="task-footer"><span class="badge badge-green">Assigned</span></div></div>
          `).join('');
        }
      }

      // Attendance records
      const attEl = document.getElementById('tportal-attendance-list');
      if (attEl) {
        if (teacherAttendance.length === 0) {
          attEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">No attendance records yet.</p>';
        } else {
          attEl.innerHTML = `<table class="data-table"><thead><tr><th>Date</th><th>Status</th></tr></thead><tbody>${teacherAttendance.map((a: any) => `
            <tr><td>${a.date || ''}</td><td><span class="badge ${a.status === 'Present' ? 'badge-green' : 'badge-red'}">${a.status || ''}</span></td></tr>
          `).join('')}</tbody></table>`;
        }
      }

      // Suggested courses based on subjects
      const coursesEl = document.getElementById('tportal-courses-list');
      if (coursesEl) {
        const subjects = teacher?.subjects || [];
        if (subjects.length === 0) {
          coursesEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">Courses will be suggested based on your registered subjects.</p>';
        } else {
          const courseMap: Record<string, string[]> = {
            'Machine Learning': ['ML Fundamentals', 'Supervised Learning', 'Neural Networks'],
            'Deep Learning': ['Intro to Deep Learning', 'CNNs', 'RNNs'],
            'Data Science': ['Data Analysis with Python', 'Statistics', 'Data Visualization'],
            'Python': ['Python Basics', 'Advanced Python', 'Python for AI'],
            'AI Ethics': ['Ethics in AI', 'Bias & Fairness', 'Responsible AI'],
            'Robotics': ['Intro to Robotics', 'ROS Basics', 'Robot Programming'],
            'IoT': ['IoT Fundamentals', 'Sensor Networks', 'Edge Computing'],
            'Computer Vision': ['Image Processing', 'Object Detection', 'OpenCV'],
            'NLP': ['Text Processing', 'Transformers', 'LLMs'],
          };
          let suggested: string[] = [];
          subjects.forEach((s: string) => {
            if (courseMap[s]) suggested = suggested.concat(courseMap[s]);
          });
          if (suggested.length === 0) suggested = ['AI Fundamentals', 'Introduction to Programming', 'Data Literacy'];
          coursesEl.innerHTML = suggested.map((c: string) => `
            <div class="task-card"><div class="task-title">${c}</div><div class="task-footer"><span class="badge badge-green">Recommended</span></div></div>
          `).join('');
        }
      }
      // Populate teacher profile fields
      const tNameEl = document.getElementById('tch-profile-name') as HTMLInputElement;
      const tEmailEl = document.getElementById('tch-profile-email') as HTMLInputElement;
      const tPhoneEl = document.getElementById('tch-profile-phone') as HTMLInputElement;
      const tEduEl = document.getElementById('tch-profile-education') as HTMLInputElement;
      const tSubjEl = document.getElementById('tch-profile-subjects') as HTMLInputElement;
      const tLangEl = document.getElementById('tch-profile-languages') as HTMLInputElement;
      if (teacher) {
        if (tNameEl) tNameEl.value = teacher.name || '';
        if (tEmailEl) tEmailEl.value = teacher.email || '';
        if (tPhoneEl) tPhoneEl.value = teacher.phone || '';
        if (tEduEl) tEduEl.value = teacher.education || '';
        if (tSubjEl) tSubjEl.value = (teacher.subjects || []).join(', ');
        if (tLangEl) tLangEl.value = (teacher.languages || []).join(', ');
      } else if (email) {
        if (tEmailEl) tEmailEl.value = email;
      }
      // Restore teacher profile photo
      const savedPhoto = localStorage.getItem('tch_profile_photo_' + email);
      if (savedPhoto) {
        const img = document.getElementById('tch-profile-photo-img') as HTMLImageElement;
        const txt = document.getElementById('tch-profile-photo-text');
        if (img && txt) { img.src = savedPhoto; img.style.display = 'block'; txt.style.display = 'none'; }
      }
    };

    w.toggleDept = (el: HTMLElement) => {
      el.classList.toggle('selected');
    };

    w.registerEvent = (btn: HTMLElement) => {
      const card = btn.closest('.event-card, .h-event-card');
      const titleEl = card?.querySelector('.event-title');
      const eventName = titleEl?.textContent || 'Unknown Event';

      const volEmail = w.currentUserEmail || 'unknown@email.com';
      const volName = document.getElementById('portal-fullname')?.textContent || 'Volunteer';

      const registrations = getSafeArray('eventRegistrations');
      const alreadyRegistered = registrations.some((r: any) => r && (r.event || '').toLowerCase() === (eventName || '').toLowerCase() && (r.email || '').toLowerCase() === (volEmail || '').toLowerCase());
      
      if (alreadyRegistered) {
        w.showToast('You are already registered for this event!');
        return;
      }

      registrations.push({
        id: 'r_' + Date.now(),
        event: eventName,
        name: volName,
        email: volEmail,
        date: new Date().toLocaleDateString('en-IN')
      });
      localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

      // Update registered slots dynamically in localStorage
      const events = getSafeArray('events');
      const eventIndex = events.findIndex((ev: any) => ev && (ev.title || '').toLowerCase() === (eventName || '').toLowerCase());
      if (eventIndex !== -1) {
        events[eventIndex].registeredCount = (events[eventIndex].registeredCount || 0) + 1;
        localStorage.setItem('events', JSON.stringify(events));
      }

      // Synchronize layouts
      w.renderEvents();
      w.renderVolunteersAndLeaderboard();
      w.loadEventRegistrations();
      w.showToast('You are registered for this event!');
    };

    w.loadEventRegistrations = () => {
      const tbody = document.getElementById('admin-registrations-body');
      if (!tbody) return;
      const registrations = getSafeArray('eventRegistrations');
      if (registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:2rem">No registrations yet.</td></tr>';
        return;
      }
      tbody.innerHTML = registrations.map((r: any) => {
        if (!r) return '';
        return `<tr><td>${r.name || ''}</td><td>${r.email || ''}</td><td>${r.event || ''}</td><td>${r.date || ''}</td></tr>`;
      }).join('');
    };

    w.markTaskDone = (btn: HTMLButtonElement) => {
      const taskId = btn.getAttribute('data-id');
      if (!taskId) return;

      const tasks = getSafeArray('assignedTasks');
      const taskIndex = tasks.findIndex((t: any) => t && t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].status = 'Completed';
        localStorage.setItem('assignedTasks', JSON.stringify(tasks));
      }

      // Synchronize layouts
      w.renderTasks();
      w.renderVolunteersAndLeaderboard();
      w.showToast('Task marked as complete!');
    };

    w.toggleAttend = (btn: HTMLElement) => {
      if (btn.classList.contains('attend-present')) {
        btn.classList.remove('attend-present');
        btn.classList.add('attend-absent');
        btn.textContent = 'Absent';
      } else {
        btn.classList.remove('attend-absent');
        btn.classList.add('attend-present');
        btn.textContent = 'Present';
      }
    };

    w.loadAttendanceEvents = () => {
      const events = getSafeArray('events');
      const select = document.getElementById('attendance-event-select') as HTMLSelectElement;
      if (!select) return;
      select.innerHTML = '<option value="">-- Select an event --</option>' +
        events.map((ev: any) => `<option value="${ev.id || ''}">${ev.title || ''} — ${ev.date || ''}</option>`).join('');
      select.onchange = () => {
        const eventId = select.value;
        if (!eventId) {
          const tbody = document.getElementById('attendance-table-body');
          if (tbody) tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem">Select an event to view volunteers</td></tr>';
          return;
        }
        const registrations = getSafeArray('eventRegistrations');
        const selectedEvent = events.find((ev: any) => ev.id === eventId);
        const registered = registrations.filter((r: any) => selectedEvent && r.event === selectedEvent.title);
        const tbody = document.getElementById('attendance-table-body');
        if (!tbody) return;
        if (registered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem">No volunteers registered for this event.</td></tr>';
          return;
        }
        tbody.innerHTML = registered.map((r: any) => `
          <tr>
            <td>${r.name || ''}</td>
            <td>${selectedEvent?.title || ''}</td>
            <td><button class="attend-btn attend-present" onclick="window.toggleAttend(this)">Present</button></td>
          </tr>
        `).join('');
      };
    };

    w.saveAttendance = () => {
      w.showToast('Attendance saved successfully!');
    };

    w.createEvent = () => {
      const title = (document.getElementById('ev-title') as HTMLInputElement)?.value;
      const date = (document.getElementById('ev-date') as HTMLInputElement)?.value;
      const location = (document.getElementById('ev-location') as HTMLInputElement)?.value;
      const slots = (document.getElementById('ev-slots') as HTMLInputElement)?.value;
      const desc = (document.getElementById('ev-desc') as HTMLTextAreaElement)?.value;
      
      if (!title) {
        w.showToast('Please enter event title');
        return;
      }

      const events = JSON.parse(localStorage.getItem('events') || '[]');
      events.push({
        id: 'ev_' + Date.now(),
        title,
        date: date || 'TBD',
        location: location || 'TBD',
        slots: Number(slots) || 50,
        registeredCount: 0,
        dept: 'AI Training & Education',
        desc: desc || 'Join our outreach program and help make AI accessible to everyone.'
      });
      localStorage.setItem('events', JSON.stringify(events));

      // Synchronize layouts
      w.renderEvents();
      w.showToast(`Event "${title}" created!`);

      // Clear inputs
      const tInput = document.getElementById('ev-title') as HTMLInputElement;
      const dInput = document.getElementById('ev-date') as HTMLInputElement;
      const lInput = document.getElementById('ev-location') as HTMLInputElement;
      const sInput = document.getElementById('ev-slots') as HTMLInputElement;
      const deInput = document.getElementById('ev-desc') as HTMLTextAreaElement;
      if (tInput) tInput.value = '';
      if (dInput) dInput.value = '';
      if (lInput) lInput.value = '';
      if (sInput) sInput.value = '';
      if (deInput) deInput.value = '';
    };

    w.deleteEventRow = (btn: HTMLElement) => {
      const tr = btn.closest('tr');
      const eventTitle = tr?.querySelectorAll('td')?.[0]?.textContent;
      if (!eventTitle) return;

      const events = getSafeArray('events');
      const filteredEvents = events.filter((ev: any) => ev && (ev.title || '').toLowerCase() !== (eventTitle || '').toLowerCase());
      localStorage.setItem('events', JSON.stringify(filteredEvents));

      // Synchronize layouts
      w.renderEvents();
      w.showToast('Event deleted.');
    };

    w.assignTask = () => {
      const vol = (document.getElementById('assign-vol') as HTMLSelectElement)?.value;
      const title = (document.getElementById('task-title') as HTMLInputElement)?.value;
      const desc = (document.getElementById('task-desc') as HTMLTextAreaElement)?.value;
      const due = (document.getElementById('task-due') as HTMLInputElement)?.value;
      if (!title || !vol) {
        w.showToast('Enter task title and select volunteer');
        return;
      }

      const tasks = getSafeArray('assignedTasks');
      tasks.push({
        id: 't_' + Date.now(),
        volName: vol,
        title,
        desc: desc || '',
        due: due || 'TBD',
        status: 'Pending'
      });
      localStorage.setItem('assignedTasks', JSON.stringify(tasks));

      // Synchronize layouts
      w.renderTasks();
      w.renderVolunteersAndLeaderboard();

      // Clear inputs
      const tInput = document.getElementById('task-title') as HTMLInputElement;
      const dInput = document.getElementById('task-desc') as HTMLTextAreaElement;
      const duInput = document.getElementById('task-due') as HTMLInputElement;
      if (tInput) tInput.value = '';
      if (dInput) dInput.value = '';
      if (duInput) duInput.value = '';
      w.showToast(`Task assigned to ${vol}!`);
    };

    w.makeDonation = () => {
      const amount = (document.getElementById('donation-amount') as HTMLInputElement)?.value;
      const fund = (document.getElementById('donation-fund') as HTMLSelectElement)?.value;
      if (!amount || Number(amount) < 1) {
        w.showToast('Please enter a valid amount');
        return;
      }
      const history = document.querySelector('.donation-history');
      if (history) {
        const item = document.createElement('div');
        item.className = 'donation-item';
        const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        item.innerHTML = `<div><div style="font-weight:700;font-size:0.9rem;">${fund}</div><div style="font-size:0.78rem;color:var(--text-muted);">${today}</div></div><div class="donation-amount">₹${amount}</div>`;
        history.prepend(item);
      }
      const amountInput = document.getElementById('donation-amount') as HTMLInputElement;
      if (amountInput) amountInput.value = '';
      w.showToast(`Thank you for donating ₹${amount}!`);
    };

    // AI4ALL Builder — image cards that navigate to topic detail page
    w.buildAI4All = () => {
      const container = document.getElementById('ai-categories-container');
      if (!container) return;
      container.innerHTML = '';
      aiCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'ai-card ai-card-link';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.onclick = () => w.showAITopicPage(cat.id);
        const comingSoonOverlay = cat.comingSoon
          ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,18,31,0.7);display:flex;align-items:center;justify-content:center;z-index:5;backdrop-filter:blur(2px)">
               <div style="text-align:center">
                 <div style="font-size:2rem;margin-bottom:0.5rem">🔒</div>
                 <div style="background:linear-gradient(135deg,#C5A059,#D4AF37);color:#0A121F;font-weight:800;font-size:0.85rem;padding:0.5rem 1.5rem;border-radius:99px;letter-spacing:0.5px">COMING SOON</div>
               </div>
             </div>`
          : `<div style="position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#C5A059,#D4AF37);color:#0A121F;font-weight:700;font-size:0.7rem;padding:0.3rem 0.8rem;border-radius:99px;z-index:5;letter-spacing:0.5px">ENROLL NOW</div>`;
        card.innerHTML = `
          ${comingSoonOverlay}
          <div class="ai-card-img" style="background-image:url('${cat.image}')"></div>
          <div class="ai-card-body">
            <div class="ai-card-title">${cat.label}</div>
            <div class="ai-card-brief">${cat.brief}</div>
          </div>`;
        container.appendChild(card);
      });
    };

    // Topic detail page navigation
    w.showAITopicPage = (id: string) => {
      const cat = aiCategories.find((c: any) => c.id === id);
      if (!cat) return;
      // Coming Soon courses show toast and don't navigate
      if (cat.comingSoon) {
        w.showToast?.(`${cat.label} course is coming soon! Stay tuned.`);
        return;
      }
      // HR course redirects to the corporate-course page
      if (id === 'hr') {
        w.showPage('corporate-course');
        const isVerified = localStorage.getItem('corp_otp_verified') === 'true';
        if (!isVerified) {
          setCorpShowRegModal(true);
        }
        return;
      }
      // Default topic detail page for other courses (future use)
      const titleEl = document.getElementById('topic-category-name');
      if (titleEl) titleEl.textContent = cat.label;
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const topicPage = document.getElementById('ai-topic-detail');
      if (topicPage) topicPage.classList.add('active');
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      document.getElementById('main-footer')?.style.setProperty('display', 'block');
      window.scrollTo(0, 0);
      w.buildAITopicContent(id);
    };

    w.backToAI4All = () => {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const aiPage = document.getElementById('ai4all');
      if (aiPage) aiPage.classList.add('active');
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const navEls = document.querySelectorAll('nav a');
      if (navEls[2]) navEls[2].classList.add('active');
      document.getElementById('main-footer')?.style.setProperty('display', 'block');
      window.scrollTo(0, 0);
    };

    w.buildAITopicContent = (id: string) => {
      const cat = aiCategories.find(c => c.id === id);
      const container = document.getElementById('ai-topic-content');
      if (!cat || !container) return;
      container.innerHTML = '';
      cat.topics.forEach((topic, idx) => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic-card';
        topicDiv.innerHTML = `
          <div class="topic-title">${topic.title}</div>
          <div class="topic-desc">${topic.desc}</div>
          <div class="ai-video-wrap">
            <iframe src="https://www.youtube.com/embed/${topic.ytId}" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="topic-quiz-section">
            <button class="btn-quiz" onclick="window.openTopicQuiz('${cat.id}',${idx})">Take Quiz</button>
            <div class="quiz-content" id="tq-${cat.id}-${idx}" style="display:none"></div>
          </div>`;
        container.appendChild(topicDiv);
      });
    };

    w.openTopicQuiz = (catId: string, idx: number) => {
      const cat = aiCategories.find(c => c.id === catId);
      const content = document.getElementById(`tq-${catId}-${idx}`);
      const btn = content?.closest('.topic-quiz-section')?.querySelector('.btn-quiz') as HTMLElement;
      if (!content || !cat || !cat.topics[idx]) return;
      const topic = cat.topics[idx];
      content.innerHTML = topic.quiz.map((q, qi) => `
        <div class="quiz-q">Q${qi+1}. ${q.q}</div>
        <div class="quiz-options">
          ${q.opts.map((o, oi) => `<button class="quiz-opt" onclick="window.answerTopicQuiz(this,${qi},${oi},${q.ans})">${o}</button>`).join('')}
        </div>
      `).join('');
      content.style.display = 'block';
      if (btn) btn.style.display = 'none';
    };

    w.answerTopicQuiz = (btn: HTMLButtonElement, qIdx: number, chosen: number, correct: number) => {
      const parentQ = btn.closest('.quiz-options');
      if (!parentQ) return;
      const opts = parentQ.querySelectorAll('.quiz-opt');
      opts.forEach(o => ((o as HTMLButtonElement).disabled = true));
      opts[correct]?.classList.add('correct');
      if (chosen !== correct) btn.classList.add('wrong');
      const feedback = document.createElement('div');
      feedback.style.cssText = 'margin-top:0.8rem;font-size:0.85rem;font-weight:600;';
      feedback.textContent = chosen === correct ? 'Correct!' : 'Incorrect. The right answer is: ' + (opts[correct]?.textContent || '');
      feedback.style.color = chosen === correct ? 'var(--success)' : 'var(--secondary)';
      if (!parentQ.querySelector('.quiz-feedback')) {
        parentQ.appendChild(feedback);
      }
    };

    w.buildAI4All();

    // Content Editor
    w.buildContentEditor = () => {
      const container = document.getElementById('content-editor-list');
      if (!container) return;
      container.innerHTML = '';
      aiCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'editor-card';
        card.innerHTML = `
          <h3>${cat.label}</h3>
          <div class="form-group"><label>Description Text</label>
            <textarea rows="2" id="edit-desc-${cat.id}" style="width:100%;padding:0.7rem;background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-family:'Inter',sans-serif;outline:none;resize:vertical;">${cat.desc}</textarea>
          </div>
          <div class="video-editor-row">
            <input type="text" id="edit-yt-${cat.id}" placeholder="YouTube embed URL" value="${videoLinks[cat.id]}">
            <button class="btn-small" onclick="window.updateContent('${cat.id}')">Save</button>
          </div>`;
        container.appendChild(card);
      });
    };

    w.updateContent = (id: string) => {
      const newDesc = (document.getElementById('edit-desc-' + id) as HTMLTextAreaElement)?.value;
      const newYt = (document.getElementById('edit-yt-' + id) as HTMLInputElement)?.value;
      videoLinks[id] = newYt;
      const descEl = document.getElementById('desc-' + id);
      const vidEl = document.getElementById('vid-' + id) as HTMLIFrameElement;
      if (descEl) descEl.textContent = newDesc;
      if (vidEl) vidEl.src = newYt;
      w.showToast('Content updated for ' + id + '!');
    };

    // Analytics Build
    w.buildAnalytics = () => {
      const grid = document.getElementById('analytics-grid');
      if (!grid) return;
      grid.innerHTML = '';
      aiCategories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'analytics-card';
        card.innerHTML = `<h4>${cat.label}</h4>
          <div class="mini-label"><span>Learners</span><span>${Math.floor(500 + Math.random() * 5000)}</span></div>
          <div class="mini-bar"><div class="mini-fill" style="width:${cat.progress}%"></div></div>
          <div class="mini-label"><span>Avg Completion</span><span style="color:var(--primary)">${cat.progress}%</span></div>`;
        grid.appendChild(card);
      });
    };

    // Student Quiz Build
    let currentQ = 0;
    let quizScore = 0;

    w.buildStudentQuiz = () => {
      const c = document.getElementById('quiz-container');
      if (!c) return;
      if (currentQ >= quizBank.length) {
        c.innerHTML = `<div style="text-align:center;padding:2rem"><h3 style="color:var(--success);font-family:'Space Grotesk',sans-serif;margin:1rem 0;font-weight:700;">Quiz Complete!</h3><p style="color:var(--text-muted)">You scored ${quizScore}/${quizBank.length}</p><button class="btn-submit" onclick="window.resetQuiz()" style="margin-top:1rem;max-width:200px;">Try Again</button></div>`;
        return;
      }
      const q = quizBank[currentQ];
      if (q) {
        c.innerHTML = `<div class="big-quiz-q">Q${currentQ + 1}. ${q.q}</div>
          <div class="big-quiz-opts">${q.opts.map((o, i) => `<button class="big-quiz-opt" onclick="window.answerStudentQuiz(this,${i},${q.ans})">${o}</button>`).join('')}</div>
          <div id="quiz-fb" class="quiz-feedback" style="display:none"></div>`;
      }
    };

    w.resetQuiz = () => {
      currentQ = 0;
      quizScore = 0;
      const sDisp = document.getElementById('quiz-score-display');
      if (sDisp) sDisp.textContent = 'Score: 0';
      w.buildStudentQuiz();
    };

    w.answerStudentQuiz = (btn: HTMLButtonElement, chosen: number, correct: number) => {
      const opts = btn.closest('.big-quiz-opts')?.querySelectorAll('.big-quiz-opt');
      if (opts) {
        opts.forEach(o => ((o as HTMLButtonElement).disabled = true));
        opts[correct]?.classList.add('correct');
      }
      const fb = document.getElementById('quiz-fb');
      if (fb) {
        if (chosen === correct) {
          btn.classList.add('correct');
          quizScore++;
          const scoreDisp = document.getElementById('quiz-score-display');
          if (scoreDisp) scoreDisp.textContent = 'Score: ' + quizScore;
          fb.className = 'quiz-feedback correct';
          fb.textContent = 'Correct! Well done!';
        } else {
          btn.classList.add('wrong');
          fb.className = 'quiz-feedback wrong';
          fb.textContent = 'Incorrect. The right answer is: ' + quizBank[currentQ].opts[correct];
        }
        fb.style.display = 'block';
      }
      currentQ++;
      setTimeout(() => w.buildStudentQuiz(), 1800);
    };

    // Toasts
    w.showToast = (msg: string) => {
      const t = document.createElement('div');
      t.className = 'toast';
      t.innerHTML = `<span>${msg}</span>`;
      document.body.appendChild(t);
      setTimeout(() => {
        t.style.animation = 'slideInToast 0.4s cubic-bezier(0.16, 1, 0.3, 1) reverse';
        setTimeout(() => t.remove(), 400);
      }, 3000);
    };

    // Periodic check to hide Spline watermarks safely
    const labelInterval = setInterval(() => {
      document.querySelectorAll('a[href*="spline"], [class*="watermark"], [id*="watermark"]').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });
    }, 1000);

    // Scroll listener for transparent & sticky header behavior
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to establish correct state
    handleScroll();

    // Intersection Observer for Partnerships staggered reveal
    const collabSection = document.getElementById('collaboration-section');
    if (collabSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            collabSection.classList.add('reveal-active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(collabSection);
    }

    // Fallback: automatically reveal collaboration section after 1.5 seconds if not already done
    const revealTimeout = setTimeout(() => {
      const el = document.getElementById('collaboration-section');
      if (el) el.classList.add('reveal-active');
    }, 1500);

    // 3D Tilt Hover Handlers for Partnerships Cards
    w.handleLogoMouseMove = (e: any) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((centerY - y) / centerY) * 10;
      const rotY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(800px) translateY(-10px) scale(1.06) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.boxShadow = `0 20px 45px rgba(150, 116, 45, 0.18), 0 0 25px rgba(150, 116, 45, 0.22)`;
      card.style.borderColor = `rgba(150, 116, 45, 0.3)`;
    };

    w.handleLogoMouseLeave = (e: any) => {
      const card = e.currentTarget;
      card.style.transform = `perspective(800px) translateY(0) scale(1) rotateX(0deg) rotateY(0deg)`;
      card.style.boxShadow = ``;
      card.style.borderColor = ``;
    };

    // 3D Tilt for Testimonial Cards
    w.handleCardTiltMove = (e: any) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((centerY - y) / centerY) * 10;
      const rotY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(800px) translateY(-12px) scale(1.07) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.boxShadow = `0 25px 50px rgba(155, 122, 62, 0.2), 0 0 30px rgba(155, 122, 62, 0.15)`;
      card.style.borderColor = `rgba(155, 122, 62, 0.35)`;
    };

    w.handleCardTiltLeave = (e: any) => {
      const card = e.currentTarget;
      card.style.transform = ``;
      card.style.boxShadow = ``;
      card.style.borderColor = ``;
    };

    // Chat functionality
    w.toggleChat = () => {
      const modal = document.getElementById('chat-modal');
      if (modal) {
        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
          setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
        }
      }
    };

    w.sendChatMessage = () => {
      const input = document.getElementById('chat-input') as HTMLInputElement;
      if (!input || !input.value.trim()) return;
      const msg = input.value.trim();
      input.value = '';
      const msgs = document.getElementById('chat-messages');
      if (!msgs) return;

      // Add user message
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg user';
      userDiv.innerHTML = `<div class="chat-msg-content">${msg}</div>`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;

      // Generate response
      setTimeout(() => {
        const response = getChatResponse(msg);
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-msg bot';
        botDiv.innerHTML = `<div class="chat-msg-content">${response}</div>`;
        msgs.appendChild(botDiv);
        msgs.scrollTop = msgs.scrollHeight;
      }, 600);
    };

    const getChatResponse = (msg: string): string => {
      const lower = msg.toLowerCase();

      // Greetings
      if (/^(hi|hello|hey|hlo|good\s*(morning|afternoon|evening)|yo|sup|namaste|vanakam|🙏|namaskar)/.test(lower)) {
        return 'Hello! 👋 Welcome to IncuXai Education Trust. I\'m here to help you with any questions. Ask me about our programs, how to volunteer, login help, or anything else!';
      }

      // Who are you / about
      if (/who\s*(are|is)\s*(you|this)|about|what\s*(is|are)\s*(this|you)|tell\s*me\s*about/.test(lower) && !/program/.test(lower) && !/mission/.test(lower)) {
        return 'I\'m the AI Assistant for <b>IncuXai Education Trust</b>. We\'re a non-profit organization on a mission to make AI knowledge accessible to every Indian citizen. We operate across 22 states with 5000+ volunteers!';
      }

      // Mission
      if (/mission/.test(lower)) {
        return 'Our mission is to make AI knowledge <b>accessible, affordable, and actionable</b> for every Indian citizen regardless of their education, age, or economic background. 🌟';
      }

      // Vision
      if (/vision/.test(lower)) {
        return 'Our vision is to create a future where every Indian has the knowledge and tools to harness AI for personal and community growth. 🚀';
      }

      // Programs
      if (/program/.test(lower) || /courses?/.test(lower) || /course/.test(lower) || /what\s*(do|are)\s*we\s*(do|offer)/.test(lower)) {
        return 'We offer <b>6 key programs</b>:<br>• 🎓 <b>Free Courses</b> — AI courses in regional languages<br>• 🌾 <b>Rural Outreach</b> — AI education in villages<br>• 🤝 <b>Volunteer Network</b> — 5000+ volunteers<br>• 📱 <b>Mobile Learning</b> — Learn on any device<br>• 🏆 <b>Certifications</b> — Earn recognized certs<br>• 💼 <b>Career Support</b> — Connect to AI opportunities';
      }

      // AI 4 ALL
      if (/ai\s*4\s*all|ai\s*for\s*all|ai4all|\d+\s*categor/.test(lower)) {
        return 'Our <b>AI 4 ALL</b> initiative covers 5 categories: Smart Cities, Education, Farmers, Health, and Our Planet. Each category has topics with video lessons and quizzes! Click "AI 4 ALL" in the nav to explore. 🚀';
      }

      // Volunteer
      if (/volunteer/.test(lower) || /join/.test(lower)) {
        return 'Want to volunteer? 🌟 Click the <b>"Become a Volunteer"</b> button on the home page or the <b>"Volunteer"</b> link in the nav. You can register with your name, email, department interest, and motivation. After registering, you\'ll get access to the Volunteer Portal with events, tasks, and more!';
      }

      // Login help
      if (/login|log\s*in|sign\s*in|password|forgot/.test(lower)) {
        return 'To login, click the <b>🔐 Login</b> button in the top-right. You can login as a <b>Volunteer</b> or <b>Admin</b>. For demo purposes, any email works! Just select your role and click login. Admins can manage the site content after logging in.';
      }

      // Admin help
      if (/admin/.test(lower)) {
        return 'The <b>Admin Portal</b> lets you manage: users, analytics, content editor, events, and more. Login with the Admin tab and any email to access it. From there you can edit AI 4 ALL content, manage events, and view site analytics!';
      }

      // Gallery
      if (/gallery|photo|image|picture/.test(lower)) {
        return 'Check out our <b>Gallery</b> page to see photos from our events, workshops, and outreach programs across India! Click "Gallery" in the navigation menu. 📸';
      }

      // Team
      if (/team|founder|leadership|who\s*runs|who\s*started/.test(lower)) {
        return 'Our team is led by <b>Dr. Arjun Reddy</b> (Founder & CEO), along with <b>Priya Sharma</b> (COO), <b>Rahul Verma</b> (CTO), and <b>Anita Desai</b> (Director of Outreach). You can see them in the About section on the home page! 👥';
      }

      // Contact
      if (/contact|phone|email|address|reach|call|mail/.test(lower)) {
        return 'You can reach us at:<br>📧 <b>info@incuxaieducationtrust.org</b><br>📞 <b>+91 9494808589</b><br>📍 <b>INCUXAI PRIVATE LIMITED, 134-1-317, Pandu Ranga Nagar, Muthyala Reddy Nagar, Guntur, Andhra Pradesh 522034</b><br>Or visit our website: www.incuxaieducationtrust.org';
      }

      // Location
      if (/where|location|address|based|vijayawada|india/.test(lower) && !/contact/.test(lower)) {
        return 'We are based in <b>Vijayawada, Andhra Pradesh, India</b>, and operate across 22 states through our network of 5000+ trained volunteers. 🇮🇳';
      }

      // Timings / hours
      if (/timing|hour|when|open|available|office/.test(lower)) {
        return 'Our programs are available <b>24/7 online</b> through our platform. For office inquiries, you can reach us during business hours (9 AM - 6 PM, Mon-Sat). Our volunteers conduct field programs on weekends!';
      }

      // Donate / donation
      if (/donate|donation|contribute|support|fund/.test(lower)) {
        return 'Thank you for wanting to support us! 🙏 You can contribute by volunteering your time, donating to our cause, or spreading the word. Visit our Donate page or contact us at <b>info@incuxaieducationtrust.org</b> for more details.';
      }

      // Thanks
      if (/thank|thanks|thnx|ty|gratitude/.test(lower)) {
        return 'You\'re welcome! 😊 If you have any more questions, feel free to ask. We\'re here to help!';
      }

      // Bye
      if (/bye|goodbye|cya|see\s*you|tata|exit/.test(lower)) {
        return 'Goodbye! 👋 Feel free to come back anytime you need help. Have a great day!';
      }

      // Help
      if (/help|support|assist|guide|how\s*(can|do|to).*use|stuck|confused|what\s*can\s*you/.test(lower)) {
        return 'I can help you with:<br>• 🏠 <b>Site navigation</b> — finding pages<br>• 📚 <b>Programs & courses</b> — what we offer<br>• 🤝 <b>Volunteering</b> — how to join<br>• 🔐 <b>Login</b> — help signing in<br>• 🏙️ <b>Organization info</b> — about us, mission, vision<br>• 📞 <b>Contact</b> — how to reach us<br><br>Just ask me anything!';
      }

      // Default
      return 'I\'d love to help with that! Could you rephrase your question? 😊 Here are some things I can assist with:<br>• Our programs & courses<br>• How to volunteer<br>• Login help<br>• About the organization<br>• Or just say "help" to see what I can do!';
    };

    // Dynamic database and UI synchronization mount triggers
    w.showGalleryFolder = (id: string, title: string) => {
      const source = document.getElementById(id);
      const grid = document.getElementById('gallery-detail-grid');
      const titleEl = document.getElementById('gallery-folder-name');
      if (source && grid && titleEl) {
        titleEl.innerText = title;
        grid.innerHTML = source.innerHTML;
        grid.style.display = 'grid';
        w.showPage('gallery-detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    w.initData();
    w.renderEvents();
    w.renderTasks();
    w.renderVolunteersAndLeaderboard();

    // Restore page from saved session
    if (currentUser) {
      setTimeout(() => {
        if (currentUser?.role === 'volunteer') {
          const pName = document.getElementById('portal-name');
          const pFullName = document.getElementById('portal-fullname');
          const pAvatar = document.getElementById('portal-avatar');
          if (pName) pName.textContent = currentUser.name;
          if (pFullName) pFullName.textContent = currentUser.name;
          if (pAvatar) pAvatar.textContent = currentUser.name[0].toUpperCase();
          w.renderEvents();
          w.renderTasks();
          w.renderVolunteersAndLeaderboard();
          w.populateVolunteerProfile();
          w.showPage('vol-portal');
        } else if (currentUser?.role === 'teacher') {
          const tpName = document.getElementById('tportal-name');
          const tpFullName = document.getElementById('tportal-fullname');
          const tpAvatar = document.getElementById('tportal-avatar');
          if (tpName) tpName.textContent = currentUser.name;
          if (tpFullName) tpFullName.textContent = currentUser.name;
          if (tpAvatar) tpAvatar.textContent = currentUser.name[0].toUpperCase();
          w.renderTeacherPortal();
          w.showPage('teacher-portal');
        } else if (currentUser?.role === 'admin') {
          w.renderEvents();
          w.renderTasks();
          w.renderVolunteersAndLeaderboard();
          w.loadEventRegistrations();
          w.showPage('admin-portal');
        }
      }, 100);
    }

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(revealTimeout);
      clearInterval(sliderInterval);
      clearInterval(labelInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isIitPaymentFlow) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: 'radial-gradient(circle at center, #1e1b15 0%, #0d0b07 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {paymentError ? (
          <>
            <svg style={{ width: '48px', height: '48px', color: '#EF4444', marginBottom: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 style={{ color: '#EF4444', fontFamily: 'system-ui, sans-serif', fontSize: '1.5rem', fontWeight: '600' }}>Error</h2>
            <p style={{ color: '#D1D5DB', fontFamily: 'system-ui, sans-serif', marginTop: '10px', textAlign: 'center', maxWidth: '400px' }}>{paymentError}</p>
          </>
        ) : (
          <>
            <div className="spinner" style={{ border: '4px solid rgba(155,122,62,0.15)', borderTop: '4px solid #d4af37', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '20px', boxShadow: '0 0 10px rgba(212,175,55,0.2)' }} />
            <h2 style={{ color: '#ffffff', fontFamily: 'system-ui, sans-serif', fontSize: '1.5rem', fontWeight: '600' }}>Initializing secure payment...</h2>
            <p style={{ color: '#9CA3AF', fontFamily: 'system-ui, sans-serif', marginTop: '10px' }}>Please do not close this window.</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* ========== AI FOR HR POPUP ========== */}
      {showHrPopup && (
        <div className="hr-alert-popup-overlay" onClick={() => setShowHrPopup(false)}>
          <div className="hr-alert-popup" onClick={(e) => e.stopPropagation()}>
            <button className="hr-alert-close" onClick={() => setShowHrPopup(false)}>✕</button>
            <div className="hr-alert-badge">🚀 New Course Available</div>
            <h2 className="hr-alert-title">AI for HR Professionals</h2>
            <p className="hr-alert-desc">
              Transform your HR operations with AI-powered resume screening, employee sentiment analysis, and predictive retention models. Exclusively for verified HR professionals.
            </p>
            <button
              className="panel-btn-register"
              style={{ width: '100%' }}
              onClick={() => {
                setShowHrPopup(false);
                if (isAuthenticated) {
                  localStorage.setItem('corp_otp_verified', 'true');
                  navigate('/course-dashboard');
                } else {
                  navigate('/sign-up');
                }
              }}
            >
              <span>Explore AI for HR Course</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========== HEADER ========== */}
      <header>
        <div className="logo" onClick={() => (window as any).showPage('home')} style={{ padding: '0', background: 'transparent', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logoImg} alt="IncuXai Logo" className="logo-icon" style={{ height: '45px', width: 'auto', borderRadius: '8px' }} />
          <div className="logo-text-group" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span className="logo-title">IncuXai</span>
            <span className="logo-subtitle">Education Trust</span>
          </div>
        </div>
        <nav id="main-nav">
          <a onClick={() => (window as any).showPage('home')} className="active">Home</a>
          <div className="nav-item">
            <a onClick={() => (window as any).showPage('about')}>About</a>
            <div className="dropdown">
              <a onClick={() => { (window as any).showPage('about'); setTimeout(() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Our Story</a>
              <a onClick={() => { (window as any).showPage('about'); setTimeout(() => document.querySelector('.about-extras')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Vision & Mission</a>
              <a onClick={() => { (window as any).showPage('about'); setTimeout(() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Team</a>
            </div>
          </div>
          <div className="nav-item">
            <a onClick={() => (window as any).showPage('ai4all')} className="nav-highlight-btn">AI 4 ALL</a>
            <div className="dropdown">
              <a onClick={() => {
                if (isAuthenticated) {
                  localStorage.setItem('corp_otp_verified', 'true');
                  navigate('/course-dashboard');
                } else {
                  navigate('/sign-in');
                }
              }}>AI for HR</a>
              <a onClick={() => { (window as any).showPage('ai4all'); const w = window as any; w.showToast?.('AI for Teachers course is coming soon!'); }}>AI for Teachers <span style={{ fontSize: '0.65rem', color: '#C5A059', fontWeight: '700' }}>SOON</span></a>
              <a onClick={() => { (window as any).showPage('ai4all'); const w = window as any; w.showToast?.('AI for Police course is coming soon!'); }}>AI for Police <span style={{ fontSize: '0.65rem', color: '#C5A059', fontWeight: '700' }}>SOON</span></a>
            </div>
          </div>
          <a onClick={() => (window as any).showPage('programs')}>Programs</a>
          <a onClick={() => (window as any).showPage('volunteer')}>Volunteer</a>
          <a onClick={() => (window as any).showPage('teachxai')} className="nav-highlight-btn">TeachXai</a>
          <div className="nav-item">
            <a onClick={() => (window as any).showPage('gallery')}>Gallery</a>
            <div className="dropdown">
              <a onClick={() => { (window as any).showPage('gallery'); setTimeout(() => document.querySelector('.gallery-folder-card')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Farmer Workshops</a>
              <a onClick={() => { (window as any).showPage('gallery'); setTimeout(() => { const cards = document.querySelectorAll('.gallery-folder-card'); if (cards[1]) cards[1].scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Education</a>
              <a onClick={() => { (window as any).showPage('gallery'); setTimeout(() => { const cards = document.querySelectorAll('.gallery-folder-card'); if (cards[2]) cards[2].scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Volunteer Events</a>
              <a onClick={() => { (window as any).showPage('gallery'); setTimeout(() => { const cards = document.querySelectorAll('.gallery-folder-card'); if (cards[3]) cards[3].scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Celebrations</a>
            </div>
          </div>
          <a onClick={() => (window as any).showPage('contact')}>Contact</a>
        </nav>
        <nav id="portal-nav" style={{ display: 'none', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          <a id="portal-nav-dashboard" onClick={() => { const u = JSON.parse(localStorage.getItem('currentUser')||'{}'); if(u.role==='volunteer') (window as any).showPage('vol-portal'); else if(u.role==='teacher') (window as any).showPage('teacher-portal'); else (window as any).showPage('admin-portal'); }}>Dashboard</a>
          <a id="portal-nav-profile" onClick={() => { const u = JSON.parse(localStorage.getItem('currentUser')||'{}'); if(u.role==='volunteer') (window as any).showPage('vol-portal'); else if(u.role==='teacher') (window as any).showPage('teacher-portal'); setTimeout(() => { const el = document.getElementById(u.role==='teacher'?'tportal-profile':'vol-profile'); if(el) (window as any)[u.role==='teacher'?'showTportalSection':'showPortalSection'](u.role==='teacher'?'tportal-profile':'vol-profile', {currentTarget: el}); }, 50); }}>Profile</a>
        </nav>
        <div className="header-right">
          <span id="logged-user" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', fontWeight: '600', display: 'none' }}></span>
          <button className="btn-donate" id="signup-btn" onClick={() => (window as any).showPage('donate')}>Donate</button>
          {isAuthenticated ? (
            <>
              <button className="btn-login" onClick={() => { localStorage.setItem('corp_otp_verified', 'true'); navigate('/course-dashboard'); }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', marginRight: '0.4rem' }}>
                Dashboard
              </button>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginRight: '0.5rem' }}>
                {authUser?.name || authUser?.email}
              </span>
              <button className="btn-login" onClick={() => { authLogout(); navigate('/'); }} style={{ background: 'rgba(220,38,38,0.8)', border: 'none' }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-up" style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.82rem', fontWeight: '600', textDecoration: 'none', marginRight: '0.4rem' }}>
                Sign Up
              </Link>
              <Link to="/sign-in" className="btn-login" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
            </>
          )}
          <button className="mobile-menu-toggle" onClick={() => {
            const nav = document.getElementById('main-nav');
            const toggle = document.querySelector('.mobile-menu-toggle');
            nav?.classList.toggle('mobile-open');
            toggle?.classList.toggle('active');
          }}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* ========== HOME PAGE ========== */}
      <div id="home" className="page active">
        {/* Hero Slider */}
        <div className="hero-slider">
          {/* Particles */}
          <div className="particles" id="particles"></div>

          {/* Slides */}
          {slideImages.map((src, idx) => (
            <div
              key={idx}
              className={`slide slide-${idx + 1} ${idx === 0 ? 'active' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
            >
              <div className="slide-overlay"></div>
              <div className="grid-overlay"></div>
            </div>
          ))}

          {/* Hero Content */}
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 2px 20px rgba(0,0,0,0.4)', letterSpacing: '-0.02em', lineHeight: '1.1', textAlign: 'left', whiteSpace: 'nowrap', marginBottom: '2rem' }}>
                AI FOR ALL
              </h1>
              <div className="hero-tagline" id="hero-tagline" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                <span id="tagline-text" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', fontWeight: '400', letterSpacing: '0.02em' }}></span>
              </div>
              <div className="hero-btns">
                <button className="btn-modern-primary" onClick={() => (window as any).showPage('ai4all')}>
                  <span className="btn-text">Explore AI Courses</span>
                  <span className="btn-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                  <span className="btn-glow-wrapper"></span>
                </button>
                <button className="btn-modern-secondary" onClick={() => (window as any).showPage('volunteer')}>
                  <span className="btn-text">Become a Volunteer</span>
                  <span className="btn-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </button>
                <button className="btn-modern-secondary" onClick={() => (window as any).showPage('teachxai')}>
                  <span className="btn-text">TeachXai</span>
                  <span className="btn-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat toggle button — below robot area */}
          <button className="chat-bubble" onClick={() => (window as any).toggleChat()} title="AI Assistant">
            <span className="chat-bubble-icon">💬</span>
          </button>

          {/* Minimal Slider dots */}
          <div className="slider-dots" id="slider-dots">
            {slideImages.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === 0 ? 'active' : ''}`}
                onClick={() => (window as any).goToSlide(idx)}
              ></div>
            ))}
          </div>

          {/* Social Media Strip at bottom of hero */}
          <div className="hero-social-strip">
            <span className="hero-social-strip-label">Follow Us</span>
            <div className="hero-social-strip-icons">
              <a href="https://www.instagram.com/incuxai/" target="_blank" rel="noopener noreferrer" className="strip-social-link strip-instagram" title="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://linkedin.com/company/incuxai/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="strip-social-link strip-linkedin" title="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61590436827340" target="_blank" rel="noopener noreferrer" className="strip-social-link strip-facebook" title="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://youtube.com/@incuxai?si=1KB19n7w3B0xmrBc" target="_blank" rel="noopener noreferrer" className="strip-social-link strip-youtube" title="YouTube">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* ========== ABOUT SECTION (inside home page) ========== */}
        <section id="about-section">
          <div className="about-grid">
            <div className="about-img">
              <div className="about-img-placeholder"><img src={whoWeAreImg} alt="Classroom learning" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '28px', display: 'block' }} /></div>
            </div>
            <div className="about-text">
              <h3>Who We Are</h3>
              <p>IncuXai Education Trust was founded by a group of technologists, educators, and social workers who saw a growing digital divide between those who understand AI and those who do not.</p>
              <p>We operate across 22 states in India, with a network of over 5,000 trained volunteers delivering AI literacy programs in local languages — Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, and more.</p>
              <p>Our programs have reached over 2 lakh learners including farmers who now use AI for crop disease detection, teachers who use AI tools to personalize education, and small business owners who use AI to grow their enterprises.</p>
            </div>
          </div>

          <div className="about-extras">
            <div className="about-tabs-container">
              <button className="about-pill-btn active" onClick={() => (window as any).rotateCubeToIndex(0, true)}>Our Mission</button>
              <button className="about-pill-btn" onClick={() => (window as any).rotateCubeToIndex(1, true)}>Our Vision</button>
              <button className="about-pill-btn" onClick={() => (window as any).rotateCubeToIndex(2, true)}>Our Values</button>
              <button className="about-pill-btn" onClick={() => (window as any).rotateCubeToIndex(3, true)}>Our Journey</button>
            </div>
            
            <div className="cube-viewport">
              <div className="about-cube" id="about-cube">
                {/* Face 1: Mission (Front) */}
                <div className="cube-face cube-front">
                  <div className="about-detail-matter">
                    <h4 className="tab-title">Democratizing AI Education</h4>
                    <p>To make AI knowledge accessible, affordable, and actionable for every Indian citizen regardless of their education, age, or economic background.</p>
                    <p>We believe that artificial intelligence should not be a privilege for the few, but a fundamental tool for the many. By breaking down language barriers and simplifying complex concepts, our mission is to empower rural communities, local businesses, and students to actively shape the future of technology rather than just consuming it.</p>
                  </div>
                  <div className="about-detail-photo">
                    <img src={ourMissionImg} alt="Our Mission" />
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop" alt="Our Mission" />
                  </div>
                </div>
                
                {/* Face 2: Vision (Right) */}
                <div className="cube-face cube-right">
                  <div className="about-detail-matter">
                    <h4 className="tab-title">A Digitally Empowered India</h4>
                    <p>To create a future where every Indian has the knowledge and tools to harness AI for personal and community growth.</p>
                    <p>We envision a nationwide ecosystem where farmers optimize their yields using predictive AI, teachers personalize learning for every student, and small businesses scale efficiently. By fostering a culture of innovation and digital literacy, we aim to position India as a global leader in inclusive AI adoption.</p>
                  </div>
                  <div className="about-detail-photo">
                    <img src={ourVisionImg} alt="Our Vision" />
                  </div>
                </div>

                {/* Face 3: Values (Back) */}
                <div className="cube-face cube-back">
                  <div className="about-detail-matter">
                    <h4 className="tab-title">What Drives Us Every Day</h4>
                    <p><strong>Inclusivity:</strong> We design our programs for every person, breaking through barriers of language, caste, and geography.</p>
                    <p><strong>Open Access:</strong> Education should be free forever. We enforce no paywalls and no hidden barriers.</p>
                    <p><strong>Community-First:</strong> We build a supportive ecosystem of learners who teach and uplift one another, measuring our success by the tangible impact we create in real lives.</p>
                  </div>
                  <div className="about-detail-photo">
                    <img src={ourValuesImg} alt="Our Values" />
                    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop" alt="Our Values" />
                  </div>
                </div>

                {/* Face 4: Journey (Left) */}
                <div className="cube-face cube-left">
                  <div className="about-detail-matter">
                    <h4 className="tab-title">From Concept to Movement</h4>
                    <p>Starting with a handful of volunteers in a single district, our journey began with a simple idea: tech literacy is a fundamental right. Over the years, we've expanded our reach to 22 states, translating complex AI concepts into regional languages.</p>
                    <p>Today, with a strong network of over 5,000 passionate volunteers, we have transformed from a small local initiative into a nationwide movement that has already impacted hundreds of thousands of lives.</p>
                  </div>
                  <div className="about-detail-photo">
                    <img src={ourJourneyImg} alt="Our Journey" />
                    <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&auto=format&fit=crop" alt="Our Journey" />
                  </div>
                </div>
              </div>
            </div>
           </div>
        </section>

        {/* ========== VOLUNTEER HIRING ALERT BANNER ========== */}
        <div className="hiring-alert-container">
          <div className="hiring-alert-card">
            <div className="hiring-alert-left">
              <div className="hiring-alert-header">
                <span className="hiring-alert-badge">Active Recruitment</span>
                <h4 className="hiring-alert-title"><span className="alert-siren">🚨</span> Hiring Volunteers</h4>
              </div>
              <p className="hiring-alert-desc">
                We are actively looking for passionate volunteers to help teach AI skills in local languages across India. Join our community of 5,000+ change-makers!
              </p>
            </div>
            <div className="hiring-alert-right">
              <button 
                className="hiring-alert-btn" 
                onClick={() => {
                  (window as any).showPage('volunteer');
                  setTimeout(() => {
                    (window as any).openSignUpModal();
                  }, 100);
                }}
              >
                Apply Now
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ========== OUR SERVICES SECTION ========== */}
        <section style={{ background: 'var(--darker)', padding: '5rem 8%' }}>
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our <span style={{ color: 'var(--secondary)' }}>Services</span></h2>
            <p className="section-sub">Comprehensive AI education programs designed for every community across India</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {[
              { icon: '📚', title: 'Free Online Courses', desc: 'Self-paced courses on ChatGPT, Canva AI, Prompt Engineering, Google Tools, and more — completely free.', link: 'ai4all' },
              { icon: '🤝', title: 'Volunteer Network', desc: 'Join 5,000+ volunteers across 22 states delivering AI literacy in Hindi, Telugu, Tamil, Kannada, and more.', link: 'volunteer' },
              { icon: '🏫', title: 'TeachXai', desc: 'AI training program for educators — earn certificates, build lesson plans, and bring AI into your classroom.', link: 'teachxai' }
            ].map((service, i) => (
              <div key={i} onClick={() => (window as any).showPage(service.link)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px',
                padding: '1.8rem', cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(155,122,62,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'; }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.8rem' }}>{service.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>{service.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>{service.desc}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.82rem', fontWeight: '600', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== COLLABORATION SECTION ========== */}
        <section id="collaboration-section" style={{ background: 'var(--darker)', borderTop: '1px solid var(--glass-border)', padding: '5rem 8%' }}>
          <div className="section-header">
            <span className="section-tag">Partnerships</span>
            <h2 className="section-title">Our <span style={{ color: 'var(--secondary)' }}>Collaboration</span> Network</h2>
            <p className="section-sub">Empowering rural and urban communities in partnership with India's leading organizations</p>
          </div>
          
          <div className="logo-marquee-container">
            <div className="logo-marquee-track">
              {/* Tile 0: Incuxai */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={incuxLogoImg} alt="Incuxai Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 1: JVV */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={jvvLogo} alt="JVV Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 1: JVV */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={jvvLogo} alt="JVV Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 2: SUN */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={sunLogo} alt="SUN Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 3: Covid Fighters */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={covidfightersLogo} alt="Covid Fighters Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 4: Elivatx */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={elivatxLogo} alt="Elivatx Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 5: HCET */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={hcetLogo} alt="HCET Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 6: Job Recipe */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={jobreciepeLogo} alt="Job Recipe Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Duplicate the items for seamless infinite scrolling loop */}
              {/* Tile 0: Incuxai */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={incuxLogoImg} alt="Incuxai Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 1: JVV */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={jvvLogo} alt="JVV Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 2: SUN */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={sunLogo} alt="SUN Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 3: Covid Fighters */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={covidfightersLogo} alt="Covid Fighters Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 4: Elivatx */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={elivatxLogo} alt="Elivatx Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 5: HCET */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={hcetLogo} alt="HCET Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Tile 6: Job Recipe */}
              <div className="partner-card">
                <div className="partner-logo-wrapper">
                  <img src={jobreciepeLogo} alt="Job Recipe Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ background: '#f8f7f3', padding: '5rem 8%' }}>
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">Words That Inspire Us</h2>
            <p className="section-sub">Hear from people whose lives have been touched by IncuxAI Education Trust</p>
          </div>
          <div className="cards-grid cards-grid-4">
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={veeraImg} alt="Veera" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title" style={{ fontSize: '1rem' }}>Veera</div>
              <div className="card-text" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>IncuxAI&apos;s crop disease detection training helped me save my entire season&apos;s yield. I now teach other farmers in my village how to use AI on their phones.</div>
            </div>
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={hariniImg} alt="Harini" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title" style={{ fontSize: '1rem' }}>Harini</div>
              <div className="card-text" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>The AI teacher training program transformed my classroom. My students are more engaged and I can now create personalized lessons for each child.</div>
            </div>
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={rajuImg} alt="Raju" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title" style={{ fontSize: '1rem' }}>Raju</div>
              <div className="card-text" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>I doubled my sales after applying AI tools I learned at IncuxAI&apos;s MSME workshop. Best decision I ever made for my business.</div>
            </div>
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={raziaImg} alt="Razia" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title" style={{ fontSize: '1rem' }}>Razia</div>
              <div className="card-text" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>I never thought I could learn AI in Hindi. IncuxAI made it possible. I&apos;ve now built my own chatbot and won the school science fair!</div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team-section">
          <div className="section-header">
            <span className="section-tag">Volunteers</span>
            <h2 className="section-title">Our Volunteer Network</h2>
          </div>
          <div className="cards-grid cards-grid-4">
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={divyaImg} alt="Divya" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Divya</div>
              <div className="card-text">IIT Delhi graduate. Spearheads vernacular AI prompt engineering bootcamps across 40+ villages.</div>
            </div>
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={varunImg} alt="Varun" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Varun</div>
              <div className="card-text">Social work specialist. Mapped agricultural cooperative partnerships to train 20,000+ farmers in AI.</div>
            </div>
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={naziaImg} alt="Nazia" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Nazia</div>
              <div className="card-text">Software engineer. Designs interactive vernacular code templates for rural government schools.</div>
            </div>
            <div className="card tilt-card" style={{ textAlign: 'center' }} onMouseMove={(e) => (window as any).handleCardTiltMove(e)} onMouseLeave={(e) => (window as any).handleCardTiltLeave(e)}>
              <img src={chandraImg} alt="Chandra" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: '0.5rem', display: 'inline-block' }} />
              <div className="card-title">Chandra</div>
              <div className="card-text">Rural education activist. Established 60+ mobile-learning resource centers across remote districts.</div>
            </div>
          </div>
        </section>
      </div>

      {/* ========== AI FOR HR COURSE PAGE ========== */}
      <div id="corporate-course" className="page corp-course-page">
        {/* Mock Simulated Email Toast Notifications */}
        {corpToastMessage && (
          <div style={{
            position: 'fixed', top: '90px', right: '2rem', zIndex: 99999,
            background: '#1a1a2e', border: '1px solid #C5A059', borderRadius: '12px',
            padding: '1.2rem 1.6rem', maxWidth: '450px', boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 0.3s ease', color: '#fff', fontSize: '0.88rem', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontWeight: '700', color: '#C5A059', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>📧 Simulated Corporate Email Delivery</span>
              <button onClick={() => setCorpToastMessage(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: '1.4' }}>{corpToastMessage}</p>
            <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#C5A059' }}>
              Tip: Copy the 6-digit code above and paste it into the verification modal.
            </div>
          </div>
        )}

        {!corpIsRegistered ? (
          <>
            {/* Locked Preview State */}
            <div className="corp-course-hero">
              <div className="corp-course-hero-inner">
                <span className="section-tag" style={{ color: 'var(--secondary)' }}>AI 4 ALL Program</span>
                <h1 className="corp-course-title">AI for HR Professionals</h1>
                <p className="section-sub" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', margin: '1rem 0 1.5rem', lineHeight: '1.5' }}>
                  Transform your HR operations with AI-powered resume screening, employee sentiment analysis, predictive attrition models, and AI governance frameworks designed for human resource teams.
                </p>
                <div className="corp-course-meta">
                  <div className="corp-course-meta-item">
                    <span className="corp-course-meta-icon">⏳</span>
                    <span>6 Video Lectures</span>
                  </div>
                  <div className="corp-course-meta-item">
                    <span className="corp-course-meta-icon">📚</span>
                    <span>3 Sections</span>
                  </div>
                  <div className="corp-course-meta-item">
                    <span className="corp-course-meta-icon">🛡️</span>
                    <span>Work Email Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="corp-course-body">
              {/* Left Column: Curriculum & Outcomes */}
              <div style={{ textAlign: 'left' }}>
                <h3 className="corp-section-title">✨ Key Learning Outcomes</h3>
                <div className="outcomes-list">
                  <div className="outcome-card">
                    <div className="outcome-check">✓</div>
                    <div className="outcome-text">Automate Resume Screening & Candidate Ranking with LLMs</div>
                  </div>
                  <div className="outcome-card">
                    <div className="outcome-check">✓</div>
                    <div className="outcome-text">Analyze Employee Sentiment from Annual Feedback Surveys</div>
                  </div>
                  <div className="outcome-card">
                    <div className="outcome-check">✓</div>
                    <div className="outcome-text">Build Predictive Attrition & Retention Models</div>
                  </div>
                  <div className="outcome-card">
                    <div className="outcome-check">✓</div>
                    <div className="outcome-text">Ensure AI Ethics, GDPR Compliance & Bias-Free Hiring</div>
                  </div>
                </div>

                <h3 className="corp-section-title">📋 Course Curriculum</h3>
                <div className="curriculum-list">
                  {hrCurriculum.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className={`curriculum-module ${corpExpandedModule === sIdx ? 'expanded' : ''}`}
                    >
                      <div
                        className="curriculum-module-header"
                        onClick={() => setCorpExpandedModule(corpExpandedModule === sIdx ? null : sIdx)}
                      >
                        <div className="curriculum-module-title-group">
                          <span className="curriculum-module-badge">Section {sIdx + 1}</span>
                          <span className="curriculum-module-title">{sec.section.split(': ')[1] || sec.section}</span>
                        </div>
                        <span className="curriculum-module-icon">▼</span>
                      </div>
                      <div className="curriculum-module-body">
                        <div className="curriculum-module-content">
                          <ul className="curriculum-lessons-list">
                            {sec.videos.map((vid, vIdx) => (
                              <li key={vIdx} className="curriculum-lesson-item">
                                <span className="curriculum-lesson-bullet"></span>
                                <span>{vid.title} ({vid.duration})</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Lock Panel / Call to Action */}
              <div className="sidebar-panel">
                <span className="panel-lock-icon">🔒</span>
                <h4 className="panel-title">Work Email Verification Required</h4>
                <p className="panel-desc">
                  This course is exclusively for HR professionals. To gain access, register using your official company email address.
                </p>
                <button className="panel-btn-register" onClick={() => setCorpShowRegModal(true)}>
                  <span>Register & Unlock Course</span>
                  <span>→</span>
                </button>
                <div className="panel-requirements">
                  <h5 className="panel-req-title">Validation Checklist</h5>
                  <div className="panel-req-item">
                    <span className="panel-req-bullet">•</span>
                    <span>Requires official corporate domain email</span>
                  </div>
                  <div className="panel-req-item">
                    <span className="panel-req-bullet">•</span>
                    <span>No personal domains (gmail, yahoo, etc.) accepted</span>
                  </div>
                  <div className="panel-req-item">
                    <span className="panel-req-bullet">•</span>
                    <span>6-Digit secure OTP code verification</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Unlocked Learning Dashboard State — Udemy-style */}
            <div style={{ padding: '3rem 5% 4rem' }}>
              <div className="learning-dashboard-container">
                <div className="dashboard-header">
                  <div className="dashboard-title-group">
                    <span className="dashboard-badge">Learning Dashboard</span>
                    <h1 className="dashboard-title">AI for HR Professionals</h1>
                    <div className="dashboard-user-info" style={{ marginTop: '0.4rem' }}>
                      Enrolled: <strong>{corpRegForm.fullName || 'HR Professional'}</strong> ({corpRegForm.companyName || 'Verified Partner'})
                    </div>
                  </div>
                  <button className="btn-donate" onClick={() => {
                    localStorage.removeItem('corp_otp_verified');
                    setCorpIsRegistered(false);
                    const w = window as any;
                    w.showToast?.("Enrolment reset. Course is locked.");
                  }} style={{ background: '#dc2626', borderColor: '#dc2626' }}>
                    Reset Enrollment
                  </button>
                </div>

                <div className="dashboard-grid">
                  {/* Left Column: Video Player & Resource Tabs */}
                  <div>
                    <div className="video-player-wrapper">
                      <iframe
                        src={hrCurriculum[corpActiveSectionIdx]?.videos[corpActiveVideoIdx]?.videoUrl || 'https://www.youtube.com/embed/a0_lo_GDcFw'}
                        title="Course Video"
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    <div style={{ padding: '1.2rem 0.5rem', textAlign: 'left' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                        {hrCurriculum[corpActiveSectionIdx]?.videos[corpActiveVideoIdx]?.title || 'Select a lecture'}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {hrCurriculum[corpActiveSectionIdx]?.videos[corpActiveVideoIdx]?.description || ''}
                      </p>
                    </div>

                    <div className="dashboard-tabs">
                      <button className={`dashboard-tab-btn ${corpActiveTab === 'lessons' ? 'active' : ''}`} onClick={() => setCorpActiveTab('lessons')}>
                        Overview
                      </button>
                      <button className={`dashboard-tab-btn ${corpActiveTab === 'resources' ? 'active' : ''}`} onClick={() => setCorpActiveTab('resources')}>
                        Resources
                      </button>
                    </div>

                    <div className="dashboard-tab-content">
                      {corpActiveTab === 'lessons' ? (
                        <div>
                          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.92rem' }}>
                            {hrCurriculum[corpActiveSectionIdx]?.videos[corpActiveVideoIdx]?.description}
                          </p>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginTop: '1.5rem', marginBottom: '0.8rem' }}>
                            Section Lectures
                          </h4>
                          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                            {hrCurriculum[corpActiveSectionIdx]?.videos.map((vid, vIdx) => (
                              <li key={vIdx} style={{ marginBottom: '0.4rem', fontWeight: corpActiveVideoIdx === vIdx ? '700' : '400', color: corpActiveVideoIdx === vIdx ? '#C5A059' : 'inherit' }}>
                                {vid.title} — {vid.duration}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="resources-list">
                          <div className="resource-item">
                            <span className="resource-title">📂 AI Resume Screening Prompt Templates (PDF)</span>
                            <button className="resource-download-btn" onClick={() => { const w = window as any; w.showToast?.("Downloading Resume Screening Templates..."); }}>Download</button>
                          </div>
                          <div className="resource-item">
                            <span className="resource-title">📊 Employee Sentiment Analysis Workbook (XLSX)</span>
                            <button className="resource-download-btn" onClick={() => { const w = window as any; w.showToast?.("Downloading Sentiment Workbook..."); }}>Download</button>
                          </div>
                          <div className="resource-item">
                            <span className="resource-title">⚙️ GDPR Compliance Checklist for HR AI (PDF)</span>
                            <button className="resource-download-btn" onClick={() => { const w = window as any; w.showToast?.("Downloading GDPR Compliance Checklist..."); }}>Download</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Udemy-style Section Playlist */}
                  <div className="dashboard-sidebar">
                    <div className="progress-header">
                      <span className="progress-title">Your Progress</span>
                      <span className="progress-percentage">
                        {(() => {
                          const totalVids = hrCurriculum.reduce((sum, s) => sum + s.videos.length, 0);
                          let watchedCount = 0;
                          for (let si = 0; si < hrCurriculum.length; si++) {
                            for (let vi = 0; vi < hrCurriculum[si].videos.length; vi++) {
                              if (si < corpActiveSectionIdx || (si === corpActiveSectionIdx && vi <= corpActiveVideoIdx)) watchedCount++;
                            }
                          }
                          return Math.round((watchedCount / totalVids) * 100);
                        })()}%
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${(() => {
                        const totalVids = hrCurriculum.reduce((sum, s) => sum + s.videos.length, 0);
                        let watchedCount = 0;
                        for (let si = 0; si < hrCurriculum.length; si++) {
                          for (let vi = 0; vi < hrCurriculum[si].videos.length; vi++) {
                            if (si < corpActiveSectionIdx || (si === corpActiveSectionIdx && vi <= corpActiveVideoIdx)) watchedCount++;
                          }
                        }
                        return Math.round((watchedCount / totalVids) * 100);
                      })()}%` }}></div>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1rem', textAlign: 'left' }}>
                      Course Content
                    </h4>
                    <div className="playlist-list">
                      {hrCurriculum.map((sec, sIdx) => (
                        <div key={sIdx}>
                          <div className="playlist-section-header">{sec.section}</div>
                          {sec.videos.map((vid, vIdx) => (
                            <div
                              key={`${sIdx}-${vIdx}`}
                              className={`playlist-item ${corpActiveSectionIdx === sIdx && corpActiveVideoIdx === vIdx ? 'active' : ''}`}
                              onClick={() => { setCorpActiveSectionIdx(sIdx); setCorpActiveVideoIdx(vIdx); }}
                            >
                              <span className="playlist-item-num">{vIdx + 1}</span>
                              <div className="playlist-item-title-group">
                                <div className="playlist-item-title">{vid.title}</div>
                                <div className="playlist-item-meta">{vid.duration}</div>
                              </div>
                              <span className="playlist-item-status">
                                {sIdx < corpActiveSectionIdx || (sIdx === corpActiveSectionIdx && vIdx <= corpActiveVideoIdx) ? '✓' : '🔒'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========== AI4ALL PAGE ========== */}
      <div id="ai4all" className="page" style={{ paddingTop: '75px' }}>
        <div className="ai4all-hero" style={{ padding: '4rem 5% 2rem' }}>
          <span className="section-tag">AI 4 ALL Program</span>
          <h2 className="section-title">Learn AI For Your World</h2>
          <p className="section-sub">Practical AI guides crafted for every walk of life — in simple language with real examples, videos, and quizzes.</p>
        </div>
        <div className="ai-categories" id="ai-categories-container">
          {/* Filled dynamically */}
        </div>
      </div>

      {/* ========== AI TOPIC DETAIL PAGE ========== */}
      <div id="ai-topic-detail" className="page" style={{ paddingTop: '75px' }}>
        <div className="topic-detail-header">
          <button className="btn-back" onClick={() => (window as any).backToAI4All()}>← Back to AI 4 ALL</button>
          <h2 className="topic-detail-title" id="topic-category-name">Category</h2>
          <p className="section-sub">Learn about different AI tools and how to use them in this field</p>
        </div>
        <div className="ai-topic-content" id="ai-topic-content"></div>
      </div>

      {/* ========== GALLERY ========== */}
      <div id="gallery" className="page" style={{ paddingTop: '75px' }}>
        <section>
          <div className="section-header">
            <span className="section-tag">Gallery</span>
            <h2 className="section-title">Our Moments</h2>
            <p className="section-sub">Snapshots from workshops, camps, volunteer drives, and communities we've touched.</p>
          </div>
        </section>
        <div className="gallery-folders">
          <div className="gallery-folder-card" style={{ backgroundImage: `url(${iasClassesImg})` }} onClick={() => (window as any).showGalleryFolder('gfol-farmers', 'Farmer Workshops')}>
            <span className="gallery-folder-name">Farmer Workshops</span>
            <div id="gfol-farmers" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: `url(${iit3Img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Farmer AI Workshop – Andhra Pradesh</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${aiFirImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Crop Disease Detection Camp</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${rtihAmaravatiImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Soil Analysis Training – Guntur</div></div>
            </div>
          </div>
          <div className="gallery-folder-card" style={{ backgroundImage: `url(${ourMissionImg})` }} onClick={() => (window as any).showGalleryFolder('gfol-education', 'Education & Training')}>
            <span className="gallery-folder-name">Education & Training</span>
            <div id="gfol-education" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: `url(${ourVisionImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Teacher Training Camp – Hyderabad</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${ourValuesImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Student Hackathon – Vijayawada</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${ourJourneyImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Kids AI Camp – Bangalore</div></div>
            </div>
          </div>
          <div className="gallery-folder-card" style={{ backgroundImage: `url(${policehackImg})` }} onClick={() => (window as any).showGalleryFolder('gfol-volunteer', 'Volunteer Events')}>
            <span className="gallery-folder-name">Volunteer Events</span>
            <div id="gfol-volunteer" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: `url(${iit2Img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Volunteer Summit 2024</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${iit1Img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Driver AI Literacy – Chennai</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${iit3Img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">MSME AI Workshop – Pune</div></div>
            </div>
          </div>
          <div className="gallery-folder-card" style={{ backgroundImage: `url(${incuxLogoImg})` }} onClick={() => (window as any).showGalleryFolder('gfol-celebrations', 'Celebrations & Events')}>
            <span className="gallery-folder-name">Celebrations & Events</span>
            <div id="gfol-celebrations" className="gallery-folder-grid" style={{ display: 'none' }}>
              <div className="gallery-item" style={{ backgroundImage: `url(${iasClassesImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Annual Awards Night</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${rtihAmaravatiImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">Rural Connectivity Drive</div></div>
              <div className="gallery-item" style={{ backgroundImage: `url(${policehackImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="gallery-overlay">AI Showcase & Demo Day</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== GALLERY FOLDER DETAIL PAGE ========== */}
      <div id="gallery-detail" className="page" style={{ paddingTop: '75px' }}>
        <div className="topic-detail-header">
          <button className="btn-back" onClick={() => (window as any).showPage('gallery')}>← Back to Gallery</button>
          <h2 className="topic-detail-title" id="gallery-folder-name">Folder Name</h2>
          <p className="section-sub">Memories and snapshots from this event.</p>
        </div>
        <div className="gallery-folder-grid" id="gallery-detail-grid" style={{ display: 'grid', padding: '0 5% 3rem' }}>
          {/* Images injected here */}
        </div>
      </div>

      {/* ========== PROGRAMS PAGE ========== */}
      <div id="programs" className="page" style={{ paddingTop: '75px' }}>
        <section>
          <div className="section-header">
            <span className="section-tag">Programs</span>
            <h2 className="section-title">Our Initiatives</h2>
            <p className="section-sub">Structured programs designed to create lasting impact in communities across India.</p>
          </div>
        </section>
        <div className="h-programs-list">
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: `url(${iasClassesImg})` }}></div>
            <div className="h-program-body">
              <div className="h-program-title">Free IAS Classes</div>
              <div className="h-program-text">Conducted free 10-day IAS coaching at Hindu College for aspiring civil servants. Expert faculty covered General Studies, current affairs, and interview preparation to empower rural and underprivileged students with quality guidance. Students received study materials, mock tests, and one-on-one mentorship from experienced civil servants. Many participants cleared their preliminary exams and continue to receive guidance for their Mains preparation.</div>
              <div className="h-program-tags"><span className="program-tag">Civil Services</span><span className="program-tag">Free</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: `url(${iit2Img})` }}></div>
            <div className="h-program-body">
              <div className="h-program-title">SUN — Student for Nation</div>
              <div className="h-program-text">A student-driven movement that supports peer learning, community development, and nation-building. SUN empowers students through workshops, mentorship, and social initiatives to become responsible leaders of tomorrow. Regular sessions on leadership, public speaking, and social entrepreneurship are conducted across colleges. Students take up community projects like tree planting, digital literacy drives, and awareness campaigns in rural areas.</div>
              <div className="h-program-tags"><span className="program-tag">Students</span><span className="program-tag">Leadership</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: `url(${rtihAmaravatiImg})` }}></div>
            <div className="h-program-body">
              <div className="h-program-title">RTIH — Amaravati</div>
              <div className="h-program-text">Ratan Tata Innovation Hub Amaravati encourages youth by providing grants, mentorship, and incubation support for startups. It fosters innovation, entrepreneurship, and real-world problem solving among young innovators. Selected startups receive seed funding up to 5 lakhs, access to state-of-the-art labs, and guidance from industry veterans. Regular hackathons and innovation challenges are organized to identify and nurture promising ideas.</div>
              <div className="h-program-tags"><span className="program-tag">Innovation</span><span className="program-tag">Startup Grants</span></div>
            </div>
          </div>
          <div className="h-program-card">
            <div className="h-program-img" style={{ backgroundImage: `url(${policehackImg})` }}></div>
            <div className="h-program-body">
              <div className="h-program-title">Police Hackathon</div>
              <div className="h-program-text">A collaborative hackathon where students identified real-world policing challenges and built tech-driven solutions. From traffic management to crime analytics, students worked alongside police to create practical, impactful tools. Winning solutions included an AI-powered traffic violation detection system and a community policing app. The hackathon strengthened police-student relationships and led to the deployment of three prototypes in pilot districts.</div>
              <div className="h-program-tags"><span className="program-tag">Hackathon</span><span className="program-tag">Civic Tech</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== VOLUNTEER PUBLIC PAGE ========== */}
      <div id="volunteer" className="page" style={{ paddingTop: '75px' }}>
        {/* Volunteer Hero */}
        <div className="volunteer-hero">
          <div className="volunteer-hero-inner">
            <motion.div
              className="volunteer-circle"
              style={{ width: 300, height: 300, top: '1%', right: '2%', backgroundImage: `url(${ourJourneyImg})` }}
              animate={{ y: [0, -16] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
              whileHover={{ scale: 1.08 }}
            />
            <motion.div
              className="volunteer-circle"
              style={{ width: 280, height: 280, bottom: '2%', left: '2%', backgroundImage: `url(${iit3Img})` }}
              animate={{ y: [0, -16] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse', delay: 1.8 }}
              whileHover={{ scale: 1.08 }}
            />
            <motion.div
              className="volunteer-circle"
              style={{ width: 180, height: 180, top: '34%', left: '2%', backgroundImage: `url(${aiFirImg})` }}
              animate={{ y: [0, -14] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse', delay: 0.6 }}
              whileHover={{ scale: 1.08 }}
            />
            <motion.div
              className="volunteer-circle"
              style={{ width: 180, height: 180, top: '36%', right: '3%', backgroundImage: `url(${ourMissionImg})` }}
              animate={{ y: [0, -14] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse', delay: 2.4 }}
              whileHover={{ scale: 1.08 }}
            />
            <motion.div
              className="volunteer-circle"
              style={{ width: 100, height: 100, top: '6%', left: '10%', backgroundImage: `url(${ourVisionImg})` }}
              animate={{ y: [0, -12] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse', delay: 1.0 }}
              whileHover={{ scale: 1.08 }}
            />
            <motion.div
              className="volunteer-circle"
              style={{ width: 100, height: 100, bottom: '8%', right: '10%', backgroundImage: `url(${ourValuesImg})` }}
              animate={{ y: [0, -12] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse', delay: 3.2 }}
              whileHover={{ scale: 1.08 }}
            />
            <motion.div
              className="volunteer-circle"
              style={{ width: 120, height: 120, top: '14%', left: '22%', backgroundImage: `url(${ourJourneyImg})` }}
              animate={{ y: [0, -12] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse', delay: 1.5 }}
              whileHover={{ scale: 1.08 }}
            />
            <motion.div
              className="volunteer-circle"
              style={{ width: 120, height: 120, bottom: '15%', right: '22%', backgroundImage: `url(${iit1Img})` }}
              animate={{ y: [0, -12] }}
              transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse', delay: 0.3 }}
              whileHover={{ scale: 1.08 }}
            />
            <div className="volunteer-hero-content">
              <motion.span
                className="volunteer-badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                TAKE ACTION
              </motion.span>
              <motion.h1
                className="volunteer-hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join Us in Making a Difference
              </motion.h1>
              <motion.p
                className="volunteer-hero-desc"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Be part of our mission to make AI accessible to every Indian. Together, we can bridge the digital divide and empower communities through technology.
              </motion.p>
              <motion.div
                className="volunteer-hero-buttons"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button className="btn-volunteer-primary" onClick={() => (window as any).openSignUpModal()}>Volunteer Now</button>
                <button className="btn-volunteer-secondary" onClick={() => { const el = document.getElementById('vol-activities'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>Learn More</button>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Impact Header */}
        <section style={{ paddingBottom: '1rem' }}>
          <div className="section-header">
            <span className="section-tag">Volunteer Network</span>
            <h2 className="section-title">Our Volunteer Impact</h2>
            <p className="section-sub">Empowering communities across India through technology education</p>
          </div>
        </section>
        {/* Stats */}
        <div className="volunteer-stats" style={{ marginTop: '2rem' }}>
          <div className="vol-stat"><div className="vol-stat-num">5,247</div><div className="vol-stat-label">Total Volunteers</div></div>
          <div className="vol-stat"><div className="vol-stat-num">22</div><div className="vol-stat-label">States Covered</div></div>
          <div className="vol-stat"><div className="vol-stat-num">1.8L+</div><div className="vol-stat-label">Hours Volunteered</div></div>
          <div className="vol-stat"><div className="vol-stat-num">2L+</div><div className="vol-stat-label">Lives Impacted</div></div>
        </div>
        {/* Learn More - Volunteer Activities & Certificates */}
        <section id="vol-activities" className="vol-activities-section" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">Our Impact</span>
            <h2 className="section-title">Recent Volunteer Activities</h2>
            <p className="section-sub">From AI workshops to community outreach — our volunteers make a real difference</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'var(--glass)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🤖</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>AI Farmer Workshop — Guntur</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>50+ farmers trained on Plantix app and AI-powered crop disease detection tools. Volunteers conducted hands-on sessions in Telugu.</p>
              <div style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 Guntur, AP | 🗓 June 2025 | 👥 12 volunteers</div>
            </div>
            <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'var(--glass)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🏫</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>School AI Literacy Drive</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>AI literacy sessions for 200+ government school students covering ChatGPT, image generation, and prompt engineering basics.</p>
              <div style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 Vijayawada, AP | 🗓 June 2025 | 👥 8 volunteers</div>
            </div>
            <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'var(--glass)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>💼</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>MSME Digital AI Workshop</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>Small business owners trained on ChatGPT for marketing, Meta AI ads, and AI-powered customer engagement tools.</p>
              <div style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 Hyderabad, TG | 🗓 July 2025 | 👥 10 volunteers</div>
            </div>
          </div>

          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <h2 className="section-title">Certificates <span style={{ color: 'var(--secondary)' }}>Awarded</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏅</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#92400e' }}>AI Training Excellence</h4>
              <p style={{ fontSize: '0.8rem', color: '#78350f' }}>Awarded to 12 volunteers for outstanding AI workshop delivery</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#1e40af' }}>Community Outreach</h4>
              <p style={{ fontSize: '0.8rem', color: '#1e3a5f' }}>8 volunteers recognized for field outreach in rural communities</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#065f46' }}>Top Performer</h4>
              <p style={{ fontSize: '0.8rem', color: '#064e3b' }}>5 volunteers with highest impact hours this quarter</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📜</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#831843' }}>Digital Literacy</h4>
              <p style={{ fontSize: '0.8rem', color: '#6b0f3a' }}>25 volunteers certified in AI digital literacy training</p>
            </div>
          </div>
        </section>
      </div>

      {/* ========== CONTACT US PAGE ========== */}
      <div id="contact" className="page" style={{ paddingTop: '85px', background: 'var(--darker)', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Contact <span style={{ color: 'var(--secondary)' }}>Us</span></h2>
            <p className="section-sub">Have questions or want to collaborate? We'd love to hear from you.</p>
          </div>

          <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'stretch' }}>
            {/* Left Column — Info Cards */}
            <div className="contact-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '2rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <h3 className="card-title" style={{ fontSize: '1.3rem', marginBottom: '1.2rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  Our Headquarters
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '2' }}>
                   <strong style={{ color: 'var(--text)' }}>INCUXAI PRIVATE LIMITED</strong><br/>
                   134-1-317, Pandu Ranga Nagar, Muthyala Reddy Nagar,<br/>
                   Guntur, Andhra Pradesh 522034, India<br/>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                     <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                     info@incuxaieducationtrust.org
                   </span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                     <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                     +91 9494808589
                   </span>
                </p>
              </div>

              <div className="card" style={{ padding: '2rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <h3 className="card-title" style={{ fontSize: '1.3rem', marginBottom: '1.2rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-6 5 6h-4v4h-2z"/></svg>
                  Connect With Us
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Follow us on social media for the latest updates:</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href="https://www.instagram.com/incuxai/" target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', background: '#ffffff', border: '1.5px solid var(--glass-border)', color: '#e1306c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://linkedin.com/company/incuxai/posts/?feedView=all" target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', background: '#ffffff', border: '1.5px solid var(--glass-border)', color: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61590436827340" target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', background: '#ffffff', border: '1.5px solid var(--glass-border)', color: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                </div>
              </div>

              <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', borderRadius: '24px', color: '#fff' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'var(--font-display)' }}>Working Hours</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.8', opacity: '0.9' }}>
                  Monday — Friday: 9:00 AM — 6:00 PM<br/>
                  Saturday: 9:00 AM — 1:00 PM<br/>
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Right Column — Map */}
            <div className="contact-right">
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '32px', border: '1px solid var(--glass-border)', boxShadow: '0 15px 40px rgba(0,0,0,0.04)', height: '100%', minHeight: '450px', display: 'flex' }}>
                <iframe 
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=134-1-317+Pandu+Ranga+Nagar+Muthyala+Reddy+Nagar+Guntur+Andhra+Pradesh+522034&zoom=16" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: '24px', flex: 1, minHeight: '450px' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== CONTACT US PAGE ========== */}
      <div id="contact" className="page" style={{ paddingTop: '85px', background: 'var(--darker)', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Contact <span style={{ color: 'var(--secondary)' }}>Us</span></h2>
            <p className="section-sub">Have questions or want to collaborate? Reach out to us and we'll get back to you shortly.</p>
          </div>

          <div className="contact-grid">
            {/* Contact Form */}
            <div className="form-card" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <h3 className="card-title" style={{ fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--secondary)', display: 'inline-block', paddingBottom: '0.4rem' }}>Send Us a Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); (window as any).showToast('Thank you! Your message has been sent successfully.'); (e.target as HTMLFormElement).reset(); }} className="contact-form">
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>First Name</label>
                    <input type="text" required style={{ padding: '0.8rem 1.1rem', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '12px', outline: 'none', transition: 'border-color 0.3s' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Last Name</label>
                    <input type="text" required style={{ padding: '0.8rem 1.1rem', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '12px', outline: 'none', transition: 'border-color 0.3s' }} />
                  </div>
                </div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" required style={{ padding: '0.8rem 1.1rem', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '12px', outline: 'none', transition: 'border-color 0.3s' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Phone Number</label>
                    <input type="tel" style={{ padding: '0.8rem 1.1rem', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '12px', outline: 'none', transition: 'border-color 0.3s' }} />
                  </div>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Subject</label>
                  <input type="text" required style={{ padding: '0.8rem 1.1rem', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '12px', outline: 'none', transition: 'border-color 0.3s' }} />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Message</label>
                  <textarea rows={5} required style={{ padding: '0.8rem 1.1rem', background: '#ffffff', border: '1.5px solid var(--glass-border)', borderRadius: '12px', outline: 'none', transition: 'border-color 0.3s', resize: 'vertical' }}></textarea>
                </div>
                <button type="submit" className="btn-modern-primary" style={{ border: 'none', width: '100%' }}>Send Message</button>
              </form>
            </div>

            {/* Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Address card */}
              <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                <h4 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Our Headquarters</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
                  📍 INCUXAI PRIVATE LIMITED, 134-1-317, Pandu Ranga Nagar, Muthyala Reddy Nagar, Guntur, AP 522034<br/>
                  ✉ info@incuxaieducationtrust.org<br/>
                  📞 +91 9494808589
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Operating across 22 states with 5000+ local volunteers conducting weekend field courses.</p>
              </div>

              {/* Social links card */}
              <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                <h4 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Connect With Us</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>Follow our journey and updates on our official social media channels:</p>
                <div className="social-link-grid" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram" style={{ width: '45px', height: '45px', background: '#ffffff', border: '1.5px solid var(--glass-border)', color: '#e1306c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link linkedin" style={{ width: '45px', height: '45px', background: '#ffffff', border: '1.5px solid var(--glass-border)', color: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                   <a href="https://wa.me/919494808589" target="_blank" rel="noopener noreferrer" className="social-link whatsapp" style={{ width: '45px', height: '45px', background: '#ffffff', border: '1.5px solid var(--glass-border)', color: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.022-5.127-2.885-7c-1.863-1.874-4.343-2.905-6.994-2.906-5.49 0-9.953 4.429-9.957 9.884-.002 1.714.453 3.39 1.32 4.887l-.994 3.634 3.73-.974zm12.002-6.852c-.274-.136-1.62-.801-1.871-.892-.252-.09-.435-.136-.617.136-.183.272-.708.89-.867 1.072-.16.182-.32.205-.594.069-.275-.136-1.16-.427-2.209-1.364-.817-.73-1.368-1.63-1.528-1.905-.16-.273-.017-.421.12-.557.123-.122.274-.32.41-.48.138-.16.183-.273.275-.455.092-.182.046-.341-.023-.477-.068-.136-.617-1.485-.845-2.03-.22-.533-.48-.46-.617-.466-.123-.006-.275-.007-.426-.007-.152 0-.401.057-.61.284-.21.227-.8.781-.8 1.904 0 1.124.816 2.207.93 2.36.114.152 1.606 2.451 3.89 3.435.543.233.967.373 1.3.479.546.173 1.042.149 1.433.09.437-.066 1.62-.662 1.849-1.3.23-.637.23-1.182.16-1.3-.069-.117-.251-.183-.526-.32z"/></svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube" style={{ width: '45px', height: '45px', background: '#ffffff', border: '1.5px solid var(--glass-border)', color: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'all 0.3s' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div style={{ marginTop: '3rem', background: '#ffffff', padding: '1rem', borderRadius: '32px', border: '1px solid var(--glass-border)', boxShadow: '0 15px 40px rgba(0,0,0,0.04)' }}>
            <iframe 
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=134-1-317+Pandu+Ranga+Nagar+Muthyala+Reddy+Nagar+Guntur+Andhra+Pradesh+522034&zoom=16" 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '24px', display: 'block' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* ========== VOLUNTEER PORTAL ========== */}
      <div id="vol-portal" className="page">
        <div className="portal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--primary)' }}>Volunteer Portal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Welcome back, <span id="portal-name" style={{ color: 'var(--primary)', fontWeight: '700' }}></span></p>
          </div>
          <div className="portal-user">
            <div className="avatar" id="portal-avatar">V</div>
            <div>
              <div style={{ fontWeight: '700' }} id="portal-fullname">Volunteer</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} id="portal-dept-display">Department</div>
            </div>
          </div>
        </div>
        <div className="portal-nav">
          <button className="portal-nav-btn active" onClick={(e) => (window as any).showPortalSection('vol-dashboard', e)}>Dashboard</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-events', e)}>Events</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-history', e)}>My History</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-tasks', e)}>My Tasks</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-attendance', e)}>Attendance</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-progress', e)}>My Progress</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-courses', e)}>Courses</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-quiz', e)}>Quizzes</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('st-leaderboard', e)}>Leaderboard</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showPortalSection('vol-profile', e)}>Profile</button>
        </div>

        {/* Dashboard */}
        <div id="vol-dashboard" className="portal-section">
          <div className="hours-display">
            <div className="hours-box"><div className="hours-num" id="total-hours">47</div><div className="hours-label">Total Hours</div></div>
            <div className="hours-box"><div className="hours-num">3</div><div className="hours-label">Events Attended</div></div>
            <div className="hours-box"><div className="hours-num">2</div><div className="hours-label">Upcoming Events</div></div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>Recent Activities</h3>
          <div className="task-card"><div className="task-title">Farmer Workshop – Guntur</div><div className="task-desc">Completed 3-day AI training session. Helped 50+ farmers understand crop disease AI tools.</div><div className="task-footer"><span className="task-due">12 hours earned</span><span className="badge badge-green">Completed</span></div></div>
          <div className="task-card"><div className="task-title">School Visit – Vijayawada</div><div className="task-desc">AI literacy session for class 8-10 students. Covered ChatGPT, image generation basics.</div><div className="task-footer"><span className="task-due">8 hours earned</span><span className="badge badge-green">Completed</span></div></div>
        </div>

        {/* Events */}
        <div id="vol-events" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', margin: '0 0 0.5rem' }}>Upcoming Events</h3>
          <div className="events-grid" id="vol-events-list">
            <div className="event-card"><div className="event-date-bar"><span>June 15, 2025</span><span>Vijayawada</span></div><div className="event-body"><div className="event-title">AI for Farmers Workshop</div><div className="event-dept">Department: <span>AI Training & Education</span></div><div className="event-slots">8 slots remaining</div><button className="btn-register-event" onClick={(e) => (window as any).registerEvent(e.currentTarget)}>Register for This Event</button></div></div>
            <div className="event-card"><div className="event-date-bar"><span>June 22, 2025</span><span>Guntur</span></div><div className="event-body"><div className="event-title">School AI Literacy Drive</div><div className="event-dept">Department: <span>Field Outreach</span></div><div className="event-slots">15 slots remaining</div><button className="btn-register-event" onClick={(e) => (window as any).registerEvent(e.currentTarget)}>Register for This Event</button></div></div>
            <div className="event-card"><div className="event-date-bar"><span>July 1, 2025</span><span>Hyderabad</span></div><div className="event-body"><div className="event-title">MSME Digital AI Workshop</div><div className="event-dept">Department: <span>Content Creation</span></div><div className="event-slots">5 slots remaining</div><button className="btn-register-event" onClick={(e) => (window as any).registerEvent(e.currentTarget)}>Register for This Event</button></div></div>
          </div>
        </div>

        {/* History */}
        <div id="vol-history" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>My Event Participations</h3>
          <table className="data-table">
            <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Farmer AI Workshop</td><td>Mar 10, 2025</td><td>Guntur</td><td>12 hrs</td><td><span className="badge badge-green">Attended</span></td></tr>
              <tr><td>School Visit Program</td><td>Apr 5, 2025</td><td>Vijayawada</td><td>8 hrs</td><td><span className="badge badge-green">Attended</span></td></tr>
              <tr><td>MSME Workshop</td><td>Apr 20, 2025</td><td>Visakhapatnam</td><td>6 hrs</td><td><span className="badge badge-green">Attended</span></td></tr>
              <tr><td>AI for Drivers Camp</td><td>May 10, 2025</td><td>Hyderabad</td><td>–</td><td><span className="badge badge-orange">Absent</span></td></tr>
            </tbody>
          </table>
          <div className="hours-display" style={{ marginTop: '1.5rem' }}>
            <div className="hours-box"><div className="hours-num">47</div><div className="hours-label">Total Hours Logged</div></div>
            <div className="hours-box"><div className="hours-num">3</div><div className="hours-label">Completed Events</div></div>
            <div className="hours-box"><div className="hours-num">Level 2</div><div className="hours-label">Volunteer Rank</div></div>
          </div>
        </div>

        {/* Tasks */}
        <div id="vol-tasks" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>Tasks Assigned to Me</h3>
          <div id="vol-tasks-list">
            <div className="task-card"><div className="task-title">Create Hindi content for AI Farming module</div><div className="task-desc">Write 500-word introduction about how farmers can use AI on their smartphones. Include 3 practical examples.</div><div className="task-footer"><span className="task-due">Due: June 10, 2025</span><button className="btn-task-done" onClick={(e) => (window as any).markTaskDone(e.currentTarget)}>Mark Done</button></div></div>
            <div className="task-card"><div className="task-title">Prepare attendance report for Guntur workshop</div><div className="task-desc">Compile attendance from the March 10 event and share the Excel sheet with the coordinator.</div><div className="task-footer"><span className="task-due">Due: June 7, 2025</span><button className="btn-task-done" onClick={(e) => (window as any).markTaskDone(e.currentTarget)}>Mark Done</button></div></div>
            <div className="task-card"><div className="task-title">Social media posts for July event</div><div className="task-desc">Create 5 Instagram/WhatsApp post designs promoting the upcoming MSME Digital AI Workshop.</div><div className="task-footer"><span className="task-due">Due: June 25, 2025</span><button className="btn-task-done" onClick={(e) => (window as any).markTaskDone(e.currentTarget)}>Mark Done</button></div></div>
          </div>
        </div>

        {/* Attendance */}
        <div id="vol-attendance" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>My Attendance Record</h3>
          <table className="data-table">
            <thead><tr><th>Event</th><th>Date</th><th>Check-in Time</th><th>Check-out Time</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Farmer AI Workshop</td><td>Mar 10</td><td>9:00 AM</td><td>9:00 PM</td><td>12</td><td><span className="badge badge-green">Present</span></td></tr>
              <tr><td>School Visit</td><td>Apr 5</td><td>10:00 AM</td><td>6:00 PM</td><td>8</td><td><span className="badge badge-green">Present</span></td></tr>
              <tr><td>MSME Workshop</td><td>Apr 20</td><td>11:00 AM</td><td>5:00 PM</td><td>6</td><td><span className="badge badge-green">Present</span></td></tr>
              <tr><td>AI Drivers Camp</td><td>May 10</td><td>–</td><td>–</td><td>0</td><td><span className="badge badge-orange">Absent</span></td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Overall Attendance Rate</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: '75%' }}></div></div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.3rem', fontWeight: '700' }}>75% (3 of 4 events)</div>
          </div>
        </div>

        {/* Donations */}


        {/* ========== MERGED STUDENT SECTIONS ========== */}
        <div id="st-progress" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>My Progress</h3>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.85rem' }}>
            Complete AI 4 ALL course modules to track your progress here.
          </div>
        </div>

        <div id="st-courses" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>All Modules</h3>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.85rem' }}>
            Course modules will be available once you start learning. Visit the AI 4 ALL page to begin.
          </div>
        </div>

        <div id="st-quiz" className="portal-section">
          <div className="student-quiz">
            <div className="quiz-header"><div className="quiz-title">Daily Quiz Challenge</div><div className="quiz-score" id="quiz-score-display">Score: 0</div></div>
            <div id="quiz-container"></div>
          </div>
        </div>

        <div id="st-leaderboard" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>Top Learners This Month</h3>
          <div className="leaderboard">
            {/* Filled dynamically by window.renderVolunteersAndLeaderboard() */}
          </div>
        </div>

        {/* Settings - Change Password */}
        <div id="vol-profile" className="portal-section active">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>My Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div id="vol-profile-photo" style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff', fontWeight: '700', overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '3px solid var(--glass-border)' }} onClick={() => document.getElementById('vol-photo-input')?.click()}>
                <span id="vol-profile-photo-text">V</span>
                <img id="vol-profile-photo-img" style={{ display: 'none', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} alt="Profile" />
              </div>
              <input type="file" id="vol-photo-input" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { const img = document.getElementById('vol-profile-photo-img') as HTMLImageElement; const txt = document.getElementById('vol-profile-photo-text'); if (img && txt) { img.src = ev.target?.result as string; img.style.display = 'block'; txt.style.display = 'none'; localStorage.setItem('vol_profile_photo_' + (window as any).currentUserEmail, ev.target?.result as string); } }; reader.readAsDataURL(file); } }} />
              <button className="btn-small" onClick={() => document.getElementById('vol-photo-input')?.click()} style={{ fontSize: '0.78rem', padding: '0.3rem 0.8rem', marginTop: '0.3rem' }}>Change Photo</button>
            </div>
            <div>
              <div className="card" style={{ padding: '1.5rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Full Name</label>
                    <input type="text" id="vol-profile-name" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Email</label>
                    <input type="email" id="vol-profile-email" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%', background: '#f5f5f5' }} readOnly />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Phone</label>
                    <input type="tel" id="vol-profile-phone" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Education</label>
                    <input type="text" id="vol-profile-education" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>About / Why I Volunteer</label>
                  <textarea id="vol-profile-about" rows={2} style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%', resize: 'vertical' }}></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                  <button className="btn-submit" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={() => (window as any).saveVolunteerProfile()}>Save Changes</button>
                  <button className="btn-submit" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', background: 'var(--text-muted)' }} onClick={() => { document.getElementById('vol-profile-password-section')!.style.display = document.getElementById('vol-profile-password-section')!.style.display === 'none' ? 'block' : 'none'; }}>Change Password</button>
                </div>
                <div id="vol-profile-password-section" style={{ display: 'none', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text)' }}>Change Password</h4>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Current Password</label>
                    <input type="password" id="vol-current-pass" placeholder="Enter current password" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>New Password</label>
                    <input type="password" id="vol-new-pass" placeholder="Enter new password" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <button className="btn-submit" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => (window as any).changeVolunteerPassword()}>Update Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== TEACHER PORTAL ========== */}
      <div id="teacher-portal" className="page">
        <div className="portal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--success)' }}>Teacher Portal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Welcome back, <span id="tportal-name" style={{ color: 'var(--success)', fontWeight: '700' }}></span></p>
          </div>
          <div className="portal-user">
            <div className="avatar" id="tportal-avatar" style={{ background: 'linear-gradient(135deg,var(--success),var(--primary))' }}>T</div>
            <div>
              <div style={{ fontWeight: '700' }} id="tportal-fullname">Teacher</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>TeachXai Educator</div>
            </div>
          </div>
        </div>
        <div className="portal-nav">
          <button className="portal-nav-btn" onClick={(e) => (window as any).showTportalSection('tportal-dashboard', e)}>Dashboard</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showTportalSection('tportal-classes', e)}>My Classes</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showTportalSection('tportal-tasks', e)}>Assignments</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showTportalSection('tportal-attendance', e)}>Attendance</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showTportalSection('tportal-courses', e)}>Courses</button>
          <button className="portal-nav-btn active" onClick={(e) => (window as any).showTportalSection('tportal-profile', e)}>Profile</button>
        </div>

        {/* Dashboard */}
        <div id="tportal-dashboard" className="portal-section">
          <div className="hours-display">
            <div className="hours-box"><div className="hours-num" id="tportal-hours">0</div><div className="hours-label">Hours Taught</div></div>
            <div className="hours-box"><div className="hours-num" id="tportal-upcoming">0</div><div className="hours-label">Upcoming Classes</div></div>
            <div className="hours-box"><div className="hours-num" id="tportal-assigned">0</div><div className="hours-label">Assigned Lessons</div></div>
            <div className="hours-box"><div className="hours-num" id="tportal-att-pct">0%</div><div className="hours-label">Attendance</div></div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--success)', fontSize: '1rem', marginBottom: '1rem' }}>Your Recent Activity</h3>
          <div id="tportal-recent-activity"><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent activity yet.</p></div>
        </div>

        {/* My Classes */}
        <div id="tportal-classes" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--success)', fontSize: '1rem', marginBottom: '1rem' }}>Upcoming & Past Classes</h3>
          <div id="tportal-classes-list"><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No classes yet.</p></div>
        </div>

        {/* Assignments */}
        <div id="tportal-tasks" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--success)', fontSize: '1rem', marginBottom: '1rem' }}>Assigned Lessons</h3>
          <div id="tportal-tasks-list"><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No assignments yet.</p></div>
        </div>

        {/* Attendance */}
        <div id="tportal-attendance" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--success)', fontSize: '1rem', marginBottom: '1rem' }}>Your Attendance</h3>
          <div id="tportal-attendance-list"><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No attendance records yet.</p></div>
        </div>

        {/* Courses */}
        <div id="tportal-courses" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--success)', fontSize: '1rem', marginBottom: '1rem' }}>Suggested Courses for You</h3>
          <div id="tportal-courses-list"><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Courses will be suggested based on your registered subjects.</p></div>
        </div>

        {/* Settings - Change Password */}
        <div id="tportal-profile" className="portal-section active">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--success)', marginBottom: '1.5rem' }}>My Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div id="tch-profile-photo" style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--success),var(--primary))', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff', fontWeight: '700', overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '3px solid var(--glass-border)' }} onClick={() => document.getElementById('tch-photo-input')?.click()}>
                <span id="tch-profile-photo-text">T</span>
                <img id="tch-profile-photo-img" style={{ display: 'none', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} alt="Profile" />
              </div>
              <input type="file" id="tch-photo-input" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { const img = document.getElementById('tch-profile-photo-img') as HTMLImageElement; const txt = document.getElementById('tch-profile-photo-text'); if (img && txt) { img.src = ev.target?.result as string; img.style.display = 'block'; txt.style.display = 'none'; localStorage.setItem('tch_profile_photo_' + (window as any).currentUserEmail, ev.target?.result as string); } }; reader.readAsDataURL(file); } }} />
              <button className="btn-small" onClick={() => document.getElementById('tch-photo-input')?.click()} style={{ fontSize: '0.78rem', padding: '0.3rem 0.8rem', marginTop: '0.3rem' }}>Change Photo</button>
            </div>
            <div>
              <div className="card" style={{ padding: '1.5rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Full Name</label>
                    <input type="text" id="tch-profile-name" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Email</label>
                    <input type="email" id="tch-profile-email" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%', background: '#f5f5f5' }} readOnly />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Phone</label>
                    <input type="tel" id="tch-profile-phone" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Education</label>
                    <input type="text" id="tch-profile-education" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Subjects</label>
                    <input type="text" id="tch-profile-subjects" placeholder="Comma separated" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Languages</label>
                    <input type="text" id="tch-profile-languages" placeholder="Comma separated" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                  <button className="btn-submit" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={() => (window as any).saveTeacherProfile()}>Save Changes</button>
                  <button className="btn-submit" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', background: 'var(--text-muted)' }} onClick={() => { document.getElementById('tch-profile-password-section')!.style.display = document.getElementById('tch-profile-password-section')!.style.display === 'none' ? 'block' : 'none'; }}>Change Password</button>
                </div>
                <div id="tch-profile-password-section" style={{ display: 'none', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text)' }}>Change Password</h4>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Current Password</label>
                    <input type="password" id="tch-current-pass" placeholder="Enter current password" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>New Password</label>
                    <input type="password" id="tch-new-pass" placeholder="Enter new password" style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--glass-border)', borderRadius: '8px', outline: 'none', width: '100%' }} />
                  </div>
                  <button className="btn-submit" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => (window as any).changeTeacherPassword()}>Update Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== ADMIN PORTAL ========== */}
      <div id="admin-portal" className="page">
        <div className="portal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--secondary)' }}>Admin Portal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full system control</p>
          </div>
          <div className="portal-user">
            <div className="avatar" style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>A</div>
            <div><div style={{ fontWeight: '700' }}>Admin</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Super Admin</div></div>
          </div>
        </div>
        <div className="portal-nav">
          <button className="portal-nav-btn active" onClick={(e) => (window as any).showAdminSection('admin-overview', e)}>Overview</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-events', e)}>Events</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-registrations', e)}>Registrations</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-attendance', e)}>Attendance</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-vol-apps', e)}>Vol Apps</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-volunteers', e)}>Volunteers</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-tasks', e)}>Assign Tasks</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-leaderboard', e)}>Leaderboard</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-content', e)}>AI4ALL Content</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-teachxai', e)}>TeachXai</button>
          <button className="portal-nav-btn" onClick={(e) => (window as any).showAdminSection('admin-analytics', e)}>Analytics</button>
        </div>

        {/* Overview */}
        <div id="admin-overview" className="portal-section active">
          <div className="admin-grid" id="admin-metrics-grid">
            <div className="admin-metric"><div className="admin-metric-num" id="total-vols-count">0</div><div className="admin-metric-label">Total Volunteers</div></div>
            <div className="admin-metric"><div className="admin-metric-num" id="total-events-count">0</div><div className="admin-metric-label">Total Events</div></div>
            <div className="admin-metric"><div className="admin-metric-num" id="total-hours-count">0</div><div className="admin-metric-label">Volunteer Hours</div></div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Recent Registrations</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>State</th><th>Department</th><th>Registered</th></tr></thead>
            <tbody id="admin-recent-vols">
            </tbody>
          </table>
        </div>

        {/* Admin Events */}
        <div id="admin-events" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Create New Event</h3>
          <div className="create-event-form">
            <div className="form-row">
              <div className="form-group"><label>Event Title</label><input type="text" id="ev-title" placeholder="e.g. Farmer AI Workshop" /></div>
              <div className="form-group"><label>Date</label><input type="date" id="ev-date" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Location</label><input type="text" id="ev-location" placeholder="City, State" /></div>
              <div className="form-group"><label>Max Volunteers</label><input type="number" id="ev-slots" placeholder="50" /></div>
            </div>
            <div className="form-group">
              <label>Required Departments</label>
              <div className="dept-grid" id="admin-dept-select">
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>AI Training</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Field Outreach</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Content Creation</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Event Management</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Technology</div>
                <div className="dept-item" onClick={(e) => (window as any).toggleDept(e.currentTarget)}><div className="dept-check">✓</div>Social Media</div>
              </div>
            </div>
            <div className="form-group"><label>Description</label><textarea id="ev-desc" rows={3} placeholder="Event details..." style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'Inter', outline: 'none', resize: 'vertical' }}></textarea></div>
            <button className="btn-submit" onClick={() => (window as any).createEvent()}>Create Event</button>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>All Events</h3>
          <table className="data-table" id="admin-events-table">
            <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Registered</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>Farmer AI Workshop</td><td>Jun 15</td><td>Vijayawada</td><td>42/50</td><td><span className="badge badge-blue">Open</span></td><td><button className="btn-small btn-danger-small" onClick={(e) => (window as any).deleteEventRow(e.currentTarget)}>Delete</button></td></tr>
              <tr><td>School Literacy Drive</td><td>Jun 22</td><td>Guntur</td><td>35/60</td><td><span className="badge badge-blue">Open</span></td><td><button className="btn-small btn-danger-small" onClick={(e) => (window as any).deleteEventRow(e.currentTarget)}>Delete</button></td></tr>
            </tbody>
          </table>
        </div>

        {/* Event Registrations */}
        <div id="admin-registrations" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Event Registrations</h3>
          <table className="data-table">
            <thead><tr><th>Volunteer Name</th><th>Email</th><th>Event</th><th>Registered On</th></tr></thead>
            <tbody id="admin-registrations-body">
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading...</td></tr>
            </tbody>
          </table>
        </div>

        {/* Attendance */}
        <div id="admin-attendance" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Mark Attendance</h3>
          <div className="attendance-controls">
            <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
              <label>Select Event</label>
              <select id="attendance-event-select">
                <option value="">-- Select an event --</option>
              </select>
            </div>
            <table className="data-table attendance-table">
              <thead><tr><th>Volunteer</th><th>Event</th><th>Mark Attendance</th></tr></thead>
              <tbody id="attendance-table-body">
                <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Select an event to view volunteers</td></tr>
              </tbody>
            </table>
            <button className="btn-submit" style={{ maxWidth: '200px', marginTop: '1rem' }} id="save-attendance-btn" onClick={() => (window as any).saveAttendance()}>Save Attendance</button>
          </div>
        </div>

        {/* Volunteer Applications */}
        <div id="admin-vol-apps" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Volunteer Applications <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(<span id="admin-vol-apps-count">0</span> pending)</span></h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Education</th><th>Action</th></tr></thead>
            <tbody id="admin-vol-apps-body"></tbody>
          </table>
        </div>

        {/* Volunteers */}
        <div id="admin-volunteers" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>All Volunteers</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>State</th><th>Dept</th><th>Hours</th><th>Status</th></tr></thead>
            <tbody>
              {/* Populated dynamically by renderVolunteersAndLeaderboard() */}
            </tbody>
          </table>
        </div>

        {/* Assign Tasks */}
        <div id="admin-tasks" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Assign Work to Volunteers</h3>
          <div className="create-event-form">
            <div className="assign-row">
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <label>Select Volunteer</label>
                <select id="assign-vol">
                  <option value="">No volunteers available</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1, margin: 0 }}><label>Task Title</label><input type="text" id="task-title" placeholder="e.g. Create Hindi content" /></div>
            </div>
            <div className="assign-row">
              <div className="form-group" style={{ flex: 1, margin: 0 }}><label>Description</label><textarea id="task-desc" rows={2} placeholder="Task details..."></textarea></div>
              <div className="form-group" style={{ flex: 0.4, margin: 0 }}><label>Due Date</label><input type="date" id="task-due" /></div>
            </div>
            <button className="btn-submit" onClick={() => (window as any).assignTask()}>Assign Task</button>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Assigned Tasks</h3>
          <div id="assigned-tasks-list">
          </div>
        </div>

        {/* Admin Leaderboard */}
        <div id="admin-leaderboard" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Volunteer Activities & Leaderboard</h3>
          <div className="leaderboard" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Filled dynamically by window.renderVolunteersAndLeaderboard() */}
          </div>
        </div>

        {/* Content Editor */}
        <div id="admin-content" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Edit AI 4 ALL Page Content</h3>
          <div id="content-editor-list"></div>
        </div>

        {/* Analytics */}
        <div id="admin-analytics" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>Content & Learning Analytics</h3>
          <div className="analytics-grid" id="analytics-grid"></div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', margin: '1.5rem 0 1rem' }}>Top Performers</h3>
          <table className="data-table">
            <thead><tr><th>Volunteer</th><th>Hours Logged</th><th>Events Attended</th><th>Tasks Completed</th></tr></thead>
            <tbody id="analytics-performers">
            </tbody>
          </table>
        </div>

        {/* TeachXai Management */}
        <div id="admin-teachxai" className="portal-section">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', fontSize: '1rem', marginBottom: '1rem' }}>TeachXai - Educator Management</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div className="admin-metric" style={{ flex: '1', minWidth: '120px' }}><div className="admin-metric-num" id="tx-pending-count">0</div><div className="admin-metric-label">Pending</div></div>
            <div className="admin-metric" style={{ flex: '1', minWidth: '120px' }}><div className="admin-metric-num" id="tx-approved-count">0</div><div className="admin-metric-label">Approved</div></div>
            <div className="admin-metric" style={{ flex: '1', minWidth: '120px' }}><div className="admin-metric-num" id="tx-lessons-count">0</div><div className="admin-metric-label">Lessons Taught</div></div>
          </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-submit" style={{ flex: 1, padding: '0.6rem', minWidth: '100px' }} onClick={() => (window as any).showTxTab('pending', event)}>Pending</button>
            <button className="btn-submit" style={{ flex: 1, padding: '0.6rem', minWidth: '100px', background: 'var(--success)' }} onClick={() => (window as any).showTxTab('approved', event)}>Educators</button>
            <button className="btn-submit" style={{ flex: 1, padding: '0.6rem', minWidth: '100px', background: 'var(--primary)' }} onClick={() => (window as any).showTxTab('lessons', event)}>Lessons</button>
            <button className="btn-submit" style={{ flex: 1, padding: '0.6rem', minWidth: '100px', background: '#6b7280' }} onClick={() => (window as any).showTxTab('attendance', event)}>Attendance</button>
            <button className="btn-submit" style={{ flex: 1, padding: '0.6rem', minWidth: '100px', background: 'linear-gradient(135deg,var(--secondary),var(--primary))' }} onClick={() => (window as any).showTxTab('stats', event)}>Stats</button>
          </div>

          <div id="tx-pending-panel">
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Pending Applications</h4>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Education</th><th>Subjects</th><th>Experience</th><th>Action</th></tr></thead>
              <tbody id="tx-pending-table"></tbody>
            </table>
          </div>

          <div id="tx-approved-panel" style={{ display: 'none' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Approved Educators</h4>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Subjects</th><th>Languages</th><th>Assigned Lessons</th><th>Action</th></tr></thead>
              <tbody id="tx-approved-table"></tbody>
            </table>
          </div>

          <div id="tx-lessons-panel" style={{ display: 'none' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Taught Lessons</h4>
            <table className="data-table">
              <thead><tr><th>Educator</th><th>Lesson Title</th><th>Subject</th><th>Date</th><th>Status</th></tr></thead>
              <tbody id="tx-lessons-table"></tbody>
            </table>
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#fafafa', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--secondary)' }}>Assign New Lesson</h4>
              <div className="assign-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '180px' }}>
                  <label>Select Educator</label>
                  <select id="tx-lesson-educator"><option value="">-- Select --</option></select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '180px' }}>
                  <label>Lesson Title</label>
                  <input type="text" id="tx-lesson-title" placeholder="e.g. Intro to AI" />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '180px' }}>
                  <label>Subject</label>
                  <input type="text" id="tx-lesson-subject" placeholder="e.g. Machine Learning" />
                </div>
                <div className="form-group" style={{ flex: 0.4, minWidth: '120px' }}>
                  <label>Date</label>
                  <input type="date" id="tx-lesson-date" />
                </div>
              </div>
              <button className="btn-submit" style={{ marginTop: '0.75rem' }} onClick={() => (window as any).assignTxLesson()}>Assign Lesson</button>
            </div>
          </div>

          {/* Teacher Attendance */}
          <div id="tx-attendance-panel" style={{ display: 'none' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Teacher Attendance</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '180px' }}>
                <label>Select Educator</label>
                <select id="tx-att-educator"><option value="">-- Select --</option></select>
              </div>
              <div className="form-group" style={{ flex: 0.4, minWidth: '120px' }}>
                <label>Date</label>
                <input type="date" id="tx-att-date" />
              </div>
              <div className="form-group" style={{ flex: 0.4, minWidth: '120px' }}>
                <label>Status</label>
                <select id="tx-att-status"><option value="Present">Present</option><option value="Absent">Absent</option><option value="Leave">Leave</option></select>
              </div>
              <button className="btn-submit" style={{ padding: '0.6rem 1.5rem', height: 'fit-content' }} onClick={() => (window as any).markTxAttendance()}>Mark Attendance</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Educator</th><th>Date</th><th>Status</th></tr></thead>
              <tbody id="tx-attendance-table"></tbody>
            </table>
          </div>

          {/* Teacher Stats */}
          <div id="tx-stats-panel" style={{ display: 'none' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Teacher Statistics</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div className="admin-metric" style={{ flex: 1, minWidth: '120px' }}><div className="admin-metric-num" id="tx-stats-total">0</div><div className="admin-metric-label">Total Teachers</div></div>
              <div className="admin-metric" style={{ flex: 1, minWidth: '120px' }}><div className="admin-metric-num" id="tx-stats-active">0</div><div className="admin-metric-label">Active Teachers</div></div>
              <div className="admin-metric" style={{ flex: 1, minWidth: '120px' }}><div className="admin-metric-num" id="tx-stats-att-rate">0%</div><div className="admin-metric-label">Attendance Rate</div></div>
              <div className="admin-metric" style={{ flex: 1, minWidth: '120px' }}><div className="admin-metric-num" id="tx-stats-total-lessons">0</div><div className="admin-metric-label">Total Lessons</div></div>
            </div>
            <table className="data-table">
              <thead><tr><th>Teacher</th><th>Email</th><th>Lessons Taught</th><th>Present</th><th>Absent</th><th>Attendance %</th></tr></thead>
              <tbody id="tx-stats-table"></tbody>
            </table>
          </div>
        </div>
      </div>



      {/* ========== LOGIN MODAL ========== */}
      <div className="modal-overlay" id="login-modal">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeModal()}>✕</button>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700' }}>Welcome Back</h2>
          </div>
          <div className="modal-tabs">
            <button className="modal-tab active" onClick={(e) => (window as any).switchTab('volunteer-tab', e)}>Volunteer</button>
            <button className="modal-tab" onClick={(e) => (window as any).switchTab('teacher-tab', e)}>Teacher</button>
            <button className="modal-tab" onClick={(e) => (window as any).switchTab('admin-tab', e)}>Admin</button>
          </div>
          {/* Volunteer Login */}
          <div className="modal-form active" id="volunteer-tab">
            <div className="form-group"><label>Email</label><input type="email" id="vol-login-email" placeholder="your@email.com" /></div>
            <div className="form-group"><label>Password</label><input type="password" id="vol-login-pass" placeholder="••••••••" /></div>
            <button className="btn-submit" onClick={() => (window as any).loginUser('volunteer')}>Login</button>
          </div>
          {/* Teacher Login */}
          <div className="modal-form" id="teacher-tab">
            <div className="form-group"><label>Email</label><input type="email" id="tch-login-email" placeholder="your@email.com" /></div>
            <div className="form-group"><label>Password</label><input type="password" id="tch-login-pass" placeholder="••••••••" /></div>
            <button className="btn-submit" onClick={() => (window as any).loginUser('teacher')} style={{ background: 'linear-gradient(135deg,var(--success),var(--primary))' }}>Login as Teacher</button>
          </div>
          {/* Admin Login */}
          <div className="modal-form" id="admin-tab">
            <div className="form-group"><label>Admin Email</label><input type="email" id="ad-login-email" placeholder="Enter admin email" /></div>
            <div className="form-group"><label>Admin Password</label><input type="password" id="ad-login-pass" placeholder="••••••••" /></div>
            <button className="btn-submit" onClick={() => (window as any).loginUser('admin')} style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))' }}>Login as Admin</button>
          </div>
          {/* Success */}
          <div className="modal-success" id="modal-success">
            <h3>Login Successful!</h3>
            <p id="success-msg">Redirecting to your portal...</p>
          </div>
        </div>
      </div>

      {/* ========== VOLUNTEER APPLICATION MODAL ========== */}
      <div className="modal-overlay" id="signup-modal">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeSignUpModal()}>✕</button>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '700' }}>Volunteer Application</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Submit your details — an admin will review and approve your application.</p>
          </div>

          <div className="modal-form active" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Full Name <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" placeholder="Enter your full name" id="vol-app-fname" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', width: '100%' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Mobile Number <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="tel" placeholder="+91 XXXXXXXXXX" id="vol-app-phone" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', width: '100%' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Email Address <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="email" placeholder="yourname@email.com" id="vol-app-email" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', width: '100%' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Education Qualification <span style={{ color: '#dc2626' }}>*</span></label>
              <select id="vol-app-education" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', width: '100%', background: '#fff' }}>
                <option value="">Select your qualification</option>
                <option>High School</option><option>Intermediate / Diploma</option>
                <option>Bachelor's Degree</option><option>Master's Degree</option>
                <option>PhD</option><option>Other</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Why do you want to volunteer? <span style={{ color: '#dc2626' }}>*</span></label>
              <textarea rows={3} placeholder="Tell us about your motivation..." id="vol-app-why" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', resize: 'vertical', width: '100%' }}></textarea>
            </div>
            <button className="btn-submit" onClick={() => (window as any).submitVolunteerApplication()} style={{ padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem', width: '100%' }}>Submit Application</button>
          </div>
        </div>
      </div>

      {/* ========== TEACHXAI PAGE ========== */}
      <div id="teachxai" className="page">
        <section className="teachxai-section">
          <div className="section-header">
            <span className="section-tag">Teach with Us</span>
            <h2 className="section-title">Become a <span style={{ color: 'var(--secondary)' }}>TeachXai</span> Educator</h2>
            <p className="section-sub">Share your knowledge and help us make AI education accessible to every Indian</p>
          </div>
          <div className="teachxai-form-container">
            <form className="teachxai-form" onSubmit={(e) => { e.preventDefault(); (window as any).submitTeachXai(); }}>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Full Name <span style={{ color: '#dc2626' }}>*</span></label>
                  <input type="text" id="tx-name" placeholder="Enter your full name" required style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', transition: 'border-color 0.3s', width: '100%' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Email Address <span style={{ color: '#dc2626' }}>*</span></label>
                  <input type="email" id="tx-email" placeholder="your@email.com" required style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', transition: 'border-color 0.3s', width: '100%' }} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Phone Number <span style={{ color: '#dc2626' }}>*</span></label>
                  <input type="tel" id="tx-phone" placeholder="+91 98765 43210" required style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', transition: 'border-color 0.3s', width: '100%' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Highest Education Qualification <span style={{ color: '#dc2626' }}>*</span></label>
                  <select id="tx-education" required style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', width: '100%', background: '#fff' }}>
                    <option value="">Select qualification</option>
                    <option value="highschool">High School</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD / Doctorate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Institution / College</label>
                  <input type="text" id="tx-institution" placeholder="Name of institution" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', transition: 'border-color 0.3s', width: '100%' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Years of Teaching Experience</label>
                  <select id="tx-experience" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', width: '100%', background: '#fff' }}>
                    <option value="0">0 (No experience)</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Subjects Interested in Teaching <span style={{ color: '#dc2626' }}>*</span></label>
                <div className="dept-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '0.75rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', background: '#fafafa' }}>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="AI Fundamentals" /> AI Fundamentals</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Machine Learning" /> Machine Learning</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Data Science" /> Data Science</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Python Programming" /> Python Programming</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="AI for Farmers" /> AI for Farmers</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="AI for Teachers" /> AI for Teachers</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="AI for Students" /> AI for Students</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="AI for Kids" /> AI for Kids</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Robotics & IoT" /> Robotics & IoT</label>
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Languages You Can Teach In <span style={{ color: '#dc2626' }}>*</span></label>
                <div className="dept-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '0.75rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', background: '#fafafa' }}>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="English" /> English</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Hindi" /> Hindi</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Telugu" /> Telugu</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Tamil" /> Tamil</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Kannada" /> Kannada</label>
                  <label className="dept-checkbox" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}><input type="checkbox" value="Other" /> Other</label>
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Relevant Certifications (if any)</label>
                <input type="text" id="tx-certifications" placeholder="e.g. Google AI Certification, NPTEL, Coursera" style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', transition: 'border-color 0.3s', width: '100%' }} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Why do you want to teach with TeachXai? <span style={{ color: '#dc2626' }}>*</span></label>
                <textarea id="tx-why" rows={3} required placeholder="Share your motivation and how you can contribute..." style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', transition: 'border-color 0.3s', resize: 'vertical', width: '100%' }}></textarea>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Availability <span style={{ color: '#dc2626' }}>*</span></label>
                <select id="tx-availability" required style={{ padding: '0.7rem 1rem', fontSize: '0.9rem', border: '1.5px solid var(--glass-border)', borderRadius: '10px', outline: 'none', width: '100%', background: '#fff' }}>
                  <option value="">Select availability</option>
                  <option value="weekdays">Weekdays (Mon-Fri)</option>
                  <option value="weekends">Weekends (Sat-Sun)</option>
                  <option value="evenings">Evenings only</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <button type="submit" className="btn-submit" style={{ padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem', width: '100%' }}>Submit Application</button>
            </form>
          </div>
        </section>
      </div>

      {/* ========== AI CHAT MODAL ========== */}
      <div id="chat-modal" className="chat-modal">
        <div className="chat-modal-content">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-header-icon">🤖</span>
              <div>
                <div className="chat-header-title">AI Assistant</div>
                <div className="chat-header-status">Online</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => (window as any).toggleChat()}>✕</button>
          </div>
          <div className="chat-messages" id="chat-messages">
            <div className="chat-msg bot">
              <div className="chat-msg-content">Hi! I'm the AI assistant. How can I help you today? You can ask me about our programs, volunteering, login help, or anything about IncuXai Education Trust.</div>
            </div>
          </div>
          <div className="chat-input-area">
            <input type="text" id="chat-input" className="chat-input" placeholder="Type your message..." onKeyDown={(e) => { if (e.key === 'Enter') (window as any).sendChatMessage(); }} />
            <button className="chat-send" onClick={() => (window as any).sendChatMessage()}>➤</button>
          </div>
        </div>
      </div>

      {/* ========== DONATE PAGE ========== */}
      <div id="donate" className="page" style={{ paddingTop: '85px', background: 'var(--darker)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-tag">Support Our Mission</span>
            <h2 className="section-title">Make a <span style={{ color: 'var(--secondary)' }}>Donation</span></h2>
            <p className="section-sub">Your contribution helps us bring AI education to thousands of underserved communities across India.</p>
          </div>

          {/* Donation Amount */}
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text)', marginBottom: '1.2rem' }}>Donation Amount</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
              {[500, 1000, 2500, 5000, 10000].map(amt => (
                <button key={amt} onClick={(e) => {
                  document.querySelectorAll('.amt-btn').forEach(b => { (b as HTMLElement).style.borderColor = 'var(--glass-border)'; (b as HTMLElement).style.background = 'var(--glass)'; });
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--secondary)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(155,122,62,0.08)';
                  const input = document.getElementById('donate-amount') as HTMLInputElement;
                  if (input) input.value = String(amt);
                }} className="amt-btn" style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid var(--glass-border)', background: 'var(--glass)', color: 'var(--text)', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-display)' }}>₹{amt.toLocaleString('en-IN')}</button>
              ))}
            </div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Or enter custom amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-muted)' }}>₹</span>
              <input id="donate-amount" type="number" min="1" placeholder="Enter amount" style={{
                width: '100%', padding: '0.9rem 1.2rem 0.9rem 2.2rem', borderRadius: '12px', border: '1.5px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '1rem', fontFamily: 'var(--font-body)',
                outline: 'none', boxSizing: 'border-box'
              }} />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--text)', marginBottom: '1.2rem' }}>Select Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {[
                { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
                { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
                { id: 'wallet', label: 'Wallets', icon: '👛', desc: 'Paytm, Amazon Pay' }
              ].map(method => (
                <div key={method.id} onClick={(e) => {
                  document.querySelectorAll('.pay-method').forEach(d => { (d as HTMLElement).style.borderColor = 'var(--glass-border)'; (d as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; });
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--secondary)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(155,122,62,0.06)';
                  const upiField = document.getElementById('upi-id-field');
                  if (upiField) upiField.style.display = method.id === 'upi' ? 'block' : 'none';
                }} className="pay-method" data-method={method.id} style={{
                  border: '1.5px solid var(--glass-border)', borderRadius: '14px', padding: '1.2rem', cursor: 'pointer',
                  transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{method.icon}</span>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.95rem' }}>{method.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{method.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* UPI ID Input */}
            <div id="upi-id-field" style={{ display: 'none', marginTop: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Enter your UPI ID</label>
              <input id="upi-id" type="text" placeholder="yourname@upi" style={{
                width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1.5px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'var(--font-body)',
                outline: 'none', boxSizing: 'border-box'
              }} />
            </div>
          </div>

          {/* Donate Button */}
          <button onClick={async () => {
            const amt = (document.getElementById('donate-amount') as HTMLInputElement)?.value;
            if (!amt || Number(amt) <= 0) { (window as any).showToast('Please enter a valid donation amount'); return; }
            const selectedMethod = document.querySelector('.pay-method[style*="var(--secondary)"]') as HTMLElement;
            if (!selectedMethod) { (window as any).showToast('Please select a payment method'); return; }

            const methodId = selectedMethod.getAttribute('data-method');
            if (methodId === 'upi') {
              const upiVal = (document.getElementById('upi-id') as HTMLInputElement)?.value?.trim();
              if (!upiVal || !upiVal.includes('@')) { (window as any).showToast('Please enter a valid UPI ID (e.g. name@upi)'); return; }
            }

            const amountInPaise = Math.round(Number(amt) * 100);

            try {
              const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt: `donation_${Date.now()}` }),
              });
              const text = await res.text();
              let data: any;
              try { data = JSON.parse(text); } catch { throw new Error('Payment server is currently unavailable. Please try again later.'); }
              if (!res.ok) throw new Error(data.error || 'Failed to create order');

              const handler = async function (response: any) {
                try {
                  const verifyRes = await fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                    }),
                  });
                  const vText = await verifyRes.text();
                  let verifyData: any;
                  try { verifyData = JSON.parse(vText); } catch { verifyData = { status: 'pending' }; }
                  if (verifyData.status === 'success') {
                    const popup = document.getElementById('donate-popup');
                    if (popup) popup.style.display = 'flex';
                  } else {
                    (window as any).showToast('Payment verification failed. Please contact support.');
                  }
                } catch {
                  (window as any).showToast('Payment received. Verification pending — we will confirm shortly.');
                  const popup = document.getElementById('donate-popup');
                  if (popup) popup.style.display = 'flex';
                }
              };

              const prefilled: any = {};
              if (methodId === 'upi') {
                prefilled.vpa = (document.getElementById('upi-id') as HTMLInputElement)?.value?.trim();
              }

              const instrument = methodId === 'upi' ? [{ method: 'upi' }] : methodId === 'card' ? [{ method: 'card' }] : methodId === 'netbanking' ? [{ method: 'netbanking' }] : [{ method: 'wallet' }];

              const options: any = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T59haDglDKaK4W',
                amount: data.amount,
                currency: data.currency,
                name: 'IncuXai Education Trust',
                description: 'Donation for AI Education',
                order_id: data.order_id,
                handler,
                prefill: prefilled,
                theme: { color: '#9B7A3E' },
                config: {
                  display: {
                    blocks: {
                      utib: {
                        name: 'Pay using',
                        instruments: instrument,
                      }
                    }
                  }
                },
                modal: {
                  ondismiss: function () {
                    (window as any).showToast('Payment cancelled.');
                  },
                },
              };
              const rzp = new (window as any).Razorpay(options);
              rzp.on('payment.failed', function (response: any) {
                (window as any).showToast('Payment failed. Please try again.');
                console.error('Payment failed:', response.error);
              });
              rzp.open();
            } catch (err: any) {
              (window as any).showToast(err.message || 'Something went wrong. Please try again.');
            }
          }} style={{
            width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff',
            fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-display)', cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(155,122,62,0.3)', transition: 'all 0.3s', letterSpacing: '0.03em'
          }}>Donate Now</button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.6rem', lineHeight: '1.5' }}>
            Test mode: Use UPI (enter <strong>success@razorpay</strong> in Razorpay modal) or Net Banking to test payment.
          </p>

          {/* Tax Benefits */}
          <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              <strong style={{ color: 'var(--secondary)' }}>Tax Benefits:</strong> All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
            </p>
          </div>

          {/* Back to Home */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button onClick={() => (window as any).showPage('home')} style={{
              padding: '0.7rem 2rem', borderRadius: '12px', border: '1.5px solid var(--glass-border)',
              background: 'transparent', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.3s'
            }}>← Back to Home</button>
          </div>
        </div>
      </div>

      {/* ========== DONATE SUCCESS POPUP ========== */}
      <div id="donate-popup" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', maxWidth: '420px', width: '90%', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }}>
          <button onClick={() => { const p = document.getElementById('donate-popup'); if (p) p.style.display = 'none'; }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#999' }}>✕</button>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Transaction Initiated</h3>
          <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', marginBottom: '0.5rem' }}>Your payment is being processed securely.</p>
          <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: '1.6', marginBottom: '1.5rem' }}>You will receive a confirmation on your registered mobile number and email once the transaction is complete.</p>
          <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: '#166534', lineHeight: '1.5' }}>For any queries, contact us at <strong>+91 9494808589</strong> or email <strong>info@incuxaieducationtrust.org</strong></p>
          </div>
          <button onClick={() => { const p = document.getElementById('donate-popup'); if (p) p.style.display = 'none'; (window as any).showPage('home'); }} style={{
            padding: '0.8rem 2.5rem', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
            fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
          }}>Done</button>
        </div>
      </div>

      {/* ========== CORPORATE REGISTRATION MODAL ========== */}
      {corpShowRegModal && (
        <div className="modal-overlay active wide" onClick={() => setCorpShowRegModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left' }}>
            <button className="modal-close" onClick={() => setCorpShowRegModal(false)}>✕</button>
            <h3 className="modal-title">Corporate Registration</h3>
            <p className="modal-header-desc">Gain instant access to the Generative AI masterclass by validating your professional credentials.</p>
            
            <form onSubmit={handleCorpFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={corpRegForm.fullName}
                    onChange={(e) => setCorpRegForm({ ...corpRegForm, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    style={{ width: '100%' }}
                  />
                  {corpFormErrors.fullName && <span className="input-helper-msg error">{corpFormErrors.fullName}</span>}
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>Personal Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={corpRegForm.personalEmail}
                    onChange={(e) => setCorpRegForm({ ...corpRegForm, personalEmail: e.target.value })}
                    placeholder="e.g. name@gmail.com"
                    style={{ width: '100%' }}
                  />
                  {corpFormErrors.personalEmail && <span className="input-helper-msg error">{corpFormErrors.personalEmail}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>Phone Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={corpRegForm.phone}
                    onChange={(e) => setCorpRegForm({ ...corpRegForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    style={{ width: '100%' }}
                  />
                  {corpFormErrors.phone && <span className="input-helper-msg error">{corpFormErrors.phone}</span>}
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>Location *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={corpRegForm.location}
                    onChange={(e) => setCorpRegForm({ ...corpRegForm, location: e.target.value })}
                    placeholder="City, State"
                    style={{ width: '100%' }}
                  />
                  {corpFormErrors.location && <span className="input-helper-msg error">{corpFormErrors.location}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', display: 'block', marginBottom: '0.4rem' }}>Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={corpRegForm.companyName}
                    onChange={(e) => setCorpRegForm({ ...corpRegForm, companyName: e.target.value })}
                    placeholder="e.g. Microsoft"
                    style={{ width: '100%' }}
                  />
                  {corpFormErrors.companyName && <span className="input-helper-msg error">{corpFormErrors.companyName}</span>}
                </div>
              </div>

              {/* Role Selection Container */}
              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Role *</label>
                <div className="role-radio-group">
                  {['Executive', 'Manager', 'Developer', 'Consultant'].map((roleOpt) => (
                    <div
                      key={roleOpt}
                      className={`role-radio-card ${corpRegForm.role === roleOpt ? 'active' : ''}`}
                      onClick={() => setCorpRegForm({ ...corpRegForm, role: roleOpt })}
                    >
                      <div className="role-radio-dot"></div>
                      <span className="role-radio-label">{roleOpt}</span>
                    </div>
                  ))}
                </div>
                {corpFormErrors.role && <span className="input-helper-msg error" style={{ display: 'block', marginTop: '0.5rem' }}>{corpFormErrors.role}</span>}
              </div>

              <button type="submit" className="panel-btn-register" style={{ width: '100%' }}>
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========== FLOATING WHATSAPP ICON ========== */}
      <a href="https://wa.me/919494808589" target="_blank" rel="noopener noreferrer" className="whatsapp-float" title="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.022-5.127-2.885-7c-1.863-1.874-4.343-2.905-6.994-2.906-5.49 0-9.953 4.429-9.957 9.884-.002 1.714.453 3.39 1.32 4.887l-.994 3.634 3.73-.974zm12.002-6.852c-.274-.136-1.62-.801-1.871-.892-.252-.09-.435-.136-.617.136-.183.272-.708.89-.867 1.072-.16.182-.32.205-.594.069-.275-.136-1.16-.427-2.209-1.364-.817-.73-1.368-1.63-1.528-1.905-.16-.273-.017-.421.12-.557.123-.122.274-.32.41-.48.138-.16.183-.273.275-.455.092-.182.046-.341-.023-.477-.068-.136-.617-1.485-.845-2.03-.22-.533-.48-.46-.617-.466-.123-.006-.275-.007-.426-.007-.152 0-.401.057-.61.284-.21.227-.8.781-.8 1.904 0 1.124.816 2.207.93 2.36.114.152 1.606 2.451 3.89 3.435.543.233.967.373 1.3.479.546.173 1.042.149 1.433.09.437-.066 1.62-.662 1.849-1.3.23-.637.23-1.182.16-1.3-.069-.117-.251-.183-.526-.32z"/></svg>
      </a>

      {/* ========== FOOTER ========== */}
      <footer id="main-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0', background: 'transparent', marginBottom: '0.3rem' }} onClick={() => (window as any).showPage('home')}>
              <img src={logoImg} alt="IncuxAI Logo" className="logo-icon" style={{ height: '45px', width: 'auto', borderRadius: '6px' }} />
              <div className="logo-text-group" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>IncuXai</span>
                <span style={{ color: 'rgba(245,158,11,0.85)', fontWeight: '500', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Education Trust</span>
              </div>
            </div>
            <p style={{ marginTop: '0.5rem' }}>An educational trust dedicated to making AI knowledge accessible to every Indian citizen regardless of background, language, or economic status.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => (window as any).showPage('home')}>Home</a></li>
              <li><a onClick={() => (window as any).showPage('about')}>About Us</a></li>
              <li><a onClick={() => (window as any).showPage('ai4all')}>AI 4 ALL</a></li>
              <li><a onClick={() => (window as any).showPage('gallery')}>Gallery</a></li>
              <li><a onClick={() => (window as any).showPage('volunteer')}>Volunteer</a></li>
              <li><a onClick={() => (window as any).showPage('contact')}>Contact Us</a></li>
              <li><a onClick={() => (window as any).showPage('donate')}>Donate</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>AI 4 ALL</h4>
            <ul>
              <li><a onClick={() => {
                if (isAuthenticated) {
                  localStorage.setItem('corp_otp_verified', 'true');
                  navigate('/course-dashboard');
                } else {
                  navigate('/sign-in');
                }
              }}>AI for HR</a></li>
              <li><a onClick={() => (window as any).showPage('ai4all')}>AI for Teachers</a></li>
              <li><a onClick={() => (window as any).showPage('ai4all')}>AI for Police</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul>
              <li style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>✉</span> info@incuxaieducationtrust.org</li>
              <li style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>📞</span> +91 9494808589</li>
              <li style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>📍</span> INCUXAI PRIVATE LIMITED, 134-1-317, Pandu Ranga Nagar, Muthyala Reddy Nagar, Guntur, AP 522034</li>
              <li style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>🌐</span> www.incuxaieducationtrust.org</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 IncuXai Education Trust. All rights reserved. | Non-Profit | Registered Trust</p>
          <div className="social-links" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <a href="https://www.instagram.com/incuxai/" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram" style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://linkedin.com/company/incuxai/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn" style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://wa.me/919494808589" target="_blank" rel="noopener noreferrer" className="social-link" title="WhatsApp" style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.022-5.127-2.885-7c-1.863-1.874-4.343-2.905-6.994-2.906-5.49 0-9.953 4.429-9.957 9.884-.002 1.714.453 3.39 1.32 4.887l-.994 3.634 3.73-.974zm12.002-6.852c-.274-.136-1.62-.801-1.871-.892-.252-.09-.435-.136-.617.136-.183.272-.708.89-.867 1.072-.16.182-.32.205-.594.069-.275-.136-1.16-.427-2.209-1.364-.817-.73-1.368-1.63-1.528-1.905-.16-.273-.017-.421.12-.557.123-.122.274-.32.41-.48.138-.16.183-.273.275-.455.092-.182.046-.341-.023-.477-.068-.136-.617-1.485-.845-2.03-.22-.533-.48-.46-.617-.466-.123-.006-.275-.007-.426-.007-.152 0-.401.057-.61.284-.21.227-.8.781-.8 1.904 0 1.124.816 2.207.93 2.36.114.152 1.606 2.451 3.89 3.435.543.233.967.373 1.3.479.546.173 1.042.149 1.433.09.437-.066 1.62-.662 1.849-1.3.23-.637.23-1.182.16-1.3-.069-.117-.251-.183-.526-.32z"/></svg>
            </a>
            <a href="https://youtube.com/@incuxai?si=1KB19n7w3B0xmrBc" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube" style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
