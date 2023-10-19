import Immutable from 'immutable';

export default Immutable.fromJS({
  addUser: {
    data: null,
    isPosting: false,
    isPostingFailure: false,
  },
  archiveUser: {
    isPosting: false,
    isPostingFailure: false,
  },
  deleteUser: {
    isPosting: false,
    isPostingFailure: false,
  },
  editUser: {
    data: null,
    isPosting: false,
    isPostingFailure: false,
  },
  supervisedUserList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
  unarchiveUser: {
    isPosting: false,
    isPostingFailure: false,
  },
  user: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  userList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
  userListPartial: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
});
