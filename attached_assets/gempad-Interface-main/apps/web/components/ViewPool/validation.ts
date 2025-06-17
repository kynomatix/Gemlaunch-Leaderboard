import { isValidAddress } from '@/utils/format';
import { isValidUrl } from '@/utils/isValidUrl';
import * as yup from 'yup';
import { Labels } from './constant';

export const affiliationModalValidation = yup.object().shape({
    affiliation: yup
        .string()
        .label('affiliation')
        .required('percentage is a required field')
        .test(
            'isGreater',
            'New Reward Percent must be greater than old reward percent',
            function (value) {
                const { oldPercentage } = this.options.context; // Access oldPercentage from the parent object
                return value > oldPercentage;
            },
        )
        .max(5, 'percentage must be less than or equal to 5'),
});

export const EDIT_PRESALE_VALIDATION = yup.object().shape({
    logoUrl: yup
        .string()
        .required()
        .label(Labels.logoUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    websiteUrl: yup
        .string()
        .required()
        .label(Labels.websiteUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    facebookUrl: yup
        .string()
        .label(Labels.facebookUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    twitterUrl: yup
        .string()
        .label(Labels.twitterUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    githubUrl: yup
        .string()
        .label(Labels.githubUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    telegramUrl: yup
        .string()
        .label(Labels.telegramUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    redditUrl: yup
        .string()
        .label(Labels.redditUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    youtubeUrl: yup
        .string()
        .label(Labels.youtubeUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    description: yup.string(),
});
