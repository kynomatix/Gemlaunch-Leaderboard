import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import { isValidUrl } from '@/utils/isValidUrl';
import * as yup from 'yup';

export const Labels = {
    tokenAddress: 'Token Address',
    airdropName: 'Airdrop Name',
    logoUrl: 'Logo Url',
    websiteUrl: 'Website Url',
    facebookUrl: 'Facebook Url',
    twitterUrl: 'Twitter Url',
    githubUrl: 'Github Url',
    telegramUrl: 'Telegram Url',
    redditUrl: 'Reddit Url',
    youtubeUrl: 'Youtube Url',
    description: 'description',
};

export const STEP_ONE = yup.object().shape({
    tokenAddress: yup
        .string()
        .required()
        .label(Labels.tokenAddress)
        .test(
            'is-address',
            (x) => `${x.label} is not in valid format`,
            (v) => {
                if (v.trim() !== '') {
                    return isValidAddress(v.toLowerCase());
                }
                return true;
            },
        )
        .test(
            'is-token',
            (x) => `${x.label} is not a valid token`,
            (v) => {
                if (v.trim() !== '') {
                    return isValidToken(v);
                }
                return true;
            },
        ),
});

export const STEP_TWO = yup.object().shape({
    airdropName: yup
        .string()
        .required()
        .label(Labels.airdropName)
        .test('notEmpty', '${path} cannot be empty', (v) => {
            return v.trim() !== '';
        }),
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

export const EDIT_AIRDROP_VALIDATION = yup.object().shape({
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
