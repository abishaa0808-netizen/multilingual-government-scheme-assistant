import { SECTORS, STATES_AND_UTS } from '../data/constants.ts';

export interface ParsedIntent {
  sector?: string;
  cleanQuery: string;
  state?: string;
  audience?: string;
  hasRelevantNavigation: boolean;
  explanation: string;
}

// Multilingual and synonym sector dictionary
const SECTOR_MAPPINGS: Record<string, string[]> = {
  Education: [
    'education', 'educational', 'college', 'university', 'student', 'students', 'scholarship', 'scholarships',
    'school', 'schools', 'study', 'studies', 'tuition', 'degree', 'diploma', 'higher education',
    // Hindi / Devanagari
    'शिक्षा', 'शिक्षण', 'कॉलेज', 'छात्र', 'छात्रों', 'छात्रा', 'छात्रवृत्ति', 'स्कॉलरशिप', 'पढ़ाई', 'विश्वविद्यालय',
    // Tamil
    'கல்வி', 'கல்லூரி', 'மாணவர்', 'மாணவர்கள்', 'மாணவிகள்', 'உதவித்தொகை', 'பள்ளி',
    // Telugu
    'విద్య', 'కళాశాల', 'కాలేజ్', 'విద్యార్థి', 'విద్యార్థులు', 'స్కాలర్‌షిప్', 'బడి',
    // Bengali
    'শিক্ষা', 'কলেজ', 'ছাত্র', 'ছাত্রী', 'ছাত্রছাত্রী', 'বৃত্তি', 'স্কলারশিপ', 'বিদ্যালয়',
    // Marathi
    'शिक्षण', 'महाविद्यालय', 'विद्यार्थी', 'शिष्यवृत्ती',
    // Gujarati
    'શિક્ષણ', 'કોલેજ', 'વિદ્યાર્થી', 'શિષ્યવૃત્તિ',
    // Kannada
    'ಶಿಕ್ಷಣ', 'ಕಾಲೇಜು', 'ವಿದ್ಯಾರ್ಥಿ', 'ವಿದ್ಯಾರ್ಥಿಗಳು', 'ವಿದ್ಯಾರ್ಥಿವೇತನ',
    // Malayalam
    'വിദ്യാഭ്യാസം', 'കോളേജ്', 'വിദ്യാർത്ഥി', 'വിദ്യാർത്ഥികൾ', 'സ്കോളർഷിപ്പ്',
    // Odia
    'ଶିକ୍ଷା', 'କଲେଜ', 'ଛାତ୍ର', 'ଛାତ୍ରୀ', 'ଛାତ୍ରବୃତ୍ତି',
    // Urdu
    'تعلیم', 'کالج', 'طلباء', 'طالب علم', 'وظیفہ',
  ],

  Healthcare: [
    'healthcare', 'health', 'hospital', 'medical', 'medicine', 'medicines', 'ayushman', 'treatment',
    'doctor', 'disease', 'surgery', 'clinic', 'wellness', 'swasthya', 'arogya',
    'स्वास्थ्य', 'चिकित्सा', 'अस्पताल', 'इलाज', 'आयुष्मान', 'दवा',
    'மருத்துவம்', 'சுகாதாரம்', 'மருத்துவமனை', 'சிகிச்சை',
    'ఆరోగ్యం', 'వైద్యం', 'ఆసుపత్రి', 'చికిత్స',
    'স্বাস্থ্য', 'চিকিৎসা', 'হাসপাতাল',
    'आरोग्य', 'रुग्णालय', 'उपचार',
    'સ્વાસ્થ્ય', 'હોસ્પિટલ', 'સારવાર',
    'ಆರೋಗ್ಯ', 'ಆಸ್ಪತ್ರೆ', 'ಚಿಕಿತ್ಸೆ',
    'ആരോഗ്യം', 'ആശുപത്രി', 'ചികിത്സ',
    'ସ୍ୱାସ୍ଥ୍ୟ', 'ଡାକ୍ତରଖାନା', 'ଚିକିତ୍ସା',
    'صحت', 'ہسپتال', 'علاج',
  ],

  Agriculture: [
    'agriculture', 'agricultural', 'farming', 'farmer', 'farmers', 'crop', 'crops', 'kisan',
    'fertilizer', 'seed', 'irrigation', 'harvest', 'tractor', 'krishi',
    'कृषि', 'किसान', 'किसानों', 'खेती', 'फसल', 'सिंचाई',
    'விவசாயம்', 'விவசாயி', 'விவசாயிகள்', 'பயிர்',
    'వ్యవసాయం', 'రైతు', 'రైతులు', 'పంట',
    'কৃষি', 'কৃষক', 'ফসল',
    'शेती', 'शेतकरी', 'पीक',
    'ખેતી', 'ખેડૂત', 'પાક',
    'ಕೃಷಿ', 'ರೈತ', 'ರೈತರು', 'ಬೆಳೆ',
    'കൃഷി', 'കർഷകൻ', 'കർഷകർ',
    'କୃଷି', 'କୃଷକ', 'ଚାଷୀ',
    'زراعت', 'کسان', 'کھیتی',
  ],

  Employment: [
    'employment', 'job', 'jobs', 'unemployed', 'recruitment', 'work', 'career', 'rojgar', 'naukri',
    'रोजगार', 'नौकरी', 'बेरोजगार', 'काम',
    'வேலைவாய்ப்பு', 'வேலை',
    'ఉపాధి', 'ఉద్యోగం',
    'কর্মসংস্থান', 'চাকরি',
    'नोकरी', 'रोजगार',
    'રોજગાર', 'નોકરી',
    'ಉದ್ಯೋಗ', 'ಕೆಲಸ',
    'തൊഴിൽ', 'ജോലി',
    'ନିଯୁକ୍ତି', 'ଚାକିରି',
    'روزگار', 'ملازمت',
  ],

  'Skill Development': [
    'skill development', 'skill', 'skills', 'training', 'vocational', 'iti', 'upskilling', 'kaushal',
    'कौशल', 'कौशल विकास', 'प्रशिक्षण',
    'திறன் மேம்பாடு', 'பயிற்சி',
    'నైపుణ్యాభివృద్ధి', 'శిక్షణ',
  ],

  Housing: [
    'housing', 'house', 'houses', 'home', 'homes', 'shelter', 'awas', 'pradhan mantri awas',
    'आवास', 'घर', 'मकान', 'रहने का घर',
    'வீட்டு வசதி', 'வீடு',
    'గృహ', 'ఇల్లు',
    'আবাসন', 'বাড়ি',
    'गृहनिर्माण', 'घर',
    'આવાસ', 'ઘર',
  ],

  'Women & Child Welfare': [
    'women', 'woman', 'girl', 'girls', 'child', 'children', 'mother', 'mothers', 'widow', 'maternity',
    'beti', 'mahila', 'matru', 'balika',
    'महिला', 'स्त्री', 'बेटी', 'बच्चे', 'बालिका', 'मातृ',
    'மகளிர்', 'பெண்கள்', 'குழந்தை',
    'మహిళ', 'స్త్రీ', 'పిల్లలు',
    'নারী', 'মহিলা', 'শিশু',
  ],

  'Senior Citizens': [
    'senior citizen', 'senior citizens', 'elderly', 'old age', 'aged', 'vridh', 'varishtha',
    'वरिष्ठ नागरिक', 'बुजुर्ग', 'वृद्धावस्था',
    'முதியோர்', 'மூத்த குடிமக்கள்',
    'వృద్ధులు',
  ],

  'Disability Support': [
    'disability', 'disabled', 'handicapped', 'specially abled', 'divyang', 'pwd',
    'दिव्यांग', 'विकलांग',
    'மாற்றுத்திறனாளிகள்',
    'వికలాంగులు',
  ],

  'Financial Support': [
    'financial support', 'finance', 'loan', 'loans', 'credit', 'subsidy', 'grant', 'mudra', 'banking',
    'वित्तीय', 'ऋण', 'लोन', 'सब्सिडी', 'अनुदान', 'मुद्रा',
    'நிதி உதவி', 'கடன்', 'மானியங்கள்',
    'ఆర్థిక సహాయం', 'రుణం', 'సబ్సిడీ',
  ],

  Entrepreneurship: [
    'entrepreneurship', 'entrepreneur', 'startup', 'startups', 'business', 'venture', 'self employed',
    'उद्यमिता', 'स्टार्टअप', 'व्यापार', 'व्यवसाय',
  ],

  'Pension & Social Security': [
    'pension', 'pensions', 'social security', 'atal pension', 'epfo',
    'पेंशन', 'सामाजिक सुरक्षा',
    'ஓய்வூதியம்',
    'పెన్షన్',
  ],

  'Energy & Utilities': [
    'energy', 'electricity', 'power', 'solar', 'pm surya ghar', 'utility', 'utilities', 'gas', 'ujjwala',
    'ऊर्जा', 'बिजली', 'सौर ऊर्जा', 'गैस', 'उज्ज्वला',
  ],

  MSME: [
    'msme', 'small business', 'enterprise', 'enterprises', 'micro enterprise', 'industry',
    'सूक्ष्म लघु मध्यम उद्यम', 'उद्योग',
  ],
};

