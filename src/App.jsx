import React, { useState, useEffect, useRef } from 'react';
import { Flame, Smartphone, ChefHat, Truck, Star, User, Quote, MapPin, Phone, Mail, ShoppingCart, Send, X, Trash2, CheckCircle, MessageSquare } from 'lucide-react';
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
    price: "$14.99"
  },
  {
    id: 2,
    name: "Spicy Drumsticks",
    description: "Fiery chili and earthy cumin marinated drumsticks, grilled to smoky perfection for an unforgettable kick.",
    image: "/Chili___Cumin_Marinated_Chicken_Drumsticks-removebg-preview.png",
    price: "$12.49"
  },
  {
    id: 3,
    name: "Classic Grilled",
    description: "Perfectly charred and succulent grilled chicken, lightly seasoned to let the natural flavors shine.",
    image: "/grilled_chicken-removebg-preview.png",
    price: "$13.99"
  },
  {
    id: 4,
    name: "Fries & Nuggets",
    description: "Golden, crispy french fries paired with our signature crispy chicken nuggets. The ultimate crowd-pleaser.",
    image: "/french_fries_with_nuggets-removebg-preview.png",
    price: "$9.99"
  },
  {
    id: 5,
    name: "Grilled Beef Steak",
    description: "Premium cut beef steak grilled to absolute perfection, rich in flavor and served with our signature house sauce.",
    image: "/grilled_beef_steak-removebg-preview.png",
    price: "$24.99"
  },
  {
    id: 6,
    name: "Veggie Lasagna",
    description: "Layers of fresh pasta packed with roasted vegetables, creamy ricotta, and our homemade zesty marinara.",
    image: "/lasang_with_fresh_vegies-removebg-preview.png",
    price: "$16.50"
  },
  {
    id: 7,
    name: "Savory Meat Pie",
    description: "Flaky golden pastry filled with slow-cooked savory meats and rich gravy. A hearty, satisfying bite.",
    image: "/savory_meat_pie-removebg-preview.png",
    price: "$11.99"
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
  const contactRef = useRef(null);

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  // Active Section State
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = [
      document.getElementById('hero'),
      menuRef.current,
      storyRef.current,
      contactRef.current
    ].filter(Boolean);

    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.dish.price.replace('$', ''));
    return acc + (price * item.quantity);
  }, 0);

  const removeFromCart = (index) => {
    setCartItems(prev => {
      const item = prev[index];
      if (item.quantity > 1) {
        return prev.map((itm, i) => i === index ? { ...itm, quantity: itm.quantity - 1 } : itm);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setTimeout(() => {
        setCartItems([]);
        setCheckoutSuccess(false);
      }, 400); // Wait for drawer to close before resetting
    }, 2000);
  };

  const addToCart = (e, dish) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();

      const card = e.currentTarget.closest('.menu-card');
      const cartIcon = document.getElementById('nav-cart-icon');

      if (card && cartIcon) {
        const img = card.querySelector('img');
        if (img) {
          const imgRect = img.getBoundingClientRect();
          const cartRect = cartIcon.getBoundingClientRect();

          const flyingImg = document.createElement('img');
          flyingImg.src = dish.image;
          flyingImg.style.position = 'fixed';
          flyingImg.style.left = `${imgRect.left}px`;
          flyingImg.style.top = `${imgRect.top}px`;
          flyingImg.style.width = `${imgRect.width}px`;
          flyingImg.style.height = `${imgRect.height}px`;
          flyingImg.style.zIndex = '10000';
          flyingImg.style.pointerEvents = 'none';
          flyingImg.style.objectFit = 'cover';
          document.body.appendChild(flyingImg);

          gsap.to(flyingImg, {
            x: cartRect.left - imgRect.left + (cartRect.width / 2) - (imgRect.width / 2),
            y: cartRect.top - imgRect.top + (cartRect.height / 2) - (imgRect.height / 2),
            scale: 0.1,
            opacity: 0,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              flyingImg.remove();
            }
          });
        }
      }
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  // Carousel Drag State
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Hero Auto Rotation (only over first 4 items)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        handleSelect((activeIndex + 1) % 4);
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

    // 5. Parallax Ingredients
    gsap.utils.toArray('.parallax-item').forEach(item => {
      const speed = parseFloat(item.dataset.speed);
      gsap.to(item, {
        y: () => (ScrollTrigger.maxScroll(window) * speed),
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true
        }
      });
    });
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

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sectionTitles = {
    hero: '',
    menu: 'Our Menu',
    story: 'About Us',
    contact: 'Contact Us'
  };

  return (
    <>
      {/* Floating Parallax Ingredients */}
      <div className="parallax-wrapper">
        <img src="/red-chilli-removebg-preview.png" className="parallax-item p-chili-1" data-speed="0.2" alt="" />
        <img src="/basil-removebg-preview.png" className="parallax-item p-basil-1" data-speed="-0.15" alt="" />
        <img src="/garlic-removebg-preview.png" className="parallax-item p-garlic-1" data-speed="0.1" alt="" />
        <img src="/sauce_splash-removebg-preview.png" className="parallax-item p-splash-1" data-speed="-0.05" alt="" />
        <img src="/flame particles.png" className="parallax-item p-flame-1" data-speed="0.3" alt="" />
        <img src="/basil-removebg-preview.png" className="parallax-item p-basil-2" data-speed="0.25" alt="" />
        <img src="/red-chilli-removebg-preview.png" className="parallax-item p-chili-2" data-speed="-0.2" alt="" />
      </div>

      {/* Hero Section */}
      <div id="hero" className="hero-container">
        <nav className={isScrolled ? "scrolled" : ""}>
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <div className="logo-circle">
              <Flame size={28} color="white" fill="white" className="flame-icon" />
            </div>
          </div>
          
          <div className="nav-center-title">
            {activeSection !== 'hero' && (
              <span key={activeSection} className="nav-animated-title">
                {sectionTitles[activeSection]}
              </span>
            )}
          </div>
          <div className="nav-right">
            <ul className="nav-links">
              <li className={activeSection === 'menu' ? 'active' : ''} onClick={scrollToMenu}>MENU</li>
              <li className={activeSection === 'story' ? 'active' : ''} onClick={scrollToStory}>ABOUT US</li>
              <li className={activeSection === 'contact' ? 'active' : ''} onClick={scrollToContact}>CONTACT</li>
            </ul>

            <div id="nav-cart-icon" className="cart-icon-container" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={24} color="#111" />
              {cartCount > 0 && <span key={cartCount} className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </nav>

        {/* Cart Drawer */}
        <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
        <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {checkoutSuccess ? (
            <div className="checkout-success-anim">
              <CheckCircle size={80} color="#22c55e" className="success-icon" />
              <h3>Order Confirmed!</h3>
              <p>Preparing your delicious food...</p>
            </div>
          ) : (
            <>
              <div className="cart-body">
                {cartItems.length === 0 ? (
                  <p className="empty-cart-msg">Your cart is empty.</p>
                ) : (
                  <div className="cart-items">
                    {cartItems.map((item, i) => (
                      <div className="cart-item" key={i}>
                        <img src={item.dish.image} alt="Food" className="cart-item-img" />
                        <div className="cart-item-info">
                          <h4>{item.dish.name}</h4>
                          <span className="cart-item-price">{item.dish.price} x {item.quantity}</span>
                        </div>
                        <button className="remove-item-btn" onClick={() => removeFromCart(i)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
              )}
            </>
          )}
        </div>

        <main className="hero-main">
          <div className="left-content">
            <h3 className="special-label">Today's Special</h3>
            <div className="title-wrapper">
              <h1 className="dish-title" ref={titleRef}>{dishes[activeIndex].name}</h1>
            </div>
            <p className="dish-desc">{dishes[activeIndex].description}</p>

            <div className="hero-cta">
              <button className="order-btn" onClick={scrollToMenu}>Order Now</button>
              <button className="btn-secondary" onClick={scrollToMenu}>View Menu</button>
            </div>

            <div className="thumbnails-row">
              {dishes.slice(0, 4).map((dish, idx) => (
                <div
                  key={dish.id}
                  className={`thumbnail-container ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => handleSelect(idx)}
                >
                  <img src={dish.image} alt={dish.name} className="thumbnail-img" />
                </div>
              ))}

              {/* Sliding Active Indicator */}
              <div
                className="active-indicator"
                style={{ transform: `translateX(calc(${activeIndex} * (80px + 2rem)))` }}
              ></div>
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
      <section id="menu" className="section menu-section" ref={menuRef}>
        <div className="section-header text-center">
          <h2 className="section-title">Popular Menu</h2>
          <p className="section-subtitle">Swipe to explore our signature dishes</p>
        </div>
        <div
          className={`menu-carousel ${isDragging ? 'active-drag' : ''}`}
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {dishes.map((dish) => (
            <div className="menu-card" key={dish.id + 'menu'}>
              <div className="menu-img-wrap">
                <img src={dish.image} alt={dish.name} className="menu-img" />
              </div>
              <div className="menu-info">
                <h4>{dish.name}</h4>
                <p className="menu-desc">{dish.description}</p>
                <div className="menu-bottom">
                  <span className="price">{dish.price}</span>
                  <button className="add-cart-btn" onClick={(e) => addToCart(e, dish)}>+</button>
                </div>
              </div>
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
      <section id="story" className="section story-section" ref={storyRef}>
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
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="#f59e0b" color="#f59e0b" />)}
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

      {/* 5. Contact Section */}
      <section id="contact" className="section contact-section" ref={contactRef}>
        <div className="contact-parallax-wrapper">
          <img src="/red-chilli-removebg-preview.png" className="parallax-item cp-chili-1" data-speed="0.15" alt="" />
          <img src="/basil-removebg-preview.png" className="parallax-item cp-basil-1" data-speed="-0.1" alt="" />
          <img src="/garlic-removebg-preview.png" className="parallax-item cp-garlic-1" data-speed="0.12" alt="" />
          <img src="/sauce_splash-removebg-preview.png" className="parallax-item cp-splash-1" data-speed="-0.05" alt="" />
        </div>
        <div className="section-header text-center">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">We'd love to hear from you. Drop us a line!</p>
        </div>
        <div className="contact-container">
          <div className="contact-addons">
            <div className="addon-card">
              <div className="addon-icon"><MapPin size={24} color="#ef4444" /></div>
              <div>
                <h4>Visit Us</h4>
                <p>123 Culinary Blvd, Food City</p>
              </div>
            </div>
            <div className="addon-card">
              <div className="addon-icon"><Phone size={24} color="#ef4444" /></div>
              <div>
                <h4>Call Us</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="addon-card">
              <div className="addon-icon"><Mail size={24} color="#ef4444" /></div>
              <div>
                <h4>Email Us</h4>
                <p>hello@3dfastfood.com</p>
              </div>
            </div>
          </div>
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input type="text" id="name" placeholder="e.g. John Doe" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input type="email" id="email" placeholder="e.g. john@example.com" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <div className="input-wrapper">
                  <Quote size={20} className="input-icon" />
                  <select id="subject" defaultValue="" required>
                    <option value="" disabled>Select a subject</option>
                    <option value="catering">Catering & Events</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <div className="input-wrapper align-top">
                  <MessageSquare size={20} className="input-icon textarea-icon" />
                  <textarea id="message" placeholder="How can we help you?" rows="5" required></textarea>
                </div>
              </div>
              <button type="submit" className="submit-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
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
              <a href="#" aria-label="Instagram"><span style={{ fontWeight: 800, fontSize: '14px' }}>IG</span></a>
              <a href="#" aria-label="Facebook"><span style={{ fontWeight: 800, fontSize: '14px' }}>FB</span></a>
              <a href="#" aria-label="X (Twitter)"><span style={{ fontWeight: 800, fontSize: '14px' }}>X</span></a>
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
              <li><MapPin size={18} /> 123 Grill Street, Food City</li>
              <li><Phone size={18} /> (555) 123-4567</li>
              <li><Mail size={18} /> hello@flavorgrill.com</li>
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
