export type Region = 'India' | 'USA' | 'UK' | 'Canada' | 'Australia' | 'Global';

export interface HelplineResource {
  name: string;
  phone?: string;
  text?: string;
  website?: string;
  description: string;
  type: 'Crisis' | 'Consultation' | 'Referral';
  isTier2?: boolean;
}

export const REGIONAL_HELPLINES: Record<Region, HelplineResource[]> = {
  India: [
    {
      name: 'Tele-MANAS',
      phone: '14416',
      description: '24/7 Government of India helpline for all mental health concerns.',
      type: 'Crisis'
    },
    {
      name: 'NIMHANS Helpline',
      phone: '080-46110007',
      description: 'Psychosocial support from the National Institute of Mental Health.',
      type: 'Crisis'
    },
    {
      name: 'Vandrevala Foundation',
      phone: '1860 2662 345',
      website: 'https://www.vandrevalafoundation.com',
      description: 'Free counseling via phone, chat, and video.',
      type: 'Consultation',
      isTier2: true
    },
    {
      name: 'iCall (TISS)',
      phone: '9152987821',
      description: 'Empathetic listening and psychological support by professionals.',
      type: 'Consultation'
    }
  ],
  USA: [
    {
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      website: 'https://988lifeline.org',
      description: '24/7 support for people in distress or suicidal crisis.',
      type: 'Crisis'
    },
    {
      name: 'Crisis Text Line',
      text: '741741',
      description: 'Text HOME to 741741 to connect with a Crisis Counselor.',
      type: 'Crisis'
    },
    {
      name: 'SAMHSA Treatment Locator',
      phone: '1-800-662-HELP',
      website: 'https://www.samhsa.gov',
      description: 'Professional guidance and treatment referrals.',
      type: 'Referral',
      isTier2: true
    }
  ],
  UK: [
    {
      name: 'NHS Mental Health Hub',
      phone: '111',
      website: 'https://www.nhs.uk/mental-health',
      description: 'Assessment and pathway to professional clinical care.',
      type: 'Referral',
      isTier2: true
    },
    {
      name: 'Samaritans',
      phone: '116 123',
      description: 'Free, confidential emotional support 24/7.',
      type: 'Crisis'
    },
    {
      name: 'Shout',
      text: '85258',
      description: 'Free, 24/7 text-based mental health support.',
      type: 'Crisis'
    }
  ],
  Canada: [
    {
      name: 'Talk Suicide Canada',
      phone: '1-833-456-4566',
      website: 'https://988.ca',
      description: '24/7 national suicide prevention service.',
      type: 'Crisis'
    },
    {
      name: 'Wellness Together Canada',
      phone: '1-866-585-0445',
      website: 'https://www.wellnesstogether.ca',
      description: 'Professional counseling and support pathways.',
      type: 'Consultation',
      isTier2: true
    }
  ],
  Australia: [
    {
      name: 'Lifeline Australia',
      phone: '13 11 14',
      website: 'https://www.lifeline.org.au',
      description: 'Personal crisis support and suicide prevention.',
      type: 'Crisis'
    },
    {
      name: 'Beyond Blue',
      phone: '1300 22 4636',
      website: 'https://www.beyondblue.org.au',
      description: 'Professional support for anxiety and depression.',
      type: 'Consultation',
      isTier2: true
    },
    {
      name: 'Kids Helpline',
      phone: '1800 55 1800',
      description: 'Specialist support for young people aged 5-25.',
      type: 'Referral'
    }
  ],
  Global: [
    {
      name: 'Befrienders Worldwide',
      website: 'https://www.befrienders.org',
      description: 'Global network of centers for people in crisis or loneliness.',
      type: 'Crisis'
    },
    {
      name: 'IASP Resource Map',
      website: 'https://www.iasp.info/resources/Crisis_Centres',
      description: 'International directory of crisis support centers.',
      type: 'Referral'
    }
  ]
};
