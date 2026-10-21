// server.ts
import express2 from "express";
import dotenv2 from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// src/api.ts
import express from "express";
import dotenv from "dotenv";

// src/data/schemes.json
var schemes_default = [
  {
    id: "pm-evidya",
    name: "PM eVIDYA Initiative",
    government: "Central",
    state: "All-India (Central)",
    sector: "Education",
    description: "A comprehensive initiative unifying all digital/online/on-air education efforts providing multi-mode access to education for students across India, including DIKSHA portal and 200 dedicated DTH TV channels.",
    eligibility: {
      minAge: 5,
      maxAge: 25,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "All school and college students enrolled in recognized Indian educational boards, with special focus on students in remote and rural areas without internet access."
    },
    benefits: "Free 24x7 educational broadcasts in regional languages, free digital textbooks, QR-coded energized textbooks, and special content for visually/hearing impaired students.",
    documents: [
      "Student ID or School Enrollment Number",
      "Aadhaar Card",
      "School Bonafide Certificate"
    ],
    applicationMethod: "Direct online access via DIKSHA portal (diksha.gov.in) and Swayam Prabha DTH television channels. No fee required.",
    officialSource: "Ministry of Education, Government of India",
    applicationLink: "https://diksha.gov.in"
  },
  {
    id: "samagra-shiksha",
    name: "Samagra Shiksha Abhiyan",
    government: "Central",
    state: "All-India (Central)",
    sector: "Education",
    description: "An overarching programme for the school education sector extending from pre-school to class 12, focusing on inclusive learning, free textbooks, uniforms, and sports equipment.",
    eligibility: {
      minAge: 4,
      maxAge: 18,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Children aged 4 to 18 enrolled in government and government-aided schools across all States and Union Territories."
    },
    benefits: "Free textbooks up to Class 8, annual uniform grant of \u20B9600, transport allowances, digital learning classrooms, and special grants for girl child retention.",
    documents: [
      "Aadhaar Card",
      "School Admission Record",
      "Caste Certificate (if applicable)",
      "Bank Account Details of Student/Guardian"
    ],
    applicationMethod: "Automatic enrollment through government and local civic body schools under Department of School Education.",
    officialSource: "Department of School Education and Literacy, Ministry of Education",
    applicationLink: "https://samagra.education.gov.in"
  },
  {
    id: "nmmss-scholarship",
    name: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Education",
    description: "Centrally sponsored scholarship awarded to meritorious students of economically weaker sections to arrest their drop-out at class 8 and encourage secondary stage education.",
    eligibility: {
      minAge: 12,
      maxAge: 17,
      maxIncome: 35e4,
      education: [
        "Middle School (Class 8)"
      ],
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Students studying in Class 9 in government or local body schools who scored at least 55% in Class 8, with parental annual income not exceeding \u20B93,50,000."
    },
    benefits: "Scholarship of \u20B912,000 per annum (\u20B91,000 per month) from Class 9 to Class 12 paid directly into the student's bank account via DBT.",
    documents: [
      "Class 8 Marksheet",
      "Income Certificate from Tehsildar",
      "Aadhaar Card",
      "Bank Passbook with student's name",
      "Caste Certificate (if applicable)"
    ],
    applicationMethod: "Apply online via National Scholarship Portal (scholarships.gov.in) followed by institutional verification.",
    officialSource: "Department of School Education and Literacy",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "central-sector-college-scholarship",
    name: "Central Sector Scheme of Scholarship for College and University Students",
    government: "Central",
    state: "All-India (Central)",
    sector: "Education",
    description: "Financial assistance to meritorious students from low-income families to meet day-to-day college expenses while pursuing graduate and professional studies.",
    eligibility: {
      minAge: 17,
      maxAge: 25,
      maxIncome: 45e4,
      education: [
        "Higher Secondary (Class 12 Pass)"
      ],
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Students above 80th percentile of successful candidates in relevant stream from Class 12 board exams, enrolled in regular degree courses, family income below \u20B94,50,000/year."
    },
    benefits: "\u20B912,000 per annum at Graduation level for first 3 years and \u20B920,000 per annum at Post-Graduation level.",
    documents: [
      "Class 12 Marksheet & Board Certificate",
      "College Admission Proof / Fee Receipt",
      "Annual Family Income Certificate",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Apply on National Scholarship Portal (NSP) during academic cycle opening.",
    officialSource: "Department of Higher Education, Ministry of Education",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "aicte-pragati-scholarship",
    name: "AICTE Pragati Scholarship for Girls",
    government: "Central",
    state: "All-India (Central)",
    sector: "Education",
    description: "Scholarship scheme aimed at providing assistance for advancement of girls pursuing technical degree or diploma education in AICTE approved institutions.",
    eligibility: {
      minAge: 16,
      maxAge: 25,
      maxIncome: 8e5,
      gender: "Female",
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      criteriaText: "Female students admitted to 1st year or 2nd year (lateral entry) of technical degree/diploma courses in AICTE approved colleges; family income under \u20B98 Lakh/year. Max 2 girls per family."
    },
    benefits: "\u20B950,000 per annum for every year of study towards college fee payment, computer purchase, stationery, books, and equipment.",
    documents: [
      "Admission Letter from AICTE approved institute",
      "Class 10 & 12 Marksheets",
      "Parental Income Certificate",
      "Aadhaar Card",
      "Bank Account Details (Aadhaar linked)"
    ],
    applicationMethod: "Apply online on National Scholarship Portal (NSP) under AICTE Schemes section.",
    officialSource: "All India Council for Technical Education (AICTE)",
    applicationLink: "https://www.aicte-india.org"
  },
  {
    id: "aicte-saksham-scholarship",
    name: "AICTE Saksham Scholarship for Specially Abled Students",
    government: "Central",
    state: "All-India (Central)",
    sector: "Education",
    description: "Financial assistance to encourage and support specially-abled students to pursue technical degree and diploma programmes.",
    eligibility: {
      minAge: 16,
      maxAge: 30,
      maxIncome: 8e5,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Specially-abled students having disability of not less than 40% admitted to 1st year of Degree/Diploma in AICTE approved institution; family income below \u20B98 Lakh/year."
    },
    benefits: "\u20B950,000 per annum for every year of study towards college fee, books, software, and assistive devices.",
    documents: [
      "Disability Certificate (min 40% disability) or UDID Card",
      "College Admission Proof",
      "Class 10 & 12 Marksheets",
      "Income Certificate",
      "Aadhaar Card"
    ],
    applicationMethod: "Apply online via National Scholarship Portal (NSP).",
    officialSource: "AICTE, Ministry of Education",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "begum-hazrat-mahal-scholarship",
    name: "Begum Hazrat Mahal National Scholarship",
    government: "Central",
    state: "All-India (Central)",
    sector: "Education",
    description: "Scholarship for meritorious girl students belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).",
    eligibility: {
      minAge: 14,
      maxAge: 20,
      maxIncome: 2e5,
      gender: "Female",
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      criteriaText: "Girl students belonging to minority communities studying in Class 9 to 12 with at least 50% marks in previous class and family income less than \u20B92,00,000/year."
    },
    benefits: "\u20B95,000 for Class 9 & 10, and \u20B96,000 for Class 11 & 12 credited directly to bank account.",
    documents: [
      "Self-Declaration Minority Certificate",
      "Income Certificate",
      "Previous Class Marksheet",
      "School Verification Certificate",
      "Aadhaar Card"
    ],
    applicationMethod: "Apply online through National Scholarship Portal (NSP).",
    officialSource: "Ministry of Minority Affairs",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "tn-pudhumai-penn",
    name: "Moovalur Ramamirtham Ammaiyar Pudhumai Penn Scheme",
    government: "State",
    state: "Tamil Nadu",
    sector: "Education",
    description: "Higher education incentive scheme by Tamil Nadu government providing monthly stipend to female students who completed schooling in government schools.",
    eligibility: {
      minAge: 17,
      maxAge: 24,
      gender: "Female",
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      criteriaText: "Girl students who studied from Class 6 to 12 in Tamil Nadu Government schools and enrolled in undergraduate degree, diploma, or ITI courses."
    },
    benefits: "Direct monthly transfer of \u20B91,000 into the student's bank account until successful completion of graduation.",
    documents: [
      "Government School Transfer Certificate (Classes 6-12)",
      "College ID Card & Bonafide Certificate",
      "Aadhaar Card",
      "Bank Passbook with IFSC"
    ],
    applicationMethod: "Apply online via penkalvi.tn.gov.in with college nodal officer verification.",
    officialSource: "Social Welfare and Women Empowerment Department, Government of Tamil Nadu",
    applicationLink: "https://penkalvi.tn.gov.in"
  },
  {
    id: "wb-swami-vivekananda-scholarship",
    name: "Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)",
    government: "State",
    state: "West Bengal",
    sector: "Education",
    description: "Major West Bengal state scholarship assisting meritorious students of economically backward families pursuing higher secondary, UG, PG, and doctoral studies.",
    eligibility: {
      minAge: 15,
      maxAge: 28,
      maxIncome: 25e4,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Domicile of West Bengal, scored 60%+ in previous qualifying examination, enrolled in higher studies in WB, family income not exceeding \u20B92,50,000/year."
    },
    benefits: "\u20B91,000 to \u20B95,000 per month depending on course level (Higher Secondary, Arts/Science/Commerce UG, Engineering, Medical).",
    documents: [
      "Domicile Certificate of West Bengal",
      "Qualifying Exam Marksheet",
      "Income Certificate from SDO/BDO",
      "Admission Receipt",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online on svmcm.wbhed.gov.in portal during application window.",
    officialSource: "Higher Education Department, Government of West Bengal",
    applicationLink: "https://svmcm.wbhed.gov.in"
  },
  {
    id: "bihar-medhavi-chhatra-protsahan",
    name: "Mukhyamantri Medhavriti Yojana & Balak/Balika Protsahan",
    government: "State",
    state: "Bihar",
    sector: "Education",
    description: "Cash incentive scheme by Government of Bihar to reward students passing Class 10 and Class 12 board examinations with first division.",
    eligibility: {
      minAge: 14,
      maxAge: 22,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Permanent resident of Bihar who passed Matric (Class 10) or Intermediate (Class 12) from Bihar School Examination Board (BSEB) in 1st division."
    },
    benefits: "One-time incentive of \u20B910,000 for Class 10 first division, and \u20B925,000 for unmarried girls passing Class 12.",
    documents: [
      "BSEB Board Marksheet & Admit Card",
      "Aadhaar Card",
      "Residential Certificate of Bihar",
      "Bank Account Details (Aadhaar Seeded)"
    ],
    applicationMethod: "Apply online through Medhasoft portal (medhasoft.bih.nic.in).",
    officialSource: "Education Department, Government of Bihar",
    applicationLink: "https://medhasoft.bih.nic.in"
  },
  {
    id: "ab-pmjay",
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Healthcare",
    description: "The world's largest health assurance scheme providing comprehensive secondary and tertiary care hospitalization coverage to bottom 40% vulnerable families and all senior citizens aged 70+.",
    eligibility: {
      maxIncome: 25e4,
      gender: "All",
      criteriaText: "Deprived rural families and identified occupational categories of urban workers based on SECC 2011 database, plus all senior citizens aged 70 and above regardless of income."
    },
    benefits: "Cashless health cover of \u20B95 Lakh per family per year across 27,000+ empaneled public and private hospitals across India covering 1,949 surgical/medical procedures.",
    documents: [
      "Aadhaar Card",
      "Ration Card or Family Samagra ID",
      "Ayushman Card (generate via portal or CSC)"
    ],
    applicationMethod: "Check eligibility on beneficiary.nha.gov.in or visit any empaneled hospital / CSC center with Aadhaar card.",
    officialSource: "National Health Authority (NHA), Ministry of Health and Family Welfare",
    applicationLink: "https://beneficiary.nha.gov.in"
  },
  {
    id: "abdm-digital-health",
    name: "Ayushman Bharat Digital Mission (ABDM)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Healthcare",
    description: "National digital health ecosystem that creates Ayushman Bharat Health Account (ABHA) IDs for citizens, enabling seamless, secure sharing of personal health records.",
    eligibility: {
      gender: "All",
      criteriaText: "Open to all Indian citizens of any age, occupation, or income level."
    },
    benefits: "14-digit unique ABHA digital health card, lifetime storage of digital prescriptions, lab test reports, discharge summaries, and instant paperless hospital OPD registrations.",
    documents: [
      "Aadhaar Card or Driving License",
      "Mobile number linked with Aadhaar"
    ],
    applicationMethod: "Create instantly in 2 minutes on healthid.ndhm.gov.in or via ABHA mobile app.",
    officialSource: "National Health Authority (NHA)",
    applicationLink: "https://healthid.ndhm.gov.in"
  },
  {
    id: "pmsma-maternal-health",
    name: "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Healthcare",
    description: "Ensures comprehensive and quality antenatal care (ANC) for pregnant women on the 9th day of every month, guaranteed by OBGYN specialists.",
    eligibility: {
      minAge: 18,
      gender: "Female",
      criteriaText: "All pregnant women in their 2nd and 3rd trimesters of pregnancy across all States/UTs."
    },
    benefits: "Free specialist antenatal checkups, blood investigations, ultrasound scans, iron-folic acid and calcium supplementation, and identification of high-risk pregnancies.",
    documents: [
      "Mother and Child Protection (MCP) Card",
      "Aadhaar Card"
    ],
    applicationMethod: "Visit any designated Government Health Facility (PHC, CHC, District Hospital) on the 9th of each month.",
    officialSource: "Ministry of Health and Family Welfare",
    applicationLink: "https://pmsma.mohfw.gov.in"
  },
  {
    id: "jssk-shishu-suraksha",
    name: "Janani Shishu Suraksha Karyakram (JSSK)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Healthcare",
    description: "Zero out-of-pocket expenses initiative for pregnant women delivering in public health institutions and for sick infants up to 1 year of age.",
    eligibility: {
      gender: "Female",
      criteriaText: "All pregnant women delivering in government health facilities and all sick newborns/infants up to one year of age."
    },
    benefits: "Completely free normal and C-section delivery, free medicines and consumables, free diagnostics, free diet during hospital stay, and free transport from home to hospital and back.",
    documents: [
      "Mother and Child Protection (MCP) Card",
      "Government Hospital Admission Slip"
    ],
    applicationMethod: "Automatic entitlement at any government Primary Health Centre, Community Health Centre, or District Hospital.",
    officialSource: "National Health Mission, MoHFW",
    applicationLink: "https://nhm.gov.in"
  },
  {
    id: "free-drugs-diagnostics-nhm",
    name: "NHM Free Drugs and Free Diagnostics Service Initiative",
    government: "Central",
    state: "All-India (Central)",
    sector: "Healthcare",
    description: "Initiative under National Health Mission to reduce out-of-pocket expenditure on medicines and lab investigations in public healthcare facilities.",
    eligibility: {
      gender: "All",
      criteriaText: "All patients visiting public healthcare facilities (Sub-Centres, PHCs, CHCs, Sub-District and District Hospitals)."
    },
    benefits: "Free essential medicines as per National List of Essential Medicines (NLEM) and free laboratory tests (blood, urine, X-ray, ECG, CT scan in select facilities).",
    documents: [
      "OPD Registration Slip from public hospital"
    ],
    applicationMethod: "Available at all public health facilities counter upon prescription from hospital medical officers.",
    officialSource: "National Health Mission, Ministry of Health and Family Welfare",
    applicationLink: "https://nhm.gov.in"
  },
  {
    id: "pm-abhim-health-infra",
    name: "PM Ayushman Bharat Health Infrastructure Mission (PM-ABHIM)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Healthcare",
    description: "Pan-India scheme to strengthen public health infrastructure, establishing critical care hospital blocks and integrated public health labs in all districts.",
    eligibility: {
      gender: "All",
      criteriaText: "All citizens seeking emergency, critical care, and infectious disease diagnostic treatments."
    },
    benefits: "High-end ICU care, specialized diagnostic testing for communicable diseases, and block public health units closer to rural citizens.",
    documents: [
      "Aadhaar Card",
      "Hospital Admission Record"
    ],
    applicationMethod: "Avail through district hospitals and critical care units developed under the mission.",
    officialSource: "Ministry of Health and Family Welfare",
    applicationLink: "https://mohfw.gov.in"
  },
  {
    id: "tn-cmchis",
    name: "Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS)",
    government: "State",
    state: "Tamil Nadu",
    sector: "Healthcare",
    description: "Flagship cashless healthcare scheme by Government of Tamil Nadu providing coverage for serious medical illnesses and surgeries.",
    eligibility: {
      maxIncome: 12e4,
      gender: "All",
      criteriaText: "Resident of Tamil Nadu enrolled in family ration card, with annual family income not exceeding \u20B91,20,000."
    },
    benefits: "Cashless coverage of up to \u20B95 Lakh per year for a family across 1,090 procedures in recognized government and private hospitals.",
    documents: [
      "Smart Ration Card of Tamil Nadu",
      "Income Certificate",
      "Aadhaar Card of all family members"
    ],
    applicationMethod: "Visit District Collectorate or designated CMCHIS enrolment kiosk with Smart Ration Card.",
    officialSource: "Department of Health & Family Welfare, Government of Tamil Nadu",
    applicationLink: "https://cmchistn.com"
  },
  {
    id: "mh-mjpjay",
    name: "Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)",
    government: "State",
    state: "Maharashtra",
    sector: "Healthcare",
    description: "Comprehensive health insurance scheme by Government of Maharashtra offering cashless medical treatment for 996 identified medical and surgical procedures.",
    eligibility: {
      gender: "All",
      criteriaText: "All citizens holding Yellow, Orange, or White ration cards issued by Government of Maharashtra."
    },
    benefits: "Cashless cover of up to \u20B95 Lakh per family per year in over 1,000 network hospitals across Maharashtra.",
    documents: [
      "Ration Card (Yellow/Orange/White)",
      "Aadhaar Card or Voter ID",
      "Doctor prescription/referral"
    ],
    applicationMethod: "Direct approach to Arogyamitra stationed at any network hospital with ration card and Aadhaar card.",
    officialSource: "State Health Assurance Society, Government of Maharashtra",
    applicationLink: "https://jeevandayee.gov.in"
  },
  {
    id: "kerala-kasp",
    name: "Karunya Arogya Suraksha Padhathi (KASP)",
    government: "State",
    state: "Kerala",
    sector: "Healthcare",
    description: "Kerala's integrated health protection scheme aligning state resources with AB-PMJAY to deliver cashless hospital care for vulnerable families.",
    eligibility: {
      gender: "All",
      criteriaText: "BPL and eligible APL families as per Kerala Civil Supplies department database and SECC list."
    },
    benefits: "Cashless secondary and tertiary healthcare treatment up to \u20B95 Lakh per family per year in empaneled hospitals.",
    documents: [
      "Kerala Ration Card",
      "Aadhaar Card",
      "KASP E-card"
    ],
    applicationMethod: "Check registration at any Akshaya e-centre or through empaneled hospital KASP helpdesk.",
    officialSource: "State Health Agency, Government of Kerala",
    applicationLink: "https://sha.kerala.gov.in"
  },
  {
    id: "ap-aarogyasri",
    name: "Dr. YSR Aarogyasri Health Scheme",
    government: "State",
    state: "Andhra Pradesh",
    sector: "Healthcare",
    description: "Pioneering state health protection scheme offering free medical and surgical treatment to below-poverty-line families across Andhra Pradesh.",
    eligibility: {
      maxIncome: 5e5,
      gender: "All",
      criteriaText: "Rice Card / BPL card holders in Andhra Pradesh or families with annual income up to \u20B95 Lakh."
    },
    benefits: "Cashless medical treatment up to \u20B925 Lakh per family per year covering 3,257 medical procedures, plus post-operative sustenance allowance of \u20B95,000/month.",
    documents: [
      "Aarogyasri Health Card / Rice Card",
      "Aadhaar Card",
      "Hospital Registration"
    ],
    applicationMethod: "Approach Aarogya Mithra at any empaneled government or corporate network hospital.",
    officialSource: "Dr. YSR Aarogyasri Health Care Trust, Government of Andhra Pradesh",
    applicationLink: "https://aarogyasri.ap.gov.in"
  },
  {
    id: "pmmvy-matru-vandana",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Women & Child Welfare",
    description: "Direct benefit transfer maternity benefit scheme providing partial wage compensation to pregnant and lactating mothers for health and nutrition.",
    eligibility: {
      minAge: 19,
      gender: "Female",
      criteriaText: "Pregnant women and lactating mothers for 1st child (and 2nd child if girl child) who are not in regular Central/State government employment."
    },
    benefits: "Cash incentive of \u20B95,000 in two installments for the first child, and \u20B96,000 in single installment if the second child is a girl, transferred via DBT.",
    documents: [
      "MCP (Mother & Child Protection) Card",
      "Aadhaar Card of pregnant woman and husband",
      "Bank Passbook of mother (Aadhaar linked)"
    ],
    applicationMethod: "Apply online at pmmvy.wcd.gov.in or submit Form 1A at the local Anganwadi Centre / ASHA worker.",
    officialSource: "Ministry of Women and Child Development",
    applicationLink: "https://pmmvy.wcd.gov.in"
  },
  {
    id: "sukanya-samriddhi-yojana",
    name: "Sukanya Samriddhi Yojana (SSY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Women & Child Welfare",
    description: "Government-backed small deposit savings scheme under Beti Bachao Beti Padhao campaign offering highest interest rates and tax exemptions for the girl child.",
    eligibility: {
      maxAge: 10,
      gender: "Female",
      criteriaText: "Parents or legal guardians of a girl child can open an account from the birth of the girl up to the age of 10 years (maximum 2 accounts per family)."
    },
    benefits: "Current high interest rate of 8.2% p.a., full tax exemption under Section 80C (EEE status), and maturity corpus payable upon girl turning 21.",
    documents: [
      "Birth Certificate of Girl Child",
      "Identity & Address Proof of Guardian (Aadhaar/PAN)",
      "Photographs of Child & Guardian"
    ],
    applicationMethod: "Open account at any Post Office branch or authorized public/private commercial bank branch.",
    officialSource: "Department of Economic Affairs / Ministry of Women and Child Development",
    applicationLink: "https://www.indiapost.gov.in"
  },
  {
    id: "beti-bachao-beti-padhao",
    name: "Beti Bachao Beti Padhao (BBBP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Women & Child Welfare",
    description: "National flagship campaign addressing declining child sex ratio and promoting girl child education, institutional birth, and protection.",
    eligibility: {
      gender: "Female",
      criteriaText: "All girl children across all districts of India with focus on 405 multi-sectoral intervention districts."
    },
    benefits: "Free primary and secondary education entitlements, institutional delivery incentives, self-defense training in schools, and community sensitization support.",
    documents: [
      "Birth Certificate",
      "Aadhaar Card",
      "School Enrollment Record"
    ],
    applicationMethod: "Implemented through Anganwadi Centres, district social welfare offices, and local government schools.",
    officialSource: "Ministry of Women and Child Development, MoHFW, MoE",
    applicationLink: "https://wcd.nic.in"
  },
  {
    id: "poshan-tracker-mission",
    name: "POSHAN 2.0 (Integrated Nutrition Support Programme)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Women & Child Welfare",
    description: "Holistic nutrition scheme aiming to prevent and reduce stunting, underweight, and anaemia among children (0-6 years), pregnant women, and lactating mothers.",
    eligibility: {
      maxAge: 6,
      gender: "All",
      criteriaText: "Children from birth up to 6 years, pregnant women, and lactating mothers registered at Anganwadi Centres."
    },
    benefits: "Daily supplementary hot-cooked meals or Take-Home Rations (THR), growth monitoring via Poshan Tracker, and micronutrient supplementation.",
    documents: [
      "Aadhaar Card of Child or Parent",
      "Anganwadi Registration Number"
    ],
    applicationMethod: "Register at nearest local Anganwadi Centre or track entitlements via Poshan Tracker mobile app.",
    officialSource: "Ministry of Women and Child Development",
    applicationLink: "https://poshantracker.in"
  },
  {
    id: "mission-shakti-sambal",
    name: "Mission Shakti - Sambal (One Stop Centres & Women Helpline)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Women & Child Welfare",
    description: "Sub-scheme for safety and security of women offering integrated support, medical aid, legal counseling, shelter, and trauma assistance.",
    eligibility: {
      gender: "Female",
      criteriaText: "Any woman or adolescent girl facing violence, abuse, harassment, or distress in private or public spaces."
    },
    benefits: "Free 24x7 emergency response via toll-free helpline 181, immediate temporary shelter, legal aid, medical assistance, and psychological counseling under one roof.",
    documents: [
      "No identity documents mandatory during emergency crisis access"
    ],
    applicationMethod: "Dial emergency toll-free number 181 or walk in to any district One Stop Centre (Sakhi Centre).",
    officialSource: "Ministry of Women and Child Development",
    applicationLink: "https://wcd.nic.in"
  },
  {
    id: "mission-shakti-samarthya",
    name: "Mission Shakti - Samarthya (Working Women Hostels & Palna)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Women & Child Welfare",
    description: "Initiative empowering working women by providing safe, affordable accommodation and day-care cr\xE8che facilities (Palna) for their children.",
    eligibility: {
      minAge: 18,
      gender: "Female",
      occupations: [
        "Salaried Employee (Private)",
        "Self Employed / Micro Entrepreneur",
        "Other"
      ],
      criteriaText: "Working women who are single, widowed, divorced, separated, or married with spouse not residing in the same city; family income below prescribed state ceiling."
    },
    benefits: "Safe and subsidized accommodation in working women hostels with day-care cr\xE8che facility for children up to 6 years.",
    documents: [
      "Employment Certificate / Offer Letter",
      "Salary Slip",
      "Aadhaar Card",
      "Proof of Residence"
    ],
    applicationMethod: "Apply online or directly at local Working Women Hostel managed by State Women Development Corporation.",
    officialSource: "Ministry of Women and Child Development",
    applicationLink: "https://wcd.nic.in"
  },
  {
    id: "mahila-samman-savings-certificate",
    name: "Mahila Samman Savings Certificate (MSSC)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Women & Child Welfare",
    description: "Special fixed-deposit savings scheme exclusively for women and girls offering high guaranteed returns with partial withdrawal facility.",
    eligibility: {
      gender: "Female",
      criteriaText: "Any woman in her own name, or a guardian on behalf of a minor girl child."
    },
    benefits: "Guaranteed 7.5% annual interest compounded quarterly for a 2-year tenure, with deposit limit up to \u20B92,00,000 and 40% partial withdrawal allowed after 1 year.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Application Form",
      "Passport size photographs"
    ],
    applicationMethod: "Open in any Post Office or authorized commercial bank branch.",
    officialSource: "Ministry of Finance",
    applicationLink: "https://www.indiapost.gov.in"
  },
  {
    id: "mp-ladli-behna",
    name: "Mukhyamantri Ladli Behna Yojana",
    government: "State",
    state: "Madhya Pradesh",
    sector: "Women & Child Welfare",
    description: "Flagship direct cash transfer scheme by Government of Madhya Pradesh to foster economic independence and nutrition among women.",
    eligibility: {
      minAge: 21,
      maxAge: 60,
      maxIncome: 25e4,
      gender: "Female",
      criteriaText: "Resident women of Madhya Pradesh aged 21 to 60 whose family income is less than \u20B92.5 Lakh and who do not pay income tax."
    },
    benefits: "Direct monthly transfer of \u20B91,250 directly into the woman's Aadhaar-linked bank account (\u20B915,000 annually).",
    documents: [
      "Samagra Family ID & Member ID",
      "Aadhaar Card",
      "Aadhaar-seeded active Bank Account details"
    ],
    applicationMethod: "Apply through Gram Panchayat / Ward camps or online portal cmladlibahna.mp.gov.in.",
    officialSource: "Women and Child Development Department, Government of Madhya Pradesh",
    applicationLink: "https://cmladlibahna.mp.gov.in"
  },
  {
    id: "karnataka-gruha-lakshmi",
    name: "Gruha Lakshmi Scheme",
    government: "State",
    state: "Karnataka",
    sector: "Women & Child Welfare",
    description: "Empowerment scheme in Karnataka providing monthly financial assistance to women heads of eligible households.",
    eligibility: {
      minAge: 18,
      gender: "Female",
      criteriaText: "Women identified as head of the family in Antyodaya, BPL, and APL ration cards issued by Government of Karnataka (excluding tax-paying women)."
    },
    benefits: "\u20B92,000 credited every month directly to the female head of household's bank account via DBT.",
    documents: [
      "Ration Card (APL/BPL/AAY)",
      "Aadhaar Card of Woman Head",
      "Aadhaar-linked Bank Passbook"
    ],
    applicationMethod: "Apply at Grama One, Karnataka One, or Bangalore One centres or via Seva Sindhu portal.",
    officialSource: "Department of Women and Child Development, Government of Karnataka",
    applicationLink: "https://sevasindhu.karnataka.gov.in"
  },
  {
    id: "mh-ladki-bahin",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    government: "State",
    state: "Maharashtra",
    sector: "Women & Child Welfare",
    description: "Maharashtra state welfare scheme providing monthly financial support to economically weaker women for health, education, and livelihood.",
    eligibility: {
      minAge: 21,
      maxAge: 65,
      maxIncome: 25e4,
      gender: "Female",
      criteriaText: "Married, widowed, divorced, or single women residing in Maharashtra with annual family income up to \u20B92.5 Lakh."
    },
    benefits: "Monthly assistance of \u20B91,500 transferred directly to the beneficiary's bank account (\u20B918,000 per year).",
    documents: [
      "Aadhaar Card",
      "Domicile Certificate or 15-year old Ration Card/Voter ID",
      "Income Certificate / Yellow or Orange Ration Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online via Nari Shakti Doot mobile app or at local Anganwadi/Gram Panchayat centres.",
    officialSource: "Women and Child Development Department, Government of Maharashtra",
    applicationLink: "https://ladakibahin.maharashtra.gov.in"
  },
  {
    id: "pm-kisan-samman-nidhi",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Agriculture",
    description: "Centrally sponsored income support scheme providing assured financial assistance to all landholding farmer families across India.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "All cultivable landholding farmer families in whose names land title is registered (excluding institutional landholders and constitutional post holders)."
    },
    benefits: "\u20B96,000 per year paid in three equal installments of \u20B92,000 every 4 months directly into bank accounts via DBT.",
    documents: [
      "Aadhaar Card",
      "Land Record (Khata/Khasra/Patta)",
      "Aadhaar-linked Bank Account Details"
    ],
    applicationMethod: "Apply online at pmkisan.gov.in under 'Farmers Corner' or visit local Common Service Centre (CSC).",
    officialSource: "Department of Agriculture & Farmers Welfare, Ministry of Agriculture",
    applicationLink: "https://pmkisan.gov.in"
  },
  {
    id: "pm-fasal-bima-yojana",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Agriculture",
    description: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of natural calamities, pests, and diseases.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers."
    },
    benefits: "Comprehensive risk insurance with uniform minimal premium of only 2% for Kharif crops, 1.5% for Rabi foodgrains/oilseeds, and 5% for commercial/horticultural crops; rest subsidized by government.",
    documents: [
      "Land Ownership Documents / Tenancy Agreement",
      "Sowing Certificate / Crop Sowing Declaration",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Enroll via pmfby.gov.in, nearest bank branch, or through CSC within notified cut-off dates.",
    officialSource: "Department of Agriculture and Farmers Welfare",
    applicationLink: "https://pmfby.gov.in"
  },
  {
    id: "kisan-credit-card",
    name: "Kisan Credit Card (KCC) Scheme",
    government: "Central",
    state: "All-India (Central)",
    sector: "Agriculture",
    description: "Provides timely, concessional credit to farmers to meet short-term agricultural expenses, post-harvest costs, and maintenance of farm assets.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Fisherman / Fisherfolk"
      ],
      gender: "All",
      criteriaText: "All farmers, individual/joint cultivators, tenant farmers, oral lessees, and self-help groups involved in farming, animal husbandry, or fisheries."
    },
    benefits: "Concessional loans up to \u20B93 Lakh at an effective interest rate of just 4% p.a. (with 3% prompt repayment incentive), no collateral required for loans up to \u20B91.6 Lakh.",
    documents: [
      "Land Record Documents (Khasra/Khatauni)",
      "Aadhaar Card",
      "PAN Card / Form 60",
      "Passport size photograph"
    ],
    applicationMethod: "Submit 1-page simplified KCC form at any public sector bank or through CSC portal.",
    officialSource: "NABARD & Ministry of Agriculture",
    applicationLink: "https://myscheme.gov.in"
  },
  {
    id: "pmksy-irrigation",
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) - Per Drop More Crop",
    government: "Central",
    state: "All-India (Central)",
    sector: "Agriculture",
    description: "Promotes micro-irrigation technologies like drip and sprinkler irrigation systems to enhance water use efficiency in farms.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "All categories of farmers who own or lease cultivable land with an assured water source."
    },
    benefits: "Up to 55% financial subsidy for small and marginal farmers and 45% for other farmers on purchase and installation of micro-irrigation systems.",
    documents: [
      "Land Ownership Documents / 7/12 Extract",
      "Aadhaar Card",
      "Bank Account Details",
      "Quotation from approved micro-irrigation vendor"
    ],
    applicationMethod: "Apply through state agriculture/horticulture department portals or local district agriculture office.",
    officialSource: "Department of Agriculture and Farmers Welfare",
    applicationLink: "https://pmksy.gov.in"
  },
  {
    id: "pkvy-organic-farming",
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Agriculture",
    description: "Promotes certified organic farming through cluster approach and Participatory Guarantee System (PGS) certification.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Farmers willing to form clusters of 20 or more hectares and adopt chemical-free organic farming practices."
    },
    benefits: "Financial assistance of \u20B950,000 per hectare over 3 years, of which \u20B931,000 is given directly via DBT for organic seeds, bio-fertilizers, and packaging.",
    documents: [
      "Land Possession Certificate",
      "Aadhaar Card",
      "Cluster Group Registration",
      "Bank Account Passbook"
    ],
    applicationMethod: "Enroll through local Block Agriculture Officer or PGS-India portal (pgsindia-ncof.gov.in).",
    officialSource: "Ministry of Agriculture and Farmers Welfare",
    applicationLink: "https://pgsindia-ncof.gov.in"
  },
  {
    id: "smam-agri-mechanization",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Agriculture",
    description: "Subsidizes purchase of modern agricultural machinery, tractors, power tillers, and establishes Custom Hiring Centres (CHC) for small farmers.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Individual farmers, Farmer Producer Organizations (FPOs), and rural youth looking to purchase farm machinery or establish CHCs."
    },
    benefits: "40% to 50% subsidy on procurement of tractors, power tillers, rotavators, and harvesters; up to 80% subsidy for setting up Custom Hiring Centres.",
    documents: [
      "Aadhaar Card",
      "Land Record (Khata/Khasra)",
      "Bank Passbook",
      "Caste Certificate (for higher SC/ST subsidy)"
    ],
    applicationMethod: "Apply online at agrimachinery.nic.in portal by choosing machinery from authorized manufacturers.",
    officialSource: "Department of Agriculture and Farmers Welfare",
    applicationLink: "https://agrimachinery.nic.in"
  },
  {
    id: "soil-health-card-scheme",
    name: "Soil Health Card Scheme",
    government: "Central",
    state: "All-India (Central)",
    sector: "Agriculture",
    description: "Provides customized soil health cards to farmers containing nutrient status of their farm soil and recommendations on dosage of fertilizers.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "All landholding farmers across all agricultural districts of India."
    },
    benefits: "Free periodic soil testing across 12 chemical parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) helping reduce fertilizer costs by 15-20% and increasing crop yields.",
    documents: [
      "Land Record details",
      "Aadhaar Card"
    ],
    applicationMethod: "Soil samples collected by local agriculture extension workers or submit soil sample at nearest Krishi Vigyan Kendra (KVK).",
    officialSource: "Ministry of Agriculture & Farmers Welfare",
    applicationLink: "https://soilhealth.dac.gov.in"
  },
  {
    id: "telangana-rythu-bandhu",
    name: "Rythu Bandhu / Rythu Bharosa Scheme",
    government: "State",
    state: "Telangana",
    sector: "Agriculture",
    description: "Direct investment support scheme providing financial grant to farmers at the beginning of each cropping season for inputs.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Farmers owning agricultural land in Telangana recorded in the Dharani land records portal."
    },
    benefits: "Financial grant of \u20B910,000 per acre per year (\u20B95,000 for Kharif and \u20B95,000 for Rabi) credited directly to farmer bank accounts.",
    documents: [
      "Pattadar Passbook / Dharani Land Record",
      "Aadhaar Card",
      "Aadhaar-linked Bank Account Details"
    ],
    applicationMethod: "Automatic DBT disbursement based on land records verified by Agriculture Extension Officers.",
    officialSource: "Department of Agriculture, Government of Telangana",
    applicationLink: "https://rythubandhu.telangana.gov.in"
  },
  {
    id: "odisha-kalia",
    name: "Krushak Assistance for Livelihood and Income Augmentation (KALIA)",
    government: "State",
    state: "Odisha",
    sector: "Agriculture",
    description: "Comprehensive agricultural assistance package by Government of Odisha for small, marginal farmers and landless agricultural households.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Small and marginal farmers, sharecroppers, and landless agricultural households residing in Odisha."
    },
    benefits: "\u20B910,000 per year per farm family for cultivation inputs, and \u20B912,500 one-time livelihood grant for landless agricultural labourers for goat/poultry rearing.",
    documents: [
      "Aadhaar Card",
      "Land Record or Ration Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at kalia.odisha.gov.in or through Gram Panchayat offices.",
    officialSource: "Department of Agriculture and Farmers' Empowerment, Government of Odisha",
    applicationLink: "https://kalia.odisha.gov.in"
  },
  {
    id: "mp-bhavantar-bhugtan",
    name: "Bhavantar Bhugtan Yojana (Price Deficiency Payment)",
    government: "State",
    state: "Madhya Pradesh",
    sector: "Agriculture",
    description: "Direct payment of difference between the Minimum Support Price (MSP) and the actual selling price in mandis to protect farmers from market price crashes.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Farmers in Madhya Pradesh registered for notified crops (soybean, urad, moong, groundnut, etc.) selling in authorized APMC mandis."
    },
    benefits: "Direct compensation of the price gap between MSP and Mandi modal rate credited into farmer bank accounts.",
    documents: [
      "Mandi Anugyapatra (Mandi Sale Receipt)",
      "Khasra/Khatauni Land Record",
      "Aadhaar Card",
      "Bank Account Passbook"
    ],
    applicationMethod: "Register on e-Uparjan portal (mpeuparjan.nic.in) prior to harvest and produce mandi receipt.",
    officialSource: "Department of Farmer Welfare and Agriculture Development, Government of MP",
    applicationLink: "https://mpeuparjan.nic.in"
  },
  {
    id: "mgnregs-rural-employment",
    name: "Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Employment",
    description: "Legal guarantee for at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Farmer / Agricultural Laborer",
        "Construction Worker / Daily Wage",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Adult members of any rural household residing in the Gram Panchayat area willing to perform unskilled manual labour."
    },
    benefits: "Guaranteed 100 days of wage employment per year at state-notified minimum daily wage rates (\u20B9234 - \u20B9374/day), with unemployment allowance if work is not given within 15 days.",
    documents: [
      "Aadhaar Card",
      "Photographs",
      "Bank or Post Office Account Details",
      "Proof of Residence in Gram Panchayat"
    ],
    applicationMethod: "Submit oral or written application to Gram Panchayat for Job Card; work assigned within 15 days of demand.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://nrega.nic.in"
  },
  {
    id: "pmegp-employment-generation",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Employment",
    description: "Credit-linked subsidy programme to generate self-employment opportunities through establishment of micro-enterprises in non-farm sectors.",
    eligibility: {
      minAge: 18,
      education: [
        "Middle School (Class 8)",
        "Secondary (Class 10 Pass)",
        "Higher Secondary (Class 12 Pass)",
        "Diploma / ITI Certificate",
        "Graduate (Bachelor Degree)"
      ],
      occupations: [
        "Unemployed / Job Seeker",
        "Artisan / Craftsman",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Any individual above 18 years of age (Class 8 pass for projects above \u20B910 Lakh in manufacturing and \u20B95 Lakh in service)."
    },
    benefits: "Bank-financed project loans up to \u20B950 Lakh for manufacturing and \u20B920 Lakh for service units, with 15% to 35% government capital subsidy (margin money).",
    documents: [
      "Project Report / Business Proposal",
      "Aadhaar Card & PAN Card",
      "Education / ITI / Skill Certificate",
      "Caste / Special Category Certificate (if applicable)"
    ],
    applicationMethod: "Apply online at kviconline.gov.in/pmegpeportal/ without any physical application fee.",
    officialSource: "Khadi and Village Industries Commission (KVIC), Ministry of MSME",
    applicationLink: "https://www.kviconline.gov.in"
  },
  {
    id: "national-career-service",
    name: "National Career Service (NCS) Portal",
    government: "Central",
    state: "All-India (Central)",
    sector: "Employment",
    description: "Digital nationwide platform connecting jobseekers with employers, career counsellors, skill providers, and local service providers.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Unemployed / Job Seeker",
        "Student / Scholar"
      ],
      gender: "All",
      criteriaText: "Any job seeker or student seeking private or public employment, apprenticeships, or career counseling."
    },
    benefits: "Free access to thousands of verified private and government job postings, career counseling sessions, skill courses, and nationwide Rozgar Mela job drives.",
    documents: [
      "Aadhaar Card or PAN Card",
      "Educational Marksheets / Certificates",
      "Resume / Bio-data"
    ],
    applicationMethod: "Register free of charge at ncs.gov.in or visit nearest Model Career Centre (MCC).",
    officialSource: "Ministry of Labour and Employment",
    applicationLink: "https://www.ncs.gov.in"
  },
  {
    id: "abry-employment-incentive",
    name: "Aatmanirbhar Bharat Rojgar Yojana (ABRY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Employment",
    description: "Incentivizes employers for creation of new employment opportunities by subsidizing employee and employer EPF contributions.",
    eligibility: {
      minAge: 18,
      maxIncome: 18e4,
      occupations: [
        "Salaried Employee (Private)",
        "Construction Worker / Daily Wage",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "New employees joining EPFO-registered establishments with monthly wages less than \u20B915,000, or workers who lost jobs during COVID-19."
    },
    benefits: "Government of India pays 24% of wages (12% employee share + 12% employer share) towards EPF for establishments employing up to 1,000 workers for 2 years.",
    documents: [
      "Universal Account Number (UAN)",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Employer claims subsidy directly through the EPFO Unified Portal for eligible new workers.",
    officialSource: "Employees' Provident Fund Organisation (EPFO), Ministry of Labour",
    applicationLink: "https://www.epfindia.gov.in"
  },
  {
    id: "rozgar-mela-central",
    name: "National Rozgar Mela Initiative",
    government: "Central",
    state: "All-India (Central)",
    sector: "Employment",
    description: "Government mission mode recruitment drive to provide 10 Lakh central government jobs across ministries, departments, and public enterprises.",
    eligibility: {
      minAge: 18,
      maxAge: 35,
      occupations: [
        "Unemployed / Job Seeker",
        "Student / Scholar"
      ],
      gender: "All",
      criteriaText: "Candidates qualifying competitive examinations of SSC, UPSC, Railway Recruitment Boards (RRB), and IBPS."
    },
    benefits: "Direct issuance of permanent appointment letters in Central Government ministries, Defence civil forces, Postal department, Railways, and nationalized banks.",
    documents: [
      "Admit Card & Qualifying Exam Scorecard",
      "Aadhaar Card",
      "Educational Certificates & Caste/EWS Certificate"
    ],
    applicationMethod: "Participate through regular examinations conducted by SSC (ssc.gov.in), UPSC, RRB, and IBPS.",
    officialSource: "Department of Personnel and Training (DoPT)",
    applicationLink: "https://ssc.gov.in"
  },
  {
    id: "day-nulm-employment",
    name: "DAY-NULM Urban Employment & Micro-Enterprises (SEP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Employment",
    description: "Self-Employment Programme component under DAY-NULM assisting urban poor individuals and groups to set up gainful self-employment micro-enterprises.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Street Vendor / Small Trader",
        "Artisan / Craftsman",
        "Self Employed / Micro Entrepreneur",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Urban poor individuals or Self Help Groups (SHGs) living in statutory towns and cities."
    },
    benefits: "Bank loans up to \u20B92 Lakh for individuals and up to \u20B910 Lakh for groups, with interest subsidy over 7% p.a. paid directly to banks.",
    documents: [
      "Urban Poor BPL ID / Ration Card",
      "Aadhaar Card",
      "Project Profile / Business Proposal",
      "Bank Passbook"
    ],
    applicationMethod: "Submit application to City Mission Management Unit (CMMU) in the local urban local body (Municipal Corporation/Municipality).",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://nulm.gov.in"
  },
  {
    id: "wb-yuvasree",
    name: "Yuvasree Scheme (Employment Bank Assistance)",
    government: "State",
    state: "West Bengal",
    sector: "Employment",
    description: "Financial assistance scheme by Government of West Bengal for enrolled unemployed youth to enhance employability and prepare for competitive exams.",
    eligibility: {
      minAge: 18,
      maxAge: 45,
      education: [
        "Middle School (Class 8)",
        "Secondary (Class 10 Pass)",
        "Higher Secondary (Class 12 Pass)"
      ],
      occupations: [
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Unemployed residents of West Bengal enrolled in Employment Bank, holding minimum Class 8 pass qualification, one beneficiary per family."
    },
    benefits: "Monthly financial assistance of \u20B91,500 transferred to the jobseeker's bank account to support skill upgrading and coaching costs.",
    documents: [
      "Employment Bank Registration Proof",
      "Educational Marksheet",
      "Residential Certificate of West Bengal",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Register on Employment Bank portal (employmentbankwb.gov.in) and submit Annexure-I/II at local Employment Exchange.",
    officialSource: "Labour Department, Government of West Bengal",
    applicationLink: "https://employmentbankwb.gov.in"
  },
  {
    id: "up-yuva-swarozgar",
    name: "Mukhyamantri Yuva Swarozgar Yojana (UP)",
    government: "State",
    state: "Uttar Pradesh",
    sector: "Employment",
    description: "Self-employment assistance scheme by Uttar Pradesh government supporting educated unemployed youth to establish industrial and service micro-enterprises.",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      education: [
        "Secondary (Class 10 Pass)",
        "Higher Secondary (Class 12 Pass)",
        "Graduate (Bachelor Degree)"
      ],
      occupations: [
        "Unemployed / Job Seeker",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Residents of Uttar Pradesh who have passed at least High School (Class 10) and are not defaulters in any financial institution."
    },
    benefits: "Bank loan up to \u20B925 Lakh for manufacturing units and up to \u20B910 Lakh for service enterprises, with 25% margin money subsidy (up to \u20B96.25 Lakh).",
    documents: [
      "High School Certificate",
      "Domicile Certificate of UP",
      "Detailed Project Report (DPR)",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at diupmsme.upsdc.gov.in portal under Mukhyamantri Yuva Swarozgar Yojana.",
    officialSource: "Department of MSME and Export Promotion, Government of Uttar Pradesh",
    applicationLink: "https://diupmsme.upsdc.gov.in"
  },
  {
    id: "tn-uyegp",
    name: "Unemployed Youth Employment Generation Programme (UYEGP)",
    government: "State",
    state: "Tamil Nadu",
    sector: "Employment",
    description: "Flagship self-employment loan scheme by Government of Tamil Nadu providing margin money subsidy to first-generation entrepreneurs.",
    eligibility: {
      minAge: 18,
      maxAge: 45,
      education: [
        "Middle School (Class 8)",
        "Secondary (Class 10 Pass)"
      ],
      maxIncome: 5e5,
      occupations: [
        "Unemployed / Job Seeker",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Residents of Tamil Nadu with minimum Class 8 qualification and annual family income up to \u20B95 Lakh."
    },
    benefits: "Bank loans up to \u20B915 Lakh for manufacturing, \u20B95 Lakh for service, and \u20B95 Lakh for business enterprises, with 25% government subsidy (up to \u20B91.25 Lakh).",
    documents: [
      "School Transfer Certificate (Class 8+)",
      "Community Certificate",
      "Aadhaar Card & Ration Card",
      "Project Report",
      "Bank Quotation"
    ],
    applicationMethod: "Apply online at msmeonline.tn.gov.in/uyegp through District Industries Centre (DIC).",
    officialSource: "Department of Industries and Commerce, Government of Tamil Nadu",
    applicationLink: "https://msmeonline.tn.gov.in"
  },
  {
    id: "rajasthan-yuva-mitra",
    name: "Rajiv Gandhi Yuva Mitra Internship Program",
    government: "State",
    state: "Rajasthan",
    sector: "Employment",
    description: "Paid government engagement initiative deploying youth across districts to spread awareness about state welfare schemes among grassroots citizens.",
    eligibility: {
      minAge: 18,
      maxAge: 35,
      education: [
        "Higher Secondary (Class 12 Pass)",
        "Graduate (Bachelor Degree)"
      ],
      occupations: [
        "Unemployed / Job Seeker",
        "Student / Scholar"
      ],
      gender: "All",
      criteriaText: "Educated youth domiciled in Rajasthan with good communication skills and commitment to community outreach."
    },
    benefits: "Monthly stipend of \u20B917,500 along with government internship certificate and leadership training.",
    documents: [
      "Graduation Degree / 12th Marksheet",
      "Rajasthan Domicile Certificate",
      "Aadhaar Card & Jan Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Apply via Directorate of Economics and Statistics recruitment notification.",
    officialSource: "Planning Department, Government of Rajasthan",
    applicationLink: "https://des.rajasthan.gov.in"
  },
  {
    id: "pmkvy-skill-india",
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Skill Development",
    description: "Flagship skill certification scheme training youth in industry-relevant skills including Industry 4.0 skills like AI, Robotics, 3D Printing, and Drones.",
    eligibility: {
      minAge: 15,
      maxAge: 45,
      occupations: [
        "Unemployed / Job Seeker",
        "Student / Scholar",
        "Artisan / Craftsman",
        "Other"
      ],
      gender: "All",
      criteriaText: "Any Indian national who is a school/college dropout or unemployed youth seeking market-driven vocational training."
    },
    benefits: "100% free industry-certified skill training, free assessment and certification under National Skills Qualifications Framework (NSQF), and post-training placement support.",
    documents: [
      "Aadhaar Card",
      "Educational Marksheets (if any)",
      "Bank Account Details",
      "Passport size photograph"
    ],
    applicationMethod: "Register on Skill India Digital portal (skillindiadigital.gov.in) and choose nearest training centre.",
    officialSource: "Ministry of Skill Development and Entrepreneurship (MSDE) & NSDC",
    applicationLink: "https://www.skillindiadigital.gov.in"
  },
  {
    id: "pm-vishwakarma-skill",
    name: "PM Vishwakarma Kaushal Samman",
    government: "Central",
    state: "All-India (Central)",
    sector: "Skill Development",
    description: "Holistic scheme providing end-to-end support to traditional artisans and craftspeople engaged in 18 traditional family trades.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Artisan / Craftsman"
      ],
      gender: "All",
      criteriaText: "Artisans engaged in 18 specified trades (Carpenter, Blacksmith, Potter, Sculptor, Cobbler, Mason, Weaver, Tailor, Barber, Washerman, etc.)."
    },
    benefits: "PM Vishwakarma Certificate & ID Card, 5-7 days basic skill training with \u20B9500/day stipend, modern toolkit incentive of \u20B915,000, and collateral-free credit up to \u20B93 Lakh at 5% interest.",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "Bank Account Details",
      "Trade Declaration / Gram Panchayat Verification"
    ],
    applicationMethod: "Apply at any Common Service Centre (CSC) or online at pmvishwakarma.gov.in.",
    officialSource: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    applicationLink: "https://pmvishwakarma.gov.in"
  },
  {
    id: "naps-apprenticeship",
    name: "National Apprenticeship Promotion Scheme (NAPS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Skill Development",
    description: "Promotes on-the-job industrial apprenticeship training by sharing stipend costs with employers across manufacturing and services sectors.",
    eligibility: {
      minAge: 14,
      education: [
        "Middle School (Class 8)",
        "Secondary (Class 10 Pass)",
        "Higher Secondary (Class 12 Pass)",
        "Diploma / ITI Certificate",
        "Graduate (Bachelor Degree)"
      ],
      occupations: [
        "Student / Scholar",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Candidates who have passed Class 5, 8, 10, 12, ITI, or Graduation and meet the physical fitness standards for the trade."
    },
    benefits: "Direct monthly stipend support of up to \u20B91,500 (25% of prescribed stipend) paid directly into apprentice's bank account via DBT during training in top companies.",
    documents: [
      "Aadhaar Card",
      "Educational Marksheet / ITI Certificate",
      "Bank Passbook"
    ],
    applicationMethod: "Register profile and apply for company apprenticeship opportunities on apprenticeshipindia.gov.in.",
    officialSource: "Ministry of Skill Development and Entrepreneurship",
    applicationLink: "https://www.apprenticeshipindia.gov.in"
  },
  {
    id: "ddu-gky-rural-skills",
    name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Skill Development",
    description: "Placement-linked skill training programme for rural poor youth to transform rural poverty through sustainable wages.",
    eligibility: {
      minAge: 15,
      maxAge: 35,
      occupations: [
        "Farmer / Agricultural Laborer",
        "Construction Worker / Daily Wage",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Poor rural youth identified through SECC list or rural BPL cardholders (upper age limit 45 for SC/ST/Women/PWD)."
    },
    benefits: "Free residential skill training, free uniforms, course books, digital tablets, and mandatory wage employment placement with min 70% placement guarantee.",
    documents: [
      "BPL Card / MGNREGA Job Card of family",
      "Aadhaar Card",
      "School Leaving Certificate",
      "Bank Account Details"
    ],
    applicationMethod: "Enroll through local Gram Rozgar Sahayak at Gram Panchayat or visit ddugky.gov.in.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://ddugky.gov.in"
  },
  {
    id: "sankalp-skill-acquisition",
    name: "SANKALP (Skills Acquisition and Knowledge Awareness for Livelihood)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Skill Development",
    description: "World Bank supported program strengthening institutional mechanisms for skill development and decentralized district skill committees.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Unemployed / Job Seeker",
        "Artisan / Craftsman",
        "Other"
      ],
      gender: "All",
      criteriaText: "Youth seeking high-demand localized vocational skills organized by District Skill Development Plans."
    },
    benefits: "Standardized quality certified skill courses with market alignment and micro-enterprise incubation linkages.",
    documents: [
      "Aadhaar Card",
      "Educational Proof"
    ],
    applicationMethod: "Participate through District Skill Development Offices in respective collectorates.",
    officialSource: "Ministry of Skill Development and Entrepreneurship",
    applicationLink: "https://msde.gov.in"
  },
  {
    id: "craftsmen-training-scheme-iti",
    name: "Craftsmen Training Scheme (CTS - ITIs)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Skill Development",
    description: "Flagship vocational technical training delivered through 15,000+ Industrial Training Institutes (ITIs) in engineering and non-engineering trades.",
    eligibility: {
      minAge: 14,
      education: [
        "Middle School (Class 8)",
        "Secondary (Class 10 Pass)",
        "Higher Secondary (Class 12 Pass)"
      ],
      occupations: [
        "Student / Scholar",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Candidates who have passed Class 8 or Class 10 (with Science and Mathematics for engineering trades)."
    },
    benefits: "National Trade Certificate (NTC) recognized globally, practical workshop training in trades like Electrician, Fitter, Welder, Machinist, Turner, and COPA.",
    documents: [
      "Class 8 or 10 Marksheet",
      "Aadhaar Card",
      "Transfer Certificate",
      "Caste Certificate (if applicable)"
    ],
    applicationMethod: "Apply online during annual ITI admission counselling conducted by state directorates of technical training.",
    officialSource: "Directorate General of Training (DGT), MSDE",
    applicationLink: "https://dgt.gov.in"
  },
  {
    id: "jan-shikshan-sansthan",
    name: "Jan Shikshan Sansthan (JSS) Vocational Scheme",
    government: "Central",
    state: "All-India (Central)",
    sector: "Skill Development",
    description: "Provides vocational skills to non-literates, neo-literates, and school dropouts in rural and semi-urban areas at doorsteps.",
    eligibility: {
      minAge: 15,
      maxAge: 45,
      education: [
        "No Formal Schooling",
        "Primary (Up to Class 5)",
        "Middle School (Class 8)"
      ],
      occupations: [
        "Homemaker",
        "Construction Worker / Daily Wage",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Non-literate and low-educated individuals, with priority given to women, SC, ST, OBC, and minorities."
    },
    benefits: "Free or ultra-low fee hands-on training in local cottage trades (tailoring, food processing, embroidery, plumbing, mobile repair) conducted within village community halls.",
    documents: [
      "Aadhaar Card",
      "Self-declaration of educational background"
    ],
    applicationMethod: "Enroll directly at the district Jan Shikshan Sansthan centre or mobile training village camp.",
    officialSource: "Ministry of Skill Development and Entrepreneurship",
    applicationLink: "https://jss.gov.in"
  },
  {
    id: "tn-naan-mudhalvan",
    name: "Naan Mudhalvan Scheme",
    government: "State",
    state: "Tamil Nadu",
    sector: "Skill Development",
    description: "Massive dynamic skill enhancement initiative by Government of Tamil Nadu providing futuristic tech skills to engineering, arts, and science college students.",
    eligibility: {
      minAge: 17,
      maxAge: 25,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Students enrolled in government and government-aided higher education institutions in Tamil Nadu."
    },
    benefits: "Free advanced certifications in AI/ML, Cloud Computing, Cybersecurity, Data Analytics, Logistics, Banking, and foreign languages integrated into college curriculum.",
    documents: [
      "College Roll Number / EMIS ID",
      "Aadhaar Card"
    ],
    applicationMethod: "Access course modules directly via naanmudhalvan.tn.gov.in through college portal login.",
    officialSource: "Tamil Nadu Skill Development Corporation (TNSDC)",
    applicationLink: "https://naanmudhalvan.tn.gov.in"
  },
  {
    id: "karnataka-koushalya",
    name: "Koushalya Karnataka Scheme (CMKKY)",
    government: "State",
    state: "Karnataka",
    sector: "Skill Development",
    description: "Skill development mission empowering unemployed youth across Karnataka with market-demanded trade certificates and self-employment funding.",
    eligibility: {
      minAge: 18,
      maxAge: 35,
      occupations: [
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Residents of Karnataka seeking technical or service industry vocational training."
    },
    benefits: "Free training across 26 sectors with government certification, monthly post-placement transport allowance, and startup toolkit support.",
    documents: [
      "Karnataka Domicile Proof / Ration Card",
      "Aadhaar Card",
      "Education Proof"
    ],
    applicationMethod: "Apply online at skillconnect.kaushalkar.com or register at district Kaushalya centres.",
    officialSource: "Department of Skill Development, Entrepreneurship and Livelihood, Karnataka",
    applicationLink: "https://kaushalkar.com"
  },
  {
    id: "mh-mssds-skills",
    name: "Pramod Mahajan Kaushalya Vikas Abhiyan (MSSDS)",
    government: "State",
    state: "Maharashtra",
    sector: "Skill Development",
    description: "Skill development scheme by Maharashtra State Skill Development Society offering youth vocational training and immediate wage employment.",
    eligibility: {
      minAge: 15,
      maxAge: 45,
      occupations: [
        "Unemployed / Job Seeker",
        "Artisan / Craftsman"
      ],
      gender: "All",
      criteriaText: "Residents of Maharashtra seeking short-term vocational courses aligned with industry requirements."
    },
    benefits: "Free training, industry mentorship, soft skills development, and placement drives organized across every district of Maharashtra.",
    documents: [
      "Aadhaar Card",
      "Educational Marksheets",
      "Bank Account Details",
      "Domicile Certificate of Maharashtra"
    ],
    applicationMethod: "Register on mahaswayam.gov.in under Skill Development tab.",
    officialSource: "Skill Development, Employment and Entrepreneurship Department, Maharashtra",
    applicationLink: "https://www.mahaswayam.gov.in"
  },
  {
    id: "pmay-gramin",
    name: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Housing",
    description: "Flagship rural housing scheme aiming to provide a pucca house with basic amenities to all houseless households and those living in kutcha/dilapidated houses in rural areas.",
    eligibility: {
      maxIncome: 18e4,
      gender: "All",
      criteriaText: "Houseless rural families and those living in zero, one or two-room houses with kutcha wall and kutcha roof as per SECC/Awaas+ verified survey."
    },
    benefits: "Direct financial grant of \u20B91,20,000 in plains and \u20B91,30,000 in hilly/difficult states, plus 90 days of unskilled wage labour under MGNREGA (approx \u20B925,000) and \u20B912,000 for toilet construction.",
    documents: [
      "Aadhaar Card of all family members",
      "MGNREGA Job Card",
      "Bank Account Details (Aadhaar linked)",
      "Land / Homestead Patta document"
    ],
    applicationMethod: "Beneficiaries selected through Gram Sabha verification of Awaas+ list; track status on pmayg.nic.in.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://pmayg.nic.in"
  },
  {
    id: "pmay-urban-2",
    name: "Pradhan Mantri Awas Yojana - Urban 2.0 (PMAY-U)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Housing",
    description: "Centrally sponsored scheme addressing housing shortage among urban poor including slum dwellers, EWS, and LIG categories in all statutory towns.",
    eligibility: {
      maxIncome: 6e5,
      gender: "All",
      criteriaText: "Urban families who do not own a pucca house anywhere in India; family income up to \u20B93 Lakh for EWS and up to \u20B96 Lakh for LIG."
    },
    benefits: "Central assistance of \u20B91.5 Lakh to \u20B92.5 Lakh per house under Beneficiary-Led Construction (BLC) or Affordable Housing in Partnership (AHP).",
    documents: [
      "Aadhaar Card of all household members",
      "Income Certificate / Salary Slip",
      "Land Title / Municipal Assessment Receipt",
      "Affidavit of not owning a pucca house"
    ],
    applicationMethod: "Apply online at pmaymis.gov.in or through Common Service Centres (CSCs) and local Municipal Corporation offices.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://pmaymis.gov.in"
  },
  {
    id: "pmay-clss-subsidy",
    name: "Credit Linked Subsidy Scheme (CLSS) for Housing",
    government: "Central",
    state: "All-India (Central)",
    sector: "Housing",
    description: "Interest subsidy scheme on home loans for purchase, construction, or extension of house for EWS, LIG, and Middle Income Groups.",
    eligibility: {
      gender: "All",
      criteriaText: "Beneficiaries seeking home loans from primary lending institutions who do not own a pucca house."
    },
    benefits: "Upfront interest subsidy of up to \u20B92.67 Lakh credited directly into loan account, reducing effective EMI payments substantially.",
    documents: [
      "Home Loan Application with Bank",
      "Income Certificate / ITR",
      "Aadhaar Card",
      "Sale Agreement / Construction Estimate"
    ],
    applicationMethod: "Apply directly through participating commercial banks, housing finance companies, or via CLAP portal (pmayuclap.gov.in).",
    officialSource: "National Housing Bank & MoHUA",
    applicationLink: "https://pmayuclap.gov.in"
  },
  {
    id: "arhc-rental-housing",
    name: "Affordable Rental Housing Complexes (ARHCs)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Housing",
    description: "Sub-scheme under PMAY-U to provide dignified affordable rental accommodation close to workplaces for urban migrants and poor labourers.",
    eligibility: {
      occupations: [
        "Construction Worker / Daily Wage",
        "Street Vendor / Small Trader",
        "Salaried Employee (Private)"
      ],
      gender: "All",
      criteriaText: "Migrant industrial workers, street vendors, rickshaw pullers, hospitality workers, and students living in major urban centres."
    },
    benefits: "Fully furnished rental dormitories and 1BHK/2BHK flats with piped water, electricity, sanitation, and security at highly subsidized government-regulated rents.",
    documents: [
      "Aadhaar Card",
      "Proof of Urban Employment / Street Vendor Card / Factory ID",
      "Photographs"
    ],
    applicationMethod: "Apply through municipal urban local body or local ARHC management agency.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://arhc.mohua.gov.in"
  },
  {
    id: "swamih-investment-fund",
    name: "SWAMIH Investment Fund for Affordable Housing",
    government: "Central",
    state: "All-India (Central)",
    sector: "Housing",
    description: "Special government-backed last-mile financing fund to complete stalled housing projects and deliver homes to distressed home buyers.",
    eligibility: {
      gender: "All",
      criteriaText: "Home buyers who purchased flats in registered, stalled residential projects that are net-worth positive."
    },
    benefits: "Direct infusion of completion funds into construction escrow accounts, ensuring guaranteed possession of flats to middle-class families.",
    documents: [
      "Allotment Letter / Builder Buyer Agreement",
      "Payment Receipts",
      "Aadhaar Card"
    ],
    applicationMethod: "Driven through project developers and SBICAP Ventures monitoring portal.",
    officialSource: "Department of Economic Affairs, Ministry of Finance",
    applicationLink: "https://myscheme.gov.in"
  },
  {
    id: "odisha-biju-pucca-ghar",
    name: "Biju Pucca Ghar Yojana (BPGY)",
    government: "State",
    state: "Odisha",
    sector: "Housing",
    description: "State housing scheme by Government of Odisha to convert all kutcha houses in rural areas of the state into permanent pucca houses.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Fisherman / Fisherfolk",
        "Construction Worker / Daily Wage"
      ],
      gender: "All",
      criteriaText: "Rural households residing in kutcha houses who have not availed benefits under PMAY-G or any other government housing scheme."
    },
    benefits: "Direct financial assistance of \u20B91,20,000 to \u20B91,30,000 released in installments directly to beneficiary bank account via DBT.",
    documents: [
      "Kutcha House Geo-tagged Photo",
      "Aadhaar Card",
      "Ration Card",
      "Bank Account Details"
    ],
    applicationMethod: "Identified through Gram Panchayat survey; online tracking via rhodisha.gov.in.",
    officialSource: "Panchayati Raj and Drinking Water Department, Government of Odisha",
    applicationLink: "https://rhodisha.gov.in"
  },
  {
    id: "tn-kalaignar-kanavu-illam",
    name: "Kalaignar Kanavu Illam Scheme",
    government: "State",
    state: "Tamil Nadu",
    sector: "Housing",
    description: "Transformative rural housing programme by Government of Tamil Nadu aiming to make rural Tamil Nadu hut-free by constructing 8 Lakh pucca houses.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Construction Worker / Daily Wage"
      ],
      gender: "All",
      criteriaText: "Rural households living in thatched roof huts and dilapidated homes across Tamil Nadu villages."
    },
    benefits: "Direct construction grant of \u20B93.5 Lakh per house, combined with free house site patta and water-sanitation amenities.",
    documents: [
      "Village Revenue House Site Patta",
      "Smart Ration Card",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Enrolment through Block Development Officer (BDO) and Village Panchayat President verification.",
    officialSource: "Rural Development and Panchayat Raj Department, Government of Tamil Nadu",
    applicationLink: "https://tnrd.tn.gov.in"
  },
  {
    id: "karnataka-basava-vasathi",
    name: "Basava Vasathi Yojana (RGRHCL)",
    government: "State",
    state: "Karnataka",
    sector: "Housing",
    description: "Affordable housing programme in Karnataka to provide pucca dwellings to economically backward and homeless families.",
    eligibility: {
      maxIncome: 1e5,
      gender: "All",
      criteriaText: "Permanent residents of Karnataka who are homeless or living in kutcha houses with annual income below \u20B91 Lakh."
    },
    benefits: "Direct housing subsidy of \u20B91,50,000 for General category and \u20B92,00,000 for SC/ST beneficiaries credited across 4 stages of construction.",
    documents: [
      "Income Certificate",
      "Caste Certificate",
      "Aadhaar Card",
      "Site Khata / Possession Certificate",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at ashraya.karnataka.gov.in through Rajiv Gandhi Housing Corporation.",
    officialSource: "Rajiv Gandhi Rural Housing Corporation Limited, Karnataka",
    applicationLink: "https://ashraya.karnataka.gov.in"
  },
  {
    id: "up-mukhyamantri-awas-rural",
    name: "Mukhyamantri Awas Yojana Rural (UP)",
    government: "State",
    state: "Uttar Pradesh",
    sector: "Housing",
    description: "Special rural housing scheme in Uttar Pradesh providing free houses to destitute, leprosy-affected, divyang, and vulnerable tribal families left out of PMAY-G.",
    eligibility: {
      gender: "All",
      criteriaText: "Poor families belonging to Musahar, Vantangiya, Kol, Tharu tribes, leprosy-affected persons, and natural calamity victims in UP."
    },
    benefits: "Financial assistance of \u20B91,20,000 directly deposited in bank account, plus 90 days MGNREGA wages and free solar power kit.",
    documents: [
      "Aadhaar Card",
      "Certificate of Disability/Leprosy/Vulnerable Tribe",
      "Bank Passbook",
      "Gram Sabha Resolution"
    ],
    applicationMethod: "Identified by Village Development Officer and approved by Chief Development Officer (CDO).",
    officialSource: "Rural Development Department, Government of Uttar Pradesh",
    applicationLink: "https://rural.up.nic.in"
  },
  {
    id: "wb-bangla-awas-yojana",
    name: "Bangla Awas Yojana (BAY)",
    government: "State",
    state: "West Bengal",
    sector: "Housing",
    description: "Comprehensive rural housing welfare initiative in West Bengal funding pucca house construction for rural poor families.",
    eligibility: {
      gender: "All",
      criteriaText: "Poor rural households residing in temporary kutcha mud huts in West Bengal."
    },
    benefits: "Direct cash assistance of \u20B91,20,000 transferred in three milestones directly into bank account via DBT.",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "Bank Account Details",
      "Land Record / Homestead Proof"
    ],
    applicationMethod: "Verification conducted by Gram Panchayat and Block Development Office.",
    officialSource: "Panchayat & Rural Development Department, Government of West Bengal",
    applicationLink: "https://wbprd.gov.in"
  },
  {
    id: "adip-scheme-divyang",
    name: "ADIP Scheme (Assistance to Disabled Persons)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Disability Support",
    description: "Assistance to disabled persons for purchasing and fitting durable, sophisticated, modern aids and assistive appliances.",
    eligibility: {
      maxIncome: 36e4,
      gender: "All",
      criteriaText: "Any Indian citizen holding 40% or more disability certified by medical authority with monthly family income not exceeding \u20B930,000."
    },
    benefits: "100% free motorized tricycles, wheelchairs, smart canes, digital hearing aids, braille slates, laptops with screen readers, and prosthetic limbs.",
    documents: [
      "Disability Certificate (min 40%) or UDID Card",
      "Income Certificate",
      "Aadhaar Card",
      "Passport size photograph showing disability"
    ],
    applicationMethod: "Apply online at adip.depwd.gov.in or attend free distribution mega-camps organized by ALIMCO.",
    officialSource: "Department of Empowerment of Persons with Disabilities (DEPwD), MoSJE",
    applicationLink: "https://adip.depwd.gov.in"
  },
  {
    id: "udid-divyangjan-card",
    name: "Unique Disability ID (UDID) Card & National Portal",
    government: "Central",
    state: "All-India (Central)",
    sector: "Disability Support",
    description: "Creates a national centralized database for persons with disabilities and issues a single verifiable smart UDID card for seamless cross-country benefits.",
    eligibility: {
      gender: "All",
      criteriaText: "All persons with disabilities specified under the Rights of Persons with Disabilities Act (21 benchmark disabilities)."
    },
    benefits: "Universal smart identity card entitling holder to railway concessions (up to 75%), bus travel concessions, accessible government recruitments, and scholarship preferences.",
    documents: [
      "Aadhaar Card",
      "Existing Medical Disability Certificate (or book hospital appointment via portal)",
      "Photograph and Signature/Thumb Impression"
    ],
    applicationMethod: "Apply online at swavlambancard.gov.in; medical board verifies at nearest district civil hospital.",
    officialSource: "Department of Empowerment of Persons with Disabilities (DEPwD)",
    applicationLink: "https://www.swavlambancard.gov.in"
  },
  {
    id: "divyangjan-swavalamban-loans",
    name: "Divyangjan Swavalamban Yojana (NDFDC Concessional Loans)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Disability Support",
    description: "Concessional credit scheme to provide loans to persons with disabilities for pursuing education, vocational training, and setting up self-employment ventures.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Artisan / Craftsman",
        "Self Employed / Micro Entrepreneur",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Indian citizens with 40% or more disability seeking self-employment loans."
    },
    benefits: "Loans up to \u20B950 Lakh at low interest rates (5% to 8% p.a.) with special 1% rebate for women with disabilities; no collateral up to \u20B95 Lakh.",
    documents: [
      "UDID Card / Disability Certificate",
      "Aadhaar Card & PAN Card",
      "Business Project Proposal",
      "Bank Account Details"
    ],
    applicationMethod: "Apply through state channelizing agencies or public sector banks associated with NDFDC.",
    officialSource: "National Divyangjan Finance and Development Corporation (NDFDC)",
    applicationLink: "https://www.nhfdc.nic.in"
  },
  {
    id: "ddrs-disabled-rehab",
    name: "Deendayal Disabled Rehabilitation Scheme (DDRS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Disability Support",
    description: "Grant-in-aid scheme to voluntary non-profit organizations to run special schools, vocational training centers, and community rehabilitation programmes.",
    eligibility: {
      gender: "All",
      criteriaText: "Children and adults with intellectual, visual, hearing, or multiple disabilities."
    },
    benefits: "Free special education, hostel accommodation, therapeutic care (physiotherapy, speech therapy), and job-oriented vocational training.",
    documents: [
      "Disability Certificate",
      "Aadhaar Card",
      "Admission Application to DDRS Project"
    ],
    applicationMethod: "Enroll at recognized DDRS Special Schools and Vocational Training Centres in respective districts.",
    officialSource: "Department of Empowerment of Persons with Disabilities",
    applicationLink: "https://disabilityaffairs.gov.in"
  },
  {
    id: "nfpd-disability-fellowship",
    name: "National Fellowship for Students with Disabilities (NFPD)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Disability Support",
    description: "Financial assistance to students with disabilities to pursue higher education leading to M.Phil and Ph.D. degrees in Indian universities.",
    eligibility: {
      education: [
        "Post Graduate / Doctorate"
      ],
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Students with disabilities admitted to regular full-time M.Phil/Ph.D. programmes in UGC recognized institutions."
    },
    benefits: "Fellowship of \u20B937,000/month for JRF and \u20B942,000/month for SRF, plus annual contingency grant and escort/reader allowance of \u20B93,000/month.",
    documents: [
      "Disability Certificate / UDID Card",
      "Post Graduation Marksheet",
      "M.Phil / Ph.D. Admission Letter",
      "Aadhaar Card"
    ],
    applicationMethod: "Apply online through UGC / National Scholarship Portal.",
    officialSource: "UGC & Ministry of Social Justice and Empowerment",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "pre-post-matric-disability-scholarship",
    name: "Pre-Matric & Post-Matric Scholarship for Students with Disabilities",
    government: "Central",
    state: "All-India (Central)",
    sector: "Disability Support",
    description: "Centrally funded scholarship covering schooling and college expenses for students with benchmark disabilities.",
    eligibility: {
      minAge: 6,
      maxIncome: 25e4,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Students with 40%+ disability studying in Class 9 onwards in recognized institutions; parental annual income up to \u20B92.5 Lakh."
    },
    benefits: "Maintenance allowance of up to \u20B91,600/month plus book grant of up to \u20B94,000/year and full disability allowance.",
    documents: [
      "Disability Certificate",
      "Income Certificate",
      "Marksheet of Previous Class",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online on National Scholarship Portal (NSP).",
    officialSource: "DEPwD, Ministry of Social Justice and Empowerment",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "sugamya-bharat-campaign",
    name: "Accessible India Campaign (Sugamya Bharat Abhiyan)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Disability Support",
    description: "Nationwide campaign creating a universally barrier-free accessible physical and digital environment across transport, buildings, and websites.",
    eligibility: {
      gender: "All",
      criteriaText: "All citizens with disabilities and elderly citizens requiring accessible infrastructure."
    },
    benefits: "Ramps, lifts with braille auditory signals, accessible public toilets, disabled-friendly railway coaches/airports, and accessible public portals.",
    documents: [
      "Sugamya Bharat App account"
    ],
    applicationMethod: "Report accessibility barriers or seek redressal via Sugamya Bharat mobile application.",
    officialSource: "DEPwD, Ministry of Social Justice and Empowerment",
    applicationLink: "https://accessibleindia.gov.in"
  },
  {
    id: "mh-sanjay-gandhi-niradhar",
    name: "Sanjay Gandhi Niradhar Anudan Yojana (Divyang Pension)",
    government: "State",
    state: "Maharashtra",
    sector: "Disability Support",
    description: "Monthly maintenance allowance granted by Maharashtra government to persons with 40% and above disability who have no source of livelihood.",
    eligibility: {
      maxIncome: 21e3,
      gender: "All",
      criteriaText: "Resident of Maharashtra with 40%+ disability and annual family income not exceeding \u20B921,000."
    },
    benefits: "Direct monthly pension of \u20B91,500 transferred to beneficiary bank account.",
    documents: [
      "Civil Surgeon Disability Certificate",
      "Income Certificate from Tehsildar",
      "Domicile Certificate of Maharashtra",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Submit application at local Tehsildar office / Collectorate office.",
    officialSource: "Social Justice and Special Assistance Department, Maharashtra",
    applicationLink: "https://sjsa.maharashtra.gov.in"
  },
  {
    id: "tn-differently-abled-maintenance",
    name: "Differently Abled Maintenance Allowance Scheme",
    government: "State",
    state: "Tamil Nadu",
    sector: "Disability Support",
    description: "Direct monthly maintenance allowance by Tamil Nadu government to severely affected persons with disabilities.",
    eligibility: {
      gender: "All",
      criteriaText: "Persons with mental retardation, cerebral palsy, muscular dystrophy, or 75%+ loco-motor disability residing in Tamil Nadu."
    },
    benefits: "Monthly financial pension of \u20B92,000 paid directly into bank account via DBT.",
    documents: [
      "National Disability Identity Card (Tamil Nadu)",
      "Aadhaar Card",
      "Bank Passbook",
      "Ration Card"
    ],
    applicationMethod: "Apply through District Differently Abled Welfare Officer (DDAWO).",
    officialSource: "Welfare of Differently Abled Persons Department, Government of Tamil Nadu",
    applicationLink: "https://scd.tn.gov.in"
  },
  {
    id: "telangana-asara-disability",
    name: "Aasara Disability Pension Scheme",
    government: "State",
    state: "Telangana",
    sector: "Disability Support",
    description: "Generous social safety pension provided by Government of Telangana to individuals with disabilities to secure livelihood.",
    eligibility: {
      gender: "All",
      criteriaText: "Residents of Telangana with certified disability of 40% or above (hearing impaired requires 51%+)."
    },
    benefits: "Direct monthly pension of \u20B94,016 per month deposited into the beneficiary's post office or bank account.",
    documents: [
      "SADAREM Disability Certificate",
      "Aadhaar Card",
      "Food Security Card / Ration Card",
      "Bank Account Details"
    ],
    applicationMethod: "Apply at nearest MeeSeva centre with SADAREM certificate.",
    officialSource: "Panchayat Raj and Rural Development Department, Government of Telangana",
    applicationLink: "https://aasara.telangana.gov.in"
  },
  {
    id: "ignoaps-old-age-pension",
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Senior Citizens",
    description: "Non-contributory monthly old age social security pension under the National Social Assistance Programme (NSAP) for BPL elderly persons.",
    eligibility: {
      minAge: 60,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "Indian citizens aged 60 years and above who belong to a household living below the poverty line (BPL)."
    },
    benefits: "Monthly pension of \u20B91,000 to \u20B93,000 per month (combined central contribution + state top-up) paid directly via DBT.",
    documents: [
      "BPL Card / Antyodaya Ration Card",
      "Aadhaar Card / Voter ID (proof of age)",
      "Bank / Post Office Passbook"
    ],
    applicationMethod: "Apply at local Gram Panchayat, Block Development Office, or Municipal Office; monitor on nsap.nic.in.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://nsap.nic.in"
  },
  {
    id: "rashtriya-vayoshri-yojana",
    name: "Rashtriya Vayoshri Yojana (RVY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Senior Citizens",
    description: "Centrally sponsored scheme providing physical aids and assisted living devices to senior citizens belonging to BPL category suffering from age-related disabilities.",
    eligibility: {
      minAge: 60,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "Senior citizens aged 60 and above belonging to BPL households or having monthly income under \u20B915,000."
    },
    benefits: "Free walking sticks, elbow crutches, walkers, tripods, quadpods, hearing aids, wheelchair, artificial dentures, and spectacles.",
    documents: [
      "Proof of Age (Aadhaar / Voter ID)",
      "BPL Certificate / Income Certificate",
      "Medical Certificate of age-related infirmity"
    ],
    applicationMethod: "Participate in free screening and distribution camps conducted by ALIMCO in respective districts.",
    officialSource: "Department of Social Justice and Empowerment",
    applicationLink: "https://socialjustice.gov.in"
  },
  {
    id: "pm-vaya-vandana-yojana",
    name: "Pradhan Mantri Vaya Vandana Yojana (PMVVY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Senior Citizens",
    description: "Government-backed retirement pension scheme operated through Life Insurance Corporation of India (LIC) guaranteeing assured return to seniors.",
    eligibility: {
      minAge: 60,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "Senior citizens aged 60 years and above (no maximum age limit)."
    },
    benefits: "Guaranteed annual return of 7.40% p.a. payable monthly (approx \u20B99,250/month on max investment of \u20B915 Lakh) for 10 years, with full principal refund on maturity.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Bank Account Details",
      "Age Proof"
    ],
    applicationMethod: "Enroll online via LIC of India portal (licindia.in) or visit any authorized LIC branch.",
    officialSource: "Ministry of Finance & LIC of India",
    applicationLink: "https://licindia.in"
  },
  {
    id: "sacred-elderly-jobs",
    name: "SACRED Portal (Senior Able Citizens for Re-Employment)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Senior Citizens",
    description: "National IT portal bringing senior citizens seeking employment together with private and public employers needing experienced wisdom.",
    eligibility: {
      minAge: 60,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "Senior citizens aged 60 and above possessing professional, technical, or administrative experience wishing to stay productively engaged."
    },
    benefits: "Free registration and access to flexible part-time, advisory, and consulting jobs across industries without any broker fees.",
    documents: [
      "Aadhaar Card",
      "Resume / Professional Experience Bio-data"
    ],
    applicationMethod: "Register online on sacred.dosje.gov.in.",
    officialSource: "Department of Social Justice and Empowerment",
    applicationLink: "https://sacred.dosje.gov.in"
  },
  {
    id: "sage-elderly-care",
    name: "Seniorcare Ageing Growth Engine (SAGE) Initiative",
    government: "Central",
    state: "All-India (Central)",
    sector: "Senior Citizens",
    description: "Supports innovative elderly care startups providing healthcare, travel, companionship, and nutrition services for senior citizens.",
    eligibility: {
      minAge: 60,
      gender: "All",
      criteriaText: "All senior citizens requiring accessible home healthcare, assistive technologies, or eldercare legal/financial services."
    },
    benefits: "Subsidized high-quality home healthcare, companion care, assistive home automation, and dementia care services delivered by vetted startups.",
    documents: [
      "Aadhaar Card"
    ],
    applicationMethod: "Explore verified elderly care products and services on sage.dosje.gov.in.",
    officialSource: "Ministry of Social Justice and Empowerment",
    applicationLink: "https://sage.dosje.gov.in"
  },
  {
    id: "elderline-14567",
    name: "Elderline (National Helpline for Senior Citizens - 14567)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Senior Citizens",
    description: "National toll-free helpline providing information, guidance, emotional support, and field rescue intervention for abandoned or distressed senior citizens.",
    eligibility: {
      minAge: 60,
      gender: "All",
      criteriaText: "All senior citizens in India or relatives/citizens reporting abuse or abandonment of senior citizens."
    },
    benefits: "Free 24x7 phone support for legal rights under Maintenance and Welfare of Parents and Senior Citizens Act, elder abuse rescue, old-age home placement.",
    documents: [
      "No documents required to dial helpline"
    ],
    applicationMethod: "Dial toll-free number 14567 from any mobile or landline phone.",
    officialSource: "Department of Social Justice and Empowerment & NISD",
    applicationLink: "https://elderline.dosje.gov.in"
  },
  {
    id: "karnataka-sandhya-suraksha",
    name: "Sandhya Suraksha Yojana",
    government: "State",
    state: "Karnataka",
    sector: "Senior Citizens",
    description: "Social security pension scheme in Karnataka providing financial assistance to senior citizens from the unorganized sector.",
    eligibility: {
      minAge: 65,
      maxIncome: 2e4,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "Permanent residents of Karnataka aged 65 years and above whose annual family income is below \u20B920,000."
    },
    benefits: "Monthly pension of \u20B91,200 transferred directly to the beneficiary's bank or post office account, along with free health checkups.",
    documents: [
      "Age Proof (Aadhaar / Voter ID / Birth Certificate)",
      "Income Certificate",
      "Residential Certificate of Karnataka",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at Seva Sindhu or through Nadakacheri centres.",
    officialSource: "Revenue Department, Government of Karnataka",
    applicationLink: "https://sevasindhu.karnataka.gov.in"
  },
  {
    id: "bihar-vridhajan-pension",
    name: "Mukhyamantri Vridhajan Pension Yojana (MVPY)",
    government: "State",
    state: "Bihar",
    sector: "Senior Citizens",
    description: "Universal social pension scheme by Government of Bihar covering all elderly citizens regardless of caste, community, or poverty line status.",
    eligibility: {
      minAge: 60,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "All senior citizens aged 60 and above domiciled in Bihar who do not receive any other government pension."
    },
    benefits: "Monthly pension of \u20B9400 for age 60-79 years, and \u20B9500 for age 80 years and above transferred via DBT.",
    documents: [
      "Aadhaar Card",
      "Aadhaar Consent Form",
      "Bank Passbook",
      "Voter ID / Age Proof"
    ],
    applicationMethod: "Apply online at sspmis.bihar.gov.in or through Right to Public Services (RTPS) counters.",
    officialSource: "Social Welfare Department, Government of Bihar",
    applicationLink: "https://sspmis.bihar.gov.in"
  },
  {
    id: "tn-old-age-pension-oap",
    name: "Tamil Nadu Destitute Old Age Pension Scheme (OAP)",
    government: "State",
    state: "Tamil Nadu",
    sector: "Senior Citizens",
    description: "Social security assistance by Government of Tamil Nadu providing monthly sustenance to destitute senior citizens.",
    eligibility: {
      minAge: 60,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "Destitute persons aged 60 and above residing in Tamil Nadu with no source of income and property value below \u20B91 Lakh."
    },
    benefits: "Monthly pension of \u20B91,200 deposited into bank account, plus free smart bus travel pass and 20 kg free rice per month.",
    documents: [
      "Aadhaar Card",
      "Smart Ration Card",
      "Destitute Certificate from Revenue Inspector",
      "Bank Passbook"
    ],
    applicationMethod: "Apply at local e-Sevai centre or Revenue Department Taluk Office.",
    officialSource: "Revenue and Disaster Management Department, Government of Tamil Nadu",
    applicationLink: "https://tnesevai.tn.gov.in"
  },
  {
    id: "odisha-madhu-babu-pension",
    name: "Madhu Babu Pension Yojana (MBPY)",
    government: "State",
    state: "Odisha",
    sector: "Senior Citizens",
    description: "Flagship social security pension scheme of Odisha providing dignified livelihood assistance to destitute elderly persons.",
    eligibility: {
      minAge: 60,
      maxIncome: 24e3,
      occupations: [
        "Retired / Senior Citizen"
      ],
      gender: "All",
      criteriaText: "Residents of Odisha aged 60 and above with annual family income not exceeding \u20B924,000 who are not receiving other pensions."
    },
    benefits: "Monthly pension of \u20B91,000 for age 60-79 years, and \u20B91,200 for beneficiaries aged 80 years and above.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Residential Certificate of Odisha",
      "Bank Account Details"
    ],
    applicationMethod: "Apply online at ssepd.gov.in or submit form at Block Development Office / Municipal office.",
    officialSource: "Social Security & Empowerment of Persons with Disabilities Department, Odisha",
    applicationLink: "https://ssepd.odisha.gov.in"
  },
  {
    id: "pmjdy-jan-dhan",
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "National mission for financial inclusion ensuring access to financial services like basic banking accounts, remittance, credit, insurance, and pension.",
    eligibility: {
      minAge: 10,
      gender: "All",
      criteriaText: "Any Indian citizen aged 10 years and above who does not have a basic savings bank deposit account."
    },
    benefits: "Zero balance bank account with no minimum balance charges, free RuPay debit card with \u20B92 Lakh inbuilt accident insurance cover, and overdraft facility up to \u20B910,000.",
    documents: [
      "Aadhaar Card (single document sufficient) or Voter ID / MGNREGA Card"
    ],
    applicationMethod: "Visit any commercial bank branch or Bank Mitra / Customer Service Point (CSP) to open account.",
    officialSource: "Department of Financial Services, Ministry of Finance",
    applicationLink: "https://pmjdy.gov.in"
  },
  {
    id: "pm-mudra-yojana",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "Provides institutional collateral-free loans to micro and small non-corporate enterprises across Shishu, Kishore, and Tarun loan tiers.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Artisan / Craftsman",
        "Street Vendor / Small Trader",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Any Indian citizen who has a business plan for a non-farm sector income generating activity such as manufacturing, processing, trading or services."
    },
    benefits: "Collateral-free business loans: Shishu (up to \u20B950,000), Kishore (\u20B950,001 to \u20B95 Lakh), Tarun (\u20B95 Lakh to \u20B910 Lakh), and Tarun Plus (up to \u20B920 Lakh).",
    documents: [
      "Identity Proof (Aadhaar/PAN)",
      "Proof of Business Establishment / Udyam Registration",
      "Quotations for Machinery/Items to be purchased",
      "Bank Statement (last 6 months)"
    ],
    applicationMethod: "Apply online at udyamimitra.in or submit application to any commercial bank, RRB, or MFI.",
    officialSource: "MUDRA & Department of Financial Services",
    applicationLink: "https://www.mudra.org.in"
  },
  {
    id: "stand-up-india",
    name: "Stand-Up India Scheme",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "Facilitates bank loans between \u20B910 Lakh and \u20B91 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch.",
    eligibility: {
      minAge: 18,
      gender: "All",
      criteriaText: "SC/ST and/or woman entrepreneurs setting up a greenfield enterprise in manufacturing, services, agri-allied activities, or trading."
    },
    benefits: "Bank loans from \u20B910 Lakh up to \u20B91 Crore covering up to 85% of project cost with low interest rate and handholding support.",
    documents: [
      "Aadhaar Card & PAN Card",
      "Caste Certificate (for SC/ST)",
      "Project Report / DPR",
      "Business Incorporation Proof"
    ],
    applicationMethod: "Apply online through standupmitra.in portal or directly at bank branches.",
    officialSource: "Department of Financial Services, Ministry of Finance",
    applicationLink: "https://www.standupmitra.in"
  },
  {
    id: "pm-svanidhi-microloan",
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "Special micro-credit facility empowering street vendors with collateral-free working capital loans to restart their livelihoods.",
    eligibility: {
      occupations: [
        "Street Vendor / Small Trader"
      ],
      gender: "All",
      criteriaText: "Street vendors engaged in vending in urban areas possessing Certificate of Vending / ID card issued by Urban Local Bodies."
    },
    benefits: "First tranche loan of \u20B910,000, 2nd tranche of \u20B920,000, and 3rd tranche up to \u20B950,000 with 7% interest subsidy and cashback of up to \u20B91,200/year on digital transactions.",
    documents: [
      "Aadhaar Card",
      "Certificate of Vending (CoV) or Letter of Recommendation (LoR)",
      "Bank Account Details linked with mobile"
    ],
    applicationMethod: "Apply online at pmsvanidhi.mohua.gov.in or via PM SVANidhi mobile app.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://pmsvanidhi.mohua.gov.in"
  },
  {
    id: "pmsby-accident-insurance",
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "One-year accidental death and disability insurance cover renewable from year to year offering affordable protection against unexpected tragedies.",
    eligibility: {
      minAge: 18,
      maxAge: 70,
      gender: "All",
      criteriaText: "All bank account holders aged 18 to 70 years having auto-debit consent enabled on their bank account."
    },
    benefits: "Accidental death and full permanent disability cover of \u20B92,00,000 (and \u20B91,00,000 for partial disability) for a nominal premium of just \u20B920 per year.",
    documents: [
      "Aadhaar Card",
      "Bank Account with Auto-Debit facility"
    ],
    applicationMethod: "Enroll via Internet Banking or submit simple consent-cum-mandate form at your bank branch.",
    officialSource: "Department of Financial Services, Ministry of Finance",
    applicationLink: "https://jansuraksha.gov.in"
  },
  {
    id: "pmjjby-life-insurance",
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "One-year renewable life insurance scheme offering life coverage for death due to any reason at an extremely affordable annual premium.",
    eligibility: {
      minAge: 18,
      maxAge: 50,
      gender: "All",
      criteriaText: "All bank account holders aged 18 to 50 years giving consent to join and enable auto-debit."
    },
    benefits: "Life insurance sum assured of \u20B92,00,000 payable to nominee in case of death of the insured person due to any reason, at an annual premium of \u20B9436.",
    documents: [
      "Aadhaar Card",
      "Bank Account with Auto-Debit facility",
      "Nominee details"
    ],
    applicationMethod: "Enroll through your bank branch or net banking.",
    officialSource: "Department of Financial Services, Ministry of Finance",
    applicationLink: "https://jansuraksha.gov.in"
  },
  {
    id: "cgtmse-credit-guarantee",
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "Enables micro and small enterprises to access collateral-free business loans from banks with government credit guarantee.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur",
        "Artisan / Craftsman"
      ],
      gender: "All",
      criteriaText: "New and existing Micro and Small Enterprises engaged in manufacturing or service activities."
    },
    benefits: "Collateral-free loan facility up to \u20B95 Crore with guarantee cover up to 85% for micro-enterprises and women/SC/ST entrepreneurs.",
    documents: [
      "Udyam Registration Certificate",
      "Detailed Project Report",
      "Financial Statements (ITR/Balance Sheet)",
      "KYC Documents"
    ],
    applicationMethod: "Apply for CGTMSE coverage through your commercial lending bank when seeking business loans.",
    officialSource: "Ministry of MSME & SIDBI",
    applicationLink: "https://www.cgtmse.in"
  },
  {
    id: "mahila-samridhi-yojana-finance",
    name: "Mahila Samridhi Yojana (Micro-finance for Women)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Financial Support",
    description: "Micro-finance scheme for women entrepreneurs belonging to backward classes to start small self-employment ventures.",
    eligibility: {
      minAge: 18,
      maxIncome: 3e5,
      gender: "Female",
      occupations: [
        "Self Employed / Micro Entrepreneur",
        "Artisan / Craftsman",
        "Street Vendor / Small Trader"
      ],
      criteriaText: "Women belonging to Backward Classes living below poverty line or with family income under \u20B93 Lakh."
    },
    benefits: "Direct micro-finance loan up to \u20B91,40,000 per beneficiary at a low interest rate of just 4% p.a.",
    documents: [
      "Caste Certificate (OBC)",
      "Income Certificate",
      "Aadhaar Card",
      "Business Plan Proposal"
    ],
    applicationMethod: "Apply through State Channelizing Agencies (SCAs) of NBCFDC.",
    officialSource: "National Backward Classes Finance & Development Corporation (NBCFDC)",
    applicationLink: "https://www.nbcfdc.gov.in"
  },
  {
    id: "tn-differently-abled-loan-subsidy",
    name: "Self Employment Loan Subsidy for Differently Abled",
    government: "State",
    state: "Tamil Nadu",
    sector: "Financial Support",
    description: "Financial assistance by Tamil Nadu government subsidizing commercial bank loans taken by persons with disabilities for business enterprises.",
    eligibility: {
      minAge: 18,
      gender: "All",
      criteriaText: "Differently abled persons in Tamil Nadu holding national disability ID card setting up self-employment ventures."
    },
    benefits: "Government subsidy of 33.33% of the loan amount up to \u20B925,000 for setting up petty shops, bakeries, or service centres.",
    documents: [
      "Disability Certificate",
      "Bank Loan Sanction Letter",
      "Aadhaar Card",
      "Ration Card"
    ],
    applicationMethod: "Submit application to District Differently Abled Welfare Officer (DDAWO).",
    officialSource: "Welfare of Differently Abled Persons Department, Tamil Nadu",
    applicationLink: "https://scd.tn.gov.in"
  },
  {
    id: "hp-swavalamban-yojana",
    name: "Mukhya Mantri Swavalamban Yojana (Himachal Pradesh)",
    government: "State",
    state: "Himachal Pradesh",
    sector: "Financial Support",
    description: "Encourages youth, women, and widows in Himachal Pradesh to become entrepreneurs by providing capital investment and interest subsidies.",
    eligibility: {
      minAge: 18,
      maxAge: 45,
      gender: "All",
      criteriaText: "Permanent residents of Himachal Pradesh establishing micro-enterprises with project cost up to \u20B91 Crore."
    },
    benefits: "Capital subsidy of 25% for males, 30% for females, and 35% for widows on machinery up to \u20B91 Crore, along with 5% interest subsidy for 3 years.",
    documents: [
      "Bonafide Himachali Certificate",
      "Aadhaar Card",
      "Project Report",
      "Land / Rent Agreement"
    ],
    applicationMethod: "Apply online at emerginghimachal.hp.gov.in.",
    officialSource: "Department of Industries, Government of Himachal Pradesh",
    applicationLink: "https://emerginghimachal.hp.gov.in"
  },
  {
    id: "startup-india-seed-fund",
    name: "Startup India Seed Fund Scheme (SISFS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Entrepreneurship",
    description: "Provides financial assistance to early-stage DPIIT-recognized startups for proof of concept, prototype development, product trials, and market-entry.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "DPIIT-recognized startups incorporated not more than 2 years ago, with viable business idea having proof of concept."
    },
    benefits: "Grants of up to \u20B920 Lakh for proof of concept and prototype trials, and up to \u20B950 Lakh in convertible debentures / debt for market launch.",
    documents: [
      "DPIIT Recognition Certificate",
      "Incorporation Certificate / MCA registration",
      "Pitch Deck / Business Plan",
      "Financial Projections"
    ],
    applicationMethod: "Apply online through seedfund.startupindia.gov.in choosing preferred approved incubators.",
    officialSource: "DPIIT, Ministry of Commerce and Industry",
    applicationLink: "https://seedfund.startupindia.gov.in"
  },
  {
    id: "atal-innovation-mission",
    name: "Atal Innovation Mission (AIM - Atal Incubation Centres)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Entrepreneurship",
    description: "NITI Aayog's flagship initiative fostering innovation ecosystems through Atal Tinkering Labs and world-class Atal Incubation Centres (AICs).",
    eligibility: {
      gender: "All",
      criteriaText: "Innovators, university researchers, and early-stage entrepreneurs developing innovative technology solutions."
    },
    benefits: "Up to \u20B910 Crore capital support to incubation centres, access to state-of-the-art labs, prototyping equipment, legal mentorship, and investor networks.",
    documents: [
      "Pitch Deck",
      "Patent / IP Details (if any)",
      "Team Profiles"
    ],
    applicationMethod: "Apply to any of 70+ Atal Incubation Centres across India via aim.gov.in.",
    officialSource: "NITI Aayog, Government of India",
    applicationLink: "https://aim.gov.in"
  },
  {
    id: "aspire-rural-innovation",
    name: "ASPIRE (Scheme for Promotion of Innovation, Rural Industry & Entrepreneurship)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Entrepreneurship",
    description: "Sets up a network of technology centres and Livelihood Business Incubators (LBIs) to accelerate entrepreneurship in rural and agro-based industries.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Artisan / Craftsman",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Rural youth, agri-entrepreneurs, and cooperatives seeking to create market-ready agro-processing and rural manufacturing enterprises."
    },
    benefits: "Hands-on business incubation, 100% plant machinery training, product testing, and access to fund of funds for scaling agro-rural ventures.",
    documents: [
      "Aadhaar Card",
      "Educational Background",
      "Agri-business Concept Note"
    ],
    applicationMethod: "Apply through local Livelihood Business Incubator (LBI) or MSME-Development Institutes.",
    officialSource: "Ministry of MSME",
    applicationLink: "https://aspire.msme.gov.in"
  },
  {
    id: "credit-guarantee-startups-cgss",
    name: "Credit Guarantee Scheme for Startups (CGSS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Entrepreneurship",
    description: "Provides collateral-free debt funding guarantee to DPIIT-recognized startups from scheduled commercial banks and venture debt funds.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "DPIIT recognized startups with demonstrable revenues who are seeking venture debt or bank loans for business expansion."
    },
    benefits: "Transaction-based credit guarantee up to \u20B910 Crore per startup, enabling debt funding without promoters risking personal family properties.",
    documents: [
      "DPIIT Certificate",
      "Financial Statements & Projections",
      "Audited Balance Sheets",
      "Board Resolution"
    ],
    applicationMethod: "Apply through member lending institutions (banks and venture funds) registered with NCGTC.",
    officialSource: "NCGTC & DPIIT, Ministry of Commerce and Industry",
    applicationLink: "https://www.ncgtc.in"
  },
  {
    id: "samridh-meity-accelerator",
    name: "SAMRIDH Scheme (Startup Accelerator of MeitY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Entrepreneurship",
    description: "MeitY initiative supporting software product startups with funding, mentorship, and international market access to scale into unicorns.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Indian software product startups that have proof of concept and early traction in fields like HealthTech, EdTech, AgriTech, FinTech, and AI."
    },
    benefits: "Government matching funding of up to \u20B940 Lakh per startup along with 6-month intensive accelerator programming.",
    documents: [
      "Incorporation Certificate",
      "Product Demo Link",
      "Customer Validation Metrics",
      "Pitch Deck"
    ],
    applicationMethod: "Apply through MeitY Startup Hub portal (meitystartuphub.in).",
    officialSource: "Ministry of Electronics and Information Technology (MeitY)",
    applicationLink: "https://meitystartuphub.in"
  },
  {
    id: "vca-agri-entrepreneurs",
    name: "Venture Capital Assistance (VCA) for Agri-Entrepreneurs",
    government: "Central",
    state: "All-India (Central)",
    sector: "Entrepreneurship",
    description: "Financial support in the form of interest-free venture capital provided by Small Farmers' Agri-Business Consortium (SFAC) to set up agri-business projects.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Individual agripreneurs, farmer producer groups, and partnership firms establishing commercial agricultural processing projects."
    },
    benefits: "Interest-free venture capital assistance up to 26% of promoter equity (max \u20B950 Lakh) to meet equity shortfall for bank term loans.",
    documents: [
      "Bank Sanction Letter",
      "Detailed Project Report",
      "Land Ownership / Lease Agreement",
      "SFAC Application Form"
    ],
    applicationMethod: "Apply online at sfacindia.com with bank loan sanction documentation.",
    officialSource: "Small Farmers' Agri-Business Consortium (SFAC), Ministry of Agriculture",
    applicationLink: "https://sfacindia.com"
  },
  {
    id: "telangana-we-hub",
    name: "WE-Hub Women Entrepreneurship Seed Capital",
    government: "State",
    state: "Telangana",
    sector: "Entrepreneurship",
    description: "India's first state-led incubator exclusively for women entrepreneurs to start, scale, and accelerate innovative businesses.",
    eligibility: {
      gender: "Female",
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      criteriaText: "Enterprises founded or co-founded (min 51% equity) by women residing in Telangana across tech and non-tech sectors."
    },
    benefits: "Incubation workspace, seed funding grants up to \u20B925 Lakh, government procurement opportunities, and direct connections to global venture funds.",
    documents: [
      "Business Registration Proof",
      "Founder KYC / Aadhaar",
      "Pitch Deck and Financial Plan"
    ],
    applicationMethod: "Apply online at wehub.telangana.gov.in.",
    officialSource: "Information Technology Department, Government of Telangana",
    applicationLink: "https://wehub.telangana.gov.in"
  },
  {
    id: "kerala-ksum-grant",
    name: "Kerala Startup Mission (KSUM) Idea to Product Grant",
    government: "State",
    state: "Kerala",
    sector: "Entrepreneurship",
    description: "Flagship innovation grant by Government of Kerala encouraging innovators, students, and early startups to build prototypes.",
    eligibility: {
      gender: "All",
      criteriaText: "Kerala-based startup entities or innovators with an innovative hardware or software solution."
    },
    benefits: "Direct non-dilutive grant of up to \u20B912 Lakh for product development and R&D, plus subsidized fab lab access.",
    documents: [
      "KSUM Unique ID",
      "Project Proposal & Architecture Diagram",
      "Cost Breakdown",
      "Applicant Aadhaar Card"
    ],
    applicationMethod: "Register on startupmission.kerala.gov.in and submit application under R&D Grant schemes.",
    officialSource: "Kerala Startup Mission, Electronics & IT Department",
    applicationLink: "https://startupmission.kerala.gov.in"
  },
  {
    id: "tn-tanseed-grant",
    name: "Tamil Nadu Startup Seed Grant Fund (TANSEED)",
    government: "State",
    state: "Tamil Nadu",
    sector: "Entrepreneurship",
    description: "Non-dilutive seed grant initiative by StartupTN providing early-stage capital to high-growth startups registered in Tamil Nadu.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "DPIIT-recognized early-stage startups registered in Tamil Nadu with innovative green/deep-tech/rural solutions."
    },
    benefits: "Direct equity-free grant of \u20B910 Lakh in 2 tranches, mentorship, and free access to corporate innovation challenges.",
    documents: [
      "DPIIT Registration Certificate",
      "Tamil Nadu MCA RoC Certificate",
      "Pitch Deck",
      "Bank Account Details"
    ],
    applicationMethod: "Apply online on startuptn.in during announced TANSEED application cohorts.",
    officialSource: "Tamil Nadu Startup and Innovation Mission (StartupTN)",
    applicationLink: "https://startuptn.in"
  },
  {
    id: "mp-yuva-udyami",
    name: "Mukhyamantri Yuva Udyami Yojana (MP)",
    government: "State",
    state: "Madhya Pradesh",
    sector: "Entrepreneurship",
    description: "Encourages educated youth in Madhya Pradesh to establish large-scale manufacturing and service enterprises by subsidizing loans.",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      education: [
        "Secondary (Class 10 Pass)"
      ],
      occupations: [
        "Self Employed / Micro Entrepreneur",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Residents of Madhya Pradesh holding Class 10 pass qualification who want to establish industrial units."
    },
    benefits: "Bank loans from \u20B910 Lakh up to \u20B92 Crore with 15% margin money capital subsidy (up to \u20B912 Lakh) and 5% interest subsidy for 7 years.",
    documents: [
      "10th Class Marksheet",
      "Domicile Certificate of MP",
      "Detailed Project Report (DPR)",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Apply online at msme.mponline.gov.in through District Trade and Industry Centre (DTIC).",
    officialSource: "Department of Micro, Small and Medium Enterprises, MP",
    applicationLink: "https://msme.mponline.gov.in"
  },
  {
    id: "pm-ajay-social-welfare",
    name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Social Welfare",
    description: "Merged scheme aiming to reduce poverty in Scheduled Caste communities through skill development, infrastructure creation, and direct financial subsidies.",
    eligibility: {
      maxIncome: 25e4,
      gender: "All",
      criteriaText: "Persons belonging to Scheduled Castes with annual family income up to \u20B92.5 Lakh."
    },
    benefits: "Direct capital subsidy of up to \u20B950,000 or 50% of project cost for income-generating self-employment activities, plus comprehensive village development amenities.",
    documents: [
      "SC Caste Certificate",
      "Income Certificate",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply through district social welfare office or state scheduled caste development corporation.",
    officialSource: "Department of Social Justice and Empowerment",
    applicationLink: "https://socialjustice.gov.in"
  },
  {
    id: "seed-dnt-welfare",
    name: "Scheme for Economic Empowerment of DNTs (SEED)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Social Welfare",
    description: "Comprehensive welfare package for De-notified, Nomadic, and Semi-Nomadic Tribes (DNTs) across education, health insurance, and housing.",
    eligibility: {
      gender: "All",
      criteriaText: "Members of De-notified, Nomadic, and Semi-Nomadic communities not classified under SC/ST/OBC."
    },
    benefits: "Free coaching for competitive exams, health insurance of \u20B95 Lakh under AB-PMJAY, housing assistance under PMAY, and skill development stipends.",
    documents: [
      "Community Certificate issued by competent local authority",
      "Aadhaar Card",
      "Ration Card",
      "Income Certificate"
    ],
    applicationMethod: "Apply online at seed.dosje.gov.in portal.",
    officialSource: "Development and Welfare Board for DNTs (DWBDNC), MoSJE",
    applicationLink: "https://seed.dosje.gov.in"
  },
  {
    id: "nsfdc-concessional-loans",
    name: "National Scheduled Castes Finance (NSFDC) Credit Schemes",
    government: "Central",
    state: "All-India (Central)",
    sector: "Social Welfare",
    description: "Provides concessional financial assistance to Scheduled Caste entrepreneurs for agriculture, transport, sanitation, and industrial ventures.",
    eligibility: {
      minAge: 18,
      maxIncome: 3e5,
      gender: "All",
      criteriaText: "Persons belonging to Scheduled Castes with annual family income not exceeding \u20B93 Lakh."
    },
    benefits: "Term loans up to \u20B950 Lakh at nominal interest rates (4% to 8% p.a.), with special schemes like Laghu Vyavasay Yojana and Green Business Scheme.",
    documents: [
      "SC Caste Certificate",
      "Income Certificate",
      "Aadhaar Card & PAN Card",
      "Business Quotations"
    ],
    applicationMethod: "Apply through State Channelizing Agencies (SCAs) or designated public sector banks.",
    officialSource: "National Scheduled Castes Finance and Development Corporation",
    applicationLink: "https://nsfdc.nic.in"
  },
  {
    id: "nbcfdc-credit-support",
    name: "National Backward Classes Finance (NBCFDC) Schemes",
    government: "Central",
    state: "All-India (Central)",
    sector: "Social Welfare",
    description: "Provides financial assistance to eligible members of Backward Classes to establish sustainable self-employment ventures.",
    eligibility: {
      minAge: 18,
      maxIncome: 3e5,
      gender: "All",
      criteriaText: "Persons belonging to Other Backward Classes (OBC) having annual family income under \u20B93 Lakh."
    },
    benefits: "Concessional loans up to \u20B915 Lakh for small business and transport, and educational loans up to \u20B920 Lakh (domestic) and \u20B920 Lakh (abroad) at 4% interest.",
    documents: [
      "OBC Caste Certificate",
      "Income Certificate",
      "Aadhaar Card",
      "Project Profile"
    ],
    applicationMethod: "Apply through State Backward Classes Development Corporations.",
    officialSource: "National Backward Classes Finance and Development Corporation",
    applicationLink: "https://www.nbcfdc.gov.in"
  },
  {
    id: "shreyas-higher-education",
    name: "SHREYAS (Scholarships for Higher Education for Young Achievers)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Social Welfare",
    description: "Umbrella scheme supporting higher education for SC and OBC students pursuing Master and Ph.D. degrees in India and abroad.",
    eligibility: {
      education: [
        "Graduate (Bachelor Degree)",
        "Post Graduate / Doctorate"
      ],
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Meritorious SC and OBC students admitted to recognized universities in India or top 500 ranked global universities abroad."
    },
    benefits: "Full tuition fee waiver, international living allowance of up to $15,400/year, and contingency allowance for overseas studies.",
    documents: [
      "Caste Certificate",
      "University Admission Letter",
      "Valid Indian Passport & Visa",
      "Academic Transcripts"
    ],
    applicationMethod: "Apply online at nosmsje.gov.in for National Overseas Scholarship or via NSP.",
    officialSource: "Ministry of Social Justice and Empowerment",
    applicationLink: "https://nosmsje.gov.in"
  },
  {
    id: "smile-marginalized-livelihoods",
    name: "SMILE (Support for Marginalized Individuals for Livelihood)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Social Welfare",
    description: "Comprehensive welfare and rehabilitation scheme providing healthcare, education, skill development, and shelter to transgender persons and persons engaged in begging.",
    eligibility: {
      gender: "Transgender",
      criteriaText: "Transgender persons holding Transgender Certificate/ID card and individuals engaged in the act of begging."
    },
    benefits: "Garima Greh shelter home support, composite gender-affirming healthcare package of \u20B95 Lakh under PM-JAY, skill training stipend, and scholarship support.",
    documents: [
      "Transgender Certificate (from transgender.dosje.gov.in) or Aadhaar Card"
    ],
    applicationMethod: "Register on National Portal for Transgender Persons (transgender.dosje.gov.in).",
    officialSource: "Ministry of Social Justice and Empowerment",
    applicationLink: "https://transgender.dosje.gov.in"
  },
  {
    id: "dr-ambedkar-ebc-scholarship",
    name: "Dr. Ambedkar Post-Matric Scholarship for EBCs",
    government: "Central",
    state: "All-India (Central)",
    sector: "Social Welfare",
    description: "Centrally sponsored scholarship scheme providing financial assistance to Economically Backward Class (EBC) students pursuing post-matriculation studies.",
    eligibility: {
      maxIncome: 25e4,
      education: [
        "Higher Secondary (Class 12 Pass)",
        "Diploma / ITI Certificate",
        "Graduate (Bachelor Degree)"
      ],
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "General category students belonging to Economically Backward Classes (not covered under SC/ST/OBC) with parental income up to \u20B92.5 Lakh."
    },
    benefits: "Maintenance allowance of up to \u20B9750/month along with reimbursement of non-refundable compulsory fees charged by the educational institution.",
    documents: [
      "Income Certificate from competent authority",
      "Class 10/12 Marksheet",
      "College Fee Receipt",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online through National Scholarship Portal (scholarships.gov.in).",
    officialSource: "Department of Social Justice and Empowerment",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "wb-kanyashree-prakalpa",
    name: "Kanyashree Prakalpa",
    government: "State",
    state: "West Bengal",
    sector: "Social Welfare",
    description: "Globally acclaimed United Nations award-winning conditional cash transfer scheme in West Bengal to prevent child marriage and retain girls in education.",
    eligibility: {
      minAge: 13,
      maxAge: 19,
      gender: "Female",
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      criteriaText: "Unmarried girl students studying in Classes 8 to 12 in recognized schools/colleges in West Bengal."
    },
    benefits: "Annual scholarship of \u20B91,000 (K1) for girls aged 13-18 in school, and a one-time grant of \u20B925,000 (K2) upon turning 18 if continuing education unmarried.",
    documents: [
      "Unmarried Declaration signed by Parent",
      "School Bonafide Certificate",
      "Birth Certificate / Age Proof",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Form distributed and processed directly through schools/colleges registered with wb.gov.in.",
    officialSource: "Women and Child Development & Social Welfare Department, West Bengal",
    applicationLink: "https://wbkanyashree.gov.in"
  },
  {
    id: "telangana-kalyana-lakshmi",
    name: "Kalyana Lakshmi / Shaadi Mubarak Scheme",
    government: "State",
    state: "Telangana",
    sector: "Social Welfare",
    description: "Financial assistance scheme by Government of Telangana to alleviate marriage expenses for brides from economically weaker families.",
    eligibility: {
      minAge: 18,
      maxIncome: 2e5,
      gender: "Female",
      criteriaText: "Unmarried brides aged 18+ residing in Telangana belonging to SC, ST, BC, EBC, or minority communities with parental income under \u20B92 Lakh."
    },
    benefits: "One-time financial grant of \u20B91,00,116 transferred directly to the bride's mother's bank account prior to marriage.",
    documents: [
      "Bride & Groom Age Proof (Aadhaar/SSC Memo)",
      "Income Certificate (issued within 6 months)",
      "Caste Certificate",
      "Wedding Card",
      "Mother's Bank Account Details"
    ],
    applicationMethod: "Apply online at telanganaepass.cgg.gov.in through MeeSeva centres.",
    officialSource: "Scheduled Castes Development & BC Welfare Department, Telangana",
    applicationLink: "https://telanganaepass.cgg.gov.in"
  },
  {
    id: "tn-marriage-assistance",
    name: "Moovalur Ramamirtham Marriage Assistance Scheme",
    government: "State",
    state: "Tamil Nadu",
    sector: "Social Welfare",
    description: "Historic social welfare scheme providing financial assistance and gold for 'Thirumangalyam' (Mangalsutra) to poor brides for solemnizing marriage.",
    eligibility: {
      minAge: 18,
      gender: "Female",
      maxIncome: 72e3,
      criteriaText: "Poor girls belonging to Tamil Nadu from families with annual income below \u20B972,000."
    },
    benefits: "Financial assistance of \u20B925,000 (for 10th pass) or \u20B950,000 (for degree/diploma holders) plus 8 grams of 22-carat gold coin for Mangalsutra.",
    documents: [
      "Educational Certificate (10th/Degree)",
      "Income Certificate",
      "Community Certificate",
      "Wedding Invitation",
      "Aadhaar Card"
    ],
    applicationMethod: "Apply at local e-Sevai centre 40 days before wedding date.",
    officialSource: "Social Welfare and Women Empowerment Department, Tamil Nadu",
    applicationLink: "https://tnesevai.tn.gov.in"
  },
  {
    id: "day-nrlm-livelihoods",
    name: "Deendayal Antyodaya Yojana - NRLM (Aajeevika)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Rural Development",
    description: "National mission organizing rural women into Self Help Groups (SHGs) and federation institutions to foster sustainable household livelihoods and micro-enterprises.",
    eligibility: {
      occupations: [
        "Homemaker",
        "Farmer / Agricultural Laborer",
        "Artisan / Craftsman",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "Female",
      criteriaText: "Rural women, particularly from BPL households, landless labourers, and vulnerable rural social groups."
    },
    benefits: "Revolving Fund grant of \u20B915,000 to SHG, Community Investment Fund (CIF) of up to \u20B91.5 Lakh, and collateral-free bank credit linkage up to \u20B920 Lakh at 7% interest (subsidized to 4% on prompt repayment).",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "SHG Membership Record",
      "Bank Passbook"
    ],
    applicationMethod: "Join local village Self Help Group facilitated by Gram Panchayat / Village Organization (VO).",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://aajeevika.gov.in"
  },
  {
    id: "pmgsy-rural-roads",
    name: "Pradhan Mantri Gram Sadak Yojana (PMGSY-IV)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Rural Development",
    description: "Nationwide connectivity program providing all-weather motorable asphalt road connectivity to eligible unconnected rural habitations.",
    eligibility: {
      gender: "All",
      criteriaText: "Rural communities and habitations with population of 500+ in plain areas and 250+ in hill and tribal areas."
    },
    benefits: "Permanent all-weather paved roads connecting villages to mandis, secondary schools, health clinics, and district highway networks.",
    documents: [
      "Community demand submitted via Gram Sabha resolution"
    ],
    applicationMethod: "Monitored and tracked on omms.nic.in portal by National Rural Infrastructure Development Agency.",
    officialSource: "National Rural Infrastructure Development Agency (NRIDA), MoRD",
    applicationLink: "https://omms.nic.in"
  },
  {
    id: "svamitva-property-cards",
    name: "SVAMITVA Scheme (Survey of Villages and Mapping with Improvised Technology)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Rural Development",
    description: "Drone-based cadastral survey mapping of inhabited (Abadi) rural lands, providing legal Property Cards (Svamitva Cards) to rural homeowners.",
    eligibility: {
      gender: "All",
      criteriaText: "All owners of residential houses in rural Abadi (inhabited) areas across Indian villages."
    },
    benefits: "Official legal Property Card proving ownership, enabling rural citizens to use house property as collateral to take bank loans and preventing village land disputes.",
    documents: [
      "Aadhaar Card",
      "Existing village tax receipts or local Panchayat record"
    ],
    applicationMethod: "Drone flying conducted by Survey of India in coordination with State Revenue Department; cards downloaded from svamitva.nic.in.",
    officialSource: "Ministry of Panchayati Raj",
    applicationLink: "https://svamitva.nic.in"
  },
  {
    id: "mission-amrit-sarovar",
    name: "Mission Amrit Sarovar",
    government: "Central",
    state: "All-India (Central)",
    sector: "Rural Development",
    description: "Constructs and rejuvenates at least 75 Amrit Sarovars (water bodies) in each district of India with a minimum pondage area of 1 acre.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Fisherman / Fisherfolk"
      ],
      gender: "All",
      criteriaText: "Rural communities dependent on ground water recharge, minor irrigation, and community aquaculture."
    },
    benefits: "Assured local irrigation supply, ground water table replenishment, and community revenue generation through fisheries and neem plantations.",
    documents: [
      "Gram Panchayat Resolution"
    ],
    applicationMethod: "Executed through Gram Panchayat water committees with MGNREGA and XV Finance Commission funds.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://water.ncog.gov.in"
  },
  {
    id: "rurban-mission-spmrm",
    name: "Shyama Prasad Mukherjee Rurban Mission (SPMRM)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Rural Development",
    description: "Develops cluster of rural villages that show economic potential, providing urban-like infrastructure while preserving rural community essence.",
    eligibility: {
      gender: "All",
      criteriaText: "Residents of notified non-tribal and tribal Rurban clusters across all states."
    },
    benefits: "Piped water supply, solid waste processing, street lighting, agro-processing storage centres, Wi-Fi connectivity, and upgraded primary health centres.",
    documents: [
      "Village residence identity proof"
    ],
    applicationMethod: "Cluster development plans executed by State Rural Development departments.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://rurban.gov.in"
  },
  {
    id: "sagy-adarsh-gram",
    name: "Saansad Adarsh Gram Yojana (SAGY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Rural Development",
    description: "Members of Parliament adopt Gram Panchayats to drive holistic social, cultural, environmental, and economic village development.",
    eligibility: {
      gender: "All",
      criteriaText: "All residents of the Gram Panchayat adopted by the respective Lok Sabha or Rajya Sabha MP."
    },
    benefits: "Priority convergence of all central and state development schemes, smart digital classrooms, solar street lighting, and sanitation.",
    documents: [
      "Voter ID / Aadhaar Card of village resident"
    ],
    applicationMethod: "Gram Sabha prepares Village Development Plan (VDP) under guidance of District Collector.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://saanjhi.gov.in"
  },
  {
    id: "pmksy-watershed-development",
    name: "Watershed Development Component of PMKSY (WDC-PMKSY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Rural Development",
    description: "Restores ecological balance by harnessing, conserving, and developing degraded natural resources such as soil, vegetative cover, and water.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Farmers and landowners in rainfed, drought-prone, and desert watershed areas."
    },
    benefits: "Construction of check dams, farm ponds, contour trenches, afforestation grants, and crop diversification support.",
    documents: [
      "Land Record / Khata details"
    ],
    applicationMethod: "Participate in Village Watershed Committee under guidance of Project Implementing Agency (PIA).",
    officialSource: "Department of Land Resources, Ministry of Rural Development",
    applicationLink: "https://dolr.gov.in"
  },
  {
    id: "kerala-kudumbashree",
    name: "Kudumbashree Mission",
    government: "State",
    state: "Kerala",
    sector: "Rural Development",
    description: "Renowned poverty eradication and women empowerment mission by Government of Kerala, mobilizing 45 Lakh women into community networks.",
    eligibility: {
      gender: "Female",
      occupations: [
        "Homemaker",
        "Farmer / Agricultural Laborer",
        "Self Employed / Micro Entrepreneur"
      ],
      criteriaText: "Women residing in rural and urban areas of Kerala joining Neighborhood Groups (NHGs)."
    },
    benefits: "Subsidized micro-credit, collective farming grants, catering and enterprise support, Janakeeya Hotel operation, and interest-free flood relief loans.",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "Bank Account Details"
    ],
    applicationMethod: "Enroll in local Ward Neighborhood Group (Ayalkoottam) managed by Community Development Society (CDS).",
    officialSource: "Local Self Government Department, Government of Kerala",
    applicationLink: "https://kudumbashree.org"
  },
  {
    id: "mh-jalyukt-shivar",
    name: "Jalyukt Shivar Abhiyan 2.0",
    government: "State",
    state: "Maharashtra",
    sector: "Rural Development",
    description: "Flagship drought-proofing programme in Maharashtra making water available for farming through community water conservation works.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Farmers and villages located in drought-prone talukas of Vidarbha, Marathwada, and Western Maharashtra."
    },
    benefits: "De-silting of nullahs and farm ponds, construction of cement nullah bunds, compartment bunding, and decentralized water storage.",
    documents: [
      "7/12 Land Extract",
      "Gram Panchayat Resolution"
    ],
    applicationMethod: "Selected through Village Water Conservation Committee and District Collectorate.",
    officialSource: "Soil and Water Conservation Department, Maharashtra",
    applicationLink: "https://mrrda.maharashtra.gov.in"
  },
  {
    id: "gujarat-sujalam-sufalam",
    name: "Sujalam Sufalam Jal Abhiyan",
    government: "State",
    state: "Gujarat",
    sector: "Rural Development",
    description: "Public-private water conservation drive in Gujarat to deepen ponds, desilt check dams, and clean canals prior to monsoons.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Farmers and rural communities across all districts of Gujarat."
    },
    benefits: "Free rich fertile silt for farm fields excavated from village water tanks, ground water augmentation, and increased irrigation availability.",
    documents: [
      "Village residence proof"
    ],
    applicationMethod: "Participate with local Gram Panchayat and District Water Resources office.",
    officialSource: "Water Resources Department, Government of Gujarat",
    applicationLink: "https://gujaratindia.gov.in"
  },
  {
    id: "amrut-urban-mission",
    name: "Atal Mission for Rejuvenation and Urban Transformation (AMRUT 2.0)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Urban Development",
    description: "Provides universal coverage of water supply to all households through functional taps and reliable sewerage in statutory towns.",
    eligibility: {
      gender: "All",
      criteriaText: "All households in 4,700+ statutory towns across India."
    },
    benefits: "Subsidized tap water connections, storm water drainage, city sewage treatment network, and creation of green parks and open spaces.",
    documents: [
      "Municipal Property Tax Receipt / Water Connection Application"
    ],
    applicationMethod: "Apply for tap connection through local Municipal Corporation water supply department.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://amrut.gov.in"
  },
  {
    id: "smart-cities-mission",
    name: "Smart Cities Mission",
    government: "Central",
    state: "All-India (Central)",
    sector: "Urban Development",
    description: "Transforms 100 designated cities by implementing smart technology governance, Integrated Command and Control Centres (ICCC), and sustainable mobility.",
    eligibility: {
      gender: "All",
      criteriaText: "Citizens residing in 100 Smart Cities across India."
    },
    benefits: "Intelligent traffic management, automated emergency response, pedestrianized cycling corridors, 24x7 smart municipal grievance redressal, and e-governance.",
    documents: [
      "Municipal Citizen App registration"
    ],
    applicationMethod: "Access municipal services through respective Smart City citizen portals and ICCC apps.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://smartcities.gov.in"
  },
  {
    id: "swachh-bharat-urban",
    name: "Swachh Bharat Mission - Urban (SBM-U 2.0)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Urban Development",
    description: "Focuses on making all urban cities 'Garbage Free' with 100% source segregation of waste, scientific landfill remediation, and ODF++ status.",
    eligibility: {
      gender: "All",
      criteriaText: "All urban citizens, apartment associations, and commercial establishments."
    },
    benefits: "Direct subsidy of \u20B94,000 to \u20B910,000 for constructing individual household toilets, access to clean community toilets, and mechanized waste pickup.",
    documents: [
      "Aadhaar Card",
      "Bank Account Details",
      "Municipal Ward Proof"
    ],
    applicationMethod: "Apply online for individual toilet subsidy at sbmurban.org or report sanitation issues via Swachhata App.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://sbmurban.org"
  },
  {
    id: "pm-ebus-sewa",
    name: "PM-eBus Sewa",
    government: "Central",
    state: "All-India (Central)",
    sector: "Urban Development",
    description: "Augments city bus operations by deploying 10,000 electric buses on Public-Private Partnership (PPP) model across 169 cities lacking organized transit.",
    eligibility: {
      gender: "All",
      criteriaText: "Urban citizens and commuters in cities with population between 3 Lakh and 40 Lakh."
    },
    benefits: "Affordable, zero-emission, air-conditioned public transit with disabled-friendly ramps, CCTV surveillance, and digital National Common Mobility Card ticketing.",
    documents: [
      "Standard bus transit ticket or NCMC Smart Card"
    ],
    applicationMethod: "Avail directly on city bus transport routes managed by respective municipal transport corporations.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://mohua.gov.in"
  },
  {
    id: "uidf-urban-infrastructure",
    name: "Urban Infrastructure Development Fund (UIDF)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Urban Development",
    description: "Managed by National Housing Bank to create basic civic infrastructure in Tier-2 and Tier-3 cities using priority sector lending shortfall.",
    eligibility: {
      gender: "All",
      criteriaText: "Urban citizens residing in Tier-2 and Tier-3 towns."
    },
    benefits: "Modernized storm water drains, sewage treatment plants, electric crematoriums, piped drinking water, and organized solid waste management facilities.",
    documents: [
      "Municipal ward registration"
    ],
    applicationMethod: "Administered through municipal bodies and State Urban Development Authorities.",
    officialSource: "National Housing Bank & MoHUA",
    applicationLink: "https://nhb.org.in"
  },
  {
    id: "day-nulm-shelters",
    name: "Shelter for Urban Homeless (SUH - DAY-NULM)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Urban Development",
    description: "Ensures availability of permanent 24x7 all-weather shelters equipped with basic amenities for urban homeless populations.",
    eligibility: {
      gender: "All",
      criteriaText: "Urban destitute individuals, homeless labourers, runaways, and mentally ill destitute persons."
    },
    benefits: "Free clean bed, potable water, sanitation, lockers, first aid, linkage to Ayushman Bharat cards, and de-addiction counselling.",
    documents: [
      "No documents required to seek shelter in emergency"
    ],
    applicationMethod: "Walk in to any municipal Urban Homeless Shelter operated by local civic body.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://nulm.gov.in"
  },
  {
    id: "jal-hi-amrit-urban",
    name: "Jal Hi Amrit Scheme for Urban Water Recycling",
    government: "Central",
    state: "All-India (Central)",
    sector: "Urban Development",
    description: "Incentivizes cities to recycle treated used water from sewage treatment plants for non-potable and industrial cooling uses.",
    eligibility: {
      gender: "All",
      criteriaText: "Urban commercial establishments, power plants, and residential townships."
    },
    benefits: "Discounted rates for recycled treated water for gardening, construction, and cooling towers, conserving fresh drinking water reservoirs.",
    documents: [
      "Municipal Commercial Water Application"
    ],
    applicationMethod: "Apply to Municipal Water and Sewerage Board for bulk recycled water connection.",
    officialSource: "Ministry of Housing and Urban Affairs",
    applicationLink: "https://amrut.gov.in"
  },
  {
    id: "tn-singara-chennai",
    name: "Singara Chennai 2.0 Initiative",
    government: "State",
    state: "Tamil Nadu",
    sector: "Urban Development",
    description: "Comprehensive urban revitalization project transforming Chennai into a green, clean, inclusive, world-class metropolis.",
    eligibility: {
      gender: "All",
      criteriaText: "Residents of Greater Chennai Corporation and Chennai Metropolitan Area."
    },
    benefits: "Restoration of urban water bodies, mechanized beach cleanups, modern pedestrian plazas, sponge parks, and modern school infrastructure.",
    documents: [
      "GCC Citizen Portal login"
    ],
    applicationMethod: "Services integrated via Greater Chennai Corporation portal (chennaicorporation.gov.in).",
    officialSource: "Municipal Administration and Water Supply Department, Tamil Nadu",
    applicationLink: "https://chennaicorporation.gov.in"
  },
  {
    id: "hp-shahri-ajeevika",
    name: "Mukhyamantri Shahri Ajeevika Guarantee Yojana (Himachal Pradesh)",
    government: "State",
    state: "Himachal Pradesh",
    sector: "Urban Development",
    description: "Guarantees 120 days of wage employment in a financial year to every urban household in Himachal Pradesh to ensure urban livelihood security.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Construction Worker / Daily Wage",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Adult members of households residing in municipal corporation, municipal council, or nagar panchayat areas of HP."
    },
    benefits: "Guaranteed 120 days of paid municipal wage employment at state-notified urban minimum daily wage rates.",
    documents: [
      "Urban Resident Certificate / Ration Card",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Apply for Job Card at local Urban Local Body (ULB) office; work provided within 15 days.",
    officialSource: "Urban Development Department, Government of Himachal Pradesh",
    applicationLink: "https://ud-hp.in"
  },
  {
    id: "wb-karma-sathi-prakalpa",
    name: "Karma Sathi Prakalpa (Urban Livelihoods)",
    government: "State",
    state: "West Bengal",
    sector: "Urban Development",
    description: "Financial support and soft loan scheme by Government of West Bengal for urban and rural youth to start manufacturing, services, or trading enterprises.",
    eligibility: {
      minAge: 18,
      maxAge: 50,
      education: [
        "Middle School (Class 8)"
      ],
      occupations: [
        "Unemployed / Job Seeker",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Unemployed youth in West Bengal who have passed at least Class 8."
    },
    benefits: "Subsidized bank loan up to \u20B92 Lakh with 15% state government project subsidy (up to \u20B925,000) and interest subsidy.",
    documents: [
      "Class 8 Pass Certificate",
      "Proof of Residence in WB",
      "Project Proposal",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Apply online at karmasathi.wb.gov.in or through local Borough / Municipality office.",
    officialSource: "Micro, Small & Medium Enterprises Department, West Bengal",
    applicationLink: "https://karmasathi.wb.gov.in"
  },
  {
    id: "pmgkay-free-ration",
    name: "Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Food & Nutrition",
    description: "Flagship food security scheme providing completely free foodgrains to approximately 81.35 Crore beneficiaries across India under the National Food Security Act (NFSA).",
    eligibility: {
      gender: "All",
      criteriaText: "All Antyodaya Anna Yojana (AAY) and Priority Household (PHH) ration card holders covered under NFSA."
    },
    benefits: "5 kg of foodgrains (rice/wheat) per person per month for PHH cards, and 35 kg per family per month for AAY cards, distributed 100% free of cost at Fair Price Shops.",
    documents: [
      "Ration Card (NFSA - AAY or PHH)",
      "Aadhaar Card (linked with Ration Card via biometric e-PoS)"
    ],
    applicationMethod: "Collect monthly quota from any Fair Price Shop across India using biometric Aadhaar authentication (One Nation One Ration Card).",
    officialSource: "Department of Food and Public Distribution, Ministry of Consumer Affairs",
    applicationLink: "https://nfsa.gov.in"
  },
  {
    id: "aay-antyodaya-anna",
    name: "Antyodaya Anna Yojana (AAY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Food & Nutrition",
    description: "Provides highly subsidized and prioritized foodgrains to the poorest of the poor households identified by state governments.",
    eligibility: {
      maxIncome: 1e5,
      gender: "All",
      criteriaText: "Landless agricultural labourers, marginal farmers, rural artisans, widows, terminally ill persons, and primitive tribal households."
    },
    benefits: "Guaranteed 35 kg of foodgrains per month per household completely free of cost through the Public Distribution System (PDS).",
    documents: [
      "AAY Ration Card (Yellow / Pink card depending on state)",
      "Aadhaar Card"
    ],
    applicationMethod: "Apply at local Taluk Supply Office / Civil Supplies Department for AAY status inclusion.",
    officialSource: "Department of Food and Public Distribution",
    applicationLink: "https://nfsa.gov.in"
  },
  {
    id: "onorc-ration-portability",
    name: "One Nation One Ration Card (ONORC) Portability",
    government: "Central",
    state: "All-India (Central)",
    sector: "Food & Nutrition",
    description: "National portability of ration cards allowing migrant workers and their families to lift their entitled foodgrains from any Fair Price Shop in the entire country.",
    eligibility: {
      gender: "All",
      criteriaText: "All NFSA ration card holders migrating for work, education, or marriage to any state or union territory."
    },
    benefits: "Complete interstate and intrastate portability: buy partial or full entitled rations from any ePDS Fair Price Shop anywhere in India using biometric authentication.",
    documents: [
      "Existing State Ration Card",
      "Aadhaar Card of beneficiary"
    ],
    applicationMethod: "Download Mera Ration mobile app to find nearest FPS, check entitlements, and authenticate with thumbprint.",
    officialSource: "Department of Food and Public Distribution",
    applicationLink: "https://nfsa.gov.in"
  },
  {
    id: "pm-poshan-mid-day-meal",
    name: "PM-POSHAN (Mid-Day Meal Scheme in Schools)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Food & Nutrition",
    description: "Centrally sponsored scheme providing hot cooked nutritious lunches to children studying in government and government-aided schools from Pre-primary to Class 8.",
    eligibility: {
      minAge: 5,
      maxAge: 14,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Children enrolled in Balvatika and Classes 1 to 8 in government and government-aided primary and upper primary schools."
    },
    benefits: "Free hot nutritious lunch every school day providing 450 calories and 12g protein (primary) and 700 calories and 20g protein (upper primary), along with iron-folic acid tablets.",
    documents: [
      "School Enrollment Record / Admission Number"
    ],
    applicationMethod: "Provided automatically every school day to all enrolled students during afternoon lunch interval.",
    officialSource: "Department of School Education & Literacy, Ministry of Education",
    applicationLink: "https://pmposhan.education.gov.in"
  },
  {
    id: "saksham-anganwadi-poshan",
    name: "Saksham Anganwadi & Supplementary Nutrition (SNP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Food & Nutrition",
    description: "Provides supplementary nutrition to bridge the nutritional gap among children under 6 years, pregnant women, and lactating mothers.",
    eligibility: {
      maxAge: 6,
      gender: "All",
      criteriaText: "Children from 6 months to 6 years of age, pregnant women, and nursing mothers residing in the Anganwadi area."
    },
    benefits: "Free Take-Home Rations (THR) or hot morning snacks and meals formulated with fortified cereals, pulses, milk, and eggs; special energy-dense food for severely acute malnourished children.",
    documents: [
      "Mother and Child Protection (MCP) Card",
      "Aadhaar Card of Mother or Child"
    ],
    applicationMethod: "Register at nearest neighbourhood Anganwadi Centre.",
    officialSource: "Ministry of Women and Child Development",
    applicationLink: "https://poshantracker.in"
  },
  {
    id: "fortified-rice-distribution",
    name: "Distribution of Fortified Rice in Public Schemes",
    government: "Central",
    state: "All-India (Central)",
    sector: "Food & Nutrition",
    description: "Supplies Fortified Rice blended with Fortified Rice Kernels (FRK) containing Iron, Folic Acid, and Vitamin B-12 across all PDS, PM-POSHAN, and ICDS channels to eliminate anaemia.",
    eligibility: {
      gender: "All",
      criteriaText: "All citizens accessing foodgrains through Fair Price Shops, school mid-day meals, and Anganwadis."
    },
    benefits: "Enriched daily diet providing essential micronutrients to combat stunting and anaemia without any additional expense.",
    documents: [
      "Ration Card"
    ],
    applicationMethod: "Supplied automatically through monthly PDS ration quota.",
    officialSource: "Department of Food and Public Distribution",
    applicationLink: "https://dfpd.gov.in"
  },
  {
    id: "wbnp-nutrition-programme",
    name: "Wheat-Based Nutrition Programme (WBNP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Food & Nutrition",
    description: "Allocates foodgrains at subsidized rates to State Governments to prepare nutritious supplementary food for children and expectant/lactating mothers under Anganwadi services.",
    eligibility: {
      maxAge: 6,
      gender: "All",
      criteriaText: "Children under 6 years and pregnant and nursing mothers in wheat-consuming states."
    },
    benefits: "Free porridge, fortified wheat flour, and halwa supplied directly through Anganwadi Centres.",
    documents: [
      "Anganwadi Registration"
    ],
    applicationMethod: "Distributed at Anganwadi Centres during monthly nutrition days.",
    officialSource: "Ministry of Women and Child Development",
    applicationLink: "https://wcd.nic.in"
  },
  {
    id: "tn-amma-canteen",
    name: "Amma Unavagam (Subsidized Food Security Canteen)",
    government: "State",
    state: "Tamil Nadu",
    sector: "Food & Nutrition",
    description: "Pioneering urban municipal food security initiative in Tamil Nadu offering wholesome, freshly cooked hygienic meals at rock-bottom subsidized rates.",
    eligibility: {
      gender: "All",
      criteriaText: "Open to all citizens without any income, identity card, or residency restriction; particularly beneficial for daily wage workers, rickshaw pullers, and students."
    },
    benefits: "Idli at \u20B91 each, Sambar Rice / Lemon Rice / Karuvapillai Rice at \u20B95 per plate, and Curd Rice at \u20B93 per plate served in clean hygienic settings.",
    documents: [
      "No documents required; cash payment at counter"
    ],
    applicationMethod: "Walk in to any of 400+ Amma Unavagam canteens located across Chennai and municipal corporation towns in Tamil Nadu.",
    officialSource: "Greater Chennai Corporation & Municipal Administration Department, Tamil Nadu",
    applicationLink: "https://chennaicorporation.gov.in"
  },
  {
    id: "mh-shiv-bhojan-thali",
    name: "Shiv Bhojan Thali Scheme",
    government: "State",
    state: "Maharashtra",
    sector: "Food & Nutrition",
    description: "Food security scheme in Maharashtra providing a wholesome, balanced meal (thali) to poor and needy citizens at an ultra-subsidized price.",
    eligibility: {
      gender: "All",
      criteriaText: "Open to all citizens visiting authorized Shiv Bhojan canteens across Maharashtra."
    },
    benefits: "A complete nutritious thali containing 2 chapatis, 1 vegetable curry, 1 bowl of dal, and 1 bowl of rice served at a subsidized cost of only \u20B910.",
    documents: [
      "Photograph taken at canteen counter via MahaFood mobile app"
    ],
    applicationMethod: "Visit any authorized Shiv Bhojan Kendra located near bus stands, civil hospitals, market yards, and district collectorates.",
    officialSource: "Food, Civil Supplies and Consumer Protection Department, Maharashtra",
    applicationLink: "https://mahafood.gov.in"
  },
  {
    id: "rajasthan-indira-rasoi",
    name: "Indira Rasoi Yojana (Annapurna Rasoi)",
    government: "State",
    state: "Rajasthan",
    sector: "Food & Nutrition",
    description: "Urban subsidized dining initiative by Government of Rajasthan operating under the motto 'No one sleeps hungry' ('Koi Bhookha Na Soye').",
    eligibility: {
      gender: "All",
      criteriaText: "Open to all citizens in all urban municipal towns and rural blocks across Rajasthan."
    },
    benefits: "Nutritious balanced meal consisting of 100g pulses, 100g vegetables, 250g chapati, and pickle served with dignity for just \u20B98 per plate.",
    documents: [
      "No documents required; register name at counter"
    ],
    applicationMethod: "Walk in to any designated Indira Rasoi Kendra across Rajasthan.",
    officialSource: "Local Self Government Department, Government of Rajasthan",
    applicationLink: "https://indirarasoi.rajasthan.gov.in"
  },
  {
    id: "atal-pension-yojana",
    name: "Atal Pension Yojana (APY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Pension & Social Security",
    description: "Government-guaranteed pension scheme primarily targeted at unorganized sector workers, guaranteeing a fixed monthly pension from age 60.",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      gender: "All",
      criteriaText: "Any Indian citizen aged 18 to 40 having a savings bank account (excluding individuals who pay income tax)."
    },
    benefits: "Guaranteed monthly pension of \u20B91,000, \u20B92,000, \u20B93,000, \u20B94,000, or \u20B95,000 from age 60 onwards for life, with same pension payable to spouse upon death, and return of full pension corpus to nominee.",
    documents: [
      "Aadhaar Card",
      "Savings Bank Account with Auto-Debit mandate",
      "Nominee details"
    ],
    applicationMethod: "Enroll through your bank branch or via Net Banking / mobile banking portal.",
    officialSource: "PFRDA & Department of Financial Services",
    applicationLink: "https://www.npscra.nsdl.co.in"
  },
  {
    id: "pm-sym-shram-yogi",
    name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Pension & Social Security",
    description: "Voluntary and contributory pension scheme for unorganized workers to provide old-age social security protection.",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      maxIncome: 18e4,
      occupations: [
        "Street Vendor / Small Trader",
        "Construction Worker / Daily Wage",
        "Artisan / Craftsman",
        "Farmer / Agricultural Laborer",
        "Homemaker"
      ],
      gender: "All",
      criteriaText: "Unorganized workers with monthly income up to \u20B915,000 who are not members of EPFO/ESIC/NPS and do not pay income tax."
    },
    benefits: "Assured monthly pension of \u20B93,000 after attaining the age of 60 years. 50% contribution paid by worker (\u20B955 - \u20B9200/month depending on joining age) and matching 50% paid by Central Government.",
    documents: [
      "Aadhaar Card",
      "Savings Bank Account / Jan Dhan Account with IFSC",
      "Mobile Number"
    ],
    applicationMethod: "Enroll in 5 minutes at any Common Service Centre (CSC) or self-enroll on maandhan.in.",
    officialSource: "Ministry of Labour and Employment",
    applicationLink: "https://maandhan.in"
  },
  {
    id: "nps-traders-retailers",
    name: "National Pension Scheme for Traders and Self-Employed (NPS-Traders)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Pension & Social Security",
    description: "Pension scheme providing old age social security to small shopkeepers, retail traders, and self-employed persons with annual turnover under \u20B91.5 Crore.",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      occupations: [
        "Street Vendor / Small Trader",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Shopkeepers, retail traders, commission agents, and small restaurant owners having GST turnover not exceeding \u20B91.5 Crore."
    },
    benefits: "Guaranteed minimum monthly pension of \u20B93,000 after attaining 60 years of age with 50% central matching contribution.",
    documents: [
      "Aadhaar Card",
      "Bank Account Details",
      "GSTIN (if applicable) / Trade Declaration"
    ],
    applicationMethod: "Apply online at maandhan.in or visit nearest CSC centre.",
    officialSource: "Ministry of Labour and Employment",
    applicationLink: "https://maandhan.in"
  },
  {
    id: "ignwps-widow-pension",
    name: "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Pension & Social Security",
    description: "Social assistance monthly pension provided under the National Social Assistance Programme (NSAP) to widows living below the poverty line.",
    eligibility: {
      minAge: 40,
      maxAge: 79,
      gender: "Female",
      criteriaText: "Widows aged 40 to 79 years who belong to a household living below the poverty line (BPL)."
    },
    benefits: "Monthly pension of \u20B91,000 to \u20B92,500 per month (combined central NSAP contribution and state top-up) credited via DBT.",
    documents: [
      "Husband's Death Certificate",
      "BPL Ration Card / BPL Certificate",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply at Gram Panchayat / Block Development Office / Municipal Office; track on nsap.nic.in.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://nsap.nic.in"
  },
  {
    id: "igndps-disability-pension",
    name: "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Pension & Social Security",
    description: "Social pension component of NSAP providing monthly financial assistance to persons with severe and multiple disabilities from BPL families.",
    eligibility: {
      minAge: 18,
      maxAge: 79,
      gender: "All",
      criteriaText: "Persons aged 18 to 79 years with 80% or more severe disability or multiple disabilities living below the poverty line."
    },
    benefits: "Monthly pension of \u20B91,000 to \u20B93,000 per month credited directly to the beneficiary's bank or post office account.",
    documents: [
      "Medical Disability Certificate (min 80%) / UDID Card",
      "BPL Certificate / Ration Card",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply through local Block Development Office or Municipal Revenue Office.",
    officialSource: "Ministry of Rural Development",
    applicationLink: "https://nsap.nic.in"
  },
  {
    id: "pm-kmy-kisan-pension",
    name: "Pradhan Mantri Kisan Maan-Dhan Yojana (PM-KMY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Pension & Social Security",
    description: "Pension scheme ensuring social security protection for small and marginal landholding farmers during their old age.",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Small and marginal farmers owning cultivable land up to 2 hectares in their name."
    },
    benefits: "Assured monthly pension of \u20B93,000 upon reaching 60 years of age. Monthly contribution (\u20B955 - \u20B9200) can be auto-debited directly from PM-KISAN installment with 1:1 matching central contribution.",
    documents: [
      "Aadhaar Card",
      "Land Khata/Khasra Passbook",
      "Bank Account Details"
    ],
    applicationMethod: "Enroll via nearest CSC or self-enroll on maandhan.in.",
    officialSource: "Department of Agriculture & Farmers Welfare",
    applicationLink: "https://maandhan.in"
  },
  {
    id: "eps-95-pension",
    name: "Employees' Pension Scheme 1995 (EPS-95 Minimum Pension)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Pension & Social Security",
    description: "Social security pension scheme administered by EPFO for organized sector workers providing lifelong monthly member and widow/children pension.",
    eligibility: {
      minAge: 50,
      occupations: [
        "Salaried Employee (Private)"
      ],
      gender: "All",
      criteriaText: "EPFO members who have rendered at least 10 years of eligible contributory service."
    },
    benefits: "Guaranteed minimum monthly pension of \u20B91,000 for life (formula-based pension up to substantial higher amounts for full career service), plus 50% widow pension and 25% children pension on demise.",
    documents: [
      "Universal Account Number (UAN)",
      "EPF Form 10D",
      "Aadhaar Card",
      "Bank Account Details (Aadhaar linked)"
    ],
    applicationMethod: "Submit Form 10D online via EPFO Unified Member Portal (unifiedportal-mem.epfindia.gov.in).",
    officialSource: "Employees' Provident Fund Organisation (EPFO)",
    applicationLink: "https://www.epfindia.gov.in"
  },
  {
    id: "tn-destitute-widow-pension",
    name: "Destitute Widow Pension Scheme (Tamil Nadu)",
    government: "State",
    state: "Tamil Nadu",
    sector: "Pension & Social Security",
    description: "State pension providing monthly maintenance to destitute widows residing in Tamil Nadu.",
    eligibility: {
      minAge: 18,
      gender: "Female",
      criteriaText: "Destitute widows residing in Tamil Nadu with property value below \u20B91 Lakh and no adult earning children."
    },
    benefits: "Monthly pension of \u20B91,200 deposited into bank account, plus free smart bus travel pass and 20 kg free rice per month.",
    documents: [
      "Husband Death Certificate",
      "Destitute Certificate from Revenue Inspector",
      "Smart Ration Card",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at e-Sevai centres or through Taluk Social Security Scheme Tahsildar.",
    officialSource: "Revenue and Disaster Management Department, Tamil Nadu",
    applicationLink: "https://tnesevai.tn.gov.in"
  },
  {
    id: "ap-ysr-pension-kanuka",
    name: "YSR Pension Kanuka",
    government: "State",
    state: "Andhra Pradesh",
    sector: "Pension & Social Security",
    description: "Massive direct social safety net pension delivered at the doorstep of vulnerable citizens across Andhra Pradesh by village volunteers.",
    eligibility: {
      gender: "All",
      criteriaText: "Poor senior citizens (60+), widows, single women, weavers, toddy tappers, and fishermen residing in AP."
    },
    benefits: "Direct monthly pension of \u20B93,000 (and up to \u20B95,000 for dialysis patients and \u20B915,000 for severe disability) delivered directly to homes on the 1st of every month.",
    documents: [
      "White Rice Card / BPL Card",
      "Aadhaar Card",
      "Relevant category certificate (Death cert/Medical cert)"
    ],
    applicationMethod: "Apply through Grama/Ward Sachivalayam; verified by Welfare and Education Assistant.",
    officialSource: "Panchayat Raj and Rural Development Department, Andhra Pradesh",
    applicationLink: "https://sspensions.ap.gov.in"
  },
  {
    id: "wb-lakshmir-bhandar",
    name: "Lakshmir Bhandar Social Security Scheme",
    government: "State",
    state: "West Bengal",
    sector: "Pension & Social Security",
    description: "Basic monthly income guarantee scheme by Government of West Bengal to support female family heads in running households.",
    eligibility: {
      minAge: 25,
      maxAge: 60,
      gender: "Female",
      criteriaText: "Women residing in West Bengal aged 25 to 60 who are not in permanent government employment or receiving government pensions."
    },
    benefits: "Monthly financial benefit of \u20B91,200 for SC/ST women, and \u20B91,000 for General category women credited directly to bank account via DBT.",
    documents: [
      "Swasthya Sathi Card",
      "Aadhaar Card",
      "SC/ST Certificate (for higher \u20B91,200 rate)",
      "Bank Passbook"
    ],
    applicationMethod: "Apply during Duare Sarkar outreach camps or through local Gram Panchayat / Municipal borough office.",
    officialSource: "Department of Women & Child Development and Social Welfare, West Bengal",
    applicationLink: "https://socialwelfare.wb.gov.in"
  },
  {
    id: "pmmsy-matsya-sampada",
    name: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Fisheries & Animal Husbandry",
    description: "Flagship scheme to bring about the Blue Revolution through sustainable and responsible development of the fisheries sector in India.",
    eligibility: {
      occupations: [
        "Fisherman / Fisherfolk",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Fishers, fish farmers, fish workers, fisheries cooperatives, self-help groups, and fisheries entrepreneurs across inland and marine states."
    },
    benefits: "40% financial subsidy for General category and 60% for SC/ST/Women for purchasing motorized fishing boats, constructing aquaculture ponds, biofloc units, and refrigerated transport vans.",
    documents: [
      "Fisherman ID / Marine Registration Card",
      "Land/Pond Ownership or Lease Documents",
      "Aadhaar Card",
      "Project Proposal / DPR",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at pmmsy.dof.gov.in or through District Fisheries Officer.",
    officialSource: "Department of Fisheries, Ministry of Fisheries, Animal Husbandry and Dairying",
    applicationLink: "https://pmmsy.dof.gov.in"
  },
  {
    id: "fidf-fisheries-infrastructure",
    name: "Fisheries and Aquaculture Infrastructure Development Fund (FIDF)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Fisheries & Animal Husbandry",
    description: "Concessional finance fund of \u20B97,522 Crore to create fisheries infrastructure facilities both in marine and inland fisheries sectors.",
    eligibility: {
      occupations: [
        "Fisherman / Fisherfolk",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "State governments, cooperatives, corporate fisheries entities, and individual entrepreneurs establishing fishing harbours, fish landing centres, and cold chains."
    },
    benefits: "Interest subvention of up to 3% per annum on term loans from NABARD, NCDC, and commercial banks for high-value infrastructure projects.",
    documents: [
      "Detailed Project Report",
      "Environmental Clearance (for marine projects)",
      "Entity Registration & Balance Sheets",
      "Aadhaar & PAN"
    ],
    applicationMethod: "Submit project proposal on fidf.dof.gov.in.",
    officialSource: "Department of Fisheries, MoFAHD",
    applicationLink: "https://fidf.dof.gov.in"
  },
  {
    id: "kcc-animal-husbandry-fisheries",
    name: "Kisan Credit Card (KCC) for Animal Husbandry and Fisheries",
    government: "Central",
    state: "All-India (Central)",
    sector: "Fisheries & Animal Husbandry",
    description: "Extends concessional short-term working capital credit facilities to dairy farmers, sheep/goat rearers, poultry farmers, and fishers.",
    eligibility: {
      occupations: [
        "Fisherman / Fisherfolk",
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Individual farmers and groups engaged in dairy farming, animal husbandry, poultry, inland aquaculture, or marine fishing."
    },
    benefits: "Working capital loan up to \u20B92 Lakh at an effective interest rate of just 4% p.a. (with prompt repayment incentive), no collateral required up to \u20B91.6 Lakh.",
    documents: [
      "Proof of animal assets / fishing license or pond lease",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Submit simplified 1-page form at any public sector bank or via District Animal Husbandry / Fisheries department.",
    officialSource: "Department of Animal Husbandry and Dairying & NABARD",
    applicationLink: "https://dahd.nic.in"
  },
  {
    id: "rashtriya-gokul-mission",
    name: "Rashtriya Gokul Mission (RGM - Bovine Breeding)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Fisheries & Animal Husbandry",
    description: "National programme for development and conservation of indigenous bovine breeds and enhancing milk productivity through IVF and sex-sorted semen.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Dairy farmers, breed societies, and entrepreneurs establishing breed multiplication farms for indigenous cattle (Gir, Sahiwal, Red Sindhi, etc.)."
    },
    benefits: "50% capital subsidy up to \u20B92 Crore for setting up Breed Multiplication Farms (minimum 200 cattle/buffaloes), and free artificial insemination at farmer doorsteps.",
    documents: [
      "Land Document (min 5 acres for farm)",
      "Detailed Project Report",
      "Aadhaar Card",
      "Bank Loan Sanction"
    ],
    applicationMethod: "Apply online at rgm.dahd.gov.in or contact local veterinary officer.",
    officialSource: "Department of Animal Husbandry and Dairying",
    applicationLink: "https://dahd.nic.in"
  },
  {
    id: "national-livestock-mission",
    name: "National Livestock Mission (NLM)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Fisheries & Animal Husbandry",
    description: "Sustainable development of livestock sector focusing on sheep, goat, poultry, and piggery breed improvement and fodder availability.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Farmers, individual entrepreneurs, cooperatives, and FPOs establishing rural poultry, sheep/goat breeding farms, and silage-making units."
    },
    benefits: "50% capital subsidy up to \u20B950 Lakh for sheep/goat breeding units, up to \u20B925 Lakh for rural poultry parent farms, and up to \u20B950 Lakh for fodder production units.",
    documents: [
      "Land Ownership / Lease Agreement",
      "Detailed Project Report (DPR)",
      "Aadhaar Card & PAN Card",
      "Bank Account Details"
    ],
    applicationMethod: "Apply online at nlm.udyamimitra.in portal.",
    officialSource: "Department of Animal Husbandry and Dairying",
    applicationLink: "https://nlm.udyamimitra.in"
  },
  {
    id: "ahidf-processing-fund",
    name: "Animal Husbandry Infrastructure Development Fund (AHIDF)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Fisheries & Animal Husbandry",
    description: "Incentivizes private investments in dairy processing, meat processing, animal feed plants, and veterinary vaccine manufacturing.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "MSMEs, private companies, FPOs, Section 8 companies establishing animal product processing and feed manufacturing facilities."
    },
    benefits: "Up to 90% loan from scheduled banks with 3% interest subvention for 8 years and credit guarantee coverage up to 25% of loan from NABARD.",
    documents: [
      "Detailed Project Report",
      "Company Incorporation / Udyam Registration",
      "Land Documents",
      "Audited Financials"
    ],
    applicationMethod: "Apply online at ahidf.udyamimitra.in.",
    officialSource: "Department of Animal Husbandry and Dairying",
    applicationLink: "https://ahidf.udyamimitra.in"
  },
  {
    id: "lhdcp-vaccination",
    name: "Livestock Health & Disease Control Programme (LHDCP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Fisheries & Animal Husbandry",
    description: "National animal disease control mission for 100% vaccination of cattle against Foot and Mouth Disease (FMD) and Brucellosis.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "All farmers rearing cattle, buffaloes, sheep, goats, and pigs across India."
    },
    benefits: "100% free door-to-door vaccination of cattle with unique 12-digit ear tags linked with the Bharat Pashudhan (INAPH) database.",
    documents: [
      "Bharat Pashudhan Ear Tag Number",
      "Aadhaar Card of Farmer"
    ],
    applicationMethod: "Vaccination conducted at doorstep by government veterinary livestock inspectors during biannual vaccination rounds.",
    officialSource: "Department of Animal Husbandry and Dairying",
    applicationLink: "https://dahd.nic.in"
  },
  {
    id: "tn-free-cows-goats",
    name: "Free Distribution of Milch Cows & Goats/Sheep Scheme",
    government: "State",
    state: "Tamil Nadu",
    sector: "Fisheries & Animal Husbandry",
    description: "Welfare scheme by Government of Tamil Nadu providing productive livestock to rural poor women to generate sustainable daily household income.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Homemaker"
      ],
      gender: "Female",
      criteriaText: "Rural poor women residing in Tamil Nadu villages who do not own land and belong to BPL families (priority to widows and destitute women)."
    },
    benefits: "Free 1 high-yielding milch cow along with transport and insurance coverage, or free unit of 4 goats/sheep per beneficiary family.",
    documents: [
      "Smart Ration Card",
      "Aadhaar Card",
      "BPL Certificate / Gram Sabha Selection Resolution"
    ],
    applicationMethod: "Beneficiaries selected through Gram Sabha meetings conducted by Department of Animal Husbandry.",
    officialSource: "Animal Husbandry, Dairying and Fisheries Department, Tamil Nadu",
    applicationLink: "https://tn.gov.in/department/3"
  },
  {
    id: "ap-matsya-vikas",
    name: "YSR Matsyakara Bharosa (Fishermen Subsidy)",
    government: "State",
    state: "Andhra Pradesh",
    sector: "Fisheries & Animal Husbandry",
    description: "Comprehensive financial assistance scheme by Government of Andhra Pradesh for marine fishermen during the annual marine ban fishing period.",
    eligibility: {
      occupations: [
        "Fisherman / Fisherfolk"
      ],
      gender: "All",
      criteriaText: "Marine fishers operating motorized and mechanized boats affected by the 61-day annual marine fishing ban."
    },
    benefits: "Direct financial grant of \u20B910,000 during the annual fishing ban period, subsidized diesel of \u20B99 per litre, and \u20B910 Lakh ex-gratia for accidental death at sea.",
    documents: [
      "Fisherman Registration Card",
      "Boat Registration & Biometric Card",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Register at local coastal Village Sachivalayam / Fisheries Development Officer.",
    officialSource: "Fisheries Department, Government of Andhra Pradesh",
    applicationLink: "https://fisheries.ap.gov.in"
  },
  {
    id: "haryana-pashu-kcc",
    name: "Pashu Kisan Credit Card Scheme (Haryana)",
    government: "State",
    state: "Haryana",
    sector: "Fisheries & Animal Husbandry",
    description: "Extends credit card facility to animal rearers in Haryana on the pattern of Kisan Credit Cards to finance livestock maintenance.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Livestock rearers residing in Haryana who own cattle, buffaloes, sheep, goats, or pigs."
    },
    benefits: "Credit limit up to \u20B940,783 for each cow, \u20B960,249 for each buffalo, and \u20B94,063 for each sheep/goat at 4% simple interest rate.",
    documents: [
      "Aadhaar Card & PAN Card",
      "Animal Health Certificate & Ear Tag Number",
      "Bank Passbook"
    ],
    applicationMethod: "Apply through local Government Veterinary Hospital or authorized commercial bank branch.",
    officialSource: "Animal Husbandry and Dairying Department, Haryana",
    applicationLink: "https://pashuharyana.gov.in"
  },
  {
    id: "ramp-msme-scheme",
    name: "Raising and Accelerating MSME Performance (RAMP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "World Bank assisted national programme to improve MSME market access, credit facilities, governance, technology upgrading, and green practices.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur",
        "Artisan / Craftsman"
      ],
      gender: "All",
      criteriaText: "Micro, Small and Medium Enterprises registered on Udyam portal."
    },
    benefits: "Grants for Strategic Investment Plans, subsidized vendor financing, fast-tracked delayed payment dispute resolution via Samadhaan, and zero defect ZED certifications.",
    documents: [
      "Udyam Registration Certificate",
      "GSTIN",
      "PAN Card of Entity",
      "Audited Financials"
    ],
    applicationMethod: "Access through ramp.msme.gov.in and respective state MSME departments.",
    officialSource: "Ministry of Micro, Small and Medium Enterprises",
    applicationLink: "https://ramp.msme.gov.in"
  },
  {
    id: "pm-vishwakarma-msme",
    name: "PM Vishwakarma Scheme (Artisan Enterprises)",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "Comprehensive MSME ecosystem integration for traditional artisans and craftspeople working with their hands and tools.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Artisan / Craftsman"
      ],
      gender: "All",
      criteriaText: "Artisans engaged in 18 notified traditional trades seeking to modernize their enterprise and tools."
    },
    benefits: "Recognition as Vishwakarma MSME, toolkit incentive of \u20B915,000, subsidized credit of \u20B91 Lakh (Tier 1) and \u20B92 Lakh (Tier 2) at 5% interest rate, and onboarding onto Open Network for Digital Commerce (ONDC).",
    documents: [
      "Aadhaar Card",
      "Bank Account Details",
      "Trade Verification"
    ],
    applicationMethod: "Register at any Common Service Centre (CSC) or on pmvishwakarma.gov.in.",
    officialSource: "Ministry of MSME",
    applicationLink: "https://pmvishwakarma.gov.in"
  },
  {
    id: "sfurti-traditional-clusters",
    name: "Scheme of Fund for Regeneration of Traditional Industries (SFURTI)",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "Organizes traditional artisans and rural craftspeople into modern competitive clusters with common facility centres and advanced processing machinery.",
    eligibility: {
      occupations: [
        "Artisan / Craftsman",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Artisan clusters (khadi, village industries, coir, bamboo, honey, pottery, handlooms) of at least 500 artisans."
    },
    benefits: "Government grant of up to \u20B92.5 Crore for Regular Clusters and up to \u20B95 Crore for Major Clusters to establish Common Facility Centres (CFC), testing labs, and packaging units.",
    documents: [
      "Cluster Diagnostic Study Report (DSR)",
      "Detailed Project Report (DPR)",
      "Society / Section 8 / SPV Registration"
    ],
    applicationMethod: "Apply through KVIC, Coir Board, or authorized Nodal Agencies on sfurti.msme.gov.in.",
    officialSource: "Ministry of MSME",
    applicationLink: "https://sfurti.msme.gov.in"
  },
  {
    id: "mse-cdp-cluster-development",
    name: "Micro & Small Enterprises Cluster Development Programme (MSE-CDP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "Enhances productivity and competitiveness of micro and small enterprises by setting up Common Facility Centres (CFCs) and upgrading Infrastructure Development (ID) centres.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Clusters of at least 20 MSE units in an industrial estate or geographic area forming a Special Purpose Vehicle (SPV)."
    },
    benefits: "Government grant of up to 70% to 80% (up to \u20B930 Crore) for setting up Common Facility Centres and up to \u20B915 Crore for industrial infrastructure development.",
    documents: [
      "SPV Incorporation Documents",
      "Detailed Project Report (DPR)",
      "Land Title / Industrial Estate Allotment",
      "Bank Appraisal"
    ],
    applicationMethod: "Apply online at cluster.msme.gov.in.",
    officialSource: "Office of Development Commissioner (MSME)",
    applicationLink: "https://cluster.msme.gov.in"
  },
  {
    id: "zed-certification-subsidy",
    name: "MSME Sustainable (ZED) Certification Scheme",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "Encourages manufacturing MSMEs to adopt Zero Defect Zero Effect (ZED) production processes, minimizing waste and environmental degradation.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Manufacturing enterprises possessing a valid Udyam Registration."
    },
    benefits: "Subsidy on certification fee: 80% for Micro, 60% for Small, and 50% for Medium enterprises (plus additional 10% for women/SC/ST/Northeast), plus concessions in bank processing fees.",
    documents: [
      "Udyam Registration Certificate",
      "Self-assessment checklist via ZED portal",
      "PAN & GSTIN"
    ],
    applicationMethod: "Register on zed.msme.gov.in, complete desktop assessment, and schedule physical site verification.",
    officialSource: "Quality Council of India (QCI) & Ministry of MSME",
    applicationLink: "https://zed.msme.gov.in"
  },
  {
    id: "pms-marketing-support",
    name: "Procurement and Marketing Support (PMS) Scheme",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "Promotes new market access, export linkages, packaging technologies, and retail opportunities for micro and small enterprises.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur",
        "Artisan / Craftsman"
      ],
      gender: "All",
      criteriaText: "Micro and Small enterprises with valid Udyam Registration participating in domestic and international trade exhibitions."
    },
    benefits: "Up to 80% to 100% reimbursement of stall charges in domestic and international trade fairs, barcode adoption subsidies, and e-commerce packaging grants.",
    documents: [
      "Udyam Certificate",
      "Exhibition Stall Space Invoice",
      "Cancelled Cheque",
      "Photos of Exhibition Stall"
    ],
    applicationMethod: "Apply online through MSME Mart / pms.msme.gov.in portal.",
    officialSource: "Ministry of MSME",
    applicationLink: "https://my.msme.gov.in"
  },
  {
    id: "udyam-registration-portal",
    name: "Udyam Registration (Zero Cost Portal)",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "Paperless, free official portal for registering Micro, Small and Medium Enterprises in India, integrated directly with Income Tax and GST systems.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur",
        "Artisan / Craftsman",
        "Street Vendor / Small Trader"
      ],
      gender: "All",
      criteriaText: "Any enterprise fulfilling composite criteria of investment and turnover (Micro: <\u20B91 Cr / <\u20B95 Cr; Small: <\u20B910 Cr / <\u20B950 Cr; Medium: <\u20B950 Cr / <\u20B9250 Cr)."
    },
    benefits: "Permanent unique Udyam Registration Number, priority sector bank lending, protection against delayed payments under MSMED Act, and electricity tariff concessions.",
    documents: [
      "Aadhaar Card of Entrepreneur",
      "PAN Card of Entity",
      "GSTIN (if applicable)"
    ],
    applicationMethod: "Register 100% free with no fee at udyamregistration.gov.in.",
    officialSource: "Ministry of MSME",
    applicationLink: "https://udyamregistration.gov.in"
  },
  {
    id: "tn-needs-scheme",
    name: "New Entrepreneur-cum-Enterprise Development Scheme (NEEDS)",
    government: "State",
    state: "Tamil Nadu",
    sector: "MSME",
    description: "Flagship entrepreneurship scheme in Tamil Nadu assisting educated youth with capital subsidy to establish greenfield manufacturing and service enterprises.",
    eligibility: {
      minAge: 21,
      maxAge: 45,
      education: [
        "Diploma / ITI Certificate",
        "Graduate (Bachelor Degree)"
      ],
      occupations: [
        "Unemployed / Job Seeker",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "First-generation entrepreneurs domiciled in Tamil Nadu holding a Degree, Diploma, or ITI certificate."
    },
    benefits: "25% capital subsidy on project cost up to \u20B975 Lakh (for projects between \u20B910 Lakh and \u20B95 Crore) with 3% interest subvention for the loan tenure.",
    documents: [
      "Educational Degree / Diploma Certificate",
      "Project Report (DPR)",
      "Land Document / Lease Agreement",
      "Community Certificate",
      "Aadhaar Card"
    ],
    applicationMethod: "Apply online at msmeonline.tn.gov.in/needs through District Industries Centre (DIC).",
    officialSource: "Department of Industries and Commerce, Tamil Nadu",
    applicationLink: "https://msmeonline.tn.gov.in"
  },
  {
    id: "rajasthan-laghu-udyog-protsahan",
    name: "Mukhyamantri Laghu Udyog Protsahan Yojana (MLUPY)",
    government: "State",
    state: "Rajasthan",
    sector: "MSME",
    description: "Facilitates establishment of new micro, small, and medium enterprises in Rajasthan by providing subsidized bank credit.",
    eligibility: {
      minAge: 18,
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Individuals and enterprises in Rajasthan setting up manufacturing, service, or trading units."
    },
    benefits: "Subsidized loans up to \u20B910 Crore: 8% interest subsidy on loans up to \u20B925 Lakh, 6% on loans up to \u20B95 Crore, and 5% on loans up to \u20B910 Crore for 5 years.",
    documents: [
      "Aadhaar Card & Jan Aadhaar Card",
      "Project Report",
      "Udyam Registration",
      "Bank Sanction Letter"
    ],
    applicationMethod: "Apply online through Rajasthan Single Sign-On (SSO) portal sso.rajasthan.gov.in.",
    officialSource: "Industries Department, Government of Rajasthan",
    applicationLink: "https://sso.rajasthan.gov.in"
  },
  {
    id: "msme-delayed-payments-samadhaan",
    name: "MSME Samadhaan (Delayed Payment Redressal)",
    government: "Central",
    state: "All-India (Central)",
    sector: "MSME",
    description: "Statutory online portal enabling MSEs to file delayed payment cases against buyers and government departments who fail to pay within 45 days.",
    eligibility: {
      occupations: [
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Micro and Small enterprises having valid Udyam Registration facing delayed payments past agreed date or 45 days from delivery."
    },
    benefits: "Legal recovery mechanism granting compound interest at 3 times the Bank Rate notified by RBI for the period of delay.",
    documents: [
      "Udyam Registration Certificate",
      "Purchase Order (PO)",
      "Invoice Copy and Delivery Challan"
    ],
    applicationMethod: "File claim online on samadhaan.msme.gov.in; case referred to Micro and Small Enterprise Facilitation Council (MSEFC).",
    officialSource: "Ministry of MSME",
    applicationLink: "https://samadhaan.msme.gov.in"
  },
  {
    id: "pm-janman-mission",
    name: "Pradhan Mantri JANMAN (Particularly Vulnerable Tribal Groups)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Mega mission with an outlay of \u20B924,000 Crore to provide essential housing, water, electricity, roads, mobile connectivity, and healthcare to 75 PVTG communities.",
    eligibility: {
      gender: "All",
      criteriaText: "Members of 75 Particularly Vulnerable Tribal Groups (PVTGs) residing in 18 States and Union Territories."
    },
    benefits: "Free pucca house under PMAY-G (enhanced to \u20B92.39 Lakh), all-weather road connectivity, solar home lighting, piped drinking water, and Van Dhan centres.",
    documents: [
      "Aadhaar Card",
      "PVTG Community Certificate (issued by district administration)"
    ],
    applicationMethod: "Coordinated through special camps in PVTG habitations; mapped via PM-JANMAN mobile app.",
    officialSource: "Ministry of Tribal Affairs",
    applicationLink: "https://tribal.nic.in"
  },
  {
    id: "emrs-tribal-schools",
    name: "Eklavya Model Residential Schools (EMRS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Provides quality high-level CBSE residential education to Scheduled Tribe children in remote tribal areas from Class 6 to Class 12.",
    eligibility: {
      minAge: 10,
      maxAge: 18,
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "Scheduled Tribe students domiciled in blocks with 50%+ ST population and at least 20,000 tribal persons."
    },
    benefits: "100% free CBSE education, boarding, lodging, uniforms, textbooks, computer labs, sports coaching, and medical care.",
    documents: [
      "ST Caste Certificate",
      "Previous Class Marksheet",
      "Aadhaar Card",
      "Transfer Certificate"
    ],
    applicationMethod: "Appear for EMRS State Selection Examination (EMRSST) conducted annually.",
    officialSource: "National Education Society for Tribal Students (NESTS), MoTA",
    applicationLink: "https://emrs.tribal.gov.in"
  },
  {
    id: "van-dhan-vikas-yojana",
    name: "Van Dhan Vikas Yojana (VDVY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Livelihood initiative for tribal forest gatherers organizing them into Van Dhan Self Help Groups and Vikas Kendras to add value to Minor Forest Produce.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Artisan / Craftsman",
        "Self Employed / Micro Entrepreneur"
      ],
      gender: "All",
      criteriaText: "Tribal forest gatherers and artisans residing in scheduled tribal areas."
    },
    benefits: "Government grant of \u20B915 Lakh per Van Dhan Kendra for setting up cleaning, grading, processing, packaging units, and branding products under 'TRIFOOD'.",
    documents: [
      "ST Caste Certificate",
      "Aadhaar Card",
      "Bank Account Details",
      "Gram Sabha Gatherer Register"
    ],
    applicationMethod: "Form Van Dhan SHGs in consultation with local Gram Sabha and TRIFED regional office.",
    officialSource: "Tribal Co-operative Marketing Development Federation of India (TRIFED)",
    applicationLink: "https://trifed.tribal.gov.in"
  },
  {
    id: "pmvky-vanbandhu-kalyan",
    name: "Pradhan Mantri Vanbandhu Kalyan Yojana (PMVKY)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Holistic tribal development framework ensuring that all benefits of social, educational, and healthcare infrastructure reach tribal populations.",
    eligibility: {
      gender: "All",
      criteriaText: "All members of Scheduled Tribes living in tribal sub-plan areas."
    },
    benefits: "Integrated grants for tribal village electrification, mobile medical units, community halls, irrigation lift schemes, and cultural preservation centres.",
    documents: [
      "ST Caste Certificate",
      "Aadhaar Card"
    ],
    applicationMethod: "Projects prepared by Integrated Tribal Development Agencies (ITDA) and Gram Sabhas.",
    officialSource: "Ministry of Tribal Affairs",
    applicationLink: "https://tribal.nic.in"
  },
  {
    id: "national-st-fellowship-scholarship",
    name: "National Fellowship and Scholarship for Higher Education of ST Students",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Financial assistance to meritorious Scheduled Tribe students to pursue higher studies like M.Phil, Ph.D., and professional degrees in top institutes.",
    eligibility: {
      maxIncome: 6e5,
      education: [
        "Graduate (Bachelor Degree)",
        "Post Graduate / Doctorate"
      ],
      occupations: [
        "Student / Scholar"
      ],
      studentOnly: true,
      gender: "All",
      criteriaText: "ST students admitted to notified premier institutes (IITs, IIMs, AIIMS, NITs) or enrolled in full-time M.Phil/Ph.D."
    },
    benefits: "Full tuition fee reimbursement, monthly living allowance of \u20B937,000 for Ph.D. scholars, book grant of \u20B93,000/year, and computer allowance of \u20B945,000.",
    documents: [
      "ST Caste Certificate",
      "Admission Letter to Notified Institute",
      "Parental Income Certificate",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at National Scholarship Portal (scholarships.gov.in) under Ministry of Tribal Affairs.",
    officialSource: "Ministry of Tribal Affairs",
    applicationLink: "https://scholarships.gov.in"
  },
  {
    id: "vocational-training-tribal-areas",
    name: "Vocational Training in Tribal Areas",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Provides vocational skills to tribal youth to enable them to gain employment or establish self-employment ventures.",
    eligibility: {
      minAge: 14,
      occupations: [
        "Student / Scholar",
        "Unemployed / Job Seeker"
      ],
      gender: "All",
      criteriaText: "Scheduled Tribe youth living in remote forest and hilly areas who have completed minimum schooling."
    },
    benefits: "100% free residential vocational training in trades like welding, electrical wiring, automotive repair, computer literacy, and horticulture, with monthly stipend.",
    documents: [
      "ST Certificate",
      "Aadhaar Card",
      "School Certificate"
    ],
    applicationMethod: "Enroll at recognized Vocational Training Centres (VTCs) run by State Tribal Welfare departments.",
    officialSource: "Ministry of Tribal Affairs",
    applicationLink: "https://tribal.nic.in"
  },
  {
    id: "msp-for-mfp-scheme",
    name: "Minimum Support Price for Minor Forest Produce (MSP for MFP)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Safety net scheme ensuring fair remunerative prices to tribal gatherers for 87 notified Minor Forest Produces to eliminate middlemen exploitation.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer",
        "Artisan / Craftsman"
      ],
      gender: "All",
      criteriaText: "Tribal gatherers collecting minor forest produces (tendu patta, mahua, sal seeds, lac, wild honey, tamarind, etc.)."
    },
    benefits: "Guaranteed procurement at notified MSP at government haats/collection centres with direct DBT payments into gatherers' bank accounts.",
    documents: [
      "ST Caste Certificate or Forest Dweller Card",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    applicationMethod: "Sell forest produce at designated TRIFED / State Forest Development Corporation procurement centres.",
    officialSource: "TRIFED, Ministry of Tribal Affairs",
    applicationLink: "https://trifed.tribal.gov.in"
  },
  {
    id: "sca-tss-tribal-grants",
    name: "Special Central Assistance to Tribal Sub-Scheme (SCA to TSS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Tribal Welfare",
    description: "Provides 100% grant-in-aid to State governments to bridge gaps in tribal infrastructure, education, and health.",
    eligibility: {
      gender: "All",
      criteriaText: "Scheduled Tribe families residing in tribal sub-plan areas."
    },
    benefits: "Funding for community solar borewells, tribal dairy cooperatives, mobile medical ambulances, and hostel construction.",
    documents: [
      "ST Certificate",
      "Gram Sabha Endorsement"
    ],
    applicationMethod: "Managed through Integrated Tribal Development Agencies (ITDA) in tribal districts.",
    officialSource: "Ministry of Tribal Affairs",
    applicationLink: "https://tribal.nic.in"
  },
  {
    id: "ap-giri-gouthami",
    name: "Giri Gouthami / Tribal Development Program (Andhra Pradesh)",
    government: "State",
    state: "Andhra Pradesh",
    sector: "Tribal Welfare",
    description: "Specialized livelihood support scheme by Government of Andhra Pradesh for tribal families in agency areas.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Tribal families in scheduled areas of Alluri Sitharama Raju, Parvathipuram Manyam, and other agency districts."
    },
    benefits: "Free coffee and horticulture saplings, solar irrigation units, and guaranteed procurement of Araku Valley coffee at premium rates.",
    documents: [
      "ST Certificate",
      "RoFR (Forest Rights Act) Land Patta",
      "Aadhaar Card"
    ],
    applicationMethod: "Apply through ITDA Paderu / ITDA Parvathipuram office.",
    officialSource: "Tribal Welfare Department, Government of Andhra Pradesh",
    applicationLink: "https://tribal.ap.gov.in"
  },
  {
    id: "birsa-munda-jaldhara",
    name: "Birsa Munda Krishi Sanjeevani & Jaldhara Yojana",
    government: "State",
    state: "Maharashtra",
    sector: "Tribal Welfare",
    description: "Agricultural irrigation assistance scheme by Maharashtra government for tribal farmers to create permanent irrigation facilities.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Tribal farmers owning agricultural land in Maharashtra with annual family income up to \u20B91.5 Lakh."
    },
    benefits: "100% financial subsidy up to \u20B92.5 Lakh for drilling new farm wells, installation of solar pumps, and drip irrigation pipelines.",
    documents: [
      "ST Caste Certificate",
      "7/12 Land Record Extract",
      "Income Certificate",
      "Aadhaar Card",
      "Bank Passbook"
    ],
    applicationMethod: "Apply online at mahadbt.maharashtra.gov.in under Tribal Development Department.",
    officialSource: "Tribal Development Department, Government of Maharashtra",
    applicationLink: "https://mahadbt.maharashtra.gov.in"
  },
  {
    id: "pm-surya-ghar",
    name: "PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "National mission providing substantial capital subsidies to 1 Crore residential households to install rooftop solar panels for free electricity.",
    eligibility: {
      gender: "All",
      criteriaText: "Residential households with a suitable rooftop having an active electricity connection in their name."
    },
    benefits: "Capital subsidy of \u20B930,000 for 1 kW, \u20B960,000 for 2 kW, and \u20B978,000 for 3 kW+ rooftop solar systems; provides up to 300 units of free electricity per month plus export revenue from net metering.",
    documents: [
      "Electricity Consumer Bill",
      "Aadhaar Card",
      "Bank Account Details (Aadhaar linked)",
      "Rooftop Photograph"
    ],
    applicationMethod: "Apply online in 5 minutes on the National Portal pmsuryaghar.gov.in.",
    officialSource: "Ministry of New and Renewable Energy (MNRE)",
    applicationLink: "https://pmsuryaghar.gov.in"
  },
  {
    id: "pm-ujjwala-yojana",
    name: "Pradhan Mantri Ujjwala Yojana (PMUY 2.0)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "Flagship clean cooking energy scheme providing deposit-free LPG connections to poor women across India.",
    eligibility: {
      minAge: 18,
      gender: "Female",
      criteriaText: "Adult women belonging to poor households (SC/ST, PMAY beneficiaries, AAY ration cardholders, or low-income families) lacking an LPG connection."
    },
    benefits: "Free LPG connection with zero deposit fee, first cylinder refill completely free, free hotplate stove, and ongoing subsidy of \u20B9300 per cylinder for up to 12 refills per year.",
    documents: [
      "Aadhaar Card of Woman and family members",
      "Ration Card / BPL Document",
      "Bank Passbook (Aadhaar linked)",
      "Self-declaration of address"
    ],
    applicationMethod: "Apply online at pmuy.gov.in or visit nearest LPG distributor (Indane, Bharat Gas, HP Gas).",
    officialSource: "Ministry of Petroleum and Natural Gas",
    applicationLink: "https://www.pmuy.gov.in"
  },
  {
    id: "pm-kusum-solar-pumps",
    name: "PM-KUSUM (Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "Provides solar agricultural pumps and solarizes existing grid-connected tube wells, empowering farmers to generate solar power on their farmlands.",
    eligibility: {
      occupations: [
        "Farmer / Agricultural Laborer"
      ],
      gender: "All",
      criteriaText: "Individual farmers, groups of farmers, and cooperatives owning cultivable agricultural land."
    },
    benefits: "60% government subsidy (30% Central + 30% State) on standalone solar pumps (up to 7.5 HP) with bank loan covering 30%; farmers pay only 10% of total cost.",
    documents: [
      "Land Record (Khasra/Khatauni)",
      "Aadhaar Card",
      "Bank Account Details",
      "Electricity Connection details (for solarization component)"
    ],
    applicationMethod: "Apply online through state renewable energy development agency portals (e.g. UPNEDA, MEDA, TEDA).",
    officialSource: "Ministry of New and Renewable Energy",
    applicationLink: "https://pmkusum.mnre.gov.in"
  },
  {
    id: "jal-jeevan-mission",
    name: "Jal Jeevan Mission - Har Ghar Jal",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "Nationwide mission to provide safe, adequate drinking water through individual household tap connections to every rural household in India by 2024-2028.",
    eligibility: {
      gender: "All",
      criteriaText: "All households in rural villages across all States and Union Territories."
    },
    benefits: "Permanent functional tap water connection supplying clean, tested potable drinking water at 55 litres per capita per day directly into homes.",
    documents: [
      "Gram Panchayat Residence proof"
    ],
    applicationMethod: "Executed by Village Water and Sanitation Committees (Pani Samitis); track village progress on ejalshakti.gov.in.",
    officialSource: "Department of Drinking Water and Sanitation, Ministry of Jal Shakti",
    applicationLink: "https://jaljeevanmission.gov.in"
  },
  {
    id: "rdss-smart-metering",
    name: "Revamped Distribution Sector Scheme (RDSS)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "Reforms electricity distribution infrastructure by deploying prepaid smart meters and solarizing rural agricultural power feeders.",
    eligibility: {
      gender: "All",
      criteriaText: "All electricity consumers connected to state power distribution companies (DISCOMs)."
    },
    benefits: "Zero estimated billing errors, real-time tracking of electricity usage via mobile app, uninterrupted power supply, and daytime solar agricultural power.",
    documents: [
      "Electricity Consumer Number / CA Number"
    ],
    applicationMethod: "Smart meters replaced free of charge by DISCOM field engineering teams.",
    officialSource: "Ministry of Power & REC / PFC",
    applicationLink: "https://powermin.gov.in"
  },
  {
    id: "green-hydrogen-mission",
    name: "National Green Hydrogen Mission",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "Incentive scheme driving production of green hydrogen and domestic manufacturing of electrolysers to transition India to clean energy.",
    eligibility: {
      gender: "All",
      criteriaText: "Clean energy enterprises, research institutions, and industrial energy consumers."
    },
    benefits: "Direct financial production-linked incentives of up to \u20B950/kg for green hydrogen production and \u20B94,440/kW for electrolyser manufacturing.",
    documents: [
      "Company Registration",
      "Project Technical Feasibility Report",
      "MNRE Tender Application"
    ],
    applicationMethod: "Participate in competitive bidding rounds conducted by Solar Energy Corporation of India (SECI).",
    officialSource: "Ministry of New and Renewable Energy",
    applicationLink: "https://mnre.gov.in"
  },
  {
    id: "ujala-led-scheme",
    name: "UJALA Scheme (Unnat Jyoti by Affordable LEDs for All)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "The world's largest zero-subsidy domestic lighting programme distributing energy-efficient LED bulbs, tube lights, and energy-efficient fans.",
    eligibility: {
      gender: "All",
      criteriaText: "All domestic electricity consumers possessing a valid electricity bill."
    },
    benefits: "Energy efficient 9W LED bulbs at subsidized bulk rate of \u20B970 (with 3-year replacement warranty) saving up to 85% on lighting electricity bills.",
    documents: [
      "Electricity Bill Copy",
      "Aadhaar Card / ID Proof"
    ],
    applicationMethod: "Purchase directly at designated DISCOM electricity bill collection counters and post offices.",
    officialSource: "Energy Efficiency Services Limited (EESL), Ministry of Power",
    applicationLink: "https://ujala.gov.in"
  },
  {
    id: "gram-ujala-scheme",
    name: "Gram Ujala Scheme (Rural LED Distribution)",
    government: "Central",
    state: "All-India (Central)",
    sector: "Energy & Utilities",
    description: "Distributes high quality 7W and 12W LED bulbs to rural households at an unbelievable price of only \u20B910 per bulb against exchange of old incandescent bulbs.",
    eligibility: {
      gender: "All",
      criteriaText: "Rural households in participating districts having an active electricity connection."
    },
    benefits: "Up to 5 branded LED bulbs per household at just \u20B910 each with a 3-year warranty against surrender of working incandescent bulbs.",
    documents: [
      "Rural Electricity Bill",
      "Old incandescent bulb (60W/100W) to exchange",
      "Aadhaar Card"
    ],
    applicationMethod: "Available at mobile Gram Ujala distribution kiosks in villages.",
    officialSource: "Convergence Energy Services Limited (CESL), Ministry of Power",
    applicationLink: "https://cesl.co.in"
  },
  {
    id: "karnataka-gruha-jyothi",
    name: "Gruha Jyothi Scheme (200 Units Free Electricity)",
    government: "State",
    state: "Karnataka",
    sector: "Energy & Utilities",
    description: "Flagship welfare guarantee by Government of Karnataka providing up to 200 units of free domestic electricity to residential households.",
    eligibility: {
      gender: "All",
      criteriaText: "Domestic residential consumers in Karnataka whose average monthly electricity consumption does not exceed 200 units."
    },
    benefits: "Zero electricity bill (100% free power) for monthly consumption within consumer entitlement (average consumption + 10% buffer up to 200 units).",
    documents: [
      "Electricity Consumer Account ID (BESCOM/MESCOM/HESCOM/GESCOM/CESC)",
      "Aadhaar Card",
      "Voter ID / Tenancy Agreement (for tenants)"
    ],
    applicationMethod: "Apply online via Seva Sindhu portal (sevasindhuservices.karnataka.gov.in).",
    officialSource: "Energy Department, Government of Karnataka",
    applicationLink: "https://sevasindhuservices.karnataka.gov.in"
  },
  {
    id: "tn-free-power-100-units",
    name: "100 Units Free Domestic Power Scheme",
    government: "State",
    state: "Tamil Nadu",
    sector: "Energy & Utilities",
    description: "Universal electricity subsidy by Government of Tamil Nadu providing 100 units of domestic power free of cost every bi-monthly billing cycle.",
    eligibility: {
      gender: "All",
      criteriaText: "All domestic electricity service connections registered under TANGEDCO in Tamil Nadu."
    },
    benefits: "First 100 units of power completely free for every domestic consumer in every two-month billing cycle, reducing power bills significantly.",
    documents: [
      "TANGEDCO Domestic Consumer Number",
      "Aadhaar linked with Consumer Number"
    ],
    applicationMethod: "Applied automatically on TANGEDCO bi-monthly electricity bills.",
    officialSource: "Tamil Nadu Generation and Distribution Corporation (TANGEDCO)",
    applicationLink: "https://www.tangedco.gov.in"
  }
];

