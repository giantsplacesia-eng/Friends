import type { CollectionConfig } from 'payload';

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'company', 'status', 'createdAt'],
  },
  access: {
    read: () => true, // For demo purposes - restrict in production
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'company',
      type: 'text',
      required: false,
    },
    {
      name: 'companyUrl',
      type: 'text',
      required: false,
      admin: {
        description: 'Company website - triggers AI analysis',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Analyzed', value: 'analyzed' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Converted', value: 'converted' },
      ],
    },
    {
      name: 'interestedIn',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services the lead expressed interest in',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Initial message from the lead',
      },
    },
    {
      name: 'aiAnalyzed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Has this lead been analyzed by AI?',
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Internal notes',
      },
    },
  ],
};
