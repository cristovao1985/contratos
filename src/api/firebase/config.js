// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCwe3ScgNVAcyBk8O-1gL7iq5LHb3q1rE4',
  authDomain: 'contratos-66695.firebaseapp.com',
  projectId: 'contratos-66695',
  storageBucket: 'contratos-66695.firebasestorage.app',
  messagingSenderId: '68783104596',
  appId: '1:68783104596:web:0ae738d4c29aef2a5e03c1',
  measurementId: 'G-6M8B3HTRTD',
}

// Initialize Firebase
// Initialize Firebase
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth()

export { auth }
