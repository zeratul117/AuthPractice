import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth-slice';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const formSquema = Yup.object().shape({
    email: Yup.string()
    .email('Email Invalid')
    .required('Required'),
    
    password: Yup.string()
    .min(8, 'The minimum is 8 characters')
    .required('Required')
  })

  const submitHandler = async (values, resetForm, setIsSubmitting) => {

    let url = '';
    if(isLogin) {
      url="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDXr0-DCQ8hUW6bsSpFmjNHHNokGFOQIBY";
    } else {
      url="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDXr0-DCQ8hUW6bsSpFmjNHHNokGFOQIBY";
    }

    try {
      const response = await axios.post(url
      , { 
        email: values.email,
        password: values.password,
        returnSecureToken: true
      });

      const expirationTime = new Date(new Date().getTime() + (+response.data.expiresIn * 1000));

      dispatch(authActions.login({token: response.data.idToken, expirationTime: expirationTime.toString()}))

      setIsSubmitting(false);
      resetForm();

      history.replace('/');

    } catch (error) {
      let errorMessage = 'Authentication failed!';
      if(error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        errorMessage = error.response.data.error.message;
      }

      alert(errorMessage);

      setIsSubmitting(false);
      resetForm();
      throw new Error(errorMessage);
    }
  }
  

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <Formik 
      initialValues={{ email: '', password: '' }}
      validationSchema={formSquema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        submitHandler(values, resetForm, setSubmitting);
      }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
          <div className={classes.control}>
            <label htmlFor='email'>Your Email</label>
            <Field type='email' name="email" id='email' required />
            {touched.email && errors.email ? (
             <div className="error">{errors.email}</div>
           ) : null}
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>Your Password</label>
            <Field type='password' name="password" id='password' required />
            {touched.password && errors.password ? (
             <div className="error">{errors.password}</div>
           ) : null}
          </div>
          <div className={classes.actions}>
            {!isSubmitting && <button type='submit'>{isLogin ? 'Login' : 'Create Account'}</button>}
            {isSubmitting && <p>Sending request...</p>}
            <button
              type='button'
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>
          </div>
        </Form>
        )}
      </Formik>
    </section>
  );
};

export default AuthForm;
