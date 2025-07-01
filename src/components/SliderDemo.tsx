
import React from 'react';
import { Slider } from '@/components/ui/slider';

export const SliderDemo = () => {
  return (
    <div className="w-full space-y-3">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  );
};
