export interface TreatmentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  href: string;
  image: string;
  fallbackImage: string;
  category: "Surgical" | "Fertility & Reproductive" | "Wellness & Holistic" | "Specialized Care" | "Dermatology & Aesthetics";
}

export const ALL_TREATMENTS: TreatmentItem[] = [
  {
    id: "cosmetic-plastic-surgery",
    title: "Cosmetic/Plastic Surgery",
    slug: "cosmetic-plastic-surgery",
    description: "Explore cosmetic surgery medical tourism. Rhinoplasty, liposuction, facelifts, BBL &amp; more at top-rated hospitals abroad. Save up to 70% with free treatment planning.",
    href: "/treatments/cosmetic-plastic-surgery",
    image: "/uploads/treatments/cosmetic-plastic-surgery.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/cosmetic-plastic-surgery-1774526835264.webp",
    category: "Dermatology & Aesthetics"
  },
  {
    id: "surrogacy",
    title: "Surrogacy",
    slug: "surrogacy",
    description: "Surrogacy is an option for people and couples wanting to have a child but cannot become pregnant due to a health condition or another circumstance. A surrogate will carry and deliver a child for the intended parent(s), and the entire process is monitored closely by experienced fertility doctors and medical professionals. Advanced reproductive technologies (ART) such as IVF, are commonly used to produce embryos that will be placed into the surrogate's uterus. Through AKEEZO, patients can find and work with trustworthy fertility centers and structured surrogacy programs in top international medical travel locations. The fertility centers and surrogacy programs offer programs and services that focus on ethical practices, and comply with all applicable laws. Additionally, patients are able to work with one person throughout the program, and will receive personalized guidance and support during all stages of their treatment, from first consultation and treatment planning, through to pregnancy and delivery.",
    href: "/treatments/surrogacy",
    image: "/uploads/treatments/surrogacy.png",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/procedures/surrogacy-1772017955888.png",
    category: "Fertility & Reproductive"
  },
  {
    id: "ivf-treatment",
    title: "IVF Treatment",
    slug: "ivf-treatment",
    description: "Abroad, couples can receive all-encompassing reproductive health services; these include IVF, ICSI, IUI, PGD/PGS genetic screening of embryos, male infertility treatments, egg donors, and surrogacy services, all provided by the highest-quality fertility medical teams. Many individuals face substantial financial barriers to fertility treatment. For example, an IVF cycle with ICSI in the U.S. will cost anywhere from $15,000 to $25,000 while the same IVF cycle with ICSI at an internationally accredited fertility clinic abroad could cost as little as $2,500 to $5,500. Abroad, international fertility centers provide larger donor databases, reduced wait times, time-lapse embryonic imaging, and multi-lingual fertility program managers to help guide patients from initial consultations to confirming pregnancy. All patients report receiving better communication, personalization, and accessibility when undergoing fertility treatment abroad compared to their experiences at home. When choosing an internationally located IVF center, it is essential to first determine the quality of the IVF laboratory. It is also very important to evaluate the level of experience of the reproductive endocrinologist. Therefore, you should always check a fertility center's live-birth rate (and not just clinical pregnancy rates), the laboratory accreditation, and the qualifications of the embryologists. The emotional support and well-being of patients, along with a patient's ability to adhere to recommended healthy lifestyle habits during the IVF cycle, as well as adhering to the fertility doctor's stimulation protocol recommendations, are all critical components of successful fertility treatment.",
    href: "/treatments/ivf-treatment",
    image: "/uploads/treatments/ivf-treatment.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/infertility-ivf-1774526618114.webp",
    category: "Fertility & Reproductive"
  },
  {
    id: "hair-transplant",
    title: "Hair Transplant",
    slug: "hair-transplant",
    description: "Hair transplantation abroad covers FUE, DHI, Sapphire FUE, beard transplants, and eyebrow restoration performed by experienced hair restoration surgeons. Procedures range from single-session transplants for mild hair loss to large mega-sessions for advanced baldness requiring 4,000 to 6,000 grafts. The cost factor is the primary driver for patients seeking hair transplantation abroad. A 3,000-graft FUE procedure that costs $10,000 to $15,000 at home may be available for $1,500 to $3,500 abroad at equally equipped clinics with skilled, board-certified hair transplant surgeons. Leading international hair transplant clinics offer all-inclusive packages covering surgery, accommodation, transfers, and aftercare products. Patients consistently report more detailed consultations, unhurried procedures, and thorough follow-up support than they received at home. The surgeon's technique and experience are the most critical factors for natural-looking results. Confirm the surgeon personally performs the procedure rather than delegating to technicians. Graft survival, hairline design, and postoperative care including proper washing and sun avoidance significantly affect the final outcome.",
    href: "/treatments/hair-transplant",
    image: "/uploads/treatments/hair-transplant.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/hair-transplant-1774690227673.webp",
    category: "Dermatology & Aesthetics"
  },
  {
    id: "orthopedics",
    title: "Orthopedics",
    slug: "orthopedics",
    description: "Orthopedic surgery abroad covers knee replacement, hip replacement, ACL reconstruction, arthroscopy, shoulder surgery, and spinal orthopedics performed by experienced orthopedic surgeons. Procedures range from minimally invasive arthroscopy to complex total joint reconstruction using computer-navigated and robotic-assisted techniques. The cost factor is the leading reason patients seek orthopedic surgery abroad. A total knee replacement that costs $35,000 to $55,000 at home may be available for $6,000 to $12,000 abroad at equally accredited hospitals with board-certified orthopedic surgeons using premium international implants. Leading international orthopedic hospitals offer shorter waiting times, high-volume surgical experience, and structured physiotherapy programs. Patients consistently report receiving more attentive surgical planning and rehabilitation care than they experienced at home. The surgeon's implant experience and the hospital's rehabilitation infrastructure are the most critical factors to ensure legitimacy. Confirm the implant brand and warranty, and verify the surgeon's annual procedure volume. Also never forget to ensure commitment of the facility to postoperative physiotherapy, activity restrictions, and follow-up imaging directly determines functional recovery.",
    href: "/treatments/orthopedics",
    image: "/uploads/treatments/orthopedics.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/orthopedic-surgery-1774690251495.webp",
    category: "Surgical"
  },
  {
    id: "dental-treatment",
    title: "Dental Treatment",
    slug: "dental-treatment",
    description: "Dental treatment overseas encompasses an array of dental treatments including dental implants and veneers as well as full mouth reconstruction and orthodontic treatment; teeth whitening and more complex restorative work. Cosmetic procedures represent just one aspect of dental tourism which can include: root canal therapy; gum treatment; bone grafting and same day smile make overs. Cost is by far the main reason why millions of people select dental treatment overseas each year. At home a full set of dental implants will cost anywhere from $40,000 to $60,000 while the same treatment in many of the countries where dental tourism occurs will cost from $8,000 to $15,000. Many of these leading dental clinics also have shorter wait times; fabricate crowns on the same day using CAD/CAM technology and have dedicated international patient coordinators. Patients often comment that their care was much more thorough and less rushed compared to what they received at home. The dentist's credentials and the clinic's sterilization and technology standards are the two most important aspects to consider when selecting a clinic. Always research the credentials of your dentist, review before-and-after photos, and confirm that the clinic you select utilizes international grade materials and implant systems.",
    href: "/treatments/dental-treatment",
    image: "/uploads/treatments/dental-treatment.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/dentistry-1774690270534.webp",
    category: "Specialized Care"
  },
  {
    id: "cancer-treatment",
    title: "Cancer Treatment",
    slug: "cancer-treatment",
    description: "Cancer treatment abroad gives patients an access to world-class oncology centers offering chemotherapy, immunotherapy, targeted therapy, radiation, and surgical oncology. Multidisciplinary tumor boards of oncologists, surgeons, and radiologists collaborate to design personalized treatment plans. Oncology care costs can be financially devastating in many countries. Advanced cancer treatments that cost $80,000 to $200,000 at home may be available for $15,000 to $50,000 abroad at JCI-accredited hospitals with equally qualified oncologists and the latest treatment technologies. International cancer centers provide comprehensive care including PET-CT imaging, genomic tumor profiling, and access to clinical trials not available locally. Dedicated oncology case managers guide patients through every step of their treatment journey. The oncologist's experience and the hospital's technology are the most important factors to consider to ensure authenticity. Always confirm your treating team includes board-certified oncologists and that the facility is accredited by a recognized international body. Adherence to your full treatment protocol, nutritional support, and psychological well-being during treatment all significantly influence outcomes.",
    href: "/treatments/cancer-treatment",
    image: "/uploads/treatments/cancer-treatment.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/cancer-treatment-1774690289997.webp",
    category: "Specialized Care"
  },
  {
    id: "obesity-bariatric-surgery",
    title: "Obesity/Bariatric Surgery",
    slug: "obesity-bariatric-surgery",
    description: "Bariatric surgery abroad covers gastric sleeve, gastric bypass, mini gastric bypass, gastric balloon, and revisional weight loss procedures performed by experienced bariatric surgeons. These life-changing operations are not limited to weight reduction alone, they resolve obesity-related conditions like type 2 diabetes, hypertension, and sleep apnea. The cost factor drives most patients toward bariatric surgery abroad. A gastric sleeve that costs $18,000 to $30,000 at home may be available for $4,000 to $8,000 abroad at equally accredited hospitals with board-certified bariatric surgeons and comprehensive pre- and post-operative programs. Leading international bariatric centers offer shorter waiting times, comprehensive nutritional and psychological evaluation, and dedicated aftercare support. Patients consistently report more structured preparation, individualized surgical planning, and thorough follow-up care than they received at home. The surgeon's bariatric certification and the program's aftercare structure are the most important factors to consider. Always confirm the program includes a dietitian, psychologist, and long-term follow-up plan for clarity with plan. Dietary compliance, supplementation adherence, and lifestyle changes after surgery are what ultimately determine long-term success.",
    href: "/treatments/obesity-bariatric-surgery",
    image: "/uploads/treatments/obesity-bariatric-surgery.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/obesity-bariatric-surgery-1774526469443.webp",
    category: "Surgical"
  },
  {
    id: "neurology",
    title: "Neurology",
    slug: "neurology",
    description: "Neurology treatment abroad provides access to world-class neurologists and neurosurgeons for brain, spine, and nervous system disorders including stroke, epilepsy, Parkinson's disease, multiple sclerosis, brain tumors, and neuropathy. Advanced diagnostic tools and evidence-based treatment protocols deliver outcomes comparable to the world's leading neurological centers. Neurological care costs can be prohibitive in many countries. Complex neurosurgical procedures that cost $80,000 to $150,000 at home may be available for $12,000 to $35,000 abroad at JCI-accredited hospitals with equally trained neurologists and the latest diagnostic and surgical technology. Leading international neurology centers offer shorter waiting times, intraoperative MRI suites, and dedicated international case coordinators. Patients report receiving comprehensive, attentive neurological care that was more accessible than at home. The neurologist's subspecialty experience and the hospital's technology infrastructure are the most important factors. Confirm your treating team includes fellowship-trained neurologists or neurosurgeons. Adherence to post-treatment rehabilitation, medication protocols, and follow-up imaging significantly influences long-term neurological outcomes.",
    href: "/treatments/neurology",
    image: "/uploads/treatments/neurology.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/neurology-1771591210714.jpg",
    category: "Specialized Care"
  },
  {
    id: "heart-care-surgery",
    title: "Heart Care/Surgery",
    slug: "heart-care-surgery",
    description: "Heart care and surgery abroad covers coronary artery bypass grafting, valve repair and replacement, angioplasty and stenting, structural heart interventions, and cardiac electrophysiology at internationally accredited cardiac centers. Options range from interventional cardiology procedures to complex open-heart surgery using minimally invasive approaches. Cardiac surgery is among the most expensive medical procedures in many countries. A coronary artery bypass that costs $80,000 to $150,000 at home may be available for $10,000 to $25,000 abroad at equally accredited cardiac hospitals with experienced cardiac surgeons and intensive care facilities. Leading international cardiac centers offer shorter waiting times, hybrid operating theaters, advanced cardiac imaging, and comprehensive cardiac rehabilitation programs. Patients consistently report receiving more attentive perioperative care and thorough follow-up than they experienced at home. The cardiac surgeon's experience and the hospital's cardiac ICU capabilities are the most critical factors. Confirm the surgeon's annual bypass or valve procedure volume. Adherence to cardiac rehabilitation, medication protocols, dietary changes, and regular follow-up echocardiography directly determines long-term cardiac outcomes.",
    href: "/treatments/heart-care-surgery",
    image: "/uploads/treatments/heart-care-surgery.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/heart-care-surgery-1771593715128.jpg",
    category: "Surgical"
  },
  {
    id: "organ-transplant",
    title: "Organ Transplant",
    slug: "organ-transplant",
    description: "Organ transplant surgery abroad provides access to life-saving kidney, liver, heart, lung, and bone marrow transplantation at internationally accredited transplant centers. Programs include comprehensive pre-transplant evaluation, compatible donor matching, expert surgical teams, and lifelong post-transplant follow-up care. Organ transplant waiting lists and costs are major barriers in many countries. A kidney transplant that costs $150,000 to $300,000 in the United States may be available for $25,000 to $50,000 abroad at equally accredited centers with experienced transplant surgeons and comprehensive immunosuppression programs. Leading international transplant centers offer shorter waiting times for living donor transplants, thorough compatibility testing, and dedicated transplant coordinators who manage every aspect of care. Patients consistently report receiving more personally coordinated, accessible transplant care than they experienced at home. The transplant center's accreditation and the surgical team's annual transplant volume are the most critical factors. Confirm the center performs a minimum of 50 transplants per year in your organ category. Lifelong adherence to immunosuppressive medications, infection prevention, and regular monitoring is non-negotiable for transplant survival and function.",
    href: "/treatments/organ-transplant",
    image: "/uploads/treatments/organ-transplant.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/organ-transplant-1774526814584.webp",
    category: "Surgical"
  },
  {
    id: "weight-loss-program",
    title: "Weight Loss Program",
    slug: "weight-loss-program",
    description: "Medical weight loss programs abroad offer medically supervised, evidence-based weight management combining nutritional therapy, GLP-1 pharmacotherapy, behavioral coaching, exercise medicine, and body composition monitoring. Programs are designed for sustainable, healthy weight loss \u2014 not short-term dieting \u2014 and address the metabolic and psychological drivers of obesity. Comprehensive medical weight loss care is expensive and fragmented in many countries. A medically supervised weight loss program that costs $8,000 to $20,000 at home may be available for $2,000 to $6,000 abroad at equally qualified medical wellness centers with physicians, dietitians, and behavioral coaches. Leading international medical weight loss centers offer thorough metabolic and hormonal assessment, personalized nutrition and pharmacotherapy plans, and structured exercise programs with ongoing monitoring. Patients consistently report more individualized, science-based weight management than they found through commercial slimming programs at home. The physician's expertise in metabolic medicine and the program's long-term support structure are the most important factors. Confirm the program includes a clinical dietitian and behavioral health support. Sustained lifestyle changes in eating habits, physical activity, sleep quality, and stress management are the essential foundation for maintaining weight loss results long-term.",
    href: "/treatments/weight-loss-program",
    image: "/uploads/treatments/weight-loss-program.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/weight-loss-program-1771591767340.jpg",
    category: "Wellness & Holistic"
  },
  {
    id: "addiction-treatment",
    title: "Addiction Treatment",
    slug: "addiction-treatment",
    description: "Addiction treatment abroad offers medically supervised detox, behavioral therapy, and holistic rehabilitation programs for alcohol, drug, and behavioral addictions. International rehab centers combine psychiatric care, individual counseling, and group therapy to address root causes of addiction. The cost of addiction treatment is one of the biggest barriers to recovery in many countries. A 30-day residential program that costs $20,000 to $40,000 at home may be available for $4,000 to $8,000 abroad at equally accredited facilities with trained addiction psychiatrists and counselors. Leading international rehab centers offer shorter waiting times, personalized treatment plans, and dedicated international patient coordinators. Patients consistently report receiving more individualized attention and comprehensive care than they experienced at home. The treating physician's credentials and the facility's accreditation are the most critical factors. Confirm the center is staffed by board-certified addiction psychiatrists and licensed counselors. Aftercare planning is equally important \u2014 sustainable recovery depends on continued support, relapse prevention strategies, and follow-up care after discharge.",
    href: "/treatments/addiction-treatment",
    image: "/uploads/treatments/addiction-treatment.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/addiction-treatment-1771584005606.jpg",
    category: "Wellness & Holistic"
  },
  {
    id: "yoga-meditation",
    title: "Yoga/Meditation",
    slug: "yoga-meditation",
    description: "Yoga and meditation retreats abroad offer authentic, transformative programs combining daily yoga asana, pranayama, meditation, Ayurvedic treatments, and holistic wellness in India's finest ashrams and wellness resorts. Options range from intensive 7-day wellness retreats to 200-hour yoga teacher training certifications and specialized therapeutic yoga programs. Authentic yoga and meditation retreats in Western wellness markets are heavily commercialized and expensive. A 14-day yoga and Ayurveda wellness retreat that costs $6,000 to $15,000 at a Western wellness resort may be available for $1,000 to $3,500 at an equally qualified ashram or medically accredited yoga retreat center in India, Bali, or Sri Lanka. Leading international yoga and meditation centers offer daily programs with experienced teachers, integrated Ayurvedic consultations, and serene natural settings that facilitate genuine transformation. Participants consistently report deeper, more authentic practice experiences than they found at commercialized yoga studios at home. The teacher's training credentials and lineage are the most important factors. Confirm your yoga teacher holds a minimum 200-hour RYT certification with a recognized training school. Consistent daily practice, lifestyle integration, and continued meditation after returning home determine how lasting the benefits of a retreat experience will be.",
    href: "/treatments/yoga-meditation",
    image: "/uploads/treatments/yoga-meditation.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/yoga-meditation-1771591513382.jpg",
    category: "Wellness & Holistic"
  },
  {
    id: "vascular-surgery",
    title: "Vascular Surgery",
    slug: "vascular-surgery",
    description: "Vascular surgery abroad covers aortic aneurysm repair, peripheral artery disease treatment, varicose vein surgery, carotid endarterectomy, deep vein thrombosis management, and endovascular interventions performed by experienced vascular surgeons. Options range from minimally invasive endovascular procedures to complex open vascular reconstruction. Vascular surgical costs and access to experienced vascular surgeons are significant challenges in many countries. An endovascular aortic repair (EVAR) that costs $50,000 to $90,000 at home may be available for $10,000 to $25,000 abroad at equally accredited vascular centers with experienced endovascular surgeons and hybrid operating facilities. Leading international vascular centers offer shorter waiting times, hybrid vascular suites combining imaging and surgery, and structured post-vascular rehabilitation programs. Patients consistently report receiving more comprehensive vascular workups and more accessible surgical planning than they experienced at home. The vascular surgeon's open and endovascular case experience and the hospital's vascular ICU capabilities are the most important factors. Confirm your surgeon's volume for your specific procedure. Lifelong antiplatelet or anticoagulation therapy adherence, smoking cessation, and cardiovascular risk factor management are critical for long-term vascular surgery success.",
    href: "/treatments/vascular-surgery",
    image: "/uploads/treatments/vascular-surgery.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/vascular-surgery-1774690434377.webp",
    category: "Surgical"
  },
  {
    id: "urology",
    title: "Urology",
    slug: "urology",
    description: "Urology treatment abroad covers prostate cancer surgery, kidney stone management, bladder procedures, male infertility treatment, robotic prostatectomy, HoLEP laser surgery for BPH, and urologic oncology at internationally accredited urology centers. Options range from minimally invasive endoscopic procedures to complex robotic-assisted urological surgery. Urological surgical costs are high and waiting times are long in many countries. A robotic radical prostatectomy that costs $40,000 to $80,000 at home may be available for $8,000 to $18,000 abroad at equally accredited hospitals with experienced urologists performing high-volume robotic and endoscopic procedures. Leading international urology centers offer shorter waiting times, high-volume robotic urology programs, and comprehensive pre- and post-operative coordination. Patients consistently report receiving more thorough urological evaluations and attentive surgical planning than they experienced at home. The urologist's robotic or endoscopic case volume and the hospital's urology accreditation are the most important factors. Confirm your surgeon's annual procedure volume for your specific indication. Adherence to post-surgical follow-up schedules, PSA monitoring, and continence rehabilitation directly determines functional outcomes after urological surgery.",
    href: "/treatments/urology",
    image: "/uploads/treatments/urology.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/urology-1774690464198.webp",
    category: "Surgical"
  },
  {
    id: "sports-medicine",
    title: "Sports Medicine",
    slug: "sports-medicine",
    description: "Sports medicine treatment abroad offers expert care for athletic injuries, musculoskeletal conditions, and performance optimization. Specialist treatment covers ACL and ligament injuries, tendinopathy, cartilage damage, stress fractures, and return-to-sport rehabilitation by sports medicine physicians, orthopedic surgeons, and physiotherapists. Timely sports medicine care is difficult to access in many countries due to long waiting lists. Arthroscopic sports surgery that costs $15,000 to $30,000 at home may be available for $3,000 to $8,000 abroad at equally accredited centers with fellowship-trained sports medicine surgeons and sport-specific rehabilitation programs. Leading international sports medicine centers offer rapid specialist access, same-week arthroscopy or injection appointments, and sport-specific rehabilitation programs. Patients \u2014 from professional athletes to active individuals \u2014 consistently report receiving more comprehensive, individually tailored sports care than they experienced at home. The sports physician's subspecialty training and the rehabilitation team's sport-specific expertise are the most important factors. Confirm your surgeon has fellowship training in sports medicine or arthroscopy. Adherence to phased rehabilitation protocols, return-to-sport testing milestones, and injury prevention programs directly determines re-injury risk and athletic performance recovery.",
    href: "/treatments/sports-medicine",
    image: "/uploads/treatments/sports-medicine.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/sports-medicine-1774526916992.webp",
    category: "Specialized Care"
  },
  {
    id: "skin-care",
    title: "Skin Care",
    slug: "skin-care",
    description: "Skin care treatment abroad covers medical dermatology and aesthetic procedures including acne management, psoriasis treatment, vitiligo phototherapy, laser skin resurfacing, cosmetic injectables, and skin cancer treatment. Options range from evidence-based medical dermatology for chronic skin conditions to advanced aesthetic procedures for skin rejuvenation and appearance enhancement. Dermatology and aesthetic skin treatment costs vary significantly between countries. A fractional laser skin resurfacing session that costs $2,500 to $5,000 at home may be available for $400 to $1,200 abroad at equally equipped dermatology clinics with board-certified dermatologists and the latest laser platforms. Leading international dermatology centers offer comprehensive skin assessments, same-week treatment appointments, and thorough post-procedure care protocols. Patients consistently report receiving more individualized, medically grounded skin care than they found at home. The dermatologist's board certification and the clinic's laser and treatment technology are the most important factors. Confirm your treating physician is a board-certified dermatologist. Adherence to sun protection, prescribed topical regimens, and follow-up appointments is essential for maintaining outcomes and preventing complications.",
    href: "/treatments/skin-care",
    image: "/uploads/treatments/skin-care.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/skin-care-1771591941516.jpg",
    category: "Dermatology & Aesthetics"
  },
  {
    id: "sexual-medicine-and-treatment",
    title: "Sexual Medicine and Treatment",
    slug: "sexual-medicine-and-treatment",
    description: "Sexual medicine treatment abroad offers discreet, specialized care for erectile dysfunction, low libido, female sexual dysfunction, premature ejaculation, hormonal imbalances, and gender-affirming treatments at physician-led sexual health clinics. Treatments address physiological, hormonal, vascular, and psychological dimensions of sexual health with evidence-based approaches. Sexual health care remains stigmatized, underserved, and expensive in many countries. A comprehensive sexual medicine evaluation and treatment program that costs $5,000 to $15,000 at home may be available for $1,500 to $4,500 abroad at equally qualified clinics with certified sexual medicine physicians and urologists. Leading international sexual health clinics offer confidential consultations, advanced penile Doppler ultrasound, hormonal profiling, and integrated psychosexual therapy. Patients consistently report receiving more thorough, sensitive, and non-judgmental care than they found at home. The physician's certification in sexual medicine and the clinic's privacy standards are the most important factors. Confirm your doctor has recognized subspecialty training in sexual medicine. Psychosexual therapy, healthy relationship communication, and lifestyle optimization \u2014 including exercise, sleep, and stress management \u2014 are essential complements to any medical sexual health treatment.",
    href: "/treatments/sexual-medicine-and-treatment",
    image: "/uploads/treatments/sexual-medicine-and-treatment.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/sexual-medicine-and-treatment-1771591981331.jpg",
    category: "Specialized Care"
  },
  {
    id: "rehabilitation-and-medical-spa-treatment",
    title: "Rehabilitation and Medical Spa Treatment",
    slug: "rehabilitation-and-medical-spa-treatment",
    description: "Integrated rehabilitation and medical spa programs combine evidence-based therapeutic recovery with luxury wellness experiences, offering post-surgical recuperation, chronic pain management, burnout recovery, and active aging programs in premium physician-led resort environments. These programs seamlessly blend physiotherapy, hydrotherapy, balneotherapy, and aesthetic medicine in world-class settings. The integration of rehabilitation medicine and luxury wellness is a growing niche available at premium cost in very few Western countries. A comprehensive two-week integrated rehab-medispa program that costs $15,000 to $35,000 at home may be available for $4,000 to $10,000 abroad at equally physician-led centers in Austria, Czech Republic, Thailand, or Switzerland. Leading international integrated programs offer daily structured therapy, wellness treatments personalized to recovery goals, and medical oversight throughout the stay. Patients consistently report receiving more comprehensive, holistically integrated care than they found available in their home country. The program physician's dual expertise in rehabilitation and wellness medicine and the facility's accreditation are the most critical factors. Confirm daily therapy sessions are medically supervised. Continuing prescribed home exercises, maintaining dietary habits, and managing stress after the program are critical to sustaining the health gains achieved.",
    href: "/treatments/rehabilitation-and-medical-spa-treatment",
    image: "/uploads/treatments/rehabilitation-and-medical-spa-treatment.webp",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/rehabilitation-and-medical-spa-treatment-1774526874040.webp",
    category: "Wellness & Holistic"
  },
  {
    id: "rehabilitation",
    title: "Rehabilitation",
    slug: "rehabilitation",
    description: "Rehabilitation treatment abroad offers intensive neurological, orthopedic, cardiac, and post-surgical recovery programs at internationally accredited rehabilitation centers staffed by physiatrists, physiotherapists, occupational therapists, speech-language therapists, and neuropsychologists. High-intensity therapy programs using robotic and virtual reality technology accelerate functional recovery. Inpatient rehabilitation in many countries is expensive, short, and not sufficiently intensive. A comprehensive inpatient rehabilitation program that costs $30,000 to $80,000 at home may be available for $5,000 to $20,000 abroad at equally accredited centers with equivalent or greater daily therapy intensity. Leading international rehabilitation centers offer 3 to 5 hours of daily therapy, advanced robotic rehabilitation technology (Lokomat, Armeo, Ekso), and multidisciplinary team management. Patients consistently report receiving more intensive, individualized therapy than they found at home. The program's daily therapy intensity and the multidisciplinary team's experience are the most critical factors. Confirm daily therapy hours and the range of allied health professionals included. Family education, home exercise programs, and continuation of therapy after returning home are essential to sustain gains made during intensive inpatient rehabilitation.",
    href: "/treatments/rehabilitation",
    image: "/uploads/treatments/rehabilitation.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/rehabilitation-1771592218538.jpg",
    category: "Wellness & Holistic"
  },
  {
    id: "radiology-ct-scans",
    title: "Radiology/CT Scans",
    slug: "radiology-ct-scans",
    description: "Advanced diagnostic radiology and CT scanning abroad offers rapid access to high-resolution MRI, PET-CT, multi-slice CT, and ultrasound diagnostics at international imaging centers with board-certified radiologists.",
    href: "/treatments/radiology-ct-scans",
    image: "/uploads/treatments/radiology-ct-scans.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/speciality/radiology-ct-scans-1771592267484.jpg",
    category: "Specialized Care"
  },
];

export const TOP_TREATMENTS = ALL_TREATMENTS.slice(0, 8);

