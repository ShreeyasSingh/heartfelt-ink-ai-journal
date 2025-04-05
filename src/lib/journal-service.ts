
import { JournalEntry, JournalStyle } from "@/types/journal";

// Mock data storage (replace with actual database in production)
let journalEntries: JournalEntry[] = [];
let userConnections: { userId: string, followingId: string }[] = [];

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

// New social features

// Follow a user
export const followUser = (userId: string, followingId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if already following
      const alreadyFollowing = userConnections.some(
        conn => conn.userId === userId && conn.followingId === followingId
      );
      
      if (alreadyFollowing) {
        resolve(true);
        return;
      }
      
      userConnections.push({ userId, followingId });
      resolve(true);
    }, 300);
  });
};

// Unfollow a user
export const unfollowUser = (userId: string, followingId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = userConnections.length;
      userConnections = userConnections.filter(
        conn => !(conn.userId === userId && conn.followingId === followingId)
      );
      resolve(userConnections.length !== initialLength);
    }, 300);
  });
};

// Get all users that a user is following
export const getFollowing = (userId: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const following = userConnections
        .filter(conn => conn.userId === userId)
        .map(conn => conn.followingId);
      resolve(following);
    }, 300);
  });
};

// Get all users that follow a user
export const getFollowers = (userId: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const followers = userConnections
        .filter(conn => conn.followingId === userId)
        .map(conn => conn.userId);
      resolve(followers);
    }, 300);
  });
};

// Get all published entries from users that a user is following
export const getFeedEntries = (userId: string): Promise<JournalEntry[]> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const following = await getFollowing(userId);
      
      // Get published entries from followed users
      const feedEntries = journalEntries.filter(
        entry => following.includes(entry.userId) && entry.isPublished
      );
      
      // Sort by date, newest first
      feedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      resolve(feedEntries);
    }, 500);
  });
};

// Get all published entries (discover feed)
export const getDiscoverEntries = (): Promise<JournalEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const publicEntries = journalEntries.filter(entry => entry.isPublished);
      
      // Sort by date, newest first
      publicEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      resolve(publicEntries);
    }, 300);
  });
};

// Search for users
export const searchUsers = (query: string): Promise<any[]> => {
  // This is a mock function. In a real app, you would search users in a database
  return Promise.resolve([]);
};
