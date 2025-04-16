import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ResetPasswordForm = ({ onBack }) => {
  const [serverMsg, setServerMsg] = useState('');

  return (
    <div className="card shadow p-4">
      <h4 className="text-center mb-3">Reset Password</h4>

      {serverMsg && <div className="alert alert-info">{serverMsg}</div>}

      <Formik
        initialValues={{ email: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', values);
            setServerMsg(res.data.msg || 'Reset link sent to email');
          } catch (err) {
            setServerMsg(err.response?.data?.msg || 'Error occurred');
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label>Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Send Reset Link'}
            </button>

            <button type="button" className="btn btn-link w-100 mt-2" onClick={onBack}>
              ← Back to Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
