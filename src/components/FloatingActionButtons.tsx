import React from "react";
import {
  RxDashboard,
  RxPerson,
  RxEnvelopeClosed,
  RxGear,
  RxSpeakerLoud,
} from "react-icons/rx";
import { FaBalanceScale } from "react-icons/fa";
import { PiHandCoinsDuotone } from "react-icons/pi";
import { TbPigMoney } from "react-icons/tb";
import { useSnapshot } from "valtio";
import state from "@/store";

interface FloatingActionButtonsProps {
  onDashboardClick: () => void;
  onBillsClick: () => void;
  onRadioClick: () => void;
  onBudgetClick: () => void;
  onTaxClick: () => void;
  onInvestmentClick: () => void;
  onDigitalClick: () => void;
  onContactClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onDashboardClick,
  onBillsClick,
  onRadioClick,
  onBudgetClick,
  onTaxClick,
  onInvestmentClick,
  onDigitalClick,
  onContactClick,
  onProfileClick,
  onSettingsClick,
}) => {
  const snap = useSnapshot(state);
  return (
    <div
      className={`fixed z-50 rounded-full bottom-8 right-8 flex flex-col items-center gap-3 bg-white p-4 shadow-lg ${
        snap.isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <button
        onClick={onDashboardClick}
        className="flex items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <RxDashboard className="h-6 w-6" />
      </button>

      <button
        onClick={onBillsClick}
        className="flex items-center justify-center rounded-full bg-green-500 p-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <FaBalanceScale className="h-6 w-6" />
      </button>

      <button
        onClick={onRadioClick}
        className="flex items-center justify-center rounded-full bg-red-500 p-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        <RxSpeakerLoud className="h-6 w-6" />
      </button>

      <button
        onClick={onBudgetClick}
        className="flex items-center justify-center rounded-full bg-purple-500 p-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <TbPigMoney className="h-6 w-6" />
      </button>

      <button
        onClick={onTaxClick}
        className="flex items-center justify-center rounded-full bg-yellow-500 p-2 text-black hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <PiHandCoinsDuotone className="h-6 w-6" />
      </button>

      <button
        onClick={onInvestmentClick}
        className="flex items-center justify-center rounded-full bg-orange-500 p-2 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <RxEnvelopeClosed className="h-6 w-6" />
      </button>

      <button
        onClick={onDigitalClick}
        className="flex items-center justify-center rounded-full bg-teal-500 p-2 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        <RxGear className="h-6 w-6" />
      </button>

      <button
        onClick={onContactClick}
        className="flex items-center justify-center rounded-full bg-pink-500 p-2 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <RxEnvelopeClosed className="h-6 w-6" />
      </button>

      <button
        onClick={onProfileClick}
        className="flex items-center justify-center rounded-full bg-gray-500 p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <RxPerson className="h-6 w-6" />
      </button>

      <button
        onClick={onSettingsClick}
        className="flex items-center justify-center rounded-full bg-indigo-500 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <RxGear className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatingActionButtons;
