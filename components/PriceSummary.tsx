
import React from 'react';
import type { PriceDetails, Service } from '../types';
import { SERVICES, PRICING } from '../constants';

interface PriceSummaryProps {
    priceDetails: PriceDetails;
    selectedServices: Service[];
    participantCount: 1 | 2;
}

const currencyFormatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
});

const SummaryRow: React.FC<{ label: string; amount: number; isTotal?: boolean; isSubtotal?: boolean }> = ({ label, amount, isTotal = false, isSubtotal = false }) => (
    <div className={`flex justify-between items-center py-2 ${isTotal ? 'text-xl font-bold border-t border-prager-gold/30 pt-3 mt-2' : 'text-sm'} ${isSubtotal ? 'border-t border-gray-200 pt-2 mt-2' : ''}`}>
        <span className={isTotal ? 'text-prager-dark' : 'text-prager-gray'}>{label}</span>
        <span className={isTotal ? 'text-prager-dark' : 'font-semibold'}>{currencyFormatter.format(amount)}</span>
    </div>
);

export const PriceSummary: React.FC<PriceSummaryProps> = ({ priceDetails, selectedServices, participantCount }) => {
    return (
        <div className="bg-white/50 p-6 rounded-lg shadow-inner space-y-2" aria-live="polite">
            {selectedServices.length > 0 ? (
                <>
                    {selectedServices.map(serviceId => {
                        const service = SERVICES.find(s => s.id === serviceId);
                        const prices = PRICING[serviceId];
                        const amount = Number(participantCount) === 2 && prices.twoPerson !== null
                            ? prices.twoPerson
                            : prices.onePerson;

                        return (
                           <SummaryRow 
                                key={serviceId} 
                                label={service?.name || 'Ismeretlen szolgáltatás'} 
                                amount={amount}
                            />
                        );
                    })}

                    {priceDetails.discounts.length > 0 && (
                        <SummaryRow 
                            label="Részösszeg"
                            amount={priceDetails.baseTotal}
                            isSubtotal
                        />
                    )}

                    {priceDetails.discounts.length > 0 && (
                        <div className="pt-0">
                             {priceDetails.discounts.map((discount, index) => (
                                <SummaryRow key={index} label={discount.label} amount={discount.amount} />
                             ))}
                        </div>
                    )}
                    <SummaryRow label="Fizetendő végösszeg" amount={priceDetails.finalTotal} isTotal />
                </>
            ) : (
                <p className="text-center text-prager-gray py-4">Válassz szolgáltatást az árkalkulációhoz.</p>
            )}
        </div>
    );
};