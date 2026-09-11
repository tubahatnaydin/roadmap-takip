import { persist } from 'zustand/middleware'
import type { RoadmapNode, Durum } from './types'
import { create } from 'zustand'

interface RoadmapStore {
    roadmaps: RoadmapNode[];
    setRoadmaps: (roadmaps: RoadmapNode[]) => void;
    updateDurum: (id: number, yeniDurum: Durum) => void;
    konuEkle: (parentId: number, baslik: string) => void;
    roadmapEkle: (baslik: string) => void;
    konuSil: (id: number) => void;
}

function tumAgaciGuncelle(node: RoadmapNode, yeniDurum: Durum): RoadmapNode {
    
    return {
        ...node,
        durum: yeniDurum,
        children: node.children.map((child) => tumAgaciGuncelle(child, yeniDurum)),
    };
}

function durumGuncelle(nodes: RoadmapNode[], id: number, yeniDurum: Durum): RoadmapNode[] {
    
    return nodes.map((node) => {
        if (node.id === id) {
            return tumAgaciGuncelle(node, yeniDurum);
        }
        else {
            return {...node, children: durumGuncelle(node.children, id, yeniDurum)};
        }
    });
}

function konuEkleYardimci(nodes: RoadmapNode[], parentId: number, yeniKonu: RoadmapNode): RoadmapNode[] {
    return nodes.map((node) => {
        if (node.id === parentId) {
            return { ...node, children: [...node.children, yeniKonu] };
        }
        else {
            return { ...node, children: konuEkleYardimci(node.children, parentId, yeniKonu) };
        }
    });
}

function konuSilYardimci(nodes: RoadmapNode[], id: number): RoadmapNode[] {
    return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({ ...node, children: konuSilYardimci(node.children, id) }));
}

