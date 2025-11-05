import React, { forwardRef } from 'react';

interface GiftCardPreviewProps {
    recipientName: string;
    message: string;
    services: string[];
    backgroundImage: string;
}

export const GiftCardPreview = forwardRef<HTMLDivElement, GiftCardPreviewProps>(({ recipientName, message, services, backgroundImage }, ref) => {

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    return (
        <div ref={ref} className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-2xl bg-prager-dark transition-all duration-500">
            <img 
                src={backgroundImage} 
                alt="Ajándékkártya háttér" 
                className="absolute inset-0 w-full h-full object-cover" 
                aria-hidden="true"
                crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60" aria-hidden="true"></div>
            
            <div 
                className="relative z-10 p-6 flex flex-col justify-between h-full text-white" 
                style={{ textShadow: '0 2px 5px rgba(0,0,0,0.6)' }}
            >
                <div className="relative z-10">
                    <p className="font-serif text-3xl font-bold">{truncateText(recipientName || 'Ajándékozott Neve', 30)}</p>
                    <p className="mt-2 text-lg opacity-90">{truncateText(message || 'Kellemes Ünnepeket!', 50)}</p>
                </div>
                <div className="relative z-10 text-right">
                    <p className="text-xs opacity-80">A következő tudás(ok) birtokosának:</p>
                    <p className="font-semibold text-prager-gold">
                        {services.length > 0 ? truncateText(services.join(', '), 40) : 'Kiválasztott szolgáltatás(ok)'}
                    </p>
                    <p className="font-serif text-2xl mt-2 prager-gradient-text bg-gradient-to-r from-prager-gold to-yellow-200">Pragerfoto</p>
                </div>
            </div>
        </div>
    );
});