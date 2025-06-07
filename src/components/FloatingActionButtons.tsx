
import React, { useState } from 'react';
import { BillsFAB } from './BillsFAB';
import { motion } from 'framer-motion';

export const FloatingActionButtons: React.FC = () => {
  return (
    <div className="fixed bottom-32 left-4 z-[50]">
      <BillsFAB />
    </div>
  );
};
