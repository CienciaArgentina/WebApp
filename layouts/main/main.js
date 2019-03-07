import Header from './components/Header';
import Footer from './components/Footer';
import SiteHead from './components/SiteHead'
import { Component } from 'react';
import Document, { Main, NextScript } from 'next/document';
import NProgress from 'nprogress'
import Router from 'next/router'

Router.events.on('routeChangeStart', (url) => {
	console.log(`Loading: ${url}`)
	NProgress.start()
  })
  Router.events.on('routeChangeComplete', () => NProgress.done())
  Router.events.on('routeChangeError', () => NProgress.done())

NProgress.configure({
	showSpinner: false,
	minimum: 0.2
});

export default class Page extends Component {
	state = {
		mobile_menu_display: false,
		mobile_menu_show: false,
		noscroll: false,
		canInstallApp: false,
		installApp: false
	}
	showMenu = () => {
		this.setState( () => ({mobile_menu_display: true, noscroll: true}) );
		setTimeout( () => {
			this.setState( () => ({mobile_menu_show: true}) );
		}, 10);
		document.querySelector('body').classList.add('noScroll')
	}
	hideMenu = () => {
		this.setState( () => ({mobile_menu_show: false, noscroll: false}) );
		setTimeout( () => {
			this.setState( () => ({mobile_menu_display: false}) );
		}, 300);
		document.querySelector('body').classList.remove('noScroll')
	}
	handleInstallApp = () => {
		let deferredPrompt = this.state.installApp;
		deferredPrompt.prompt();

		// Follow what the user has done with the prompt.
		deferredPrompt.userChoice.then((choiceResult) => {
		  console.log(choiceResult.outcome);
		  if(choiceResult.outcome == 'dismissed') {
			console.log('User cancelled home screen install');
		  }
		  else {
			console.log('User added to home screen');
			this.setState(()=>({
				canInstallApp: false,
				installApp: false
			}))
		  }
		});
	}
	componentDidMount() {
		// this.showMenu();
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', function() {
				navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
					// Registration was successful
					console.log('ServiceWorker registration successful with scope: ', registration.scope);
				}, function(err) {
					// registration failed :(
					console.log('ServiceWorker registration failed: ', err);
				});
			});
		}
		window.addEventListener('beforeinstallprompt', (e) => {
		  console.log('beforeinstallprompt Event fired');
		  e.preventDefault();
		  // Stash the event so it can be triggered later.
		  this.setState(()=>({
			canInstallApp: true,
			installApp: e
		  }))
		  return false;
		});
	}
	render() {
		return (
			<div id="app" {...this.props.pageprops}>
				<SiteHead
					title = {this.props.customMeta ? this.props.customMeta.title : false}
					description = {this.props.customMeta ? this.props.customMeta.description : false}
					ogimage = {this.props.customMeta ? this.props.customMeta.ogimage : false}
				/>
				<Header
					canInstallApp={this.state.canInstallApp}
					installApp={this.handleInstallApp}
					showMenu={this.showMenu}
					hideMenu={this.hideMenu}
					mobile_menu_display={this.state.mobile_menu_display}
					mobile_menu_show={this.state.mobile_menu_show}
				/>
				<div id="content" className={this.props.contentClass?this.props.contentClass:''}>
					{this.props.children}
				</div>
				<Footer />
			</div>
		);
	}
}