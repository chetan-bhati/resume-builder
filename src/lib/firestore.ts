
'use server';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import type { ResumeData, DesignState } from '@/lib/types';
import { defaultResumeData } from '@/lib/types';

export async function getResumeData(userId: string): Promise<ResumeData> {
    if (!userId) return defaultResumeData;

    try {
        const docRef = doc(db, 'resumes', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().resume) {
            return docSnap.data().resume as ResumeData;
        } else {
            // User exists but has no resume data, save default
            await saveResumeData(userId, defaultResumeData);
            return defaultResumeData;
        }
    } catch (error) {
        console.error("Error fetching resume data: ", error);
        return defaultResumeData;
    }
}

export async function saveResumeData(userId: string, resumeData: ResumeData) {
    if (!userId) throw new Error("User is not authenticated.");
    
    try {
        const docRef = doc(db, 'resumes', userId);
        const cleanedData = JSON.parse(JSON.stringify(resumeData));
        await setDoc(docRef, { resume: cleanedData }, { merge: true });
    } catch (error) {
        console.error("Detailed error while saving resume data:", error);
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        throw new Error(`Could not save resume data. ${message}`);
    }
}

export async function getDesignState(userId: string): Promise<DesignState> {
    const defaultDesign: DesignState = {
        template: 'modern',
        primaryColor: '#3F51B5',
        fontSize: '10',
        fontFamily: 'Inter',
    };
    if (!userId) return defaultDesign;

    try {
        const docRef = doc(db, 'resumes', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().design) {
            return docSnap.data().design as DesignState;
        } else {
             // User exists but has no design data, save default
            await saveDesignState(userId, defaultDesign);
            return defaultDesign;
        }
    } catch (error)
 {
        console.error("Error fetching design state: ", error);
        return defaultDesign;
    }
}

export async function saveDesignState(userId: string, designState: DesignState) {
    if (!userId) throw new Error("User is not authenticated.");

    try {
        const docRef = doc(db, 'resumes', userId);
        const cleanedData = JSON.parse(JSON.stringify(designState));
        await setDoc(docRef, { design: cleanedData }, { merge: true });
    } catch (error) {
        console.error("Error saving design state: ", error);
        throw new Error("Could not save design state.");
    }
}
