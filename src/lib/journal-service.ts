
import { JournalEntry, JournalStyle } from "@/types/journal";

// Mock data storage (replace with actual database in production)
let journalEntries: JournalEntry[] = [];

const defaultStyle: JournalStyle = {
  fontFamily: 'serif',
  backgroundColor: '#ffffff',
  textColor: '#1A1F2C',
};

// Get all journal entries for a user
export const getUserEntries = (userId: string): Promise<JournalEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userEntries = journalEntries.filter(entry => entry.userId === userId);
      resolve(userEntries);
    }, 300);
  });
};

// Get a single journal entry
export const getJournalEntry = (id: string, userId: string): Promise<JournalEntry | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry = journalEntries.find(e => e.id === id && e.userId === userId);
      resolve(entry || null);
    }, 200);
  });
};

// Get a published entry by publish ID
export const getPublishedEntry = (publishId: string): Promise<JournalEntry | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry = journalEntries.find(e => e.publishId === publishId && e.isPublished);
      resolve(entry || null);
    }, 200);
  });
};

// Create a new journal entry
export const createJournalEntry = (entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEntry: JournalEntry = {
        ...entry,
        id: `entry_${Date.now()}`,
        style: entry.style || defaultStyle,
      };
      journalEntries.push(newEntry);
      resolve(newEntry);
    }, 300);
  });
};

// Update an existing journal entry
export const updateJournalEntry = (id: string, userId: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = journalEntries.findIndex(e => e.id === id && e.userId === userId);
      if (index === -1) {
        resolve(null);
        return;
      }
      
      journalEntries[index] = {
        ...journalEntries[index],
        ...updates,
      };
      
      resolve(journalEntries[index]);
    }, 300);
  });
};

// Delete a journal entry
export const deleteJournalEntry = (id: string, userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = journalEntries.length;
      journalEntries = journalEntries.filter(e => !(e.id === id && e.userId === userId));
      resolve(journalEntries.length !== initialLength);
    }, 300);
  });
};

// Publish a journal entry
export const publishJournalEntry = (id: string, userId: string): Promise<JournalEntry | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = journalEntries.findIndex(e => e.id === id && e.userId === userId);
      if (index === -1) {
        resolve(null);
        return;
      }
      
      journalEntries[index] = {
        ...journalEntries[index],
        isPublished: true,
        publishId: `pub_${Date.now()}`,
      };
      
      resolve(journalEntries[index]);
    }, 300);
  });
};

// Unpublish a journal entry
export const unpublishJournalEntry = (id: string, userId: string): Promise<JournalEntry | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = journalEntries.findIndex(e => e.id === id && e.userId === userId);
      if (index === -1) {
        resolve(null);
        return;
      }
      
      journalEntries[index] = {
        ...journalEntries[index],
        isPublished: false,
        publishId: undefined,
      };
      
      resolve(journalEntries[index]);
    }, 300);
  });
};
