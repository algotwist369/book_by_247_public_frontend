"use client";

import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Business } from '@/components/business/businessData';
import { Star, Map as MapIcon, AlertCircle } from 'lucide-react';
import { CustomImage } from '@/components/ui/CustomImage';

interface ExploreMapProps {
    businesses: Business[];
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 13.0418,
    lng: 80.2341,
};

// Senior Style: Light, clean map theme
const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{ "weight": "2.00" }]
        },
        {
            "featureType": "all",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#9c9c9c" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [{ "visibility": "on" }]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#f2f2f2" }]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#eeeeee" }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#7b7b7b" }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{ "visibility": "simplified" }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#c8d7d4" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#070707" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#ffffff" }]
        }
    ]
};

const ExploreMap = ({ businesses }: ExploreMapProps) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDOoaUvcvEy5tZKbEct4QoKJTjn63n1N1Q";

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
    });

    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

    const [map, setMap] = React.useState<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    React.useEffect(() => {
        if (map && businesses.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            businesses.forEach((business) => {
                if (business.coordinates?.lat && business.coordinates?.lng) {
                    bounds.extend({ lat: business.coordinates.lat, lng: business.coordinates.lng });
                }
            });
            map.fitBounds(bounds);
        }
    }, [map, businesses]);

    if (!apiKey) {
        return (
            <div className="sticky top-24 h-[calc(100vh-120px)] w-full bg-zinc-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center p-8 text-center">
                <div className="flex flex-col items-center gap-4 max-w-xs">
                    <div className="w-12 h-12 bg-zinc-100 text-zinc-400 rounded-2xl flex items-center justify-center">
                        <MapIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-zinc-900 font-bold tracking-tight">Map Key Missing</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        To enable the interactive map, please add your Google Maps API key to the <code className="bg-zinc-100 px-1 py-0.5 rounded">.env</code> file.
                    </p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="sticky top-24 h-[calc(100vh-120px)] w-full bg-zinc-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center p-8 text-center">
                <div className="flex flex-col items-center gap-4 max-w-xs text-red-600">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold">Configuration Error</h3>
                    <p className="text-xs leading-relaxed opacity-80">
                        The Google Maps API failed to load. Please ensure "Maps JavaScript API" is enabled in your Google Cloud Console and billing is active.
                    </p>
                </div>
            </div>
        );
    }

    if (!isLoaded) return (
        <div className="sticky top-24 h-[calc(100vh-120px)] w-full bg-zinc-50 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin" />
                <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Loading Map...</p>
            </div>
        </div>
    );


    return (
        <div className="sticky top-24 h-[calc(100vh-120px)] w-full rounded-[2.5rem] border-4 border-white shadow-2xl shadow-zinc-200/50 overflow-hidden">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {businesses.map((business) => (
                    business.coordinates?.lat && (
                        <Marker
                            key={business.id}
                            position={business.coordinates}
                            onClick={() => setSelectedBusiness(business)}
                            icon={{
                                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                                fillColor: '#18181b', // Zinc-900
                                fillOpacity: 1,
                                strokeColor: '#ffffff',
                                strokeWeight: 2,
                                scale: 2,
                                anchor: new google.maps.Point(12, 22), // Center bottom of pin
                            }}
                        />
                    )
                ))}

                {selectedBusiness && (
                    <InfoWindow
                        position={selectedBusiness.coordinates}
                        onCloseClick={() => setSelectedBusiness(null)}
                        options={{
                            pixelOffset: new window.google.maps.Size(0, -30),
                            maxWidth: 320
                        }}
                    >
                        <div className="p-0 min-w-[200px] max-w-[220px] overflow-hidden">
                            {/* Image Header */}
                            <div className="relative h-24 w-full bg-zinc-100 rounded-t-lg overflow-hidden">
                                <CustomImage
                                    src={selectedBusiness.image || "/placeholder.jpg"}
                                    alt={selectedBusiness.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-[10px] font-bold text-zinc-900">{selectedBusiness.rating}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-3 pb-1">
                                <h4 className="font-bold text-zinc-900 text-sm leading-tight mb-1 line-clamp-1">
                                    {selectedBusiness.name}
                                </h4>
                                <p className="text-[10px] text-zinc-500 mb-2 line-clamp-1 flex items-center gap-1">
                                    <MapIcon className="w-3 h-3 text-zinc-400" />
                                    {selectedBusiness.address}
                                </p>

                                <a
                                    href={`/business/${selectedBusiness.slug}`}
                                    className="block w-full py-1.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider text-center rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default ExploreMap;
