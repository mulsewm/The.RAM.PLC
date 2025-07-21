// Exchange rates (as per requirements)
const EXCHANGE_RATES = {
  AED_TO_ETB: 45,
  QAR_TO_ETB: 45,
  USD_TO_ETB: 50,
  AED_TO_USD: 0.27,
  AED_TO_QAR: 1, // 1:1 fixed rate for simplicity
} as const;

// Helper functions for currency conversion
export const convertAEDtoETB = (aed: number): number => Math.round(aed * EXCHANGE_RATES.AED_TO_ETB);
export const convertQARtoETB = (qar: number): number => Math.round(qar * EXCHANGE_RATES.QAR_TO_ETB);
export const convertUSDtoETB = (usd: number): number => Math.round(usd * EXCHANGE_RATES.USD_TO_ETB);
export const convertAEDtoQAR = (aed: number): number => Math.round(aed * EXCHANGE_RATES.AED_TO_QAR);

// Types
export interface FeeItem {
  name: string;
  amountAED?: number;
  amountQAR?: number;
  amountETB?: number;
  amountUSD?: number;
  note?: string;
  description?: string;
}

export interface Package {
  title: string;
  description: string;
  requirements: string[];
  priceAED: number;
  priceETB: number;
  priceQAR: number;
  note?: string;
  category?: 'physician' | 'non-physician' | 'other';
}

// Helper function to add all currency conversions
const withAllCurrencies = <T extends { amountETB?: number; amountQAR?: number; amountAED?: number; amountUSD?: number }>(
  item: T
): T & { amountETB: number; amountQAR: number; amountAED: number; amountUSD: number } => {
  // If ETB is provided, calculate others
  if (item.amountETB !== undefined) {
    return {
      ...item,
      amountETB: item.amountETB,
      amountAED: Math.round((item.amountETB / EXCHANGE_RATES.AED_TO_ETB) * 100) / 100,
      amountQAR: Math.round((item.amountETB / EXCHANGE_RATES.QAR_TO_ETB) * 100) / 100,
      amountUSD: Math.round((item.amountETB / EXCHANGE_RATES.USD_TO_ETB) * 100) / 100,
    } as any;
  }
  // If AED is provided, calculate others
  else if (item.amountAED !== undefined) {
    return {
      ...item,
      amountAED: item.amountAED,
      amountETB: convertAEDtoETB(item.amountAED),
      amountQAR: convertAEDtoQAR(item.amountAED),
      amountUSD: Math.round((item.amountAED * EXCHANGE_RATES.AED_TO_USD) * 100) / 100,
    } as any;
  }
  // If QAR is provided, calculate others
  else if (item.amountQAR !== undefined) {
    return {
      ...item,
      amountQAR: item.amountQAR,
      amountETB: convertQARtoETB(item.amountQAR),
      amountAED: item.amountQAR, // 1:1 with AED
      amountUSD: Math.round((item.amountQAR * EXCHANGE_RATES.AED_TO_USD) * 100) / 100, // Same as AED conversion
    } as any;
  }
  // If USD is provided, calculate others
  else if (item.amountUSD !== undefined) {
    const aed = item.amountUSD / EXCHANGE_RATES.AED_TO_USD;
    return {
      ...item,
      amountUSD: item.amountUSD,
      amountAED: Math.round(aed * 100) / 100,
      amountQAR: Math.round(aed * 100) / 100, // 1:1 with AED
      amountETB: convertAEDtoETB(aed),
    } as any;
  }
  
  // If no currency is provided, return with all set to 0
  return {
    ...item,
    amountAED: 0,
    amountQAR: 0,
    amountETB: 0,
    amountUSD: 0,
  } as any;
};

