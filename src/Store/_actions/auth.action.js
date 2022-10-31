import authActionType from "Store/_types/auth.type";
import { loginUser, registerUser } from "Services/auth.crud";

//Register
const requestRegister = () => ({ type: authActionType.REGISTER_REQUEST });
const successRegister = data => ({
  type: authActionType.REGISTER_SUCCESS,
  payload: data,
});
const failureRegister = error => ({
  type: authActionType.REGISTER_FAILURE,
  payload: error,
});

export const register = user => async dispatch => {
  dispatch(requestRegister());
  await registerUser(user)
    .then(data => {
      dispatch(successRegister(data));
    })
    .catch(err => {
      const error = err.response && (err.response || err.message);
      dispatch(failureRegister(error));
      throw error;
    });
};

//Login
const requestLogin = () => ({ type: authActionType.LOGIN_REQUEST });
const successLogin = auth => ({
  type: authActionType.LOGIN_SUCCESS,
  payload: auth,
});
const failureLogin = error => ({
  type: authActionType.LOGIN_FAILURE,
  payload: error,
});

export const login = data => async dispatch => {
  dispatch(requestLogin());
  // dispatch(
  //   successLogin({
  //     token:
  //       "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWEyMzJmZTUxMjQ1MmRjNDUzYWE2YjNhYjQwNzBlYWY0YjcwNmI1ZDA1MGEyNDdhMGQxNTVhNDdmMmEzNDY0MjRkMjgwNmE3M2ExZjI2ODIiLCJpYXQiOjE2MzUwODkxNTIuMzcxNTU0LCJuYmYiOjE2MzUwODkxNTIuMzcxNTU2LCJleHAiOjE2NjY2MjUxNTIuMzY3MTI0LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.KU-3pGk1xhUu7k5jymqWHpcaesmGTb8KwjxsPGWnimkkloKK4gvfRU6dMiUgsll9YHgiZxj_OyIQAIvmMMP-v2ZmjNKqn_z8I9AISINoHaTwxwXIo5N6o6JSO1aWqIXCdWgClPyxUYImR5o-3zR6KfXUCCXSOYiQbCs2JI6zz4SVoW6O2DDacnXhc9mmA9Jd3OOw5tH0Ni8iwNjRXP1C9cXQc2IjU65kzpal9zMl1sWw-qtq-9Xy3KJCwQPadhnpADVb_wU5Tj238RHIu99yHAbGZdOncoRMGbD210y_uEclNQbXtjpzfKg-gdkpFAwjtVB9Bhk9uQC_R20Vge2UGPEc3m27XziRWagbnynpBfY7xudEfxJ6UEM4tE0RZdDJqhXYG-jb4Df647LY_eBoW7HBfgWON3fQ-ik8sq8jzUdEuatOVHQ99U0vRCmVPu2Q8S217PwXBBs76SeODJpCtq3mgePi7aDz2u2nWFMpRdHdfggGi0WlDFKn9vYw4z1Y70vvHRoDBRlcmZx-pfrzT35Wrw8VnJVFPtrOYQaDf8XwDWSf3ZelF4GU2AIzGlYqeBwHS7CYHL0P0-Hpn60YGiErlLEml0gpCZRTrUNRtCqtsp1QcBSXjjudSoYfMESy4ID4_lsyHzRqc4HnCzUfJ2ft02cD6ZzSGQWD3uZH3fQ",
  //     user: {
  //       id: 2,
  //       last_name: "Admin",
  //       first_name: "Admin",
  //       middle_name: null,
  //       email: "cashier@mail.com",
  //       second_line_of_address: null,
  //       first_line_of_address: null,
  //       phone_number: null,
  //       post_code: null,
  //       country: null,
  //       city: null,
  //       image: null,
  //       type: "admin",
  //       email_verified_at: null,
  //       created_at: "2021-09-22T09:52:07.000000Z",
  //       updated_at: "2021-09-22T09:52:07.000000Z",
  //     },
  //   }),
  // );
  await loginUser(data)
    .then(res => {
      dispatch(successLogin(res));
    })
    .catch(err => {
      const error = err.response && (err.response || err.message);
      dispatch(failureLogin());
      throw error;
    });
};

//Logout
const successLogOut = () => ({ type: authActionType.LOGOUT_SUCCESS });

export const logout = () => dispatch => {
  dispatch(successLogOut());
};