export const useRoadmapStore = create<RoadmapStore>()(
    persist(
        (set) => ({

            roadmaps: [
                {
                    id: 1,
                    baslik: "Frontend Developer",
                    durum: "Başlanmadı",
                    aciklama: "Web tarayıcısında çalışan, kullanıcının doğrudan gördüğü ve etkileşime girdiği arayüzleri geliştiren rol.",
                    children: [
                        {
                            id: 2, baslik: "İnternet", durum: "Başlanmadı",
                            aciklama: "Web'in arka planda nasıl çalıştığını anlamak için gereken temel ağ kavramları.",
                            children: [
                                {
                                    id: 68, baslik: "HTTP", durum: "Başlanmadı", children: [],
                                    aciklama: "Tarayıcı ile sunucu arasındaki istek/cevap iletişimini tanımlayan protokol.",
                                    kaynaklar: ["https://developer.mozilla.org/tr/docs/Web/HTTP"],
                                },
                                {
                                    id: 69, baslik: "Tarayıcılar Nasıl Çalışır", durum: "Başlanmadı", children: [],
                                    aciklama: "Bir URL'ye gidildiğinde tarayıcının sayfayı nasıl işleyip ekrana çizdiği.",
                                    kaynaklar: ["https://web.dev/articles/howbrowserswork"],
                                },
                                {
                                    id: 70, baslik: "DNS", durum: "Başlanmadı", children: [],
                                    aciklama: "Alan adlarını IP adreslerine çeviren isim çözümleme sistemi.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Glossary/DNS"],
                                },
                            ],
                        },
                        {
                            id: 3, baslik: "HTML", durum: "Başlanmadı",
                            aciklama: "Web sayfalarının içeriğini ve yapısını (iskeletini) tanımlayan işaretleme dili.",
                            children: [
                                {
                                    id: 4, baslik: "Semantik HTML", durum: "Başlanmadı",
                                    aciklama: "İçeriğin anlamını doğru etiketlerle (header, nav, article vb.) ifade etmek.",
                                    children: [
                                        {
                                            id: 122, baslik: "Semantik Etiketler", durum: "Başlanmadı", children: [],
                                            aciklama: "header, nav, main, article, section, footer gibi anlam taşıyan HTML etiketlerini doğru yerde kullanmak.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Glossary/Semantics"],
                                        },
                                        {
                                            id: 123, baslik: "Başlık Hiyerarşisi & Doküman Yapısı", durum: "Başlanmadı", children: [],
                                            aciklama: "h1-h6 başlıklarını doğru sırayla kullanarak sayfaya mantıklı bir doküman yapısı kazandırmak.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements"],
                                        },
                                    ],
                                },
                                {
                                    id: 5, baslik: "Formlar", durum: "Başlanmadı",
                                    aciklama: "Kullanıcıdan veri almak için form elemanlarını kurmak ve doğrulamak.",
                                    children: [
                                        {
                                            id: 124, baslik: "Form Elemanları & Türleri", durum: "Başlanmadı", children: [],
                                            aciklama: "input, select, textarea gibi form elemanlarını ve türlerini (email, date, number vb.) kullanmak.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Learn/Forms"],
                                        },
                                        {
                                            id: 125, baslik: "Form Doğrulama (Validation)", durum: "Başlanmadı", children: [],
                                            aciklama: "Kullanıcının girdiği verinin doğruluğunu tarayıcı üzerinde veya JavaScript ile kontrol etmek.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation"],
                                        },
                                    ],
                                },
                                {
                                    id: 126, baslik: "Erişilebilirlik (a11y)", durum: "Başlanmadı",
                                    aciklama: "Sitenin ekran okuyucu kullananlar dahil herkes tarafından kullanılabilir olmasını sağlamak.",
                                    children: [
                                        {
                                            id: 127, baslik: "ARIA Rolleri", durum: "Başlanmadı", children: [],
                                            aciklama: "HTML elemanlarına ekran okuyucular için ek anlam ve rol kazandıran ARIA öznitelikleri.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA"],
                                        },
                                        {
                                            id: 128, baslik: "Klavye ile Kullanılabilirlik", durum: "Başlanmadı", children: [],
                                            aciklama: "Siteyi fare kullanmadan sadece klavye ile gezilebilir hale getirmek.",
                                            kaynaklar: ["https://webaim.org/techniques/keyboard/"],
                                        },
                                    ],
                                },
                                {
                                    id: 129, baslik: "SEO Temelleri", durum: "Başlanmadı",
                                    aciklama: "Arama motorlarının siteni doğru anlayıp sıralayabilmesi için gereken temel uygulamalar.",
                                    children: [
                                        {
                                            id: 130, baslik: "Meta Etiketler & Open Graph", durum: "Başlanmadı", children: [],
                                            aciklama: "Sayfa başlığı, açıklaması ve sosyal medya paylaşım görselleri için meta etiketleri.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta", "https://ogp.me/"],
                                        },
                                        {
                                            id: 131, baslik: "Semantik SEO", durum: "Başlanmadı", children: [],
                                            aciklama: "Doğru başlık hiyerarşisi ve semantik etiketlerle arama motorlarına sayfa içeriğini net anlatmak.",
                                            kaynaklar: ["https://developers.google.com/search/docs/fundamentals/seo-starter-guide"],
                                        },
                                    ],
                                },
                                {
                                    id: 132, baslik: "Tarayıcı Geliştirici Araçları (DevTools)", durum: "Başlanmadı", children: [],
                                    aciklama: "Tarayıcının Elements, Console, Network gibi panelleriyle HTML/CSS/JS'i inceleme ve hata ayıklama pratiği.",
                                    kaynaklar: ["https://developer.chrome.com/docs/devtools/"],
                                },
                            ],
                        },
                        {
                            id: 6, baslik: "CSS", durum: "Başlanmadı",
                            aciklama: "Web sayfalarının görsel tasarımını, renklerini ve düzenini tanımlayan stil dili.",
                            children: [
                                {
                                    id: 7, baslik: "Flexbox", durum: "Başlanmadı", children: [],
                                    aciklama: "Öğeleri tek eksende (satır veya sütun) esnek şekilde hizalamak için kullanılan CSS düzenleme sistemi.",
                                    kaynaklar: ["https://css-tricks.com/snippets/css/a-guide-to-flexbox/"],
                                },
                                {
                                    id: 133, baslik: "CSS Grid", durum: "Başlanmadı", children: [],
                                    aciklama: "Öğeleri iki eksende (satır ve sütun) ızgara düzeninde konumlandıran CSS sistemi.",
                                    kaynaklar: ["https://css-tricks.com/snippets/css/complete-guide-grid/"],
                                },
                                {
                                    id: 8, baslik: "Responsive Tasarım", durum: "Başlanmadı",
                                    aciklama: "Sitenin farklı ekran boyutlarında düzgün görünmesini sağlamak.",
                                    children: [
                                        {
                                            id: 134, baslik: "Media Queries", durum: "Başlanmadı", children: [],
                                            aciklama: "Ekran genişliğine göre farklı CSS kuralları uygulamayı sağlayan CSS özelliği.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries"],
                                        },
                                        {
                                            id: 135, baslik: "Mobile-First Yaklaşım", durum: "Başlanmadı", children: [],
                                            aciklama: "Önce mobil ekran için tasarlayıp sonra büyük ekranlara doğru genişletme stratejisi.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_responsive_design/Mobile_first"],
                                        },
                                    ],
                                },
                                {
                                    id: 136, baslik: "CSS Animasyonları", durum: "Başlanmadı",
                                    aciklama: "Öğelere hareket ve geçiş efektleri kazandıran CSS özellikleri.",
                                    children: [
                                        {
                                            id: 137, baslik: "Transitions", durum: "Başlanmadı", children: [],
                                            aciklama: "Bir CSS özelliğinin değerinin zaman içinde yumuşak geçişle değişmesini sağlar.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions"],
                                        },
                                        {
                                            id: 138, baslik: "Keyframe Animasyonları", durum: "Başlanmadı", children: [],
                                            aciklama: "@keyframes ile birden fazla adımdan oluşan daha karmaşık animasyonlar tanımlamak.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations"],
                                        },
                                    ],
                                },
                                {
                                    id: 139, baslik: "CSS Ön İşlemcileri", durum: "Başlanmadı", secilebilir: true,
                                    aciklama: "CSS'e değişken, iç içe kurallar gibi programatik özellikler kazandıran araçlar; ikisinden birini öğrenmen yeterli.",
                                    children: [
                                        {
                                            id: 140, baslik: "Sass", durum: "Başlanmadı", children: [],
                                            aciklama: "Değişkenler, iç içe kurallar ve mixin'lerle CSS yazımını kolaylaştıran en yaygın CSS ön işlemcisi.",
                                            kaynaklar: ["https://sass-lang.com/documentation/"],
                                        },
                                        {
                                            id: 141, baslik: "Less", durum: "Başlanmadı", children: [],
                                            aciklama: "Sass'a benzer, JavaScript tabanlı projelerde de sık kullanılan bir diğer CSS ön işlemcisi.",
                                            kaynaklar: ["https://lesscss.org/"],
                                        },
                                    ],
                                },
                                {
                                    id: 142, baslik: "CSS Mimarisi & İsimlendirme", durum: "Başlanmadı", secilebilir: true,
                                    aciklama: "Büyüyen projelerde CSS'i düzenli ve çakışmasız tutmak için kullanılan isimlendirme metodolojileri; ikisinden birini öğrenmen yeterli.",
                                    children: [
                                        {
                                            id: 143, baslik: "BEM", durum: "Başlanmadı", children: [],
                                            aciklama: "Block-Element-Modifier mantığıyla CSS sınıflarını tutarlı isimlendiren en yaygın metodoloji.",
                                            kaynaklar: ["http://getbem.com/"],
                                        },
                                        {
                                            id: 144, baslik: "OOCSS", durum: "Başlanmadı", children: [],
                                            aciklama: "Yapı ve görünümü birbirinden ayırarak tekrar kullanılabilir CSS yazmayı hedefleyen yaklaşım.",
                                            kaynaklar: ["https://github.com/stubbornella/oocss/wiki"],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 9, baslik: "JavaScript", durum: "Başlanmadı",
                            aciklama: "Web sayfalarına etkileşim, dinamik davranış ve mantık kazandıran programlama dili.",
                            children: [
                                {
                                    id: 10, baslik: "DOM Seçme & Değiştirme", durum: "Başlanmadı", children: [],
                                    aciklama: "JavaScript ile sayfadaki HTML öğelerini seçmek, içeriğini okumak ve değiştirmek.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model"],
                                },
                                {
                                    id: 145, baslik: "Olay Dinleyicileri (Event Handling)", durum: "Başlanmadı", children: [],
                                    aciklama: "Kullanıcının tıklama, yazma gibi eylemlerini dinleyip bunlara tepki veren fonksiyonlar tanımlamak.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"],
                                },
                                {
                                    id: 11, baslik: "Promises", durum: "Başlanmadı", children: [],
                                    aciklama: "Asenkron bir işlemin sonucunu (başarı/hata) temsil eden, zincirlenebilir JavaScript nesnesi.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"],
                                },
                                {
                                    id: 146, baslik: "Async/Await & Fetch API", durum: "Başlanmadı", children: [],
                                    aciklama: "Promise tabanlı kodu daha okunabilir yazmayı sağlayan sözdizimi ve sunucudan veri çekmek için kullanılan Fetch API.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"],
                                },
                                {
                                    id: 12, baslik: "ES6+ Özellikleri", durum: "Başlanmadı",
                                    aciklama: "Modern JavaScript'e eklenen, günlük yazımı kolaylaştıran sözdizimi özellikleri.",
                                    children: [
                                        {
                                            id: 147, baslik: "Destructuring & Spread/Rest", durum: "Başlanmadı", children: [],
                                            aciklama: "Nesne/dizilerden değer çıkarmayı ve birleştirmeyi kolaylaştıran modern sözdizimi.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment"],
                                        },
                                        {
                                            id: 148, baslik: "Modüller (import/export)", durum: "Başlanmadı", children: [],
                                            aciklama: "Kodu dosyalara bölüp import/export ile paylaşmayı sağlayan JavaScript modül sistemi.",
                                            kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"],
                                        },
                                    ],
                                },
                                {
                                    id: 149, baslik: "Closures & Scope", durum: "Başlanmadı", children: [],
                                    aciklama: "Bir fonksiyonun, tanımlandığı ortamdaki değişkenleri hatırlamasını sağlayan temel JavaScript kavramı.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"],
                                },
                                {
                                    id: 150, baslik: "Event Loop & Asenkron Çalışma Mantığı", durum: "Başlanmadı", children: [],
                                    aciklama: "JavaScript'in tek iş parçacığıyla asenkron kodu nasıl sıraya koyup çalıştırdığını anlamak.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop"],
                                },
                            ],
                        },
                        {
                            id: 151, baslik: "Tarayıcı Depolama", durum: "Başlanmadı",
                            aciklama: "Verinin kullanıcının tarayıcısında saklanmasını sağlayan farklı depolama yöntemleri.",
                            children: [
                                {
                                    id: 152, baslik: "localStorage & sessionStorage", durum: "Başlanmadı", children: [],
                                    aciklama: "Basit anahtar-değer verisini tarayıcıda kalıcı veya oturum boyunca saklamak.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"],
                                },
                                {
                                    id: 153, baslik: "Cookies & IndexedDB", durum: "Başlanmadı", children: [],
                                    aciklama: "Sunucuyla paylaşılan küçük veri parçaları (cookie) ve tarayıcıda daha büyük yapılandırılmış veri saklayan IndexedDB.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"],
                                },
                            ],
                        },
                        {
                            id: 154, baslik: "Web Güvenliği Temelleri", durum: "Başlanmadı",
                            aciklama: "Frontend tarafında bilinmesi gereken temel web güvenliği kavramları.",
                            children: [
                                {
                                    id: 155, baslik: "CORS", durum: "Başlanmadı", children: [],
                                    aciklama: "Tarayıcının farklı kaynaklardan (origin) gelen isteklere getirdiği güvenlik kısıtlaması.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"],
                                },
                                {
                                    id: 156, baslik: "XSS & HTTPS Temelleri", durum: "Başlanmadı", children: [],
                                    aciklama: "Zararlı script enjeksiyonundan (XSS) korunma ve güvenli bağlantı (HTTPS) temelleri.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS"],
                                },
                            ],
                        },
                        {
                            id: 13, baslik: "Versiyon Kontrolü (Git)", durum: "Başlanmadı",
                            aciklama: "Kod değişikliklerini takip etmeye ve ekip halinde çalışmaya yarayan versiyon kontrol sistemi.",
                            children: [
                                {
                                    id: 157, baslik: "Git Temelleri", durum: "Başlanmadı", children: [],
                                    aciklama: "commit, branch, merge gibi temel Git komutlarıyla değişiklikleri takip etmek.",
                                    kaynaklar: ["https://git-scm.com/book/tr/v2/Ba%C5%9Flarken-Git-Temelleri"],
                                },
                                {
                                    id: 158, baslik: "İşbirliği & Uzak Depolar", durum: "Başlanmadı", children: [],
                                    aciklama: "GitHub gibi platformlarda uzak depo kullanmak, pull request açmak ve ekip halinde çalışmak.",
                                    kaynaklar: ["https://docs.github.com/en/pull-requests"],
                                },
                            ],
                        },
                        {
                            id: 14, baslik: "Paket Yöneticileri (npm/pnpm)", durum: "Başlanmadı", children: [],
                            aciklama: "Projeye üçüncü parti kütüphaneleri kurmayı ve sürümlerini yönetmeyi sağlayan araçlar.",
                            kaynaklar: ["https://docs.npmjs.com/", "https://pnpm.io/motivation"],
                        },
                        {
                            id: 15, baslik: "CSS Framework'leri", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Hazır stil ve bileşenlerle hızlı arayüz geliştirmeyi sağlayan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 76, baslik: "Tailwind", durum: "Başlanmadı", children: [],
                                    aciklama: "Hazır CSS sınıflarını HTML içinde birleştirerek hızlı arayüz kurmayı sağlayan utility-first framework.",
                                    kaynaklar: ["https://tailwindcss.com/docs"],
                                },
                                {
                                    id: 77, baslik: "Bootstrap", durum: "Başlanmadı", children: [],
                                    aciklama: "Hazır bileşen (buton, kart, grid vb.) kütüphanesiyle hızlıca arayüz kurmayı sağlayan klasik CSS framework.",
                                    kaynaklar: ["https://getbootstrap.com/docs/"],
                                },
                            ],
                        },
                        {
                            id: 17, baslik: "Frontend Framework", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Component tabanlı arayüz geliştirmeyi sağlayan kütüphane/framework; üçünden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 80, baslik: "React", durum: "Başlanmadı", children: [],
                                    aciklama: "Facebook'un geliştirdiği, en yaygın kullanılan component tabanlı arayüz kütüphanesi.",
                                    kaynaklar: ["https://react.dev/learn"],
                                },
                                {
                                    id: 81, baslik: "Vue", durum: "Başlanmadı", children: [],
                                    aciklama: "Öğrenmesi kolay, aşamalı olarak benimsenebilen bir frontend framework.",
                                    kaynaklar: ["https://vuejs.org/guide/introduction.html"],
                                },
                                {
                                    id: 82, baslik: "Angular", durum: "Başlanmadı", children: [],
                                    aciklama: "Google'ın geliştirdiği, kurumsal projelerde sık tercih edilen kapsamlı framework.",
                                    kaynaklar: ["https://angular.dev/overview"],
                                },
                            ],
                        },
                        {
                            id: 101, baslik: "Durum Yönetimi", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Uygulama genelinde paylaşılan verinin yönetimini kolaylaştıran kütüphaneler; seçtiğin framework'e göre birini tercih edebilirsin.",
                            children: [
                                {
                                    id: 102, baslik: "Redux Toolkit", durum: "Başlanmadı", children: [],
                                    aciklama: "React ile en yaygın kullanılan, öngörülebilir ve merkezi state yönetim kütüphanesi.",
                                    kaynaklar: ["https://redux-toolkit.js.org/introduction/getting-started"],
                                },
                                {
                                    id: 103, baslik: "Zustand", durum: "Başlanmadı", children: [],
                                    aciklama: "React için minimal, az kod gerektiren, kolay öğrenilen bir state yönetim kütüphanesi (bu projenin kendisi de Zustand kullanıyor).",
                                    kaynaklar: ["https://github.com/pmndrs/zustand"],
                                },
                                {
                                    id: 104, baslik: "Pinia", durum: "Başlanmadı", children: [],
                                    aciklama: "Vue'nun resmi, TypeScript dostu state yönetim kütüphanesi.",
                                    kaynaklar: ["https://pinia.vuejs.org/introduction.html"],
                                },
                            ],
                        },
                        {
                            id: 16, baslik: "Build Araçları", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Kodu tarayıcı için paketleyen ve geliştirme sürecini hızlandıran araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 78, baslik: "Vite", durum: "Başlanmadı", children: [],
                                    aciklama: "Hızlı başlatma ve anlık yenileme sunan modern, yaygın tercih edilen build aracı.",
                                    kaynaklar: ["https://vitejs.dev/guide/"],
                                },
                                {
                                    id: 79, baslik: "Webpack", durum: "Başlanmadı", children: [],
                                    aciklama: "Daha eski ama hâlâ yaygın kullanılan, esnek yapılandırmalı modül paketleyici.",
                                    kaynaklar: ["https://webpack.js.org/concepts/"],
                                },
                            ],
                        },
                        {
                            id: 18, baslik: "TypeScript", durum: "Başlanmadı",
                            aciklama: "JavaScript'e statik tip denetimi ekleyen, hataları erken yakalamaya yardımcı olan dil.",
                            children: [
                                {
                                    id: 159, baslik: "Temel Tipler & Arayüzler", durum: "Başlanmadı", children: [],
                                    aciklama: "string, number, boolean gibi temel tipler ve nesne şeklini tanımlayan interface'ler.",
                                    kaynaklar: ["https://www.typescriptlang.org/docs/handbook/2/basic-types.html"],
                                },
                                {
                                    id: 160, baslik: "Generics & Utility Types", durum: "Başlanmadı", children: [],
                                    aciklama: "Farklı tiplerle çalışabilen yeniden kullanılabilir yapılar ve hazır yardımcı tipler.",
                                    kaynaklar: ["https://www.typescriptlang.org/docs/handbook/2/generics.html"],
                                },
                            ],
                        },
                        {
                            id: 19, baslik: "Test", durum: "Başlanmadı",
                            aciklama: "Fonksiyon ve component'lerin beklendiği gibi çalıştığını otomatik olarak doğrulamak.",
                            children: [
                                {
                                    id: 161, baslik: "Birim Testler (Jest)", durum: "Başlanmadı", children: [],
                                    aciklama: "Fonksiyonların ve modüllerin çıktısını izole şekilde test eden JavaScript test çalıştırıcısı.",
                                    kaynaklar: ["https://jestjs.io/docs/getting-started"],
                                },
                                {
                                    id: 162, baslik: "Component Testleri (Testing Library)", durum: "Başlanmadı", children: [],
                                    aciklama: "React gibi framework'lerde component'leri kullanıcı davranışına yakın şekilde test etmeyi sağlayan kütüphane.",
                                    kaynaklar: ["https://testing-library.com/docs/"],
                                },
                            ],
                        },
                        {
                            id: 105, baslik: "Uçtan Uca (E2E) Test", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Uygulamayı gerçek bir kullanıcı gibi baştan sona test eden araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 106, baslik: "Cypress", durum: "Başlanmadı", children: [],
                                    aciklama: "Tarayıcıda gerçek kullanıcı senaryolarını test etmek için yaygın kullanılan araç.",
                                    kaynaklar: ["https://docs.cypress.io/"],
                                },
                                {
                                    id: 107, baslik: "Playwright", durum: "Başlanmadı", children: [],
                                    aciklama: "Birden fazla tarayıcıda hızlı ve güvenilir uçtan uca test yazmayı sağlayan Microsoft aracı.",
                                    kaynaklar: ["https://playwright.dev/docs/intro"],
                                },
                            ],
                        },
                        {
                            id: 163, baslik: "Web Performansı & Optimizasyon", durum: "Başlanmadı",
                            aciklama: "Sayfanın hızlı yüklenmesini ve akıcı çalışmasını sağlayan optimizasyon teknikleri.",
                            children: [
                                {
                                    id: 164, baslik: "Core Web Vitals", durum: "Başlanmadı", children: [],
                                    aciklama: "Google'ın sayfa deneyimini ölçtüğü LCP, INP ve CLS gibi temel performans metrikleri.",
                                    kaynaklar: ["https://web.dev/articles/vitals"],
                                },
                                {
                                    id: 165, baslik: "Lazy Loading & Code Splitting", durum: "Başlanmadı", children: [],
                                    aciklama: "Gerekli olmayan kodu/görselleri ihtiyaç anına kadar geciktirerek ilk yükleme süresini kısaltmak.",
                                    kaynaklar: ["https://web.dev/articles/code-splitting-with-dynamic-imports-in-webpack"],
                                },
                            ],
                        },
                        {
                            id: 20, baslik: "Server Side Rendering (Next.js)", durum: "Başlanmadı", children: [],
                            aciklama: "Sayfaların sunucuda önceden render edilmesini sağlayan, React tabanlı en yaygın framework.",
                            kaynaklar: ["https://nextjs.org/docs"],
                        },
                        {
                            id: 166, baslik: "Deployment / Yayına Alma", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Geliştirilen siteyi internete açık hale getirmek için kullanılan barındırma platformları; birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 167, baslik: "Netlify", durum: "Başlanmadı", children: [],
                                    aciklama: "Statik ve modern frontend projelerini kolayca yayınlamayı sağlayan popüler barındırma platformu.",
                                    kaynaklar: ["https://docs.netlify.com/"],
                                },
                                {
                                    id: 168, baslik: "Vercel", durum: "Başlanmadı", children: [],
                                    aciklama: "Next.js'i geliştiren ekibin sunduğu, özellikle Next.js projeleriyle birebir uyumlu barındırma platformu.",
                                    kaynaklar: ["https://vercel.com/docs"],
                                },
                                {
                                    id: 169, baslik: "GitHub Pages", durum: "Başlanmadı", children: [],
                                    aciklama: "GitHub deposundan doğrudan ücretsiz statik site yayınlamayı sağlayan basit yöntem.",
                                    kaynaklar: ["https://docs.github.com/en/pages"],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 21,
                    baslik: "Backend Developer",
                    durum: "Başlanmadı",
                    aciklama: "Sunucu tarafında çalışan, veri işleme, iş mantığı ve veritabanı yönetiminden sorumlu rol.",
                    children: [
                        {
                            id: 22, baslik: "İşletim Sistemi & Terminal Temelleri", durum: "Başlanmadı", children: [],
                            aciklama: "Sunucu ortamlarında sıkça kullanılan Linux/Unix komut satırı ve temel işletim sistemi kavramları.",
                            kaynaklar: ["https://ubuntu.com/tutorials/command-line-for-beginners", "https://linuxjourney.com/"],
                        },
                        {
                            id: 23, baslik: "Programlama Dili", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Backend geliştirmede kullanılan ana programlama dili; bunlardan birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 71, baslik: "Node.js", durum: "Başlanmadı", children: [],
                                    aciklama: "JavaScript'i sunucu tarafında çalıştıran, geniş paket ekosistemine sahip runtime.",
                                    kaynaklar: ["https://nodejs.org/en/docs"],
                                },
                                {
                                    id: 72, baslik: "Python", durum: "Başlanmadı", children: [],
                                    aciklama: "Okunabilirliği yüksek, hızlı geliştirme sağlayan, Django/Flask gibi framework'lere sahip dil.",
                                    kaynaklar: ["https://docs.python.org/3/"],
                                },
                                {
                                    id: 73, baslik: "Java", durum: "Başlanmadı", children: [],
                                    aciklama: "Kurumsal projelerde yaygın kullanılan, Spring ekosistemiyle güçlü statik tipli bir dil.",
                                    kaynaklar: ["https://docs.oracle.com/en/java/"],
                                },
                                {
                                    id: 74, baslik: "C#", durum: "Başlanmadı", children: [],
                                    aciklama: ".NET ekosistemiyle kurumsal uygulamalar geliştirmek için kullanılan Microsoft dili.",
                                    kaynaklar: ["https://learn.microsoft.com/en-us/dotnet/csharp/"],
                                },
                                {
                                    id: 75, baslik: "Go", durum: "Başlanmadı", children: [],
                                    aciklama: "Basit söz dizimi ve yüksek performansıyla mikroservislerde tercih edilen Google dili.",
                                    kaynaklar: ["https://go.dev/doc/"],
                                },
                                {
                                    id: 170, baslik: "Ruby", durum: "Başlanmadı", children: [],
                                    aciklama: "Rails framework'üyle hızlı ve okunabilir web uygulamaları geliştirmeyi sağlayan, geliştirici dostu bir dil.",
                                    kaynaklar: ["https://www.ruby-lang.org/en/documentation/", "https://guides.rubyonrails.org/"],
                                },
                                {
                                    id: 171, baslik: "PHP", durum: "Başlanmadı", children: [],
                                    aciklama: "Laravel gibi framework'lerle web geliştirmede yaygın kullanılan, öğrenmesi kolay bir sunucu tarafı dili.",
                                    kaynaklar: ["https://www.php.net/docs.php", "https://laravel.com/docs"],
                                },
                            ],
                        },
                        {
                            id: 13, baslik: "Versiyon Kontrolü (Git)", durum: "Başlanmadı",
                            children: [
                                {
                                    id: 157, baslik: "Git Temelleri", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 158, baslik: "İşbirliği & Uzak Depolar", durum: "Başlanmadı", children: [],
                                },
                            ],
                        },
                        {
                            id: 179, baslik: "Ortam Değişkenleri & Konfigürasyon Yönetimi", durum: "Başlanmadı", children: [],
                            aciklama: "Uygulamanın veritabanı bağlantısı, API anahtarları gibi ortama özgü ayarlarını kod dışında, güvenli şekilde yönetme pratiği.",
                            kaynaklar: ["https://12factor.net/config", "https://www.npmjs.com/package/dotenv"],
                        },
                        {
                            id: 25, baslik: "İlişkisel Veritabanları", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Verinin tablolar halinde, ilişkisel olarak saklandığı veritabanı sistemleri; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 83, baslik: "PostgreSQL", durum: "Başlanmadı", children: [],
                                    aciklama: "Gelişmiş özellikleri ve güvenilirliğiyle öne çıkan, açık kaynak ilişkisel veritabanı.",
                                    kaynaklar: ["https://www.postgresql.org/docs/"],
                                },
                                {
                                    id: 84, baslik: "MySQL", durum: "Başlanmadı", children: [],
                                    aciklama: "Dünyada en yaygın kullanılan açık kaynak ilişkisel veritabanı sistemlerinden biri.",
                                    kaynaklar: ["https://dev.mysql.com/doc/"],
                                },
                            ],
                        },
                        {
                            id: 181, baslik: "Veritabanı Migrasyonları", durum: "Başlanmadı", children: [],
                            aciklama: "Veritabanı şemasındaki değişiklikleri sürüm kontrollü, geri alınabilir adımlarla yönetme yöntemi.",
                            kaynaklar: ["https://www.prisma.io/dataguide/types/relational/what-are-database-migrations"],
                        },
                        {
                            id: 26, baslik: "NoSQL Veritabanları", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Şemasız veya esnek şemalı veri saklama sistemleri; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 85, baslik: "MongoDB", durum: "Başlanmadı", children: [],
                                    aciklama: "Veriyi JSON benzeri doküman formatında saklayan, en yaygın NoSQL veritabanı.",
                                    kaynaklar: ["https://www.mongodb.com/docs/"],
                                },
                                {
                                    id: 86, baslik: "Redis", durum: "Başlanmadı", children: [],
                                    aciklama: "Bellek içi çalışan, önbellekleme ve hızlı veri erişimi için kullanılan key-value veritabanı.",
                                    kaynaklar: ["https://redis.io/docs/latest/"],
                                },
                            ],
                        },
                        {
                            id: 27, baslik: "API Tasarımı", durum: "Başlanmadı",
                            aciklama: "İstemci ile sunucu arasındaki veri alışverişinin nasıl yapılandırılacağını belirleyen tasarım yaklaşımları.",
                            children: [
                                {
                                    id: 28, baslik: "REST", durum: "Başlanmadı", children: [],
                                    aciklama: "HTTP metodlarını ve URL'leri kullanarak kaynak tabanlı API tasarlama yaklaşımı.",
                                    kaynaklar: ["https://restfulapi.net/"],
                                },
                                {
                                    id: 29, baslik: "GraphQL", durum: "Başlanmadı", children: [],
                                    aciklama: "İstemcinin ihtiyacı olan veriyi tek istekte, esnek bir sorgu diliyle almasını sağlayan API teknolojisi.",
                                    kaynaklar: ["https://graphql.org/learn/"],
                                },
                                {
                                    id: 180, baslik: "API Dokümantasyonu (Swagger/OpenAPI)", durum: "Başlanmadı", children: [],
                                    aciklama: "API'nin uç noktalarını, parametrelerini ve yanıtlarını standart bir formatta belgeleyerek başkalarının kolayca kullanmasını sağlama.",
                                    kaynaklar: ["https://swagger.io/docs/specification/about/"],
                                },
                            ],
                        },
                        {
                            id: 30, baslik: "Kimlik Doğrulama & Güvenlik", durum: "Başlanmadı",
                            aciklama: "Kullanıcı kimliğini doğrulama ve uygulamayı yaygın güvenlik açıklarına karşı koruma yöntemleri.",
                            children: [
                                {
                                    id: 31, baslik: "JWT / OAuth", durum: "Başlanmadı", children: [],
                                    aciklama: "Kullanıcı oturumunu token tabanlı doğrulayan ve üçüncü parti girişlerini destekleyen standartlar.",
                                    kaynaklar: ["https://jwt.io/introduction", "https://oauth.net/2/"],
                                },
                                {
                                    id: 32, baslik: "Güvenlik En İyi Pratikleri", durum: "Başlanmadı", children: [],
                                    aciklama: "SQL injection, XSS, CSRF gibi yaygın güvenlik açıklarına karşı alınması gereken önlemler.",
                                    kaynaklar: ["https://owasp.org/www-project-top-ten/"],
                                },
                                {
                                    id: 174, baslik: "Yetkilendirme (Authorization & RBAC)", durum: "Başlanmadı", children: [],
                                    aciklama: "Kimliği doğrulanmış bir kullanıcının hangi kaynaklara erişip hangi işlemleri yapabileceğini rol tabanlı olarak belirleme.",
                                    kaynaklar: ["https://auth0.com/docs/manage-users/access-control/rbac"],
                                },
                            ],
                        },
                        {
                            id: 33, baslik: "Test Stratejileri", durum: "Başlanmadı",
                            aciklama: "Backend kodunun birim, entegrasyon ve uçtan uca testlerle doğrulanması.",
                            children: [
                                {
                                    id: 172, baslik: "Birim Testler (Unit Tests)", durum: "Başlanmadı", children: [],
                                    aciklama: "Tek bir fonksiyonu veya modülü, dış bağımlılıklardan izole ederek test etme yöntemi.",
                                    kaynaklar: ["https://martinfowler.com/bliki/UnitTest.html"],
                                },
                                {
                                    id: 173, baslik: "Entegrasyon Testleri (Integration Tests)", durum: "Başlanmadı", children: [],
                                    aciklama: "Birden fazla modülün veya servisin (veritabanı, API gibi) birlikte doğru çalıştığını test etme yöntemi.",
                                    kaynaklar: ["https://martinfowler.com/bliki/IntegrationTest.html"],
                                },
                            ],
                        },
                        {
                            id: 34, baslik: "Önbellekleme (Caching)", durum: "Başlanmadı", children: [],
                            aciklama: "Sık erişilen veriyi hızlı erişim için geçici olarak saklayarak performansı artırma tekniği.",
                            kaynaklar: ["https://aws.amazon.com/caching/"],
                        },
                        {
                            id: 108, baslik: "Gözlemlenebilirlik (Logging & Monitoring)", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Uygulamanın çalışma zamanı davranışını izlemeye ve hataları tespit etmeye yarayan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 109, baslik: "ELK Stack", durum: "Başlanmadı", children: [],
                                    aciklama: "Elasticsearch, Logstash ve Kibana ile log toplama, arama ve görselleştirme çözümü.",
                                    kaynaklar: ["https://www.elastic.co/guide/index.html"],
                                },
                                {
                                    id: 110, baslik: "Prometheus & Grafana", durum: "Başlanmadı", children: [],
                                    aciklama: "Metrik toplama ve görselleştirme için yaygın kullanılan açık kaynak izleme araçları.",
                                    kaynaklar: ["https://prometheus.io/docs/introduction/overview/", "https://grafana.com/docs/"],
                                },
                            ],
                        },
                        {
                            id: 35, baslik: "Mesaj Kuyrukları", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Servisler arasında asenkron mesajlaşmayı sağlayan sistemler; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 87, baslik: "Kafka", durum: "Başlanmadı", children: [],
                                    aciklama: "Yüksek hacimli veri akışlarını işlemek için kullanılan dağıtık mesajlaşma platformu.",
                                    kaynaklar: ["https://kafka.apache.org/documentation/"],
                                },
                                {
                                    id: 88, baslik: "RabbitMQ", durum: "Başlanmadı", children: [],
                                    aciklama: "Kurulumu ve kullanımı görece basit, yaygın kullanılan mesaj kuyruğu sistemi.",
                                    kaynaklar: ["https://www.rabbitmq.com/docs"],
                                },
                            ],
                        },
                        {
                            id: 36, baslik: "Docker & Konteynerleştirme", durum: "Başlanmadı",
                            aciklama: "Uygulamayı bağımlılıklarıyla birlikte taşınabilir konteynerler halinde paketleme teknolojisi.",
                            children: [
                                {
                                    id: 175, baslik: "Dockerfile & İmaj Oluşturma", durum: "Başlanmadı", children: [],
                                    aciklama: "Bir uygulamanın çalışması için gereken ortamı adım adım tanımlayıp konteyner imajı haline getirme.",
                                    kaynaklar: ["https://docs.docker.com/engine/reference/builder/"],
                                },
                                {
                                    id: 176, baslik: "Docker Compose", durum: "Başlanmadı", children: [],
                                    aciklama: "Birden fazla konteyneri (uygulama, veritabanı vb.) tek bir dosyayla birlikte tanımlayıp yönetme aracı.",
                                    kaynaklar: ["https://docs.docker.com/compose/"],
                                },
                            ],
                        },
                        {
                            id: 111, baslik: "Kubernetes", durum: "Başlanmadı", children: [],
                            aciklama: "Konteynerlerin dağıtımını, ölçeklenmesini ve yönetimini otomatikleştiren orkestrasyon sistemi.",
                            kaynaklar: ["https://kubernetes.io/docs/concepts/"],
                        },
                        {
                            id: 37, baslik: "CI/CD", durum: "Başlanmadı", children: [],
                            aciklama: "Kod değişikliklerinin otomatik test edilip yayına alınmasını sağlayan sürekli entegrasyon/dağıtım süreci.",
                            kaynaklar: ["https://docs.github.com/en/actions"],
                        },
                        {
                            id: 182, baslik: "Cloud / Deployment Temelleri", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Uygulamayı gerçek kullanıcılara ulaştırmak için kullanılan bulut sağlayıcıları; üçünden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 183, baslik: "AWS", durum: "Başlanmadı", children: [],
                                    aciklama: "En yaygın kullanılan, geniş servis yelpazesine sahip bulut platformu.",
                                    kaynaklar: ["https://docs.aws.amazon.com/"],
                                },
                                {
                                    id: 184, baslik: "Google Cloud (GCP)", durum: "Başlanmadı", children: [],
                                    aciklama: "Google'ın veri ve makine öğrenmesi odaklı güçlü servislere sahip bulut platformu.",
                                    kaynaklar: ["https://cloud.google.com/docs"],
                                },
                                {
                                    id: 185, baslik: "Azure", durum: "Başlanmadı", children: [],
                                    aciklama: "Microsoft'un kurumsal entegrasyonlarıyla öne çıkan bulut platformu.",
                                    kaynaklar: ["https://learn.microsoft.com/en-us/azure/"],
                                },
                            ],
                        },
                        {
                            id: 38, baslik: "Mikroservisler", durum: "Başlanmadı", children: [],
                            aciklama: "Uygulamayı bağımsız olarak geliştirilip dağıtılabilen küçük servislere bölme mimarisi.",
                            kaynaklar: ["https://microservices.io/"],
                        },
                        {
                            id: 39, baslik: "Sistem Tasarımı Temelleri", durum: "Başlanmadı",
                            aciklama: "Ölçeklenebilir, güvenilir sistemler tasarlarken göz önünde bulundurulması gereken temel prensipler.",
                            children: [
                                {
                                    id: 177, baslik: "Ölçeklenebilirlik & Yük Dengeleme", durum: "Başlanmadı", children: [],
                                    aciklama: "Artan trafiği karşılamak için sistemi yatay/dikey ölçeklendirme ve isteği birden fazla sunucuya dağıtma.",
                                    kaynaklar: ["https://aws.amazon.com/what-is/load-balancing/"],
                                },
                                {
                                    id: 178, baslik: "Veritabanı Ölçekleme (Sharding & Replication)", durum: "Başlanmadı", children: [],
                                    aciklama: "Veriyi birden fazla sunucuya bölerek (sharding) veya çoğaltarak (replication) veritabanı performansını ve dayanıklılığını artırma.",
                                    kaynaklar: ["https://www.mongodb.com/resources/products/capabilities/database-sharding-explained"],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 40,
                    baslik: "Full-Stack Developer",
                    durum: "Başlanmadı",
                    aciklama: "Hem tarayıcıda çalışan arayüzü hem de sunucu tarafındaki iş mantığını ve veritabanını yönetebilen, uçtan uca ürün geliştirebilen rol.",
                    children: [
                        {
                            id: 1,
                            baslik: "Frontend Developer",
                            durum: "Başlanmadı",
                            baglanti: true,
                            children: [
                                {
                                    id: 2, baslik: "İnternet", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 68, baslik: "HTTP", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 69, baslik: "Tarayıcılar Nasıl Çalışır", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 70, baslik: "DNS", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 3, baslik: "HTML", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 4, baslik: "Semantik HTML", durum: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 122, baslik: "Semantik Etiketler", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 123, baslik: "Başlık Hiyerarşisi & Doküman Yapısı", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 5, baslik: "Formlar", durum: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 124, baslik: "Form Elemanları & Türleri", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 125, baslik: "Form Doğrulama (Validation)", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 126, baslik: "Erişilebilirlik (a11y)", durum: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 127, baslik: "ARIA Rolleri", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 128, baslik: "Klavye ile Kullanılabilirlik", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 129, baslik: "SEO Temelleri", durum: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 130, baslik: "Meta Etiketler & Open Graph", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 131, baslik: "Semantik SEO", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 132, baslik: "Tarayıcı Geliştirici Araçları (DevTools)", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 6, baslik: "CSS", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 7, baslik: "Flexbox", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 133, baslik: "CSS Grid", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 8, baslik: "Responsive Tasarım", durum: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 134, baslik: "Media Queries", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 135, baslik: "Mobile-First Yaklaşım", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 136, baslik: "CSS Animasyonları", durum: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 137, baslik: "Transitions", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 138, baslik: "Keyframe Animasyonları", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 139, baslik: "CSS Ön İşlemcileri", durum: "Başlanmadı", secilebilir: true,
                                            children: [
                                                {
                                                    id: 140, baslik: "Sass", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 141, baslik: "Less", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 142, baslik: "CSS Mimarisi & İsimlendirme", durum: "Başlanmadı", secilebilir: true,
                                            children: [
                                                {
                                                    id: 143, baslik: "BEM", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 144, baslik: "OOCSS", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: 9, baslik: "JavaScript", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 10, baslik: "DOM Seçme & Değiştirme", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 145, baslik: "Olay Dinleyicileri (Event Handling)", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 11, baslik: "Promises", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 146, baslik: "Async/Await & Fetch API", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 12, baslik: "ES6+ Özellikleri", durum: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 147, baslik: "Destructuring & Spread/Rest", durum: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 148, baslik: "Modüller (import/export)", durum: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 149, baslik: "Closures & Scope", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 150, baslik: "Event Loop & Asenkron Çalışma Mantığı", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 151, baslik: "Tarayıcı Depolama", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 152, baslik: "localStorage & sessionStorage", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 153, baslik: "Cookies & IndexedDB", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 154, baslik: "Web Güvenliği Temelleri", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 155, baslik: "CORS", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 156, baslik: "XSS & HTTPS Temelleri", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 13, baslik: "Versiyon Kontrolü (Git)", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 157, baslik: "Git Temelleri", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 158, baslik: "İşbirliği & Uzak Depolar", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 14, baslik: "Paket Yöneticileri (npm/pnpm)", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 15, baslik: "CSS Framework'leri", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 76, baslik: "Tailwind", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 77, baslik: "Bootstrap", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 17, baslik: "Frontend Framework", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 80, baslik: "React", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 81, baslik: "Vue", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 82, baslik: "Angular", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 101, baslik: "Durum Yönetimi", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 102, baslik: "Redux Toolkit", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 103, baslik: "Zustand", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 104, baslik: "Pinia", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 16, baslik: "Build Araçları", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 78, baslik: "Vite", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 79, baslik: "Webpack", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 18, baslik: "TypeScript", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 159, baslik: "Temel Tipler & Arayüzler", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 160, baslik: "Generics & Utility Types", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 19, baslik: "Test", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 161, baslik: "Birim Testler (Jest)", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 162, baslik: "Component Testleri (Testing Library)", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 105, baslik: "Uçtan Uca (E2E) Test", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 106, baslik: "Cypress", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 107, baslik: "Playwright", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 163, baslik: "Web Performansı & Optimizasyon", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 164, baslik: "Core Web Vitals", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 165, baslik: "Lazy Loading & Code Splitting", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 20, baslik: "Server Side Rendering (Next.js)", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 166, baslik: "Deployment / Yayına Alma", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 167, baslik: "Netlify", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 168, baslik: "Vercel", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 169, baslik: "GitHub Pages", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 21,
                            baslik: "Backend Developer",
                            durum: "Başlanmadı",
                            baglanti: true,
                            children: [
                                {
                                    id: 22, baslik: "İşletim Sistemi & Terminal Temelleri", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 23, baslik: "Programlama Dili", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 71, baslik: "Node.js", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 72, baslik: "Python", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 73, baslik: "Java", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 74, baslik: "C#", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 75, baslik: "Go", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 170, baslik: "Ruby", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 171, baslik: "PHP", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 13, baslik: "Versiyon Kontrolü (Git)", durum: "Başlanmadı", gizliMi: true,
                                    children: [
                                        {
                                            id: 157, baslik: "Git Temelleri", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 158, baslik: "İşbirliği & Uzak Depolar", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 179, baslik: "Ortam Değişkenleri & Konfigürasyon Yönetimi", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 25, baslik: "İlişkisel Veritabanları", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 83, baslik: "PostgreSQL", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 84, baslik: "MySQL", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 181, baslik: "Veritabanı Migrasyonları", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 26, baslik: "NoSQL Veritabanları", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 85, baslik: "MongoDB", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 86, baslik: "Redis", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 27, baslik: "API Tasarımı", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 28, baslik: "REST", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 29, baslik: "GraphQL", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 180, baslik: "API Dokümantasyonu (Swagger/OpenAPI)", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 30, baslik: "Kimlik Doğrulama & Güvenlik", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 31, baslik: "JWT / OAuth", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 32, baslik: "Güvenlik En İyi Pratikleri", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 174, baslik: "Yetkilendirme (Authorization & RBAC)", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 33, baslik: "Test Stratejileri", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 172, baslik: "Birim Testler (Unit Tests)", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 173, baslik: "Entegrasyon Testleri (Integration Tests)", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 34, baslik: "Önbellekleme (Caching)", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 108, baslik: "Gözlemlenebilirlik (Logging & Monitoring)", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 109, baslik: "ELK Stack", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 110, baslik: "Prometheus & Grafana", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 35, baslik: "Mesaj Kuyrukları", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 87, baslik: "Kafka", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 88, baslik: "RabbitMQ", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 36, baslik: "Docker & Konteynerleştirme", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 175, baslik: "Dockerfile & İmaj Oluşturma", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 176, baslik: "Docker Compose", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 111, baslik: "Kubernetes", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 37, baslik: "CI/CD", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 182, baslik: "Cloud / Deployment Temelleri", durum: "Başlanmadı", secilebilir: true,
                                    children: [
                                        {
                                            id: 183, baslik: "AWS", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 184, baslik: "Google Cloud (GCP)", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 185, baslik: "Azure", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 38, baslik: "Mikroservisler", durum: "Başlanmadı", children: [],
                                },
                                {
                                    id: 39, baslik: "Sistem Tasarımı Temelleri", durum: "Başlanmadı",
                                    children: [
                                        {
                                            id: 177, baslik: "Ölçeklenebilirlik & Yük Dengeleme", durum: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 178, baslik: "Veritabanı Ölçekleme (Sharding & Replication)", durum: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 202, baslik: "Monorepo Araçları", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Frontend ve backend kodunu tek bir repoda, paylaşılan bağımlılıklarla birlikte yönetmeyi sağlayan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 203, baslik: "Turborepo", durum: "Başlanmadı", children: [],
                                    aciklama: "Vercel'in geliştirdiği, hızlı önbellekleme ve paralel build desteğiyle öne çıkan monorepo aracı.",
                                    kaynaklar: ["https://turbo.build/repo/docs"],
                                },
                                {
                                    id: 204, baslik: "Nx", durum: "Başlanmadı", children: [],
                                    aciklama: "Büyük ölçekli monorepo projelerinde bağımlılık grafiği ve görev çalıştırma yönetimi sunan güçlü bir araç.",
                                    kaynaklar: ["https://nx.dev/getting-started/intro"],
                                },
                            ],
                        },
                        {
                            id: 205, baslik: "Uçtan Uca Tip Güvenliği", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Frontend ile backend arasında tipleri paylaşarak API'de derleme zamanında hata yakalamayı sağlayan yaklaşımlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 206, baslik: "tRPC", durum: "Başlanmadı", children: [],
                                    aciklama: "Ayrı bir şema tanımlamadan, TypeScript tipleri üzerinden uçtan uca tip güvenliği sağlayan modern bir yaklaşım.",
                                    kaynaklar: ["https://trpc.io/docs"],
                                },
                                {
                                    id: 207, baslik: "GraphQL Code Generator", durum: "Başlanmadı", children: [],
                                    aciklama: "GraphQL şemasından otomatik olarak TypeScript tipleri üreterek frontend-backend arasında tip güvenliği sağlayan araç.",
                                    kaynaklar: ["https://the-guild.dev/graphql/codegen"],
                                },
                            ],
                        },
                        {
                            id: 199, baslik: "Gerçek Zamanlı İletişim", durum: "Başlanmadı",
                            aciklama: "İstemci ile sunucu arasında anlık, çift yönlü veri akışı sağlayan iletişim yöntemleri.",
                            children: [
                                {
                                    id: 200, baslik: "WebSocket Protokolü", durum: "Başlanmadı", children: [],
                                    aciklama: "Tarayıcı ile sunucu arasında kalıcı, çift yönlü bir bağlantı açan temel iletişim protokolü.",
                                    kaynaklar: ["https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"],
                                },
                                {
                                    id: 201, baslik: "Socket.io", durum: "Başlanmadı", children: [],
                                    aciklama: "WebSocket üzerine kurulu, otomatik yeniden bağlanma ve oda (room) yönetimi gibi ek özellikler sunan popüler gerçek zamanlı iletişim kütüphanesi.",
                                    kaynaklar: ["https://socket.io/docs/v4/"],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 48,
                    baslik: "Android Developer",
                    durum: "Başlanmadı",
                    aciklama: "Android işletim sistemi için mobil uygulama geliştiren rol.",
                    children: [
                        {
                            id: 49, baslik: "Kotlin", durum: "Başlanmadı", children: [],
                            aciklama: "Android'de resmi olarak önerilen, Java ile uyumlu, modern ve özlü programlama dili.",
                            kaynaklar: ["https://kotlinlang.org/docs/home.html"],
                        },
                        {
                            id: 50, baslik: "Android Studio & SDK", durum: "Başlanmadı", children: [],
                            aciklama: "Android uygulaması geliştirmek için kullanılan resmi IDE ve geliştirme araç seti.",
                            kaynaklar: ["https://developer.android.com/studio/intro"],
                        },
                        {
                            id: 187, baslik: "Gradle & Bağımlılık Yönetimi", durum: "Başlanmadı", children: [],
                            aciklama: "Projeyi derleyen, bağımlılıkları yöneten ve build sürecini yapılandıran Android'in resmi build aracı.",
                            kaynaklar: ["https://developer.android.com/build"],
                        },
                        {
                            id: 186, baslik: "Yaşam Döngüsü (Activity & Fragment Lifecycle)", durum: "Başlanmadı", children: [],
                            aciklama: "Bir ekranın oluşturulmasından yok edilmesine kadar geçirdiği aşamaları ve bu aşamalarda yapılması gerekenleri yönetme.",
                            kaynaklar: ["https://developer.android.com/guide/components/activities/activity-lifecycle"],
                        },
                        {
                            id: 51, baslik: "Jetpack Compose", durum: "Başlanmadı",
                            aciklama: "Android için modern, deklaratif arayüz geliştirme kütüphanesi.",
                            children: [
                                {
                                    id: 188, baslik: "State Yönetimi", durum: "Başlanmadı", children: [],
                                    aciklama: "Compose'da arayüzün yeniden çizilmesini tetikleyen remember ve mutableState gibi durum yönetimi araçları.",
                                    kaynaklar: ["https://developer.android.com/jetpack/compose/state"],
                                },
                                {
                                    id: 189, baslik: "Navigation (Compose Navigation)", durum: "Başlanmadı", children: [],
                                    aciklama: "Compose ekranları arasında geçiş yapmayı ve geri yığınını yönetmeyi sağlayan navigasyon kütüphanesi.",
                                    kaynaklar: ["https://developer.android.com/jetpack/compose/navigation"],
                                },
                            ],
                        },
                        {
                            id: 52, baslik: "Mimari Bileşenler", durum: "Başlanmadı",
                            aciklama: "Uygulama mimarisini düzenli ve test edilebilir kılan Android Jetpack bileşenleri.",
                            children: [
                                {
                                    id: 89, baslik: "ViewModel", durum: "Başlanmadı", children: [],
                                    aciklama: "Arayüz verisini yaşam döngüsüne duyarlı şekilde saklayan ve yöneten bileşen.",
                                    kaynaklar: ["https://developer.android.com/topic/libraries/architecture/viewmodel"],
                                },
                                {
                                    id: 90, baslik: "StateFlow", durum: "Başlanmadı", children: [],
                                    aciklama: "Kotlin coroutines ile birlikte kullanılan, gözlemlenebilir durum tutan veri akışı.",
                                    kaynaklar: ["https://developer.android.com/kotlin/flow/stateflow-and-sharedflow"],
                                },
                            ],
                        },
                        {
                            id: 112, baslik: "Eşzamanlılık", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Arka plan işlemlerini yönetmek için kullanılan asenkron programlama yaklaşımları; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 113, baslik: "Coroutines", durum: "Başlanmadı", children: [],
                                    aciklama: "Kotlin'in resmi, hafif ve okunabilir asenkron programlama çözümü.",
                                    kaynaklar: ["https://kotlinlang.org/docs/coroutines-overview.html"],
                                },
                                {
                                    id: 114, baslik: "RxJava", durum: "Başlanmadı", children: [],
                                    aciklama: "Reaktif programlama yaklaşımıyla asenkron veri akışlarını yöneten kütüphane.",
                                    kaynaklar: ["https://github.com/ReactiveX/RxJava"],
                                },
                            ],
                        },
                        {
                            id: 53, baslik: "Bağımlılık Enjeksiyonu", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Bileşenler arası bağımlılıkları dışarıdan yöneterek test edilebilirliği artıran teknik; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 115, baslik: "Hilt", durum: "Başlanmadı", children: [],
                                    aciklama: "Google'ın Android için geliştirdiği, Dagger tabanlı resmi bağımlılık enjeksiyonu kütüphanesi.",
                                    kaynaklar: ["https://developer.android.com/training/dependency-injection/hilt-android"],
                                },
                                {
                                    id: 116, baslik: "Koin", durum: "Başlanmadı", children: [],
                                    aciklama: "Kurulumu basit, Kotlin DSL tabanlı hafif bağımlılık enjeksiyonu kütüphanesi.",
                                    kaynaklar: ["https://insert-koin.io/docs/quickstart/android/"],
                                },
                            ],
                        },
                        {
                            id: 54, baslik: "Ağ İşlemleri (Retrofit)", durum: "Başlanmadı", children: [],
                            aciklama: "Android'de sunucuyla HTTP üzerinden veri alışverişini kolaylaştıran, yaygın kullanılan ağ kütüphanesi.",
                            kaynaklar: ["https://square.github.io/retrofit/"],
                        },
                        {
                            id: 55, baslik: "Yerel Depolama (Room)", durum: "Başlanmadı", children: [],
                            aciklama: "SQLite üzerine kurulu, Android'de yerel veritabanı işlemlerini kolaylaştıran kütüphane.",
                            kaynaklar: ["https://developer.android.com/training/data-storage/room"],
                        },
                        {
                            id: 190, baslik: "Uygulama İzinleri (Permissions)", durum: "Başlanmadı", children: [],
                            aciklama: "Kamera, konum gibi hassas kaynaklara erişim için kullanıcıdan izin isteme ve yönetme süreci.",
                            kaynaklar: ["https://developer.android.com/training/permissions/requesting"],
                        },
                        {
                            id: 56, baslik: "Test", durum: "Başlanmadı",
                            aciklama: "Android uygulamalarında birim ve arayüz testleri yazma pratiği.",
                            children: [
                                {
                                    id: 191, baslik: "Birim Testler (JUnit)", durum: "Başlanmadı", children: [],
                                    aciklama: "İş mantığını ve fonksiyonları izole şekilde test eden Android'in standart birim test çatısı.",
                                    kaynaklar: ["https://developer.android.com/training/testing/local-tests"],
                                },
                                {
                                    id: 192, baslik: "UI Testleri (Espresso/Compose Testing)", durum: "Başlanmadı", children: [],
                                    aciklama: "Kullanıcı arayüzünün beklenen şekilde davrandığını cihaz veya emülatör üzerinde doğrulama.",
                                    kaynaklar: ["https://developer.android.com/training/testing/espresso"],
                                },
                            ],
                        },
                        {
                            id: 193, baslik: "Push Bildirimleri (Firebase Cloud Messaging)", durum: "Başlanmadı", children: [],
                            aciklama: "Uygulama kapalıyken bile kullanıcıya anlık bildirim göndermeyi sağlayan Google'ın bildirim servisi.",
                            kaynaklar: ["https://firebase.google.com/docs/cloud-messaging"],
                        },
                        {
                            id: 57, baslik: "Play Store'a Yayınlama", durum: "Başlanmadı", children: [],
                            aciklama: "Uygulamayı imzalayıp Google Play Store üzerinden kullanıcılara sunma süreci.",
                            kaynaklar: ["https://developer.android.com/studio/publish"],
                        },
                    ],
                },
                {
                    id: 58,
                    baslik: "iOS Developer",
                    durum: "Başlanmadı",
                    aciklama: "Apple'ın iOS işletim sistemi için mobil uygulama geliştiren rol.",
                    children: [
                        {
                            id: 59, baslik: "Swift", durum: "Başlanmadı", children: [],
                            aciklama: "Apple'ın geliştirdiği, güvenli ve modern iOS/macOS uygulama programlama dili.",
                            kaynaklar: ["https://docs.swift.org/swift-book/"],
                        },
                        {
                            id: 60, baslik: "Xcode", durum: "Başlanmadı", children: [],
                            aciklama: "iOS uygulaması geliştirmek için kullanılan Apple'ın resmi geliştirme ortamı.",
                            kaynaklar: ["https://developer.apple.com/documentation/xcode"],
                        },
                        {
                            id: 194, baslik: "Yaşam Döngüsü (App & View Lifecycle)", durum: "Başlanmadı", children: [],
                            aciklama: "Bir view veya uygulamanın açılışından kapanışına kadar geçirdiği aşamaları ve bu aşamalarda yapılması gerekenleri yönetme.",
                            kaynaklar: ["https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle"],
                        },
                        {
                            id: 61, baslik: "UI Framework", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Arayüz geliştirmek için kullanılan framework; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 91, baslik: "UIKit", durum: "Başlanmadı", children: [],
                                    aciklama: "Imperative yaklaşımla arayüz kuran, iOS'un köklü ve hâlâ yaygın kullanılan arayüz framework'ü.",
                                    kaynaklar: ["https://developer.apple.com/documentation/uikit"],
                                },
                                {
                                    id: 92, baslik: "SwiftUI", durum: "Başlanmadı",
                                    aciklama: "Apple'ın modern, deklaratif arayüz geliştirme framework'ü.",
                                    children: [
                                        {
                                            id: 195, baslik: "State Yönetimi", durum: "Başlanmadı", children: [],
                                            aciklama: "SwiftUI'da arayüzün yeniden çizilmesini tetikleyen @State ve @Binding gibi durum yönetimi araçları.",
                                            kaynaklar: ["https://developer.apple.com/documentation/swiftui/state"],
                                        },
                                        {
                                            id: 196, baslik: "Navigation (NavigationStack)", durum: "Başlanmadı", children: [],
                                            aciklama: "SwiftUI ekranları arasında geçiş yapmayı ve geri yığınını yönetmeyi sağlayan navigasyon API'si.",
                                            kaynaklar: ["https://developer.apple.com/documentation/swiftui/navigationstack"],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 62, baslik: "Mimari Desenler", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Uygulama kodunu düzenlemek için kullanılan mimari yaklaşımlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 93, baslik: "MVVM", durum: "Başlanmadı", children: [],
                                    aciklama: "Görünüm ile iş mantığını ViewModel katmanıyla ayıran, SwiftUI ile sık kullanılan mimari desen.",
                                    kaynaklar: ["https://www.hackingwithswift.com/books/ios-swiftui/introducing-mvvm-into-your-swiftui-project"],
                                },
                                {
                                    id: 94, baslik: "MVC", durum: "Başlanmadı", children: [],
                                    aciklama: "Apple'ın geleneksel olarak önerdiği, Model-View-Controller tabanlı klasik mimari desen.",
                                    kaynaklar: ["https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html"],
                                },
                            ],
                        },
                        {
                            id: 117, baslik: "Eşzamanlılık", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Arka plan işlemlerini yönetmek için kullanılan asenkron programlama yaklaşımları; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 118, baslik: "Swift Concurrency (async/await)", durum: "Başlanmadı", children: [],
                                    aciklama: "Swift'in resmi, yapılandırılmış asenkron programlama modeli.",
                                    kaynaklar: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/"],
                                },
                                {
                                    id: 119, baslik: "Combine", durum: "Başlanmadı", children: [],
                                    aciklama: "Apple'ın reaktif programlama yaklaşımıyla asenkron veri akışlarını yöneten framework'ü.",
                                    kaynaklar: ["https://developer.apple.com/documentation/combine"],
                                },
                            ],
                        },
                        {
                            id: 63, baslik: "Ağ İşlemleri", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Sunucuyla HTTP üzerinden veri alışverişi yapmak için kullanılan yöntemler; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 95, baslik: "URLSession", durum: "Başlanmadı", children: [],
                                    aciklama: "Apple'ın yerleşik, ek kütüphane gerektirmeyen ağ istekleri API'si.",
                                    kaynaklar: ["https://developer.apple.com/documentation/foundation/urlsession"],
                                },
                                {
                                    id: 96, baslik: "Alamofire", durum: "Başlanmadı", children: [],
                                    aciklama: "URLSession üzerine kurulu, kullanımı daha kolay popüler ağ kütüphanesi.",
                                    kaynaklar: ["https://github.com/Alamofire/Alamofire"],
                                },
                            ],
                        },
                        {
                            id: 64, baslik: "Yerel Depolama", durum: "Başlanmadı",
                            aciklama: "Uygulama verisini cihaz üzerinde saklamak için kullanılan yöntemler.",
                            children: [
                                {
                                    id: 97, baslik: "CoreData", durum: "Başlanmadı", children: [],
                                    aciklama: "Apple'ın nesne grafiği ve kalıcı veri yönetimi için sunduğu framework.",
                                    kaynaklar: ["https://developer.apple.com/documentation/coredata"],
                                },
                                {
                                    id: 98, baslik: "UserDefaults", durum: "Başlanmadı", children: [],
                                    aciklama: "Küçük ölçekli ayar ve tercihleri basitçe saklamak için kullanılan anahtar-değer deposu.",
                                    kaynaklar: ["https://developer.apple.com/documentation/foundation/userdefaults"],
                                },
                            ],
                        },
                        {
                            id: 197, baslik: "Uygulama İzinleri (Permissions)", durum: "Başlanmadı", children: [],
                            aciklama: "Kamera, konum gibi hassas kaynaklara erişim için Info.plist üzerinden izin tanımlama ve kullanıcıdan izin isteme süreci.",
                            kaynaklar: ["https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy/requesting_access_to_protected_resources"],
                        },
                        {
                            id: 65, baslik: "Bağımlılık Yönetimi", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "Projeye üçüncü parti kütüphaneleri eklemek için kullanılan paket yönetim araçları; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 99, baslik: "CocoaPods", durum: "Başlanmadı", children: [],
                                    aciklama: "iOS ekosisteminde uzun süredir yaygın kullanılan bağımlılık yöneticisi.",
                                    kaynaklar: ["https://guides.cocoapods.org/"],
                                },
                                {
                                    id: 100, baslik: "SPM", durum: "Başlanmadı", children: [],
                                    aciklama: "Apple'ın resmi, Xcode'a gömülü Swift Package Manager'ı.",
                                    kaynaklar: ["https://www.swift.org/documentation/package-manager/"],
                                },
                            ],
                        },
                        {
                            id: 66, baslik: "Test", durum: "Başlanmadı", secilebilir: true,
                            aciklama: "iOS uygulamalarını test etmek için kullanılan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 120, baslik: "XCTest", durum: "Başlanmadı", children: [],
                                    aciklama: "Apple'ın Xcode'a gömülü resmi birim ve arayüz test framework'ü.",
                                    kaynaklar: ["https://developer.apple.com/documentation/xctest"],
                                },
                                {
                                    id: 121, baslik: "Quick & Nimble", durum: "Başlanmadı", children: [],
                                    aciklama: "Daha okunabilir, davranış odaklı test yazmayı sağlayan popüler üçüncü parti test kütüphaneleri.",
                                    kaynaklar: ["https://github.com/Quick/Quick"],
                                },
                            ],
                        },
                        {
                            id: 198, baslik: "Push Bildirimleri (APNs)", durum: "Başlanmadı", children: [],
                            aciklama: "Uygulama kapalıyken bile kullanıcıya anlık bildirim göndermeyi sağlayan Apple'ın bildirim servisi.",
                            kaynaklar: ["https://developer.apple.com/documentation/usernotifications"],
                        },
                        {
                            id: 67, baslik: "App Store'a Gönderim", durum: "Başlanmadı", children: [],
                            aciklama: "Uygulamayı imzalayıp App Store Connect üzerinden inceleme ve yayına gönderme süreci.",
                            kaynaklar: ["https://developer.apple.com/app-store/submissions/"],
                        },
                    ],
                },
            ],

            setRoadmaps: (roadmaps) => set({ roadmaps }),
            updateDurum: (id, yeniDurum) => set((state) => ({
                roadmaps: durumGuncelle(state.roadmaps, id, yeniDurum)
            })),

            konuEkle: (parentId, baslik) => set((state) => {
                const yeniKonu: RoadmapNode = {
                    id: Date.now(),
                    baslik: baslik,
                    durum: "Başlanmadı",
                    children: [],
                };
                return { roadmaps: konuEkleYardimci(state.roadmaps, parentId, yeniKonu) };
            }),

            roadmapEkle: (baslik) => set((state) => {
                const yeniRoadmap: RoadmapNode = {
                    id: Date.now(),
                    baslik: baslik,
                    durum: "Başlanmadı",
                    children: [],
                };
                return { roadmaps: [...state.roadmaps, yeniRoadmap] };
            }),

            konuSil: (id) => set((state) => ({
                roadmaps: konuSilYardimci(state.roadmaps, id)
            })),
        }),

        {
            name: 'roadmap-storage-26',
        }
    )
);

export function konuBul(nodes: RoadmapNode[], id: number): RoadmapNode | undefined {
    for (const node of nodes) {
        if (node.id === id) {
            return node;
        }
        const bulunan = konuBul(node.children, id);
        if (bulunan) {
            return bulunan;
        }
    }
    return undefined;
}
