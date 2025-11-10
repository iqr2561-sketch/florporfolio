import React, { useState, useEffect } from 'react';
import { getMarketingItems } from '../lib/marketingService.ts';
import type { MarketingItem } from '../types.ts';

const Marketing: React.FC = () => {
    const [marketingItems, setMarketingItems] = useState<MarketingItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section id="marketing" className="min-h-screen animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Marketing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {marketingItems.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-white/70 rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                    >
                        <div className="relative">
                            <img 
                                src={item.image_url} 
                                alt={item.title}
                                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Marketing;

