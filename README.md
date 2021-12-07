# gn-payment-token
  
  API DEV   'https://sandbox.gerencianet.com.br'
  API PROD  'https://api.gerencianet.com.br'
  
devServer: {
		proxy: {
			'^/gnSalt': {
				target: 'https://tokenizer.gerencianet.com.br/salt',
			},
			'^/gnApi': {
				target: 'https://sandbox.gerencianet.com.br'
			}
		}
	}
