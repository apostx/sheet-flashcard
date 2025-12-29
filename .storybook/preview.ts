import type { Preview } from '@storybook/react-vite'
import '../src/styles/app.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f7fa' },
        { name: 'dark', value: '#1a1a2e' },
      ],
    },
  },
};

export default preview;