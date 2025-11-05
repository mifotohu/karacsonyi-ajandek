import type { Service, ServiceDetails } from './types';

// IMPORTANT: Service prices can be easily edited here.
export const PRICING: Record<Service, { onePerson: number; twoPerson: number | null }> = {
    gepsimito: { onePerson: 22000, twoPerson: null },
    studio: { onePerson: 39000, twoPerson: 65000 },
    perplexity: { onePerson: 25000, twoPerson: 45000 },
    vibe: { onePerson: 32000, twoPerson: 55000 },
    ai_alapok: { onePerson: 39000, twoPerson: 70000 },
    leo_halado: { onePerson: 60000, twoPerson: null },
};

export const SERVICES: ServiceDetails[] = [
    { id: 'gepsimito', name: 'Gépsimító', description: '1-2 óra, egyéni oktatás Budapesten (nincs kedvezmény)' },
    { id: 'studio', name: 'Stúdió fotózás alapjai', description: '2 óra, modell biztosításával' },
    { id: 'perplexity', name: 'Perplexity AI kereső alapjai', description: '100 perc, egyéni' },
    { id: 'vibe', name: 'Vibe coding alapjai', description: '100 perc, egyéni' },
    { id: 'ai_alapok', name: 'AI képgenerálás alapjai', description: '160 perc, ajándék ebook + 30p online mentorálás' },
    { id: 'leo_halado', name: 'Leonardo AI tudásbázis - haladó', description: '4 óra, ajándék ebook + 30p online mentorálás (csak egyéni!)' },
];

export const DISCOUNT_RULES = {
    EARLY_BIRD: {
        ENABLED: false, // Set to true to enable early bird discount
        DEADLINE: '2025-11-17T23:59:59',
        PERCENTAGE: 0.05, // 5%
    },
    MULTI_SERVICE: {
        TWO_SERVICES: 0.10, // 10% for 2 discountable services
        THREE_OR_MORE: 0.15, // 15% for 3+ discountable services
    },
};
