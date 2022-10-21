/**
 * @jest-environment jsdom
 */

import React from 'react';
// import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import UserRow from './UserRow';

test('renders component with Follow button', () => {
  render(<UserRow avatar="" name="" userId={1} showFollow />);
  const followBtn = screen.getByText(/follow/);
  expect(followBtn).toBeInTheDocument();
});

test('without Follow button', () => {
  render(<UserRow avatar="" name="" userId={1} />);
  const followBtn = screen.queryByText(/follow/);
  expect(followBtn).not.toBeInTheDocument();
});

it('test', async () => {
  render(<UserRow avatar="avatar" name="name" userId={1} showFollow />);
  // manually trigger the callback
  const followBtn = screen.getByRole('button', { name: 'follow' });
  userEvent.click(followBtn);
  // re-rendering
  // followBtn = screen.getByRole('button', { name: 'unfollow' });
});
