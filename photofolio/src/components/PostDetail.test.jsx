/**
 * @jest-environment jsdom
 */
import { React } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';

import PostDetail from './PostDetail';

test('PostDetail component matches snapshot', () => {
  const component = renderer.create(<PostDetail />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

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
      handlePostChange={() => {}}
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
      handlePostChange={() => {}}
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
      handlePostChange={() => {}}
    />
  );
  const comment = screen.getByRole('textbox');
  const submitComment = screen.getByRole('button', { name: 'send comment' });
  await userEvent.type(comment, 'my first comment');
  await userEvent.click(submitComment);
  expect(comment).toHaveValue('');
});
