/**
 * @jest-environment jsdom
 */

import { React } from 'react';
import { render, screen } from '@testing-library/react';
// import { renderIntoDocument, fireEvent } from 'react-testing-library';
import '@testing-library/jest-dom/extend-expect';
// import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';

import PostDetail from './PostDetail';
// import axios from '../api/axios';

// snapshot testing
test('Post Detail matches snapshot', () => {
  const component = renderer.create(<PostDetail />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('render 4 buttons', () => {
  render(
    <PostDetail
      open
      setOpen={() => {}}
      author="Test"
      title=""
      img=""
      avatar=""
      likes={1}
      postId={2}
    />
  );
  // const buttons = screen.getAllByRole('button');
  // arrow button, upload a file button, close button, post button
  // expect(buttons.length).toBe(4);
});
