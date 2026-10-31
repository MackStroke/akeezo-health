/**
 * Curated and audited blog data for AKEEZO Healthcare Platform.
 * Extracted from official healthcare publication reference and seeded clinical guides.
 */

export interface BlogArticleItem {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  image: string;
  category: string;
  readTime?: string;
  author?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export const FEATURED_BLOG_ARTICLE: BlogArticleItem = {
  "slug": "surgery-abroad-red-flags-avoid-scams",
  "image": "https://curator-app.s3.ap-south-1.amazonaws.com/medium_SURGERYABROADWITHOUTGETTINGSCAMMED_4552e08596.webp",
  "title": "How to Get Surgery Abroad Without Getting Scammed: 7 Red Flags You Must Know",
  "excerpt": "Medical tourism can be life-changing, but it’s not without risks. Here are 7 red flags every patient must know before getting surgery abroad. Spot the scams. Choose safety. Travel smart.",
  "date": "2025-07-29",
  "category": "Safety & Scams",
  "readTime": "5 min read",
  "author": {
    "name": "Akeezo Clinical Editorial Board",
    "role": "Medical Tourism Safety & Patient Advocacy"
  }
};

export const LATEST_BLOG_POSTS: BlogArticleItem[] = [
  {
    "slug": "how-to-fix-knock-knees-in-adults-without-surgery",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289757332-343fl9y8yfv.jpg",
    "title": "How to Fix Knock Knees in Adults Without Surgery: What’s Realistic, What Works & What to Avoid",
    "date": "2026-10-29",
    "category": "Latest Insights",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Orthopedic & Joint Specialist"
    }
  },
  {
    "slug": "which-surgery-is-worse-knee-or-shoulder",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "title": "Which Surgery Is Worse: Knee or Shoulder? Pain, Recovery & Risks Compared",
    "date": "2026-10-29",
    "category": "Latest Insights",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Orthopedic & Joint Specialist"
    }
  },
  {
    "slug": "common-knee-surgeries",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793287387142-qizmlxh79zs.jpg",
    "title": "Common Knee Surgeries: Types, What They Treat, Risks & How to Choose the Right One",
    "date": "2026-10-29",
    "category": "Latest Insights",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Orthopedic & Joint Specialist"
    }
  },
  {
    "slug": "after-hip-surgery-knee-pain",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793285508038-v94ab588nk.jpg",
    "title": "Knee Pain After Hip Surgery: Why It Happens, When It’s Normal & When to Call Your Surgeon",
    "date": "2026-10-29",
    "category": "Latest Insights",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Orthopedic & Joint Specialist"
    }
  },
  {
    "slug": "coolsculpting-before-and-after",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793255757908-i9j7wr4myf.jpg",
    "title": "CoolSculpting Before and After: Results, Timeline, and What to Expect",
    "date": "2026-10-29",
    "category": "Latest Insights",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Orthopedic & Joint Specialist"
    }
  },
  {
    "slug": "how-to-choose-a-surrogacy-agency",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793259342888-8k18bb8aiwb.jpg",
    "title": "How to Choose a Surrogacy Agency: Questions to Ask & Red Flags to Avoid",
    "date": "2026-10-28",
    "category": "Latest Insights",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Orthopedic & Joint Specialist"
    }
  }
];

