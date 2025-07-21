import {
    Utensils,
    Briefcase,
    Home,
    Train,
    ShoppingCart,
    PiggyBank,
    Heart,
    HelpCircle,
    Drama,
    ShoppingBasket,
    UtilityPole,
  } from 'lucide-react';

  export const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()){
        case 'salary': 
            return <Briefcase/>;
        case 'food':
            return <Utensils/>;
        case 'rent': 
            return <Home/>;
        case 'transport':
            return <Train/>;
        case 'shopping': 
            return <ShoppingCart/>;
        case 'entertainment': 
            return <Drama/>;
        case 'grocery': 
            return <ShoppingBasket/>;
        case 'savings':
            return <PiggyBank/>;
        case 'health': 
            return <Heart/>;
        case 'utility':
            return <UtilityPole/>;
        default:
            return <HelpCircle/>;
    }
  };