// Conversational filler phrases to strip away
const FILLER_PATTERNS = [
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
  /enaku venum/gi,
];

// Target audience identifiers
const AUDIENCE_PATTERNS: Array<{ regex: RegExp; label: string; keywords: string }> = [
  { regex: /college student(s)?/i, label: 'College Students', keywords: 'college students' },
  { regex: /university student(s)?/i, label: 'University Students', keywords: 'college university students' },
  { regex: /school student(s)?/i, label: 'School Students', keywords: 'school students' },
  { regex: /student(s)?|छात्र|மாணவர்|విద్యార్థి/i, label: 'Students', keywords: 'students' },
  { regex: /farmer(s)?|kisan|किसान|விவசாயி|రైతు/i, label: 'Farmers', keywords: 'farmers' },
  { regex: /women|woman|girl(s)?|महिला|மகளிர்|మహిళ/i, label: 'Women', keywords: 'women' },
  { regex: /senior citizen(s)?|elderly|old age|वरिष्ठ नागरिक|முதியோர்/i, label: 'Senior Citizens', keywords: 'senior citizens' },
  { regex: /specially abled|disabled|divyang|दिव्यांग|மாற்றுத்திறனாளிகள்/i, label: 'Specially Abled (Divyangjan)', keywords: 'specially abled' },
  { regex: /startup(s)?|entrepreneur(s)?|उद्यमी/i, label: 'Entrepreneurs & Startups', keywords: 'startup entrepreneur' },
  { regex: /job seeker(s)?|unemployed|बेरोजगार/i, label: 'Job Seekers & Youth', keywords: 'unemployed youth' },
];

