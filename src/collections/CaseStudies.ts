import type { CollectionConfig } from 'payload';

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'text',
      required: true,
    },
    {
      name: 'industry',
      type: 'select',
      required: true,
      options: [
        { label: 'SaaS', value: 'saas' },
        { label: 'E-commerce', value: 'ecommerce' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Education', value: 'education' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short elevator pitch (2-3 sentences)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Which services were provided in this case study',
      },
    },
    {
      name: 'results',
      type: 'array',
      fields: [
        {
          name: 'metric',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., "Conversion Rate"',
          },
        },
        {
          name: 'improvement',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., "+127%"',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
};
