

const launchpad = {

}

const fairlaunch = {
  token: {
    name: "name",
    symbol: 'na',
    totalSupply: '10000',
    decimal: '18'
  },

  currency: 'zeroAddress',
  fee: '5%',

  listingOption: {

    auto: {
      totalSellingAmount: 100,
      whitelist: true,
      softCap: 30,
      isMaxContribution: {
        true: {
          MaxContribution: 100,
        },
        false: null
      },
      router: "address",
      liquidityPercentage: "50%",
      buyback: {
        true: {
          buyBackPercentage: '20%'
        },
        false: null
      },

      startTime: 'startTime',
      endTime: "endTime",

      liquidityLockup: "20min"
    },

    manual: {
      totalSellingAmount: 100,
      whitelist: true,
      softCap: 30,
      isMaxContribution: {
        true: {
          MaxContribution: 100,
        },
        false: null
      },
      startTime: 'startTime',
      endTime: "endTime",
      social: {
        logoUrl: undefined,
        websiteUrl: undefined,
        facebookUrl: undefined,
        instagram: undefined,
        twitterUrl: undefined,
        githubUrl: undefined,
        telegramUrl: undefined,
        redditUrl: undefined,
        youtubeUrl: undefined,
        description: undefined,
      }
    },

  },

  affiliate: "5%"
}