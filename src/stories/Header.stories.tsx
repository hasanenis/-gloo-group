import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionHeader } from '../components/ui/section-header';

const meta = {
  title: 'Igloo/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrowLabel: 'Editorial system',
    title: 'Project rhythm',
    description: 'A consistent header treatment keeps the page hierarchy legible across wide and narrow layouts.',
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    eyebrowLabel: 'Centered',
    title: 'Balanced compositions',
    description: 'Useful for small feature bands or hero-like section intros.',
  },
};

export const Inverse: Story = {
  args: {
    eyebrowLabel: 'Dark surface',
    title: 'Contrast control',
    description: 'The inverse variant keeps the hierarchy readable on editorial dark sections.',
  },
  render: (args) => (
    <div className="bg-black p-8">
      <SectionHeader tone="inverse" {...args} />
    </div>
  ),
};
