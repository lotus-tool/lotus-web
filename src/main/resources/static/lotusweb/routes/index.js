var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('LotusWeb');
});

router.get('/pokemon', function(req, res, next) {

	const fs = require('fs') //fs é o módulo file-system, para ler arquivos

	processRequest(req, res)

	function processRequest (request, response) {
	 readText(request, response)
	 console.log('requisição terminou')
	}
	function readText (request, response) {

		var obj;
		fs.readFile('teste.json', 'utf8', function (err, data) {
			if (err) {};
			obj = JSON.parse(data);
			console.log(obj);
			console.log(obj["name"]);
		});

		console.log('Lendo o arquivo, aguarde.')

	}

});

router.post('/driveApiDownload', function(req, respost, next) {

	console.log(req.body);

	const fs = require('fs');
	const readline = require('readline');
	const {google} = require('googleapis');

	var pickerApiLoaded = false;
	var developerKey;
	var oAuth2Client;

	// If modifying these scopes, delete token.json.
	/*const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/drive.appdata',
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/drive.metadata',
	'https://www.googleapis.com/auth/drive.photos.readonly',
	'https://www.googleapis.com/auth/drive.readonly',
	'https://www.googleapis.com/auth/drive.scripts'];*/

	const SCOPES = ['https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/drive.file'];

	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	const TOKEN_PATH = 'token.json';

	// Load client secrets from a local file.
	fs.readFile('credentials.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Drive API.
		/*authorize(JSON.parse(content), listFiles);*/
		authorize(JSON.parse(content), DownloadDrive);
	});

	/**
	* Create an OAuth2 client with the given credentials, and then execute the
	* given callback function.
	* @param {Object} credentials The authorization client credentials.
	* @param {function} callback The callback to call with the authorized client.
	*/
	function authorize(credentials, callback) {
		const {client_secret, client_id, redirect_uris} = credentials.installed;
		console.log(client_secret);
		console.log(client_id);
		developerKey = client_secret;
		oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

		// Check if we have previously stored a token.
		fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
		});
	}

	/**
	* Get and store new token after prompting for user authorization, and then
	* execute the given callback with the authorized OAuth2 client.
	* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
	* @param {getEventsCallback} callback The callback for the authorized client.
	*/
	function getAccessToken(oAuth2Client, callback) {

		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});

		console.log('Authorize this app by visiting this url:', authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question('Enter the code from that page here: ', (code) => {
			rl.close();
			oAuth2Client.getToken(code, (err, token) => {
				if (err) return console.error('Error retrieving access token', err);
				oAuth2Client.setCredentials(token);
				// Store the token to disk for later program executions
				fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
					if (err) console.error(err);
					console.log('Token stored to', TOKEN_PATH);
				});
				callback(oAuth2Client);
			});
		});

	}

	function DownloadDrive (auth) {

		try {

			var fileToDownload = 'filesUpdate/' + Math.floor((Math.random() * 1000000) + 1) + '.json';
			
			var fileId = req.body.FileId;
			var dest = fs.createWriteStream(fileToDownload);
			const drive = google.drive({version: 'v3', auth});
			drive.files.get({
				fileId: fileId,
				alt: 'media'
			},{ 
				responseType: 'stream'
			}, function (err, res) {

				res.data.on('end', () => {

					console.log('Done');

					fs.readFile(fileToDownload, function(err,data){
						if (!err) {
							try {
								console.log(data);
								obj = JSON.parse(data);
								console.log(obj);
								console.log(typeof(obj));
								fs.unlinkSync(fileToDownload);
								respost.send(obj);
							} catch(e) {
								console.log(e);
							}
						} else {
							console.log(err);
						}
					});

				}).on('error', err => {
					console.log('Error', err);
				}).pipe(dest);

			})

		} catch(e) {
			console.log(e);
		}

	}

});

router.post('/uploadDriveProject', function(req, respost, next) {

	console.log(req.body.data);

	var json = JSON.stringify(req.body.Data);
	var nameFile = req.body.Data["Name"] + ".json";

	const fs = require('fs');
	const readline = require('readline');
	const {google} = require('googleapis');

	var pickerApiLoaded = false;
	var developerKey;
	var oAuth2Client;

	// If modifying these scopes, delete token.json.
	const SCOPES = ['https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/drive.file'];
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	const TOKEN_PATH = 'token.json';

	// Load client secrets from a local file.
	fs.readFile('credentials.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Drive API.
		/*authorize(JSON.parse(content), listFiles);*/
		authorize(JSON.parse(content), UploadDrive);
	});

	/**
	* Create an OAuth2 client with the given credentials, and then execute the
	* given callback function.
	* @param {Object} credentials The authorization client credentials.
	* @param {function} callback The callback to call with the authorized client.
	*/
	function authorize(credentials, callback) {
		const {client_secret, client_id, redirect_uris} = credentials.installed;
		console.log(client_secret);
		console.log(client_id);
		developerKey = client_secret;
		oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

		// Check if we have previously stored a token.
		fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
		});
	}

	/**
	* Get and store new token after prompting for user authorization, and then
	* execute the given callback with the authorized OAuth2 client.
	* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
	* @param {getEventsCallback} callback The callback for the authorized client.
	*/
	function getAccessToken(oAuth2Client, callback) {

		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});

		console.log('Authorize this app by visiting this url:', authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question('Enter the code from that page here: ', (code) => {
			rl.close();
			oAuth2Client.getToken(code, (err, token) => {
				if (err) return console.error('Error retrieving access token', err);
				oAuth2Client.setCredentials(token);
				// Store the token to disk for later program executions
				fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
					if (err) console.error(err);
					console.log('Token stored to', TOKEN_PATH);
				});
				callback(oAuth2Client);
			});
		});

	}

	function UploadDrive (auth) {

		try {
			
			var fileToUpload = 'filesUpdate/' + Math.floor((Math.random() * 1000000) + 1) + '.json';
			fs.writeFile( fileToUpload, json, (err) => {

				if (err) {

					console.log("Error");

				}else{

					console.log("Ok");

					fs.exists(fileToUpload, function(exists) {

						if (exists) {
							
							var fileMetadata = {
								'name': nameFile,
								parents: [req.body.FolderId]
							};
							
							var media = {
								mimeType: 'application/json',
								body: fs.createReadStream(fileToUpload)
							};

							const drive = google.drive({version: 'v3', auth});
							drive.files.create({
								resource: fileMetadata,
								media: media,
								fields: 'id'
							}, function (err, file) {
								if (err) {
									console.error(err);
								} else {
									console.log('File Id: ', file.id);
									fs.unlinkSync(fileToUpload);
									respost.send({ "Respost" : "Sucess" });
								}
							});

						}

					});

				}

			});

		} catch(e) {
			console.log(e);
		}

	}

});

module.exports = router;