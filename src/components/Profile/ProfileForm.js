import classes from './ProfileForm.module.css';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const authToken = useSelector((state) => state.auth.token);
  const history = useHistory();

  const formValidation = Yup.object().shape({
    newPassword: Yup.string()
    .min(8, 'At least 8 characters')
  })

  const submitHandler = async (values, setSubmitting, resetForm) => {
    try {
      await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDXr0-DCQ8hUW6bsSpFmjNHHNokGFOQIBY'
      , { 
        idToken: authToken,
        password: values.newPassword,
        returnSecureToken: false
      });

      setSubmitting(false);
      resetForm();
      history.replace('/');
    } catch (error) {
      let errorMessage = 'Authentication failed!';

      if(error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        errorMessage = error.response.data.error.message;
      }

      alert(errorMessage);

      setSubmitting(false);
      resetForm();
      throw new Error(errorMessage);
    }

  }

  return (
    <Formik
    initialValues={{ newPassword: '' }}
    validationSchema={formValidation}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      submitHandler(values, setSubmitting, resetForm);
    }}
    >{({ isSubmitting, errors}) => (
      <Form className={classes.form}>
        <div className={classes.control}>
          <label htmlFor='new-password'>New Password</label>
          <Field type='password' id='new-password' name="newPassword" />
          {errors.newPassword ? (<p className="error">{errors.newPassword}</p>) : null}
        </div>
        <div className={classes.action}>
          {!isSubmitting && <button type="submit">Change Password</button>}
          {isSubmitting && <p>Sending request...</p>}
        </div>
      </Form>
      )}
    </Formik>
  );
}

export default ProfileForm;
