# MangaUpdates

An easy and reliable way to get notifications for updated manga.

## Why did we create this?

Getting manga updates in general is a huge pain since manga is spread out on different websites with different update times. The only current way to solve this problem is using a reader app which clusters all of a user's manga in one spot.

However, some readers are reliable and deliver updates on a schedule while others... are not due to limitations by the OS, mainly iOS.

Manga readers tend to fetch background updates from the client side. While this works fine in Android, iOS handles client background processes in small windows and can cause inaccurate or nonexistent notifications.

In comes MangaUpdates. This service runs from a server which sends out push notification requests. Since this is a direct push notification and not one from a client background service, the notifications are accurate.

## Does this depend on a reader?

The short answer, No.

Since MangaUpdates is a server-side service, it is 100% independent from reader apps. We use a special JSON format to check for new updates and provide ways to convert your reader backups into these JSON files.

## Supported Devices

As long as you read manga from a supported source, it doesn't matter what device you use. You can read manga on a reader, websites, or even have a notepad list for tracking.

tldr; MangaUpdates is supported on any computer/mobile device.

## Initial Configuration/setup

Documentation soon.

## How often are notifications sent?

Notifications are sent IF a new update is present. However, this check is preformed every 30 minutes to save resource usage. This number can change on user demand. Notifications can be sent through a phone's push notification service or through a web browser depending on the service you use.

## Planned features

Here are features that are planned for future updates:

-   Easy manual JSON setup/conversion
-   JSON setup based on Anilist (Pushed back until MangaDex goes live)
-   More sources and services (TBD based on user request)

## Contribution

There are many ways users can contribute since each piece of MangaUpdates is dynamic in nature:

-   Adding new manga sources
-   Adding new notification services
-   Feature requests
-   Making JSON configuration easier

In all of these cases, please make a new issue in [Github issues](https://github.com/bdashore3/MangaUpdates/issues). If you have a new source/service you want to add, create an issue along with an optional [pull request](https://github.com/bdashore3/MangaUpdates/pulls) if you can add the new material yourself.

If you don't have a github account, please take a look at [other contact options](#developers-and-permissions) and we'll add your issue for you.

# Developers and Permissions

We try to make comments/commits as detailed as possible, but if you don't understand something, please contact either of the developers down below. The best avenue for help is the support discord

Creators/Developers: Brian Dashore, pandeynmn

Join the support discord here (get the king-updates role to access the channel): [https://discord.gg/pswt7by](https://discord.gg/pswt7by)

Developer Discords: kingbri#6666, nmn#7029

Kingbri's contact page: [https://kingbri.me/socials](https://kingbri.me/socials)
