require('dotenv').config();
const admin = require('firebase-admin');

const express = require('express');
const {createEventAdapter} = require('@slack/events-api');
const {createMessageAdapter} = require('@slack/interactive-messages');

const slackInstallHandler = require('./httpHandlers/install');
const slackOauthRedirection = require('./httpHandlers/oauthRedirection');
const appHome = require('./appHome');
const messageEventHandler = require('./messageEventHandler');

admin.initializeApp({
  credential: admin.credential.cert({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_PROJECT_ID,
  }),
});

let db = admin.firestore();

const slackClientId = process.env.SLACK_CLIENT_ID;
const slackClientSecret = process.env.SLACK_CLIENT_SECRET;
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackInteractions = createMessageAdapter(slackSigningSecret);

const app = express();

app.use('/slack/events', slackEvents.requestListener());
app.use('/slack/actions', slackInteractions.requestListener());
app.get('/slack/install', slackInstallHandler(slackClientId));
app.get(
  '/slack/oauth_redirect',
  slackOauthRedirection(slackClientId, slackClientSecret, db),
);

appHome.registerEvents(slackEvents, slackBotToken);
appHome.registerInteractions(db, slackInteractions, slackBotToken);


slackEvents.on('message', messageEventHandler(db));

app.listen(process.env.PORT || 3000, () => console.log(`Server started`));
