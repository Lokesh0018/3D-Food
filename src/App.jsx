import React, { useState, useEffect, useRef } from 'react';
import { Flame, Smartphone, ChefHat, Truck, Star, User, Quote, MapPin, Phone, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const dishes = [
  {
    id: 1,
    name: "Roasted Chicken",
    description: "Tender, juicy roasted chicken served with creamy, buttery mashed potatoes. A classic comfort meal done right.",
    image: "/roasted_chicken_with_mashed_potatoes-removebg-preview.png",
  },
  {
    id: 2,
    name: "Spicy Drumsticks",
    description: "Fiery chili and earthy cumin marinated drumsticks, grilled to smoky perfection for an unforgettable kick.",
    image: "/Chili___Cumin_Marinated_Chicken_Drumsticks-removebg-preview.png",
  },
  {
    id: 3,
    name: "Classic Grilled",
    description: "Perfectly charred and succulent grilled chicken, lightly seasoned to let the natural flavors shine.",
    image: "/grilled_chicken-removebg-preview.png",
  },
  {
    id: 4,
    name: "Fries & Nuggets",
    description: "Golden, crispy french fries paired with our signature crispy chicken nuggets. The ultimate crowd-pleaser.",
    image: "/french_fries_with_nuggets-removebg-preview.png",
  }
];

function App() {
  // Hero Section State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const largeImageRef = useRef(null);
  const titleRef = useRef(null);

  // Section Refs for ScrollTrigger
  const menuRef = useRef(null);
  const stepsRef = useRef(null);
  const storyRef = useRef(null);
  const reviewsRef = useRef(null);

  // Hero Auto Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        handleSelect((activeIndex + 1) % dishes.length);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, isAnimating]);

  // Scroll State for Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollTrigger Animations
  useEffect(() => {
    // 0. Hero Initial Load Animation
    const tl = gsap.timeline();
    tl.fromTo("nav", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(".left-content > *", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4")
      .fromTo(largeImageRef.current, { scale: 0.5, rotation: 90, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "back.out(1.5)" }, "-=0.6");

    // 1. Menu cards stagger
    gsap.fromTo(".menu-card", 
      { y: 60, opacity: 0 },
      { 
        scrollTrigger: {
          trigger: menuRef.current,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.15, 
        ease: "power3.out" 
      }
    );

    // 2. Steps stagger
    gsap.fromTo(".step-card",
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.2,
        ease: "back.out(1.2)"
      }
    );

    // 3. Story split layout
    gsap.fromTo(".story-text",
      { x: -50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );
    gsap.fromTo(".story-image",
      { x: 50, opacity: 0, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );

    // 4. Reviews stagger
    gsap.fromTo(".review-card",
      { y: 30, opacity: 0, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: reviewsRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }
    );
  }, []);

  const handleSelect = (index) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    
    // Animate title out
    gsap.to(titleRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.to(titleRef.current, { y: 20, duration: 0 });
      }
    });

    // Exit animation for current plate
    gsap.to(largeImageRef.current, {
      rotation: -180,
      x: -500,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(index);

        // Animate title in
        gsap.to(titleRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });

        // Enter animation for the new plate
        gsap.fromTo(largeImageRef.current, 
          { rotation: 180, x: 500, opacity: 0 }, 
          { rotation: 0, x: 0, opacity: 1, duration: 0.8, ease: "power2.out", onComplete: () => setIsAnimating(false) }
        );
      }
    });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-container">
        <nav className={isScrolled ? "scrolled" : ""}>
          <div className="logo">
            <div className="logo-circle">
               <Flame size={32} color="white" fill="white" className="flame-icon" />
            </div>
          </div>
          <ul className="nav-links">
            <li className="active">HOME</li>
            <li>ABOUT US</li>
            <li>BLOG</li>
            <li>CONTACT US</li>
          </ul>
        </nav>

        <main className="hero-main">
          <div className="left-content">
            <h3 className="special-label">Today's Special</h3>
            <div className="title-wrapper">
               <h1 className="dish-title" ref={titleRef}>{dishes[activeIndex].name}</h1>
            </div>
            <p className="dish-desc">{dishes[activeIndex].description}</p>
            
            <div className="thumbnails-row">
              {dishes.map((dish, idx) => (
                <div 
                  key={dish.id} 
                  className={`thumbnail-container ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => handleSelect(idx)}
                >
                  <img src={dish.image} alt={dish.name} className="thumbnail-img" />
                  {idx === activeIndex && <div className="active-indicator"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="right-content">
            <div className="large-plate-wrapper">
               <img 
                 ref={largeImageRef} 
                 src={dishes[activeIndex].image} 
                 alt="Large Plate" 
                 className="large-plate" 
               />
            </div>
          </div>
        </main>
      </div>

      {/* 1. Menu Section */}
      <section className="section menu-section" ref={menuRef}>
        <h2 className="section-title">Explore Our Menu</h2>
        <div className="menu-grid">
          {dishes.map((dish) => (
             <div className="menu-card" key={dish.id + 'menu'}>
               <div className="menu-img-wrap">
                 <img src={dish.image} alt={dish.name} className="menu-img"/>
               </div>
               <h4>{dish.name}</h4>
               <p className="price">$12.99</p>
               <button className="order-btn">Order Now</button>
             </div>
          ))}
        </div>
      </section>

      {/* 2. How it works */}
      <section className="section steps-section" ref={stepsRef}>
        <h2 className="section-title text-center">How It Works</h2>
        <div className="steps-container">
           <div className="step-card">
              <span className="step-bg-number">01</span>
              <div className="step-icon-wrapper">
                 <Smartphone size={32} />
              </div>
              <h3>Order via App</h3>
              <p>Browse our chef-crafted menu and customize your favorite meals in seconds with our intuitive app.</p>
           </div>
           <div className="step-card">
              <span className="step-bg-number">02</span>
              <div className="step-icon-wrapper">
                 <ChefHat size={32} />
              </div>
              <h3>Freshly Cooked</h3>
              <p>Every dish is made to order using premium, locally-sourced ingredients and grilled to perfection.</p>
           </div>
           <div className="step-card">
              <span className="step-bg-number">03</span>
              <div className="step-icon-wrapper">
                 <Truck size={32} />
              </div>
              <h3>Delivered Fast</h3>
              <p>Our dedicated delivery fleet ensures your food arrives piping hot at your door within 30 minutes.</p>
           </div>
        </div>
      </section>

      {/* 3. Our Story */}
      <section className="section story-section" ref={storyRef}>
        <div className="story-content">
           <div className="story-text">
             <span className="section-badge">Our Heritage</span>
             <h2 className="section-title">Crafting Perfect Bites Since 2010</h2>
             <p className="story-desc">We believe in the power of good food to bring people together. Using only farm-fresh ingredients and our secret blend of spices, every dish is crafted to perfection over an open flame.</p>
             <div className="story-stats">
               <div className="stat">
                 <span className="stat-num">15+</span>
                 <span className="stat-label">Years of Mastery</span>
               </div>
               <div className="stat">
                 <span className="stat-num">100%</span>
                 <span className="stat-label">Fresh Ingredients</span>
               </div>
             </div>
             <button className="order-btn mt-4">Discover More</button>
           </div>
           <div className="story-image">
              <div className="story-img-wrapper">
                <img src="/story-image.jpg" alt="Grilling Chicken" className="story-img" />
              </div>
           </div>
        </div>
      </section>

      {/* 4. Reviews */}
      <section className="section reviews-section" ref={reviewsRef}>
        <div className="reviews-header">
           <span className="section-badge center">Testimonials</span>
           <h2 className="section-title text-center">What People Say</h2>
        </div>
        <div className="reviews-grid">
           {[
             { name: "Lokesh M", role: "Food Enthusiast", text: "Absolutely the best chicken I have ever tasted. The flavors are out of this world! I bring my family here every weekend." },
             { name: "Sarah N", role: "Local Guide", text: "The grilled textures and spices are perfectly balanced. Their delivery is fast and the food always arrives piping hot." },
             { name: "James K", role: "Regular Customer", text: "I've tried every burger joint in town, but nothing beats the smoky flavor they manage to achieve here. Highly recommended!" }
           ].map((review, i) => (
             <div className="review-card" key={i}>
                <Quote className="quote-icon" size={48} />
                <div className="stars">
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">
                     <User size={20} color="#fff" />
                  </div>
                  <div className="reviewer-info">
                     <h5>{review.name}</h5>
                     <span>{review.role}</span>
                  </div>
                </div>
             </div>
           ))}
        </div>
      </section>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-circle footer-logo">
               <Flame size={24} color="white" fill="white" className="flame-icon" />
            </div>
            <h3>Flavor Grill</h3>
            <p>Crafting perfect bites since 2010. Experience the true taste of flame-grilled perfection.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><span style={{fontWeight: 800, fontSize: '14px'}}>IG</span></a>
              <a href="#" aria-label="Facebook"><span style={{fontWeight: 800, fontSize: '14px'}}>FB</span></a>
              <a href="#" aria-label="X (Twitter)"><span style={{fontWeight: 800, fontSize: '14px'}}>X</span></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#menu">Our Menu</a></li>
              <li><a href="#how-it-works">How it Works</a></li>
              <li><a href="#story">Our Story</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li><MapPin size={18}/> 123 Grill Street, Food City</li>
              <li><Phone size={18}/> (555) 123-4567</li>
              <li><Mail size={18}/> hello@flavorgrill.com</li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive offers and updates.</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Flavor Grill. All Rights Reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
