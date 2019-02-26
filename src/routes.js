export default {
  addUser: '/users/add',
  editUser: '/users/:id/edit',
  fastAccessAddWorkLog: '/fast-access/:apiToken/work-logs/add',
  forgotPassword: '/forgot-password',
  index: '/',
  login: '/login',
  newPassword: '/new-password/:resetPasswordToken',
  profile: '/users/profile',
  recentSpecialApprovalList: '/recent-special-approvals',
  settings: '/settings',
  specialApprovalList: '/special-approvals',
  supervisedUserList: '/supervised-users',
  supervisedUserWorkLog: '/supervised-users/:id/work-log',
  supervisedUserWorkLogWithDate: '/supervised-users/:id/work-log/:year/:month',
  userList: '/users',
};
