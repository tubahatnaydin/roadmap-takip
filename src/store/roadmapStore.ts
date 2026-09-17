import { persist } from 'zustand/middleware'
import type { RoadmapNode, Status } from '../types'
import { create } from 'zustand'

interface RoadmapStore {
    roadmaps: RoadmapNode[];
    setRoadmaps: (roadmaps: RoadmapNode[]) => void;
    updateStatus: (id: number, newStatus: Status) => void;
    addTopic: (parentId: number, title: string) => void;
    addRoadmap: (title: string) => void;
    deleteTopic: (id: number) => void;
}

function updateWholeTree(node: RoadmapNode, newStatus: Status): RoadmapNode {

    return {
        ...node,
        status: newStatus,
        children: node.children.map((child) => updateWholeTree(child, newStatus)),
    };
}

function updateStatusInTree(nodes: RoadmapNode[], id: number, newStatus: Status): RoadmapNode[] {

    return nodes.map((node) => {
        if (node.id === id) {
            return updateWholeTree(node, newStatus);
        }
        else {
            return {...node, children: updateStatusInTree(node.children, id, newStatus)};
        }
    });
}

function addTopicHelper(nodes: RoadmapNode[], parentId: number, newTopic: RoadmapNode): RoadmapNode[] {
    return nodes.map((node) => {
        if (node.id === parentId) {
            return { ...node, children: [...node.children, newTopic] };
        }
        else {
            return { ...node, children: addTopicHelper(node.children, parentId, newTopic) };
        }
    });
}

function deleteTopicHelper(nodes: RoadmapNode[], id: number): RoadmapNode[] {
    return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({ ...node, children: deleteTopicHelper(node.children, id) }));
}

