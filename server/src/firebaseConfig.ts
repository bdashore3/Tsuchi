import * as firebase from 'firebase-admin';
import serviceAccount from './firebaseCreds.json';

export function configFirebase(): void {
    // eslint-disable-next-line
    const firebaseParams = serviceAccount as any;

    // Initialize firebase admin SDK
    firebase.initializeApp({
        credential: firebase.credential.cert(firebaseParams)
    });
}
