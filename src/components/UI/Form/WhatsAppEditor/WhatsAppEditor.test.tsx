import { render, fireEvent } from '@testing-library/react';
import { ContentState, EditorState } from 'draft-js';
import { vi } from 'vitest';

import WhatsAppEditor from './WhatsAppEditor';

const mockHandleKeyCommand = vi.fn();

vi.mock('draft-js', () => {
  const moduleMock = vi.requireActual('draft-js');
  return {
    ...moduleMock,
    Editor: (...props: any) => {
      return (
        <input
          data-testid="editor"
          onClick={() => {
            props[0].handleKeyCommand('underline');
            mockHandleKeyCommand();
          }}
          onChange={(event) => props[0].onChange(event)}
        ></input>
      );
    },
  };
});

vi.mock('react-resize-detector', () => (...props: any) => {
  const { onResize, children } = props[0];
  return (
    <div>
      <div data-testid="resizer" onClick={() => onResize('30', '40')}>
        {children}
      </div>
    </div>
  );
});

describe('<WhatsAppEditor/>', () => {
  const handleHeightChange = vi.fn();
  const sendMessage = vi.fn();
  const setEditorState = vi.fn();

  const defaultProps = (editorState: any) => {
    return {
      handleHeightChange: handleHeightChange,
      sendMessage: sendMessage,
      editorState: editorState,
      setEditorState: setEditorState,
    };
  };

  const editorContent = EditorState.createWithContent(ContentState.createFromText('Hello'));

  test('it should have editor and emoji components', () => {
    const { container, getByTestId } = render(<WhatsAppEditor {...defaultProps(editorContent)} />);
    expect(container.querySelector('.Editor')).toBeInTheDocument();
    expect(getByTestId('emoji-picker')).toBeInTheDocument();
  });

  test('input change should trigger callBacks', () => {
    const { getByTestId } = render(<WhatsAppEditor {...defaultProps(editorContent)} />);
    fireEvent.change(getByTestId('editor'), {
      target: { value: 10 },
    });
    expect(setEditorState).toHaveBeenCalled();
  });

  test('handleKeyCommand should work with new commands', () => {
    const { getByTestId } = render(<WhatsAppEditor {...defaultProps(editorContent)} />);
    fireEvent.click(getByTestId('editor'));

    expect(mockHandleKeyCommand).toHaveBeenCalled();
  });

  test('testing change size callback', () => {
    const { getByTestId } = render(<WhatsAppEditor {...defaultProps(editorContent)} />);
    fireEvent.click(getByTestId('resizer'));
    expect(handleHeightChange).toHaveBeenCalled();
  });

  // since we are mocking emoji mart picker we need to implement the following functionalities

  // test('input an emoji in chat', () => {
  //   const { container, getByTestId } = render(
  //     <WhatsAppEditor
  //       {...defaultProps(
  //         EditorState.createWithContent(
  //           ContentState.createFromText('*this is bold* _this is italic_')
  //         )
  //       )}
  //     />
  //   );
  //   fireEvent.click(getByTestId('emoji-picker'));
  //   fireEvent.click(container.querySelector('.emoji-mart-emoji') as Element);
  //   expect(setEditorState).toBeCalled();
  // });
});
