/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import Register from './components/Register';
import Login from './components/Login';
import axios from './api/axios';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// test('renders Home page', () => {
//   const { getByText } = render(
//   <MemoryRouter>
//     <HomePage />
//   </MemoryRouter>
//   );
//   const linkElement = getByText(/Recommended for you/);
//   expect(linkElement).toBeInTheDocument();
// });

const mockAxios = new MockAdapter(axios);

test('the api returned correct user information', async ()=>{
  await mockAxios.onGet().reply(200, {
    username: 'Emily', 
    password: 'ASDFasdf1234!'
  });
})

test("login test", async() => {
  const { getByText } = render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  const checkTitle = getByText('Welcome to photofolio!');
  expect(checkTitle).toBeInTheDocument();
  const checkUsername = getByText('Username:');
  expect(checkUsername).toBeInTheDocument();
  const checkPassword = getByText('Password:');
  expect(checkPassword).toBeInTheDocument();
  const Button = screen.getByRole('button');
  const username = screen.getByLabelText('Username:');
  const password = screen.getByLabelText('Password:');
  await userEvent.type(username, 'Emily');
  await userEvent.type(password, 'ASDFasdf1234!');
  expect(username).toHaveValue('Emily');
  expect(password).toHaveValue('ASDFasdf1234!');
  await fireEvent.click(Button);
});

test('Resgister Snapshot Test', async () => {
  render(
  <MemoryRouter>
    <Register />
  </MemoryRouter>
  );
  const Button = screen.getByRole('button');
  const username = screen.getByLabelText('Username:');
  const password = screen.getByLabelText('Password:');
  await userEvent.type(username, 'Emily');
  await userEvent.type(password, 'ASDFasdf1234!');
  expect(username).toHaveValue('Emily');
  expect(password).toHaveValue('ASDFasdf1234!');
  await fireEvent.click(Button);
});
