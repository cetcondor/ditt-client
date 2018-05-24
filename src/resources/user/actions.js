import { RSAA } from 'redux-api-middleware';
import { API_URL } from '../../../config/envspecific';
import * as types from './actionTypes';

export const addUser = data => dispatch => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      email: data.email,
      firstName: data.firstName,
      isActive: data.isActive,
      lastName: data.lastName,
      plainPassword: data.plainPassword,
      supervisor: data.supervisor ? `/users/${data.supervisor}` : null,
    }),
    endpoint: `${API_URL}/users`,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    types: [
      types.ADD_USER_REQUEST,
      types.ADD_USER_SUCCESS,
      types.ADD_USER_FAILURE,
    ],
  },
});

export const deleteUser = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}`,
    method: 'DELETE',
    types: [
      types.DELETE_USER_REQUEST,
      {
        meta: { id },
        type: types.DELETE_USER_SUCCESS,
      },
      types.DELETE_USER_FAILURE,
    ],
  },
});

export const editUser = data => dispatch => dispatch({
  [RSAA]: {
    body: JSON.stringify({
      email: data.email,
      firstName: data.firstName,
      isActive: data.isActive,
      lastName: data.lastName,
      plainPassword: data.plainPassword ? data.plainPassword : null,
      supervisor: data.supervisor ? `/users/${data.supervisor}` : null,
    }),
    endpoint: `${API_URL}/users/${data.id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    types: [
      types.EDIT_USER_REQUEST,
      {
        meta: { id: data.id },
        type: types.EDIT_USER_SUCCESS,
      },
      types.EDIT_USER_FAILURE,
    ],
  },
});

export const fetchUser = id => dispatch => dispatch({
  [RSAA]: {
    endpoint: `${API_URL}/users/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_USER_REQUEST,
      types.FETCH_USER_SUCCESS,
      types.FETCH_USER_FAILURE,
    ],
  },
});

export const fetchUserList = options => dispatch => dispatch({
  [RSAA]: {
    endpoint: (options && options.order)
      ? `${API_URL}/users?order[${options.order.column}]=${options.order.direction}`
      : `${API_URL}/users`,
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
    types: [
      types.FETCH_USER_LIST_REQUEST,
      types.FETCH_USER_LIST_SUCCESS,
      types.FETCH_USER_LIST_FAILURE,
    ],
  },
});
