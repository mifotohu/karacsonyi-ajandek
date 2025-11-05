import React from 'react';

interface Image {
    id: string;
    src: string;
}

interface ImageSelectorProps {
    images: Image[];
    selectedImage: string;
    onSelect: (id: string) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ images, selectedImage, onSelect }) => {
    return (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-2 bg-white/50 rounded-lg">
            {images.map((image, index) => (
                <button
                    type="button"
                    key={image.id}
                    onClick={() => onSelect(image.id)}
                    className={`relative aspect-square w-full rounded-lg overflow-hidden focus:outline-none transition-all duration-200 group focus-visible:ring-4 focus-visible:ring-prager-gold focus-visible:ring-offset-2 ${selectedImage === image.id ? 'ring-4 ring-prager-gold ring-offset-2' : 'ring-1 ring-gray-300 hover:ring-prager-gold/70'}`}
                    aria-label={`Válassz hátteret: ${index + 1}. opció`}
                    aria-pressed={selectedImage === image.id}
                >
                    <img src={image.src} alt={`Háttér opció ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" crossOrigin="anonymous" />
                    {selectedImage === image.id && (
                        <div className="absolute inset-0 bg-prager-gold/60 flex items-center justify-center" aria-hidden="true">
                             <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};