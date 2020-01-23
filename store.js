import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import pageReducer from './src/reducers/page'
import userReducer from './src/reducers/user'

// const exampleInitialState = {
// 	isLogged: false,
// 	userData: false,
// }

// // REDUCERS
// export const reducer = (state = exampleInitialState, action) => {
// 	switch (action.type) {
// 		// case 'RESET':
// 		//   return Object.assign({}, state, {
// 		//     count: exampleInitialState.count
// 		//   })
// 		case 'SET_LOGGED':
// 			return {...state,
// 				isLogged: action.isLogged
// 		};
// 		case 'SET_USER_DATA':
// 			return {
// 				...state,
// 				userData: action.userData
// 			}
// 		default:
// 			return state
// 	}
// }



// export function initializeStore (initialState = exampleInitialState) {
// 	return createStore(
// 		reducer,
// 		initialState,
// 		composeWithDevTools(applyMiddleware(thunkMiddleware))
// 	)
// }

import createSagaMiddleware from 'redux-saga'
import rootSaga from './src/reducers/root-saga'

function configureStore(preloadedState, {isServer, req = null}) {
	const sagaMiddleware = createSagaMiddleware()
	const store = createStore(
		combineReducers({
			user: userReducer,
			page: pageReducer
		}),
		preloadedState,
    	composeWithDevTools(applyMiddleware(sagaMiddleware))
	)
	if (req || !isServer) {
		store.sagaTask = sagaMiddleware.run(rootSaga)
	}
	
	return store
}

export default configureStore

const before_configureStore = () => {
	const store = createStore(
		combineReducers({
			user: userReducer,
			page: pageReducer
		}),
		composeWithDevTools(applyMiddleware(thunkMiddleware))
	)
	return store
}