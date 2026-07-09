import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Igloo/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Explore
        <ArrowRight className="h-4 w-4" />
      </>
    ),
  },
};
