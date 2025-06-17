import * as yup from 'yup';

export const newsLetterValidation = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required(),
});
