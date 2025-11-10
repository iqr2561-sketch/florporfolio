import React, { useState, useEffect } from 'react';
import { getMarketingItems } from '../lib/marketingService.ts';
import type { MarketingItem } from '../types.ts';

const ChevronLeftIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const Marketing: React.FC = () => {
    const [marketingItems, setMarketingItems] = useState<MarketingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadMarketingItems = async () => {
            try {
                setLoading(true);
                const items = await getMarketingItems();
                setMarketingItems(items);
            } catch (error) {
                console.error('Error loading marketing items:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMarketingItems();
    }, []);

    const nextItem = () => {
        setCurrentIndex((prev) => (prev + 1) % marketingItems.length);
    };

    const prevItem = () => {
        setCurrentIndex((prev) => (prev - 1 + marketingItems.length) % marketingItems.length);
    };

    const goToItem = (index: number) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <section id="marketing" className="min-h-screen animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Marketing</h2>
                <div className="text-center py-12">
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </section>
        );
    }

    if (marketingItems.length === 0) {
        return (
            <section id="marketing" className="min-h-screen animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Marketing</h2>
                <div className="text-center py-12">
                    <p className="text-gray-600">No hay elementos de marketing disponibles.</p>
                </div>
            </section>
        );
    }

    const currentItem = marketingItems[currentIndex];
    const hasMultipleItems = marketingItems.length > 1;

    return (
        <section id="marketing" className="min-h-screen animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Marketing</h2>
            
            <div className="max-w-4xl mx-auto">
                <div className="relative bg-white/70 rounded-2xl shadow-lg overflow-hidden group">
                    {/* Imagen */}
                    <div className="relative aspect-video w-full">
                        <img 
                            src={currentItem.image_url} 
                            alt={currentItem.title}
                            className="w-full h-full object-cover transition-opacity duration-500"
                            key={currentIndex}
                        />
                        
                        {/* Botones de navegación */}
                        {hasMultipleItems && (
                            <>
                                <button
                                    onClick={prevItem}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    aria-label="Elemento anterior"
                                >
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                
                                <button
                                    onClick={nextItem}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    aria-label="Elemento siguiente"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>
                            </>
                        )}
                        
                        {/* Contador */}
                        {hasMultipleItems && (
                            <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                                {currentIndex + 1} / {marketingItems.length}
                            </div>
                        )}
                    </div>
                    
                    {/* Información del elemento */}
                    <div className="p-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{currentItem.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">{currentItem.description}</p>
                    </div>
                    
                    {/* Indicadores de puntos */}
                    {hasMultipleItems && (
                        <div className="flex justify-center gap-2 pb-6">
                            {marketingItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToItem(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex 
                                            ? 'bg-[#D08A64] w-8' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Ir a elemento ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Marketing;

