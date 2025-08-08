// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { auth } from './config.js'

export default {
  login: async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          resolve(user)
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message

          reject(errorMessage)
        })
    })
  },
  loggout: () => {
    auth.signOut()
  },
  recoveryPassword: (email) => {
    return new Promise((resolve, reject) => {
      auth
        .sendPasswordResetEmail(email)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  createAccont: (email, password) => {
    return new Promise((resolve, reject) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          user
            .sendEmailVerification()
            .then(() => {
              resolve(user)
            })
            .catch((error) => {
              console.error('Erro ao enviar verificação:', error)
            })
          resolve(user)
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message

          reject(errorMessage)
        })
    })
  },
}
