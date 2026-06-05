export interface DocMetadata {
  id: string;
  title: string;
  path: string;
  icon?: string;
}

export const docsMetadata: DocMetadata[] = [
  { id: 'getting-started', title: 'Getting Started', path: '/docs/getting-started.md', icon: 'Book' },
  { id: 'customization', title: 'Customization', path: '/docs/customization.md', icon: 'Palette' },
  { id: 'markdown-guide', title: 'Markdown Guide', path: '/docs/markdown-guide.md', icon: 'FileText' },
  { id: 'component-examples', title: 'Component Examples', path: '/docs/component-examples.md', icon: 'Component' },
  { id: 'advanced-features', title: 'Advanced Features', path: '/docs/advanced-features.md', icon: 'Zap' }
];
