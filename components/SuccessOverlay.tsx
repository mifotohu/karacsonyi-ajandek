
import React from 'react';

interface SuccessOverlayProps {}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = () => {
    return (
        <div className="fixed inset-0 bg-prager-cream bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-lg mx-auto animate-slide-up">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mx-auto text-prager-gold">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <h2 className="font-serif text-3xl mt-4 text-prager-dark">Majdnem kész!</h2>
                <p className="mt-2 text-prager-gray">
                    A megrendelésedet összeállítottuk. A rendelés véglegesítéséhez, kérjük, <strong>küldd el a levelezőprogramodban megnyílt e-mailt.</strong>
                </p>
                <p className="mt-4 text-sm text-prager-gray">
                    Ha nem nyílt meg automatikusan a levelező, elképzelhető, hogy a böngésződ blokkolta. Ebben az esetben kérjük, vedd fel velünk a kapcsolatot a <a href="mailto:info@pragerfoto.hu" className="text-prager-gold underline">info@pragerfoto.hu</a> címen.
                </p>
            </div>
        </div>
    );
};
