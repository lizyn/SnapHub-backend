/**
 * @jest-environment jsdom
 */
import { React } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';

import Feed from './Feed';
import axios from '../api/axios';

test('Feed component matches snapshot', () => {
  const component = renderer.create(
    <Feed
      author=""
      img=""
      avatar=""
      likes={0}
      commentIds={[]}
      title=""
      postId={0}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Like btn respond/changes when a post is liked', async () => {
  render(
    <Feed
      author="theUser"
      img=""
      avatar=""
      likes={5}
      commentIds={[]}
      title="smile"
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
    <Feed
      author="theUser"
      img=""
      avatar=""
      likes={5}
      commentIds={[]}
      title="smile"
      postId={0}
    />
  );
  const comment = screen.getByRole('textbox');
  await userEvent.type(comment, 'I like your post');
  expect(comment).toHaveValue('I like your post');
});

// test('click menu button will show edit and delete options', () => {
//   render(
//     <Feed
//       author=""
//       img=""
//       avatar=""
//       likes={0}
//       commentIds={[]}
//       title=""
//       postId={0}
//     />
//   );
//   const likeBtn = screen.getByRole('button', { name: 'Like' });
//   expect(likeBtn).toBeInTheDocument();
//   const commentBtn = screen.getByRole('button', { name: 'Comment' });
//   expect(commentBtn).toBeInTheDocument();
// });