export const useRoadmapStore = create<RoadmapStore>()(
    persist(
        (set) => ({

            roadmaps: [
                {
                    id: 1,
                    title: "Frontend Developer",
                    status: "Başlanmadı",
                    description: "Web tarayıcısında çalışan, kullanıcının doğrudan gördüğü ve etkileşime girdiği arayüzleri geliştiren rol.",
                    children: [
                        {
                            id: 2, title: "İnternet", status: "Başlanmadı",
                            description: "Web'in arka planda nasıl çalıştığını anlamak için gereken temel ağ kavramları.",
                            children: [
                                {
                                    id: 68, title: "HTTP", status: "Başlanmadı", children: [],
                                    description: "Tarayıcı ile sunucu arasındaki istek/cevap iletişimini tanımlayan protokol.",
                                    resources: ["https://developer.mozilla.org/tr/docs/Web/HTTP"],
                                },
                                {
                                    id: 69, title: "Tarayıcılar Nasıl Çalışır", status: "Başlanmadı", children: [],
                                    description: "Bir URL'ye gidildiğinde tarayıcının sayfayı nasıl işleyip ekrana çizdiği.",
                                    resources: ["https://web.dev/articles/howbrowserswork"],
                                },
                                {
                                    id: 70, title: "DNS", status: "Başlanmadı", children: [],
                                    description: "Alan adlarını IP adreslerine çeviren isim çözümleme sistemi.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Glossary/DNS"],
                                },
                            ],
                        },
                        {
                            id: 3, title: "HTML", status: "Başlanmadı",
                            description: "Web sayfalarının içeriğini ve yapısını (iskeletini) tanımlayan işaretleme dili.",
                            children: [
                                {
                                    id: 4, title: "Semantik HTML", status: "Başlanmadı",
                                    description: "İçeriğin anlamını doğru etiketlerle (header, nav, article vb.) ifade etmek.",
                                    children: [
                                        {
                                            id: 122, title: "Semantik Etiketler", status: "Başlanmadı", children: [],
                                            description: "header, nav, main, article, section, footer gibi anlam taşıyan HTML etiketlerini doğru yerde kullanmak.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Glossary/Semantics"],
                                        },
                                        {
                                            id: 123, title: "Başlık Hiyerarşisi & Doküman Yapısı", status: "Başlanmadı", children: [],
                                            description: "h1-h6 başlıklarını doğru sırayla kullanarak sayfaya mantıklı bir doküman yapısı kazandırmak.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements"],
                                        },
                                    ],
                                },
                                {
                                    id: 5, title: "Formlar", status: "Başlanmadı",
                                    description: "Kullanıcıdan veri almak için form elemanlarını kurmak ve doğrulamak.",
                                    children: [
                                        {
                                            id: 124, title: "Form Elemanları & Türleri", status: "Başlanmadı", children: [],
                                            description: "input, select, textarea gibi form elemanlarını ve türlerini (email, date, number vb.) kullanmak.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Learn/Forms"],
                                        },
                                        {
                                            id: 125, title: "Form Doğrulama (Validation)", status: "Başlanmadı", children: [],
                                            description: "Kullanıcının girdiği verinin doğruluğunu tarayıcı üzerinde veya JavaScript ile kontrol etmek.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation"],
                                        },
                                    ],
                                },
                                {
                                    id: 126, title: "Erişilebilirlik (a11y)", status: "Başlanmadı",
                                    description: "Sitenin ekran okuyucu kullananlar dahil herkes tarafından kullanılabilir olmasını sağlamak.",
                                    children: [
                                        {
                                            id: 127, title: "ARIA Rolleri", status: "Başlanmadı", children: [],
                                            description: "HTML elemanlarına ekran okuyucular için ek anlam ve rol kazandıran ARIA öznitelikleri.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA"],
                                        },
                                        {
                                            id: 128, title: "Klavye ile Kullanılabilirlik", status: "Başlanmadı", children: [],
                                            description: "Siteyi fare kullanmadan sadece klavye ile gezilebilir hale getirmek.",
                                            resources: ["https://webaim.org/techniques/keyboard/"],
                                        },
                                    ],
                                },
                                {
                                    id: 129, title: "SEO Temelleri", status: "Başlanmadı",
                                    description: "Arama motorlarının siteni doğru anlayıp sıralayabilmesi için gereken temel uygulamalar.",
                                    children: [
                                        {
                                            id: 130, title: "Meta Etiketler & Open Graph", status: "Başlanmadı", children: [],
                                            description: "Sayfa başlığı, açıklaması ve sosyal medya paylaşım görselleri için meta etiketleri.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta", "https://ogp.me/"],
                                        },
                                        {
                                            id: 131, title: "Semantik SEO", status: "Başlanmadı", children: [],
                                            description: "Doğru başlık hiyerarşisi ve semantik etiketlerle arama motorlarına sayfa içeriğini net anlatmak.",
                                            resources: ["https://developers.google.com/search/docs/fundamentals/seo-starter-guide"],
                                        },
                                    ],
                                },
                                {
                                    id: 132, title: "Tarayıcı Geliştirici Araçları (DevTools)", status: "Başlanmadı", children: [],
                                    description: "Tarayıcının Elements, Console, Network gibi panelleriyle HTML/CSS/JS'i inceleme ve hata ayıklama pratiği.",
                                    resources: ["https://developer.chrome.com/docs/devtools/"],
                                },
                            ],
                        },
                        {
                            id: 6, title: "CSS", status: "Başlanmadı",
                            description: "Web sayfalarının görsel tasarımını, renklerini ve düzenini tanımlayan stil dili.",
                            children: [
                                {
                                    id: 7, title: "Flexbox", status: "Başlanmadı", children: [],
                                    description: "Öğeleri tek eksende (satır veya sütun) esnek şekilde hizalamak için kullanılan CSS düzenleme sistemi.",
                                    resources: ["https://css-tricks.com/snippets/css/a-guide-to-flexbox/"],
                                },
                                {
                                    id: 133, title: "CSS Grid", status: "Başlanmadı", children: [],
                                    description: "Öğeleri iki eksende (satır ve sütun) ızgara düzeninde konumlandıran CSS sistemi.",
                                    resources: ["https://css-tricks.com/snippets/css/complete-guide-grid/"],
                                },
                                {
                                    id: 8, title: "Responsive Tasarım", status: "Başlanmadı",
                                    description: "Sitenin farklı ekran boyutlarında düzgün görünmesini sağlamak.",
                                    children: [
                                        {
                                            id: 134, title: "Media Queries", status: "Başlanmadı", children: [],
                                            description: "Ekran genişliğine göre farklı CSS kuralları uygulamayı sağlayan CSS özelliği.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries"],
                                        },
                                        {
                                            id: 135, title: "Mobile-First Yaklaşım", status: "Başlanmadı", children: [],
                                            description: "Önce mobil ekran için tasarlayıp sonra büyük ekranlara doğru genişletme stratejisi.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_responsive_design/Mobile_first"],
                                        },
                                    ],
                                },
                                {
                                    id: 136, title: "CSS Animasyonları", status: "Başlanmadı",
                                    description: "Öğelere hareket ve geçiş efektleri kazandıran CSS özellikleri.",
                                    children: [
                                        {
                                            id: 137, title: "Transitions", status: "Başlanmadı", children: [],
                                            description: "Bir CSS özelliğinin değerinin zaman içinde yumuşak geçişle değişmesini sağlar.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions"],
                                        },
                                        {
                                            id: 138, title: "Keyframe Animasyonları", status: "Başlanmadı", children: [],
                                            description: "@keyframes ile birden fazla adımdan oluşan daha karmaşık animasyonlar tanımlamak.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations"],
                                        },
                                    ],
                                },
                                {
                                    id: 139, title: "CSS Ön İşlemcileri", status: "Başlanmadı", selectable: true,
                                    description: "CSS'e değişken, iç içe kurallar gibi programatik özellikler kazandıran araçlar; ikisinden birini öğrenmen yeterli.",
                                    children: [
                                        {
                                            id: 140, title: "Sass", status: "Başlanmadı", children: [],
                                            description: "Değişkenler, iç içe kurallar ve mixin'lerle CSS yazımını kolaylaştıran en yaygın CSS ön işlemcisi.",
                                            resources: ["https://sass-lang.com/documentation/"],
                                        },
                                        {
                                            id: 141, title: "Less", status: "Başlanmadı", children: [],
                                            description: "Sass'a benzer, JavaScript tabanlı projelerde de sık kullanılan bir diğer CSS ön işlemcisi.",
                                            resources: ["https://lesscss.org/"],
                                        },
                                    ],
                                },
                                {
                                    id: 142, title: "CSS Mimarisi & İsimlendirme", status: "Başlanmadı", selectable: true,
                                    description: "Büyüyen projelerde CSS'i düzenli ve çakışmasız tutmak için kullanılan isimlendirme metodolojileri; ikisinden birini öğrenmen yeterli.",
                                    children: [
                                        {
                                            id: 143, title: "BEM", status: "Başlanmadı", children: [],
                                            description: "Block-Element-Modifier mantığıyla CSS sınıflarını tutarlı isimlendiren en yaygın metodoloji.",
                                            resources: ["http://getbem.com/"],
                                        },
                                        {
                                            id: 144, title: "OOCSS", status: "Başlanmadı", children: [],
                                            description: "Yapı ve görünümü birbirinden ayırarak tekrar kullanılabilir CSS yazmayı hedefleyen yaklaşım.",
                                            resources: ["https://github.com/stubbornella/oocss/wiki"],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 9, title: "JavaScript", status: "Başlanmadı",
                            description: "Web sayfalarına etkileşim, dinamik davranış ve mantık kazandıran programlama dili.",
                            children: [
                                {
                                    id: 10, title: "DOM Seçme & Değiştirme", status: "Başlanmadı", children: [],
                                    description: "JavaScript ile sayfadaki HTML öğelerini seçmek, içeriğini okumak ve değiştirmek.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model"],
                                },
                                {
                                    id: 145, title: "Olay Dinleyicileri (Event Handling)", status: "Başlanmadı", children: [],
                                    description: "Kullanıcının tıklama, yazma gibi eylemlerini dinleyip bunlara tepki veren fonksiyonlar tanımlamak.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"],
                                },
                                {
                                    id: 11, title: "Promises", status: "Başlanmadı", children: [],
                                    description: "Asenkron bir işlemin sonucunu (başarı/hata) temsil eden, zincirlenebilir JavaScript nesnesi.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"],
                                },
                                {
                                    id: 146, title: "Async/Await & Fetch API", status: "Başlanmadı", children: [],
                                    description: "Promise tabanlı kodu daha okunabilir yazmayı sağlayan sözdizimi ve sunucudan veri çekmek için kullanılan Fetch API.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"],
                                },
                                {
                                    id: 12, title: "ES6+ Özellikleri", status: "Başlanmadı",
                                    description: "Modern JavaScript'e eklenen, günlük yazımı kolaylaştıran sözdizimi özellikleri.",
                                    children: [
                                        {
                                            id: 147, title: "Destructuring & Spread/Rest", status: "Başlanmadı", children: [],
                                            description: "Nesne/dizilerden değer çıkarmayı ve birleştirmeyi kolaylaştıran modern sözdizimi.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment"],
                                        },
                                        {
                                            id: 148, title: "Modüller (import/export)", status: "Başlanmadı", children: [],
                                            description: "Kodu dosyalara bölüp import/export ile paylaşmayı sağlayan JavaScript modül sistemi.",
                                            resources: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"],
                                        },
                                    ],
                                },
                                {
                                    id: 149, title: "Closures & Scope", status: "Başlanmadı", children: [],
                                    description: "Bir fonksiyonun, tanımlandığı ortamdaki değişkenleri hatırlamasını sağlayan temel JavaScript kavramı.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"],
                                },
                                {
                                    id: 150, title: "Event Loop & Asenkron Çalışma Mantığı", status: "Başlanmadı", children: [],
                                    description: "JavaScript'in tek iş parçacığıyla asenkron kodu nasıl sıraya koyup çalıştırdığını anlamak.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop"],
                                },
                            ],
                        },
                        {
                            id: 151, title: "Tarayıcı Depolama", status: "Başlanmadı",
                            description: "Verinin kullanıcının tarayıcısında saklanmasını sağlayan farklı depolama yöntemleri.",
                            children: [
                                {
                                    id: 152, title: "localStorage & sessionStorage", status: "Başlanmadı", children: [],
                                    description: "Basit anahtar-değer verisini tarayıcıda kalıcı veya oturum boyunca saklamak.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"],
                                },
                                {
                                    id: 153, title: "Cookies & IndexedDB", status: "Başlanmadı", children: [],
                                    description: "Sunucuyla paylaşılan küçük veri parçaları (cookie) ve tarayıcıda daha büyük yapılandırılmış veri saklayan IndexedDB.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"],
                                },
                            ],
                        },
                        {
                            id: 154, title: "Web Güvenliği Temelleri", status: "Başlanmadı",
                            description: "Frontend tarafında bilinmesi gereken temel web güvenliği kavramları.",
                            children: [
                                {
                                    id: 155, title: "CORS", status: "Başlanmadı", children: [],
                                    description: "Tarayıcının farklı kaynaklardan (origin) gelen isteklere getirdiği güvenlik kısıtlaması.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"],
                                },
                                {
                                    id: 156, title: "XSS & HTTPS Temelleri", status: "Başlanmadı", children: [],
                                    description: "Zararlı script enjeksiyonundan (XSS) korunma ve güvenli bağlantı (HTTPS) temelleri.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS"],
                                },
                            ],
                        },
                        {
                            id: 13, title: "Versiyon Kontrolü (Git)", status: "Başlanmadı",
                            description: "Kod değişikliklerini takip etmeye ve ekip halinde çalışmaya yarayan versiyon kontrol sistemi.",
                            children: [
                                {
                                    id: 157, title: "Git Temelleri", status: "Başlanmadı", children: [],
                                    description: "commit, branch, merge gibi temel Git komutlarıyla değişiklikleri takip etmek.",
                                    resources: ["https://git-scm.com/book/tr/v2/Ba%C5%9Flarken-Git-Temelleri"],
                                },
                                {
                                    id: 158, title: "İşbirliği & Uzak Depolar", status: "Başlanmadı", children: [],
                                    description: "GitHub gibi platformlarda uzak depo kullanmak, pull request açmak ve ekip halinde çalışmak.",
                                    resources: ["https://docs.github.com/en/pull-requests"],
                                },
                            ],
                        },
                        {
                            id: 14, title: "Paket Yöneticileri (npm/pnpm)", status: "Başlanmadı", children: [],
                            description: "Projeye üçüncü parti kütüphaneleri kurmayı ve sürümlerini yönetmeyi sağlayan araçlar.",
                            resources: ["https://docs.npmjs.com/", "https://pnpm.io/motivation"],
                        },
                        {
                            id: 15, title: "CSS Framework'leri", status: "Başlanmadı", selectable: true,
                            description: "Hazır stil ve bileşenlerle hızlı arayüz geliştirmeyi sağlayan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 76, title: "Tailwind", status: "Başlanmadı", children: [],
                                    description: "Hazır CSS sınıflarını HTML içinde birleştirerek hızlı arayüz kurmayı sağlayan utility-first framework.",
                                    resources: ["https://tailwindcss.com/docs"],
                                },
                                {
                                    id: 77, title: "Bootstrap", status: "Başlanmadı", children: [],
                                    description: "Hazır bileşen (buton, kart, grid vb.) kütüphanesiyle hızlıca arayüz kurmayı sağlayan klasik CSS framework.",
                                    resources: ["https://getbootstrap.com/docs/"],
                                },
                            ],
                        },
                        {
                            id: 17, title: "Frontend Framework", status: "Başlanmadı", selectable: true,
                            description: "Component tabanlı arayüz geliştirmeyi sağlayan kütüphane/framework; üçünden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 80, title: "React", status: "Başlanmadı", children: [],
                                    description: "Facebook'un geliştirdiği, en yaygın kullanılan component tabanlı arayüz kütüphanesi.",
                                    resources: ["https://react.dev/learn"],
                                },
                                {
                                    id: 81, title: "Vue", status: "Başlanmadı", children: [],
                                    description: "Öğrenmesi kolay, aşamalı olarak benimsenebilen bir frontend framework.",
                                    resources: ["https://vuejs.org/guide/introduction.html"],
                                },
                                {
                                    id: 82, title: "Angular", status: "Başlanmadı", children: [],
                                    description: "Google'ın geliştirdiği, kurumsal projelerde sık tercih edilen kapsamlı framework.",
                                    resources: ["https://angular.dev/overview"],
                                },
                            ],
                        },
                        {
                            id: 101, title: "Durum Yönetimi", status: "Başlanmadı", selectable: true,
                            description: "Uygulama genelinde paylaşılan verinin yönetimini kolaylaştıran kütüphaneler; seçtiğin framework'e göre birini tercih edebilirsin.",
                            children: [
                                {
                                    id: 102, title: "Redux Toolkit", status: "Başlanmadı", children: [],
                                    description: "React ile en yaygın kullanılan, öngörülebilir ve merkezi state yönetim kütüphanesi.",
                                    resources: ["https://redux-toolkit.js.org/introduction/getting-started"],
                                },
                                {
                                    id: 103, title: "Zustand", status: "Başlanmadı", children: [],
                                    description: "React için minimal, az kod gerektiren, kolay öğrenilen bir state yönetim kütüphanesi (bu projenin kendisi de Zustand kullanıyor).",
                                    resources: ["https://github.com/pmndrs/zustand"],
                                },
                                {
                                    id: 104, title: "Pinia", status: "Başlanmadı", children: [],
                                    description: "Vue'nun resmi, TypeScript dostu state yönetim kütüphanesi.",
                                    resources: ["https://pinia.vuejs.org/introduction.html"],
                                },
                            ],
                        },
                        {
                            id: 16, title: "Build Araçları", status: "Başlanmadı", selectable: true,
                            description: "Kodu tarayıcı için paketleyen ve geliştirme sürecini hızlandıran araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 78, title: "Vite", status: "Başlanmadı", children: [],
                                    description: "Hızlı başlatma ve anlık yenileme sunan modern, yaygın tercih edilen build aracı.",
                                    resources: ["https://vitejs.dev/guide/"],
                                },
                                {
                                    id: 79, title: "Webpack", status: "Başlanmadı", children: [],
                                    description: "Daha eski ama hâlâ yaygın kullanılan, esnek yapılandırmalı modül paketleyici.",
                                    resources: ["https://webpack.js.org/concepts/"],
                                },
                            ],
                        },
                        {
                            id: 18, title: "TypeScript", status: "Başlanmadı",
                            description: "JavaScript'e statik tip denetimi ekleyen, hataları erken yakalamaya yardımcı olan dil.",
                            children: [
                                {
                                    id: 159, title: "Temel Tipler & Arayüzler", status: "Başlanmadı", children: [],
                                    description: "string, number, boolean gibi temel tipler ve nesne şeklini tanımlayan interface'ler.",
                                    resources: ["https://www.typescriptlang.org/docs/handbook/2/basic-types.html"],
                                },
                                {
                                    id: 160, title: "Generics & Utility Types", status: "Başlanmadı", children: [],
                                    description: "Farklı tiplerle çalışabilen yeniden kullanılabilir yapılar ve hazır yardımcı tipler.",
                                    resources: ["https://www.typescriptlang.org/docs/handbook/2/generics.html"],
                                },
                            ],
                        },
                        {
                            id: 19, title: "Test", status: "Başlanmadı",
                            description: "Fonksiyon ve component'lerin beklendiği gibi çalıştığını otomatik olarak doğrulamak.",
                            children: [
                                {
                                    id: 161, title: "Birim Testler (Jest)", status: "Başlanmadı", children: [],
                                    description: "Fonksiyonların ve modüllerin çıktısını izole şekilde test eden JavaScript test çalıştırıcısı.",
                                    resources: ["https://jestjs.io/docs/getting-started"],
                                },
                                {
                                    id: 162, title: "Component Testleri (Testing Library)", status: "Başlanmadı", children: [],
                                    description: "React gibi framework'lerde component'leri kullanıcı davranışına yakın şekilde test etmeyi sağlayan kütüphane.",
                                    resources: ["https://testing-library.com/docs/"],
                                },
                            ],
                        },
                        {
                            id: 105, title: "Uçtan Uca (E2E) Test", status: "Başlanmadı", selectable: true,
                            description: "Uygulamayı gerçek bir kullanıcı gibi baştan sona test eden araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 106, title: "Cypress", status: "Başlanmadı", children: [],
                                    description: "Tarayıcıda gerçek kullanıcı senaryolarını test etmek için yaygın kullanılan araç.",
                                    resources: ["https://docs.cypress.io/"],
                                },
                                {
                                    id: 107, title: "Playwright", status: "Başlanmadı", children: [],
                                    description: "Birden fazla tarayıcıda hızlı ve güvenilir uçtan uca test yazmayı sağlayan Microsoft aracı.",
                                    resources: ["https://playwright.dev/docs/intro"],
                                },
                            ],
                        },
                        {
                            id: 163, title: "Web Performansı & Optimizasyon", status: "Başlanmadı",
                            description: "Sayfanın hızlı yüklenmesini ve akıcı çalışmasını sağlayan optimizasyon teknikleri.",
                            children: [
                                {
                                    id: 164, title: "Core Web Vitals", status: "Başlanmadı", children: [],
                                    description: "Google'ın sayfa deneyimini ölçtüğü LCP, INP ve CLS gibi temel performans metrikleri.",
                                    resources: ["https://web.dev/articles/vitals"],
                                },
                                {
                                    id: 165, title: "Lazy Loading & Code Splitting", status: "Başlanmadı", children: [],
                                    description: "Gerekli olmayan kodu/görselleri ihtiyaç anına kadar geciktirerek ilk yükleme süresini kısaltmak.",
                                    resources: ["https://web.dev/articles/code-splitting-with-dynamic-imports-in-webpack"],
                                },
                            ],
                        },
                        {
                            id: 20, title: "Server Side Rendering (Next.js)", status: "Başlanmadı", children: [],
                            description: "Sayfaların sunucuda önceden render edilmesini sağlayan, React tabanlı en yaygın framework.",
                            resources: ["https://nextjs.org/docs"],
                        },
                        {
                            id: 166, title: "Deployment / Yayına Alma", status: "Başlanmadı", selectable: true,
                            description: "Geliştirilen siteyi internete açık hale getirmek için kullanılan barındırma platformları; birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 167, title: "Netlify", status: "Başlanmadı", children: [],
                                    description: "Statik ve modern frontend projelerini kolayca yayınlamayı sağlayan popüler barındırma platformu.",
                                    resources: ["https://docs.netlify.com/"],
                                },
                                {
                                    id: 168, title: "Vercel", status: "Başlanmadı", children: [],
                                    description: "Next.js'i geliştiren ekibin sunduğu, özellikle Next.js projeleriyle birebir uyumlu barındırma platformu.",
                                    resources: ["https://vercel.com/docs"],
                                },
                                {
                                    id: 169, title: "GitHub Pages", status: "Başlanmadı", children: [],
                                    description: "GitHub deposundan doğrudan ücretsiz statik site yayınlamayı sağlayan basit yöntem.",
                                    resources: ["https://docs.github.com/en/pages"],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 21,
                    title: "Backend Developer",
                    status: "Başlanmadı",
                    description: "Sunucu tarafında çalışan, veri işleme, iş mantığı ve veritabanı yönetiminden sorumlu rol.",
                    children: [
                        {
                            id: 22, title: "İşletim Sistemi & Terminal Temelleri", status: "Başlanmadı", children: [],
                            description: "Sunucu ortamlarında sıkça kullanılan Linux/Unix komut satırı ve temel işletim sistemi kavramları.",
                            resources: ["https://ubuntu.com/tutorials/command-line-for-beginners", "https://linuxjourney.com/"],
                        },
                        {
                            id: 23, title: "Programlama Dili", status: "Başlanmadı", selectable: true,
                            description: "Backend geliştirmede kullanılan ana programlama dili; bunlardan birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 71, title: "Node.js", status: "Başlanmadı", children: [],
                                    description: "JavaScript'i sunucu tarafında çalıştıran, geniş paket ekosistemine sahip runtime.",
                                    resources: ["https://nodejs.org/en/docs"],
                                },
                                {
                                    id: 72, title: "Python", status: "Başlanmadı", children: [],
                                    description: "Okunabilirliği yüksek, hızlı geliştirme sağlayan, Django/Flask gibi framework'lere sahip dil.",
                                    resources: ["https://docs.python.org/3/"],
                                },
                                {
                                    id: 73, title: "Java", status: "Başlanmadı", children: [],
                                    description: "Kurumsal projelerde yaygın kullanılan, Spring ekosistemiyle güçlü statik tipli bir dil.",
                                    resources: ["https://docs.oracle.com/en/java/"],
                                },
                                {
                                    id: 74, title: "C#", status: "Başlanmadı", children: [],
                                    description: ".NET ekosistemiyle kurumsal uygulamalar geliştirmek için kullanılan Microsoft dili.",
                                    resources: ["https://learn.microsoft.com/en-us/dotnet/csharp/"],
                                },
                                {
                                    id: 75, title: "Go", status: "Başlanmadı", children: [],
                                    description: "Basit söz dizimi ve yüksek performansıyla mikroservislerde tercih edilen Google dili.",
                                    resources: ["https://go.dev/doc/"],
                                },
                                {
                                    id: 170, title: "Ruby", status: "Başlanmadı", children: [],
                                    description: "Rails framework'üyle hızlı ve okunabilir web uygulamaları geliştirmeyi sağlayan, geliştirici dostu bir dil.",
                                    resources: ["https://www.ruby-lang.org/en/documentation/", "https://guides.rubyonrails.org/"],
                                },
                                {
                                    id: 171, title: "PHP", status: "Başlanmadı", children: [],
                                    description: "Laravel gibi framework'lerle web geliştirmede yaygın kullanılan, öğrenmesi kolay bir sunucu tarafı dili.",
                                    resources: ["https://www.php.net/docs.php", "https://laravel.com/docs"],
                                },
                            ],
                        },
                        {
                            id: 13, title: "Versiyon Kontrolü (Git)", status: "Başlanmadı",
                            children: [
                                {
                                    id: 157, title: "Git Temelleri", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 158, title: "İşbirliği & Uzak Depolar", status: "Başlanmadı", children: [],
                                },
                            ],
                        },
                        {
                            id: 179, title: "Ortam Değişkenleri & Konfigürasyon Yönetimi", status: "Başlanmadı", children: [],
                            description: "Uygulamanın veritabanı bağlantısı, API anahtarları gibi ortama özgü ayarlarını kod dışında, güvenli şekilde yönetme pratiği.",
                            resources: ["https://12factor.net/config", "https://www.npmjs.com/package/dotenv"],
                        },
                        {
                            id: 25, title: "İlişkisel Veritabanları", status: "Başlanmadı", selectable: true,
                            description: "Verinin tablolar halinde, ilişkisel olarak saklandığı veritabanı sistemleri; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 83, title: "PostgreSQL", status: "Başlanmadı", children: [],
                                    description: "Gelişmiş özellikleri ve güvenilirliğiyle öne çıkan, açık kaynak ilişkisel veritabanı.",
                                    resources: ["https://www.postgresql.org/docs/"],
                                },
                                {
                                    id: 84, title: "MySQL", status: "Başlanmadı", children: [],
                                    description: "Dünyada en yaygın kullanılan açık kaynak ilişkisel veritabanı sistemlerinden biri.",
                                    resources: ["https://dev.mysql.com/doc/"],
                                },
                            ],
                        },
                        {
                            id: 181, title: "Veritabanı Migrasyonları", status: "Başlanmadı", children: [],
                            description: "Veritabanı şemasındaki değişiklikleri sürüm kontrollü, geri alınabilir adımlarla yönetme yöntemi.",
                            resources: ["https://www.prisma.io/dataguide/types/relational/what-are-database-migrations"],
                        },
                        {
                            id: 26, title: "NoSQL Veritabanları", status: "Başlanmadı", selectable: true,
                            description: "Şemasız veya esnek şemalı veri saklama sistemleri; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 85, title: "MongoDB", status: "Başlanmadı", children: [],
                                    description: "Veriyi JSON benzeri doküman formatında saklayan, en yaygın NoSQL veritabanı.",
                                    resources: ["https://www.mongodb.com/docs/"],
                                },
                                {
                                    id: 86, title: "Redis", status: "Başlanmadı", children: [],
                                    description: "Bellek içi çalışan, önbellekleme ve hızlı veri erişimi için kullanılan key-value veritabanı.",
                                    resources: ["https://redis.io/docs/latest/"],
                                },
                            ],
                        },
                        {
                            id: 27, title: "API Tasarımı", status: "Başlanmadı",
                            description: "İstemci ile sunucu arasındaki veri alışverişinin nasıl yapılandırılacağını belirleyen tasarım yaklaşımları.",
                            children: [
                                {
                                    id: 28, title: "REST", status: "Başlanmadı", children: [],
                                    description: "HTTP metodlarını ve URL'leri kullanarak kaynak tabanlı API tasarlama yaklaşımı.",
                                    resources: ["https://restfulapi.net/"],
                                },
                                {
                                    id: 29, title: "GraphQL", status: "Başlanmadı", children: [],
                                    description: "İstemcinin ihtiyacı olan veriyi tek istekte, esnek bir sorgu diliyle almasını sağlayan API teknolojisi.",
                                    resources: ["https://graphql.org/learn/"],
                                },
                                {
                                    id: 180, title: "API Dokümantasyonu (Swagger/OpenAPI)", status: "Başlanmadı", children: [],
                                    description: "API'nin uç noktalarını, parametrelerini ve yanıtlarını standart bir formatta belgeleyerek başkalarının kolayca kullanmasını sağlama.",
                                    resources: ["https://swagger.io/docs/specification/about/"],
                                },
                            ],
                        },
                        {
                            id: 30, title: "Kimlik Doğrulama & Güvenlik", status: "Başlanmadı",
                            description: "Kullanıcı kimliğini doğrulama ve uygulamayı yaygın güvenlik açıklarına karşı koruma yöntemleri.",
                            children: [
                                {
                                    id: 31, title: "JWT / OAuth", status: "Başlanmadı", children: [],
                                    description: "Kullanıcı oturumunu token tabanlı doğrulayan ve üçüncü parti girişlerini destekleyen standartlar.",
                                    resources: ["https://jwt.io/introduction", "https://oauth.net/2/"],
                                },
                                {
                                    id: 32, title: "Güvenlik En İyi Pratikleri", status: "Başlanmadı", children: [],
                                    description: "SQL injection, XSS, CSRF gibi yaygın güvenlik açıklarına karşı alınması gereken önlemler.",
                                    resources: ["https://owasp.org/www-project-top-ten/"],
                                },
                                {
                                    id: 174, title: "Yetkilendirme (Authorization & RBAC)", status: "Başlanmadı", children: [],
                                    description: "Kimliği doğrulanmış bir kullanıcının hangi kaynaklara erişip hangi işlemleri yapabileceğini rol tabanlı olarak belirleme.",
                                    resources: ["https://auth0.com/docs/manage-users/access-control/rbac"],
                                },
                            ],
                        },
                        {
                            id: 33, title: "Test Stratejileri", status: "Başlanmadı",
                            description: "Backend kodunun birim, entegrasyon ve uçtan uca testlerle doğrulanması.",
                            children: [
                                {
                                    id: 172, title: "Birim Testler (Unit Tests)", status: "Başlanmadı", children: [],
                                    description: "Tek bir fonksiyonu veya modülü, dış bağımlılıklardan izole ederek test etme yöntemi.",
                                    resources: ["https://martinfowler.com/bliki/UnitTest.html"],
                                },
                                {
                                    id: 173, title: "Entegrasyon Testleri (Integration Tests)", status: "Başlanmadı", children: [],
                                    description: "Birden fazla modülün veya servisin (veritabanı, API gibi) birlikte doğru çalıştığını test etme yöntemi.",
                                    resources: ["https://martinfowler.com/bliki/IntegrationTest.html"],
                                },
                            ],
                        },
                        {
                            id: 34, title: "Önbellekleme (Caching)", status: "Başlanmadı", children: [],
                            description: "Sık erişilen veriyi hızlı erişim için geçici olarak saklayarak performansı artırma tekniği.",
                            resources: ["https://aws.amazon.com/caching/"],
                        },
                        {
                            id: 108, title: "Gözlemlenebilirlik (Logging & Monitoring)", status: "Başlanmadı", selectable: true,
                            description: "Uygulamanın çalışma zamanı davranışını izlemeye ve hataları tespit etmeye yarayan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 109, title: "ELK Stack", status: "Başlanmadı", children: [],
                                    description: "Elasticsearch, Logstash ve Kibana ile log toplama, arama ve görselleştirme çözümü.",
                                    resources: ["https://www.elastic.co/guide/index.html"],
                                },
                                {
                                    id: 110, title: "Prometheus & Grafana", status: "Başlanmadı", children: [],
                                    description: "Metrik toplama ve görselleştirme için yaygın kullanılan açık kaynak izleme araçları.",
                                    resources: ["https://prometheus.io/docs/introduction/overview/", "https://grafana.com/docs/"],
                                },
                            ],
                        },
                        {
                            id: 35, title: "Mesaj Kuyrukları", status: "Başlanmadı", selectable: true,
                            description: "Servisler arasında asenkron mesajlaşmayı sağlayan sistemler; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 87, title: "Kafka", status: "Başlanmadı", children: [],
                                    description: "Yüksek hacimli veri akışlarını işlemek için kullanılan dağıtık mesajlaşma platformu.",
                                    resources: ["https://kafka.apache.org/documentation/"],
                                },
                                {
                                    id: 88, title: "RabbitMQ", status: "Başlanmadı", children: [],
                                    description: "Kurulumu ve kullanımı görece basit, yaygın kullanılan mesaj kuyruğu sistemi.",
                                    resources: ["https://www.rabbitmq.com/docs"],
                                },
                            ],
                        },
                        {
                            id: 36, title: "Docker & Konteynerleştirme", status: "Başlanmadı",
                            description: "Uygulamayı bağımlılıklarıyla birlikte taşınabilir konteynerler halinde paketleme teknolojisi.",
                            children: [
                                {
                                    id: 175, title: "Dockerfile & İmaj Oluşturma", status: "Başlanmadı", children: [],
                                    description: "Bir uygulamanın çalışması için gereken ortamı adım adım tanımlayıp konteyner imajı haline getirme.",
                                    resources: ["https://docs.docker.com/engine/reference/builder/"],
                                },
                                {
                                    id: 176, title: "Docker Compose", status: "Başlanmadı", children: [],
                                    description: "Birden fazla konteyneri (uygulama, veritabanı vb.) tek bir dosyayla birlikte tanımlayıp yönetme aracı.",
                                    resources: ["https://docs.docker.com/compose/"],
                                },
                            ],
                        },
                        {
                            id: 111, title: "Kubernetes", status: "Başlanmadı", children: [],
                            description: "Konteynerlerin dağıtımını, ölçeklenmesini ve yönetimini otomatikleştiren orkestrasyon sistemi.",
                            resources: ["https://kubernetes.io/docs/concepts/"],
                        },
                        {
                            id: 37, title: "CI/CD", status: "Başlanmadı", children: [],
                            description: "Kod değişikliklerinin otomatik test edilip yayına alınmasını sağlayan sürekli entegrasyon/dağıtım süreci.",
                            resources: ["https://docs.github.com/en/actions"],
                        },
                        {
                            id: 182, title: "Cloud / Deployment Temelleri", status: "Başlanmadı", selectable: true,
                            description: "Uygulamayı gerçek kullanıcılara ulaştırmak için kullanılan bulut sağlayıcıları; üçünden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 183, title: "AWS", status: "Başlanmadı", children: [],
                                    description: "En yaygın kullanılan, geniş servis yelpazesine sahip bulut platformu.",
                                    resources: ["https://docs.aws.amazon.com/"],
                                },
                                {
                                    id: 184, title: "Google Cloud (GCP)", status: "Başlanmadı", children: [],
                                    description: "Google'ın veri ve makine öğrenmesi odaklı güçlü servislere sahip bulut platformu.",
                                    resources: ["https://cloud.google.com/docs"],
                                },
                                {
                                    id: 185, title: "Azure", status: "Başlanmadı", children: [],
                                    description: "Microsoft'un kurumsal entegrasyonlarıyla öne çıkan bulut platformu.",
                                    resources: ["https://learn.microsoft.com/en-us/azure/"],
                                },
                            ],
                        },
                        {
                            id: 38, title: "Mikroservisler", status: "Başlanmadı", children: [],
                            description: "Uygulamayı bağımsız olarak geliştirilip dağıtılabilen küçük servislere bölme mimarisi.",
                            resources: ["https://microservices.io/"],
                        },
                        {
                            id: 39, title: "Sistem Tasarımı Temelleri", status: "Başlanmadı",
                            description: "Ölçeklenebilir, güvenilir sistemler tasarlarken göz önünde bulundurulması gereken temel prensipler.",
                            children: [
                                {
                                    id: 177, title: "Ölçeklenebilirlik & Yük Dengeleme", status: "Başlanmadı", children: [],
                                    description: "Artan trafiği karşılamak için sistemi yatay/dikey ölçeklendirme ve isteği birden fazla sunucuya dağıtma.",
                                    resources: ["https://aws.amazon.com/what-is/load-balancing/"],
                                },
                                {
                                    id: 178, title: "Veritabanı Ölçekleme (Sharding & Replication)", status: "Başlanmadı", children: [],
                                    description: "Veriyi birden fazla sunucuya bölerek (sharding) veya çoğaltarak (replication) veritabanı performansını ve dayanıklılığını artırma.",
                                    resources: ["https://www.mongodb.com/resources/products/capabilities/database-sharding-explained"],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 40,
                    title: "Full-Stack Developer",
                    status: "Başlanmadı",
                    description: "Hem tarayıcıda çalışan arayüzü hem de sunucu tarafındaki iş mantığını ve veritabanını yönetebilen, uçtan uca ürün geliştirebilen rol.",
                    children: [
                        {
                            id: 1,
                            title: "Frontend Developer",
                            status: "Başlanmadı",
                            connection: true,
                            children: [
                                {
                                    id: 2, title: "İnternet", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 68, title: "HTTP", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 69, title: "Tarayıcılar Nasıl Çalışır", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 70, title: "DNS", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 3, title: "HTML", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 4, title: "Semantik HTML", status: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 122, title: "Semantik Etiketler", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 123, title: "Başlık Hiyerarşisi & Doküman Yapısı", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 5, title: "Formlar", status: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 124, title: "Form Elemanları & Türleri", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 125, title: "Form Doğrulama (Validation)", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 126, title: "Erişilebilirlik (a11y)", status: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 127, title: "ARIA Rolleri", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 128, title: "Klavye ile Kullanılabilirlik", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 129, title: "SEO Temelleri", status: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 130, title: "Meta Etiketler & Open Graph", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 131, title: "Semantik SEO", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 132, title: "Tarayıcı Geliştirici Araçları (DevTools)", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 6, title: "CSS", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 7, title: "Flexbox", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 133, title: "CSS Grid", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 8, title: "Responsive Tasarım", status: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 134, title: "Media Queries", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 135, title: "Mobile-First Yaklaşım", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 136, title: "CSS Animasyonları", status: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 137, title: "Transitions", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 138, title: "Keyframe Animasyonları", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 139, title: "CSS Ön İşlemcileri", status: "Başlanmadı", selectable: true,
                                            children: [
                                                {
                                                    id: 140, title: "Sass", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 141, title: "Less", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 142, title: "CSS Mimarisi & İsimlendirme", status: "Başlanmadı", selectable: true,
                                            children: [
                                                {
                                                    id: 143, title: "BEM", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 144, title: "OOCSS", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: 9, title: "JavaScript", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 10, title: "DOM Seçme & Değiştirme", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 145, title: "Olay Dinleyicileri (Event Handling)", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 11, title: "Promises", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 146, title: "Async/Await & Fetch API", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 12, title: "ES6+ Özellikleri", status: "Başlanmadı",
                                            children: [
                                                {
                                                    id: 147, title: "Destructuring & Spread/Rest", status: "Başlanmadı", children: [],
                                                },
                                                {
                                                    id: 148, title: "Modüller (import/export)", status: "Başlanmadı", children: [],
                                                },
                                            ],
                                        },
                                        {
                                            id: 149, title: "Closures & Scope", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 150, title: "Event Loop & Asenkron Çalışma Mantığı", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 151, title: "Tarayıcı Depolama", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 152, title: "localStorage & sessionStorage", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 153, title: "Cookies & IndexedDB", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 154, title: "Web Güvenliği Temelleri", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 155, title: "CORS", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 156, title: "XSS & HTTPS Temelleri", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 13, title: "Versiyon Kontrolü (Git)", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 157, title: "Git Temelleri", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 158, title: "İşbirliği & Uzak Depolar", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 14, title: "Paket Yöneticileri (npm/pnpm)", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 15, title: "CSS Framework'leri", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 76, title: "Tailwind", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 77, title: "Bootstrap", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 17, title: "Frontend Framework", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 80, title: "React", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 81, title: "Vue", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 82, title: "Angular", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 101, title: "Durum Yönetimi", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 102, title: "Redux Toolkit", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 103, title: "Zustand", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 104, title: "Pinia", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 16, title: "Build Araçları", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 78, title: "Vite", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 79, title: "Webpack", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 18, title: "TypeScript", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 159, title: "Temel Tipler & Arayüzler", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 160, title: "Generics & Utility Types", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 19, title: "Test", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 161, title: "Birim Testler (Jest)", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 162, title: "Component Testleri (Testing Library)", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 105, title: "Uçtan Uca (E2E) Test", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 106, title: "Cypress", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 107, title: "Playwright", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 163, title: "Web Performansı & Optimizasyon", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 164, title: "Core Web Vitals", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 165, title: "Lazy Loading & Code Splitting", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 20, title: "Server Side Rendering (Next.js)", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 166, title: "Deployment / Yayına Alma", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 167, title: "Netlify", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 168, title: "Vercel", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 169, title: "GitHub Pages", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 21,
                            title: "Backend Developer",
                            status: "Başlanmadı",
                            connection: true,
                            children: [
                                {
                                    id: 22, title: "İşletim Sistemi & Terminal Temelleri", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 23, title: "Programlama Dili", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 71, title: "Node.js", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 72, title: "Python", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 73, title: "Java", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 74, title: "C#", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 75, title: "Go", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 170, title: "Ruby", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 171, title: "PHP", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 13, title: "Versiyon Kontrolü (Git)", status: "Başlanmadı", isHidden: true,
                                    children: [
                                        {
                                            id: 157, title: "Git Temelleri", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 158, title: "İşbirliği & Uzak Depolar", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 179, title: "Ortam Değişkenleri & Konfigürasyon Yönetimi", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 25, title: "İlişkisel Veritabanları", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 83, title: "PostgreSQL", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 84, title: "MySQL", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 181, title: "Veritabanı Migrasyonları", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 26, title: "NoSQL Veritabanları", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 85, title: "MongoDB", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 86, title: "Redis", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 27, title: "API Tasarımı", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 28, title: "REST", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 29, title: "GraphQL", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 180, title: "API Dokümantasyonu (Swagger/OpenAPI)", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 30, title: "Kimlik Doğrulama & Güvenlik", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 31, title: "JWT / OAuth", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 32, title: "Güvenlik En İyi Pratikleri", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 174, title: "Yetkilendirme (Authorization & RBAC)", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 33, title: "Test Stratejileri", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 172, title: "Birim Testler (Unit Tests)", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 173, title: "Entegrasyon Testleri (Integration Tests)", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 34, title: "Önbellekleme (Caching)", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 108, title: "Gözlemlenebilirlik (Logging & Monitoring)", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 109, title: "ELK Stack", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 110, title: "Prometheus & Grafana", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 35, title: "Mesaj Kuyrukları", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 87, title: "Kafka", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 88, title: "RabbitMQ", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 36, title: "Docker & Konteynerleştirme", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 175, title: "Dockerfile & İmaj Oluşturma", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 176, title: "Docker Compose", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 111, title: "Kubernetes", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 37, title: "CI/CD", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 182, title: "Cloud / Deployment Temelleri", status: "Başlanmadı", selectable: true,
                                    children: [
                                        {
                                            id: 183, title: "AWS", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 184, title: "Google Cloud (GCP)", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 185, title: "Azure", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 38, title: "Mikroservisler", status: "Başlanmadı", children: [],
                                },
                                {
                                    id: 39, title: "Sistem Tasarımı Temelleri", status: "Başlanmadı",
                                    children: [
                                        {
                                            id: 177, title: "Ölçeklenebilirlik & Yük Dengeleme", status: "Başlanmadı", children: [],
                                        },
                                        {
                                            id: 178, title: "Veritabanı Ölçekleme (Sharding & Replication)", status: "Başlanmadı", children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 202, title: "Monorepo Araçları", status: "Başlanmadı", selectable: true,
                            description: "Frontend ve backend kodunu tek bir repoda, paylaşılan bağımlılıklarla birlikte yönetmeyi sağlayan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 203, title: "Turborepo", status: "Başlanmadı", children: [],
                                    description: "Vercel'in geliştirdiği, hızlı önbellekleme ve paralel build desteğiyle öne çıkan monorepo aracı.",
                                    resources: ["https://turbo.build/repo/docs"],
                                },
                                {
                                    id: 204, title: "Nx", status: "Başlanmadı", children: [],
                                    description: "Büyük ölçekli monorepo projelerinde bağımlılık grafiği ve görev çalıştırma yönetimi sunan güçlü bir araç.",
                                    resources: ["https://nx.dev/getting-started/intro"],
                                },
                            ],
                        },
                        {
                            id: 205, title: "Uçtan Uca Tip Güvenliği", status: "Başlanmadı", selectable: true,
                            description: "Frontend ile backend arasında tipleri paylaşarak API'de derleme zamanında hata yakalamayı sağlayan yaklaşımlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 206, title: "tRPC", status: "Başlanmadı", children: [],
                                    description: "Ayrı bir şema tanımlamadan, TypeScript tipleri üzerinden uçtan uca tip güvenliği sağlayan modern bir yaklaşım.",
                                    resources: ["https://trpc.io/docs"],
                                },
                                {
                                    id: 207, title: "GraphQL Code Generator", status: "Başlanmadı", children: [],
                                    description: "GraphQL şemasından otomatik olarak TypeScript tipleri üreterek frontend-backend arasında tip güvenliği sağlayan araç.",
                                    resources: ["https://the-guild.dev/graphql/codegen"],
                                },
                            ],
                        },
                        {
                            id: 199, title: "Gerçek Zamanlı İletişim", status: "Başlanmadı",
                            description: "İstemci ile sunucu arasında anlık, çift yönlü veri akışı sağlayan iletişim yöntemleri.",
                            children: [
                                {
                                    id: 200, title: "WebSocket Protokolü", status: "Başlanmadı", children: [],
                                    description: "Tarayıcı ile sunucu arasında kalıcı, çift yönlü bir bağlantı açan temel iletişim protokolü.",
                                    resources: ["https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"],
                                },
                                {
                                    id: 201, title: "Socket.io", status: "Başlanmadı", children: [],
                                    description: "WebSocket üzerine kurulu, otomatik yeniden bağlanma ve oda (room) yönetimi gibi ek özellikler sunan popüler gerçek zamanlı iletişim kütüphanesi.",
                                    resources: ["https://socket.io/docs/v4/"],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 48,
                    title: "Android Developer",
                    status: "Başlanmadı",
                    description: "Android işletim sistemi için mobil uygulama geliştiren rol.",
                    children: [
                        {
                            id: 49, title: "Kotlin", status: "Başlanmadı", children: [],
                            description: "Android'de resmi olarak önerilen, Java ile uyumlu, modern ve özlü programlama dili.",
                            resources: ["https://kotlinlang.org/docs/home.html"],
                        },
                        {
                            id: 50, title: "Android Studio & SDK", status: "Başlanmadı", children: [],
                            description: "Android uygulaması geliştirmek için kullanılan resmi IDE ve geliştirme araç seti.",
                            resources: ["https://developer.android.com/studio/intro"],
                        },
                        {
                            id: 187, title: "Gradle & Bağımlılık Yönetimi", status: "Başlanmadı", children: [],
                            description: "Projeyi derleyen, bağımlılıkları yöneten ve build sürecini yapılandıran Android'in resmi build aracı.",
                            resources: ["https://developer.android.com/build"],
                        },
                        {
                            id: 186, title: "Yaşam Döngüsü (Activity & Fragment Lifecycle)", status: "Başlanmadı", children: [],
                            description: "Bir ekranın oluşturulmasından yok edilmesine kadar geçirdiği aşamaları ve bu aşamalarda yapılması gerekenleri yönetme.",
                            resources: ["https://developer.android.com/guide/components/activities/activity-lifecycle"],
                        },
                        {
                            id: 51, title: "Jetpack Compose", status: "Başlanmadı",
                            description: "Android için modern, deklaratif arayüz geliştirme kütüphanesi.",
                            children: [
                                {
                                    id: 188, title: "State Yönetimi", status: "Başlanmadı", children: [],
                                    description: "Compose'da arayüzün yeniden çizilmesini tetikleyen remember ve mutableState gibi durum yönetimi araçları.",
                                    resources: ["https://developer.android.com/jetpack/compose/state"],
                                },
                                {
                                    id: 189, title: "Navigation (Compose Navigation)", status: "Başlanmadı", children: [],
                                    description: "Compose ekranları arasında geçiş yapmayı ve geri yığınını yönetmeyi sağlayan navigasyon kütüphanesi.",
                                    resources: ["https://developer.android.com/jetpack/compose/navigation"],
                                },
                            ],
                        },
                        {
                            id: 52, title: "Mimari Bileşenler", status: "Başlanmadı",
                            description: "Uygulama mimarisini düzenli ve test edilebilir kılan Android Jetpack bileşenleri.",
                            children: [
                                {
                                    id: 89, title: "ViewModel", status: "Başlanmadı", children: [],
                                    description: "Arayüz verisini yaşam döngüsüne duyarlı şekilde saklayan ve yöneten bileşen.",
                                    resources: ["https://developer.android.com/topic/libraries/architecture/viewmodel"],
                                },
                                {
                                    id: 90, title: "StateFlow", status: "Başlanmadı", children: [],
                                    description: "Kotlin coroutines ile birlikte kullanılan, gözlemlenebilir durum tutan veri akışı.",
                                    resources: ["https://developer.android.com/kotlin/flow/stateflow-and-sharedflow"],
                                },
                            ],
                        },
                        {
                            id: 112, title: "Eşzamanlılık", status: "Başlanmadı", selectable: true,
                            description: "Arka plan işlemlerini yönetmek için kullanılan asenkron programlama yaklaşımları; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 113, title: "Coroutines", status: "Başlanmadı", children: [],
                                    description: "Kotlin'in resmi, hafif ve okunabilir asenkron programlama çözümü.",
                                    resources: ["https://kotlinlang.org/docs/coroutines-overview.html"],
                                },
                                {
                                    id: 114, title: "RxJava", status: "Başlanmadı", children: [],
                                    description: "Reaktif programlama yaklaşımıyla asenkron veri akışlarını yöneten kütüphane.",
                                    resources: ["https://github.com/ReactiveX/RxJava"],
                                },
                            ],
                        },
                        {
                            id: 53, title: "Bağımlılık Enjeksiyonu", status: "Başlanmadı", selectable: true,
                            description: "Bileşenler arası bağımlılıkları dışarıdan yöneterek test edilebilirliği artıran teknik; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 115, title: "Hilt", status: "Başlanmadı", children: [],
                                    description: "Google'ın Android için geliştirdiği, Dagger tabanlı resmi bağımlılık enjeksiyonu kütüphanesi.",
                                    resources: ["https://developer.android.com/training/dependency-injection/hilt-android"],
                                },
                                {
                                    id: 116, title: "Koin", status: "Başlanmadı", children: [],
                                    description: "Kurulumu basit, Kotlin DSL tabanlı hafif bağımlılık enjeksiyonu kütüphanesi.",
                                    resources: ["https://insert-koin.io/docs/quickstart/android/"],
                                },
                            ],
                        },
                        {
                            id: 54, title: "Ağ İşlemleri (Retrofit)", status: "Başlanmadı", children: [],
                            description: "Android'de sunucuyla HTTP üzerinden veri alışverişini kolaylaştıran, yaygın kullanılan ağ kütüphanesi.",
                            resources: ["https://square.github.io/retrofit/"],
                        },
                        {
                            id: 55, title: "Yerel Depolama (Room)", status: "Başlanmadı", children: [],
                            description: "SQLite üzerine kurulu, Android'de yerel veritabanı işlemlerini kolaylaştıran kütüphane.",
                            resources: ["https://developer.android.com/training/data-storage/room"],
                        },
                        {
                            id: 190, title: "Uygulama İzinleri (Permissions)", status: "Başlanmadı", children: [],
                            description: "Kamera, konum gibi hassas kaynaklara erişim için kullanıcıdan izin isteme ve yönetme süreci.",
                            resources: ["https://developer.android.com/training/permissions/requesting"],
                        },
                        {
                            id: 56, title: "Test", status: "Başlanmadı",
                            description: "Android uygulamalarında birim ve arayüz testleri yazma pratiği.",
                            children: [
                                {
                                    id: 191, title: "Birim Testler (JUnit)", status: "Başlanmadı", children: [],
                                    description: "İş mantığını ve fonksiyonları izole şekilde test eden Android'in standart birim test çatısı.",
                                    resources: ["https://developer.android.com/training/testing/local-tests"],
                                },
                                {
                                    id: 192, title: "UI Testleri (Espresso/Compose Testing)", status: "Başlanmadı", children: [],
                                    description: "Kullanıcı arayüzünün beklenen şekilde davrandığını cihaz veya emülatör üzerinde doğrulama.",
                                    resources: ["https://developer.android.com/training/testing/espresso"],
                                },
                            ],
                        },
                        {
                            id: 193, title: "Push Bildirimleri (Firebase Cloud Messaging)", status: "Başlanmadı", children: [],
                            description: "Uygulama kapalıyken bile kullanıcıya anlık bildirim göndermeyi sağlayan Google'ın bildirim servisi.",
                            resources: ["https://firebase.google.com/docs/cloud-messaging"],
                        },
                        {
                            id: 57, title: "Play Store'a Yayınlama", status: "Başlanmadı", children: [],
                            description: "Uygulamayı imzalayıp Google Play Store üzerinden kullanıcılara sunma süreci.",
                            resources: ["https://developer.android.com/studio/publish"],
                        },
                    ],
                },
                {
                    id: 58,
                    title: "iOS Developer",
                    status: "Başlanmadı",
                    description: "Apple'ın iOS işletim sistemi için mobil uygulama geliştiren rol.",
                    children: [
                        {
                            id: 59, title: "Swift", status: "Başlanmadı", children: [],
                            description: "Apple'ın geliştirdiği, güvenli ve modern iOS/macOS uygulama programlama dili.",
                            resources: ["https://docs.swift.org/swift-book/"],
                        },
                        {
                            id: 60, title: "Xcode", status: "Başlanmadı", children: [],
                            description: "iOS uygulaması geliştirmek için kullanılan Apple'ın resmi geliştirme ortamı.",
                            resources: ["https://developer.apple.com/documentation/xcode"],
                        },
                        {
                            id: 194, title: "Yaşam Döngüsü (App & View Lifecycle)", status: "Başlanmadı", children: [],
                            description: "Bir view veya uygulamanın açılışından kapanışına kadar geçirdiği aşamaları ve bu aşamalarda yapılması gerekenleri yönetme.",
                            resources: ["https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle"],
                        },
                        {
                            id: 61, title: "UI Framework", status: "Başlanmadı", selectable: true,
                            description: "Arayüz geliştirmek için kullanılan framework; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 91, title: "UIKit", status: "Başlanmadı", children: [],
                                    description: "Imperative yaklaşımla arayüz kuran, iOS'un köklü ve hâlâ yaygın kullanılan arayüz framework'ü.",
                                    resources: ["https://developer.apple.com/documentation/uikit"],
                                },
                                {
                                    id: 92, title: "SwiftUI", status: "Başlanmadı",
                                    description: "Apple'ın modern, deklaratif arayüz geliştirme framework'ü.",
                                    children: [
                                        {
                                            id: 195, title: "State Yönetimi", status: "Başlanmadı", children: [],
                                            description: "SwiftUI'da arayüzün yeniden çizilmesini tetikleyen @State ve @Binding gibi durum yönetimi araçları.",
                                            resources: ["https://developer.apple.com/documentation/swiftui/state"],
                                        },
                                        {
                                            id: 196, title: "Navigation (NavigationStack)", status: "Başlanmadı", children: [],
                                            description: "SwiftUI ekranları arasında geçiş yapmayı ve geri yığınını yönetmeyi sağlayan navigasyon API'si.",
                                            resources: ["https://developer.apple.com/documentation/swiftui/navigationstack"],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 62, title: "Mimari Desenler", status: "Başlanmadı", selectable: true,
                            description: "Uygulama kodunu düzenlemek için kullanılan mimari yaklaşımlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 93, title: "MVVM", status: "Başlanmadı", children: [],
                                    description: "Görünüm ile iş mantığını ViewModel katmanıyla ayıran, SwiftUI ile sık kullanılan mimari desen.",
                                    resources: ["https://www.hackingwithswift.com/books/ios-swiftui/introducing-mvvm-into-your-swiftui-project"],
                                },
                                {
                                    id: 94, title: "MVC", status: "Başlanmadı", children: [],
                                    description: "Apple'ın geleneksel olarak önerdiği, Model-View-Controller tabanlı klasik mimari desen.",
                                    resources: ["https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html"],
                                },
                            ],
                        },
                        {
                            id: 117, title: "Eşzamanlılık", status: "Başlanmadı", selectable: true,
                            description: "Arka plan işlemlerini yönetmek için kullanılan asenkron programlama yaklaşımları; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 118, title: "Swift Concurrency (async/await)", status: "Başlanmadı", children: [],
                                    description: "Swift'in resmi, yapılandırılmış asenkron programlama modeli.",
                                    resources: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/"],
                                },
                                {
                                    id: 119, title: "Combine", status: "Başlanmadı", children: [],
                                    description: "Apple'ın reaktif programlama yaklaşımıyla asenkron veri akışlarını yöneten framework'ü.",
                                    resources: ["https://developer.apple.com/documentation/combine"],
                                },
                            ],
                        },
                        {
                            id: 63, title: "Ağ İşlemleri", status: "Başlanmadı", selectable: true,
                            description: "Sunucuyla HTTP üzerinden veri alışverişi yapmak için kullanılan yöntemler; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 95, title: "URLSession", status: "Başlanmadı", children: [],
                                    description: "Apple'ın yerleşik, ek kütüphane gerektirmeyen ağ istekleri API'si.",
                                    resources: ["https://developer.apple.com/documentation/foundation/urlsession"],
                                },
                                {
                                    id: 96, title: "Alamofire", status: "Başlanmadı", children: [],
                                    description: "URLSession üzerine kurulu, kullanımı daha kolay popüler ağ kütüphanesi.",
                                    resources: ["https://github.com/Alamofire/Alamofire"],
                                },
                            ],
                        },
                        {
                            id: 64, title: "Yerel Depolama", status: "Başlanmadı",
                            description: "Uygulama verisini cihaz üzerinde saklamak için kullanılan yöntemler.",
                            children: [
                                {
                                    id: 97, title: "CoreData", status: "Başlanmadı", children: [],
                                    description: "Apple'ın nesne grafiği ve kalıcı veri yönetimi için sunduğu framework.",
                                    resources: ["https://developer.apple.com/documentation/coredata"],
                                },
                                {
                                    id: 98, title: "UserDefaults", status: "Başlanmadı", children: [],
                                    description: "Küçük ölçekli ayar ve tercihleri basitçe saklamak için kullanılan anahtar-değer deposu.",
                                    resources: ["https://developer.apple.com/documentation/foundation/userdefaults"],
                                },
                            ],
                        },
                        {
                            id: 197, title: "Uygulama İzinleri (Permissions)", status: "Başlanmadı", children: [],
                            description: "Kamera, konum gibi hassas kaynaklara erişim için Info.plist üzerinden izin tanımlama ve kullanıcıdan izin isteme süreci.",
                            resources: ["https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy/requesting_access_to_protected_resources"],
                        },
                        {
                            id: 65, title: "Bağımlılık Yönetimi", status: "Başlanmadı", selectable: true,
                            description: "Projeye üçüncü parti kütüphaneleri eklemek için kullanılan paket yönetim araçları; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 99, title: "CocoaPods", status: "Başlanmadı", children: [],
                                    description: "iOS ekosisteminde uzun süredir yaygın kullanılan bağımlılık yöneticisi.",
                                    resources: ["https://guides.cocoapods.org/"],
                                },
                                {
                                    id: 100, title: "SPM", status: "Başlanmadı", children: [],
                                    description: "Apple'ın resmi, Xcode'a gömülü Swift Package Manager'ı.",
                                    resources: ["https://www.swift.org/documentation/package-manager/"],
                                },
                            ],
                        },
                        {
                            id: 66, title: "Test", status: "Başlanmadı", selectable: true,
                            description: "iOS uygulamalarını test etmek için kullanılan araçlar; ikisinden birini öğrenmen yeterli.",
                            children: [
                                {
                                    id: 120, title: "XCTest", status: "Başlanmadı", children: [],
                                    description: "Apple'ın Xcode'a gömülü resmi birim ve arayüz test framework'ü.",
                                    resources: ["https://developer.apple.com/documentation/xctest"],
                                },
                                {
                                    id: 121, title: "Quick & Nimble", status: "Başlanmadı", children: [],
                                    description: "Daha okunabilir, davranış odaklı test yazmayı sağlayan popüler üçüncü parti test kütüphaneleri.",
                                    resources: ["https://github.com/Quick/Quick"],
                                },
                            ],
                        },
                        {
                            id: 198, title: "Push Bildirimleri (APNs)", status: "Başlanmadı", children: [],
                            description: "Uygulama kapalıyken bile kullanıcıya anlık bildirim göndermeyi sağlayan Apple'ın bildirim servisi.",
                            resources: ["https://developer.apple.com/documentation/usernotifications"],
                        },
                        {
                            id: 67, title: "App Store'a Gönderim", status: "Başlanmadı", children: [],
                            description: "Uygulamayı imzalayıp App Store Connect üzerinden inceleme ve yayına gönderme süreci.",
                            resources: ["https://developer.apple.com/app-store/submissions/"],
                        },
                    ],
                },
            ],

            setRoadmaps: (roadmaps) => set({ roadmaps }),
            updateStatus: (id, newStatus) => set((state) => ({
                roadmaps: updateStatusInTree(state.roadmaps, id, newStatus)
            })),

            addTopic: (parentId, title) => set((state) => {
                const newTopic: RoadmapNode = {
                    id: Date.now(),
                    title: title,
                    status: "Başlanmadı",
                    children: [],
                };
                return { roadmaps: addTopicHelper(state.roadmaps, parentId, newTopic) };
            }),

            addRoadmap: (title) => set((state) => {
                const newRoadmap: RoadmapNode = {
                    id: Date.now(),
                    title: title,
                    status: "Başlanmadı",
                    children: [],
                };
                return { roadmaps: [...state.roadmaps, newRoadmap] };
            }),

            deleteTopic: (id) => set((state) => ({
                roadmaps: deleteTopicHelper(state.roadmaps, id)
            })),
        }),

        {
            name: 'roadmap-storage-27',
        }
    )
);

export function findTopic(nodes: RoadmapNode[], id: number): RoadmapNode | undefined {
    for (const node of nodes) {
        if (node.id === id) {
            return node;
        }
        const found = findTopic(node.children, id);
        if (found) {
            return found;
        }
    }
    return undefined;
}