// Section 1: Nursing Professionals
export const nursingFees: FeeItem[] = [
  { name: 'DHA DataFlow', amountAED: 1666.67, description: 'Primary Source Verification for DHA' },
  { name: 'DHA Exam Scheduling Fee', amountAED: 1111.11, description: 'Exam scheduling fee for DHA' },
  { name: 'DHA Exam Fee', amountAED: 2000.00, description: 'Computer-based test fee for DHA' },
  { name: 'DOH DataFlow', amountAED: 1500.00, description: 'Primary Source Verification for DOH' },
  { name: 'DOH Exam Fee', amountAED: 1800.00, description: 'Computer-based test fee for DOH' },
  { name: 'HAAD DataFlow', amountAED: 1750.00, description: 'Primary Source Verification for HAAD' },
  { name: 'HAAD Exam Fee', amountAED: 1900.00, description: 'Computer-based test fee for HAAD' },
  { name: 'QCHP DataFlow', amountQAR: 1500.00, description: 'Primary Source Verification for QCHP' },
  { name: 'QCHP Exam Fee', amountQAR: 2000.00, description: 'Computer-based test fee for QCHP' },
  { name: 'MOH DataFlow', amountAED: 1600.00, description: 'Primary Source Verification for MOH' },
  { name: 'MOH Exam Fee', amountAED: 1750.00, description: 'Computer-based test fee for MOH' },
].map(withAllCurrencies);

// Helper to create DataFlow packages with all required fields
const createDataFlowPackage = (
  title: string,
  description: string,
  requirements: string[],
  priceAED: number,
  category: 'physician' | 'non-physician' | 'other',
  note?: string
): Package => {
  const priceETB = convertAEDtoETB(priceAED);
  const priceQAR = convertAEDtoQAR(priceAED);
  
  return {
    title,
    description,
    requirements,
    priceAED,
    priceETB,
    priceQAR,
    note,
    category,
  };
};

// Section 4: DataFlow Verification Fee Structure
export const dataFlowPackages: Package[] = [
  // Physician Packages
  createDataFlowPackage(
    'Physician - Basic',
    'Basic verification package for physicians',
    ['Medical Degree', 'Internship Certificate', 'Medical License', 'Good Standing Certificate'],
    2000.00,
    'physician',
    'Additional charges may apply for extra documents'
  ),
  createDataFlowPackage(
    'Physician - Comprehensive',
    'Complete verification package for physicians',
    ['Medical Degree', 'Internship Certificate', 'Medical License', 'Good Standing Certificate', 'Experience Certificates', 'Specialty Certificate'],
    3000.00,
    'physician',
    'Includes up to 8 documents'
  ),
  
  // Non-Physician Packages
  createDataFlowPackage(
    'Nurse - Basic',
    'Basic verification package for nurses',
    ['Nursing Diploma/Degree', 'Registration/License', 'Experience Certificates'],
    1500.00,
    'non-physician',
    'Additional charges may apply for extra documents'
  ),
  createDataFlowPackage(
    'Nurse - Comprehensive',
    'Complete verification package for nurses',
    ['Nursing Diploma/Degree', 'Registration/License', 'Experience Certificates', 'Training Certificates', 'BLS/ACLS'],
    2500.00,
    'non-physician',
    'Includes up to 8 documents'
  ),
  
  // Other Healthcare Professionals
  createDataFlowPackage(
    'Allied Health Professional',
    'Verification package for allied health professionals',
    ['Degree/Diploma', 'License/Registration', 'Experience Certificates'],
    1800.00,
    'other',
    'For physiotherapists, lab technicians, etc.'
  ),
];

