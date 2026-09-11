# Roadmap Takip

Öğrenme sürecini takip etmek için yapılan bir web uygulaması. Frontend, Backend, Full-Stack, Android ve iOS geliştirici olmak isteyenlerin hangi konuları öğrenmesi gerektiği gösteriliyor, öğrenildikçe işaretlenebiliyor.

## Kullanılan teknolojiler

React + Vite + TypeScript, Tailwind CSS, state yönetimi için Zustand, sayfa geçişleri için react-router-dom, görsel şema için @xyflow/react.

## Geliştirme süreci

Önce tek bir roadmap (Frontend Developer) ile başlandı, konu/alt konu ağacı ve durum (Başlanmadı / Devam Ediyor / Tamamlandı) işaretleme sistemi kuruldu. Sonra Backend, Full-Stack, Android ve iOS roadmap'leri eklendi. Konu ekleme/silme ve açık-koyu tema özelliği eklendi. Her konu için detay sayfası ve görsel akış şeması eklendi. "Birini seç" gereken konular (ör. Sass/Less) ayrı işaretlendi.

Full-Stack roadmap'ine, frontend/backend dışında bilinmesi gereken ekstra konular eklendi: Monorepo Araçları, Uçtan Uca Tip Güvenliği, Gerçek Zamanlı İletişim.

Sayfalar arası gezinirken açık bırakılan konuların kapanması rahatsız edici bulunduğu için, açık/kapalı durumu ve scroll pozisyonu hafızada tutulacak şekilde düzenlendi. CSS gibi "birini seç" içeren konuların hiç %100 tamamlanamadığı fark edilip, durumu tıklanamayan bir yazıya çevrildi.

Genel bir gözden geçirme yapılıp birkaç hata düzeltildi: öneri rozetinin bazı konularda hiç çıkmaması, boş başlıkla ekleme yapılabilmesi, "bulunamadı" sayfalarında geri dönüş linki olmaması, akış şemasının karanlık modda uyumsuz olması, mobilde başlıkların taşması, aç/kapa butonunun erişilebilirlik etiketinin olmaması.

Demo amaçlı, backend'siz bir Kayıt Ol / Giriş Yap ekranı eklendi — bilgiler tarayıcıda saklanıyor, gerçek bir güvenlik yok.

Son olarak akış şeması sadeleştirildi (bazı roadmap'lerde 100'den fazla kutu oluşuyordu), en fazla 2 seviye derinlik gösterecek şekilde sınırlandı.

## Nasıl çalıştırılır

    npm install
    npm run dev