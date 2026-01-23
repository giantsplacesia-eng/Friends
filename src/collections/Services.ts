import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'priority'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Service Title',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'AI & Automation', value: 'ai' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Strategy', value: 'strategy' },
        { label: 'Development', value: 'development' },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Service Description',
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'High (Large Button)', value: 'high' },
        { label: 'Medium (Standard Button)', value: 'medium' },
        { label: 'Low (Small Button)', value: 'low' },
      ],
      admin: {
        description: 'Controls the size of the floating navigation button',
      },
    },
    {
      name: 'vibrationIntensity',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 10,
      admin: {
        description: 'Controls how aggressively this button floats (1=calm, 10=energetic)',
      },
    },
    {
      name: 'giantBehavior',
      type: 'select',
      required: true,
      defaultValue: 'neutral',
      options: [
        { label: 'Neutral Stance', value: 'neutral' },
        { label: 'Pointing at Data', value: 'pointing' },
        { label: 'Wearing AI Goggles', value: 'goggles' },
        { label: 'Thinking Pose', value: 'thinking' },
        { label: 'Celebrating', value: 'celebrating' },
      ],
      admin: {
        description: 'How the Giant character behaves when this service is active',
      },
    },
    {
      name: 'icon',
      type: 'text',
      required: false,
      admin: {
        description: 'Lucide icon name (e.g., "brain", "rocket", "zap")',
      },
    },
  ],
};
