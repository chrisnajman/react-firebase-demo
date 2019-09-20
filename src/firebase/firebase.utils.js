import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
 // your config here
}

/* Store authenticated user in database */
export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return

    const userRef = firestore.doc(`users/${userAuth.uid}`)

    const snapShot = await userRef.get()

    if(!snapShot.exists) {
        const { displayName, email} = userAuth
        const createdAt = new Date()
    

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch(error) {
            console.log('error creating user', error.message)
        }
    }

    return userRef
}


firebase.initializeApp(config)

export const auth = firebase.auth()

export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()

export const signInWithGoogle = () => auth.signInWithPopup(provider).catch(()=>{})
/*
    .catch(()=>{})
    This is appended to stop console error message when user clicks
    'Sign in with Google' then immediately closes the Google popup
    without signing in to a Google account.

*/
export default firebase