import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCaZ9s2PsaAFpmOl7hr7dQTeZErXaCjtno',
  authDomain: 'sorveteria-mec-5a809.firebaseapp.com',
  databaseURL: 'https://sorveteria-mec-5a809-default-rtdb.firebaseio.com',
  projectId: 'sorveteria-mec-5a809',
  storageBucket: 'sorveteria-mec-5a809.firebasestorage.app',
  messagingSenderId: '587120950521',
  appId: '1:587120950521:web:945a9ce042b1805c0fb628',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
