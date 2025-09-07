
import { app } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
