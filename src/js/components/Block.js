import React, { useCallback, useState, useRef, useEffect } from "react";
import { findDOMNode } from "react-dom";
import Codemirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/markdown/markdown";
import {
  updateBlock,
  deleteBlock,
  moveBlockUp,
  moveBlockDown,
  editBlock,
} from "../actions";

const useScrollIntoView = (elementToScroll) => {
  useEffect(() => {
    if (elementToScroll) {
      elementToScroll.focus();
      const domNode = findDOMNode(elementToScroll);
      if (domNode.scrollIntoViewIfNeeded) {
        findDOMNode(elementToScroll).scrollIntoViewIfNeeded(false);
      }
    }
  });
};

export default (props) => {
  const [text, setText] = useState("");
  const editarea = useRef(null);

  useScrollIntoView(editarea);

  const enterEdit = useCallback(
    (e) => {
      if (props.editable) {
        e.stopPropagation();
        const { dispatch, block } = this.props;

        SetText(block.get("content"));
      }
      dispatch(editBlock(block.get("id")));
    },
    [props.editable, props.block, setText]
  );

  const textChanged = useCallback(
    (text) => {
      setText(text);
    },
    [setText]
  );

  const deleteBlock = useCallback(() => {
    props.dispatch(deleteBlock(props.block.get("id")));
  }, [props.block]);

  const moveBlockUp = useCallback(() => {
    props.dispatch(moveBlockUp(props.block.get("id")));
  }, [props.block]);

  const moveBlockDown = useCallback(() => {
    props.dispatch(moveBlockDown(props.block.get("id")));
  }, [props.block]);

  const getButtons = useCallback(() => {
    if (!props.editable) {
      return null;
    }
    const buttons = [];

    if (!props.isLast) {
      buttons.push(
        <i
          className="fa fa-arrow-circle-o-down"
          key="down"
          onClick={this.moveBlockDown}
          title="Move block down"
        ></i>
      );
    }

    if (!props.isFirst) {
      buttons.push(
        <i
          className="fa fa-arrow-circle-o-up"
          key="up"
          onClick={this.moveBlockUp}
          title="Move block up"
        ></i>
      );
    }

    buttons.push(
      <i
        className="fa fa-times-circle-o"
        key="delete"
        onClick={this.deleteBlock}
        title="Remove block"
      ></i>
    );

    return buttons;
  }, [props.editable, props.isFirst, props.isLast]);

  useEffect(() => {
    if (
      !props.editing //&&
      //props.block.get("content") === newProps.block.get("content")
    ) {
      props.dispatch(updateBlock(props.block.get("id"), this.state.text));
    }
  }, [props.editing, props.block]);

  const { block, editable, editing } = props;

  if (!(editable && editing)) {
    return renderViewerMode();
  }

  const isCodeBlock = block.get("type") === "code";
  const options = {
    mode: isCodeBlock ? "javascript" : "markdown",
    theme: "base16-tomorrow-light",
    lineNumbers: true,
    indentUnit: 4,
    extraKeys: {
      Tab: (cm) => {
        const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      },
    },
  };

  return (
    <div
      className="edit-box"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Codemirror
        value={text}
        options={options}
        onChange={textChanged}
        ref={editarea}
      />
    </div>
  );
};
