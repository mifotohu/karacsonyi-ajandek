
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import type { Service, FormData, PriceDetails, UtmParams } from './types';
import { SERVICES, DISCOUNT_RULES, PRICING } from './constants';

import { PriceSummary } from './components/PriceSummary';
import { FormSection } from './components/FormSection';
import { StickyFooter } from './components/StickyFooter';
import { SuccessOverlay } from './components/SuccessOverlay';

const initialFormData: FormData = {
    // Customer details
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    // Billing details
    billingName: '',
    billingTaxNumber: '',
    billingZip: '',
    billingCity: '',
    billingAddress: '',
    // Order details
    participantCount: 1,
    selectedServices: [],
    preferredMonth: 'Rugalmas, egyeztetés alapján',
    // Other
    notes: '',
    agreedToTerms: false,
    newsletterSignup: false,
};

function App() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [utmParams, setUtmParams] = useState<UtmParams>({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Parse UTM parameters on initial load
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUtmParams({
            utm_source: params.get('utm_source') || undefined,
            utm_campaign: params.get('utm_campaign') || undefined,
            utm_medium: params.get('utm_medium') || undefined,
            utm_term: params.get('utm_term') || undefined,
            utm_content: params.get('utm_content') || undefined,
        });
    }, []);

    // Effect to reset participant count if a single-person service is selected
    useEffect(() => {
        const isSinglePersonOnlySelected = formData.selectedServices.some(
            (serviceId) => PRICING[serviceId].twoPerson === null
        );
        if (isSinglePersonOnlySelected && Number(formData.participantCount) === 2) {
            setFormData(prev => ({ ...prev, participantCount: 1 }));
        }
    }, [formData.selectedServices, formData.participantCount]);


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked, id } = e.target as HTMLInputElement;
            if (name === 'selectedServices') {
                setFormData(prev => ({
                    ...prev,
                    selectedServices: checked
                        ? [...prev.selectedServices, id as Service]
                        : prev.selectedServices.filter(s => s !== id),
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
        } else {
             // Ensure participantCount is a number
            if (name === 'participantCount') {
                setFormData(prev => ({ ...prev, [name]: Number(value) as 1 | 2 }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        }
    }, []);

    const priceDetails: PriceDetails = useMemo(() => {
        const baseTotal = formData.selectedServices.reduce((acc, serviceId) => {
            const prices = PRICING[serviceId];
            const price = Number(formData.participantCount) === 2 && prices.twoPerson !== null
                ? prices.twoPerson
                : prices.onePerson;
            return acc + price;
        }, 0);

        const discounts = [];

        // Early bird discount
        if (DISCOUNT_RULES.EARLY_BIRD.ENABLED && new Date() <= new Date(DISCOUNT_RULES.EARLY_BIRD.DEADLINE)) {
            const discountAmount = baseTotal * DISCOUNT_RULES.EARLY_BIRD.PERCENTAGE;
            discounts.push({ label: `Early Bird kedvezmény (${DISCOUNT_RULES.EARLY_BIRD.PERCENTAGE * 100}%)`, amount: -discountAmount });
        }
        
        // Multi-service discount (excludes 'gepsimito')
        const discountableServices = formData.selectedServices.filter(s => s !== 'gepsimito');
        const serviceCount = discountableServices.length;

        if (serviceCount >= 2) {
            const discountableBaseTotal = discountableServices.reduce((acc, serviceId) => {
                const prices = PRICING[serviceId];
                const price = Number(formData.participantCount) === 2 && prices.twoPerson !== null
                    ? prices.twoPerson
                    : prices.onePerson;
                return acc + price;
            }, 0);

            const discountRate = serviceCount >= 3 
                ? DISCOUNT_RULES.MULTI_SERVICE.THREE_OR_MORE
                : DISCOUNT_RULES.MULTI_SERVICE.TWO_SERVICES;
            
            if (discountRate > 0) {
                const discountAmount = discountableBaseTotal * discountRate;
                discounts.push({ label: `Mennyiségi kedvezmény (${discountRate * 100}%)`, amount: -discountAmount });
            }
        }
        
        const total = baseTotal + discounts.reduce((acc, d) => acc + d.amount, 0);

        return {
            baseTotal: Math.round(baseTotal),
            discounts,
            finalTotal: Math.round(total),
        };
    }, [formData.selectedServices, formData.participantCount]);
    
    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.customerName.trim()) errors.customerName = 'A név megadása kötelező.';
        if (!formData.customerEmail.trim()) {
            errors.customerEmail = 'Az email cím megadása kötelező.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            errors.customerEmail = 'Kérjük, adj meg egy valós email címet.';
        }
        if (!formData.billingName.trim()) errors.billingName = 'A számlázási név megadása kötelező.';
        if (!formData.billingZip.trim()) errors.billingZip = 'Az irányítószám megadása kötelező.';
        if (!formData.billingCity.trim()) errors.billingCity = 'A város megadása kötelező.';
        if (!formData.billingAddress.trim()) errors.billingAddress = 'A cím megadása kötelező.';
        if (formData.selectedServices.length === 0) errors.selectedServices = 'Legalább egy szolgáltatást ki kell választani.';
        if (!formData.agreedToTerms) errors.agreedToTerms = 'Az adatkezelési feltételek elfogadása kötelező.';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const isFormValid = useMemo(() => Object.keys(formErrors).length === 0 && formData.agreedToTerms && formData.selectedServices.length > 0, [formErrors, formData.agreedToTerms, formData.selectedServices]);
    
    useEffect(() => {
        // Debounced validation on form change
        const handler = setTimeout(() => {
            if(formData.customerName || formData.customerEmail || formData.billingName) {
              validateForm();
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [formData, validateForm]);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsProcessing(true);

        try {
            const payload = {
                formData,
                priceDetails,
                utmParams,
                submittedAt: new Date().toISOString()
            };
            
            const formatEmailBody = (payload: { formData: FormData, priceDetails: PriceDetails, utmParams: UtmParams, submittedAt: string }) => {
                const { formData, priceDetails, utmParams, submittedAt } = payload;
                const currencyFormatter = new Intl.NumberFormat('hu-HU', {
                    style: 'currency',
                    currency: 'HUF',
                    minimumFractionDigits: 0,
                });

                let body = `Új megrendelés érkezett a weboldalról!\n\n`;
                body += `Időpont: ${new Date(submittedAt).toLocaleString('hu-HU')}\n`;
                body += `========================================\n\n`;
                
                body += `MEGRENDELŐ ADATAI:\n`;
                body += `Név: ${formData.customerName}\n`;
                body += `Email: ${formData.customerEmail}\n`;
                body += `Telefon: ${formData.customerPhone || 'Nincs megadva'}\n\n`;
                
                body += `SZÁMLÁZÁSI ADATOK:\n`;
                body += `Név: ${formData.billingName}\n`;
                body += `Cím: ${formData.billingZip} ${formData.billingCity}, ${formData.billingAddress}\n`;
                body += `Adószám: ${formData.billingTaxNumber || 'Nincs megadva'}\n\n`;
                
                body += `RENDELÉS RÉSZLETEI:\n`;
                body += `Résztvevők száma: ${formData.participantCount} fő\n`;
                body += `Tervezett beváltás: ${formData.preferredMonth}\n`;
                body += `Kiválasztott szolgáltatások:\n`;
                formData.selectedServices.forEach((serviceId: Service) => {
                    const service = SERVICES.find(s => s.id === serviceId);
                    const prices = PRICING[serviceId];
                    const price = Number(formData.participantCount) === 2 && prices.twoPerson !== null ? prices.twoPerson : prices.onePerson;
                    body += `  - ${service?.name || serviceId}: ${currencyFormatter.format(price)}\n`;
                });
                body += `\n`;

                body += `ÁR ÖSSZEGZÉS:\n`;
                body += `Részösszeg: ${currencyFormatter.format(priceDetails.baseTotal)}\n`;
                priceDetails.discounts.forEach((discount) => {
                    body += `${discount.label}: ${currencyFormatter.format(discount.amount)}\n`;
                });
                body += `Végösszeg: ${currencyFormatter.format(priceDetails.finalTotal)}\n\n`;

                body += `MEGJEGYZÉS:\n`;
                body += `${formData.notes || 'Nincs megadva'}\n\n`;
                
                body += `EGYÉB:\n`;
                body += `Hírlevél feliratkozás: ${formData.newsletterSignup ? 'Igen' : 'Nem'}\n\n`;
                
                if (Object.values(utmParams).some(p => p)) {
                    body += `UTM PARAMÉTEREK:\n`;
                    body += `Forrás: ${utmParams.utm_source || 'N/A'}\n`;
                    body += `Kampány: ${utmParams.utm_campaign || 'N/A'}\n`;
                    body += `Médium: ${utmParams.utm_medium || 'N/A'}\n`;
                    body += `Kifejezés: ${utmParams.utm_term || 'N/A'}\n`;
                    body += `Tartalom: ${utmParams.utm_content || 'N/A'}\n`;
                }

                return body;
            };

            const emailBody = formatEmailBody(payload);
            const subject = `Új megrendelés: ${formData.customerName}`;
            const mailtoLink = `mailto:info@pragerfoto.hu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            window.location.href = mailtoLink;
            
            // We assume the mail client was opened. Show success message after a brief delay.
            setTimeout(() => {
                setIsSubmitted(true);
                setIsProcessing(false);
            }, 1000);
    
        } catch(err) {
            console.error("Hiba a megrendelés elküldése közben:", err);
            alert("Hiba történt a megrendelés előkészítése közben. Kérjük, próbálja újra később.");
            setIsProcessing(false);
        }
    };

    if (isSubmitted) {
        return <SuccessOverlay />;
    }

    return (
        <div className="bg-prager-cream min-h-screen text-prager-dark">
            <header className="text-center py-12 px-4 bg-white shadow-sm">
                <h1 className="font-serif text-4xl md:text-6xl font-bold prager-gradient-text">Rendelj egyéni mentorálást!</h1>
                <p className="mt-4 text-lg md:text-xl text-prager-gray max-w-2xl mx-auto">Válassz a fotós és AI szolgáltatások közül, és add le a rendelésed pár kattintással.</p>
            </header>

            <main className="container mx-auto p-4 md:p-8 max-w-6xl">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 space-y-8 animate-slide-up">
                            <FormSection 
                                formData={formData}
                                formErrors={formErrors}
                                onInputChange={handleInputChange}
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <div className="sticky top-8 space-y-8">
                                <section>
                                    <h2 className="font-serif text-2xl mb-4 text-prager-dark">Összegzés</h2>
                                    <PriceSummary 
                                        priceDetails={priceDetails} 
                                        selectedServices={formData.selectedServices} 
                                        participantCount={formData.participantCount} 
                                    />
                                </section>

                                <div className="hidden lg:block">
                                    <button 
                                        type="submit" 
                                        disabled={!isFormValid || isProcessing}
                                        className="w-full bg-prager-gold text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:brightness-110 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:brightness-100 flex items-center justify-center gap-3"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                        {isProcessing ? 'Feldolgozás...' : 'Megrendelem'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
            
            <StickyFooter 
                finalTotal={priceDetails.finalTotal} 
                onSubmit={handleSubmit}
                isDisabled={!isFormValid || isProcessing}
                isProcessing={isProcessing}
            />

            <footer className="text-center p-8 text-prager-gray text-sm">
                <p>&copy; {new Date().getFullYear()} Pragerfoto. Minden jog fenntartva. | <a href="https://www.pragerfoto.hu" className="hover:text-prager-gold">www.pragerfoto.hu</a></p>
            </footer>
        </div>
    );
}

export default App;
