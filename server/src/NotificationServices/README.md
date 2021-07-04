# Notification Services

MangaUpdates provides a framework to push notifications to third-party services. In fact, this is the ONLY way notifications are pushed out since they are more accurate than our servers ever will be.

## Currently supported services

-   [Ifttt](https://ifttt.com/) (iOS, Android, Web)

## Adding a service

The currently supported list can grow with contributions and source requests.

To make requests:

1. Open an [issue](https://github.com/bdashore3/MangaUpdates/issues) on Github
2. Wait for someone to respond and the issue will be tagged with the `new source` tag

To make contributions:

1. Open an [issue](https://github.com/bdashore3/MangaUpdates/issues) on Github
2. Create a [pull request](https://github.com/bdashore3/MangaUpdates/pulls) which references the issue you created

## Resources for developing a notification service

A service has to fulfill two categories before it can work with MangaUpdates:

-   It must accept POST requests (usually under the `webhooks` documentation)
-   These POST requests must accept an `application/json` body
-   You can use `application/url-encoded`, but JSON will be easier to program

### Creating an init function

An initializer function is required for the setup wizard. This grabs the user's information required for the service to work.

Here's [an example](https://github.com/bdashore3/MangaUpdates/blob/default/src/NotificationHandler/ifttt.ts#L18) of an init function for Ifttt.

### Using Axios to send a POST request

Since [axios](https://www.npmjs.com/package/axios) is our main request handler, we will use it to send POST requests as well.

A sender function takes a user's credentials along with the MangaPacket payload and sends the POST request with these parameters.

Here's some [example code](https://github.com/bdashore3/MangaUpdates/blob/default/src/NotificationHandler/ifttt.ts#L6) on sending a POST request to Ifttt.

### Adding types for your service

Since MangaUpdates is in TypeScript, types are required for understanding various parts of a service. These types are for a user's credentials when creating the configuration JSON file.

Add the service types [here](https://github.com/bdashore3/MangaUpdates/blob/default/types/services.ts).

Provide an optional subtype on the [UserJson type](https://github.com/bdashore3/MangaUpdates/blob/default/types/userJson.ts#L3) which contains your service type

### Adding your service to the main code

The main codebase requires some hooks to link to the service. A new service has to be added in both the setup wizard AND the main updater function.

Setup wizard:

-   Add your service alias (in lowercase) to the [possibleServices array](https://github.com/bdashore3/MangaUpdates/blob/default/src/Setup/index.ts#L19).
-   Use this service alias in the [setupServices function](https://github.com/bdashore3/MangaUpdates/blob/default/src/Setup/index.ts#L110-L135) and add a case/call to your initService function that you previously created.

Updater:

-   Add your service alias from setup in the [handleServices function](https://github.com/bdashore3/MangaUpdates/blob/default/src/index.ts#L108-L123).
-   Add a case/call to your sendService function that you previously created.

## Questions?

Please join the Discord [support server](https://discord.gg/pswt7by) and get the `king-updates` role.
