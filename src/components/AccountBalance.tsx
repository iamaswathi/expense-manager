import { Info, Repeat } from "lucide-react";
import { useState } from "react";

interface AccountBalanceProps {
    available: number;
    spendable: number;
};

export default function AccountBalance({available, spendable}: AccountBalanceProps) {
    const [showAvailable, setShowAvailable] = useState(true);
    const toggleBalance = () => setShowAvailable((prev) => !prev);
    return(
        <div className="w-1/4" onClick={toggleBalance}>
            <p>${showAvailable ? available.toFixed(2) : spendable.toFixed(2)}</p>
            <div className="">
                <span>{showAvailable ? 'Available' : 'Spendable'}</span>
                <span><Repeat size={14}className="text-gray-400 hover:text-gray-600"/></span>
            </div>
        </div>
    );
}