/**
 * Parses natural language input (from Voice Assistant or Virtual Keyboard)
 * into a structured navigation intent (Sector, Clean Query, State, Audience).
 */
export function parseNaturalLanguageIntent(input: string): ParsedIntent {
  if (!input || !input.trim()) {
    return {
      cleanQuery: '',
      hasRelevantNavigation: false,
      explanation: '',
    };
  }

  const rawLower = input.toLowerCase().trim();

  // 1. Detect State
  let detectedState: string | undefined;
  for (const st of STATES_AND_UTS) {
    if (st !== 'All-India (Central)' && rawLower.includes(st.toLowerCase())) {
      detectedState = st;
      break;
    }
  }

  // 2. Detect Sector
  let detectedSector: string | undefined;
  for (const [secName, synonyms] of Object.entries(SECTOR_MAPPINGS)) {
    for (const syn of synonyms) {
      const lowerSyn = syn.toLowerCase();
      // Whole word or direct phrase match
      const synRegex = new RegExp(`(^|[\\s,.;!?])${lowerSyn}([\\s,.;!?]|$)`, 'i');
      if (synRegex.test(rawLower) || rawLower.includes(lowerSyn)) {
        detectedSector = secName;
        break;
      }
    }
    if (detectedSector) break;
  }

  // 3. Detect Target Audience
  let detectedAudience: string | undefined;
  let audienceKeywords = '';
  for (const aud of AUDIENCE_PATTERNS) {
    if (aud.regex.test(input)) {
      detectedAudience = aud.label;
      audienceKeywords = aud.keywords;
      break;
    }
  }

  // 4. Clean Query of conversational fillers
  let cleaned = input;
  for (const pat of FILLER_PATTERNS) {
    cleaned = cleaned.replace(pat, ' ');
  }

  // Remove detected state and sector words from search keywords if already isolated
  if (detectedState) {
    cleaned = cleaned.replace(new RegExp(detectedState, 'gi'), ' ');
  }
  if (detectedSector) {
    cleaned = cleaned.replace(new RegExp(detectedSector, 'gi'), ' ');
  }

  // Clean extra spaces & punctuation
  cleaned = cleaned.replace(/[?.,!():/\\-]/g, ' ').replace(/\s+/g, ' ').trim();

  // If cleaning stripped everything, fall back to audience keywords or the original query
  if (!cleaned && audienceKeywords) {
    cleaned = audienceKeywords;
  } else if (!cleaned && detectedSector) {
    cleaned = audienceKeywords || '';
  }

  const hasRelevantNavigation = Boolean(detectedSector || detectedState || detectedAudience || cleaned.length > 2);

  // Build human-friendly explanation
  const parts: string[] = [];
  if (detectedSector) parts.push(`Sector: ${detectedSector}`);
  if (detectedAudience) parts.push(`Audience: ${detectedAudience}`);
  if (detectedState) parts.push(`State: ${detectedState}`);
  if (cleaned && cleaned !== audienceKeywords) parts.push(`Keyword: "${cleaned}"`);

  const explanation = parts.length > 0
    ? parts.join(' • ')
    : `Search: "${input.trim()}"`;

  return {
    sector: detectedSector,
    cleanQuery: cleaned || audienceKeywords || '',
    state: detectedState,
    audience: detectedAudience,
    hasRelevantNavigation,
    explanation,
  };
}
