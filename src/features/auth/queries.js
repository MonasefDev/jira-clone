"use server";

import { createSessionClient } from "../../lib/appwrite";

/**
 * Get the current user from the session.
 *
 * @returns {Promise<object>} The user object
 */
export const getCurrentUser = async () => {
  try {
    // Create a new Appwrite session client
    const { account } = await createSessionClient();

    // Get the current user from the session
    const user = await account.get();

    // Return the user object
    return user;
  } catch (err) {
    // Log any errors that occur
    console.error(err);
  }
};
