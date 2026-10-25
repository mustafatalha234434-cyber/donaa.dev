/*
 * Sitedeki bütün metinler ve kişisel bilgiler bu dosyada.
 * Yer tutucu olarak işaretli her değeri kendi bilginle değiştir.
 * tr ve en bloklarının anahtarları aynı olmalı. Kontrol için: node --test
 * Yayına almadan önce: RELEASE=1 node --test  (yer tutucu kalmışsa hata verir)
 */
window.SITE_CONTENT = {
  shared: {
    name: "Mustafa Talha Taylan",

    // Arka plan videosunun hızı (1 = normal, 0.75 = yavaş)
    videoSpeed: 0.75,

    // Başlığın üstündeki üç ikon (Font Awesome 6.5.2 sınıfları)
    trustIcons: ["fa-brands fa-microsoft", "fa-solid fa-database", "fa-brands fa-android"],

    // Hero'nun altındaki dört sayı. "count" olanlar aşağıdaki listelerden otomatik sayılır.
    stats: [
      { glyph: "<", value: 2, suffix: "+" },
      { glyph: "#", value: 14 }, // toplam proje sayısı (kartlarda öne çıkan 2 tanesi var)
      { glyph: "*", count: "skills" },
      { glyph: "%", count: "skillAreas" },
    ],

    // İletişim bağlantıları (form da e-posta adresine yazar). Boş bırakılan satır "Eklenecek" olarak görünür.
    links: {
      email: "donaasoftdev@gmail.com",
      github: "https://github.com/mustafatalha234434-cyber",
      linkedin: "https://www.linkedin.com/in/mustafa-talha-taylan-software/",
      instagram: "https://www.instagram.com/donaa.dev/",
    },

    // Yetkinlik kategorilerinin ikonları. Ad ve rozetler dil bloklarında, aynı sırayla.
    skills: [
      { icon: "fa-solid fa-code" },
      { icon: "fa-solid fa-database" },
      { icon: "fa-solid fa-layer-group" },
      { icon: "fa-solid fa-screwdriver-wrench" },
    ],

    // Projelerin linkleri ve rozetleri. Ad ve açıklamalar dil bloklarında, aynı sırayla.
    projects: [
      {
        url: "",
        tags: ["ASP.NET Core MVC", "EF Core", "MS SQL Server", "LINQ"],
        // Kartın üstündeki tanıtım videosu ve oynatılmadan önce görünen kapak görseli
        video: { src: "assets/projects/hesap-kitap-tanitim.mp4", poster: "assets/projects/hesap-kitap-kapak.png" },
        // Yayınlanınca false yap: "Çok Yakında" rozeti kalkar.
        comingSoon: true,
      },
      {
        url: "",
        tags: ["Unity 6", "C#", "URP 2D", "Input System", "TextMeshPro", "Android (APK)"],
        video: { src: "assets/projects/stickman-love-fragman.mp4", poster: "assets/projects/stickman-love-kapak.jpg" },
        // Oyun çıkınca false yap: "Çok Yakında" rozeti kalkar.
        comingSoon: true,
      },
      {
        url: "",
        tags: ["Unity 6", "C#", "Android", "Windows"],
        video: { src: "assets/projects/wordpop-fragman.mp4", poster: "assets/projects/wordpop-kapak.jpg" },
        // Yayınlanınca false yap: "Çok Yakında" rozeti kalkar.
        comingSoon: true,
      },
      {
        url: "",
        tags: [".NET MAUI", "C#", ".NET 10", "UDP", "ViGEmBus", "Bluetooth HID"],
        video: { src: "assets/projects/phonepad-fragman.mp4", poster: "assets/projects/phonepad-kapak.jpg" },
        // Yayınlanınca false yap: "Çok Yakında" rozeti kalkar.
        comingSoon: true,
      },
    ],
  },

  tr: {
    meta: {
      title: "Donaa — Mustafa Talha Taylan",
      description:
        "Mustafa Talha Taylan — Backend yazılım geliştirici. C#, ASP.NET Core, .NET MAUI ve MS SQL ile projeler.",
      locale: "tr_TR",
    },
    ui: { primaryNav: "Ana menü", language: "Dil seçimi", menu: "Menü" },
    nav: { home: "Ana Sayfa", about: "Hakkımda", skills: "Yetkinlikler", projects: "Projeler", contact: "İletişim" },
    trust: "Yeni projelere açığım",
    headline2: "Backend Software Developer",
    subhead:
      "Güçlü, ölçeklenebilir ve sürdürülebilir arka uç sistemleri tasarlıyorum; modern web ve mobil teknolojilerle fikirleri çalışan projelere dönüştürüyorum.",
    ctaProjects: "Projelerimi İncele",
    ctaContact: "İletişime Geç",
    stats: ["Yıllık Deneyim", "Proje", "Teknoloji & Araç", "Yetkinlik Alanı"],
    about: {
      title: "Hakkımda",
      text: "Merhaba, ben Mustafa Talha Taylan. 20 yaşındayım ve Düzce Üniversitesi'nde Backend Yazılım Geliştirme eğitimimi sürdürüyorum. Veritabanı mimarileri, iş mantığı katmanları ve performans optimizasyonu üzerine yoğunlaşıyor, Clean Code prensiplerine bağlı kalarak sürdürülebilir yazılımlar geliştiriyorum. Bunun yanı sıra .NET MAUI ile mobil uygulamalar geliştiriyor ve yapay zekâ araçlarını iş süreçlerime etkin biçimde entegre ediyorum.",
    },
    skills: {
      title: "Yetkinlikler",
      categories: [
        { title: "Diller & Çatılar", items: ["C#", "ASP.NET Core MVC", ".NET MAUI", "XAML", "Unity"] },
        {
          title: "Veritabanı & ORM",
          items: ["MS SQL Server", "Entity Framework Core", "SQL", "Repository & Service Pattern"],
        },
        { title: "Mimari & Standartlar", items: ["RESTful APIs", "OOP", "Katmanlı Mimari (Layered Architecture)"] },
        {
          title: "Araçlar & Teknolojiler",
          items: ["Git", "GitHub", "Visual Studio", "Cursor", "Claude", "Postman", "Web Scraping (Playwright)"],
        },
      ],
    },
    projects: {
      title: "Projelerim",
      visit: "Projeyi aç",
      videoLabel: "tanıtım videosu",
      comingSoon: "Çok Yakında",
      items: [
        {
          name: "Hesap-Kitap",
          kind: "Kişisel Gider Takip Sistemi",
          description:
            "Kullanıcıların gelir-gider dengesini takip edebileceği, güvenli ve katmanlı mimariyle geliştirilmiş web tabanlı finansal yönetim uygulaması.",
        },
        {
          name: "Stickman Love: Cehennemin Kapıları",
          kind: "2D Aksiyon-Platform Oyunu · Android",
          videoLabel: "fragman",
          description:
            "Kanlı Ay gecesi cehenneme kaçırılan sevgilisi Ela’yı kurtarmak için Araf’tan Malakar’ın tahtına kadar inen Kaan’ın hikâyesini anlatan 3 bölümlük bir 2D aksiyon-platform oyunu. Telefonda sanal joystick ve butonlarla oynanıyor. Alevli kılıç kombolarıyla ve tabanca/pompalıyla düşmanları yeniyorsun; Ela tamamen yozlaşmadan önce son boss Malakar’ı alt etmen gerekiyor.",
        },
        {
          name: "WordPop!",
          kind: "Kelime ve Blok Bulmaca Oyunu · Android & Windows",
          videoLabel: "fragman",
          description:
            "Harf çemberinden kelimeleri bulduğun, bulduğun harflerin bloklara dönüştüğü ve ızgarada satırları doldurup blokları patlattığın bir bulmaca oyunu. Bölümler Kapadokya gibi gerçek yerlerde geçiyor; sevimli hayvan karakterler (petler) yol boyunca eşlik ediyor.",
        },
        {
          name: "PhonePad",
          kind: "Telefonu Oyun Koluna Çeviren Uygulama · Android & Windows",
          videoLabel: "fragman",
          description:
            "Telefonu bilgisayar için bir oyun koluna, eğerek kullanılan bir direksiyona dönüştürür. Wi-Fi modunda girdiler UDP ile bilgisayardaki sunucuya gider ve ViGEmBus sayesinde Windows'ta gerçek bir Xbox 360 kolu gibi görünür; Bluetooth modunda telefon, bilgisayara kurulum gerektirmeden doğrudan bir oyun kolu olur.",
        },
      ],
    },
    contact: {
      title: "İletişim",
      intro: "Bir proje, iş birliği ya da sadece merhaba demek için yazabilirsin.",
      email: "E-posta",
      github: "GitHub",
      linkedin: "LinkedIn",
      instagram: "Instagram",
      pending: "Eklenecek",
      form: {
        name: "Ad Soyad",
        email: "E-posta",
        subject: "Konu",
        message: "Mesaj",
        submit: "Gönder",
        defaultSubject: "Web sitesinden mesaj",
        opening: "E-posta uygulaman açılıyor…",
        missingAddress: "İletişim adresi henüz eklenmedi.",
        tooLong: "Mesaj bu yolla gönderilemeyecek kadar uzun. Lütfen kısalt ya da e-posta adresime doğrudan yaz.",
        errors: {
          required: "Bu alan zorunlu.",
          email: "Geçerli bir e-posta adresi yaz.",
          short: "Mesaj en az 10 karakter olmalı.",
        },
      },
    },
    footer: { credit: "Başlık fontu:", toTop: "Yukarı çık ↑" },
  },

  en: {
    meta: {
      title: "Donaa — Mustafa Talha Taylan",
      description:
        "Mustafa Talha Taylan — Backend software developer. Projects with C#, ASP.NET Core, .NET MAUI and MS SQL.",
      locale: "en_US",
    },
    ui: { primaryNav: "Main menu", language: "Language", menu: "Menu" },
    nav: { home: "Home", about: "About", skills: "Skills", projects: "Projects", contact: "Contact" },
    trust: "Open to new projects",
    headline2: "Backend Software Developer",
    subhead:
      "I design robust, scalable and maintainable back-end systems, turning ideas into working products with modern web and mobile technologies.",
    ctaProjects: "View My Projects",
    ctaContact: "Get in Touch",
    stats: ["Years Experience", "Projects", "Technologies & Tools", "Skill Areas"],
    about: {
      title: "About",
      text: "Hello, I'm Mustafa Talha Taylan. I'm 20 and currently studying Backend Software Development at Düzce University. I focus on database architectures, business-logic layers and performance optimisation, building maintainable software guided by Clean Code principles. I also develop mobile applications with .NET MAUI and actively integrate AI tools into my workflow.",
    },
    skills: {
      title: "Skills",
      categories: [
        { title: "Languages & Frameworks", items: ["C#", "ASP.NET Core MVC", ".NET MAUI", "XAML", "Unity"] },
        {
          title: "Database & ORM",
          items: ["MS SQL Server", "Entity Framework Core", "SQL", "Repository & Service Pattern"],
        },
        { title: "Architecture & Standards", items: ["RESTful APIs", "OOP", "Layered Architecture"] },
        {
          title: "Tools & Technologies",
          items: ["Git", "GitHub", "Visual Studio", "Cursor", "Claude", "Postman", "Web Scraping (Playwright)"],
        },
      ],
    },
    projects: {
      title: "Projects",
      visit: "Open project",
      videoLabel: "promo video",
      comingSoon: "Coming Soon",
      items: [
        {
          name: "Hesap-Kitap",
          kind: "Personal Expense Tracker",
          description:
            "A web-based personal finance app for tracking income and expenses, built securely on a layered architecture.",
        },
        {
          name: "Stickman Love: Gates of Hell",
          kind: "2D Action Platformer · Android",
          videoLabel: "trailer",
          description:
            "A three-chapter 2D action platformer about Kaan, who descends from Limbo to Malakar’s throne to rescue his beloved Ela, dragged into hell on the night of the Blood Moon. Played on the phone with a virtual joystick and buttons: beat enemies with flaming sword combos and a pistol or shotgun, and defeat the final boss Malakar before Ela is fully corrupted.",
        },
        {
          name: "WordPop!",
          kind: "Word & Block Puzzle Game · Android & Windows",
          videoLabel: "trailer",
          description:
            "A puzzle game where you find words on a letter wheel, the letters you find turn into blocks, and you clear full rows on the grid to pop them. Levels take place in real places such as Cappadocia, with cute animal companions (pets) along the way.",
        },
        {
          name: "PhonePad",
          kind: "Turns Your Phone into a Game Controller · Android & Windows",
          videoLabel: "trailer",
          description:
            "Turns your phone into a game controller for the PC, or a steering wheel you tilt. Over Wi-Fi, inputs travel via UDP to a server on the PC and appear in Windows as a real Xbox 360 controller through ViGEmBus; over Bluetooth, the phone becomes a gamepad with no setup on the PC.",
        },
      ],
    },
    contact: {
      title: "Contact",
      intro: "Write to me about a project, a collaboration or just to say hello.",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
      instagram: "Instagram",
      pending: "Coming soon",
      form: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        submit: "Send",
        defaultSubject: "Message from the website",
        opening: "Opening your email app…",
        missingAddress: "Contact address not added yet.",
        tooLong: "This message is too long to send this way. Please shorten it or email me directly.",
        errors: {
          required: "This field is required.",
          email: "Enter a valid email address.",
          short: "Message must be at least 10 characters.",
        },
      },
    },
    footer: { credit: "Display font:", toTop: "Back to top ↑" },
  },
};
