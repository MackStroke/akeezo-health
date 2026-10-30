export interface TeamMember {
  name: string;
  role: string;
  image: string;
  imageFallback: string;
  linkedin: string | null;
}

export interface PressArticle {
  id: string;
  source: string;
  date: string;
  title: string;
  description: string;
  image: string;
  imageFallback: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Aditya Oza",
    role: "Co-Founder & CEO",
    image: "/uploads/about/aditya-oza.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/aditya-oza.webp",
    linkedin: "https://in.linkedin.com/in/ozaaditya"
  },
  {
    name: "Mikhail Bohra",
    role: "Co-Founder & CMO",
    image: "/uploads/about/mikhail-bohra.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/mikhail-bohra.webp",
    linkedin: "https://in.linkedin.com/in/mikhailbohra"
  },
  {
    name: "Vaishali Raheja",
    role: "Founder's Office",
    image: "/uploads/about/vaishali-raheja.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/vaishali-raheja.webp",
    linkedin: "https://www.linkedin.com/in/vaishali-raheja-88744511b/"
  },
  {
    name: "Nirnay Verma",
    role: "VP Sales",
    image: "/uploads/about/nirnay-verma.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/nirnay-verma.webp",
    linkedin: "https://in.linkedin.com/in/nirnay-verma-51945272"
  },
  {
    name: "Roshan Thakare",
    role: "Design Lead",
    image: "/uploads/about/roshan-thakare.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/roshan-thakare.webp",
    linkedin: "https://www.linkedin.com/in/roshanthakare767426/"
  },
  {
    name: "Tukaram Sawant",
    role: "Sr. Software Developer",
    image: "/uploads/about/tukaram-sawant.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/tukaram-sawant.webp",
    linkedin: "https://www.linkedin.com/in/tukaram-sawant-3690a7119/"
  },
  {
    name: "Rishabh Jain",
    role: "Growth & Marketing Head",
    image: "/uploads/about/rishabh-jain.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/rishabh-jain.webp",
    linkedin: "https://in.linkedin.com/in/therishabhjainn/"
  },
  {
    name: "Aaleya Talapatra",
    role: "Head of Operations",
    image: "/uploads/about/aaleya-talapatra.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/aaleya-talapatra.webp",
    linkedin: "https://www.linkedin.com/in/aaleya-sanyal-talapatra-929065172"
  },
  {
    name: "Dr Md El Chami",
    role: "Sr. Resident Doctor",
    image: "/uploads/about/dr-md-el-chami.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/dr-md-el-chami.webp",
    linkedin: null
  },
  {
    name: "Isha Singhal",
    role: "Founder's Office",
    image: "/uploads/about/isha-singhal.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/isha-singhal.webp",
    linkedin: "https://in.linkedin.com/in/isha-singhalbmlmba"
  },
  {
    name: "Dr Lin Celeb",
    role: "Sr Consultancy Doctor",
    image: "/uploads/about/dr-lin-celeb.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/dr-lin-celeb.webp",
    linkedin: null
  },
  {
    name: "Pranshu Jaiswal",
    role: "Sales Team Lead",
    image: "/uploads/about/pranshu-jaiswal.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/pranshu-jaiswal.webp",
    linkedin: "https://www.linkedin.com/in/pranshu31j/"
  },
  {
    name: "Manish Bhatt",
    role: "Senior Manager - QC & Pre-ops",
    image: "/uploads/about/manish-bhatt.webp",
    imageFallback: "https://curemeabroad.com/v2/about-us/manish-bhatt.webp",
    linkedin: "https://www.linkedin.com/in/manish-bhatt-750b51141"
  }
];

export const FEATURED_ARTICLES: PressArticle[] = [
  {
    id: "press-1",
    source: "Women's Insider",
    date: "June 30, 2025",
    title: "Not Just Bookings: Transforming Cross-Border Care in the $130B+ Medical Tourism Market",
    description:
      "This platform is solving the international care coordination crisis with complete fee transparency, clinical rigor, and a seamless patient experience.",
    image: "/uploads/about/team-0.webp",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/static/v2/about-us/team-0.webp"
  },
  {
    id: "press-2",
    source: "Bio Spectrum India",
    date: "June 30, 2025",
    title: "AKEEZO Healthcare Platform Enters Global Market to Transform Medical Travel",
    description:
      "Leading healthcare entrepreneurs and medical directors announce a bold new standard uniting accredited hospitals, top surgeons, and transparent direct pricing.",
    image: "/uploads/about/team-3.webp",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/static/v2/about-us/team-3.webp"
  }
];

export const PRESS_ARTICLES: PressArticle[] = [
  {
    id: "press-3",
    source: "Media Brief",
    date: "June 27, 2025",
    title: "Modern Healthcare Navigation Launches to Tap into Booming Cross-Border Treatment Across Asia",
    description:
      "Bridging international patients with accredited centers of excellence across India, Turkey, Thailand, and Germany with guided concierge support.",
    image: "/uploads/about/team-4.webp",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/static/v2/about-us/team-4.webp"
  },
  {
    id: "press-4",
    source: "APN News",
    date: "June 30, 2025",
    title: "Pioneering Patient Advocacy: Veteran Founders Unveil Next-Generation Health Navigation",
    description:
      "Structured concierge navigation eliminates predatory brokers and hidden commissions from medical tourism.",
    image: "/uploads/about/team-7.webp",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/static/v2/about-us/team-7.webp"
  },
  {
    id: "press-5",
    source: "Medium",
    date: "July 2, 2025",
    title: "Not Just Bookings: Addressing Key Clinical & Financial Challenges in Medical Travel",
    description:
      "Bringing clinical structure, verified outcomes, and experience design to an industry long plagued by backchannels and uncertain quotes.",
    image: "/uploads/about/team-8.webp",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/static/v2/about-us/team-8.webp"
  },
  {
    id: "press-6",
    source: "Afaqs!",
    date: "July 1, 2025",
    title: "Healthcare Innovators Team Up to Launch Transparent Cross-Border Care Architecture",
    description:
      "Direct hospital billing models and pre-departure medical second opinions empower traveling patients worldwide.",
    image: "/uploads/about/team-9.webp",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/static/v2/about-us/team-9.webp"
  },
  {
    id: "press-7",
    source: "Access Newswire",
    date: "July 1, 2025",
    title: "Cross-Border Medical Platform Expands Global Specialist Network Across Key Destinations",
    description:
      "Simplifying how elective procedures including cardiac care, orthopedic surgery, IVF, cosmetic surgery, and oncology are accessed worldwide.",
    image: "/uploads/about/team-0.webp",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/static/v2/about-us/team-0.webp"
  }
];

export const ABOUT_STATS = {
  hospitals: "1500+",
  doctors: "3600+",
  countries: "38+",
  googleRating: "4.8",
  trustScore: "4.2"
};
