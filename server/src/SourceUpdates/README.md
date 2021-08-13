# Sources

Sources are required to fetch updates for manga. Many people read and save their manga library using various manga websites. Manga readers also use these websites to scrape/fetch content to display.

## Currently supported:

-   Manga4life/Mangasee
-   Mangakakalot
-   MangaNelo
-   MangaDex (Has support, but won't go live until frontend works again)
-   FanFox/MangaFox

## Adding a source

The currently supported list can grow with contributions and source requests.

To make requests:

1. Open an [issue](https://github.com/bdashore3/Tsuchi/issues) on Github
2. Wait for someone to respond and the issue will be tagged with the `new source` tag

To make contributions:

1. Open an [issue](https://github.com/bdashore3/Tsuchi/issues) on Github
2. Create a [pull request](https://github.com/bdashore3/Tsuchi/pulls) which references the issue you created
3. Wait for someone to review your request

## Resources for developing a source

If you are familiar with scraping websites using JavaScript or TypeScript, this process should feel familiar.

### Using Axios to get website content

Tsūchi uses [axios](https://www.npmjs.com/package/axios) to fetch a website's contents through a GET request.

-   Example code to fetch a website's content:
-   Here's a [link](https://github.com/bdashore3/Tsuchi/blob/default/src/SourceUpdates/MangaFox.ts#L10) to see the code below in action

```
const baseDomain = "https://mymangasite.com";
const html  =  await axios.get(baseDomain, { timeout:  30000  }).catch((err:  AxiosError)  =>  {
	switch  (err.code)  {
		case  'ECONNABORTED':
			console.log('Error: MangaSource: forcibly timed out');
			break;
		case  'ETIMEDOUT':
			console.log('Error: MangaSource: timed out');
			break;
		default:
			console.log(err);
	}
});
```

### Using CheerioJS to parse html content

Now that you have the webpage content, you need to figure out how updates are displayed on the website itself. Sometimes, updates are sent as a JSON file or updates have to be parsed through the HTML of the site.

If we need the website's HTML to parse updates, we use CheerioJS to interpret and select parts of this content.

Fortunately, the devs of the Paperback manga reader have created a [guide on working with CheerioJS](https://paperback.moe/help/contribution/extension-development/parsing-guide). You only need the `Practical guide to parsing` section.

Here's a [link](https://github.com/bdashore3/Tsuchi/blob/default/src/SourceUpdates/MangaFox.ts#L27-L44) showing how CheerioJS is used to parse MangaFox

### Putting the parsed content into MangaPackets

MangaPackets contain 3 pieces of information

-   The manga title
-   The chapter that's updated
-   The website name (in lowercase)

You also need the time difference from the current time and the timestamp from the website. This is required since we don't want updates that are two hours old in our MangaPacket array.

The returned array must also have a maximum length of 20 updates.

Once all of these conditions are met, the array can be returned from the source function and parsed in the update handler.

Here's a [link](https://github.com/bdashore3/Tsuchi/blob/default/src/SourceUpdates/MangaFox.ts#L36-L71) which details construction of a MangaPacket and evaluating the time elapsed before returning the updates array.

## Questions?

Please join the Discord [support server](https://discord.gg/pswt7by) and get the `king-updates` role.
