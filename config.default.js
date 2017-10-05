'use strict';

var mongo;

// Accesing Bluemix variable to get MongoDB info
if (process.env.VCAP_SERVICES) {
  var dbLabel = 'mongodb-2.4';
  var env = JSON.parse(process.env.VCAP_SERVICES);
  if (env[dbLabel]) {
    mongo = env[dbLabel][0].credentials;
  }
} else {
  mongo = {
    // setting the connection string will only give access to that database
    // to see more databases you need to set mongodb.admin to true or add databases to the mongodb.auth list
    connectionString: process.env.ME_CONFIG_MONGODB_SERVER ? '' : process.env.ME_CONFIG_MONGODB_URL,
  };
}

var meConfigMongodbServer = process.env.ME_CONFIG_MONGODB_SERVER ? process.env.ME_CONFIG_MONGODB_SERVER.split(',') : false;



console.log('process.env.VCAP_SERVICES: ' + process.env.VCAP_SERVICES);
console.log('process.env.ME_CONFIG_MONGODB_SERVER : ' + process.env.ME_CONFIG_MONGODB_SERVER) ;
console.log('process.env.ME_CONFIG_MONGODB_URL: ' + process.env.ME_CONFIG_MONGODB_URL);
console.log('process.env.ME_CONFIG_MONGODB_SERVER : ' + process.env.ME_CONFIG_MONGODB_SERVER);
console.log('process.env.ME_CONFIG_MONGODB_SERVER: ' + process.env.ME_CONFIG_MONGODB_SERVER);
console.log('database: process.env.ME_CONFIG_MONGODB_AUTH_DATABASE ' +process.env.ME_CONFIG_MONGODB_AUTH_DATABASE);
console.log('process.env.ME_CONFIG_MONGODB_ADMINUSERNAMEE ' + process.env.ME_CONFIG_MONGODB_ADMINUSERNAME);

var conn = {};

conn.host   = process.env.MYMONGO_SERVICE_HOST    || 'localhost';
conn.dbport       = process.env.MYMONGO_SERVICE_PORT    || 27017;
conn.database   = process.env.MONGODB_DATABASE        || 'dbmqtt';
conn.collection = process.env.MONGODB_COLLECTION      || 'message';
conn.username = process.env.MONGODB_USER;
conn.useradmin = 'admin';
conn.password = process.env.MONGODB_PASSWORD;
conn.admin = true;
conn.url = 'mongodb:/' + '/' + conn.useradmin + ':' + conn.password + '@' + conn.host + ':' + conn.dbport + '/' + conn.db;
console.log('Database connection: ' + conn.url);
//conn.url = 'mongodb:/' + '/' + conn.host + ':' + conn.dbport + '/' + conn.db;


