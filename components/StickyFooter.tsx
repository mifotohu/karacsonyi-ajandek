import React from 'react';

interface StickyFooterProps {
    finalTotal: number;
    onSubmit: (e: React.FormEvent) => void;
    isDisabled: boolean;
    isProcessing: boolean;
}

const currencyFormatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
});

export const StickyFooter: React.FC<StickyFooterProps> = ({ finalTotal, onSubmit, isDisabled, isProcessing }) => {
    return (
        <div className="lg:hidden sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200 shadow-lg">
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-sm text-prager-gray">Végösszeg</span>
                    <p className="text-2xl font-bold text-prager-dark">{currencyFormatter.format(finalTotal)}</p>
                </div>
                <button
                    type="submit"
                    onClick={onSubmit}
                    disabled={isDisabled}
                    className="bg-prager-gold text-white font-bold py-3 px-5 rounded-lg shadow-md hover:brightness-110 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isProcessing ? '...' : 'Megrendelem'}
                </button>
            </div>
        </div>
    );
};