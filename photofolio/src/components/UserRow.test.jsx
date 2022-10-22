/**
 * @jest-environment jsdom
 */

import React from 'react';
// import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';

import UserRow from './UserRow';

// snapshot testing
test('Post Modal matches snapshot', () => {
  const component = renderer.create(
    <UserRow avatar="" name="" userId={1} showFollow />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

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
  const unfollowBtn = screen.getByRole('button', { name: 'followed' });
  userEvent.click(unfollowBtn);
});