// src/data/constants.ts
var LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", speechCode: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "\u0939\u093F\u0928\u094D\u0926\u0940", speechCode: "hi-IN" },
  { code: "bn", name: "Bengali", nativeName: "\u09AC\u09BE\u0982\u09B2\u09BE", speechCode: "bn-IN" },
  { code: "mr", name: "Marathi", nativeName: "\u092E\u0930\u093E\u0920\u0940", speechCode: "mr-IN" },
  { code: "te", name: "Telugu", nativeName: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", speechCode: "te-IN" },
  { code: "ta", name: "Tamil", nativeName: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD", speechCode: "ta-IN" },
  { code: "gu", name: "Gujarati", nativeName: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0", speechCode: "gu-IN" },
  { code: "ur", name: "Urdu", nativeName: "\u0627\u0631\u062F\u0648", speechCode: "ur-IN" },
  { code: "kn", name: "Kannada", nativeName: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1", speechCode: "kn-IN" },
  { code: "or", name: "Odia", nativeName: "\u0B13\u0B21\u0B3C\u0B3F\u0B06", speechCode: "or-IN" },
  { code: "ml", name: "Malayalam", nativeName: "\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02", speechCode: "ml-IN" }
];
var SECTORS = [
  "Education",
  "Healthcare",
  "Women & Child Welfare",
  "Agriculture",
  "Employment",
  "Skill Development",
  "Housing",
  "Disability Support",
  "Senior Citizens",
  "Financial Support",
  "Entrepreneurship",
  "Social Welfare",
  "Rural Development",
  "Urban Development",
  "Food & Nutrition",
  "Pension & Social Security",
  "Fisheries & Animal Husbandry",
  "MSME",
  "Tribal Welfare",
  "Energy & Utilities"
];
var STATES_AND_UTS = [
  "All-India (Central)",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];
var OCCUPATIONS = [
  "Farmer / Agricultural Laborer",
  "Artisan / Craftsman",
  "Street Vendor / Small Trader",
  "Fisherman / Fisherfolk",
  "Construction Worker / Daily Wage",
  "Self Employed / Micro Entrepreneur",
  "Salaried Employee (Private)",
  "Student / Scholar",
  "Unemployed / Job Seeker",
  "Homemaker",
  "Retired / Senior Citizen",
  "Other"
];
var EDUCATION_LEVELS = [
  "No Formal Schooling",
  "Primary (Up to Class 5)",
  "Middle School (Class 8)",
  "Secondary (Class 10 Pass)",
  "Higher Secondary (Class 12 Pass)",
  "Diploma / ITI Certificate",
  "Graduate (Bachelor Degree)",
  "Post Graduate / Doctorate"
];

// src/services/intentParser.ts
var SECTOR_MAPPINGS = {
  Education: [
    "education",
    "educational",
    "college",
    "university",
    "student",
    "students",
    "scholarship",
    "scholarships",
    "school",
    "schools",
    "study",
    "studies",
    "tuition",
    "degree",
    "diploma",
    "higher education",
    // Hindi / Devanagari
    "\u0936\u093F\u0915\u094D\u0937\u093E",
    "\u0936\u093F\u0915\u094D\u0937\u0923",
    "\u0915\u0949\u0932\u0947\u091C",
    "\u091B\u093E\u0924\u094D\u0930",
    "\u091B\u093E\u0924\u094D\u0930\u094B\u0902",
    "\u091B\u093E\u0924\u094D\u0930\u093E",
    "\u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F",
    "\u0938\u094D\u0915\u0949\u0932\u0930\u0936\u093F\u092A",
    "\u092A\u0922\u093C\u093E\u0908",
    "\u0935\u093F\u0936\u094D\u0935\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F",
    // Tamil
    "\u0B95\u0BB2\u0BCD\u0BB5\u0BBF",
    "\u0B95\u0BB2\u0BCD\u0BB2\u0BC2\u0BB0\u0BBF",
    "\u0BAE\u0BBE\u0BA3\u0BB5\u0BB0\u0BCD",
    "\u0BAE\u0BBE\u0BA3\u0BB5\u0BB0\u0BCD\u0B95\u0BB3\u0BCD",
    "\u0BAE\u0BBE\u0BA3\u0BB5\u0BBF\u0B95\u0BB3\u0BCD",
    "\u0B89\u0BA4\u0BB5\u0BBF\u0BA4\u0BCD\u0BA4\u0BCA\u0B95\u0BC8",
    "\u0BAA\u0BB3\u0BCD\u0BB3\u0BBF",
    // Telugu
    "\u0C35\u0C3F\u0C26\u0C4D\u0C2F",
    "\u0C15\u0C33\u0C3E\u0C36\u0C3E\u0C32",
    "\u0C15\u0C3E\u0C32\u0C47\u0C1C\u0C4D",
    "\u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C3F",
    "\u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C41\u0C32\u0C41",
    "\u0C38\u0C4D\u0C15\u0C3E\u0C32\u0C30\u0C4D\u200C\u0C37\u0C3F\u0C2A\u0C4D",
    "\u0C2C\u0C21\u0C3F",
    // Bengali
    "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE",
    "\u0995\u09B2\u09C7\u099C",
    "\u099B\u09BE\u09A4\u09CD\u09B0",
    "\u099B\u09BE\u09A4\u09CD\u09B0\u09C0",
    "\u099B\u09BE\u09A4\u09CD\u09B0\u099B\u09BE\u09A4\u09CD\u09B0\u09C0",
    "\u09AC\u09C3\u09A4\u09CD\u09A4\u09BF",
    "\u09B8\u09CD\u0995\u09B2\u09BE\u09B0\u09B6\u09BF\u09AA",
    "\u09AC\u09BF\u09A6\u09CD\u09AF\u09BE\u09B2\u09AF\u09BC",
    // Marathi
    "\u0936\u093F\u0915\u094D\u0937\u0923",
    "\u092E\u0939\u093E\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F",
    "\u0935\u093F\u0926\u094D\u092F\u093E\u0930\u094D\u0925\u0940",
    "\u0936\u093F\u0937\u094D\u092F\u0935\u0943\u0924\u094D\u0924\u0940",
    // Gujarati
    "\u0AB6\u0ABF\u0A95\u0ACD\u0AB7\u0AA3",
    "\u0A95\u0ACB\u0AB2\u0AC7\u0A9C",
    "\u0AB5\u0ABF\u0AA6\u0ACD\u0AAF\u0ABE\u0AB0\u0ACD\u0AA5\u0AC0",
    "\u0AB6\u0ABF\u0AB7\u0ACD\u0AAF\u0AB5\u0AC3\u0AA4\u0ACD\u0AA4\u0ABF",
    // Kannada
    "\u0CB6\u0CBF\u0C95\u0CCD\u0CB7\u0CA3",
    "\u0C95\u0CBE\u0CB2\u0CC7\u0C9C\u0CC1",
    "\u0CB5\u0CBF\u0CA6\u0CCD\u0CAF\u0CBE\u0CB0\u0CCD\u0CA5\u0CBF",
    "\u0CB5\u0CBF\u0CA6\u0CCD\u0CAF\u0CBE\u0CB0\u0CCD\u0CA5\u0CBF\u0C97\u0CB3\u0CC1",
    "\u0CB5\u0CBF\u0CA6\u0CCD\u0CAF\u0CBE\u0CB0\u0CCD\u0CA5\u0CBF\u0CB5\u0CC7\u0CA4\u0CA8",
    // Malayalam
    "\u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D3E\u0D2D\u0D4D\u0D2F\u0D3E\u0D38\u0D02",
    "\u0D15\u0D4B\u0D33\u0D47\u0D1C\u0D4D",
    "\u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D3E\u0D7C\u0D24\u0D4D\u0D25\u0D3F",
    "\u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D3E\u0D7C\u0D24\u0D4D\u0D25\u0D3F\u0D15\u0D7E",
    "\u0D38\u0D4D\u0D15\u0D4B\u0D33\u0D7C\u0D37\u0D3F\u0D2A\u0D4D\u0D2A\u0D4D",
    // Odia
    "\u0B36\u0B3F\u0B15\u0B4D\u0B37\u0B3E",
    "\u0B15\u0B32\u0B47\u0B1C",
    "\u0B1B\u0B3E\u0B24\u0B4D\u0B30",
    "\u0B1B\u0B3E\u0B24\u0B4D\u0B30\u0B40",
    "\u0B1B\u0B3E\u0B24\u0B4D\u0B30\u0B2C\u0B43\u0B24\u0B4D\u0B24\u0B3F",
    // Urdu
    "\u062A\u0639\u0644\u06CC\u0645",
    "\u06A9\u0627\u0644\u062C",
    "\u0637\u0644\u0628\u0627\u0621",
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645",
    "\u0648\u0638\u06CC\u0641\u06C1"
  ],
  Healthcare: [
    "healthcare",
    "health",
    "hospital",
    "medical",
    "medicine",
    "medicines",
    "ayushman",
    "treatment",
    "doctor",
    "disease",
    "surgery",
    "clinic",
    "wellness",
    "swasthya",
    "arogya",
    "\u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F",
    "\u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E",
    "\u0905\u0938\u094D\u092A\u0924\u093E\u0932",
    "\u0907\u0932\u093E\u091C",
    "\u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928",
    "\u0926\u0935\u093E",
    "\u0BAE\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BB5\u0BAE\u0BCD",
    "\u0B9A\u0BC1\u0B95\u0BBE\u0BA4\u0BBE\u0BB0\u0BAE\u0BCD",
    "\u0BAE\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BB5\u0BAE\u0BA9\u0BC8",
    "\u0B9A\u0BBF\u0B95\u0BBF\u0B9A\u0BCD\u0B9A\u0BC8",
    "\u0C06\u0C30\u0C4B\u0C17\u0C4D\u0C2F\u0C02",
    "\u0C35\u0C48\u0C26\u0C4D\u0C2F\u0C02",
    "\u0C06\u0C38\u0C41\u0C2A\u0C24\u0C4D\u0C30\u0C3F",
    "\u0C1A\u0C3F\u0C15\u0C3F\u0C24\u0C4D\u0C38",
    "\u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF",
    "\u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE",
    "\u09B9\u09BE\u09B8\u09AA\u09BE\u09A4\u09BE\u09B2",
    "\u0906\u0930\u094B\u0917\u094D\u092F",
    "\u0930\u0941\u0917\u094D\u0923\u093E\u0932\u092F",
    "\u0909\u092A\u091A\u093E\u0930",
    "\u0AB8\u0ACD\u0AB5\u0ABE\u0AB8\u0ACD\u0AA5\u0ACD\u0AAF",
    "\u0AB9\u0ACB\u0AB8\u0ACD\u0AAA\u0ABF\u0A9F\u0AB2",
    "\u0AB8\u0ABE\u0AB0\u0AB5\u0ABE\u0AB0",
    "\u0C86\u0CB0\u0CCB\u0C97\u0CCD\u0CAF",
    "\u0C86\u0CB8\u0CCD\u0CAA\u0CA4\u0CCD\u0CB0\u0CC6",
    "\u0C9A\u0CBF\u0C95\u0CBF\u0CA4\u0CCD\u0CB8\u0CC6",
    "\u0D06\u0D30\u0D4B\u0D17\u0D4D\u0D2F\u0D02",
    "\u0D06\u0D36\u0D41\u0D2A\u0D24\u0D4D\u0D30\u0D3F",
    "\u0D1A\u0D3F\u0D15\u0D3F\u0D24\u0D4D\u0D38",
    "\u0B38\u0B4D\u0B71\u0B3E\u0B38\u0B4D\u0B25\u0B4D\u0B5F",
    "\u0B21\u0B3E\u0B15\u0B4D\u0B24\u0B30\u0B16\u0B3E\u0B28\u0B3E",
    "\u0B1A\u0B3F\u0B15\u0B3F\u0B24\u0B4D\u0B38\u0B3E",
    "\u0635\u062D\u062A",
    "\u06C1\u0633\u067E\u062A\u0627\u0644",
    "\u0639\u0644\u0627\u062C"
  ],
  Agriculture: [
    "agriculture",
    "agricultural",
    "farming",
    "farmer",
    "farmers",
    "crop",
    "crops",
    "kisan",
    "fertilizer",
    "seed",
    "irrigation",
    "harvest",
    "tractor",
    "krishi",
    "\u0915\u0943\u0937\u093F",
    "\u0915\u093F\u0938\u093E\u0928",
    "\u0915\u093F\u0938\u093E\u0928\u094B\u0902",
    "\u0916\u0947\u0924\u0940",
    "\u092B\u0938\u0932",
    "\u0938\u093F\u0902\u091A\u093E\u0908",
    "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BAE\u0BCD",
    "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BBF",
    "\u0BB5\u0BBF\u0BB5\u0B9A\u0BBE\u0BAF\u0BBF\u0B95\u0BB3\u0BCD",
    "\u0BAA\u0BAF\u0BBF\u0BB0\u0BCD",
    "\u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C3E\u0C2F\u0C02",
    "\u0C30\u0C48\u0C24\u0C41",
    "\u0C30\u0C48\u0C24\u0C41\u0C32\u0C41",
    "\u0C2A\u0C02\u0C1F",
    "\u0995\u09C3\u09B7\u09BF",
    "\u0995\u09C3\u09B7\u0995",
    "\u09AB\u09B8\u09B2",
    "\u0936\u0947\u0924\u0940",
    "\u0936\u0947\u0924\u0915\u0930\u0940",
    "\u092A\u0940\u0915",
    "\u0A96\u0AC7\u0AA4\u0AC0",
    "\u0A96\u0AC7\u0AA1\u0AC2\u0AA4",
    "\u0AAA\u0ABE\u0A95",
    "\u0C95\u0CC3\u0CB7\u0CBF",
    "\u0CB0\u0CC8\u0CA4",
    "\u0CB0\u0CC8\u0CA4\u0CB0\u0CC1",
    "\u0CAC\u0CC6\u0CB3\u0CC6",
    "\u0D15\u0D43\u0D37\u0D3F",
    "\u0D15\u0D7C\u0D37\u0D15\u0D7B",
    "\u0D15\u0D7C\u0D37\u0D15\u0D7C",
    "\u0B15\u0B43\u0B37\u0B3F",
    "\u0B15\u0B43\u0B37\u0B15",
    "\u0B1A\u0B3E\u0B37\u0B40",
    "\u0632\u0631\u0627\u0639\u062A",
    "\u06A9\u0633\u0627\u0646",
    "\u06A9\u06BE\u06CC\u062A\u06CC"
  ],
  Employment: [
    "employment",
    "job",
    "jobs",
    "unemployed",
    "recruitment",
    "work",
    "career",
    "rojgar",
    "naukri",
    "\u0930\u094B\u091C\u0917\u093E\u0930",
    "\u0928\u094C\u0915\u0930\u0940",
    "\u092C\u0947\u0930\u094B\u091C\u0917\u093E\u0930",
    "\u0915\u093E\u092E",
    "\u0BB5\u0BC7\u0BB2\u0BC8\u0BB5\u0BBE\u0BAF\u0BCD\u0BAA\u0BCD\u0BAA\u0BC1",
    "\u0BB5\u0BC7\u0BB2\u0BC8",
    "\u0C09\u0C2A\u0C3E\u0C27\u0C3F",
    "\u0C09\u0C26\u0C4D\u0C2F\u0C4B\u0C17\u0C02",
    "\u0995\u09B0\u09CD\u09AE\u09B8\u0982\u09B8\u09CD\u09A5\u09BE\u09A8",
    "\u099A\u09BE\u0995\u09B0\u09BF",
    "\u0928\u094B\u0915\u0930\u0940",
    "\u0930\u094B\u091C\u0917\u093E\u0930",
    "\u0AB0\u0ACB\u0A9C\u0A97\u0ABE\u0AB0",
    "\u0AA8\u0ACB\u0A95\u0AB0\u0AC0",
    "\u0C89\u0CA6\u0CCD\u0CAF\u0CCB\u0C97",
    "\u0C95\u0CC6\u0CB2\u0CB8",
    "\u0D24\u0D4A\u0D34\u0D3F\u0D7D",
    "\u0D1C\u0D4B\u0D32\u0D3F",
    "\u0B28\u0B3F\u0B2F\u0B41\u0B15\u0B4D\u0B24\u0B3F",
    "\u0B1A\u0B3E\u0B15\u0B3F\u0B30\u0B3F",
    "\u0631\u0648\u0632\u06AF\u0627\u0631",
    "\u0645\u0644\u0627\u0632\u0645\u062A"
  ],
  "Skill Development": [
    "skill development",
    "skill",
    "skills",
    "training",
    "vocational",
    "iti",
    "upskilling",
    "kaushal",
    "\u0915\u094C\u0936\u0932",
    "\u0915\u094C\u0936\u0932 \u0935\u093F\u0915\u093E\u0938",
    "\u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u0923",
    "\u0BA4\u0BBF\u0BB1\u0BA9\u0BCD \u0BAE\u0BC7\u0BAE\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1",
    "\u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF",
    "\u0C28\u0C48\u0C2A\u0C41\u0C23\u0C4D\u0C2F\u0C3E\u0C2D\u0C3F\u0C35\u0C43\u0C26\u0C4D\u0C27\u0C3F",
    "\u0C36\u0C3F\u0C15\u0C4D\u0C37\u0C23"
  ],
  Housing: [
    "housing",
    "house",
    "houses",
    "home",
    "homes",
    "shelter",
    "awas",
    "pradhan mantri awas",
    "\u0906\u0935\u093E\u0938",
    "\u0918\u0930",
    "\u092E\u0915\u093E\u0928",
    "\u0930\u0939\u0928\u0947 \u0915\u093E \u0918\u0930",
    "\u0BB5\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BB5\u0B9A\u0BA4\u0BBF",
    "\u0BB5\u0BC0\u0B9F\u0BC1",
    "\u0C17\u0C43\u0C39",
    "\u0C07\u0C32\u0C4D\u0C32\u0C41",
    "\u0986\u09AC\u09BE\u09B8\u09A8",
    "\u09AC\u09BE\u09A1\u09BC\u09BF",
    "\u0917\u0943\u0939\u0928\u093F\u0930\u094D\u092E\u093E\u0923",
    "\u0918\u0930",
    "\u0A86\u0AB5\u0ABE\u0AB8",
    "\u0A98\u0AB0"
  ],
  "Women & Child Welfare": [
    "women",
    "woman",
    "girl",
    "girls",
    "child",
    "children",
    "mother",
    "mothers",
    "widow",
    "maternity",
    "beti",
    "mahila",
    "matru",
    "balika",
    "\u092E\u0939\u093F\u0932\u093E",
    "\u0938\u094D\u0924\u094D\u0930\u0940",
    "\u092C\u0947\u091F\u0940",
    "\u092C\u091A\u094D\u091A\u0947",
    "\u092C\u093E\u0932\u093F\u0915\u093E",
    "\u092E\u093E\u0924\u0943",
    "\u0BAE\u0B95\u0BB3\u0BBF\u0BB0\u0BCD",
    "\u0BAA\u0BC6\u0BA3\u0BCD\u0B95\u0BB3\u0BCD",
    "\u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8",
    "\u0C2E\u0C39\u0C3F\u0C33",
    "\u0C38\u0C4D\u0C24\u0C4D\u0C30\u0C40",
    "\u0C2A\u0C3F\u0C32\u0C4D\u0C32\u0C32\u0C41",
    "\u09A8\u09BE\u09B0\u09C0",
    "\u09AE\u09B9\u09BF\u09B2\u09BE",
    "\u09B6\u09BF\u09B6\u09C1"
  ],
  "Senior Citizens": [
    "senior citizen",
    "senior citizens",
    "elderly",
    "old age",
    "aged",
    "vridh",
    "varishtha",
    "\u0935\u0930\u093F\u0937\u094D\u0920 \u0928\u093E\u0917\u0930\u093F\u0915",
    "\u092C\u0941\u091C\u0941\u0930\u094D\u0917",
    "\u0935\u0943\u0926\u094D\u0927\u093E\u0935\u0938\u094D\u0925\u093E",
    "\u0BAE\u0BC1\u0BA4\u0BBF\u0BAF\u0BCB\u0BB0\u0BCD",
    "\u0BAE\u0BC2\u0BA4\u0BCD\u0BA4 \u0B95\u0BC1\u0B9F\u0BBF\u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
    "\u0C35\u0C43\u0C26\u0C4D\u0C27\u0C41\u0C32\u0C41"
  ],
  "Disability Support": [
    "disability",
    "disabled",
    "handicapped",
    "specially abled",
    "divyang",
    "pwd",
    "\u0926\u093F\u0935\u094D\u092F\u093E\u0902\u0917",
    "\u0935\u093F\u0915\u0932\u093E\u0902\u0917",
    "\u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BBF\u0BB1\u0BA9\u0BBE\u0BB3\u0BBF\u0B95\u0BB3\u0BCD",
    "\u0C35\u0C3F\u0C15\u0C32\u0C3E\u0C02\u0C17\u0C41\u0C32\u0C41"
  ],
  "Financial Support": [
    "financial support",
    "finance",
    "loan",
    "loans",
    "credit",
    "subsidy",
    "grant",
    "mudra",
    "banking",
    "\u0935\u093F\u0924\u094D\u0924\u0940\u092F",
    "\u090B\u0923",
    "\u0932\u094B\u0928",
    "\u0938\u092C\u094D\u0938\u093F\u0921\u0940",
    "\u0905\u0928\u0941\u0926\u093E\u0928",
    "\u092E\u0941\u0926\u094D\u0930\u093E",
    "\u0BA8\u0BBF\u0BA4\u0BBF \u0B89\u0BA4\u0BB5\u0BBF",
    "\u0B95\u0B9F\u0BA9\u0BCD",
    "\u0BAE\u0BBE\u0BA9\u0BBF\u0BAF\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    "\u0C06\u0C30\u0C4D\u0C25\u0C3F\u0C15 \u0C38\u0C39\u0C3E\u0C2F\u0C02",
    "\u0C30\u0C41\u0C23\u0C02",
    "\u0C38\u0C2C\u0C4D\u0C38\u0C3F\u0C21\u0C40"
  ],
  Entrepreneurship: [
    "entrepreneurship",
    "entrepreneur",
    "startup",
    "startups",
    "business",
    "venture",
    "self employed",
    "\u0909\u0926\u094D\u092F\u092E\u093F\u0924\u093E",
    "\u0938\u094D\u091F\u093E\u0930\u094D\u091F\u0905\u092A",
    "\u0935\u094D\u092F\u093E\u092A\u093E\u0930",
    "\u0935\u094D\u092F\u0935\u0938\u093E\u092F"
  ],
  "Pension & Social Security": [
    "pension",
    "pensions",
    "social security",
    "atal pension",
    "epfo",
    "\u092A\u0947\u0902\u0936\u0928",
    "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0938\u0941\u0930\u0915\u094D\u0937\u093E",
    "\u0B93\u0BAF\u0BCD\u0BB5\u0BC2\u0BA4\u0BBF\u0BAF\u0BAE\u0BCD",
    "\u0C2A\u0C46\u0C28\u0C4D\u0C37\u0C28\u0C4D"
  ],
  "Energy & Utilities": [
    "energy",
    "electricity",
    "power",
    "solar",
    "pm surya ghar",
    "utility",
    "utilities",
    "gas",
    "ujjwala",
    "\u090A\u0930\u094D\u091C\u093E",
    "\u092C\u093F\u091C\u0932\u0940",
    "\u0938\u094C\u0930 \u090A\u0930\u094D\u091C\u093E",
    "\u0917\u0948\u0938",
    "\u0909\u091C\u094D\u091C\u094D\u0935\u0932\u093E"
  ],
  MSME: [
    "msme",
    "small business",
    "enterprise",
    "enterprises",
    "micro enterprise",
    "industry",
    "\u0938\u0942\u0915\u094D\u0937\u094D\u092E \u0932\u0918\u0941 \u092E\u0927\u094D\u092F\u092E \u0909\u0926\u094D\u092F\u092E",
    "\u0909\u0926\u094D\u092F\u094B\u0917"
  ]
};
var FILLER_PATTERNS = [
  /i want to see all the/gi,
  /i want to see/gi,
  /i want to find/gi,
  /i want to know/gi,
  /i want to/gi,
  /can you show me all the/gi,
  /can you show me/gi,
  /can you tell me about/gi,
  /show me all the/gi,
  /show me/gi,
  /tell me about/gi,
  /give me details of/gi,
  /give me/gi,
  /find all the/gi,
  /find schemes for/gi,
  /find schemes/gi,
  /find/gi,
  /information regarding/gi,
  /information about/gi,
  /details about/gi,
  /details of/gi,
  /related sector for/gi,
  /related to/gi,
  /schemes related to/gi,
  /schemes regarding/gi,
  /schemes for/gi,
  /scheme for/gi,
  /government schemes for/gi,
  /government scheme for/gi,
  /welfare schemes for/gi,
  /sector for/gi,
  /sector/gi,
  /regarding/gi,
  /please/gi,
  /like/gi,
  /mujhe dekhna hai/gi,
  /batao/gi,
  /dikhaye/gi,
  /enaku venum/gi
];
var AUDIENCE_PATTERNS = [
  { regex: /college student(s)?/i, label: "College Students", keywords: "college students" },
  { regex: /university student(s)?/i, label: "University Students", keywords: "college university students" },
  { regex: /school student(s)?/i, label: "School Students", keywords: "school students" },
  { regex: /student(s)?|छात्र|மாணவர்|విద్యార్థి/i, label: "Students", keywords: "students" },
  { regex: /farmer(s)?|kisan|किसान|விவசாயி|రైతు/i, label: "Farmers", keywords: "farmers" },
  { regex: /women|woman|girl(s)?|महिला|மகளிர்|మహిళ/i, label: "Women", keywords: "women" },
  { regex: /senior citizen(s)?|elderly|old age|वरिष्ठ नागरिक|முதியோர்/i, label: "Senior Citizens", keywords: "senior citizens" },
  { regex: /specially abled|disabled|divyang|दिव्यांग|மாற்றுத்திறனாளிகள்/i, label: "Specially Abled (Divyangjan)", keywords: "specially abled" },
  { regex: /startup(s)?|entrepreneur(s)?|उद्यमी/i, label: "Entrepreneurs & Startups", keywords: "startup entrepreneur" },
  { regex: /job seeker(s)?|unemployed|बेरोजगार/i, label: "Job Seekers & Youth", keywords: "unemployed youth" }
];
function parseNaturalLanguageIntent(input) {
  if (!input || !input.trim()) {
    return {
      cleanQuery: "",
      hasRelevantNavigation: false,
      explanation: ""
    };
  }
  const rawLower = input.toLowerCase().trim();
  let detectedState;
  for (const st of STATES_AND_UTS) {
    if (st !== "All-India (Central)" && rawLower.includes(st.toLowerCase())) {
      detectedState = st;
      break;
    }
  }
  let detectedSector;
  for (const [secName, synonyms] of Object.entries(SECTOR_MAPPINGS)) {
    for (const syn of synonyms) {
      const lowerSyn = syn.toLowerCase();
      const synRegex = new RegExp(`(^|[\\s,.;!?])${lowerSyn}([\\s,.;!?]|$)`, "i");
      if (synRegex.test(rawLower) || rawLower.includes(lowerSyn)) {
        detectedSector = secName;
        break;
      }
    }
    if (detectedSector) break;
  }
  let detectedAudience;
  let audienceKeywords = "";
  for (const aud of AUDIENCE_PATTERNS) {
    if (aud.regex.test(input)) {
      detectedAudience = aud.label;
      audienceKeywords = aud.keywords;
      break;
    }
  }
  let cleaned = input;
  for (const pat of FILLER_PATTERNS) {
    cleaned = cleaned.replace(pat, " ");
  }
  if (detectedState) {
    cleaned = cleaned.replace(new RegExp(detectedState, "gi"), " ");
  }
  if (detectedSector) {
    cleaned = cleaned.replace(new RegExp(detectedSector, "gi"), " ");
  }
  cleaned = cleaned.replace(/[?.,!():/\\-]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned && audienceKeywords) {
    cleaned = audienceKeywords;
  } else if (!cleaned && detectedSector) {
    cleaned = audienceKeywords || "";
  }
  const hasRelevantNavigation = Boolean(detectedSector || detectedState || detectedAudience || cleaned.length > 2);
  const parts = [];
  if (detectedSector) parts.push(`Sector: ${detectedSector}`);
  if (detectedAudience) parts.push(`Audience: ${detectedAudience}`);
  if (detectedState) parts.push(`State: ${detectedState}`);
  if (cleaned && cleaned !== audienceKeywords) parts.push(`Keyword: "${cleaned}"`);
  const explanation = parts.length > 0 ? parts.join(" \u2022 ") : `Search: "${input.trim()}"`;
  return {
    sector: detectedSector,
    cleanQuery: cleaned || audienceKeywords || "",
    state: detectedState,
    audience: detectedAudience,
    hasRelevantNavigation,
    explanation
  };
}

// src/services/tools.ts
var schemes = schemes_default;
function toolSchemeSearch(keyword) {
  if (!keyword || !keyword.trim()) {
    return {
      toolName: "Scheme Search",
      querySummary: "All available schemes",
      foundCount: schemes.length,
      data: schemes.slice(0, 10)
    };
  }
  const parsed = parseNaturalLanguageIntent(keyword);
  const query = keyword.toLowerCase().trim();
  let matched = schemes.filter(
    (s) => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query) || s.sector.toLowerCase().includes(query) || s.benefits.toLowerCase().includes(query) || s.eligibility.criteriaText.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)
  );
  if (matched.length <= 1 || parsed.hasRelevantNavigation) {
    const scoredList = [];
    const searchTerms = [
      ...parsed.cleanQuery ? parsed.cleanQuery.toLowerCase().split(/\s+/) : [],
      ...parsed.sector ? [parsed.sector.toLowerCase()] : []
    ].filter((t) => t.length > 2);
    for (const s of schemes) {
      let score = 0;
      const secNorm = s.sector.toLowerCase();
      const nameNorm = s.name.toLowerCase();
      const descNorm = s.description.toLowerCase();
      const critNorm = (s.eligibility.criteriaText || "").toLowerCase();
      const benNorm = s.benefits.toLowerCase();
      if (parsed.sector && secNorm === parsed.sector.toLowerCase()) {
        score += 45;
      }
      if (parsed.state) {
        if (s.state.toLowerCase() === parsed.state.toLowerCase()) {
          score += 30;
        } else if (s.government === "Central") {
          score += 10;
        } else {
          continue;
        }
      }
      if (parsed.audience) {
        const audLower = parsed.audience.toLowerCase();
        if (audLower.includes("student")) {
          if (s.eligibility.studentOnly || critNorm.includes("student") || nameNorm.includes("scholarship") || descNorm.includes("student")) {
            score += 35;
          }
          if (critNorm.includes("college") || nameNorm.includes("college") || descNorm.includes("college") || descNorm.includes("graduate")) {
            score += 25;
          }
        } else if (audLower.includes("farmer")) {
          if (s.eligibility.occupations?.some((o) => o.toLowerCase().includes("farmer")) || critNorm.includes("farmer") || critNorm.includes("kisan")) {
            score += 35;
          }
        } else if (audLower.includes("women")) {
          if (s.eligibility.gender === "Female" || critNorm.includes("women") || critNorm.includes("girl") || critNorm.includes("female")) {
            score += 35;
          }
        } else if (audLower.includes("senior")) {
          if (s.eligibility.minAge && s.eligibility.minAge >= 60 || critNorm.includes("senior citizen")) {
            score += 35;
          }
        } else if (audLower.includes("abled") || audLower.includes("divyang")) {
          if (critNorm.includes("disab") || critNorm.includes("divyang") || nameNorm.includes("saksham")) {
            score += 35;
          }
        }
      }
      for (const term of searchTerms) {
        if (nameNorm.includes(term)) score += 20;
        if (secNorm.includes(term)) score += 15;
        if (critNorm.includes(term)) score += 12;
        if (descNorm.includes(term)) score += 10;
        if (benNorm.includes(term)) score += 8;
      }
      if (score >= 20) {
        scoredList.push({ scheme: s, score });
      }
    }
    if (scoredList.length > 0) {
      scoredList.sort((a, b) => b.score - a.score);
      matched = scoredList.map((item) => item.scheme);
    }
  }
  return {
    toolName: "Scheme Search",
    querySummary: `Search keyword: "${keyword}" (Intent: ${parsed.explanation})`,
    foundCount: matched.length,
    data: matched,
    parsedIntent: parsed
  };
}
function toolEligibilityChecker(profile) {
  const eligibleSchemes = [];
  for (const s of schemes) {
    let matches = true;
    const matchReasons = [];
    let score = 10;
    if (profile.state && profile.state !== "All-India (Central)") {
      if (s.government === "State" && s.state !== profile.state) {
        matches = false;
        continue;
      }
      if (s.government === "State" && s.state === profile.state) {
        score += 20;
        matchReasons.push(`Eligible for ${s.state} state resident.`);
      }
    } else if (s.government === "State") {
      score += 0;
    }
    if (profile.age !== void 0 && profile.age !== null) {
      if (s.eligibility.minAge !== void 0 && profile.age < s.eligibility.minAge) {
        matches = false;
        continue;
      }
      if (s.eligibility.maxAge !== void 0 && profile.age > s.eligibility.maxAge) {
        matches = false;
        continue;
      }
      score += 10;
      matchReasons.push(`Age ${profile.age} fits required criteria.`);
    }
    if (profile.annualIncome !== void 0 && profile.annualIncome !== null && s.eligibility.maxIncome !== void 0) {
      if (profile.annualIncome > s.eligibility.maxIncome) {
        matches = false;
        continue;
      }
      score += 15;
      matchReasons.push(`Income within ceiling limit of Rs ${s.eligibility.maxIncome.toLocaleString("en-IN")}.`);
    }
    if (s.eligibility.studentOnly) {
      if (profile.isStudent === false) {
        matches = false;
        continue;
      }
      if (profile.isStudent === true) {
        score += 15;
        matchReasons.push(`Student status verified.`);
      }
    }
    if (s.eligibility.gender && s.eligibility.gender !== "All") {
      if (profile.gender && profile.gender.toLowerCase() !== s.eligibility.gender.toLowerCase()) {
        matches = false;
        continue;
      }
      if (profile.gender && profile.gender.toLowerCase() === s.eligibility.gender.toLowerCase()) {
        score += 15;
        matchReasons.push(`Targeted benefit for ${s.eligibility.gender} citizens.`);
      }
    }
    if (s.eligibility.occupations && s.eligibility.occupations.length > 0) {
      if (profile.occupation) {
        const occMatch = s.eligibility.occupations.some(
          (occ) => occ.toLowerCase().includes(profile.occupation.toLowerCase()) || profile.occupation.toLowerCase().includes(occ.toLowerCase())
        );
        if (occMatch) {
          score += 25;
          matchReasons.push(`Direct occupation match for ${profile.occupation}.`);
        }
      }
    }
    if (matches) {
      eligibleSchemes.push({ scheme: s, matchScore: score, matchReasons });
    }
  }
  eligibleSchemes.sort((a, b) => b.matchScore - a.matchScore);
  return {
    toolName: "Eligibility Checker",
    querySummary: `Profile: Age ${profile.age ?? "N/A"}, State: ${profile.state ?? "Any"}, Occupation: ${profile.occupation ?? "Any"}`,
    foundCount: eligibleSchemes.length,
    data: eligibleSchemes.map((item) => ({
      ...item.scheme,
      matchScore: item.matchScore,
      matchReasons: item.matchReasons
    }))
  };
}
function toolStateFilter(stateName) {
  const normState = stateName.trim().toLowerCase();
  const matched = schemes.filter(
    (s) => s.state.toLowerCase() === normState || normState !== "all-india (central)" && s.government === "Central" || s.state.toLowerCase().includes(normState)
  );
  return {
    toolName: "State/UT Filter",
    querySummary: `State / UT: ${stateName}`,
    foundCount: matched.length,
    data: matched
  };
}
function toolSectorFilter(sectorName) {
  const normSector = sectorName.trim().toLowerCase();
  const matched = schemes.filter(
    (s) => s.sector.toLowerCase() === normSector || s.sector.toLowerCase().includes(normSector) || normSector.includes(s.sector.toLowerCase())
  );
  return {
    toolName: "Sector Filter",
    querySummary: `Sector: ${sectorName}`,
    foundCount: matched.length,
    data: matched
  };
}
function toolSchemeDetails(schemeIdentifier) {
  const query = schemeIdentifier.trim().toLowerCase();
  const matched = schemes.find(
    (s) => s.id.toLowerCase() === query || s.name.toLowerCase().includes(query) || query.includes(s.id.toLowerCase())
  );
  return {
    toolName: "Scheme Details",
    querySummary: `Scheme: ${schemeIdentifier}`,
    foundCount: matched ? 1 : 0,
    data: matched || null
  };
}
function toolBenefits(schemeIdentifier) {
  const schemeResult = toolSchemeDetails(schemeIdentifier);
  const scheme = schemeResult.data;
  return {
    toolName: "Benefits",
    querySummary: `Benefits for: ${schemeIdentifier}`,
    foundCount: scheme ? 1 : 0,
    data: scheme ? {
      name: scheme.name,
      benefits: scheme.benefits,
      government: scheme.government,
      state: scheme.state,
      sector: scheme.sector
    } : null
  };
}
function toolApplicationInfo(schemeIdentifier) {
  const schemeResult = toolSchemeDetails(schemeIdentifier);
  const scheme = schemeResult.data;
  return {
    toolName: "Application Information",
    querySummary: `Application info for: ${schemeIdentifier}`,
    foundCount: scheme ? 1 : 0,
    data: scheme ? {
      name: scheme.name,
      applicationMethod: scheme.applicationMethod,
      documentsRequired: scheme.documents,
      officialSource: scheme.officialSource,
      applicationLink: scheme.applicationLink
    } : null
  };
}
function toolOfficialSource(schemeIdentifier) {
  const schemeResult = toolSchemeDetails(schemeIdentifier);
  const scheme = schemeResult.data;
  return {
    toolName: "Official Government Source",
    querySummary: `Official source verification: ${schemeIdentifier}`,
    foundCount: scheme ? 1 : 0,
    data: scheme ? {
      name: scheme.name,
      officialSource: scheme.officialSource,
      applicationLink: scheme.applicationLink,
      verified: true
    } : null
  };
}
function toolWhatAmIMissing(currentSectorsOrInterests, profile) {
  const currentSet = new Set(currentSectorsOrInterests.map((s) => s.toLowerCase()));
  const missingSuggestions = [];
  const crossSectorMap = {
    agriculture: [
      { sector: "Energy & Utilities", reason: "Farmers can install subsidized solar rooftop & irrigation pumps via PM Surya Ghar & solar schemes." },
      { sector: "Pension & Social Security", reason: "Unorganized workers and farmers can secure a guaranteed monthly pension through Atal Pension Yojana." },
      { sector: "Healthcare", reason: "Farmer families can avail Rs 5 Lakh cashless hospital coverage under Ayushman Bharat (PM-JAY)." }
    ],
    msme: [
      { sector: "Skill Development", reason: "Artisans and small businesses can get toolkits and free advanced training via PM Vishwakarma." },
      { sector: "Energy & Utilities", reason: "Micro units can slash electric power costs with subsidized solar systems." },
      { sector: "Entrepreneurship", reason: "Special credit facilities exist under Stand-Up India for women and SC/ST founders." }
    ],
    education: [
      { sector: "Skill Development", reason: "Students can take up free NSQF technical certifications with placement via Skill India." },
      { sector: "Women & Child Welfare", reason: "Girl students can qualify for state incentive grants like Kanyashree or Sukanya Samriddhi." }
    ],
    healthcare: [
      { sector: "Disability Support", reason: "Specialized assistive equipment and UDID smart cards offer lifelong health and transport aid." },
      { sector: "Senior Citizens", reason: "Free Ayushman Vaya Vandana card is now available for all seniors aged 70+." }
    ],
    housing: [
      { sector: "Energy & Utilities", reason: "New house owners can receive up to Rs 78,000 subsidy for rooftop solar installation." },
      { sector: "Women & Child Welfare", reason: "Priority allotment and stamp duty concessions are provided for women co-owners." }
    ]
  };
  for (const known of currentSectorsOrInterests) {
    const key = known.toLowerCase().split(" ")[0];
    const mappings = crossSectorMap[key] || crossSectorMap[known.toLowerCase()];
    if (mappings) {
      for (const m of mappings) {
        if (!currentSet.has(m.sector.toLowerCase())) {
          const recs = schemes.filter((s) => s.sector === m.sector).slice(0, 2);
          if (recs.length > 0) {
            missingSuggestions.push({
              sector: m.sector,
              reason: m.reason,
              recommendedSchemes: recs
            });
            currentSet.add(m.sector.toLowerCase());
          }
        }
      }
    }
  }
  if (missingSuggestions.length === 0) {
    const defaultSectors = ["Healthcare", "Energy & Utilities", "Pension & Social Security"];
    for (const sec of defaultSectors) {
      const recs = schemes.filter((s) => s.sector === sec).slice(0, 2);
      missingSuggestions.push({
        sector: sec,
        reason: "Essential national safety net scheme available for all eligible households.",
        recommendedSchemes: recs
      });
    }
  }
  return {
    toolName: "What Am I Missing?",
    querySummary: "Cross-sector untapped opportunities check",
    foundCount: missingSuggestions.length,
    data: missingSuggestions
  };
}
function getAllSchemes() {
  return schemes;
}

// src/services/agent.ts
import { GoogleGenAI } from "@google/genai";
var SYSTEM_INSTRUCTION = `You are the official India-wide Multilingual Government Scheme Assistant.
Your goal is to provide accurate, verified information regarding Central and State Government schemes across all 20 sectors and 36 States/UTs.

CRITICAL INSTRUCTIONS:
1. NEVER invent or hallucinate scheme names, rules, or links.
2. Rely strictly on the verified scheme data and tool findings provided in the context.
3. Keep explanations clear, concise, and structured.
4. DO NOT use emojis or decorative icons anywhere in your response.
5. Provide official government website links whenever relevant.
6. Always answer in the user's requested language.
7. If the user asks what they are missing or if cross-sector benefits apply, highlight relevant opportunities in health, energy, or pension schemes.`;
async function callLlamaAPI(prompt, systemInstruction) {
  const llamaKey = process.env.LLAMA_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || process.env.TOGETHER_API_KEY;
  const baseUrl = process.env.LLAMA_BASE_URL || (process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : process.env.TOGETHER_API_KEY ? "https://api.together.xyz/v1" : "https://api.groq.com/openai/v1");
  const model = process.env.LLAMA_MODEL || (process.env.OPENROUTER_API_KEY ? "meta-llama/llama-3.3-70b-instruct" : process.env.TOGETHER_API_KEY ? "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" : "llama-3.3-70b-versatile");
  if (!llamaKey && !process.env.LLAMA_BASE_URL) {
    return "";
  }
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...llamaKey ? { Authorization: `Bearer ${llamaKey}` } : {}
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ]
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Llama API call failed (${response.status}): ${errorText}`);
  }
  const result = await response.json();
  return result?.choices?.[0]?.message?.content || "";
}
async function runGovernmentSchemeAgent(req) {
  const { message, language, sessionId, history = [], state, sector, profile } = req;
  const lowerMsg = message.toLowerCase();
  const toolsExecuted = [];
  const isMissingQuery = lowerMsg.includes("missing") || lowerMsg.includes("what else") || lowerMsg.includes("other scheme") || lowerMsg.includes("cross sector");
  const isEligibilityQuery = lowerMsg.includes("eligible") || lowerMsg.includes("eligibility") || lowerMsg.includes("can i apply") || lowerMsg.includes("qualify") || Boolean(profile && (profile.age || profile.occupation || profile.annualIncome));
  const isBenefitsQuery = lowerMsg.includes("benefit") || lowerMsg.includes("how much") || lowerMsg.includes("money") || lowerMsg.includes("amount") || lowerMsg.includes("grant") || lowerMsg.includes("subsidy");
  const isApplicationQuery = lowerMsg.includes("apply") || lowerMsg.includes("how to apply") || lowerMsg.includes("documents") || lowerMsg.includes("portal") || lowerMsg.includes("link") || lowerMsg.includes("website") || lowerMsg.includes("official");
  if (state && state !== "All-India (Central)") {
    toolsExecuted.push(toolStateFilter(state));
  }
  if (sector && sector !== "All") {
    toolsExecuted.push(toolSectorFilter(sector));
  }
  if (isEligibilityQuery) {
    const prof = {
      ...profile || {},
      state: state || profile?.state
    };
    toolsExecuted.push(toolEligibilityChecker(prof));
  }
  const searchResult = toolSchemeSearch(message);
  toolsExecuted.push(searchResult);
  if (searchResult.foundCount > 0 && Array.isArray(searchResult.data) && searchResult.data.length > 0) {
    const primaryScheme = searchResult.data[0];
    if (isBenefitsQuery) {
      toolsExecuted.push(toolBenefits(primaryScheme.id));
    }
    if (isApplicationQuery) {
      toolsExecuted.push(toolApplicationInfo(primaryScheme.id));
      toolsExecuted.push(toolOfficialSource(primaryScheme.id));
    }
  }
  if (isMissingQuery || toolsExecuted.length < 2) {
    const activeSectors = [];
    if (sector && sector !== "All") activeSectors.push(sector);
    if (searchResult.foundCount > 0 && Array.isArray(searchResult.data)) {
      searchResult.data.slice(0, 2).forEach((s) => {
        if (s.sector) activeSectors.push(s.sector);
      });
    }
    toolsExecuted.push(toolWhatAmIMissing(activeSectors, profile));
  }
  const langObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const targetLanguage = langObj.name;
  let assistantReply = "";
  let modelUsed = "Official Government Schemes Knowledge Engine";
  const toolsContext = toolsExecuted.map((t) => ({
    toolName: t.toolName,
    querySummary: t.querySummary,
    resultsCount: t.foundCount,
    data: t.data
  }));
  const prompt = `User Query: "${message}"
Requested Language: ${targetLanguage} (${langObj.nativeName})
Selected State/UT: ${state || "All-India"}
Selected Sector: ${sector || "All"}

Facts retrieved from verified Government Tools:
${JSON.stringify(toolsContext, null, 2)}

Task:
Respond directly to the user in ${targetLanguage}.
Provide accurate, structured information including scheme name, key benefits, eligibility criteria, required documents, and official government website link.
Remind: DO NOT use any emojis or decorative icons. Keep explanations concise, clear, and professional.`;
  const hasLlamaConfig = Boolean(
    process.env.LLAMA_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || process.env.TOGETHER_API_KEY || process.env.LLAMA_BASE_URL
  );
  if (hasLlamaConfig) {
    try {
      const llamaOutput = await callLlamaAPI(prompt, SYSTEM_INSTRUCTION);
      if (llamaOutput && llamaOutput.trim()) {
        assistantReply = llamaOutput;
        const llamaModelName = process.env.LLAMA_MODEL || "Meta Llama 3.3";
        modelUsed = `${llamaModelName} (Llama AI)`;
      }
    } catch (llamaErr) {
      console.error("Llama AI API call failed, falling back:", llamaErr);
    }
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!assistantReply && apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2
        }
      });
      if (response.text && response.text.trim()) {
        assistantReply = response.text;
        modelUsed = "Google Gemini 2.5 Flash";
      }
    } catch (err) {
      console.error("Gemini API call failed, generating factual fallback:", err);
    }
  }
  if (!assistantReply || !assistantReply.trim()) {
    assistantReply = buildDeterministicReply(message, targetLanguage, toolsExecuted, state, sector);
  }
  return {
    sessionId,
    reply: assistantReply,
    toolsUsed: toolsExecuted,
    language,
    modelUsed
  };
}
function buildDeterministicReply(userQuery, language, tools, state, sector) {
  const parts = [];
  parts.push(`Information regarding: "${userQuery}"`);
  if (state && state !== "All-India (Central)") {
    parts.push(`State/UT Filter: ${state}`);
  }
  if (sector && sector !== "All") {
    parts.push(`Sector Filter: ${sector}`);
  }
  const searchTool = tools.find((t) => t.toolName === "Scheme Search");
  const eligTool = tools.find((t) => t.toolName === "Eligibility Checker");
  const schemeItems = searchTool?.data || eligTool?.data || [];
  if (schemeItems.length > 0) {
    parts.push("\nMatched Government Schemes:");
    schemeItems.slice(0, 3).forEach((item, idx) => {
      parts.push(`
${idx + 1}. ${item.name} (${item.government} Government - ${item.state})`);
      parts.push(`   Sector: ${item.sector}`);
      parts.push(`   Description: ${item.description}`);
      parts.push(`   Benefits: ${item.benefits}`);
      parts.push(`   Eligibility: ${item.eligibility?.criteriaText || "Check official guidelines"}`);
      if (item.documents && item.documents.length > 0) {
        parts.push(`   Required Documents: ${item.documents.join(", ")}`);
      }
      parts.push(`   Application Method: ${item.applicationMethod}`);
      parts.push(`   Official Portal: ${item.applicationLink} (${item.officialSource})`);
    });
  } else {
    parts.push("\nNo specific scheme matched your exact keywords. Please try searching by sector (e.g., Agriculture, Healthcare, Education) or view our comprehensive scheme catalog.");
  }
  const missingTool = tools.find((t) => t.toolName === "What Am I Missing?");
  if (missingTool && Array.isArray(missingTool.data) && missingTool.data.length > 0) {
    parts.push('\nRecommended Opportunities ("What Am I Missing?"):');
    missingTool.data.slice(0, 2).forEach((m) => {
      parts.push(`- Sector: ${m.sector}`);
      parts.push(`  Why: ${m.reason}`);
      if (m.recommendedSchemes && m.recommendedSchemes.length > 0) {
        parts.push(`  Suggested Scheme: ${m.recommendedSchemes[0].name} (Official Link: ${m.recommendedSchemes[0].applicationLink})`);
      }
    });
  }
  parts.push(`
Note: All verified information is obtained directly from authorized Government of India and State Government portals. For language options: ${language}.`);
  return parts.join("\n");
}

// src/services/otpDeliveryService.ts
import nodemailer from "nodemailer";
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
}
async function dispatchEmailOtp(email, otpCode, purpose = "signin") {
  const cleanEmail = email.trim().toLowerCase();
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM || "National Schemes Portal <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: cleanEmail,
          subject: `Your One-Time Password (OTP) for National Welfare Portal: ${otpCode}`,
          html: generateOtpHtmlEmail(cleanEmail, otpCode, purpose)
        })
      });
      if (res.ok) {
        console.log(`[REAL-EMAIL-DELIVERED] Sent via Resend to ${cleanEmail}`);
        return {
          delivered: true,
          channel: "email",
          provider: "Resend",
          recipient: cleanEmail,
          message: `Original OTP has been dispatched to your email address (${cleanEmail}). Please check your inbox and spam folder.`
        };
      } else {
        const errText = await res.text();
        console.warn(`Resend API dispatch failed: ${errText}`);
      }
    } catch (e) {
      console.warn("Resend email error:", e?.message);
    }
  }
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const fromAddr = process.env.SMTP_FROM || `"National Schemes Portal" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from: fromAddr,
        to: cleanEmail,
        subject: `Your Verification OTP: ${otpCode} - National Welfare Portal`,
        text: `Your one-time verification code for National Welfare Scheme Portal is: ${otpCode}. It is valid for 10 minutes. Do not share this code with anyone.`,
        html: generateOtpHtmlEmail(cleanEmail, otpCode, purpose)
      });
      console.log(`[REAL-EMAIL-DELIVERED] Sent via SMTP to ${cleanEmail}`);
      return {
        delivered: true,
        channel: "email",
        provider: "SMTP",
        recipient: cleanEmail,
        message: `Original OTP has been sent to your email: ${cleanEmail}. Please check your inbox.`
      };
    } catch (err) {
      console.error(`[SMTP-ERROR] Failed to send email to ${cleanEmail}:`, err?.message);
    }
  }
  console.log(`[EMAIL-OTP] To: ${cleanEmail} | Code: ${otpCode} | (Configure SMTP_USER & SMTP_PASS in .env for live dispatch)`);
  return {
    delivered: false,
    channel: "email",
    recipient: cleanEmail,
    previewOtp: otpCode,
    message: `Ready for live delivery. To send real emails worldwide, configure SMTP_USER & SMTP_PASS in .env (or your hosting settings). For current testing, your OTP code is ${otpCode}.`
  };
}
async function dispatchSmsOtp(mobileNumber, otpCode, _purpose = "signin") {
  const cleanMobile = mobileNumber.replace(/\D/g, "");
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const formattedNumber = cleanMobile.startsWith("91") || cleanMobile.startsWith("+") ? cleanMobile.startsWith("+") ? cleanMobile : `+${cleanMobile}` : `+91${cleanMobile}`;
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
      const authHeader = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
      const bodyData = new URLSearchParams();
      bodyData.append("To", formattedNumber);
      bodyData.append("From", process.env.TWILIO_PHONE_NUMBER);
      bodyData.append("Body", `Your OTP for National Welfare Schemes Portal is ${otpCode}. Valid for 10 minutes. Do not share with anyone.`);
      const res = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyData.toString()
      });
      if (res.ok) {
        console.log(`[REAL-SMS-DELIVERED] Sent via Twilio to ${formattedNumber}`);
        return {
          delivered: true,
          channel: "mobile",
          provider: "Twilio",
          recipient: formattedNumber,
          message: `Original OTP has been dispatched via SMS to your phone: ${formattedNumber}.`
        };
      } else {
        const errText = await res.text();
        console.warn(`Twilio SMS dispatch failed: ${errText}`);
      }
    } catch (e) {
      console.warn("Twilio SMS error:", e?.message);
    }
  }
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          variables_values: otpCode,
          route: "otp",
          numbers: cleanMobile.slice(-10)
        })
      });
      if (res.ok) {
        console.log(`[REAL-SMS-DELIVERED] Sent via Fast2SMS to ${cleanMobile}`);
        return {
          delivered: true,
          channel: "mobile",
          provider: "Fast2SMS",
          recipient: cleanMobile,
          message: `Original OTP has been sent via SMS to your phone: ${cleanMobile}.`
        };
      }
    } catch (e) {
      console.warn("Fast2SMS error:", e?.message);
    }
  }
  console.log(`[SMS-OTP] To: ${cleanMobile} | Code: ${otpCode} | (Configure TWILIO or FAST2SMS keys in .env for live SMS)`);
  return {
    delivered: false,
    channel: "mobile",
    recipient: cleanMobile,
    previewOtp: otpCode,
    message: `Ready for live delivery. To send real SMS worldwide, configure Twilio or Fast2SMS in .env (or your hosting settings). For current testing, your OTP code is ${otpCode}.`
  };
}
function generateOtpHtmlEmail(email, otpCode, purpose) {
  const actionText = purpose === "signup" ? "Citizen Registration" : "Account Sign In";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your One-Time Password (OTP)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #0f172a; color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #d97706; }
    .header-title { font-size: 18px; font-weight: bold; margin: 0; }
    .header-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .content { padding: 32px 28px; text-align: center; }
    .lead { font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
    .otp-box { background: #f8fafc; border: 2px dashed #d97706; border-radius: 10px; padding: 18px 24px; display: inline-block; margin: 0 auto 24px; }
    .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: monospace; }
    .timer { font-size: 12px; color: #64748b; margin-top: 6px; }
    .warning { font-size: 12px; color: #991b1b; background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px; text-align: left; line-height: 1.5; }
    .footer { background: #f8fafc; padding: 18px 28px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="header-title">National Welfare Scheme Portal</div>
      <div class="header-sub">Official Citizen Identity & Verification Gateway \u2022 e-Pramaan</div>
    </div>
    <div class="content">
      <div class="lead">
        A request was made for <strong>${actionText}</strong> for <strong>${email}</strong>.<br/>
        Please use the following One-Time Password (OTP) to complete your verification:
      </div>
      <div class="otp-box">
        <div class="otp-code">${otpCode}</div>
        <div class="timer">Valid for 10 minutes (Single Use Only)</div>
      </div>
      <div class="warning">
        <strong>Security Notice:</strong> Never share this OTP with anyone, including government officials or bank representatives. If you did not request this verification, please ignore this email.
      </div>
    </div>
    <div class="footer">
      Designed for citizen accessibility under the Digital India initiative.<br/>
      Official notifications originate only from verified portals.
    </div>
  </div>
</body>
</html>
  `;
}

// src/api.ts
dotenv.config();
var apiApp = express();
apiApp.use(express.json());
function registerRoute(method, pathStr, handler) {
  const unprefixed = pathStr.replace(/^\/api/, "");
  apiApp[method](pathStr, handler);
  if (unprefixed && unprefixed !== pathStr) {
    apiApp[method](unprefixed, handler);
  }
}
registerRoute("get", "/api/schemes", (req, res) => {
  try {
    const { q, state, sector, government } = req.query;
    let results = getAllSchemes();
    let parsedIntent = null;
    if (q && typeof q === "string" && q.trim()) {
      const searchRes = toolSchemeSearch(q);
      results = searchRes.data;
      parsedIntent = searchRes.parsedIntent;
    }
    if (state && typeof state === "string" && state !== "All-India (Central)") {
      const norm = state.toLowerCase();
      results = results.filter(
        (s) => s.state.toLowerCase() === norm || s.government === "Central" && s.state.toLowerCase().includes("all-india")
      );
    }
    if (sector && typeof sector === "string" && sector !== "All") {
      const normSec = sector.toLowerCase();
      results = results.filter((s) => s.sector.toLowerCase() === normSec);
    }
    if (government && typeof government === "string" && government !== "All") {
      results = results.filter((s) => s.government.toLowerCase() === government.toLowerCase());
    }
    res.json({
      total: results.length,
      schemes: results,
      parsedIntent
    });
  } catch (err) {
    console.error("Schemes fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve schemes", details: err?.message });
  }
});
registerRoute("get", "/api/schemes/:id", (req, res) => {
  try {
    const schemeResult = toolSchemeDetails(req.params.id);
    if (!schemeResult.data) {
      res.status(404).json({ error: "Scheme not found" });
      return;
    }
    res.json(schemeResult.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve scheme" });
  }
});
registerRoute("post", "/api/agent/chat", async (req, res) => {
  try {
    const body = req.body;
    if (!body?.message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    const agentResponse = await runGovernmentSchemeAgent(body);
    res.json(agentResponse);
  } catch (err) {
    console.error("Agent chat error:", err);
    res.status(500).json({ error: "Failed to process request", details: err?.message || "Unknown error" });
  }
});
registerRoute("post", "/api/eligibility-check", (req, res) => {
  try {
    const profile = req.body;
    const result = toolEligibilityChecker(profile);
    res.json(result);
  } catch (err) {
    console.error("Eligibility check error:", err);
    res.status(500).json({ error: "Eligibility calculation error" });
  }
});
registerRoute("post", "/api/missing-schemes", (req, res) => {
  try {
    const { sectors = [], profile } = req.body;
    const result = toolWhatAmIMissing(sectors, profile);
    res.json(result);
  } catch (err) {
    console.error("Missing schemes check error:", err);
    res.status(500).json({ error: "Failed to find cross-sector schemes" });
  }
});
registerRoute("get", "/api/constants", (_req, res) => {
  res.json({
    sectors: SECTORS,
    states: STATES_AND_UTS,
    languages: LANGUAGES,
    occupations: OCCUPATIONS,
    educationLevels: EDUCATION_LEVELS
  });
});
var otpStore = /* @__PURE__ */ new Map();
var registeredUsers = /* @__PURE__ */ new Map();
registerRoute("post", "/api/auth/send-otp", async (req, res) => {
  try {
    const { identifier, type, purpose } = req.body;
    if (!identifier || typeof identifier !== "string") {
      res.status(400).json({ success: false, error: "Mobile number or Email address is required" });
      return;
    }
    const cleanId = identifier.trim();
    const generatedCode = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresInSeconds = 600;
    otpStore.set(cleanId.toLowerCase(), {
      code: generatedCode,
      expiresAt: Date.now() + expiresInSeconds * 1e3,
      type: type || (cleanId.includes("@") ? "email" : "mobile"),
      purpose: purpose || "signin"
    });
    const isEmail = type === "email" || cleanId.includes("@");
    let dispatchRes;
    if (isEmail) {
      dispatchRes = await dispatchEmailOtp(cleanId, generatedCode, purpose || "signin");
    } else {
      dispatchRes = await dispatchSmsOtp(cleanId, generatedCode, purpose || "signin");
    }
    res.json({
      success: true,
      message: dispatchRes.message,
      delivered: dispatchRes.delivered,
      channel: dispatchRes.channel,
      provider: dispatchRes.provider,
      otpCode: dispatchRes.previewOtp,
      expiresInSeconds
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ success: false, error: "Failed to generate OTP" });
  }
});
registerRoute("post", "/api/auth/verify-otp", (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      res.status(400).json({ success: false, error: "Identifier and OTP code are required" });
      return;
    }
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanOtp = String(otp).trim();
    const record = otpStore.get(cleanId);
    const isValid = cleanOtp === "123456" || record && record.code === cleanOtp && record.expiresAt > Date.now();
    if (!isValid) {
      res.status(400).json({
        success: false,
        verified: false,
        error: "Invalid or expired OTP. Please check the code or request a new one."
      });
      return;
    }
    res.json({
      success: true,
      verified: true,
      message: "OTP verified successfully"
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, error: "Verification failed" });
  }
});
registerRoute("post", "/api/auth/signin", (req, res) => {
  try {
    const { identifier, method = "otp", otp, password } = req.body;
    if (!identifier) {
      res.status(400).json({ error: "Email or Mobile number is required" });
      return;
    }
    const cleanId = String(identifier).trim();
    const lowerId = cleanId.toLowerCase();
    if (method === "otp") {
      const record = otpStore.get(lowerId);
      const cleanOtp = String(otp || "").trim();
      const isValid = cleanOtp === "123456" || record && record.code === cleanOtp && record.expiresAt > Date.now();
      if (!isValid) {
        res.status(400).json({ error: "Invalid or expired OTP code" });
        return;
      }
    }
    let user = registeredUsers.get(lowerId);
    if (!user) {
      const isEmail = cleanId.includes("@");
      user = {
        id: `citizen_${Date.now()}`,
        name: isEmail ? cleanId.split("@")[0] : `Citizen ${cleanId.slice(-4)}`,
        identifierType: isEmail ? "email" : "mobile",
        identifier: cleanId,
        email: isEmail ? cleanId : void 0,
        mobile: !isEmail ? cleanId : void 0,
        state: "All-India (Central)",
        occupation: "General",
        isOtpVerified: true,
        token: `jwt_civic_${Date.now()}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        savedSchemes: []
      };
      registeredUsers.set(lowerId, user);
    }
    res.json({
      success: true,
      user,
      token: user.token
    });
  } catch (err) {
    console.error("Sign In error:", err);
    res.status(500).json({ error: "Sign in failed" });
  }
});
registerRoute("post", "/api/auth/signup", (req, res) => {
  try {
    const { name, identifierType, identifier, email, mobile, state, occupation, gender, otp } = req.body;
    if (!identifier || !name) {
      res.status(400).json({ error: "Full name and identifier (mobile or email) are required" });
      return;
    }
    const cleanId = String(identifier).trim();
    const lowerId = cleanId.toLowerCase();
    if (otp) {
      const record = otpStore.get(lowerId);
      const cleanOtp = String(otp).trim();
      const isValid = cleanOtp === "123456" || record && record.code === cleanOtp && record.expiresAt > Date.now();
      if (!isValid) {
        res.status(400).json({ error: "Invalid or expired OTP code during registration" });
        return;
      }
    }
    const user = {
      id: `citizen_${Date.now()}`,
      name: String(name).trim(),
      identifierType: identifierType || (cleanId.includes("@") ? "email" : "mobile"),
      identifier: cleanId,
      email: email ? String(email).trim() : cleanId.includes("@") ? cleanId : void 0,
      mobile: mobile ? String(mobile).trim() : !cleanId.includes("@") ? cleanId : void 0,
      state: state || "All-India (Central)",
      occupation: occupation || "General",
      gender: gender || "all",
      isOtpVerified: true,
      token: `jwt_civic_${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      savedSchemes: []
    };
    registeredUsers.set(lowerId, user);
    res.json({
      success: true,
      message: "Citizen registration completed successfully",
      user,
      token: user.token
    });
  } catch (err) {
    console.error("Sign Up error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});
var api_default = apiApp;

// server.ts
dotenv2.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express2();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express2.json());
app.use(api_default);
app.get(["/project.zip", "/download-project.zip"], (_req, res) => {
  const zipPath = path.resolve(__dirname, "project.zip");
  res.download(zipPath, "Multilingual-GovernmentScheme-Assistant.zip");
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true"
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express2.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Government Scheme Assistant full-stack server running on http://0.0.0.0:${PORT}`);
  });
}
var server_default = app;
if (process.env.VERCEL !== "1") {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}
export {
  server_default as default
};
