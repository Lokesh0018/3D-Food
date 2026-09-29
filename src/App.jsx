import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './index.css';

const dishes = [
  {
    id: 1,
    name: "Garden lover",
    description: "never sit around and wait for someone unless they're delivering a delicious meal.",
    image: "/roasted_chicken_with_mashed_potatoes-removebg-preview.png",
  },
  {
    id: 2,
    name: "Mushroom flex",
    description: "never sit around and wait for someone unless they're delivering a delicious meal.",
    image: "/Chili___Cumin_Marinated_Chicken_Drumsticks-removebg-preview.png",
  },
  {
    id: 3,
    name: "Chicken fanboy",
    description: "never sit around and wait for someone unless they're delivering a delicious meal.",
    image: "/grilled_chicken-removebg-preview.png",
  },
  {
    id: 4,
    name: "Cheese super",
    description: "never sit around and wait for someone unless they're delivering a delicious meal.",
    image: "/french_fries_with_nuggets-removebg-preview.png",
  }
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const largeImageRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        handleSelect((activeIndex + 1) % dishes.length);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, isAnimating]);

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

    // Exit animation for current plate (rotates and moves out to the left)
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

        // Enter animation for the new plate (starts from the right)
        gsap.fromTo(largeImageRef.current, 
          { rotation: 180, x: 500, opacity: 0 }, 
          { rotation: 0, x: 0, opacity: 1, duration: 0.8, ease: "power2.out", onComplete: () => setIsAnimating(false) }
        );
      }
    });
  };

  return (
    <div className="container">
      <nav>
        <div className="logo">
          <div className="logo-circle">
             <span style={{color: 'white', fontWeight: 'bold'}}>Logo</span>
          </div>
        </div>
        <ul className="nav-links">
          <li>HOME</li>
          <li>ABOUT US</li>
          <li>BLOG</li>
          <li>CONTACT US</li>
        </ul>
      </nav>

      <main>
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
  );
}

export default App;
