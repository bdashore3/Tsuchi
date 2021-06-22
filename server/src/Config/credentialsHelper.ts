import { promises as fs } from 'fs';
import { ProjectCredentials } from '../types';

export async function handleCredentials(path: string): Promise<ProjectCredentials> {
    const rawCreds = await fs.readFile(path, 'utf8');

    const creds: ProjectCredentials = JSON.parse(rawCreds);

    return creds;
}
