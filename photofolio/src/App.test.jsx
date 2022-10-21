/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import App from './App';

test('renders login page', () => {
  render(<App />);
  const userNameEle = screen.getByText('Username:');
  expect(userNameEle).toBeInTheDocument();
});
