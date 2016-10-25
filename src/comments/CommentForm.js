import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from './../widgets/Icon';
import * as commentActions from './commentsActions';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';

import './CommentForm.scss';

@connect(
  state => ({
    sidebarIsVisible: state.app.sidebarIsVisible,
    comments: state.comments,
    posts: state.posts,
  }),
  (dispatch) => bindActionCreators({
    sendComment: commentActions.sendComment,
    updateCommentingDraft: commentActions.updateCommentingDraft,
    closeCommentingDraft: commentActions.closeCommentingDraft,
  }, dispatch)
)
export default class CommentForm extends Component {
  constructor(props) {
    super(props);
  }

  updateDraft() {
    this.props.updateCommentingDraft({
      id: this.props.comments.currentDraftId,
      body: this._input.value,
    });
  }

  handleKey(e) {
    if (keycode(e) === 'enter' && !e.shiftKey) {
      this.updateDraft();
      this.props.sendComment();
    }
  }

  componentWillUpdate(nextProps) {
    const { comments } = this.props;
    if(nextProps.comments.currentDraftId !== comments.currentDraftId) {
      this.updateDraft();
      this._input.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const { comments } = this.props;
    const draftValue = comments.currentDraftId
      ? comments.commentingDraft[comments.currentDraftId].body
      : '';

    if (prevProps.comments.currentDraftId !== comments.currentDraftId) {
      // not using react value (controlled component) for performance reasons
      this._input.value = draftValue;
    }
  }

  render() {
    const { comments, sidebarIsVisible, closeCommentingDraft, posts } = this.props;

    let commentsClass = 'CommentForm';
    if (!comments.isCommenting) {
      commentsClass += ' disappear';
    }
    if (sidebarIsVisible) {
      commentsClass += ' withSidebar';
    }

    let parentTitle = '';
    if (comments.currentDraftId) {
      parentTitle = posts[comments.currentDraftId] ? posts[comments.currentDraftId].title : '';
    }


    return (
      <div className={commentsClass}>
        <div className="container">
          { comments.currentDraftId &&
            <div className="mvm"><i className="icon icon-sm material-icons">reply</i> Reply to <b>{ parentTitle }</b></div>
          }
          <Textarea
            rows={1}
            ref={(c) => { this._input = c; }}
            className={'CommentForm__input'}
            onKeyDown={(e) => this.handleKey(e)}
            placeholder={'Write a comment...'}
            autoFocus
          />
          <a className="CommentForm__close" onClick={() => closeCommentingDraft()}>
            <Icon name="clear" />
          </a>
        </div>
      </div>
    );
  }
}