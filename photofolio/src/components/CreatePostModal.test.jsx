/**
 * @jest-environment jsdom
 */

import { React } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { renderIntoDocument, fireEvent } from 'react-testing-library';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';

import CreatePostModal from './CreatePostModal';
import axios from '../api/axios';

// snapshot testing
test('Post Modal matches snapshot', () => {
  const component = renderer.create(<CreatePostModal />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('render 4 buttons', () => {
  render(<CreatePostModal open closeModal={() => {}} setAlert={() => {}} />);
  const buttons = screen.getAllByRole('button');
  // arrow button, upload a file button, close button, post button
  expect(buttons.length).toBe(4);
});

test('post button disabled without file', async () => {
  const component = render(
    <CreatePostModal open closeModal={() => {}} setAlert={() => {}} />
  );
  const postBtn = screen.getByRole('button', { name: /Post/ });
  expect(postBtn).toBeDisabled();
});

it('button available after file upload', async () => {
  const { container, getByLabelText, getByText, getByAltText } = await render(
    <CreatePostModal open closeModal={() => {}} setAlert={() => {}} />
  );
  window.URL.createObjectURL = jest.fn();
  axios.post = jest.fn();
  const image = new File(['（￣▽￣）'], 'chucknorris.png', {
    type: 'image/png'
  });
  // const video = new File(['（￣▽￣）'], 'chucknorris.mp4', {
  //   type: 'video/mp4'
  // });
  const imageInput = getByLabelText('Upload A File');
  Object.defineProperty(imageInput, 'files', {
    value: [image]
  });
  await fireEvent.change(imageInput);

  const postBtn = await screen.getByRole('button', { name: /Post/ });

  expect(postBtn).not.toBeDisabled();
  userEvent.click(postBtn);
});

test('title and caption change on input', async () => {
  render(<CreatePostModal open closeModal={() => {}} setAlert={() => {}} />);
  const title = screen.getByRole('textbox', { name: 'Title…' });
  // type some text  into the textbox
  await userEvent.type(title, 'some title');
  expect(title).toHaveValue('some title');

  const caption = screen.getByRole('textbox', { name: 'Caption…' });
  // type some text  into the textbox
  await userEvent.type(caption, 'some caption');
  expect(caption).toHaveValue('some caption');
});
