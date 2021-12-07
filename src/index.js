import {JSEncrypt} from 'jsencrypt'

const gnApiEndpoint = () => process.env.NODE_ENV === 'development'?
    'https://sandbox.gerencianet.com.br':
    'https://api.gerencianet.com.br'

const getSalt = (payee_code) =>  new Promise((resolve, reject) => {
    fetch( '/gnSalt', {
        mode	:	'no-cors',
        method : 'GET',
        headers : [
            ['account-code', payee_code]
        ]
    }).then( response => response.json())
        .then(response => {
            if(response.data){
                resolve(response.data)
            } else {
                reject(response.error_description)
            }
        }).catch(error => reject(error))
})

const getPublicKey = (payee_code) => new Promise((resolve, reject) => {
    return fetch('/gnApi/v1/pubkey?code=' + payee_code, {
        method : 'GET',
        mode	:	'no-cors'
    }).then( response => response.json())
        .then(response => {
            if(response.data) {
                resolve(response.data)
            }
            else {
                reject(response.error_description)
            }
        }).catch(error =>reject(error))
})

const encryptCard = (publicKey, cardData) => {
    let crypt = new JSEncrypt()
    try {
        crypt.setPublicKey(publicKey)
        return crypt.encrypt(JSON.stringify(cardData))
    } catch (e) {
        return false
    }
}

const oneStepEncryptCard = (payee_code, cardData) =>
    Promise.all([gnGetPublicKey(payee_code), gnGetSalt(payee_code)]).then(([publicKey, salt]) =>
        encryptCard(publicKey,{...cardData, salt})
    )

const saveCardData = (pay_token, cardDataEncrypted) =>  new Promise((resolve, reject) => {
    const data = JSON.stringify({ "data": cardDataEncrypted })
    fetch('/gnApi/v1/card', {
        method	:	'POST',
        body	:	data,
        headers : 	{
            'account-code': pay_token,
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
        .then(response => {
            if(response.data){
                resolve(response.data)
            } else {
                reject(response.error_description)
            }
        }).catch(error =>reject(error))
})

export {getPublicKey, getSalt, oneStepEncryptCard, encryptCard, saveCardData}