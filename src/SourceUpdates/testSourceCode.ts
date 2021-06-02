import { fetchMangaNelo } from './MangaNelo';

if (require.main === module) {
    main();
}
// yarn stest
async function main() {
    console.log(await fetchMangaNelo());
}
