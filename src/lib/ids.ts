import { nanoid } from 'nanoid';

/**
 * Generate a unique ID for nodes and edges
 */
export const generateId = (): string => nanoid();