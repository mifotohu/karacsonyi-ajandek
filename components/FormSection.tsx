import React from 'react';
import type { FormData } from '../types';
import { SERVICES, PRICING } from '../constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-prager-gray mb-1">{label}</label>
        <input 
            id={id}
            className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-prager-gold focus:border-prager-gold transition`} 
            {...props}
        />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

interface FormSectionProps {
    formData: FormData;
    formErrors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const FormSection: React.FC<FormSectionProps> = ({ formData, formErrors, onInputChange }) => {
    const isAnyServiceSinglePersonOnly = formData.selectedServices.some(
        (serviceId) => PRICING[serviceId].twoPerson === null
    );
    
    const currencyFormatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        minimumFractionDigits: 0,
    });

    return (
        <>
            <section>
                <h2 className="font-serif text-2xl mb-4 text-prager-dark">Válaszd ki a szolgáltatásokat</h2>
                <div className="space-y-3">
                    {SERVICES.map(service => {
                        const priceInfo = PRICING[service.id];
                        const basePrice = currencyFormatter.format(priceInfo.onePerson);

                        return (
                            <label key={service.id} className="flex items-start p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                <input
                                    type="checkbox"
                                    name="selectedServices"
                                    id={service.id}
                                    checked={formData.selectedServices.includes(service.id)}
                                    onChange={onInputChange}
                                    className="h-5 w-5 rounded border-gray-300 text-prager-gold focus:ring-prager-gold flex-shrink-0 mt-1"
                                />
                                <div className="ml-4 flex-grow flex justify-between items-start">
                                    <div>
                                        <span className="font-semibold block">{service.name}</span>
                                        <span className="block text-sm text-prager-gray">{service.description}</span>
                                    </div>
                                    <span className="font-semibold text-prager-dark text-right whitespace-nowrap pl-4">
                                        {basePrice}
                                    </span>
                                </div>
                            </label>
                        );
                    })}
                    {formErrors.selectedServices && <p className="text-red-600 text-xs mt-1">{formErrors.selectedServices}</p>}
                </div>
            </section>

            <section>
                <h2 className="font-serif text-2xl mb-4 text-prager-dark">Rendelési adatok</h2>
                <div className="space-y-4">
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
                        <legend className="font-semibold px-2">Megrendelő adatai</legend>
                        <Input label="Teljes név" id="customerName" name="customerName" value={formData.customerName} onChange={onInputChange} error={formErrors.customerName} required />
                        <Input label="Email cím" id="customerEmail" name="customerEmail" type="email" value={formData.customerEmail} onChange={onInputChange} error={formErrors.customerEmail} required />
                        <Input label="Telefonszám (opcionális)" id="customerPhone" name="customerPhone" type="tel" value={formData.customerPhone} onChange={onInputChange} placeholder="+36 20 123 4567" />
                    </fieldset>
                    
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="font-semibold px-2">Számlázási adatok</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="md:col-span-2"><Input label="Név / Cégnév" id="billingName" name="billingName" value={formData.billingName} onChange={onInputChange} error={formErrors.billingName} required /></div>
                             <Input label="Irányítószám" id="billingZip" name="billingZip" value={formData.billingZip} onChange={onInputChange} error={formErrors.billingZip} required />
                             <Input label="Város" id="billingCity" name="billingCity" value={formData.billingCity} onChange={onInputChange} error={formErrors.billingCity} required />
                             <div className="md:col-span-2"><Input label="Utca, házszám" id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={onInputChange} error={formErrors.billingAddress} required /></div>
                             <Input label="Adószám (opcionális)" id="billingTaxNumber" name="billingTaxNumber" value={formData.billingTaxNumber} onChange={onInputChange} />
                        </div>
                    </fieldset>
                    
                    <div>
                        <label htmlFor="participantCount" className="block text-sm font-semibold text-prager-gray mb-1">Résztvevők száma</label>
                        <select 
                            id="participantCount" 
                            name="participantCount" 
                            value={formData.participantCount} 
                            onChange={onInputChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-prager-gold focus:border-prager-gold transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            disabled={isAnyServiceSinglePersonOnly}
                        >
                            <option value={1}>1 fő</option>
                            <option value={2}>2 fő</option>
                        </select>
                         {isAnyServiceSinglePersonOnly && <p className="text-xs text-prager-gray mt-1">A kiválasztott szolgáltatások egyike csak 1 fő részére elérhető.</p>}
                    </div>

                    <div>
                        <label htmlFor="preferredMonth" className="block text-sm font-semibold text-prager-gray mb-1">Beváltás tervezett ideje</label>
                        <select id="preferredMonth" name="preferredMonth" value={formData.preferredMonth} onChange={onInputChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-prager-gold focus:border-prager-gold transition">
                            <option>Rugalmas, egyeztetés alapján</option>
                            <option>Január</option>
                            <option>Február</option>
                            <option>Március</option>
                        </select>
                    </div>

                     <div>
                        <label htmlFor="notes" className="block text-sm font-semibold text-prager-gray mb-1">Megjegyzés (opcionális)</label>
                        <textarea 
                            id="notes" 
                            name="notes"
                            rows={3}
                            value={formData.notes}
                            onChange={onInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-prager-gold focus:border-prager-gold transition"
                            placeholder="Egyéb kérések, információk..."
                        />
                    </div>

                    <div className="space-y-3 mt-4">
                        <label className="flex items-start">
                            <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={onInputChange} className="h-5 w-5 mt-0.5 rounded border-gray-300 text-prager-gold focus:ring-prager-gold" />
                            <span className="ml-3 text-sm text-prager-gray">Elfogadom az <a href="#" target="_blank" rel="noopener noreferrer" className="text-prager-gold underline">adatkezelési feltételeket</a>. *</span>
                        </label>
                        {formErrors.agreedToTerms && <p className="text-red-600 text-xs mt-1">{formErrors.agreedToTerms}</p>}
                        
                        <label className="flex items-start">
                            <input type="checkbox" name="newsletterSignup" checked={formData.newsletterSignup} onChange={onInputChange} className="h-5 w-5 mt-0.5 rounded border-gray-300 text-prager-gold focus:ring-prager-gold" />
                            <span className="ml-3 text-sm text-prager-gray">Szeretnék feliratkozni a Pragerfoto hírlevelére.</span>
                        </label>
                    </div>
                </div>
            </section>
        </>
    );
};