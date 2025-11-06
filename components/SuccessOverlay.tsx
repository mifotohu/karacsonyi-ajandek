
import React from 'react';

interface SuccessOverlayProps {}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = () => {
    return (
        <div className="fixed inset-0 bg-prager-cream bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-lg mx-auto animate-slide-up">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mx-auto text-prager-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-serif text-3xl mt-4 text-prager-dark">Sikeres megrendelés!</h2>
                <p className="mt-2 text-prager-gray">
                    Köszönjük a megrendelésedet! Hamarosan felvesszük veled a kapcsolatot a megadott e-mail címen a további részletekkel.
                </p>
                <p className="mt-4 text-sm text-prager-gray">
                    Ha bármi kérdésed van, keress minket bizalommal az <a href="mailto:info@pragerfoto.hu" className="text-prager-gold underline">info@pragerfoto.hu</a> címen.
                </p>
            </div>
        </div>
    );
};