module.exports = {
  mongodb: {
    // if a connection string options such as server/port/etc are ignored
   // connectionString: conn.url || '',

    //server: mongodb hostname or IP address
    //for replica set, use array of string instead
    server: conn.host,//(meConfigMongodbServer.length > 1 ? meConfigMongodbServer : meConfigMongodbServer[0]) || mongo.host,
    port:   conn.port,//process.env.ME_CONFIG_MONGODB_PORT || mongo.port,

    //ssl: connect to the server using secure SSL
    ssl: '',

    //sslValidate: validate mongod server certificate against CA
    sslValidate: false,

    //sslCA: array of valid CA certificates
    sslCA:  [],

    //autoReconnect: automatically reconnect if connection is lost
    autoReconnect: true,

    //poolSize: size of connection pool (number of connections to use)
    poolSize: 4,

    //set admin to true if you want to turn on admin features
    //if admin is true, the auth list below will be ignored
    //if admin is true, you will need to enter an admin username/password below (if it is needed)
    //admin: process.env.ME_CONFIG_MONGODB_ENABLE_ADMIN ? process.env.ME_CONFIG_MONGODB_ENABLE_ADMIN.toLowerCase() === 'true' : false,

    admin: true,
    // >>>>  If you are using regular accounts, fill out auth details in the section below
    // >>>>  If you have admin auth, leave this section empty and skip to the next section
    auth: [
      /*
       * Add the name, username, and password of the databases you want to connect to
       * Add as many databases as you want!
       */
//      {
//       database: process.env.ME_CONFIG_MONGODB_AUTH_DATABASE || conn.database,
//        username: process.env.ME_CONFIG_MONGODB_AUTH_USERNAME || conn.username,
//        password: process.env.ME_CONFIG_MONGODB_AUTH_PASSWORD || conn.password,
//      },
    ],

    //  >>>>  If you are using an admin mongodb account, or no admin account exists, fill out section below
    //  >>>>  Using an admin account allows you to view and edit all databases, and view stats

    //leave username and password empty if no admin account exists
    adminUsername: conn.useradmin,//process.env.ME_CONFIG_MONGODB_ADMINUSERNAME || '',
    adminPassword: conn.password,//process.env.ME_CONFIG_MONGODB_ADMINPASSWORD || '',

    //whitelist: hide all databases except the ones in this list  (empty list for no whitelist)
    whitelist: [],

    //blacklist: hide databases listed in the blacklist (empty list for no blacklist)
    blacklist: [],
  },

  site: {
    // baseUrl: the URL that mongo express will be located at - Remember to add the forward slash at the start and end!
    baseUrl: process.env.ME_CONFIG_SITE_BASEURL || '/',
    cookieKeyName: 'mongo-express',
    cookieSecret:     process.env.ME_CONFIG_SITE_COOKIESECRET   || 'cookiesecret',
    host:             process.env.VCAP_APP_HOST                 || 'localhost',
    port:             process.env.VCAP_APP_PORT                 || 8081,
    requestSizeLimit: process.env.ME_CONFIG_REQUEST_SIZE        || '50mb',
    sessionSecret:    process.env.ME_CONFIG_SITE_SESSIONSECRET  || 'sessionsecret',
    sslCert:          process.env.ME_CONFIG_SITE_SSL_CRT_PATH   || '',
    sslEnabled:       process.env.ME_CONFIG_SITE_SSL_ENABLED    || false,
    sslKey:           process.env.ME_CONFIG_SITE_SSL_KEY_PATH   || '',
  },

  //set useBasicAuth to true if you want to authenticate mongo-express loggins
  //if admin is false, the basicAuthInfo list below will be ignored
  //this will be true unless ME_CONFIG_BASICAUTH_USERNAME is set and is the empty string
  useBasicAuth: false,

  basicAuth: {
    username: process.env.ME_CONFIG_BASICAUTH_USERNAME || '',
    password: process.env.ME_CONFIG_BASICAUTH_PASSWORD || '',
  },

  options: {
    // Display startup text on console
    console: true,

    //documentsPerPage: how many documents you want to see at once in collection view
    documentsPerPage: 10,

    //editorTheme: Name of the theme you want to use for displaying documents
    //See http://codemirror.net/demo/theme.html for all examples
    editorTheme: process.env.ME_CONFIG_OPTIONS_EDITORTHEME || 'rubyblue',

    // Maximum size of a single property & single row
    // Reduces the risk of sending a huge amount of data when viewing collections
    maxPropSize: (100 * 1000),  // default 100KB
    maxRowSize: (1000 * 1000),  // default 1MB

    //The options below aren't being used yet

    //cmdType: the type of command line you want mongo express to run
    //values: eval, subprocess
    //  eval - uses db.eval. commands block, so only use this if you have to
    //  subprocess - spawns a mongo command line as a subprocess and pipes output to mongo express
    cmdType: 'eval',

    //subprocessTimeout: number of seconds of non-interaction before a subprocess is shut down
    subprocessTimeout: 300,

    //readOnly: if readOnly is true, components of writing are not visible.
    readOnly: false,

    //collapsibleJSON: if set to true, jsons will be displayed collapsible
    collapsibleJSON: true,

    //collapsibleJSONDefaultUnfold: if collapsibleJSON is set to `true`, this defines default level
    //  to which JSONs are displayed unfolded; use number or "all" to unfold all levels
    collapsibleJSONDefaultUnfold: 1,

    //gridFSEnabled: if gridFSEnabled is set to 'true', you will be able to manage uploaded files ( ak. grids, gridFS )
    gridFSEnabled: process.env.ME_CONFIG_SITE_GRIDFS_ENABLED || false,

    // logger: this object will be used to initialize router logger (morgan)
    logger: {},
  },

  // Specify the default keyname that should be picked from a document to display in collections list.
  // Keynames can be specified for every database and collection.
  // If no keyname is specified, it defaults to '_id', which is a mandatory field.
  // For Example :
  // defaultKeyNames{
  //   "world_db":{  //Database Name
  //     "continent":"cont_name", // collection:field
  //     "country":"country_name",
  //     "city":"name"
  //   }
  // }
  defaultKeyNames: {

  },
};
