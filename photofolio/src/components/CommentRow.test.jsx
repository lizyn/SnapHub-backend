/**
 * @jest-environment jsdom
 */
import { React } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import CommentRow from './CommentRow';

test('Comment row matches snapshot', () => {
  const component = renderer.create(
    <CommentRow
      userId={0}
      commentText=""
      commentId={0}
      commentDel={() => {}}
      commentEd={() => {}}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('click menu button will show edit and delete options', async () => {
  render(
    <CommentRow
      userId={0}
      commentText=""
      commentId={0}
      commentDel={() => {}}
      commentEd={() => {}}
    />
  );
  const editMenu = screen.getByRole('button');
  await userEvent.click(editMenu);
  const editOption = screen.getByRole('menuitem', { name: 'Edit' });
  expect(editOption).toBeInTheDocument();
  const delOption = screen.getByRole('menuitem', { name: 'Delete' });
  expect(delOption).toBeInTheDocument();
});

test('Clicking save when editing will quit editing mode', async () => {
  render(
    <CommentRow
      userId={0}
      commentText=""
      commentId={0}
      commentDel={() => {}}
      commentEd={() => {}}
    />
  );
  const editMenu = screen.getByRole('button');
  await userEvent.click(editMenu);
  const editOption = screen.getByRole('menuitem', { name: 'Edit' });
  await userEvent.click(editOption);
  const saveBtn = screen.getByRole('button', { name: 'Save' });
  expect(saveBtn).toBeVisible();
});

test('Clicking delete will close menu', async () => {
  render(
    <CommentRow
      userId={0}
      commentText=""
      commentId={0}
      commentDel={() => {}}
      commentEd={() => {}}
    />
  );
  const editMenu = screen.getByRole('button');
  await userEvent.click(editMenu);
  const delOption = screen.getByRole('menuitem', { name: 'Delete' });
  await userEvent.click(delOption);
  expect(delOption).not.toBeVisible();
});
