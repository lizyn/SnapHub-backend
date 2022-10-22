/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import HomePage from './components/HomePage';
import Register from './components/Register';

test('renders Home page', () => {
  const { getByText } = render(<HomePage />);
  const linkElement = getByText(/Recommended for you/);
  expect(linkElement).toBeInTheDocument();
});

test('Resgister Snapshot Test', async () => {
  render(<Register />);
  const Button = screen.getByRole('button');
  const username = screen.getByLabelText('Username:');
  const password = screen.getByLabelText('Password:');
  await userEvent.type(username, 'Emily');
  await userEvent.type(password, 'ASDFasdf1234!');
  expect(username).toHaveValue('Emily');
  expect(password).toHaveValue('ASDFasdf1234!');
  await fireEvent.click(Button);
});
