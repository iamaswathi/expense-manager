import {
    Utensils,
    Briefcase,
    Home,
    Train,
    CreditCard,
    ShoppingCart,
    PiggyBank,
    Heart,
    Bus,
    HelpCircle,
  } from 'lucide-react';

  export const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()){
        case 'salary': 
            return <Briefcase className="w-5 h-5 text-orange-500" />;
        case 'food':
            return <Utensils className="w-5 h-5 text-orange-500" />;
        case 'rent': 
            return <Home className="w-5 h-5 text-orange-500" />;
        case 'transport':
            return <Train className="w-5 h-5 text-orange-500" />;
        case 'shopping': 
            return <ShoppingCart className="w-5 h-5 text-orange-500" />;
        case 'savings':
            return <PiggyBank className="w-5 h-5 text-orange-500" />;
        case 'health': 
            return <Heart className="w-5 h-5 text-orange-500" />;
        default:
            return <HelpCircle className="w-5 h-5 text-orange-500" />;
    }
  };