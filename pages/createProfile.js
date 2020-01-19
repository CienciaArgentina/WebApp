import React from 'react'
import Page from '../layouts/main/main'
import { Input } from '../components/Science'
import EditPersonalData from '../components/editProfile/editPersonalData'

export default class CreateProfile extends React.Component {
	state = {
		welcomeMessage: false
	}
	afterSend = () => {
		this.setState(()=>({welcomeMessage:true}))
	}
	render() {
		return (
			<Page contentClass="bg--gray">
				{this.state.welcomeMessage?
					<div id='welcomePageMessage'>
						<h1>Holis</h1>
					</div>
				:
					<div id='createProfile'>
						<div className='__header'>
							<h1 className='mb-2 mt-2'>¡Hola! Sólo un paso más.</h1>
							<p>Completá tus datos básicos para comenzar.</p>
						</div>

						<div className='mt-5'>
							<EditPersonalData afterSend={this.afterSend} ignoreContact={true}/>
						</div>
					</div>
				}
			</Page>
		)
	}
}