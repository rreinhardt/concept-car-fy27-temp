/** Waterfall enrichment mock data — types and pre-scripted results per contact. */

export interface EnrichmentSource {
  name: string
  creditCost: number
  status: 'found' | 'not_found' | 'skipped'
  resultValue?: string
  durationMs: number
}

export interface EnrichmentResult {
  contactId: number
  type: 'email' | 'phone'
  sources: EnrichmentSource[]
  validation?: { provider: string; result: 'valid' | 'invalid' | 'risky'; creditCost: number }
  finalResult: string
  finalStatus: 'verified' | 'unverified'
  totalCredits: number
}

export interface EnrichmentConfig {
  sources: { name: string; creditCost: number; enabled: boolean }[]
  validationSource?: { name: string; creditCost: number; enabled: boolean }
  stopWhen: 'verified' | 'any'
}

export const emailEnrichmentConfig: EnrichmentConfig = {
  sources: [
    { name: 'Apollo', creditCost: 1, enabled: true },
    { name: 'Icypeas', creditCost: 1, enabled: true },
    { name: 'LeadMagic', creditCost: 1, enabled: true },
    { name: 'FindyMail', creditCost: 1, enabled: true },
    { name: 'Prospeo', creditCost: 1, enabled: true },
  ],
  validationSource: { name: 'ZeroBounce', creditCost: 1, enabled: true },
  stopWhen: 'verified',
}

export const phoneEnrichmentConfig: EnrichmentConfig = {
  sources: [
    { name: 'Apollo', creditCost: 8, enabled: true },
    { name: 'SmartE', creditCost: 16, enabled: true },
    { name: 'Prospeo', creditCost: 10, enabled: true },
    { name: 'ContactOut', creditCost: 18, enabled: true },
    { name: 'LeadMagic', creditCost: 9, enabled: true },
    { name: 'FindyMail', creditCost: 10, enabled: true },
    { name: 'Global Database', creditCost: 20, enabled: true },
    { name: 'LimaData', creditCost: 16, enabled: true },
    { name: 'Datagma', creditCost: 20, enabled: true },
    { name: 'Wiza', creditCost: 16, enabled: true },
    { name: 'ByteMine', creditCost: 8, enabled: true },
    { name: 'Upcell', creditCost: 8, enabled: true },
  ],
  stopWhen: 'any',
}

/** @deprecated Use emailEnrichmentConfig or phoneEnrichmentConfig */
export const defaultEnrichmentConfig = emailEnrichmentConfig

