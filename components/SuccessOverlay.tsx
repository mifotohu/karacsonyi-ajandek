import React from 'react';

interface SuccessOverlayProps {}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = () => {
    return (
        <div className="fixed inset-0 bg-prager-cream bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-lg mx-auto animate-slide-up">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-serif text-3xl mt-4 text-prager-dark">Sikeres megrendelés!</h2>
                <p className="mt-2 text-prager-gray">
                    Köszönjük a megrendelésed! A megrendelés részleteit és a díjbekérőt hamarosan elküldjük a megadott email címre.
                </p>
            </div>
        </div>
    );
};