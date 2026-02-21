
import {
    Sparkles,
    Scissors,
    Flower2,
    Heart,
    Zap,
    Smile,
    Hand,
    Waves
} from "lucide-react";

export const SERVICES_DATA = [
    // Spa Category
    {
        id: 1,
        title: "Swedish Massage",
        icon: Waves,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399336/1_b4laro.png",
        category: "Spa",
        description: "Gentle full-body massage for complete relaxation"
    },
    {
        id: 2,
        title: "Deep Tissue",
        icon: Zap,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399346/3_tg8oe1.png",
        category: "Spa",
        description: "Intense pressure to release chronic muscle tension"
    },
    {
        id: 3,
        title: "Aromatherapy",
        icon: Flower2,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399347/2_vyncgx.png",
        category: "Spa",
        description: "Therapeutic massage with essential plant oils"
    },
    {
        id: 4,
        title: "Couple Spa",
        icon: Heart,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399342/4_hb33eu.png",
        category: "Spa",
        description: "Shared relaxation experience for two"
    },

    // Salon Category
    {
        id: 6,
        title: "Designer Haircut",
        icon: Scissors,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399335/5_fmtzw7.png",
        category: "Salon",
        description: "Precision cutting and styling by expert stylists"
    },
    {
        id: 7,
        title: "Bridal Makeup",
        icon: Sparkles,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399338/6_x9sr11.png",
        category: "Salon",
        description: "Exquisite makeup for your special day"
    },

    // Beauty & Care Category
    {
        id: 11,
        title: "Hydrafacial",
        icon: Smile,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399334/7_hhhxju.png",
        category: "Beauty",
        description: "Hydrating facial for a clear, radiant complexion"
    },
    {
        id: 12,
        title: "Luxury Manicure",
        icon: Hand,
        image: "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399342/8_q7tlq6.png",
        category: "Beauty",
        description: "Premium nail care and artistic polishing"
    }
];

export const CATEGORIES_DATA = [
    {
        id: 'Spa',
        label: 'Spa',
        image: "https://img.freepik.com/premium-vector/vector-design-wellness-spa-icon-style_822882-284006.jpg"
    },
    {
        id: 'Salon',
        label: 'Salons',
        image: "https://img.freepik.com/premium-vector/black-vector-beauty-salon-hairdresser-icon-design_968452-53.jpg"
    },
    {
        id: 'Beauty',
        label: 'Beauty & Care',
        image: "https://img.freepik.com/premium-vector/skin-care-icon-vector-image-can-be-used-dermatology_120816-47339.jpg"
    }
];

export const STATES_DATA = [
    {
        id: 'AndhraPradesh',
        label: 'Andhra Pradesh',
        image: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-veerabhadra-swamy-temple-telangana-andhra-pradesh-state-hero?qlt=82&ts=1726744221624'
    },
    {
        id: 'Assam',
        label: 'Assam',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2000&q=80'
    },
    {
        id: 'Goa',
        label: 'Goa',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80'
    },
    {
        id: 'Gujarat',
        label: 'Gujarat',
        image: 'https://www.peakadventuretour.com/assets/imgs/gujarat-tourism-06.webp'
    },
    {
        id: 'Karnataka',
        label: 'Karnataka',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAweqF3LwuNDVSDxliK2AAcdjk2RR5F0Lsh7X9MCJA8Gn7hCCGOL1etkjnbbzHI0_fr7pALUpd0vsFw0M3VERE7HKd2IK07AEYWcIGrPl9f2AoquExnWUUhPaX50WtA0-HrbxspAgiOg=w594-h343-n-k-no'
    },
    {
        id: 'Kerala',
        label: 'Kerala',
        image: 'https://assets.cntraveller.in/photos/65f445fc8411ed4511e9a4c9/4:3/w_4992,h_3744,c_limit/GettyImages-110051777.jpg'
    },
    {
        id: 'Maharashtra',
        label: 'Maharashtra',
        image: 'https://etedge-insights.com/wp-content/uploads/2025/04/resizecom_shutterstock_2377669253.jpg'
    },
    {
        id: 'Rajasthan',
        label: 'Rajasthan',
        image: 'https://s7ap1.scene7.com/is/image/incredibleindia/hawa-mahal-jaipur-rajasthan-city-1-hero?qlt=82&ts=1742200253577'
    },
    {
        id: 'UttarPradesh',
        label: 'Uttar Pradesh',
        image: 'https://www.ibef.org/assets/images/Uttar-Pradesh-tajmahal.jpg'
    }
];

export const REVIEWS_DATA = [
    {
        title: "Incredible attention to detail",
        text: "The massage therapist was wonderful! Truly a high-end experience from start to finish. I feel rejuvenated and ready for the week.",
        name: "Ritika Malhotra",
        location: "Chandigarh, India",
        avatar: "https://randomuser.me/api/portraits/women/74.jpg",
    },
    {
        title: "Perfect for busy professionals",
        text: "As someone with a hectic schedule, this app saves so much time. I can book grooming services after office hours without any hassle.",
        name: "Karan Singh",
        location: "Gurugram, India",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
        title: "Reliable and trustworthy salons",
        text: "All salons I’ve tried through this platform have been hygienic and professional. Verified reviews really make a difference.",
        name: "Neha Kapoor",
        location: "Noida, India",
        avatar: "https://randomuser.me/api/portraits/women/66.jpg",
    },
    {
        title: "Best app for spa lovers",
        text: "I frequently book aromatherapy and relaxation massages. The experience has been consistently great every time.",
        name: "Arjun Nair",
        location: "Kochi, India",
        avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    },
    {
        title: "Affordable and premium options",
        text: "Love that I can find both budget-friendly salons and premium spas in one place. Great offers too!",
        name: "Shivani Gupta",
        location: "Jaipur, India",
        avatar: "https://randomuser.me/api/portraits/women/59.jpg",
    },
    {
        title: "Smooth booking & great support",
        text: "Had to reschedule my appointment and customer support handled it quickly. Very smooth overall experience.",
        name: "Mohit Bansal",
        location: "Ludhiana, India",
        avatar: "https://randomuser.me/api/portraits/men/57.jpg",
    },
];
