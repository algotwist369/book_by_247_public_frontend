export interface Review {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
}

export interface Business {
    id: string;
    name: string;
    slug: string;
    images: string[];
    image?: string;
    rating: number;
    reviews: number;
    address: string;
    city?: string;
    branch?: string;
    tours?: string[];
    videos?: string[];
    categories?: string[];
    tags?: string[];
    description?: string;
    price: number;
    amenities: string[];
    gender: 'Any' | 'Male' | 'Female' | 'Unisex';
    coordinates: {
        lat: number;
        lng: number;
    };
    reviewsList?: Review[];
    services?: any[];
    distanceKm?: number;
    isOpen?: boolean;
}


export const dummyReviews: Review[] = [
    {
        id: "r1",
        author: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        date: "2 days ago",
        content: "Absolutely amazing experience! The staff was incredibly professional and the ambiance was perfect. unique services."
    },
    {
        id: "r2",
        author: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        rating: 4,
        date: "1 week ago",
        content: "Great service, but the waiting time was a bit long. Otherwise, everything was top-notch."
    },
    {
        id: "r3",
        author: "Emily Davis",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        date: "3 weeks ago",
        content: "Love this place! I come here every month for my facials. Highly recommended."
    },
    {
        id: "r4",
        author: "David Wilson",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        date: "1 month ago",
        content: "Best haircut I've had in years. The stylist really listened to what I wanted."
    }
];

export const dummyBusinesses: Business[] = [
    {
        id: "1",
        name: "Royal Touch Spa",
        slug: "royal-touch-spa-t-nagar",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg",
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.8,
        reviews: 132,
        address: "Usman Road, T Nagar",
        branch: "T NAGAR BRANCH",
        price: 1200,
        amenities: ["Free Wi-Fi", "Parking Available", "Air Conditioning"],
        gender: "Unisex",
        coordinates: { lat: 13.0418, lng: 80.2341 },
        reviewsList: dummyReviews
    },
    {
        id: "2",
        name: "Serenity Wellness",
        slug: "serenity-wellness-anna-nagar",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.5,
        reviews: 89,
        address: "Anna Nagar, West",
        branch: "ANNA NAGAR BRANCH",
        price: 800,
        amenities: ["Air Conditioning", "Card Payment"],
        gender: "Female",
        coordinates: { lat: 13.0850, lng: 80.2101 },
        reviewsList: dummyReviews
    },
    {
        id: "3",
        name: "Glow & Lovely Salon",
        slug: "glow-and-lovely-salon-adyar",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.9,
        reviews: 210,
        address: "Adyar Main Road",
        branch: "ADYAR BRANCH",
        price: 450,
        amenities: ["Free Wi-Fi", "Card Payment", "Online Booking"],
        gender: "Female",
        coordinates: { lat: 13.0067, lng: 80.2578 },
        reviewsList: dummyReviews
    },
    {
        id: "4",
        name: "Elite Grooming",
        slug: "elite-grooming-velachery",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.7,
        reviews: 56,
        address: "Velachery bypass road",
        branch: "VELACHERY BRANCH",
        price: 600,
        amenities: ["Parking Available", "Air Conditioning"],
        gender: "Male",
        coordinates: { lat: 12.9796, lng: 80.2185 },
        reviewsList: dummyReviews
    },
    {
        id: "5",
        name: "Royal Touch Spa",
        slug: "royal-touch-spa-t-nagar-2",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.8,
        reviews: 132,
        address: "Usman Road, T Nagar",
        branch: "T NAGAR BRANCH",
        price: 1500,
        amenities: ["Parking Available", "Card Payment"],
        gender: "Unisex",
        coordinates: { lat: 13.0428, lng: 80.2351 },
        reviewsList: dummyReviews
    },
    {
        id: "6",
        name: "Serenity Wellness",
        slug: "serenity-wellness-anna-nagar-2",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.5,
        reviews: 89,
        address: "Anna Nagar, West",
        branch: "ANNA NAGAR BRANCH",
        price: 2600,
        amenities: ["Free Wi-Fi", "Air Conditioning", "Online Booking"],
        gender: "Female",
        coordinates: { lat: 13.0860, lng: 80.2111 },
        reviewsList: dummyReviews
    },
    {
        id: "7",
        name: "Glow & Lovely Salon",
        slug: "glow-and-lovely-salon-adyar-2",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.9,
        reviews: 210,
        address: "Adyar Main Road",
        branch: "ADYAR BRANCH",
        price: 350,
        amenities: ["Card Payment"],
        gender: "Any",
        coordinates: { lat: 13.0077, lng: 80.2588 },
        reviewsList: dummyReviews
    },
    {
        id: "8",
        name: "Elite Grooming",
        slug: "elite-grooming-velachery-2",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.7,
        reviews: 56,
        address: "Velachery bypass road",
        branch: "VELACHERY BRANCH",
        price: 750,
        amenities: ["Parking Available"],
        gender: "Male",
        coordinates: { lat: 12.9806, lng: 80.2195 },
        reviewsList: dummyReviews
    },
    {
        id: "9",
        name: "Royal Touch Spa",
        slug: "royal-touch-spa-t-nagar-3",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.8,
        reviews: 132,
        address: "Usman Road, T Nagar",
        branch: "T NAGAR BRANCH",
        price: 1100,
        amenities: ["Air Conditioning", "Card Payment"],
        gender: "Unisex",
        coordinates: { lat: 13.0438, lng: 80.2361 },
        reviewsList: dummyReviews
    },
    {
        id: "10",
        name: "Serenity Wellness",
        slug: "serenity-wellness-anna-nagar-3",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg",
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.5,
        reviews: 89,
        address: "Anna Nagar, West",
        branch: "ANNA NAGAR BRANCH",
        price: 2200,
        amenities: ["Free Wi-Fi", "Parking Available", "Air Conditioning", "Card Payment", "Online Booking"],
        gender: "Female",
        coordinates: { lat: 13.0870, lng: 80.2121 },
        reviewsList: dummyReviews
    },
    {
        id: "11",
        name: "Glow & Lovely Salon",
        slug: "glow-and-lovely-salon-adyar-3",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.9,
        reviews: 210,
        address: "Adyar Main Road",
        branch: "ADYAR BRANCH",
        price: 400,
        amenities: ["Card Payment", "Online Booking"],
        gender: "Any",
        coordinates: { lat: 13.0087, lng: 80.2598 },
        reviewsList: dummyReviews
    },
    {
        id: "12",
        name: "Elite Grooming",
        slug: "elite-grooming-velachery-3",
        images: [
            "https://thaiodyssey.co.in/assets/img/blog/475003.jpg",
            "https://dzhi65wojqlkc.cloudfront.net/blog/wp-content/uploads/2024/06/tractament12007.png",
            "https://expatliving.sg/wp-content/uploads/2025/09/Spa-day.jpg"
        ],
        rating: 4.7,
        reviews: 56,
        address: "Velachery bypass road",
        branch: "VELACHERY BRANCH",
        price: 900,
        amenities: ["Parking Available", "Air Conditioning"],
        gender: "Male",
        coordinates: { lat: 12.9816, lng: 80.2205 },
        reviewsList: dummyReviews
    }
];
