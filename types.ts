export type Service = 'gepsimito' | 'studio' | 'perplexity' | 'vibe' | 'ai_alapok' | 'leo_halado';

export interface ServiceDetails {
    id: Service;
    name: string;
    description: string;
}

export interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    billingName: string;
    billingTaxNumber: string;
    billingZip: string;
    billingCity: string;
    billingAddress: string;
    participantCount: 1 | 2;
    selectedServices: Service[];
    preferredMonth: string;
    notes: string;
    agreedToTerms: boolean;
    newsletterSignup: boolean;
}

export interface Discount {
    label: string;
    amount: number;
}

export interface PriceDetails {
    baseTotal: number;
    discounts: Discount[];
    finalTotal: number;
}

export interface UtmParams {
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_term?: string;
    utm_content?: string;
}