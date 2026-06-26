"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. สั่งดึงข้อมูลครั้งแรกตอนโหลดเข้าเว็บ
    fetchProducts();

    // 2. เปิดช่องสัญญาณ WebSockets เพื่อดักฟังการขยับตัวของฐานข้อมูล
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // จับหมดทั้งการ เพิ่ม (INSERT), แก้ไข (UPDATE), และลบ (DELETE)
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('👀 จับตาดูพบการเปลี่ยนแปลง!', payload);
          // พอฐานข้อมูลขยับปุ๊บ สั่งให้ดึงข้อมูลใหม่มาโชว์หน้าจอทันที!
          fetchProducts();
        }
      )
      .subscribe();

    // คืนค่าระบบเมื่อผู้ใช้ปิดหน้าเว็บทิ้ง
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (data) {
      const sorted = [...data].sort((a, b) => {
        if (a.is_best_seller && !b.is_best_seller) return -1;
        if (!a.is_best_seller && b.is_best_seller) return 1;
        return 0;
      });
      setProducts(sorted);
    }
    setLoading(false);
  };

  return (
    <div className="store-container">
      <section className="store-hero">
        <img 
          src="https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp" 
          alt="Giftoryth Logo" 
          className="logo"
        />
        <h1 className="store-title font-serif">
          Curating Something <br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Extraordinary</span>
        </h1>
        <p className="store-subtitle">
          ให้เราเป็นตัวแทนส่งมอบความรู้สึกดีๆ ผ่านกระเช้าของขวัญสุดพรีเมียม <br className="hidden md:block"/>
          ที่ถูกคัดสรรมาอย่างพิถีพิถันเพื่อคนพิเศษของคุณ
        </p>
        <a href="#collections" className="btn-line">
          ชมคอลเลกชันของเรา
        </a>
      </section>

      <section id="collections" className="section-container">
        <h2 className="section-title font-serif">Our Collections</h2>
        <p className="section-desc">กระเช้าของขวัญคุณภาพระดับพรีเมียม ดีไซน์หรูหราไม่ซ้ำใคร</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'gray' }}>กำลังเตรียมคอลเลกชัน...</div>
        ) : products.length === 0 ? (
          <div className="empty-state" style={{ border: 'none', backgroundColor: 'transparent' }}>
            <p>ยังไม่มีคอลเลกชันในขณะนี้</p>
          </div>
        ) : (
          <div className="store-products-grid">
            {products.map((p) => (
              <div key={p.id} className="store-product-card">
                <div className="store-image-wrapper">
                  <img src={p.image_url} alt={p.name} />
                  {p.is_best_seller && (
                    <span className="bestseller-badge">★ Best Seller</span>
                  )}
                </div>
                <div className="store-product-info">
                  <h3 className="store-product-name">{p.name}</h3>
                  <p className="store-product-price">฿ {p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="store-footer">
        <img 
          src="https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp" 
          alt="Giftoryth Logo" 
        />
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>© 2026 Giftoryth. All rights reserved.</p>
        <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '0.5rem' }}>Premium Gift Hampers & Baskets</p>
        
        <div style={{ marginTop: '3rem' }}>
          <Link href="/admin" style={{ color: 'var(--beige)', opacity: 0.5, textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
}