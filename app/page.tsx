/* eslint-disable */
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Navbar แบบ Glassmorphism ช่วยให้โลโก้สีแดงตัดกับพื้นหลังเด่นชัด */}
      <nav className="navbar">
        <div className="menu-icon md-hidden">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        
        {/* โลโก้แบรนด์ เด่นชัดด้วยขนาดที่ใหญ่ขึ้นและสีออริจินัล */}
        <div className="logo">
          <Link href="/">
            <img 
              src="https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp" 
              alt="giftoryth logo" 
            />
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/baskets">The Collection</Link></li>
          <li><Link href="/custom-gift">Bespoke Gifting</Link></li>
          <li><Link href="/about">Our Heritage</Link></li>
          <li><Link href="/contact">Concierge</Link></li>
        </ul>
        <div className="nav-right"></div>
      </nav>

      <main>
        {/* Editorial Split Screen Hero */}
        <section className="editorial-hero">
          <div className="hero-visual">
            <img 
              src="https://images.giftoryth.com/giftoryth-public/images/cover.webp" 
              alt="Premium Gift Baskets" 
            />
          </div>
          <div className="hero-content">
            <p className="hero-kicker reveal-right">Premium Gifting Service</p>
            <h1 className="hero-title reveal-right delay-1">
              Curating <br/>
              <span>Unforgettable</span> <br/>
              Moments.
            </h1>
            <Link href="/baskets">
              <button className="btn-editorial reveal-right delay-2">Explore Collection</button>
            </Link>
          </div>
        </section>

        {/* The Art of Gifting */}
        <section className="editorial-section">
          <div className="editorial-header">
            <h2>The Art of Gifting</h2>
            <p>Elevating every occasion with our signature touch.</p>
          </div>
          
          <div className="asymmetric-grid">
            <div className="story-block">
              <div className="story-image">
                <img src="https://images.giftoryth.com/giftoryth-public/images/IDENTITY_SERVICE/01.webp" alt="Corporate Identity" />
              </div>
              <div className="story-content">
                <span className="story-number">01</span>
                <h3 className="story-title">Corporate Elegance</h3>
                <p className="story-desc">
                  Impress clients and partners with bespoke corporate baskets tailored to your brand's identity. 
                  We meticulously select premium items that reflect your excellence and appreciation.
                </p>
              </div>
            </div>

            <div className="story-block reverse">
              <div className="story-image">
                <img src="https://images.giftoryth.com/giftoryth-public/images/IDENTITY_SERVICE/03.webp" alt="Premium Packaging" />
              </div>
              <div className="story-content">
                <span className="story-number">02</span>
                <h3 className="story-title">Artisan Packaging</h3>
                <p className="story-desc">
                  Every gift is a masterpiece. Our signature ribbons, custom boxes, and flawless presentation 
                  ensure that the unboxing experience is as breathtaking as the gift itself.
                </p>
              </div>
            </div>

            <div className="story-block">
              <div className="story-image">
                <img src="https://images.giftoryth.com/giftoryth-public/images/IDENTITY_SERVICE/08.webp" alt="Excellence Standard" />
              </div>
              <div className="story-content">
                <span className="story-number">03</span>
                <h3 className="story-title">The Excellence Standard</h3>
                <p className="story-desc">
                  From imported delicacies to rare vintages, we source only the finest products worldwide. 
                  A gift from Giftoryth is a true statement of uncompromising quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Style Best Sellers */}
        <section className="gallery-section">
          <div className="gallery-header">
            <h2>Curated Best Sellers</h2>
            <Link href="/baskets" style={{ color: 'var(--maroon)', textDecoration: 'underline', letterSpacing: '1px' }}>
              View All
            </Link>
          </div>

          <div className="gallery-carousel">
            <Link href="/baskets" className="gallery-item">
              <div className="gallery-img-wrapper">
                <img src="https://images.giftoryth.com/giftoryth-public/images/Basket/04.webp" alt="Golden Brown Elegance" />
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">Golden Brown</h3>
                <span className="gallery-price">฿ 3,000.00</span>
              </div>
            </Link>

            <Link href="/baskets" className="gallery-item">
              <div className="gallery-img-wrapper">
                <img src="https://images.giftoryth.com/giftoryth-public/images/Basket/09.webp" alt="Tory Delight Thai Box" />
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">Tory Delight</h3>
                <span className="gallery-price">฿ 1,790.00</span>
              </div>
            </Link>

            <Link href="/baskets" className="gallery-item">
              <div className="gallery-img-wrapper">
                <img src="https://images.giftoryth.com/giftoryth-public/images/Basket/13.webp" alt="Natural Harmony Basket" />
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">Natural Harmony</h3>
                <span className="gallery-price">฿ 2,290.00</span>
              </div>
            </Link>

            <Link href="/baskets" className="gallery-item">
              <div className="gallery-img-wrapper">
                <img src="https://images.giftoryth.com/giftoryth-public/images/Basket/16.webp" alt="Butter Blue Basket" />
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">Butter Blue</h3>
                <span className="gallery-price">฿ 1,250.00</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Floating LINE Button */}
      <a href="https://line.me/R/ti/p/@yourlineid" target="_blank" rel="noopener noreferrer" className="floating-line-btn">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" 
          alt="Chat with us on LINE" 
        />
      </a>
    </>
  );
}