// Pre-scripted enrichment results — each contact has a unique waterfall narrative
export const mockEnrichmentResults: Record<number, { email: EnrichmentResult; phone: EnrichmentResult }> = {
  // Contact 1 — Kenton Jast: found on 3rd source after 2 misses
  1: {
    email: {
      contactId: 1, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 320 },
        { name: 'Icypeas', creditCost: 1, status: 'not_found', durationMs: 410 },
        { name: 'LeadMagic', creditCost: 1, status: 'found', resultValue: 'kenton.jast@mercyhealth.com', durationMs: 280 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'kenton.jast@mercyhealth.com', finalStatus: 'verified', totalCredits: 4,
    },
    phone: {
      contactId: 1, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'found', resultValue: '+1 (513) 555-0142', durationMs: 250 },
        { name: 'SmartE', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (513) 555-0142', finalStatus: 'verified', totalCredits: 8,
    },
  },
  // Contact 2 — Dandre Kassler: found immediately on Apollo
  2: {
    email: {
      contactId: 2, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'found', resultValue: 'd.kassler@varianmedical.com', durationMs: 180 },
        { name: 'Icypeas', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'd.kassler@varianmedical.com', finalStatus: 'verified', totalCredits: 2,
    },
    phone: {
      contactId: 2, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 290 },
        { name: 'SmartE', creditCost: 16, status: 'found', resultValue: '+1 (650) 555-0219', durationMs: 380 },
        { name: 'Prospeo', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (650) 555-0219', finalStatus: 'verified', totalCredits: 16,
    },
  },
  // Contact 3 — Emil Runolfsson: found on 4th source, risky validation → unverified
  3: {
    email: {
      contactId: 3, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 310 },
        { name: 'Icypeas', creditCost: 1, status: 'not_found', durationMs: 420 },
        { name: 'LeadMagic', creditCost: 1, status: 'not_found', durationMs: 350 },
        { name: 'FindyMail', creditCost: 1, status: 'found', resultValue: 'emil.r@elekta.com', durationMs: 290 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'risky', creditCost: 1 },
      finalResult: 'emil.r@elekta.com', finalStatus: 'unverified', totalCredits: 5,
    },
    phone: {
      contactId: 3, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 310 },
        { name: 'SmartE', creditCost: 16, status: 'not_found', durationMs: 390 },
        { name: 'Prospeo', creditCost: 10, status: 'found', resultValue: '+1 (404) 555-0387', durationMs: 270 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (404) 555-0387', finalStatus: 'verified', totalCredits: 10,
    },
  },
  // Contact 4 — Shea Sanford: found on 2nd source
  4: {
    email: {
      contactId: 4, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 340 },
        { name: 'Icypeas', creditCost: 1, status: 'found', resultValue: 'ssanford@mayo.edu', durationMs: 270 },
        { name: 'LeadMagic', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'ssanford@mayo.edu', finalStatus: 'verified', totalCredits: 3,
    },
    phone: {
      contactId: 4, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 310 },
        { name: 'SmartE', creditCost: 16, status: 'not_found', durationMs: 400 },
        { name: 'Prospeo', creditCost: 10, status: 'not_found', durationMs: 350 },
        { name: 'ContactOut', creditCost: 18, status: 'found', resultValue: '+1 (507) 555-0198', durationMs: 260 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (507) 555-0198', finalStatus: 'verified', totalCredits: 18,
    },
  },
  // Contact 5 — Eli Bogan: found on last source (Prospeo), valid
  5: {
    email: {
      contactId: 5, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 350 },
        { name: 'Icypeas', creditCost: 1, status: 'not_found', durationMs: 410 },
        { name: 'LeadMagic', creditCost: 1, status: 'not_found', durationMs: 380 },
        { name: 'FindyMail', creditCost: 1, status: 'not_found', durationMs: 300 },
        { name: 'Prospeo', creditCost: 1, status: 'found', resultValue: 'ebogan@clevelandclinic.org', durationMs: 270 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'ebogan@clevelandclinic.org', finalStatus: 'verified', totalCredits: 6,
    },
    phone: {
      contactId: 5, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 330 },
        { name: 'SmartE', creditCost: 16, status: 'not_found', durationMs: 360 },
        { name: 'Prospeo', creditCost: 10, status: 'not_found', durationMs: 340 },
        { name: 'ContactOut', creditCost: 18, status: 'not_found', durationMs: 280 },
        { name: 'LeadMagic', creditCost: 9, status: 'found', resultValue: '+1 (216) 555-0473', durationMs: 310 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (216) 555-0473', finalStatus: 'verified', totalCredits: 9,
    },
  },
  // Contact 6 — Ford Kuhlman: found immediately on Apollo
  6: {
    email: {
      contactId: 6, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'found', resultValue: 'fkuhlman@accuray.com', durationMs: 190 },
        { name: 'Icypeas', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'fkuhlman@accuray.com', finalStatus: 'verified', totalCredits: 2,
    },
    phone: {
      contactId: 6, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'found', resultValue: '+1 (408) 555-0631', durationMs: 210 },
        { name: 'SmartE', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (408) 555-0631', finalStatus: 'verified', totalCredits: 8,
    },
  },
  // Contact 7 — Kobe Ciona: found on 2nd source, valid
  7: {
    email: {
      contactId: 7, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 300 },
        { name: 'Icypeas', creditCost: 1, status: 'found', resultValue: 'kobe.ciona@siemens-healthineers.com', durationMs: 350 },
        { name: 'LeadMagic', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'kobe.ciona@siemens-healthineers.com', finalStatus: 'verified', totalCredits: 3,
    },
    phone: {
      contactId: 7, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 290 },
        { name: 'SmartE', creditCost: 16, status: 'not_found', durationMs: 370 },
        { name: 'Prospeo', creditCost: 10, status: 'not_found', durationMs: 310 },
        { name: 'ContactOut', creditCost: 18, status: 'not_found', durationMs: 340 },
        { name: 'LeadMagic', creditCost: 9, status: 'not_found', durationMs: 290 },
        { name: 'FindyMail', creditCost: 10, status: 'found', resultValue: '+1 (484) 555-0756', durationMs: 280 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (484) 555-0756', finalStatus: 'verified', totalCredits: 10,
    },
  },
  // Contact 8 — Brighton Windler: found on 3rd source, invalid validation → unverified
  8: {
    email: {
      contactId: 8, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 320 },
        { name: 'Icypeas', creditCost: 1, status: 'not_found', durationMs: 390 },
        { name: 'LeadMagic', creditCost: 1, status: 'found', resultValue: 'bwindler@epic.com', durationMs: 260 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'invalid', creditCost: 1 },
      finalResult: 'bwindler@epic.com', finalStatus: 'unverified', totalCredits: 4,
    },
    phone: {
      contactId: 8, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'found', resultValue: '+1 (608) 555-0892', durationMs: 230 },
        { name: 'SmartE', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (608) 555-0892', finalStatus: 'verified', totalCredits: 8,
    },
  },
  // Contact 9 — Justyn Tremblay: found on Apollo, valid
  9: {
    email: {
      contactId: 9, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'found', resultValue: 'jtremblay@moffitt.org', durationMs: 170 },
        { name: 'Icypeas', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'jtremblay@moffitt.org', finalStatus: 'verified', totalCredits: 2,
    },
    phone: {
      contactId: 9, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 300 },
        { name: 'SmartE', creditCost: 16, status: 'found', resultValue: '+1 (813) 555-0264', durationMs: 340 },
        { name: 'Prospeo', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (813) 555-0264', finalStatus: 'verified', totalCredits: 16,
    },
  },
  // Contact 10 — Arnulfo Aufderhar: found on 3rd source, risky → unverified
  10: {
    email: {
      contactId: 10, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 310 },
        { name: 'Icypeas', creditCost: 1, status: 'not_found', durationMs: 380 },
        { name: 'LeadMagic', creditCost: 1, status: 'found', resultValue: 'a.aufderhar@philips.com', durationMs: 290 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'risky', creditCost: 1 },
      finalResult: 'a.aufderhar@philips.com', finalStatus: 'unverified', totalCredits: 4,
    },
    phone: {
      contactId: 10, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 320 },
        { name: 'SmartE', creditCost: 16, status: 'not_found', durationMs: 400 },
        { name: 'Prospeo', creditCost: 10, status: 'not_found', durationMs: 350 },
        { name: 'ContactOut', creditCost: 18, status: 'not_found', durationMs: 310 },
        { name: 'LeadMagic', creditCost: 9, status: 'not_found', durationMs: 290 },
        { name: 'FindyMail', creditCost: 10, status: 'not_found', durationMs: 270 },
        { name: 'Global Database', creditCost: 20, status: 'not_found', durationMs: 340 },
        { name: 'LimaData', creditCost: 16, status: 'not_found', durationMs: 300 },
        { name: 'Datagma', creditCost: 20, status: 'not_found', durationMs: 280 },
        { name: 'Wiza', creditCost: 16, status: 'found', resultValue: '+1 (617) 555-0518', durationMs: 260 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (617) 555-0518', finalStatus: 'verified', totalCredits: 16,
    },
  },
  // Contact 11 — Kiel Bernhard: found on FindyMail, valid
  11: {
    email: {
      contactId: 11, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 330 },
        { name: 'Icypeas', creditCost: 1, status: 'not_found', durationMs: 370 },
        { name: 'LeadMagic', creditCost: 1, status: 'not_found', durationMs: 340 },
        { name: 'FindyMail', creditCost: 1, status: 'found', resultValue: 'kbernhard@upmc.edu', durationMs: 260 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'kbernhard@upmc.edu', finalStatus: 'verified', totalCredits: 5,
    },
    phone: {
      contactId: 11, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'found', resultValue: '+1 (412) 555-0345', durationMs: 220 },
        { name: 'SmartE', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (412) 555-0345', finalStatus: 'verified', totalCredits: 8,
    },
  },
  // Contact 12 — Eli Williamson: found on Icypeas, valid
  12: {
    email: {
      contactId: 12, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'not_found', durationMs: 300 },
        { name: 'Icypeas', creditCost: 1, status: 'found', resultValue: 'ewilliamson@cerner.com', durationMs: 330 },
        { name: 'LeadMagic', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'ewilliamson@cerner.com', finalStatus: 'verified', totalCredits: 3,
    },
    phone: {
      contactId: 12, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'found', resultValue: '+1 (816) 555-0127', durationMs: 190 },
        { name: 'SmartE', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'ContactOut', creditCost: 18, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 9, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (816) 555-0127', finalStatus: 'verified', totalCredits: 8,
    },
  },
  // Contact 13 — Korey Veum: found on Apollo, valid
  13: {
    email: {
      contactId: 13, type: 'email',
      sources: [
        { name: 'Apollo', creditCost: 1, status: 'found', resultValue: 'kveum@novalis.com', durationMs: 160 },
        { name: 'Icypeas', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'LeadMagic', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'FindyMail', creditCost: 1, status: 'skipped', durationMs: 0 },
        { name: 'Prospeo', creditCost: 1, status: 'skipped', durationMs: 0 },
      ],
      validation: { provider: 'ZeroBounce', result: 'valid', creditCost: 1 },
      finalResult: 'kveum@novalis.com', finalStatus: 'verified', totalCredits: 2,
    },
    phone: {
      contactId: 13, type: 'phone',
      sources: [
        { name: 'Apollo', creditCost: 8, status: 'not_found', durationMs: 310 },
        { name: 'SmartE', creditCost: 16, status: 'not_found', durationMs: 380 },
        { name: 'Prospeo', creditCost: 10, status: 'not_found', durationMs: 340 },
        { name: 'ContactOut', creditCost: 18, status: 'not_found', durationMs: 290 },
        { name: 'LeadMagic', creditCost: 9, status: 'found', resultValue: '+1 (323) 555-0984', durationMs: 270 },
        { name: 'FindyMail', creditCost: 10, status: 'skipped', durationMs: 0 },
        { name: 'Global Database', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'LimaData', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'Datagma', creditCost: 20, status: 'skipped', durationMs: 0 },
        { name: 'Wiza', creditCost: 16, status: 'skipped', durationMs: 0 },
        { name: 'ByteMine', creditCost: 8, status: 'skipped', durationMs: 0 },
        { name: 'Upcell', creditCost: 8, status: 'skipped', durationMs: 0 },
      ],
      finalResult: '+1 (323) 555-0984', finalStatus: 'verified', totalCredits: 9,
    },
  },
}
