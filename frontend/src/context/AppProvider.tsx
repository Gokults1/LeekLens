import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
type Language = 'en' | 'ta' | 'hi' | 'kn';
type Theme = 'india' | 'night' | 'terminal';

interface I18nContent {
  nav_how_it_works: string;
  nav_security: string;
  nav_scan_now: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  scan_placeholder: string;
  scan_button: string;
  scanning: string;
  error_server: string;
  results_breaches_found: string;
  results_no_breaches: string;
  results_timeline: string;
  results_recommendations: string;
  editorial: {
    lives_title: string;
    data_desc: string;
    nation_title_1: string;
    nation_title_2: string;
    nation_desc: string;
    bottom_title_1: string;
    bottom_title_2: string;
    student: string;
    dev: string;
    biz: string;
    commuter: string;
    security_report: string;
    exposures: string;
    no_exposures: string;
    risk_score: string;
    risk: string;
    accounts: string;
  };
  dynamic: {
    passwords: string;
    email_addresses: string;
    phone_numbers: string;
    usernames: string;
    financial_information: string;
    physical_addresses: string;
    ip_addresses: string;
    names: string;
    rec_pass: string;
    rec_2fa: string;
    rec_mon: string;
    rec_phish: string;
    rec_fin: string;
  };
}

const translations: Record<Language, I18nContent> = {
  en: {
    nav_how_it_works: "How it works",
    nav_security: "Security",
    nav_scan_now: "Scan Now",
    hero_title_1: "SAME INTERNET.",
    hero_title_2: "A SAFER INDIA.",
    hero_subtitle: "Your digital identity travels farther than you think.",
    scan_placeholder: "Enter your email address",
    scan_button: "SCAN EXPOSURE",
    scanning: "Scanning...",
    error_server: "Failed to connect to the database.",
    results_breaches_found: "BREACHES FOUND",
    results_no_breaches: "No known breaches found for this email address. Your identity is safe.",
    results_timeline: "BREACH TIMELINE",
    results_recommendations: "SECURITY RECOMMENDATIONS",
    editorial: {
      lives_title: "Different lives.\nSame network.",
      data_desc: "Your data travels farther than you think. One digital identity propagates through countless unknown systems.",
      nation_title_1: "ONE NATION.",
      nation_title_2: "MANY STORIES.",
      nation_desc: "From personal messages to financial records, a single breach in one system ripples across the entire country's digital ecosystem.",
      bottom_title_1: "WHAT DOES THE INTERNET",
      bottom_title_2: "KNOW ABOUT YOU?",
      student: "STUDENT", dev: "DEVELOPER", biz: "BUSINESS OWNER", commuter: "COMMUTER",
      security_report: "Security Report", exposures: "EXPOSURES", no_exposures: "NO EXPOSURES", risk_score: "RISK SCORE", risk: "RISK", accounts: "accounts"
    },
    dynamic: {
      passwords: "Passwords", email_addresses: "Email addresses", phone_numbers: "Phone numbers", usernames: "Usernames",
      financial_information: "Financial info", physical_addresses: "Physical addresses", ip_addresses: "IP addresses", names: "Names",
      rec_pass: "Change your passwords immediately.", rec_2fa: "Enable Two-Factor Authentication (2FA).",
      rec_mon: "Monitor your accounts for suspicious activity.", rec_phish: "Be alert for phishing emails.", rec_fin: "Monitor your bank statements."
    }
  },
  ta: {
    nav_how_it_works: "எப்படி செயல்படுகிறது", nav_security: "பாதுகாப்பு", nav_scan_now: "ஸ்கேன் செய்",
    hero_title_1: "அதே இணையம்.", hero_title_2: "பாதுகாப்பான இந்தியா.", hero_subtitle: "உங்கள் டிஜிட்டல் அடையாளம் வெகுதூரம் பயணிக்கிறது.",
    scan_placeholder: "உங்கள் மின்னஞ்சல் முகவரி", scan_button: "ஸ்கேன் செய்", scanning: "ஸ்கேன் செய்யப்படுகிறது...",
    error_server: "தரவுத்தளத்துடன் இணைக்க முடியவில்லை.", results_breaches_found: "மீறல்கள்",
    results_no_breaches: "எந்த தரவு மீறலும் இல்லை. பாதுகாப்பானது.", results_timeline: "காலவரிசை", results_recommendations: "பரிந்துரைகள்",
    editorial: {
      lives_title: "வெவ்வேறு வாழ்க்கைகள்.\nஒரே வலையமைப்பு.",
      data_desc: "உங்கள் தரவு நீங்கள் நினைப்பதை விட வெகுதூரம் பயணிக்கிறது. பல அமைப்புகளில் உங்கள் டிஜிட்டல் அடையாளம் பரவுகிறது.",
      nation_title_1: "ஒரே நாடு.",
      nation_title_2: "பல கதைகள்.",
      nation_desc: "தனிப்பட்ட செய்திகள் முதல் நிதி பதிவுகள் வரை, ஒரு மீறல் நாடு முழுவதும் எதிரொலிக்கிறது.",
      bottom_title_1: "இணையத்திற்கு உங்களைப் பற்றி",
      bottom_title_2: "என்ன தெரியும்?",
      student: "மாணவர்", dev: "டெவலப்பர்", biz: "வியாபாரி", commuter: "பயணி",
      security_report: "பாதுகாப்பு அறிக்கை", exposures: "வெளிப்பாடுகள்", no_exposures: "வெளிப்பாடுகள் இல்லை", risk_score: "ஆபத்து மதிப்பெண்", risk: "ஆபத்து", accounts: "கணக்குகள்"
    },
    dynamic: {
      passwords: "கடவுச்சொற்கள்", email_addresses: "மின்னஞ்சல்கள்", phone_numbers: "தொலைபேசி எண்கள்", usernames: "பயனர்பெயர்கள்",
      financial_information: "நிதி தகவல்", physical_addresses: "முகவரிகள்", ip_addresses: "ஐபி முகவரிகள்", names: "பெயர்கள்",
      rec_pass: "உங்கள் கடவுச்சொற்களை உடனடியாக மாற்றவும்.", rec_2fa: "இரண்டு காரணி அங்கீகாரத்தை இயக்கவும் (2FA).",
      rec_mon: "சந்தேகத்திற்கிடமான செயல்களை கண்காணிக்கவும்.", rec_phish: "ஃபிஷிங் மின்னஞ்சல்கள் குறித்து எச்சரிக்கையாக இருங்கள்.", rec_fin: "வங்கி அறிக்கைகளை கண்காணிக்கவும்."
    }
  },
  hi: {
    nav_how_it_works: "कैसे काम करता है", nav_security: "सुरक्षा", nav_scan_now: "स्कैन करें",
    hero_title_1: "वही इंटरनेट।", hero_title_2: "सुरक्षित भारत।", hero_subtitle: "आपकी डिजिटल पहचान बहुत दूर तक जाती है।",
    scan_placeholder: "अपना ईमेल पता दर्ज करें", scan_button: "स्कैन करें", scanning: "स्कैन हो रहा है...",
    error_server: "डेटाबेस से कनेक्ट करने में विफल।", results_breaches_found: "उल्लंघन मिले",
    results_no_breaches: "कोई उल्लंघन नहीं मिला। आप सुरक्षित हैं।", results_timeline: "समयरेखा", results_recommendations: "अनुशंसाएँ",
    editorial: {
      lives_title: "अलग-अलग जीवन।\nएक ही नेटवर्क।",
      data_desc: "आपका डेटा आपकी सोच से कहीं अधिक दूर तक जाता है। एक डिजिटल पहचान अनगिनत प्रणालियों में फैलती है।",
      nation_title_1: "एक देश।",
      nation_title_2: "कई कहानियाँ।",
      nation_desc: "व्यक्तिगत संदेशों से लेकर वित्तीय रिकॉर्ड तक, एक प्रणाली में उल्लंघन पूरे देश के पारिस्थितिकी तंत्र में फैलता है।",
      bottom_title_1: "इंटरनेट आपके बारे में",
      bottom_title_2: "क्या जानता है?",
      student: "छात्र", dev: "डेवलपर", biz: "व्यवसायी", commuter: "यात्री",
      security_report: "सुरक्षा रिपोर्ट", exposures: "एक्सपोज़र", no_exposures: "कोई एक्सपोज़र नहीं", risk_score: "जोखिम स्कोर", risk: "जोखिम", accounts: "खाते"
    },
    dynamic: {
      passwords: "पासवर्ड", email_addresses: "ईमेल पते", phone_numbers: "फोन नंबर", usernames: "उपयोगकर्ता नाम",
      financial_information: "वित्तीय जानकारी", physical_addresses: "पते", ip_addresses: "आईपी पते", names: "नाम",
      rec_pass: "अपने पासवर्ड तुरंत बदलें।", rec_2fa: "टू-फैक्टर ऑथेंटिकेशन (2FA) सक्षम करें।",
      rec_mon: "संदिग्ध गतिविधि की निगरानी करें।", rec_phish: "फ़िशिंग ईमेल से सावधान रहें।", rec_fin: "बैंक स्टेटमेंट की निगरानी करें।"
    }
  },
  kn: {
    nav_how_it_works: "ಕಾರ್ಯನಿರ್ವಹಣೆ", nav_security: "ಭದ್ರತೆ", nav_scan_now: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    hero_title_1: "ಒಂದೇ ಇಂಟರ್ನೆಟ್.", hero_title_2: "ಸುರಕ್ಷಿತ ಭಾರತ.", hero_subtitle: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಗುರುತು ದೂರ ಪ್ರಯಾಣಿಸುತ್ತದೆ.",
    scan_placeholder: "ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ", scan_button: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", scanning: "ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    error_server: "ಸಂಪರ್ಕಿಸಲು ವಿಫಲವಾಗಿದೆ.", results_breaches_found: "ಉಲ್ಲಂಘನೆಗಳು",
    results_no_breaches: "ಯಾವುದೇ ಉಲ್ಲಂಘನೆಗಳಿಲ್ಲ. ಸುರಕ್ಷಿತವಾಗಿದೆ.", results_timeline: "ಟೈಮ್‌ಲೈನ್", results_recommendations: "ಶಿಫಾರಸುಗಳು",
    editorial: {
      lives_title: "ವಿವಿಧ ಜೀವನಗಳು.\nಒಂದೇ ನೆಟ್‌ವರ್ಕ್.",
      data_desc: "ನಿಮ್ಮ ಡೇಟಾ ನೀವು ಯೋಚಿಸುವುದಕ್ಕಿಂತ ದೂರ ಪ್ರಯಾಣಿಸುತ್ತದೆ. ಅಸಂಖ್ಯಾತ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಹರಡುತ್ತದೆ.",
      nation_title_1: "ಒಂದು ರಾಷ್ಟ್ರ.",
      nation_title_2: "ಹಲವು ಕಥೆಗಳು.",
      nation_desc: "ವೈಯಕ್ತಿಕ ಸಂದೇಶಗಳಿಂದ ಹಿಡಿದು ಹಣಕಾಸಿನ ದಾಖಲೆಗಳವರೆಗೆ, ಒಂದು ಉಲ್ಲಂಘನೆಯು ಇಡೀ ದೇಶದ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯಾದ್ಯಂತ ಹರಡುತ್ತದೆ.",
      bottom_title_1: "ಇಂಟರ್ನೆಟ್ ನಿಮ್ಮ ಬಗ್ಗೆ",
      bottom_title_2: "ಏನು ತಿಳಿದಿದೆ?",
      student: "ವಿದ್ಯಾರ್ಥಿ", dev: "ಡೆವಲಪರ್", biz: "ವ್ಯಾಪಾರಿ", commuter: "ಪ್ರಯಾಣಿಕ",
      security_report: "ಭದ್ರತಾ ವರದಿ", exposures: "ಎಕ್ಸ್‌ಪೋಸರ್‌ಗಳು", no_exposures: "ಯಾವುದೇ ಎಕ್ಸ್‌ಪೋಸರ್‌ಗಳಿಲ್ಲ", risk_score: "ರಿಸ್ಕ್ ಸ್ಕೋರ್", risk: "ರಿಸ್ಕ್", accounts: "ಖಾತೆಗಳು"
    },
    dynamic: {
      passwords: "ಪಾಸ್ವರ್ಡ್ಗಳು", email_addresses: "ಇಮೇಲ್ ವಿಳಾಸಗಳು", phone_numbers: "ಫೋನ್ ಸಂಖ್ಯೆಗಳು", usernames: "ಬಳಕೆದಾರಹೆಸರುಗಳು",
      financial_information: "ಹಣಕಾಸಿನ ಮಾಹಿತಿ", physical_addresses: "ವಿಳಾಸಗಳು", ip_addresses: "ಐಪಿ ವಿಳಾಸಗಳು", names: "ಹೆಸರುಗಳು",
      rec_pass: "ಪಾಸ್ವರ್ಡ್ ಬದಲಾಯಿಸಿ.", rec_2fa: "2FA ಸಕ್ರಿಯಗೊಳಿಸಿ.",
      rec_mon: "ಖಾತೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.", rec_phish: "ಫಿಶಿಂಗ್ ಬಗ್ಗೆ ಎಚ್ಚರದಿಂದಿರಿ.", rec_fin: "ಬ್ಯಾಂಕ್ ಹೇಳಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
    }
  }
};

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: I18nContent;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('leaklens_lang') as Language) || 'en';
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('leaklens_theme') as Theme) || 'india';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('leaklens_lang', newLang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('leaklens_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t: translations[lang] }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
