import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArrowRight, CircleGauge, MoveRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { IconButton } from '../components/ui/icon-button';
import { Input } from '../components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SectionHeader } from '../components/ui/section-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

function FoundationShowcase() {
  const [tab, setTab] = useState('overview');
  const [sector, setSector] = useState('Residential');

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-6 py-10 text-black md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <SectionHeader
          eyebrowLabel="Igloo system"
          title="Foundation showcase"
          description="Buttons, cards, inputs, filters, and micro-interactions share the same spacing rhythm."
          action={(
            <Badge variant="soft">
              {tab === 'overview' ? 'Overview' : 'Signals'}
            </Badge>
          )}
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Primary, secondary, and icon-only controls.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <IconButton aria-label="Next" variant="outline">
                <ArrowRight className="h-4 w-4" />
              </IconButton>
            </CardContent>
            <CardFooter className="gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Active</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filter shell</CardTitle>
              <CardDescription>Tabs on desktop, select on narrow layouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="flex w-full flex-wrap gap-2 border-0 bg-transparent p-0">
                  <TabsTrigger value="overview" className="rounded-full px-4 py-2">Overview</TabsTrigger>
                  <TabsTrigger value="signals" className="rounded-full px-4 py-2">Signals</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 text-sm text-black/65">
                  The active tab keeps its shape, color, and spacing stable.
                </TabsContent>
                <TabsContent value="signals" className="mt-4 text-sm text-black/65">
                  Use the same control surface for varied information density.
                </TabsContent>
              </Tabs>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input placeholder="Search projects" />
                <Popover>
                  <PopoverTrigger asChild>
                    <IconButton type="button" variant="outline" aria-label="Filter info">
                      <Search className="h-4 w-4" />
                    </IconButton>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-sm leading-relaxed text-black/70">
                      The filter shell stays tight on mobile and does not stretch the row.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>

              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card variant="muted">
            <CardHeader>
              <CardTitle>Layout rhythm</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-black/65">
              Spacing, border radius, and button height stay aligned across the surface set.
            </CardContent>
          </Card>
          <Card variant="inverse">
            <CardHeader>
              <CardTitle>Dark surface</CardTitle>
              <CardDescription className="text-white/60">Card inverse keeps contrast readable.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                Review
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tooltip state</CardTitle>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton type="button" variant="outline" aria-label="Show metrics">
                      <CircleGauge className="h-4 w-4" />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>Metrics</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2 text-sm text-black/55">
          <MoveRight className="h-4 w-4" />
          The same components scale from individual controls to composed pages.
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Igloo/FoundationShowcase',
  component: FoundationShowcase,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FoundationShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="mx-auto w-[390px] max-w-full">
      <FoundationShowcase />
    </div>
  ),
};
