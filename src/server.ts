import { BunqKey, BunqApi, BunqApiConfig, BunqApiSetup, BunqConnection, BunqServerConnection, SessionCreator } from 'bunq-api/dist/index';
const write = require('fs-writefile-promise');
const client = require('scp2');
const restify = require('restify');
const moment = require('moment');

const config:BunqApiConfig = new BunqApiConfig();
const secretConfig:BunqApiConfig=new BunqApiConfig(config.json.secretsFile);
const privateKeyPem:string=BunqApiConfig.read(config.json.privateKeyFile);
const key : BunqKey = new BunqKey(privateKeyPem);
const installationTokenConfig = BunqApiConfig.readJson(config.json.installationTokenFile);
const installationToken:string=installationTokenConfig.Response[1].Token.token;
const connect:BunqConnection = new BunqConnection();
const setup:BunqApiSetup=new BunqApiSetup(connect,key,secretConfig.json.secret,installationToken);
const bunqApi:BunqApi=new BunqApi(connect, key,secretConfig.json.secret,setup,
    config.json.bunqSessionFile, config.json.bunqSessionHistoryPath);

// for verification that callback is from bunq server
bunqApi.setPubBunqKeyPem(installationTokenConfig.Response[2].ServerPublicKey.server_public_key);

const paymentsFilename:string="payments.json";

const https_options = {
    key: BunqApiConfig.read(secretConfig.json.notificationKeyFile),
    certificate: BunqApiConfig.read(secretConfig.json.notificationCertFile)
};

const https_server = restify.createServer(https_options);

const setup_server = function(server) {
    function getRespond(req, res) {
        let now:string = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("get callback received: "+now+" "+req);
        // res.send('Your get callback was received!');
    }

    function postRespond(req, res) {
        let now:string = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("post callback received "+now);
        res.send('ok');
        transferPaymentListToWebServer();
    }


    server.use(restify.bodyParser());
    server.post('/callback', postRespond);

    server.get('/callback', getRespond);

};

startCallbackServer();

function startCallbackServer() {
    setup_server(https_server);

    https_server.listen(44444, function() {
        console.log('%s listening on port 44444 at %s', https_server.name, https_server.url);
    });
}

//transferPaymentListToWebServer();

function transferPaymentListToWebServer() {
    requestPaymentsFromBunq().then((payments) => {
        requestAccountBalanceFromBunq().then((balance)=>{
            payments.sum=balance;
            let paymentsString:string = JSON.stringify(payments);
            write(paymentsFilename, paymentsString).then(() => {
                scpToWebServer(paymentsFilename).then(() => {
                    console.log("transfer done.");
                    // process.exit(0);
                }).catch((err) => {
                    console.log("scp error:" + err);
                    // process.exit(-1);
                });
            }).catch((error)=>{
                console.log("write error:"+error);
            });
        }).catch((error) => {
            console.log("bunq reqAccount error"+error);
        });
    }).catch((error)=>{
        console.log("bunq reqPayment error"+error);
    });
}


function requestAccountBalanceFromBunq():Promise<any> {
    return bunqApi.requestMonetaryAccountBank(secretConfig.json.userId, secretConfig.json.accountId).then((response:any)=>{
        let resp:any = JSON.parse(response);
        let balance = resp.Response[0].MonetaryAccountBank.balance.value;
        return Promise.resolve(balance)
    });
}


function requestPaymentsFromBunq():Promise<any> {
    return bunqApi.requestPayments(secretConfig.json.userId, secretConfig.json.accountId).then((response:string)=>{
        // console.log(response);
        let resp:any = JSON.parse(response);
        let accountInfo={
            payments:Payment[resp.Response.length]=new Array<Payment>(),
            sum:"0"
        };
        let i=0;
        for(let r of resp.Response)  {
            accountInfo.payments[i] = {
                value:r.Payment.amount.value,
                iban:r.Payment.counterparty_alias.iban,
                description:r.Payment.description,
                created:r.Payment.created
            };
            i++;
        }

        return Promise.resolve(accountInfo);
    });
}

function scpToWebServer(filename:string):Promise<any> {
    let pathToFile:string = secretConfig.json.webServerSecrets.path+filename;
    let config = JSON.parse(JSON.stringify(secretConfig.json.webServerSecrets));
    config.path=pathToFile;
    return new Promise(function(resolve, reject) {
        client.scp(filename, config, (err) => {err === null ? resolve(filename) : reject(err)});
    });
}

class Payment {
    value:string;
    iban:string;
    description:string;
    created:string;
}

