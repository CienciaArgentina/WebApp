const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { parse } = require('url')
const { join } = require('path')


app
.prepare()
.then( () =>{
	const server = express();
	server.use(cookieParser());

	// server.get('/logguinTEST', (req,res) => {
	// 	console.log(req.cookies);
	// 	// res.clearCookie('cookieName'); // DELETE COOKIE
	// 	res.render(req, res, path)
	// })
	server.get('/serviceworker.js', (req, res) => {
		const parsedUrl = parse(req.url, true)
		const path = join(__dirname, 'static', '/serviceworker.js')
		app.serveStatic(req, res, path);
	});
	server.get('/manifest.json', (req, res) => {
		const parsedUrl = parse(req.url, true)
		const path = join(__dirname, 'static', '/manifest.json')
		app.serveStatic(req, res, path);
	});
	server.get('/institute/:id', (req, res) => {
		const actualPage = '/institute'
		const queryParams = { id: req.params.id } 
		app.render(req, res, actualPage, queryParams)
	})
	server.get('/laboratory/:id/:view/:projectId', (req, res) => {
		const actualPage = '/laboratory';
		if(req.params.view==='project'){
			const queryParams = {
				id: req.params.id,
				view: 'project',
				projectId: req.params.projectId
			}
			app.render(req, res, actualPage, queryParams)
		} else {
			app.render(req, res, '404');
		}
	});
	server.get('/laboratory/:id/:view', (req, res) => {
		const actualPage = '/laboratory'
		const queryParams = {
			id: req.params.id,
			view: req.params.view
		} 
		app.render(req, res, actualPage, queryParams)
	});
	server.get('/laboratory/:id', (req, res) => {
		const actualPage = '/laboratory'
		const queryParams = { id: req.params.id } 
		app.render(req, res, actualPage, queryParams)
	});
	server.get(['/editProfile/:section', '/editProfile/', '/editProfile'],(req,res) => {
		const actualPage = '/editProfile'
		const queryParams = { section: req.params.section } 
		app.render(req, res, actualPage, queryParams)
	})
	server.get('*', (req, res) => {
		return handle(req, res);
	});
	server.listen(PORT, (err)=>{
		if (err) throw err
		console.log(`> Ready on http://localhost:${PORT}`)
	})
})
.catch( ex => {
	console.error(ex.stack);
	process.exit(1);
})
