/**
 * @jest-environment jsdom
 */

import { React } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import PostDetail from './PostDetail';

// snapshot testing
test('PostDetail component matches snapshot', () => {
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

test('Like btn respond/changes when a post is liked', async () => {
  render(
    <PostDetail
      open
      setOpen={() => {}}
      author="author"
      avatar="/"
      img="/"
      likes={5}
      commentIds={[]}
      title="post-test"
      commentNum={0}
      postId={0}
    />
  );
  const likeBtn = screen.getByRole('button', { name: 'like' });
  await userEvent.click(likeBtn);
  const liked = screen.getByRole('button', { name: 'like' });
  expect(liked).toBeVisible();
});

test('comment box updates when user types', async () => {
  render(
    <PostDetail
      open
      setOpen={() => {}}
      author="author"
      avatar="/"
      img="/"
      likes={5}
      commentIds={[]}
      title="post-test"
      postId={0}
    />
  );
  const comment = screen.getByRole('textbox');
  await userEvent.type(comment, 'I like your post');
  expect(comment).toHaveValue('I like your post');
});

test('comment box clears after user post comment', async () => {
  render(
    <PostDetail
      open
      setOpen={() => {}}
      author="author"
      avatar="/"
      img="/"
      likes={5}
      commentIds={[]}
      title="post-test"
      postId={0}
    />
  );
  const comment = screen.getByRole('textbox');
  const submitComment = screen.getByRole('button', { name: 'send comment' });
  await userEvent.type(comment, 'my first comment');
  await userEvent.click(submitComment);
  expect(comment).toHaveValue('');
});