// Section 3: Exam Fees
export const examFees = {
  dha: [
    { name: 'DHA Exam - General Practitioner', amountAED: 2000.00, description: 'Computer-based test for GPs' },
    { name: 'DHA Exam - Specialist', amountAED: 2500.00, description: 'Computer-based test for Specialists' },
  ].map(withAllCurrencies),
  
  doh: [
    { name: 'DOH Exam - All Categories', amountAED: 1800.00, description: 'Computer-based test for all categories' },
  ].map(withAllCurrencies),
  
  haad: [
    { name: 'HAAD Exam - All Categories', amountAED: 1900.00, description: 'Computer-based test for all categories' },
  ].map(withAllCurrencies),
  
  qchp: [
    { name: 'QCHP Exam - All Categories', amountQAR: 2000.00, description: 'Computer-based test for all categories' },
  ].map(withAllCurrencies),
  
  moh: [
    { name: 'MOH Exam - All Categories', amountAED: 1750.00, description: 'Computer-based test for all categories' },
  ].map(withAllCurrencies),
} as const;

// Calculate exam totals dynamically
export function calculateExamTotal(authority: keyof typeof examFees, type?: 'general' | 'specialist') {
  const fees = examFees[authority];
  
  // For DHA, we have different fees for general and specialists
  if (authority === 'dha' && type) {
    const fee = fees.find(f => 
      type === 'general' 
        ? f.name.includes('General Practitioner') 
        : f.name.includes('Specialist')
    );
    
    if (!fee) return { amountAED: 0, amountQAR: 0, amountETB: 0 };
    
    // For QCHP, we need to handle QAR separately
    const totalAED = authority !== 'qchp' ? (fee.amountAED || 0) : 0;
    const totalQAR = authority === 'qchp' ? (fee.amountQAR || 0) : 0;
    
    return {
      amountAED: authority !== 'qchp' ? totalAED : undefined,
      amountQAR: authority === 'qchp' ? totalQAR : undefined,
      amountETB: authority !== 'qchp' 
        ? convertAEDtoETB(totalAED) 
        : convertQARtoETB(totalQAR)
    };
  }
  
  // For other authorities, calculate based on available fees
  const totalAED = fees.reduce((sum, fee) => sum + (fee.amountAED || 0), 0);
  const totalQAR = fees.reduce((sum, fee) => sum + (fee.amountQAR || 0), 0);
  
  return {
    amountAED: authority !== 'qchp' ? totalAED : undefined,
    amountQAR: authority === 'qchp' ? totalQAR : undefined,
    amountETB: authority !== 'qchp' 
      ? convertAEDtoETB(totalAED) 
      : convertQARtoETB(totalQAR)
  };
}

// Pre-calculated exam totals for convenience
export const examTotals = {
  dha: {
    general: calculateExamTotal('dha', 'general'),
    specialist: calculateExamTotal('dha', 'specialist'),
  },
  haad: {
    general: calculateExamTotal('haad'),
  },
  qchp: {
    general: calculateExamTotal('qchp'),
  },
  moh: {
    general: calculateExamTotal('moh'),
  },
  doh: {
    general: calculateExamTotal('doh'),
  },
};

export const generalNotes = [
  'All fees are subject to change without prior notice.',
  'Additional charges may apply for expedited processing.',
  'Prices are inclusive of VAT where applicable.',
  'Payment is required in full before processing begins.',
  'Refunds are not available once processing has started.',
];

// Required documents for application
export const requiredDocuments = [
  'Passport copy (valid for at least 6 months)',
  'Passport size photo (white background)',
  'Educational certificates and transcripts',
  'Professional license/registration',
  'Experience certificates',
  'Good Standing Certificate from previous employer',
  'DataFlow report (if available)',
  'IELTS/OET score sheet (if applicable)'
];

// Process steps for application
export const processSteps = [
  {
    title: 'Document Submission',
    description: 'Submit all required documents for verification'
  },
  {
    title: 'Primary Source Verification',
    description: 'Documents are verified through DataFlow or other verification services'
  },
  {
    title: 'Eligibility Assessment',
    description: 'Your qualifications are assessed against the requirements'
  },
  {
    title: 'Exam Registration',
    description: 'Register for the required licensing exam'
  },
  {
    title: 'License Issuance',
    description: 'Receive your professional license upon successful completion'
  }
];
