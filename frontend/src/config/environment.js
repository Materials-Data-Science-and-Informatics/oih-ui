const configurations =
    { defaults: require('./defaults')
    };

const config = configurations.defaults || {};

config.default.dataServiceUrl = process.env.REACT_APP_DATA_SERVICE_URL || 'https://api.oih.staging.derilinx.com';
config.default.environment = process.env.REACT_APP_DATA_SERVICE_URL == 'PRODUCTION' ? 'production' : 'development';

export const { appTitle,
               appShortTitle,
               appDescription,
               dataServiceUrl,
               mapboxAccessToken,
               basemapStyleLink,
               environment,
             } = config.default;
