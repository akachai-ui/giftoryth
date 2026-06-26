"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Product States
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("รหัสผ่านไม่ถูกต้อง: " + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); 
    } else {
      setFile(null);
      setPreviewUrl(editingId ? existingImage : null);
    }
  };

  // -------------------------
  // SAVE PRODUCT (Add & Edit)
  // -------------------------
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) {
      alert("กรุณากรอกชื่อและราคาให้ครบ");
      return;
    }
    if (!editingId && !file) {
      alert("กรุณาอัปโหลดรูปภาพสินค้า");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = existingImage;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrlData.publicUrl;
      }

      if (editingId) {
        const { error: dbError } = await supabase
          .from('products')
          .update({
            name,
            price: parseFloat(price),
            image_url: finalImageUrl,
            is_best_seller: isBestSeller
          })
          .eq('id', editingId);

        if (dbError) throw dbError;
        alert("อัปเดตข้อมูลสำเร็จ!");
      } else {
        const { error: dbError } = await supabase
          .from('products')
          .insert([{
            name,
            price: parseFloat(price),
            image_url: finalImageUrl,
            is_best_seller: isBestSeller
          }]);

        if (dbError) throw dbError;
        alert("เพิ่มสินค้าสำเร็จ!");
      }
      
      cancelEdit();
      fetchProducts(); 

    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // EDIT PRODUCT
  // -------------------------
  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setIsBestSeller(product.is_best_seller);
    setExistingImage(product.image_url);
    setFile(null); 
    setPreviewUrl(product.image_url); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setFile(null);
    setIsBestSeller(false);
    setExistingImage("");
    setPreviewUrl(null); 
  };

  // -------------------------
  // DELETE PRODUCT
  // -------------------------
  const handleDeleteProduct = async (id: string, imageUrl: string) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) return;

    try {
      const { error: dbError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;

      try {
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1];
        if (fileName) {
           await supabase.storage.from('images').remove([fileName]);
        }
      } catch(e) {
        console.log("Storage delete error", e);
      }

      alert("ลบสินค้าเรียบร้อยแล้ว");
      fetchProducts();
      
      if (editingId === id) cancelEdit();

    } catch (error: any) {
      alert("เกิดข้อผิดพลาดในการลบ: " + error.message);
    }
  };

  // ----------------------------------------------------
  // หน้า Login
  // ----------------------------------------------------
  if (!session) {
    return (
      <div className="admin-container">
        <div className="login-box">
          <div className="login-header">
            <h1 className="font-serif">Admin</h1>
            <p>ระบบจัดการเนื้อหา Giftoryth</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">อีเมล</label>
              <input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">รหัสผ่าน</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
            </div>
            <button type="submit" className="btn-primary">
              ล็อกอินเข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // หน้า Dashboard
  // ----------------------------------------------------
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="font-serif">Giftoryth Admin</h1>
        <div className="user-info">
          <span>{session.user.email}</span>
          
          {/* ปุ่มลัดเพื่อเปิดดูหน้าเว็บจริง */}
          <a 
            href="/" 
            target="_blank" 
            className="btn-secondary" 
            style={{ 
              textDecoration: 'none', 
              backgroundColor: 'var(--beige)', 
              color: 'var(--maroon-dark)', 
              border: 'none',
              fontWeight: 600
            }}
          >
            👁️ ดูหน้าเว็บจริง
          </a>

          <button onClick={handleLogout} className="btn-secondary">
            ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ฟอร์มจัดการสินค้า */}
        <div className="card">
          <h2 className="card-title">
            {editingId ? "✏️ แก้ไขสินค้า" : "+ เพิ่มกระเช้าสินค้าใหม่"}
          </h2>
          <form onSubmit={handleSaveProduct}>
            <div className="form-group">
              <label className="form-label">ชื่อกระเช้า/สินค้า</label>
              <input type="text" placeholder="เช่น Golden Brown Elegance" value={name} onChange={e => setName(e.target.value)} className="form-input" required />
            </div>
            
            <div className="form-group">
              <label className="form-label">ราคา (บาท)</label>
              <input type="number" placeholder="เช่น 3000" value={price} onChange={e => setPrice(e.target.value)} className="form-input" required />
            </div>

            <div className="file-input-wrapper form-group">
              <label className="form-label">
                รูปภาพกระเช้า {editingId && <span style={{color: 'gray', fontWeight: 'normal', textTransform: 'none'}}>(ไม่ต้องเลือกถ้าใช้รูปเดิม)</span>}
              </label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              
              {/* ช่องแสดงรูปพรีวิว (อัปโหลด) */}
              {previewUrl && (
                <div className="image-preview-container">
                  <span className="image-preview-label">Preview / รูปตัวอย่าง</span>
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
            </div>

            <div className="checkbox-wrapper">
              <input type="checkbox" id="bestSeller" checked={isBestSeller} onChange={e => setIsBestSeller(e.target.checked)} />
              <label htmlFor="bestSeller" style={{fontWeight: '500', color: 'var(--maroon-dark)', cursor: 'pointer', letterSpacing: '0.05em'}}>
                แสดงเป็นสินค้าขายดี (ป้าย Best Seller)
              </label>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0' }}>
                {loading ? "กำลังบันทึก..." : (editingId ? "บันทึกการแก้ไข" : "+ บันทึกสินค้า")}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-cancel">
                  ยกเลิกการแก้ไข
                </button>
              )}
            </div>
          </form>
        </div>

        {/* รายการสินค้า */}
        <div className="card">
          <h2 className="card-title">
            แคตตาล็อกสินค้า
            <span className="badge">{products.length} รายการ</span>
          </h2>
          
          {products.length === 0 ? (
            <div className="empty-state">
              <p>ยังไม่มีสินค้าในระบบ<br/>ทดลองเพิ่มสินค้าชิ้นแรกดูสิครับ!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-image-container">
                    <img src={p.image_url} alt={p.name} />
                    {p.is_best_seller && (
                      <span className="bestseller-badge">★ Best Seller</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{p.name}</h3>
                    <p className="product-price">฿ {p.price.toLocaleString()}</p>
                    
                    {/* ปุ่มแก้ไขและลบ */}
                    <div className="card-actions">
                      <button type="button" onClick={() => handleEditClick(p)} className="btn-action btn-edit">
                        ✏️ แก้ไข
                      </button>
                      <button type="button" onClick={() => handleDeleteProduct(p.id, p.image_url)} className="btn-action btn-delete">
                        🗑️ ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}