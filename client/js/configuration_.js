angular.module('app.config', [])

.constant('ENV', {
					name:'development',
					apiEndpoint:'http://srv-pmlab.ad.comune.rimini.it/es',
					apiLogin:'/authenticate',
					apiLogout:'/logout',
					routeAfterLogon:'menu.listProtocolli',
					loginUserName:'',
					loginUserPassword:'',
					AUTH_EVENTS: {
									loginSuccess:'auth-login-success',
									loginFailed:'auth-login-failed',
									logoutSuccess:'auth-logout-success',
									sessionTimeout:'auth-session-timeout',
									notAuthenticated:'auth-not-authenticated',
									notAuthorized:'auth-not-authorized',
									serverError:'server-error'
								  },
					USER_ROLES:  { 
									all:'*',
									admin:'admin',
									editor:'editor',
									guest:'guest'
								}
					})