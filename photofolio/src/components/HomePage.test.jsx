/**
 * @jest-environment jsdom
 */
import { React } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import HomePage from './HomePage';

test('HomePage component matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <HomePage
        postModalIsOpen={false}
        setPostModalOpen={() => {}}
        closePostModal={() => {}}
        setAlert={() => {}}
      />
    </MemoryRouter>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('CreateModal opens when create post fab clicked', async () => {
  render(
    <MemoryRouter>
      <HomePage
        postModalIsOpen={false}
        setPostModalOpen={() => {}}
        closePostModal={() => {}}
        setAlert={() => {}}
      />
    </MemoryRouter>
  );
  const createBtn = screen.getByRole('button', { name: 'new New Post' });
  await userEvent.click(createBtn);
  expect(screen.getByText(/New/)).toBeVisible();
});
