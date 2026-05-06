import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Filter } from 'lucide-react';

interface ServiceOption {
    _id?: string;
    name?: string;
    duration: string;
    price: number;
    originalPrice?: number;
}

interface AddOnOption {
    _id?: string;
    name: string;
    price: number;
    duration?: number;
}

export interface Service {
    originalPrice: number | undefined;
    _id?: string;
    id?: number | string;
    name: string;
    description?: string;
    rating?: number;
    image?: string;
    options: ServiceOption[];
    pricingType?: string;
    price?: number;
    duration?: number;
    addOns?: AddOnOption[];
}

interface BookingServicesProps {
    services: Service[];
    selectedServices: { serviceId: string | number; optionIdx: number; addOnIds: string[] }[];
    onToggleService: (serviceId: string | number, optionIdx: number) => void;
    onToggleAddOn: (serviceId: string | number, optionIdx: number, addOnId: string) => void;
}

const ServiceCard = ({
    service,
    selectedSelections,
    onToggle,
    onToggleAddOn
}: {
    service: Service;
    selectedSelections: { optionIdx: number; addOnIds: string[] }[];
    onToggle: (optionIdx: number) => void;
    onToggleAddOn: (optionIdx: number, addOnId: string) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const rawOptions = service.options || (service as any).pricingOptions || (service as any).variations || [];

    let options: ServiceOption[] = [];

    if (rawOptions.length > 0) {
        options = rawOptions.map((opt: any) => ({
            name: opt.name || opt.label || "",
            duration: opt.duration ? `${opt.duration} Mins` : (opt.time ? `${opt.time} Mins` : (service.duration ? `${service.duration} Mins"` : "60 Mins")),
            price: opt.price || opt.amount || 0, // sellingPrice
            originalPrice: opt.originalPrice || 0 // previousPrice
        }));
    } else if (service.price !== undefined) {
        options = [{
            name: service.name,
            duration: `${service.duration || 60} Mins`,
            price: service.price, // sellingPrice
            originalPrice: (service as any).originalPrice || 0 // previousPrice
        }];
    } else {
        options = [{ duration: "Duration TBD", price: 0, originalPrice: 0 }];
    }

    const isServiceSelected = selectedSelections.length > 0;
    const selectedOptionIdx = selectedSelections[0]?.optionIdx;

    const sellingPriceMin = Math.min(...options.map(o => o.price));
    const previousPriceMin = options.find(o => o.price === sellingPriceMin)?.originalPrice ?? 0;
    const discountPercentHeader = previousPriceMin > sellingPriceMin 
        ? Math.round(((previousPriceMin - sellingPriceMin) / previousPriceMin) * 100) 
        : 0;

    return (
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden mb-3 shadow-sm">
            <div
                className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${isServiceSelected ? 'bg-zinc-50/50' : 'bg-white'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-shrink-0">
                    <input
                        type="checkbox"
                        checked={isServiceSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            if (!isServiceSelected) {
                                onToggle(0);
                                setIsExpanded(true);
                            } else {
                                onToggle(selectedOptionIdx || 0);
                            }
                        }}
                        className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 text-base">{service.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span className="text-[11px] text-zinc-500 font-medium">{(options[0]?.duration ?? 0)} - {(options[options.length - 1]?.duration ?? 0)}</span>
                    </div>
                </div>

                <div className="text-right flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">Starting at</span>
                        <div className="flex items-center gap-1.5">
                            {previousPriceMin > 0 && (
                                <span className="text-[11px] text-zinc-400 line-through font-medium">₹{previousPriceMin.toLocaleString('en-IN')}</span>
                            )}
                            <span className="font-black text-zinc-900 text-base">₹{sellingPriceMin.toLocaleString('en-IN')}</span>
                            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                )}
                            </div>
                        </div>
                        {discountPercentHeader > 0 && (
                            <span className="text-[10px] text-red-500 font-black tracking-tight">{discountPercentHeader}% OFF</span>
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-zinc-100 bg-white p-3 space-y-2">
                    {options.map((option, idx) => {
                        const isSelected = selectedOptionIdx === idx && isServiceSelected;
                        const sellingPrice = option.price;
                        const previousPrice = option.originalPrice ?? 0;
                        const discountPercent = previousPrice > sellingPrice
                            ? Math.round(((previousPrice - sellingPrice) / previousPrice) * 100)
                            : 0;

                        return (            
                            <div key={idx} className="space-y-2">
                                <div
                                    onClick={() => onToggle(idx)}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${isSelected
                                            ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                                            : 'border-zinc-100 hover:border-zinc-200'
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-sm ${isSelected ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                            {option.name || option.duration}
                                        </span>
                                        <span className="text-xs text-zinc-400">{option.duration}</span>
                                    </div>

                                    <div className="text-right flex flex-col items-end">
                                        <div className="flex items-center gap-1.5">
                                            {previousPrice > 0 && (
                                                <span className="text-[11px] text-zinc-400 line-through font-medium">₹{previousPrice.toLocaleString('en-IN')}</span>
                                            )}
                                            <span className="font-black text-zinc-900 text-sm">₹{sellingPrice.toLocaleString('en-IN') || 0}</span>
                                        </div>
                                        {discountPercent > 0 && (
                                            <span className="text-[10px] text-red-500 font-black tracking-tight">{discountPercent}% OFF</span>
                                        )}
                                    </div>
                                </div>

                                {isSelected && service.addOns && service.addOns.length > 0 && (
                                    <div className="ml-4 pl-4 border-l-2 border-zinc-100 space-y-2 py-1">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Add-ons</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {service.addOns.map((addon) => {
                                                const addonId = addon?._id || "";
                                                const isAddonSelected = (selectedSelections[0]?.addOnIds || []).includes(addonId);
                                                return (
                                                    <button
                                                        key={addonId}
                                                        onClick={() => onToggleAddOn(idx, addonId)}
                                                        className={`flex flex-col p-2.5 rounded-md border text-left transition-all ${
                                                            isAddonSelected 
                                                                ? 'border-zinc-900 bg-zinc-50' 
                                                                : 'border-zinc-100 hover:border-zinc-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between w-full">
                                                            <span className="text-xs font-bold text-zinc-700">{addon.name}</span>
                                                            <span className="text-xs font-black text-zinc-900">+₹{addon.price.toLocaleString('en-IN')}</span>
                                                        </div>
                                                        {(addon.duration ?? 0) > 0 && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Clock className="w-3 h-3 text-zinc-400" />
                                                                <span className="text-[10px] text-zinc-500 font-medium">{addon.duration} Mins</span>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const BookingServices = ({ services, selectedServices, onToggleService, onToggleAddOn }: BookingServicesProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                    Filter & Sort
                </button>
            </div>

            <div className="space-y-1">
                {(!services || services.length === 0) ? (
                    <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
                        <p className="text-sm text-zinc-500">No services available for this business.</p>
                    </div>
                ) : (
                    services.map((service) => {
                        const serviceId = service._id || service.id!;
                        const selectedSelectionsForService = selectedServices
                            .filter(s => s.serviceId === serviceId)
                            .map(s => ({ optionIdx: s.optionIdx, addOnIds: s.addOnIds || [] }));

                        return (
                            <ServiceCard
                                key={String(serviceId)}
                                service={service}
                                selectedSelections={selectedSelectionsForService}
                                onToggle={(optionIdx) => onToggleService(serviceId, optionIdx)}
                                onToggleAddOn={(optionIdx, addOnId) => onToggleAddOn(serviceId, optionIdx, addOnId)}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BookingServices;