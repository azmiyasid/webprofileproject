const SITE = {

  /* ---------- Profil (halaman HOME) ---------- */
  profile: {
    name: "Azmi Yasid Alfarisi",
    verified: true,
    title: "Content Creator",
    postTitle: "Creator",
    bio: "Everything will perfect if you hard work",
    photo: "assets/foto.png",
  },

  /* ---------- Tombol HIRE dan PARTNERSHIP ---------- */
  whatsapp: {
    number: "62885815461002",
    hireMessage:
      "Halo Azmi, saya [nama] dari [perusahaan/agensi]. Kami tertarik merekrut kamu. Boleh kita diskusi lebih lanjut?",
    partnershipMessage:
      "Halo Azmi, saya [nama] dari [brand/instansi/channel]. Kami ingin mengajak kamu berkolaborasi. Boleh kita bahas detailnya?",
  },

  /* ---------- Menu titik tiga ---------- */
  links: {
    youtube: "https://www.youtube.com/@akalsosmed",
    tiktok: "https://www.tiktok.com/@azmysd_id",
    linkedin: "https://www.linkedin.com/in/azmi-yasid-alfarisi-153312352",
  },

  /* ---------- Halaman ABOUT ---------- */
  about: {
    photo: "assets/about.jpg",
    paragraphs: [
      "Perkenalkan nama saya Azmi Yasid Alfarisi, panggil saja Faris. Saya adalah Content Creator dan Video Editor lulusan SMK Multimedia dengan pengalaman selama lebih dari 7 tahun. Saya terbiasa mengelola produksi konten secara mandiri, mulai dari riset, planning, scriptwriting, voice over, editing, QC hingga analisis.",
      "Dengan keahlian teknis pada software seperti CapCut, Adobe Premiere, Kinemaster, Photoshop, Canva, dan CorelDraw, saya berfokus pada pembuatan konten Reels, TikTok, dan YouTube yang dilengkapi sentuhan VFX, SFX, serta b-roll yang unik. Spesialisasi saya mencakup video edukasi, tutorial praktis, dan konten yang relate serta mudah dipahami audiens. Saya berfokus pada niche Cybersecurity, Teknologi dan Sosial Media.",
    ],
  },


  posts: {

    portofolio: [
      {
        id: "portofolio-1",
        time: "06:10 - 20/09/2026",
        caption: "Pernah sewaktu SMK ngerjain proyek bareng temen, waktu itu disuruh dokumentasi, tapi sayangnya hasilnya lupa saya simpan:)",
        media: { type: "image", src: "assets/portofolio1.jpg" },
        comments: [
          {
            name: "Silvia Yuliani",
            title: "HRD",
            text: "Emangnya kamu nggak nyimpen di komputer, laptop atau google drive?",
            time: "06:12 - 20/09/2026",
            replies: [
              {
                creator: true,
                text: "**Silvia Yuliani** Nah itu dia kak saya cari tidak ketemu",
                time: "06:12 - 20/09/2026",
              },
            ],
          },
          {
            name: "Dimas Pratama",
            title: "Creative Director",
            text: "ngga nanya temen lo atau minta salinan filenya?",
            time: "06:15 - 20/09/2026",
          },
        ],
      },
      {
        id: "portofolio-2",
        time: "18:05 - 28/08/2026",
        caption: "Video profil produk untuk UMKM lokal.",
        media: { type: "video", src: "assets/portofolio-2.mp4", poster: "assets/portofolio-2.jpg" },
        comments: [],
      },
      {
        id: "portofolio-3",
        time: "20:15 - 14/08/2026",
        caption: "Behind the scene sesi foto produk.",
        media: { type: "image", src: "assets/portofolio-3.jpg" },
        comments: [],
      },
    ],

    opinion: [
      {
        id: "opinion-1",
        time: "08:00 - 02/09/2026",
        caption: "Konten yang konsisten lebih berguna daripada konten yang sesekali viral. Kamu setuju?",
        media: { type: "image", src: "assets/opinion-1.jpg" },
        comments: [
          {
            name: "Sinta Amalia",
            title: "Social Media Manager",
            text: "Setuju. Algoritma juga lebih ramah ke akun yang rutin posting.",
            time: "11:22 - 02/09/2026",
          },
        ],
      },
      {
        id: "opinion-2",
        time: "19:45 - 20/08/2026",
        caption: "Tiga kesalahan yang sering terjadi saat editor pemula memakai efek suara.",
        media: { type: "youtube", id: "ID_VIDEO_YOUTUBE" },
        comments: [],
      },
    ],

    skills: [
      {
        id: "skills-1",
        time: "16:10 - 30/08/2026",
        caption: "Color grading: sebelum dan sesudah.",
        media: { type: "image", src: "assets/skills-1.jpg" },
        comments: [],
      },
      {
        id: "skills-2",
        time: "12:00 - 18/08/2026",
        caption: "Motion graphics sederhana untuk intro channel.",
        media: { type: "video", src: "assets/skills-2.mp4", poster: "assets/skills-2.jpg" },
        comments: [],
      },
    ],
  },
};
