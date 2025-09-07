
'use server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ResumeData, DesignState } from '@/lib/types';
import { defaultResumeData } from '@/lib/types';

// For now, we'll use a hardcoded user ID. In a real app, you'd get this from auth.
const USER_ID = 'default-user'; 

export async function getResumeData(): Promise<ResumeData> {
    try {
        const docRef = doc(db, 'resumes', USER_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Here you might want to add validation with Zod to be safe
            return docSnap.data().resume as ResumeData;
        } else {
            console.log("No such document! Returning default data.");
            return defaultResumeData;
        }
    } catch (error) {
        console.error("Error fetching resume data: ", error);
        return defaultResumeData;
    }
}

export async function saveResumeData(resumeData: ResumeData) {
    try {
        const docRef = doc(db, 'resumes', USER_ID);
        console.log('-------', resumeData, docRef);
        await setDoc(docRef, { resume: resumeData }, { merge: true });
    } catch (error) {
        console.error("Error saving resume data: ", error);
        throw new Error("Could not save resume data.");
    }
}

export async function getDesignState(): Promise<DesignState> {
    const defaultDesign: DesignState = {
        template: 'modern',
        primaryColor: '#3F51B5',
        fontSize: '10',
        fontFamily: 'Inter',
    };
    try {
        const docRef = doc(db, 'resumes', USER_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().design) {
            return docSnap.data().design as DesignState;
        } else {
            return defaultDesign;
        }
    } catch (error) {
        console.error("Error fetching design state: ", error);
        return defaultDesign;
    }
}

export async function saveDesignState(designState: DesignState) {
    try {
        const docRef = doc(db, 'resumes', USER_ID);
        await setDoc(docRef, { design: designState }, { merge: true });
    } catch (error) {
        console.error("Error saving design state: ", error);
        throw new Error("Could not save design state.");
    }
}
