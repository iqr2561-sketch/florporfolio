import React, { useState, useEffect } from 'react';
import type { MarketingItem } from '../types.ts';
import { getMarketingItems } from '../lib/marketingService.ts';

const MarketingCard: React.FC<{ item: MarketingItem }> = ({ item }) => {
    return (
        <div className="bg-white/70 rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="relative aspect-square w-full">
                <img 
                    src={item.image_url} 
                    alt={item.title || 'Imagen de marketing'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
            </div>
        </div>
    );
};

const Marketing: React.FC = () => {
    const [marketingItems, setMarketingItems] = useState<MarketingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMarketingItems = async () => {
            try {
                setLoading(true);
                setError(null);
                const items = await getMarketingItems();
                setMarketingItems(items);
            } catch (err: any) {
                console.error('Error loading marketing items:', err);
                setError(err.message || 'Error al cargar imágenes de marketing');
            } finally {
                setLoading(false);
            }
        };
        loadMarketingItems();
    }, []);

    return (
        <section id="marketing" className="min-h-screen animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Marketing</h2>
            
            {loading ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl">
                    <p className="text-gray-600">Cargando imágenes de marketing...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
                    <p className="text-red-600 mb-2 font-semibold">Error al cargar marketing</p>
                    <p className="text-sm text-red-500">{error}</p>
                    <p className="text-xs text-gray-500 mt-4">Verifica que la tabla 'marketing_items' exista en Supabase</p>
                </div>
            ) : marketingItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {marketingItems.map(item => (
                        <MarketingCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white/50 rounded-2xl">
                    <p className="text-gray-600 mb-4">No hay imágenes de marketing aún.</p>
                    <p className="text-sm text-gray-500">Ve al Panel de Administración para agregar fotos de marketing.</p>
                </div>
            )}
        </section>
    );
};

export default Marketing;