export const ALL_BLOG_ARTICLES: BlogArticleItem[] = [
  {
    "slug": "robotic-knee-replacement-in-india-cost-technology-guide",
    "title": "Complete Guide to Robotic Knee Replacement in India: Cost, Technology & Recovery",
    "date": "2026-10-25",
    "excerpt": "A complete clinical overview of robotic knee replacement in India. Compare Mako surgical robotics, premier JCI accredited hospital packages from $4,200, surgeon qualifications, and rapid recovery protocols.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Chief Orthopedic Consultant"
    }
  },
  {
    "slug": "proton-beam-therapy-in-india-cost-cancer-centers",
    "title": "Proton Beam Therapy in India: Advanced Cancer Treatment & Leading Centers",
    "date": "2026-10-20",
    "excerpt": "Explore cutting-edge proton beam therapy for precision cancer care in India. Learn about Pencil Beam Scanning, pediatric and skull-base tumor protocols, accredited centers, and treatment costs.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793287387142-qizmlxh79zs.jpg",
    "category": "Oncology",
    "author": {
      "name": "Dr. Arvind Chawla",
      "role": "Chief Clinical Oncologist"
    }
  },
  {
    "slug": "which-surgery-is-worse-knee-or-shoulder",
    "title": "Which Surgery Is Worse: Knee or Shoulder? Pain, Recovery & Risks Compared",
    "date": "2026-10-29",
    "excerpt": "Which surgery is worse, knee or shoulder? Compare pain levels, daily life, recovery timelines, rehab demands and risks to understand what to expect from each procedure.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "common-knee-surgeries",
    "title": "Common Knee Surgeries: Types, What They Treat, Risks & How to Choose the Right One",
    "date": "2026-10-29",
    "excerpt": "Explore the most common knee surgeries, from arthroscopy and meniscus repair to ACL reconstruction and knee replacement, with what each treats, the risks and how to choose.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793287387142-qizmlxh79zs.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "after-hip-surgery-knee-pain",
    "title": "Knee Pain After Hip Surgery: Why It Happens, When It’s Normal & When to Call Your Surgeon",
    "date": "2026-10-29",
    "excerpt": "Learn why knee pain after hip surgery happens, how long it usually lasts, which warning signs need urgent care and safe ways to ease it during hip recovery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793285508038-v94ab588nk.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "coolsculpting-before-and-after",
    "title": "CoolSculpting Before and After: Results, Timeline, and What to Expect",
    "date": "2026-10-29",
    "excerpt": "See CoolSculpting before and after results, when changes start to show, how many sessions you may need, possible side effects and who is a suitable candidate.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793255757908-i9j7wr4myf.jpg",
    "category": "Cosmetic Surgery",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "how-to-choose-a-surrogacy-agency",
    "title": "How to Choose a Surrogacy Agency: Questions to Ask & Red Flags to Avoid",
    "date": "2026-10-28",
    "excerpt": "Learn how to choose a surrogacy agency, from verifying licensing and accreditation to the key questions to ask a surrogacy agency about screening, costs and support, plus red flags to avoid.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793259342888-8k18bb8aiwb.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "what-states-is-surrogacy-legal-in",
    "title": "What States Is Surrogacy Legal in? A State-by-State Guide to US Laws (2026)",
    "date": "2026-10-28",
    "excerpt": "What states is surrogacy legal in? Compare surrogacy-friendly, gray-area and restrictive states, see a state-by-state law comparison and learn how surrogacy works across state lines.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793258535925-l5sy657ypsn.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "surrogacy-screening-process",
    "title": "Surrogacy Screening Process: How Surrogates Are Medically & Psychologically Vetted for Safety",
    "date": "2026-10-28",
    "excerpt": "Understand the surrogacy screening process step by step, from basic eligibility and medical clearance to background checks, home assessment and psychological evaluation.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793257642480-wqlcldptwz.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "is-surrogacy-legal-in-the-us",
    "title": "Is Surrogacy Legal in the US? The Complete 2026 Legal Overview",
    "date": "2026-10-28",
    "excerpt": "Is surrogacy legal in the US? Learn how state laws differ on surrogacy contracts, compensated surrogacy, legal parentage, pre-birth orders and international surrogacy in 2026.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793256448436-eimtbx7mjbm.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "gay-surrogacy",
    "title": "Gay Surrogacy: A Complete Guide for Same-Sex Male Couples Building a Family",
    "date": "2026-10-28",
    "excerpt": "A complete guide to gay surrogacy for same-sex male couples, covering egg donors, IVF, gestational carriers, legal parentage, LGBTQ+-friendly states and costs.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793189952601-25wyc4d1rdq.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "financing-surrogacy",
    "title": "Financing Surrogacy: Loans, Grants, Employer Benefits & Payment Plans Explained",
    "date": "2026-10-28",
    "excerpt": "A practical guide to financing surrogacy, covering agency payment plans, fertility loans, employer benefits, surrogacy grants, crowdfunding, tax rules and budgeting.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793189576203-b9fszxlqx4q.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "does-insurance-cover-surrogacy",
    "title": "Does Insurance Cover Surrogacy? What Intended Parents & Surrogates Need to Know in 2026",
    "date": "2026-10-28",
    "excerpt": "Does insurance cover surrogacy? Learn whose policy pays for IVF and the surrogate's pregnancy, common exclusions, state laws, surrogate-specific policies and employer plans.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793189266121-e82xjksfi07.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "alternatives-to-hip-replacement-surgery",
    "title": "Alternatives to Hip Replacement Surgery: What Works, What Only Delays & When Surgery Is the Safer Choice",
    "date": "2026-10-27",
    "excerpt": "Explore alternatives to hip replacement surgery, including exercise, physical therapy, injections, PRP and hip-preserving procedures, and learn when surgery may be the safer choice.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793185657098-9u3hhvsvnz.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "how-to-prepare-for-hip-replacement-surgery",
    "title": "How to Prepare for Hip Replacement Surgery: A Step-by-Step Safety Checklist (2026 Guide)",
    "date": "2026-10-27",
    "excerpt": "Learn how to prepare for hip replacement surgery with a step-by-step checklist covering medical clearance, pre-op tests, medications, prehab exercises, home safety, hospital packing and surgery day.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793187351768-zlf5p5vm9l.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "how-long-does-knee-replacement-surgery-take",
    "title": "How Long Does Knee Replacement Surgery Take?",
    "date": "2026-10-27",
    "excerpt": "How long does knee replacement surgery take? Learn typical operating times for total, partial and revision knee replacement, what affects surgery length and what to expect during recovery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793186537426-fsnk2s78cq.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "exercises-before-knee-replacement-surgery",
    "title": "Exercises Before Knee Replacement Surgery: 8 Exercises to Prepare for Recovery",
    "date": "2026-10-27",
    "excerpt": "Learn 8 exercises before knee replacement surgery, when to start pre-surgery exercises for knee replacement, how often to do them and safety tips to help you prepare for recovery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793186178877-hr1biz180d.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "alternatives-to-knee-surgery-and-knee-replacement",
    "title": "Alternatives to Knee Surgery and Knee Replacement: Non-Surgical and Surgical Options",
    "date": "2026-10-27",
    "excerpt": "Explore alternatives to knee surgery and knee replacement, from physical therapy, weight management and knee injections to osteotomy and partial knee replacement, plus signs you may need surgery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793187058240-i6wn7h88qna.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "what-to-expect-after-knee-replacement-surgery",
    "title": "What to Expect After Knee Replacement Surgery: Recovery, Pain, and Care",
    "date": "2026-10-26",
    "excerpt": "Learn what to expect after knee replacement surgery, including a week-by-week recovery timeline, how long pain lasts, physical therapy, wound care and warning signs to watch for.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793019048324-4c16q0uooxo.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "dangers-delaying-knee-replacement-surgery",
    "title": "Dangers of Delaying Knee Replacement Surgery: Risks, Signs, and When to Act",
    "date": "2026-10-26",
    "excerpt": "Learn the dangers of delaying knee replacement surgery, how waiting affects mobility, surgery and recovery, the signs you may need a new knee and how to manage pain while you wait.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793018822666-vf3u1xxz359.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "how-much-does-it-cost-for-knee-replacement-surgery",
    "title": "How Much Does It Cost for Knee Replacement Surgery in 2026?",
    "date": "2026-10-26",
    "excerpt": "How much does it cost for knee replacement surgery in 2026? See average US prices, what the cost includes, costs with and without insurance, Medicare coverage and ways to save.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793018552786-yvudhi5l6hh.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "do-you-need-referral-to-see-orthopedic-doctor",
    "title": "Do You Need a Referral to See an Orthopedic Doctor? What Your Insurance Plan Determines",
    "date": "2026-10-26",
    "excerpt": "Find out if you need a referral to see an orthopedic doctor, how HMO, PPO, POS and Medicare plans handle referrals, self-pay options and what happens if you skip one.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793018161845-axcuxjvyp3u.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "shoulder-orthopedic-surgeon",
    "title": "Orthopedic Surgeon for Shoulder: When to See, What Questions to Ask & Safe Next Steps",
    "date": "2026-10-23",
    "excerpt": "Learn when to see a shoulder orthopedic surgeon, the warning signs that need urgent care, treatments to try before surgery, the questions to ask and typical recovery timelines.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1792757663408-b800bh7pgcs.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "hip-orthopedic-surgeon",
    "title": "Hip Orthopedic Surgeon: Conditions Treated, Surgery Options & Choosing the Right Doctor",
    "date": "2026-10-23",
    "excerpt": "Learn what a hip orthopedic surgeon treats, the warning signs that need urgent care, the types of orthopedic hip surgeons, treatment options from therapy to hip replacement, and how to choose the right doctor.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1792758595312-y2ejsrcot4k.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "orthopedic-surgeon-knee",
    "title": "Orthopedic Surgeon for Knee Problems: When to See One, What They Treat & How to Choose",
    "date": "2026-10-23",
    "excerpt": "Learn when to see an orthopedic surgeon for knee problems, which knee conditions they treat, what to expect at your first visit, treatment options and how to choose a qualified surgeon.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1792758860177-6ogym8fp1n6.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "orthopedic-surgeon-for-rotator-cuff",
    "title": "Orthopedic Surgeon for Rotator Cuff: When Surgery Is Needed, Repair Options & Safe Recovery",
    "date": "2026-10-23",
    "excerpt": "Find out when to see an orthopedic surgeon for rotator cuff tears, how partial and full-thickness tears are treated, the repair options, possible risks and the recovery timeline.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1792759122226-2bdifkxbyyv.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "elbow-orthopedic-surgeon",
    "title": "Elbow Orthopedic Surgeon: Conditions Treated, Surgery, and When to See One",
    "date": "2026-10-23",
    "excerpt": "Learn what an elbow orthopedic surgeon treats, the signs that mean you should see one, nonsurgical and surgical treatment options, and what to expect during recovery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1792759259515-jb2xyooh769.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "car-accident-orthopedic-doctor",
    "title": "When to See an Orthopedic Doctor After a Car Accident: Signs, Injuries, and Treatment",
    "date": "2026-10-23",
    "excerpt": "Learn when to see a car accident orthopedic doctor, the common injuries caused by crashes, delayed symptoms to watch for, how injuries are diagnosed, treatment options and typical recovery times.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1792759615299-tsmy5ve8nk.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "healing-breast-augmentation",
    "title": "Breast Augmentation Healing & Recovery: Week-by-Week Timeline & Warning Signs",
    "date": "2026-10-13",
    "excerpt": "A week-by-week guide to healing after breast augmentation, covering the recovery timeline, normal symptoms, warning signs, activity restrictions and long-term implant safety.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791894354441-5kftlgz75nj.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "tummy-tuck-abdominoplasty-cost",
    "title": "Tummy Tuck (Abdominoplasty) Cost in 2026: Full Price Guide, Procedure Steps & Costs Abroad",
    "date": "2026-10-13",
    "excerpt": "Tummy tuck and abdominoplasty costs explained for 2026: US price ranges, what a quote includes, hidden costs, city and country comparisons, and how the procedure works step by step.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791893844860-tyndgaj6vl.jpg",
    "category": "Cosmetic Surgery",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "breastfeeding-after-breast-augmentation",
    "title": "Breastfeeding After Breast Augmentation: Can You Still Breastfeed?",
    "date": "2026-10-13",
    "excerpt": "Can you breastfeed after breast augmentation? Learn how implant placement, incision type and nerve changes affect milk supply, plus how to prepare and when to get lactation support.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791893290469-yw5f01sbyr7.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "how-much-is-a-breast-augmentation",
    "title": "How Much Does a Breast Augmentation Cost? Full 2026 Pricing Guide",
    "date": "2026-10-13",
    "excerpt": "How much is a breast augmentation in 2026? See US price ranges for implants and fat transfer, a full cost breakdown, city and country comparisons, hidden costs and insurance coverage.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791892641780-vi0dantklo.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "disqualifications-for-surrogacy",
    "title": "Disqualifications for Surrogacy: Who May Not Qualify and Why?",
    "date": "2026-10-09",
    "excerpt": "A clear guide to disqualifications for surrogacy, covering medical conditions, age, BMI, pregnancy history, substance use, mental health and legal factors, and which ones can change over time.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791542277326-7lyxghnnwek.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "define-altruistic-surrogacy",
    "title": "What Is Altruistic Surrogacy? Definition, Process, and Costs",
    "date": "2026-10-09",
    "excerpt": "Define altruistic surrogacy in simple terms: a surrogate carries a baby for no fee, with only her expenses reimbursed. Learn how the process works, who qualifies, where it is legal and what it costs.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791541499713-z2zd11bv0h8.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "whose-egg-is-used-in-surrogacy",
    "title": "Whose Egg Is Used in Surrogacy: The Intended Mother or Donor?",
    "date": "2026-10-09",
    "excerpt": "Whose egg is used in surrogacy? Learn when the intended mother's egg, a donor egg or the surrogate's own egg is used, and what each option means for genetics, IVF and legal steps.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791541035880-8zqaj8ld5l7.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "turkey-vs-mexico-dental-tourism",
    "title": "Turkey vs Mexico Dental Tourism: Costs, Travel and Safety Compared",
    "date": "2026-10-05",
    "excerpt": "Turkey vs Mexico dental tourism compared: implant and All-on-4 costs, treatment timelines, travel, aftercare, warranties and how to verify a clinic before you book.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791608731277-xffsbsegub.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "india-vs-thailand-medical-tourism",
    "title": "India vs Thailand Medical Tourism: Costs, Hospitals and Safety Compared",
    "date": "2026-10-05",
    "excerpt": "India vs Thailand medical tourism compared side by side: treatment costs, hospital accreditation, package structures, visa rules and safety checks for international patients.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1792593020402-ilzaoe73j8.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "india-vs-turkey-cosmetic-surgery",
    "title": "India vs Turkey Cosmetic Surgery: Complete Cost and Safety Guide",
    "date": "2026-10-05",
    "excerpt": "Compare India vs Turkey cosmetic surgery side by side: costs, hospital accreditation, package inclusions, visa rules and safety checks to help you choose with confidence.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791801501119-oty4sjxr4j.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "hair-transplant-recovery-timeline",
    "title": "Hair Transplant Recovery: Growth Timeline Month by Month",
    "date": "2026-10-01",
    "excerpt": "A month-by-month hair transplant recovery timeline explaining what to expect after surgery, shock loss, new growth, FUE vs FUT recovery and when results appear.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791978619328-xqurt6s2i4.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "gastric-sleeve-recovery",
    "title": "Gastric Sleeve Recovery Timeline and Diet Stages",
    "date": "2026-10-01",
    "excerpt": "A complete guide to gastric sleeve recovery, covering the week-by-week timeline, diet stages, common symptoms, warning signs and long-term lifestyle changes.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791978790164-jwju9a0r6rd.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "dental-implant-recovery",
    "title": "Dental Implant Recovery: What to Eat, Pain Management",
    "date": "2026-10-01",
    "excerpt": "What to expect during dental implant recovery from day 1 to month 6, including what to eat, how to manage pain and swelling, implant care and warning signs.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791979000748-6s4bwgsz4ib.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "breast-augmentation-recovery",
    "title": "Breast Augmentation Recovery Week by Week",
    "date": "2026-10-01",
    "excerpt": "A week-by-week guide to breast augmentation recovery, covering pain, common side effects, recovery tips and when you can return to work and exercise.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791979676504-8cu81u6tmvc.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "facelift-recovery-timeline",
    "title": "Facelift Recovery Timeline: Swelling, Bruising, Results",
    "date": "2026-10-01",
    "excerpt": "A week-by-week facelift recovery timeline covering swelling, bruising, numbness, returning to work and exercise, and when final results appear.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791979736778-yvn5lkv2d2.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "tummy-tuck-risks-of-death",
    "title": "Tummy Tuck Risks of Death: What the Statistics Actually Show",
    "date": "2026-09-30",
    "excerpt": "Understand tummy tuck risks of death: published mortality estimates, why pulmonary embolism is the main concern, key risk factors and practical steps to lower your risk.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793358679908-p3mjekhakej.jpg",
    "category": "Cosmetic Surgery",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "tummy-tuck-belly-button",
    "title": "Tummy Tuck Belly Button: Safety Risks, Scar Care & Recovery Timeline Explained",
    "date": "2026-09-30",
    "excerpt": "What happens to your tummy tuck belly button? Learn how the new navel is created, the safety risks and warning signs, scar care and the week-by-week recovery timeline.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793007313987-db0azepipgu.jpg",
    "category": "Cosmetic Surgery",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "how-much-does-a-breast-lift-cost",
    "title": "How Much Does a Breast Lift Cost in 2026? Breast Lift With Implants Cost & Prices",
    "date": "2026-09-30",
    "excerpt": "How much does a breast lift cost in 2026? See US price ranges, the cost for a breast lift with implants, costs by technique and city, prices abroad and hidden fees to budget for.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "does-insurance-cover-breast-lift",
    "title": "Does Insurance Cover Breast Lift? What Determines Coverage in 2026",
    "date": "2026-09-30",
    "excerpt": "Does insurance cover breast lift surgery? See when a mastopexy is cosmetic or medically necessary, post-mastectomy coverage rules, Medicare and Medicaid, and how to appeal.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "implants-vs-dentures",
    "title": "Dental Implants vs Dentures: Which Is Better?",
    "date": "2026-09-25",
    "excerpt": "Implants vs dentures compared: comfort, eating and speaking, bone health, procedure, longevity, cost and implant-supported options to help you choose.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "veneers-vs-crowns-comparison",
    "title": "Veneers vs Crowns: Cost, Durability, and Results",
    "date": "2026-09-25",
    "excerpt": "Veneers vs crowns compared: what each treatment fixes, types, cost, lifespan, the procedure and aftercare so you can choose the right option for your teeth.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "gastric-sleeve-vs-gastric-bypass-comparison",
    "title": "Gastric Sleeve vs Gastric Bypass: Complete Comparison",
    "date": "2026-09-25",
    "excerpt": "Gastric sleeve vs gastric bypass compared: how each surgery works, expected weight loss, health benefits, recovery, risks and cost to help you decide.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "ivf-vs-iui-comparison",
    "title": "IVF vs IUI: Which Fertility Treatment Is Best?",
    "date": "2026-09-25",
    "excerpt": "IVF vs IUI compared: when IUI will not work, success rates per cycle, total cost, insurance step rules, risks and who should start with each treatment.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791981676769-176rgvbyfj.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "bbl-vs-hip-dips-differences ",
    "title": "BBL vs Hip Dips Surgery: Differences and Results",
    "date": "2026-09-25",
    "excerpt": "BBL vs hip dips surgery compared: what each procedure targets, fat grafting needs, recovery time, cost, safety and how long results last.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "liposuction-vs-tummy-tuck",
    "title": "Liposuction vs Tummy Tuck: Which Is Right for You?",
    "date": "2026-09-25",
    "excerpt": "Liposuction vs tummy tuck explained: how each procedure works, the skin elasticity test, diastasis recti, recovery, scarring and cost to help you choose.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791981169611-8ir2l914snf.jpg",
    "category": "Cosmetic Surgery",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-countries-orthopedic-surgery",
    "title": "Best Countries for Orthopedic Surgery Abroad",
    "date": "2026-09-25",
    "excerpt": "Compare the best countries for orthopedic surgery abroad, including India, Germany, Thailand, Mexico and South Korea, by cost, implant quality and recovery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-countries-ivf-treatment",
    "title": "Best Countries for IVF and Fertility Treatment Abroad",
    "date": "2026-09-25",
    "excerpt": "Compare the best countries for IVF treatment abroad, including Spain, Czech Republic, Greece, Mexico, India and Turkey, by legal access, cost and success rates.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1791803227705-wnryeocjje8.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-countries-weight-loss-surgery",
    "title": "Best Countries for Weight Loss Surgery",
    "date": "2026-09-25",
    "excerpt": "Compare the best countries for weight loss surgery, including Mexico, Turkey, Costa Rica, Poland, Thailand and Colombia, by cost, safety and aftercare.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-countries-cosmetic-surgery",
    "title": "Best Countries for Cosmetic Surgery Abroad",
    "date": "2026-09-25",
    "excerpt": "Compare the best countries for cosmetic surgery abroad, including South Korea, Brazil, Colombia, Turkey, Mexico and Thailand, by procedure, cost and safety.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-countries-dental-tourism",
    "title": "Best Countries for Dental Tourism in 2026",
    "date": "2026-09-24",
    "excerpt": "Compare the best countries for dental tourism in 2026, including Mexico, Turkey, Thailand, Hungary, Poland and Costa Rica, by cost, quality and convenience.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-ivf-clinics-abroad",
    "title": "Best IVF Clinics Abroad: Top 10 for 2026",
    "date": "2026-09-24",
    "excerpt": "Compare the best IVF clinics abroad in 2026, with success rates, costs by country, legal requirements, donor egg options and tips for choosing a clinic.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Fertility & Surrogacy",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-hospitals-delhi-medical-tourism",
    "title": "Best Hospitals in Delhi for International Patients",
    "date": "2026-09-24",
    "excerpt": "Find the best hospitals in Delhi for medical tourism, with top picks by treatment, accreditation, costs, visa steps and services for international patients.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-hospitals-bangkok-medical-tourism",
    "title": "Best Hospitals in Bangkok for Medical Tourism",
    "date": "2026-09-24",
    "excerpt": "A guide to the best hospitals in Bangkok for medical tourism, comparing specialties, treatment costs, accreditation and services for international patients.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-hospitals-istanbul-cosmetic-surgery",
    "title": "Best Hospitals in Istanbul for Cosmetic Surgery",
    "date": "2026-09-24",
    "excerpt": "Compare the best hospitals in Istanbul for cosmetic surgery, with popular procedures, costs, package inclusions, safety standards and tips for choosing a surgeon.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "best-hospitals-mumbai",
    "title": "Best Hospitals in Mumbai for Medical Tourists",
    "date": "2026-09-24",
    "excerpt": "Compare the best hospitals in Mumbai for international patients, including top specialties, treatment costs, accreditation and international patient services.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-spain",
    "title": "Medical Tourism in Spain: European Healthcare Quality",
    "date": "2026-09-24",
    "excerpt": "Learn how medical tourism in Spain works, including popular treatments, top hospitals, costs compared to other countries, visa requirements and follow-up care.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-dubai",
    "title": "Medical Tourism in Dubai (UAE): Premium Care Guide",
    "date": "2026-09-24",
    "excerpt": "A guide to medical tourism in Dubai covering popular treatments, top hospitals, treatment costs, DHA regulations, medical visas and recovery support for international patients.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-malaysia",
    "title": "Medical Tourism in Malaysia: Affordable Healthcare Abroad",
    "date": "2026-09-24",
    "excerpt": "Everything international patients need to know about medical tourism in Malaysia, from treatment costs and top hospitals to visas, accreditation and patient safety.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-south-korea",
    "title": "Medical Tourism in South Korea: Cosmetic Surgery Hub",
    "date": "2026-09-24",
    "excerpt": "A complete guide to medical tourism in South Korea, covering cosmetic surgery costs, accredited hospitals, visa options, top cities and recovery planning for international patients.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "otoplasty-surgery-cost-abroad",
    "title": "Otoplasty Cost Abroad: Ear Surgery Prices and Best Destinations",
    "date": "2026-09-23",
    "excerpt": "Compare otoplasty cost abroad in Turkey, Thailand, South Korea, Mexico and India against US and UK prices, plus what affects the price, hidden costs, safety and recovery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "thigh-lift-surgery-abroad",
    "title": "Thigh Lift Abroad: Surgery Costs, Best Countries and Recovery",
    "date": "2026-09-23",
    "excerpt": "Considering a thigh lift abroad? Compare surgery costs in Turkey, Mexico, Thailand, India, Brazil and Colombia, what packages include, extra costs, risks and recovery.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "arm-lift-cost-abroad",
    "title": "Arm Lift Cost Abroad: Brachioplasty Prices by Country and Hidden Costs",
    "date": "2026-09-23",
    "excerpt": "See the arm lift cost abroad in Turkey, Mexico, Thailand, India and Eastern Europe, what all-inclusive packages cover, hidden costs to budget for, and how to vet your surgeon.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "chin-implant-abroad-surgery-costs-country",
    "title": "Chin Implant Abroad: Surgery Costs by Country, Safety and Recovery",
    "date": "2026-09-23",
    "excerpt": "Planning a chin implant abroad? Compare surgery costs in Turkey, Mexico, South Korea, Thailand, Eastern Europe and India, what packages include, and how to choose a safe surgeon.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "full-mouth-restoration-abroad",
    "title": "Full Mouth Restoration Abroad: Cost Comparison and Top Destinations",
    "date": "2026-09-23",
    "excerpt": "Compare full mouth restoration abroad costs in Mexico, Costa Rica, Turkey, Hungary, Thailand and India, plus what affects the price, the treatment process, risks and how to choose a clinic.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "cosmetic-dentistry-abroad",
    "title": "Cosmetic Dentistry Abroad: Full Cost Breakdown for Veneers, Implants and More",
    "date": "2026-09-23",
    "excerpt": "See the full cost breakdown of cosmetic dentistry abroad, from veneers and implants to full mouth makeovers in Turkey, Mexico, Hungary and Thailand, plus travel costs, extra fees and risks.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Dental Care",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-in-mexico",
    "title": "Medical Tourism in Mexico: What You Need to Know",
    "date": "2026-08-11",
    "excerpt": "Discover medical tourism in Mexico, including treatment costs, top hospitals, popular procedures, safety considerations, and how to choose a qualified healthcare provider.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793360376095-zlw6nfdjid.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-in-thailand",
    "title": "Medical Tourism in Thailand: Best Hospitals and Procedures",
    "date": "2026-08-11",
    "excerpt": "Discover medical tourism in Thailand, including affordable treatment costs, leading hospitals, popular procedures, safety considerations, visa requirements, and tips for planning treatment abroad.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-in-turkey",
    "title": "Medical Tourism in Turkey: Hospitals, Costs, Safety",
    "date": "2026-08-11",
    "excerpt": "Explore medical tourism in Turkey, including treatment costs, top hospitals, safety standards, popular procedures, medical packages, and tips for choosing the right hospital and surgeon.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "medical-tourism-in-india",
    "title": "Medical Tourism in India: Complete 2026 Patient Guide",
    "date": "2026-08-11",
    "excerpt": "Medical tourism in India offers affordable, quality healthcare with experienced specialists, accredited hospitals, and significant savings on major treatments.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "how-to-prepare-for-surgery-abroad",
    "title": "How to Prepare for Surgery Abroad: Complete Checklist",
    "date": "2026-08-11",
    "excerpt": "A practical guide to preparing for surgery abroad, covering medical records, insurance, travel planning, costs, packing, surgeon verification, and follow-up care.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "flying-after-surgery-when-is-it-safe",
    "title": "Flying After Surgery: When Is It Safe?",
    "date": "2026-08-10",
    "excerpt": "Learn when you can safely fly after surgery, how recovery affects air travel, potential risks, and important precautions to take before traveling.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Clinical Guide",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "hip-replacement-recovery-guide",
    "title": "Hip Replacement Recovery Guide: Complete Timeline",
    "date": "2026-08-10",
    "excerpt": "Learn what to expect during eyelid surgery recovery, from early swelling and bruising to scar healing, returning to work, exercise, makeup, and final results.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Orthopedics",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "eyelid-surgery-recovery-swelling-and-healing-timeline",
    "title": "Eyelid Surgery Recovery: Swelling and Healing Timeline",
    "date": "2026-08-10",
    "excerpt": "Learn what to expect during eyelid surgery recovery, from early swelling and bruising to scar healing, returning to work, exercise, makeup, and final results.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Ophthalmology",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  },
  {
    "slug": "mommy-makeover-recovery-what-to-expect",
    "title": "Mommy Makeover Recovery: What to Expect",
    "date": "2026-08-10",
    "excerpt": "Mommy makeover recovery depends on the procedures performed and your overall healing process. Learn about the recovery timeline, aftercare, activity restrictions, expected discomfort, and when you can return to your normal routine.",
    "image": "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
    "category": "Cosmetic Surgery",
    "author": {
      "name": "Akeezo Medical Advisory Board",
      "role": "Specialist Reviewer"
    }
  }
];
