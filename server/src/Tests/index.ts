import { testSources } from './fetchSourcesTest';
import { sendTestNotification } from './notificationTest';

export async function dispatchTests(argument: string): Promise<void> {
    console.log();
    console.log('The test flag has been passed. Running your specified test...');

    switch (argument) {
        case 'updates':
            await testSources();
            break;
        case 'notification':
            await sendTestNotification();
            break;
        default:
            console.log(
                'That test isn\'t valid. Please enter either "updates" or "notification" to run the appropriate tests.'
            );
    }

    console.log();
}
