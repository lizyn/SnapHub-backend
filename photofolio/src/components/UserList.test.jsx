/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserList from './UserList';
// import userEvent from '@testing-library/user-event';

test('render 6 userrows', () => {
  const { container } = render(<UserList />);
  expect(container.getElementsByClassName('user-row-card').length).toBe(6);
});
