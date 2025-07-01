
import React, { useState, useEffect, useCallback } from "react";
import { BillsSidebar } from "@/components/BillsSidebar";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { UserCountSidebar } from "@/components/UserCountSidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Aurora } from "@/components/Aurora";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Copy, Share2, User2, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Radio } from "lucide-react";
import { SliderDemo } from "@/components/SliderDemo";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ModeToggle";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Dock from "@/components/Dock";
import { Compass, Home, Book, Settings, Bell, Mail, User, Sun, Moon } from 'lucide-react';
import ExternalRadioWindow from "../components/ExternalRadioWindow";

const Index = () => {
  const isPageWide = useMediaQuery("(min-width: 768px)");
  const [isBillsOpen, setBillsOpen] = useState(false);
  const [isUsersOpen, setUsersOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isCommandOpen, setCommandOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isExternalRadioOpen, setIsExternalRadioOpen] = useState(false);

  const handleRadioClick = () => {
    setIsExternalRadioOpen(true);
  };

  const dockItems = [
    { icon: <Home />, label: 'Home', onClick: () => console.log('Home clicked') },
    { icon: <Book />, label: 'Bills', onClick: () => setBillsOpen(true) },
    { icon: <Radio />, label: 'Radio', onClick: handleRadioClick, className: "radio-button" },
    { icon: <Compass />, label: 'Explore', onClick: () => console.log('Explore clicked') },
    { icon: <Settings />, label: 'Settings', onClick: () => console.log('Settings clicked') },
    { icon: <Bell />, label: 'Notifications', onClick: () => console.log('Notifications clicked') },
    { icon: <Mail />, label: 'Messages', onClick: () => console.log('Messages clicked') },
    { icon: <User />, label: 'Profile', onClick: () => setUsersOpen(true) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <Aurora />

      <DarkModeToggle className="absolute top-4 right-4 z-10" />

      {/* Radio Components */}
      <ExternalRadioWindow 
        isOpen={isExternalRadioOpen} 
        onClose={() => setIsExternalRadioOpen(false)} 
      />

      <BillsSidebar isOpen={isBillsOpen} onClose={() => setBillsOpen(false)} />
      <UserCountSidebar isOpen={isUsersOpen} onClose={() => setUsersOpen(false)} />

      <FloatingActionButtons
        onDashboardClick={() => console.log('Dashboard clicked')}
        onBillsClick={() => setBillsOpen(true)}
        onRadioClick={handleRadioClick}
        onBudgetClick={() => console.log('Budget clicked')}
        onTaxClick={() => console.log('Tax clicked')}
        onInvestmentClick={() => console.log('Investment clicked')}
        onDigitalClick={() => console.log('Digital clicked')}
        onContactClick={() => console.log('Contact clicked')}
        onProfileClick={() => setUsersOpen(true)}
        onSettingsClick={() => console.log('Settings clicked')}
      />

      <Dock items={dockItems} />
    </div>
  );
};

export default Index;
