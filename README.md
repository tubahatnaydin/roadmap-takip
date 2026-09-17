# Roadmap Takip

Öğrenme sürecini takip etmek için bir web uygulaması geliştirildi. Frontend, Backend, Full-Stack, Android ve iOS geliştirici olmak isteyenlerin hangi konuları öğrenmesi gerektiği gösteriliyor, öğrenildikçe işaretlenebiliyor.

## Kullanılan teknolojiler

React + Vite + TypeScript, Tailwind CSS, state yönetimi için Zustand, sayfa geçişleri için react-router-dom, görsel şema için @xyflow/react kullanıldı.

## Geliştirme süreci

Önce tek bir roadmap ile başlandı, konu/alt konu ağacı ve durum (Başlanmadı / Devam Ediyor / Tamamlandı) işaretleme sistemi kuruldu. Sonra Backend, Full-Stack, Android ve iOS roadmap'leri eklendi. Konu ekleme/silme ve açık-koyu tema özelliği eklendi. Her konu için detay sayfası ve görsel akış şeması eklendi. "Birini seç" gereken konular ayrı işaretlendi.

Full-Stack roadmap'ine, frontend/backend dışında bilinmesi gereken ekstra konular eklendi.

Genel bir gözden geçirme yapılıp birkaç hata düzeltildi: öneri rozetinin bazı konularda hiç çıkmaması, boş başlıkla ekleme yapılabilmesi, "bulunamadı" sayfalarında geri dönüş linki olmaması, aç/kapa butonunun erişilebilirlik etiketinin olmaması.

Demo amaçlı, backend'siz bir Kayıt Ol / Giriş Yap ekranı eklendi — bilgiler tarayıcıda saklanıyor, gerçek bir güvenlik yok.

Akış şeması sadeleştirildi (bazı roadmap'lerde 100'den fazla kutu oluşuyordu), en fazla 2 seviye derinlik gösterecek şekilde sınırlandı.

Son olarak geri bildirim üzerine proje yeniden düzenlendi.

## Özellikler

Ana sayfada her roadmap için konu başlıklarına tıklanınca durumu değiştiriliyor (Başlanmadı → Devam Ediliyor → Tamamlandı). Sağdaki "+" ikonuyla yeni alt konu eklenebiliyor, çöp kutusu ikonuyla konu ya da tüm roadmap silinebiliyor.

Bir konunun "Detaylar" linkine tıklanınca açıklaması ve kaynak linkleri gösteriliyor. "Akış Şeması" linkine tıklanınca o roadmap'in konuları görsel bir ağaç şeması olarak gösteriliyor.

Sağ üstteki ay/güneş ikonuyla açık/koyu tema arasında geçiş yapılıyor. "Kayıt Ol" ile demo bir hesap oluşturulup "Giriş Yap" ile tekrar giriş yapılabiliyor (gerçek bir sunucu yok, bilgiler tarayıcıda tutuluyor).

## Nasıl çalıştırılır

Node.js kurulu olması gerekiyor. Proje klasörü açılıyor ve içinde bir terminal başlatılıyor. Terminale sırasıyla şu iki komut yazılıyor:

    npm install
    npm run dev